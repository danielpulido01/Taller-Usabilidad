# Soluciones de los ejercicios (para el grupo expositor)

Resultados obtenidos al ejecutar cada ejercicio con Playwright 1.65 y Chromium en Windows. Los números pueden variar
ligeramente en otro sistema operativo, pero el patrón de pasa/falla es el mismo.

Las soluciones de E4 y E6 están en [`soluciones/`](../soluciones). Esa carpeta queda fuera de `testDir`, así que no se
ejecuta con la suite; para probar una solución, cópiela a `tests/`.

## E1. Leer un reporte de fallas

Resultado de referencia: `npm run test:v1` da **1 aprobada, 44 fallidas y 1 omitida**. Ejemplos de filas correctas:

| Prueba | Elemento | Efecto en el usuario | Defecto | Criterio | Severidad |
| --- | --- | --- | --- | --- | --- |
| U-08 | Formulario de registro | Pierde todo lo escrito tras un error | D-04 | WCAG 3.3.1 · H9 | 3 |
| U-11 | `div.inscribir`, `nav span` | Sin mouse no puede inscribir ni navegar | D-07 | WCAG 2.1.1 | 4 |
| U-21 | Página completa en móvil | Debe desplazarse a los lados para leer | D-12 | WCAG 1.4.10 | 3 |

Respuesta a la pregunta: axe-core reporta 5 tipos de violación en v1 (`color-contrast`, `document-title`,
`html-has-lang`, `image-alt`, `select-name`), que cubren solo **4 de los 14 defectos** (D-01, D-02, D-03 en parte y
D-06). Las otras 23 pruebas existen porque las reglas WCAG automáticas no evalúan la interacción.

## E2. Introducir una regresión en v2

Resultado verificado: **4 fallidas, 41 aprobadas y 1 omitida**.

| Prueba | Por qué falla |
| --- | --- |
| U-01 (escritorio y móvil) | axe-core aplica la regla `label`: el campo no tiene nombre accesible para un lector de pantalla |
| U-04 (escritorio y móvil) | El campo ya no tiene una etiqueta **visible** asociada con `<label for>` |

El texto de ayuda está enlazado con `aria-describedby`, que da una **descripción** y no un **nombre**. Además, al
escribir en el campo, el usuario deja de ver qué dato se pide.

## E3. Corregir el defecto D-08 en v1

Antes, U-12 reporta 8 controles sin foco visible en escritorio: la búsqueda, el botón "Ir", los cinco campos del registro y el botón "Enviar".

Corrección en `app/v1/estilos.css`, línea 5:

```css
/* Antes */
*:focus { outline: none; }
/* Después */
:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
```

Resultado verificado: U-12 pasa en ambos proyectos y `npm run test:v1` sube de 1 a **3 aprobadas** (42 fallidas).

Respuestas:

- `:focus-visible` muestra el contorno al navegar con teclado y no al hacer clic con el mouse. Así se cumple WCAG
  2.4.7 sin que el diseño muestre contornos a quien usa mouse.
- U-11 detecta los controles inalcanzables (`div.inscribir`, `nav span`). U-12 solo evalúa los elementos que reciben
  el foco; un `<div>` que nunca recibe el foco no aparece en su recorrido. Por eso cada criterio necesita su propia
  prueba.

## E4. Escribir la prueba U-25

Solución: [`soluciones/07-mostrar-contrasena.spec.js`](../soluciones/07-mostrar-contrasena.spec.js).

Resultado verificado: pasa en v2 (2 de 2) y falla en v1 (2 de 2, porque `#mostrar-contrasena` no existe).

El error más común es ubicar el botón con `getByRole('button', { name: /mostrar contraseña/i })`. Después del primer
clic, su nombre cambia a "Ocultar contraseña" y el localizador deja de encontrarlo. La solución lo ubica por `id` y
verifica el texto con `toHaveText`.

## E5. Regresión visual: ¿error o rediseño?

| Cambio | `visual:v2` | `test:v2` | Conclusión |
| --- | --- | --- | --- |
| A `#60a5fa` | Falla (2 % de píxeles distintos) | U-01 falla: `color-contrast` en 8 elementos | **Defecto**: texto blanco sobre azul claro no llega a 4.5:1 |
| B `#15803d` | Falla (2 % de píxeles distintos) | 45 aprobadas | **Posible rediseño**: cambia el aspecto sin romper ningún criterio |

La prueba visual detecta que algo cambió; las pruebas funcionales y de accesibilidad dicen si el cambio es aceptable.
Si B es un rediseño aprobado, se actualiza la línea base con `npm run visual:base`. Debe aprobarlo quien sea dueño del
diseño (diseño o producto), no quien hizo el cambio, en la revisión del pull request.

## E6. Engañar a la suite (reto)

Ejemplo verificado. En `app/v2/app.js`, función `inscribir`, cambiar:

```js
avisar('#estado-inscripcion', `Se inscribió en ${c.nombre}.`);
// por
avisar('#estado-inscripcion', 'Operación INS-200 completada.');
```

Con ese cambio, `npm run test:v2` sigue dando **45 aprobadas**: ninguna prueba revisa el texto de la confirmación. El
mensaje viola H2 (lenguaje del usuario) y H1 (no dice qué curso se inscribió).

Solución: [`soluciones/08-mensaje-inscripcion.spec.js`](../soluciones/08-mensaje-inscripcion.spec.js). Falla con el
defecto (`Received string: "Operación INS-200 completada."`) y pasa al restaurar.

**Reto extra (CLS en móvil).** v1 no declara `meta viewport` (D-12). En la emulación móvil sin viewport, Chromium
marca el desplazamiento del banner con `hadRecentInput = true`, y `medirCLS` descarta esas entradas, como indica la
especificación de CLS. El resultado es un **falso negativo**: U-22 pasa en `v1/movil` y falla en escritorio
(CLS 0.168). Lección: una métrica automática depende de supuestos del entorno, y por eso se mide en más de un
dispositivo.

## E7. Triangular con los resultados de Maze

No tiene solución fija: depende de los datos del estudio. Puntos que conviene sacar en la discusión:

- T4 (contraseña de 7 caracteres) debería mostrar la mayor diferencia entre v1 y v2, porque v1 borra el formulario
  (D-04).
- T3 (retirar un curso) permite comparar la respuesta de verificación "¿pidió confirmación?" con U-16.
- Un defecto que nadie sufrió (por ejemplo, el contraste para quien no tiene baja visión) sigue siendo un
  incumplimiento: 5 a 10 participantes no representan a todos los usuarios.
