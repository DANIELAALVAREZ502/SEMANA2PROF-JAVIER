PROMPTS DEL PROYECTO PALABRAS DEL DIA

P1 — ARRANQUE · LAS REGLAS

Prompt enviado:
Creá el archivo src/juego.ts con las reglas del juego que describe la ficha de abajo.

REGLAS TÉCNICAS, obligatorias:
* TypeScript estricto. Exportá los tipos EstadoJuego y ResultadoIntento.
* Este archivo NO puede tocar la pantalla: nada de document, window, alert ni console.log. Solo datos y funciones sobre el estado.
* Todos los números del juego deben estar juntos en un objeto CONFIG arriba del archivo, cada uno con un comentario que indique su unidad.
* Usá un generador de azar con semilla, para que la misma semilla produzca siempre la misma palabra. Exportalo.
* Las funciones que cambian el estado devuelven true si la acción fue válida y false si no se pudo hacer.
* Código y comentarios en español.

REGLAS DE TRABAJO:
* Hacé exactamente lo que dice la ficha. Nada más.
* Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
* Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha no decía nada.

FICHA:
NOMBRE DEL PROYECTO: Palabra del día.
EN UNA FRASE: Es un juego donde intento descubrir una palabra de cinco letras en un máximo de seis intentos.
PARA QUIÉN ES: Para estudiantes y cualquier persona que quiera jugar una partida rápida de palabras desde el celular o computadora.
QUÉ LOGRA: El jugador debe descubrir la palabra secreta antes de quedarse sin intentos.
LOS TRES VERBOS:
1. ESCRIBIR: introducir una palabra de cinco letras.
2. COMPROBAR: revisar el intento y mostrar pistas.
3. REINICIAR: comenzar una nueva partida.

TERMINA BIEN SI: 
El jugador descubre correctamente la palabra secreta antes de utilizar los seis intentos.
TERMINA MAL SI: 
El jugador utiliza los seis intentos sin descubrir la palabra.
QUÉ SE VE EN PANTALLA: La cantidad de intentos utilizados, los intentos anteriores, las letras y sus pistas de color, la cantidad de intentos restantes y un mensaje indicando si ganó o perdió.

CONTROLES:
Con el teclado: escribir las letras y presionar Enter para comprobar el intento.
Con el dedo: usar el teclado del dispositivo para escribir y un botón para comprobar el intento. También habrá un botón para reiniciar.

COLORES:
Verde: letra correcta y en la posición correcta.
Amarillo: letra correcta pero en posición incorrecta.
Gris: letra que no pertenece a la palabra.
Fondo oscuro: zona general de la aplicación.

CRITERIO DE ACEPTACIÓN: 
Abro la página, escribo una palabra de cinco letras, la compruebo y veo las pistas de colores. Puedo realizar hasta seis intentos. Si descubro la palabra gano y si utilizo los seis intentos sin descubrirla pierdo. Puedo reiniciar la partida y comenzar nuevamente. No aparecen errores en la consola y funciona en un celular.

LO QUE NO VA: 
Sin inicio de sesión. Sin niveles. Sin sonido. Sin imágenes externas. Sin animaciones complicadas. Sin guardar partidas. Sin conexión a internet. Sin librerías externas para el juego.

Qué hizo el agente:
Creó la lógica principal del juego en `src/juego.ts`, separando las reglas de la interfaz.

P2 — PRUEBAS

Prompt enviado:
Escribí pruebas con Vitest para src/juego.ts, en test/juego.test.ts.

Tienen que cubrir, como mínimo:
1. Que el estado inicial se arme correctamente.
2. Que la misma semilla produzca siempre la misma palabra y que semillas distintas puedan producir palabras distintas.
3. Que una palabra válida de cinco letras pueda comprobarse correctamente.
4. Que una palabra con una cantidad incorrecta de letras no pueda comprobarse.
5. Que no se pueda realizar un intento después de terminar la partida.
6. Que se pueda ganar al descubrir la palabra.
7. Que se pierda después de seis intentos sin descubrir la palabra.
8. Que el estado se reinicie correctamente al comenzar una nueva partida.
9. Que una prueba recorra una partida completa y compruebe que se puede llegar al final bueno.

Los nombres de las pruebas deben estar en español y en forma de frase: lo que debería pasar.
No modifiques src/juego.ts.
Al terminar corré npm test y mostrame el resultado.

Qué hizo el agente:
Creó las pruebas automáticas con Vitest y comprobó las principales reglas del juego.

P3 — PANTALLA

Prompt enviado:
Creá src/main.ts y src/estilo.css para mostrar el juego Palabra del día en pantalla.

REGLAS
* main.ts NO decide nada: solo llama a las funciones de juego.ts y dibuja el resultado.
* Si tenés que escribir una regla del juego acá, está en el lugar equivocado: decímelo en lugar de hacerlo.
* Tres estados visibles: partida nueva, juego en curso y pantalla final.
* Tiene que funcionar con el dedo en un celular y con el mouse.
* Contraste alto y texto nunca menor a 16 píxeles.
* Los colores deben respetar mi ficha.
* Sin imágenes y sin librerías externas.
* Importá el CSS desde main.ts con:
import './estilo.css'

Ajustá también index.html: 
tiene que tener un div con id="app" y cargar src/main.ts como módulo.
Al terminar confirmame que no hay errores en la consola.

Qué hizo el agente:
Creó la interfaz visual del juego y conectó la pantalla con las funciones de `juego.ts`.

P4 — MÓVIL

Prompt enviado:
Hacé que este juego funcione bien en un celular:
1. Todo lo que se toca tiene que medir al menos 44 píxeles de alto y de ancho.
2. Nada se sale de la pantalla a lo ancho: cero desplazamiento horizontal.
3. El texto nunca baja de 16 píxeles.
4. Funciona con el dedo y también con teclado.
5. Agregá la etiqueta viewport en index.html si falta.
6. El teclado virtual del celular no debe romper el diseño.

No cambies las reglas ni la dificultad del juego.
Decime qué ajustaste.

Qué hizo el agente:
Adaptó la interfaz para pantallas pequeñas y agregó controles adecuados para utilizar el juego con el dedo y el teclado.

P5 — REVISIÓN

Prompt enviado:
Revisá todo el proyecto buscando estos seis problemas, y decime cuáles tiene y en qué línea está cada uno:

1. Lógica del juego metida dentro de main.ts.
2. Números sueltos fuera del objeto CONFIG.
3. Un final bueno al que no se pueda llegar con los números reales.
4. Estado que no se reinicia bien al empezar de nuevo.
5. Variables o funciones que quedaron sin uso.
6. Alguna regla de mi ficha que las pruebas no cubran.

Solo el informe, numerado.
TODAVÍA NO ARREGLES NADA.

Qué hizo el agente:
Revisó el proyecto en busca de errores de estructura, reglas, pruebas y funcionamiento.

P6 — README

Prompt enviado:
Escribí el archivo README.md en español con estas seis partes:
1. Nombre y la frase de mi ficha.
2. Qué hace y cómo se usa, en tres líneas.
3. El enlace para abrirlo.
4. Cómo correrlo en otra máquina: los comandos exactos.
5. Dejá este espacio en blanco con un comentario para que lo llene yo:
   «Qué dirigí yo y qué error encontré probando».
6. Declaración de autoría: qué herramienta usé, que el código lo generó un agente de IA bajo mi dirección, y qué partes puedo explicar.

No inventes nada en las partes 5 y 6: dejalas para que las complete yo.

Qué hizo el agente:
Creó el archivo README.md con la documentación básica del proyecto y dejó espacios para completar manualmente las partes solicitadas.


OBSERVACIÓN:
Durante el desarrollo se realizaron pruebas y revisiones del proyecto para comprobar que las reglas funcionaran correctamente y que la interfaz pudiera utilizarse en computadora y celular.

