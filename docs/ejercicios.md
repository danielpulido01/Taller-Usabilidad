# Parte 5 del taller: proteger los flujos con Playwright

Esta guía cubre la Parte 5 del plan del taller (45 min). Las Partes 1 a 4 (heurísticas, Maze, SUS/SEQ e iteración) se
hacen sobre el prototipo y no usan este repositorio.

Playwright no mide usabilidad. Su papel es **proteger** lo aprendido: cada problema corregido en la Parte 4 se
convierte en una prueba que avisa si alguien lo vuelve a romper.

| Paso | Actividad | Tiempo |
| --- | --- | --- |
| 5.1 | Instalar y verificar el entorno | 5 min (idealmente antes del taller) |
| 5.2 | Escribir una prueba de flujo para el problema que corrigió su equipo | 15 min |
| 5.3 | Encontrar y corregir los errores de accesibilidad sembrados | 20 min |
| 5.4 | Cierre: ¿qué no se puede automatizar? | 5 min |

## La app de demostración

**Banco Aurora** es el prototipo de Figma Make exportado como código (React, Vite y Tailwind). Tiene inicio de sesión,
inicio, cuentas, una transferencia en 3 pasos y configuración. Para entrar se escribe cualquier usuario y contraseña.

- `app/v1`: la versión con problemas sembrados (el prototipo v1 de las Partes 1 a 4).
- `app/v2`: la versión corregida.

| Problema sembrado en v1 | Corrección en v2 | Prueba |
| --- | --- | --- |
| D-01 El menú llama "Mi Aurora" a la configuración del perfil | "Configuración" | Para escribir en 5.2 |
| D-02 "Continuar" parece un enlace gris y "Cancelar" es el botón destacado | "Continuar" es el botón principal | Para escribir en 5.2 |
| D-03 Guardar el perfil no muestra ningún aviso | "Guardamos los cambios de tu perfil." | Para escribir en 5.2 |
| D-04 El error de monto solo dice "Error: monto inválido." | Explica cuánto se puede transferir | T-02 (ejemplo) |
| D-05 "Descargar comprobante" está escondido en un menú "⋯" | Botón visible | Para escribir en 5.2 |
| D-06 El dinero se envía sin un paso para revisar | Paso "Confirma tu transferencia" | T-01 (ejemplo) |
| D-07 No se indica en qué paso del proceso está el usuario | "Paso 1 de 3" | Para escribir en 5.2 |
| D-08 El campo del monto no tiene etiqueta | Etiqueta "Monto en colones" | T-03 (axe) |
| D-09 El texto secundario tiene bajo contraste | Contraste ≥ 4.5:1 | T-03 (axe) |

El detalle de cada problema, con el archivo donde está, se encuentra en [defectos-v1.md](defectos-v1.md).

---

## 5.1 Instalar y verificar

```bash
git clone https://github.com/danielpulido01/Taller-Usabilidad.git
cd Taller-Usabilidad
npm install
npx playwright install chromium
npm run test:v2      # 3 aprobadas (T-01, T-02 y T-03)
npm run test:v1      # las mismas 3 fallan
```

Para ver la app: `npm run servidor:v1` o `npm run servidor:v2`, y abra http://localhost:4173. La app está diseñada para
computadora: use una ventana de al menos 1440 px de ancho. Los cambios en el código se ven al instante, sin recargar.

## 5.2 Prueba de flujo para el problema que corrigió su equipo

**Objetivo.** Convertir un hallazgo corregido en una prueba que falle con v1 y pase con v2.

1. Elija de la tabla el problema que su equipo priorizó en la Parte 4, entre los marcados "Para escribir en 5.2". Si
   su problema ya tiene ejemplo, elija el siguiente de su lista.
2. Escriba en una frase qué debe poder hacer el usuario en v2. Por ejemplo: "Después de guardar mi perfil, el sistema
   me dice que los cambios se guardaron".
3. Cree `tests/04-equipo-<nombre>.spec.js`. Copie la estructura de `tests/01-transferencia.spec.js` y use las funciones
   de `tests/ayudantes.js`: `ingresar`, `abrirTransferencia` y `completarTransferencia`.
4. Ejecute `npm run test:v2`: su prueba debe **pasar**.
5. Ejecute `npm run test:v1`: su prueba debe **fallar**. Revise el mensaje: debe fallar por **su** problema, no por
   otro del camino.

**Consejos.**

- Ubique los elementos como lo haría una persona: `getByRole('button', { name: 'Guardar cambios' })` o
  `getByLabel('Teléfono celular')`. Si el localizador no encuentra el elemento, ese elemento no tiene un nombre
  accesible: ya es un hallazgo de accesibilidad.
- Verifique lo que ve el usuario (un mensaje, un botón, un título), no detalles internos del código.
- Para ejecutar solo su prueba: `npx cross-env APP_VERSION=v1 playwright test -g "<parte del título>"`.

## 5.3 Errores de accesibilidad sembrados

**Objetivo.** Usar axe para encontrar errores de accesibilidad y corregirlos hasta que la prueba pase.

1. Ejecute solo la prueba de axe contra v1: `npx cross-env APP_VERSION=v1 playwright test -g T-03`.
2. Lea la lista de violaciones. Cada línea indica la pantalla, la regla, cuántos elementos afecta y los selectores de
   los tres primeros.
3. Abra la app (`npm run servidor:v1`) y ubique cada elemento con las herramientas de desarrollador.
4. Corrija el código en `app/v1/src/` y repita el paso 1 hasta que T-03 pase.
5. Ejecute `npm run test:v1`. T-03 pasa, pero T-01 y T-02 siguen fallando. ¿Por qué?
6. Restaure v1 con `git checkout -- app/`.

**Resultado esperado.** Al inicio, axe reporta dos reglas: `color-contrast` en las 4 pantallas revisadas y `label` en
el campo del monto. Se corrigen cambiando 2 líneas.

## 5.4 Cierre

Discutan en equipo:

- ¿Qué hallazgos de las Partes 1 a 4 **no** se pueden convertir en prueba automática? Por ejemplo, "no sabía qué era
  *Mi Aurora*" o un SUS bajo.
- La prueba S-05 verifica el color y el tamaño de "Continuar". ¿Garantiza eso que la gente lo encuentre? ¿Qué lo
  garantiza?

---

## Ejercicios adicionales (opcionales)

Para quien termine antes o como tarea. Las soluciones verificadas están en
[soluciones-ejercicios.md](soluciones-ejercicios.md).

| # | Ejercicio | Resultado esperado |
| --- | --- | --- |
| A1 | **Romper v2.** En `app/v2/src/screens/Transfer.tsx`, quite el `<Label>` "Monto en colones" y ejecute `npm run test:v2`. Antes, prediga qué falla | Fallan T-01 y T-02; T-03 sigue pasando |
| A2 | **¿Error o rediseño?** Cree la línea base (`npm run visual:base`). Cambie `--color-brand` en `app/v2/src/index.css` a `#f87171` y luego a `#1d4ed8`. Ejecute `npm run visual:v2` y `npm run test:v2` cada vez | La prueba visual falla en ambos casos; solo `#f87171` rompe el contraste |
| A3 | **Engañar a la suite.** Meta en v2 un problema de usabilidad que ninguna prueba detecte y escriba la prueba que lo detecte | Suite en verde con el problema; la prueba nueva falla |

Después de cada uno, restaure con `git checkout -- app/`.
