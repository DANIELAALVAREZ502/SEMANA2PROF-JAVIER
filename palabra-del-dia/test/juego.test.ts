import { describe, expect, it } from 'vitest'
import {
  comprobarIntento,
  crearJuego,
  obtenerIntentosRestantes,
  reiniciarJuego,
} from '../src/juego'

describe('reglas de la partida', () => {
  it('debería armar el estado inicial con una palabra secreta y sin intentos', () => {
    const juego = crearJuego('inicio', ['perro'])

    expect(juego).toEqual({
      palabraSecreta: 'PERRO',
      intentos: [],
      estado: 'jugando',
    })
    expect(obtenerIntentosRestantes(juego)).toBe(6)
  })

  it('debería elegir la misma palabra con la misma semilla y permitir resultados distintos con otras semillas', () => {
    const palabras = ['perro', 'gatos', 'nubes', 'casas', 'libro']
    const primera = crearJuego('misma-semilla', palabras)
    const repetida = crearJuego('misma-semilla', palabras)
    const palabrasElegidas = new Set(
      Array.from({ length: 100 }, (_, indice) =>
        crearJuego(`semilla-${indice}`, palabras).palabraSecreta,
      ),
    )

    expect(primera.palabraSecreta).toBe(repetida.palabraSecreta)
    expect(palabrasElegidas.size).toBeGreaterThan(1)
  })

  it('debería comprobar una palabra válida y generar sus pistas', () => {
    const juego = crearJuego(1, ['perro'])

    expect(comprobarIntento(juego, 'gatos')).toBe(true)
    expect(juego.intentos).toEqual([
      {
        palabra: 'GATOS',
        pistas: ['gris', 'gris', 'gris', 'amarillo', 'gris'],
      },
    ])
    expect(juego.estado).toBe('jugando')
  })

  it('no debería comprobar una palabra con una cantidad incorrecta de letras', () => {
    const juego = crearJuego(1, ['perro'])

    expect(comprobarIntento(juego, 'sol')).toBe(false)
    expect(juego.intentos).toHaveLength(0)
    expect(juego.estado).toBe('jugando')
  })

  it('no debería permitir otro intento después de terminar la partida', () => {
    const juego = crearJuego(1, ['perro'])

    expect(comprobarIntento(juego, 'perro')).toBe(true)
    expect(comprobarIntento(juego, 'gatos')).toBe(false)
    expect(juego.intentos).toHaveLength(1)
  })

  it('debería ganar al descubrir la palabra secreta', () => {
    const juego = crearJuego(1, ['perro'])

    expect(comprobarIntento(juego, 'perro')).toBe(true)
    expect(juego.estado).toBe('ganada')
    expect(juego.intentos[0].pistas).toEqual([
      'verde',
      'verde',
      'verde',
      'verde',
      'verde',
    ])
  })

  it('debería perder después de seis intentos sin descubrir la palabra', () => {
    const juego = crearJuego(1, ['perro'])

    for (const intento of ['gatos', 'nubes', 'casas', 'libro', 'verde', 'pluma']) {
      expect(comprobarIntento(juego, intento)).toBe(true)
    }

    expect(juego.estado).toBe('perdida')
    expect(juego.intentos).toHaveLength(6)
    expect(obtenerIntentosRestantes(juego)).toBe(0)
    expect(comprobarIntento(juego, 'perro')).toBe(false)
  })

  it('debería reiniciar el estado para comenzar una nueva partida', () => {
    const juego = crearJuego(1, ['perro'])
    comprobarIntento(juego, 'gatos')
    comprobarIntento(juego, 'perro')

    expect(reiniciarJuego(juego, 2, ['nubes'])).toBe(true)
    expect(juego).toEqual({
      palabraSecreta: 'NUBES',
      intentos: [],
      estado: 'jugando',
    })
    expect(obtenerIntentosRestantes(juego)).toBe(6)
  })

  it('debería permitir completar una partida hasta alcanzar el final bueno', () => {
    const juego = crearJuego('partida-completa', ['perro'])

    for (const intento of ['gatos', 'nubes', 'casas', 'libro', 'verde']) {
      expect(comprobarIntento(juego, intento)).toBe(true)
      expect(juego.estado).toBe('jugando')
    }

    expect(comprobarIntento(juego, juego.palabraSecreta)).toBe(true)
    expect(juego.estado).toBe('ganada')
    expect(juego.intentos).toHaveLength(6)
    expect(obtenerIntentosRestantes(juego)).toBe(0)
  })
})
