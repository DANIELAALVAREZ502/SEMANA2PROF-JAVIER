import './estilo.css'
import {
  CONFIG,
  comprobarIntento,
  crearJuego,
  obtenerIntentosRestantes,
  reiniciarJuego,
  type EstadoJuego,
  type PistaLetra,
} from './juego'

const PALABRAS = [
  'CASAS',
  'PERRO',
  'GATOS',
  'NUBES',
  'LIBRO',
  'PLUMA',
  'VERDE',
  'CAMPO',
  'FRUTA',
  'SILLA',
  'ARBOL',
  'NIEVE',
  'LAPIZ',
  'DULCE',
  'BARCO',
  'PATIO',
  'SELVA',
  'QUESO',
  'RADIO',
  'JOVEN',
]

function obtenerApp(): HTMLDivElement {
  const elemento = document.querySelector<HTMLDivElement>('#app')
  if (elemento === null) {
    throw new Error('No se encontró el elemento principal de la aplicación.')
  }
  return elemento
}

const app = obtenerApp()
let juego: EstadoJuego | null = null
let numeroPartida = 0
let mensaje = ''

function obtenerSemilla(): string {
  numeroPartida += 1
  return `${new Date().toISOString().slice(0, 10)}-${numeroPartida}`
}

function crearTablero(): string {
  const filas = Array.from({ length: CONFIG.intentosMaximos }, (_, indiceFila) => {
    const intento = juego?.intentos[indiceFila]

    const casillas = Array.from({ length: CONFIG.longitudPalabra }, (_, indiceLetra) => {
      const letra = intento?.palabra[indiceLetra] ?? ''
      const pista = intento?.pistas[indiceLetra]
      const etiqueta = pista === undefined ? 'Sin pista' : etiquetaPista(pista)
      const clase = pista === undefined ? '' : ` pista-${pista}`
      return `<span class="casilla${clase}" aria-label="${letra || 'Vacía'}: ${etiqueta}">${letra}</span>`
    }).join('')

    return `<div class="fila" aria-label="Intento ${indiceFila + 1}">${casillas}</div>`
  }).join('')

  return `<div class="tablero" aria-label="Tablero de intentos">${filas}</div>`
}

function etiquetaPista(pista: PistaLetra): string {
  switch (pista) {
    case 'verde':
      return 'Correcta y en posición correcta'
    case 'amarillo':
      return 'Correcta en otra posición'
    case 'gris':
      return 'No pertenece a la palabra'
  }
}

function renderizar(): void {
  if (juego === null) {
    app.innerHTML = `
      <main class="contenedor pantalla-nueva">
        <p class="marca">PALABRA DEL DÍA</p>
        <h1>¿Cuál es la palabra?</h1>
        <p class="introduccion">Descubrí la palabra de cinco letras. Tenés seis intentos.</p>
        <button class="boton boton-principal" id="comenzar" type="button">Comenzar partida</button>
      </main>
    `
    app.querySelector<HTMLButtonElement>('#comenzar')?.addEventListener('click', () => {
      juego = crearJuego(obtenerSemilla(), PALABRAS)
      mensaje = ''
      renderizar()
    })
    return
  }

  if (juego.estado === 'jugando') {
    app.innerHTML = `
      <main class="contenedor pantalla-juego">
        <header class="encabezado">
          <p class="marca">PALABRA DEL DÍA</p>
          <h1>Descubrí la palabra</h1>
          <p class="resumen">Intentos utilizados: <strong>${juego.intentos.length} de ${CONFIG.intentosMaximos}</strong></p>
          <p class="resumen">Intentos restantes: <strong>${obtenerIntentosRestantes(juego)}</strong></p>
        </header>
        ${crearTablero()}
        <form id="formulario-intento" class="formulario">
          <label for="entrada-palabra">Escribí una palabra de cinco letras</label>
          <div class="controles">
            <input id="entrada-palabra" name="palabra" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="mensaje-juego" />
            <button class="boton boton-principal" type="submit">Comprobar</button>
          </div>
          <p class="mensaje" id="mensaje-juego" role="status" aria-live="polite">${mensaje}</p>
        </form>
        <p class="leyenda"><span class="muestra pista-verde">Verde</span> posición correcta <span class="muestra pista-amarillo">Amarillo</span> está en otra posición <span class="muestra pista-gris">Gris</span> no pertenece</p>
      </main>
    `

    app.querySelector<HTMLFormElement>('#formulario-intento')?.addEventListener('submit', (evento) => {
      evento.preventDefault()
      const formulario = evento.currentTarget
      if (!(formulario instanceof HTMLFormElement)) {
        throw new Error('No se pudo leer el formulario del intento.')
      }

      const datos = new FormData(formulario)
      const palabra = datos.get('palabra')
      if (typeof palabra !== 'string') {
        throw new Error('No se pudo leer la palabra ingresada.')
      }

      if (comprobarIntento(juego!, palabra)) {
        mensaje = ''
      } else {
        mensaje = 'No se pudo comprobar el intento.'
      }
      renderizar()
      const entrada = app.querySelector<HTMLInputElement>('#entrada-palabra')
      entrada?.focus({ preventScroll: true })
      entrada?.scrollIntoView({ block: 'nearest' })
    })
    return
  }

  const gano = juego.estado === 'ganada'
  app.innerHTML = `
    <main class="contenedor pantalla-final">
      <p class="marca">PALABRA DEL DÍA</p>
      <h1>${gano ? '¡Ganaste!' : 'Fin de la partida'}</h1>
      <p class="resultado">${gano ? 'Descubriste la palabra.' : 'Se terminaron los intentos.'}</p>
      <p class="palabra-final">La palabra era <strong>${juego.palabraSecreta}</strong></p>
      ${crearTablero()}
      <button class="boton boton-principal" id="reiniciar" type="button">Jugar otra vez</button>
    </main>
  `
  app.querySelector<HTMLButtonElement>('#reiniciar')?.addEventListener('click', () => {
    if (!reiniciarJuego(juego!, obtenerSemilla(), PALABRAS)) {
      throw new Error('No se pudo iniciar una nueva partida.')
    }
    mensaje = ''
    renderizar()
  })
}

renderizar()
