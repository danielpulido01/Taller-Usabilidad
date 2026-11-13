# Ejercicios del taller

Siete ejercicios, de leer resultados a escribir pruebas propias. Cada uno indica qué hacer, cómo comprobar el resultado
y qué entregar. Antes de empezar, complete la instalación del [README](../README.md#pasos-del-taller).

| # | Ejercicio | Tiempo | Modalidad | Bloque de la agenda |
| --- | --- | --- | --- | --- |
| E1 | Leer un reporte de fallas | 15 min | Individual | 4 |
| E2 | Introducir una regresión en v2 | 7 min | Individual | 5 |
| E3 | Corregir el defecto D-08 en v1 | 8 min | Individual | 5 |
| E4 | Escribir la prueba U-25 | 12 min | Parejas | 6 |
| E5 | Regresión visual: ¿error o rediseño? | 8 min | Parejas | 6 |
| E6 | Engañar a la suite (reto) | 15 min | Parejas | Tarea o extra |
| E7 | Triangular con los resultados de Maze | 10 min | Todos | 7 |

**Regla para E2, E3, E5 y E6:** son cambios temporales a la app. Al terminar cada uno, deshágalos con
`git checkout -- app/` para que el siguiente ejercicio parta de la versión original.

---

## E1. Leer un reporte de fallas

**Objetivo.** Traducir una prueba fallida en un defecto de usabilidad con su criterio y severidad.

1. Ejecute `npm run test:v1` y luego `npm run reporte`.
2. En el reporte HTML, abra tres pruebas fallidas **de archivos distintos** (por ejemplo, una de `02-formularios`,
   una de `03-teclado` y una de `05-responsive-rendimiento`).
3. Para cada una, lea el mensaje de error, la captura y, si hace falta, la traza (*Trace*).
4. Llene la tabla.

| Prueba | ¿Qué elemento falla? | ¿Qué le pasaría a un usuario real? | Defecto (D-xx) | Criterio (WCAG o heurística) | Severidad 0–4 |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
| | | | | | |
| | | | | | |

**Cómo comprobar.** Compare sus columnas "Defecto" y "Criterio" con [defectos-v1.md](defectos-v1.md).

**Pregunta.** U-01 usa axe-core, un motor de reglas WCAG. ¿Cuántos de los 14 defectos detecta por sí solo?

---

## E2. Introducir una regresión en v2

**Objetivo.** Ver que la suite protege la versión corregida: un cambio que empeora la usabilidad rompe el pipeline.

1. **Antes de ejecutar nada**, escriba qué pruebas cree que van a fallar.
2. En `app/v2/index.html`, borre la línea `<label for="correo">…</label>` del campo Correo.
3. Ejecute `npm run test:v2`.
4. Restaure con `git checkout -- app/`.

**Resultado esperado.** Deben fallar 4 pruebas: dos pruebas distintas, cada una en escritorio y en móvil.

**Preguntas.**

- ¿Acertó su predicción?
- Las dos pruebas que fallan detectan el mismo cambio. ¿Qué verifica cada una?
- El campo conserva el texto de ayuda "Ejemplo: ana.perez@correo.com". ¿Por qué no basta como etiqueta?

---

## E3. Corregir el defecto D-08 en v1

**Objetivo.** Corregir un defecto y confirmar la corrección con su prueba, igual que al cerrar un bug.

1. Ejecute solo la prueba del foco:
   `npx cross-env APP_VERSION=v1 playwright test -g U-12`. Anote cuántos controles reporta sin foco visible.
2. En `app/v1/estilos.css`, reemplace la regla que causa el defecto (línea 5) por un indicador de foco visible de al
   menos 2 px.
3. Ejecute la misma prueba otra vez.
4. Ejecute `npm run test:v1` y compare el total de pruebas aprobadas con el de E1.
5. Restaure con `git checkout -- app/`.

**Resultado esperado.** U-12 pasa en escritorio y en móvil, y v1 pasa de 1 a 3 pruebas aprobadas.

**Preguntas.**

- ¿Por qué conviene usar `:focus-visible` en lugar de `:focus`?
- U-12 ahora pasa en v1, pero v1 aún tiene controles que no se alcanzan con teclado. ¿Qué prueba los detecta y por qué
  U-12 no?

---

## E4. Escribir la prueba U-25

**Objetivo.** Convertir un criterio de usabilidad en una prueba nueva.

**Criterio.** El botón "Mostrar contraseña" del registro debe:

1. Iniciar con `aria-pressed="false"` y el campo de contraseña oculto (`type="password"`).
2. Al pulsarlo, mostrar la contraseña (`type="text"`), cambiar a `aria-pressed="true"` y decir "Ocultar contraseña".
3. Al pulsarlo otra vez, volver al estado inicial **sin borrar** lo escrito.

**Pasos.**

1. Cree `tests/07-mostrar-contrasena.spec.js`. Use como modelo `tests/04-heuristicas.spec.js`.
2. Ejecute `npx cross-env APP_VERSION=v2 playwright test -g U-25`: debe **pasar**.
3. Ejecute `npx cross-env APP_VERSION=v1 playwright test -g U-25`: debe **fallar**, porque v1 no tiene ese botón.

**Pista.** Si la prueba falla en v2 después del primer clic, revise cómo ubica el botón. ¿Qué le pasa a su nombre
cuando se pulsa?

**Entrega.** El archivo de prueba y la salida de las dos ejecuciones.

---

## E5. Regresión visual: ¿error o rediseño?

**Objetivo.** Distinguir entre detectar un cambio y juzgar si ese cambio es bueno.

Requiere la línea base: si no la creó en el paso 6 del README, ejecute `npm run visual:base`.

1. **Cambio A.** En `app/v2/estilos.css`, cambie `--primario: #1d4ed8;` por `--primario: #60a5fa;`.
   Ejecute `npm run visual:v2` y luego `npm run test:v2`. Anote qué falla.
2. **Cambio B.** Cambie el mismo valor por `--primario: #15803d;`. Repita las dos ejecuciones.
3. Restaure con `git checkout -- app/`.

**Preguntas.**

- La prueba visual falla en A y en B. ¿Cuál de los dos cambios es un defecto y cuál podría ser un rediseño aceptado?
  ¿Qué prueba le dio la respuesta?
- Si B fuera un rediseño aprobado, ¿qué comando ejecutaría y quién debería aprobarlo?

---

## E6. Engañar a la suite (reto)

**Objetivo.** Descubrir los límites de la automatización: una suite verde no garantiza una interfaz usable.

1. Introduzca en `app/v2` un defecto de usabilidad que **ninguna** de las 24 pruebas detecte, y confirme con
   `npm run test:v2` que todo sigue en verde. Ideas: mensajes en jerga técnica, textos ambiguos, orden ilógico.
2. Escriba la prueba U-26 que lo detecte, en `tests/08-<nombre>.spec.js`.
3. Demuestre que U-26 falla con su defecto y pasa al restaurar con `git checkout -- app/`.

**Entrega.** El defecto (qué cambió y qué heurística viola), la prueba U-26 y las dos ejecuciones.

**Reto extra.** U-22 (CLS) pasa en `v1/movil` aunque v1 tiene un banner que empuja el contenido. Compare el resultado
de U-22 en escritorio y en móvil y explique por qué la medición no lo detecta en el teléfono. Pista: revise
`medirCLS` en `tests/ayudantes.js` y el defecto D-12.

---

## E7. Triangular con los resultados de Maze

**Objetivo.** Comparar lo que encontraron las pruebas automáticas con lo que vivieron las personas.

Requiere el estudio previo en Maze (ver [estudio-maze.md](estudio-maze.md)).

1. El grupo expositor presenta la tasa de éxito, la mediana de tiempo y el SEQ por tarea, y el SUS de cada versión.
2. Entre todos, llenen la matriz de triangulación de la sección 7 de [estudio-maze.md](estudio-maze.md).
3. Discutan:
   - ¿Qué defecto detectado por la suite afectó más a los participantes?
   - ¿Qué problema encontraron los participantes que ninguna prueba detecta? ¿Se podría automatizar como en E6?
   - ¿Hubo algún defecto que la suite detectó pero que nadie sufrió? ¿Sigue siendo importante corregirlo?
