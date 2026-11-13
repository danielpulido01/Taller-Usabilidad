# Soluciones de la Parte 5 (para el facilitador)

Resultados obtenidos al ejecutar cada ejercicio con Playwright 1.65, Chromium y Vite 6 en Windows.

Las pruebas de solución están en [`soluciones/`](../../soluciones). Esa carpeta queda fuera de `testDir`, así que la
suite no la ejecuta. Para probar una solución, copie el archivo a `tests/`.

## 5.1 Instalar y verificar

`npm run test:v2` da **3 aprobadas** y `npm run test:v1` da **3 fallidas**.

En v1, T-01 y T-02 fallan en `getByLabel('Monto en colones')`, porque el campo no tiene etiqueta (D-08). Es un buen
momento para mostrar que un localizador accesible ya funciona como prueba de accesibilidad.

## 5.2 Prueba de flujo

Solución de referencia: [`soluciones/04-problemas-equipos.spec.js`](../../soluciones/04-problemas-equipos.spec.js), con
una prueba por problema. Las 5 pasan con v2 y fallan con v1, cada una por su propio problema:

| Prueba | Problema | Mensaje en v1 |
| --- | --- | --- |
| S-01 | D-01 Menú "Mi Aurora" | No encuentra el botón "Configuración" en el menú |
| S-02 | D-03 Guardar sin aviso | No aparece "Guardamos los cambios de tu perfil." |
| S-03 | D-05 Comprobante escondido | No hay un botón visible "Descargar comprobante" |
| S-04 | D-07 Sin indicador de progreso | No aparece "Paso 1 de 3" |
| S-05 | D-02 "Continuar" poco visible | El fondo es `rgba(0, 0, 0, 0)` en lugar del color de marca `rgb(211, 23, 46)` |

Al revisar las pruebas de los equipos, verifique lo siguiente:

- **Que fallen por el motivo correcto.** S-02 llega a la configuración con `/^(Configuración|Mi Aurora)$/` para no
  fallar por D-01, y S-03 usa `completarTransferencia`, que funciona en ambas versiones. Si una prueba falla en v1 por
  un problema que no es el suyo, no demuestra nada sobre ese problema.
- **Que verifiquen lo que ve el usuario,** no el estado interno de React.

## 5.3 Errores de accesibilidad sembrados

Antes de corregir, T-03 reporta en v1:

```
[Inicio de sesión]     color-contrast (7)
[Inicio]               color-contrast (22)
[Paso 1: destinatario] color-contrast (17)
[Paso 2: monto]        color-contrast (16)
[Paso 2: monto]        label (1) → #amount
```

Corrección verificada; con ella, T-03 pasa:

```css
/* app/v1/src/index.css */
--color-muted: #6b6b6b;   /* antes #a1a1aa: 2.6:1 → 5.3:1 sobre blanco */
```

```tsx
// app/v1/src/screens/Transfer.tsx, paso 2
<Label htmlFor="amount">Monto en colones</Label>   {/* antes: <p>Monto</p>, sin asociar al campo */}
```

Respuesta al paso 5: después de la corrección, T-01 y T-02 fallan por los problemas de usabilidad que protegen.
T-01 indica "No hay paso de revisión" (D-06) y T-02 recibe "Error: monto inválido." (D-04). axe no evalúa si el flujo
tiene sentido.

Nota: el botón "Continuar" gris de D-02 tiene bajo contraste, pero axe no lo marca. T-03 revisa el paso 1 antes de
elegir un contacto, y en ese momento el botón está deshabilitado; WCAG no exige contraste a los controles
deshabilitados. Es otro ejemplo de algo que la herramienta no ve.

## 5.4 Cierre

- **No se automatizan:** si "Mi Aurora" se entiende, si el flujo es el que la gente espera, la satisfacción (SUS y SEQ)
  y la confianza. Para eso están las Partes 1 a 4.
- **S-05 no garantiza que la gente encuentre "Continuar".** Comprueba un síntoma (color y tamaño), no la experiencia.
  Solo lo confirma una prueba con usuarios, como los misclicks y el éxito directo en Maze.

---

## Ejercicios adicionales

### A1. Romper v2

Resultado verificado: **2 fallidas y 1 aprobada.** T-01 y T-02 fallan porque `getByLabel` ya no encuentra el campo.
T-03 **sigue pasando**, porque axe acepta el placeholder "0" como nombre accesible del campo. Por eso `getByLabel` y
axe se complementan.

### A2. ¿Error o rediseño?

| `--color-brand` | `visual:v2` | `test:v2` | Conclusión |
| --- | --- | --- | --- |
| `#f87171` | Falla (6 % de píxeles distintos) | T-03 falla por `color-contrast` | **Defecto**: el texto blanco sobre rojo claro no llega a 4.5:1 |
| `#1d4ed8` | Falla (6 % de píxeles distintos) | 3 aprobadas | **Posible rediseño**: se aprueba con `npm run visual:base` |

La prueba visual detecta que algo cambió; las demás pruebas dicen si el cambio es aceptable. El cambio de la línea base
lo aprueba la persona dueña del diseño en la revisión del pull request, no quien hizo el cambio.

### A3. Engañar a la suite

Ejemplo verificado. En `app/v2/src/screens/Login.tsx`, cambiar el mensaje de error por
`'Error 401: credenciales nulas.'`. La suite sigue dando **3 aprobadas**: ninguna prueba revisa el inicio de sesión
vacío. El mensaje viola la heurística 9 y la 2 (jerga técnica). Solución:
[`soluciones/05-reto-a3.spec.js`](../../soluciones/05-reto-a3.spec.js). Falla con el cambio y pasa al restaurar.
