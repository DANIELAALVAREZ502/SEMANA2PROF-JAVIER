export const CONFIG = Object.freeze({
  longitudPalabra: 5, // Unidad: letras por palabra.
  intentosMaximos: 6, // Unidad: intentos por partida.
  moduloAzar: 0x1_0000_0000, // Unidad: estados posibles de 32 bits.
  multiplicadorAzar: 1_664_525, // Unidad: constante adimensional del generador.
  incrementoAzar: 1_013_904_223, // Unidad: constante adimensional del generador.
  hashInicial: 2_166_136_261, // Unidad: valor inicial adimensional del hash.
  multiplicadorHash: 16_777_619, // Unidad: constante adimensional del hash.
})

export type PistaLetra = 'verde' | 'amarillo' | 'gris'

export interface ResultadoIntento {
  palabra: string
  pistas: PistaLetra[]
}

export type EstadoPartida = 'jugando' | 'ganada' | 'perdida'

export interface EstadoJuego {
  palabraSecreta: string
  intentos: ResultadoIntento[]
  estado: EstadoPartida
}

export function crearGeneradorAzar(semilla: string | number): () => number {
  let estado: number

  if (typeof semilla === 'number') {
    if (!Number.isSafeInteger(semilla)) {
      throw new RangeError('La semilla numérica debe ser un entero seguro.')
    }
    estado = semilla >>> 0
  } else {
    estado = CONFIG.hashInicial
    for (const caracter of semilla) {
      estado = Math.imul(estado ^ caracter.codePointAt(0)!, CONFIG.multiplicadorHash) >>> 0
    }
  }

  return () => {
    estado = (Math.imul(estado, CONFIG.multiplicadorAzar) + CONFIG.incrementoAzar) >>> 0
    return estado / CONFIG.moduloAzar
  }
}

export function crearJuego(semilla: string | number, palabras: readonly string[]): EstadoJuego {
  const lista = validarListaPalabras(palabras)
  const generador = crearGeneradorAzar(semilla)
  const indice = Math.floor(generador() * lista.length)

  return {
    palabraSecreta: lista[indice],
    intentos: [],
    estado: 'jugando',
  }
}

export function comprobarIntento(estado: EstadoJuego, palabra: string): boolean {
  if (estado.estado !== 'jugando' || estado.intentos.length >= CONFIG.intentosMaximos) {
    return false
  }

  const intento = normalizarPalabra(palabra)
  const secreta = normalizarPalabra(estado.palabraSecreta)
  if (intento === null || secreta === null) {
    return false
  }

  const letrasIntento = Array.from(intento)
  const letrasSecretas = Array.from(secreta)
  const pistas: PistaLetra[] = Array.from({ length: CONFIG.longitudPalabra }, () => 'gris')
  const letrasRestantes = new Map<string, number>()

  for (let indice = 0; indice < CONFIG.longitudPalabra; indice += 1) {
    if (letrasIntento[indice] === letrasSecretas[indice]) {
      pistas[indice] = 'verde'
    } else {
      const letra = letrasSecretas[indice]
      letrasRestantes.set(letra, (letrasRestantes.get(letra) ?? 0) + 1)
    }
  }

  for (let indice = 0; indice < CONFIG.longitudPalabra; indice += 1) {
    if (pistas[indice] === 'verde') {
      continue
    }

    const letra = letrasIntento[indice]
    const cantidadRestante = letrasRestantes.get(letra) ?? 0
    if (cantidadRestante > 0) {
      pistas[indice] = 'amarillo'
      letrasRestantes.set(letra, cantidadRestante - 1)
    }
  }

  estado.intentos.push({ palabra: intento, pistas })
  if (intento === secreta) {
    estado.estado = 'ganada'
  } else if (estado.intentos.length === CONFIG.intentosMaximos) {
    estado.estado = 'perdida'
  }

  return true
}

export function reiniciarJuego(
  estado: EstadoJuego,
  semilla: string | number,
  palabras: readonly string[],
): boolean {
  let nuevoJuego: EstadoJuego
  try {
    nuevoJuego = crearJuego(semilla, palabras)
  } catch (error) {
    if (error instanceof RangeError || error instanceof TypeError) {
      return false
    }
    throw error
  }

  estado.palabraSecreta = nuevoJuego.palabraSecreta
  estado.intentos = nuevoJuego.intentos
  estado.estado = nuevoJuego.estado
  return true
}

export function obtenerIntentosRestantes(estado: EstadoJuego): number {
  return Math.max(0, CONFIG.intentosMaximos - estado.intentos.length)
}

function validarListaPalabras(palabras: readonly string[]): string[] {
  if (palabras.length === 0) {
    throw new RangeError('La lista de palabras debe contener al menos una palabra.')
  }

  const lista = palabras.map((palabra) => {
    const normalizada = normalizarPalabra(palabra)
    if (normalizada === null) {
      throw new TypeError('Cada palabra secreta debe tener cinco letras.')
    }
    return normalizada
  })

  return Array.from(new Set(lista))
}

function normalizarPalabra(palabra: string): string | null {
  const normalizada = palabra.trim().normalize('NFC').toLocaleUpperCase('es')
  const letras = Array.from(normalizada)

  if (
    letras.length !== CONFIG.longitudPalabra ||
    !letras.every((letra) => /^\p{L}$/u.test(letra))
  ) {
    return null
  }

  return normalizada
}
