# Taller de usabilidad de software

Material del taller del curso **Aseguramiento de la Calidad del Software**. Los participantes recorren un ciclo completo
de evaluación de usabilidad: inspeccionar → probar con usuarios → medir → priorizar → iterar → proteger.

Todo gira alrededor de **Banco Aurora**, un prototipo de banca en línea hecho en Figma Make. Las Partes 1 a 4 (heurísticas,
Maze, SUS/SEQ e iteración) se hacen sobre el prototipo. Este repositorio contiene la app como código y cubre la Parte 5:
convertir los problemas corregidos en pruebas automáticas con Playwright y axe-core.

| Carpeta | Contenido |
| --- | --- |
| `app/v1` | Versión con 9 problemas sembrados a propósito (ver [docs/defectos-v1.md](docs/defectos-v1.md)) |
| `app/v2` | Versión corregida: el prototipo de Figma Make sin cambios |
| `figma/` | Exportación original de Figma Make (referencia; no se modifica) |

Las pruebas de `tests/` deben **fallar en v1** y **pasar en v2**. Así se demuestra que detectan los problemas y no
producen falsos positivos.

## Requisitos

- Node.js 20 o superior (probado con 20.14)
- Git
- Windows, macOS o Linux

## Herramientas

| Herramienta | Uso |
| --- | --- |
| React 19, Vite 6 y Tailwind CSS 4 | La app de demostración, igual que en Figma Make |
| [Playwright Test](https://playwright.dev/) | Ejecuta el navegador, simula al usuario y toma capturas |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | Revisión automática de reglas WCAG 2.2 A/AA |
| cross-env | Variables de entorno multiplataforma |
| GitHub Actions | Pruebas en cada cambio (`usabilidad.yml`) y publicación en GitHub Pages (`pages.yml`) |

## Uso

```bash
# Instalar
git clone https://github.com/danielpulido01/Taller-Usabilidad.git
cd Taller-Usabilidad
npm install
npx playwright install chromium

# Ver la app en http://localhost:4173 (Ctrl+C para detener). Para entrar, cualquier usuario y contraseña.
npm run servidor:v1
npm run servidor:v2

# Pruebas
npm run test:v1          # se esperan 3 fallas
npm run test:v2          # se espera todo en verde
npm run resumen          # matriz v1 vs v2 en reportes/resumen.md
npm run reporte          # reporte HTML con capturas y trazas

# Regresión visual
npm run visual:base      # crea la línea base con v2
npm run visual:v2        # pasa: no hay cambios
npm run visual:v1        # falla y muestra la imagen de diferencias
```

| Prueba | Archivo | Qué protege |
| --- | --- | --- |
| T-01 | `tests/01-transferencia.spec.js` | La transferencia se revisa antes de enviarse y termina con un comprobante (D-06) |
| T-02 | `tests/01-transferencia.spec.js` | El error de monto explica cuánto se puede transferir (D-04) |
| T-03 | `tests/02-accesibilidad.spec.js` | Sin violaciones de axe en 4 pantallas: contraste y etiquetas (D-08, D-09) |
| T-04 | `tests/03-regresion-visual.spec.js` | El paso 1 de la transferencia coincide con la línea base aprobada |

## Ejercicios (Parte 5 del taller)

| Paso | Ejercicio | Tiempo |
| --- | --- | --- |
| 5.1 | Instalar y verificar | 5 min |
| 5.2 | Escribir una prueba para el problema que corrigió el equipo (D-01, D-02, D-03, D-05 o D-07) | 15 min |
| 5.3 | Encontrar y corregir con axe los errores de accesibilidad sembrados en v1 | 20 min |
| 5.4 | Cierre: qué no se puede automatizar | 5 min |

La guía, con tres ejercicios adicionales, está en [docs/ejercicios.md](docs/ejercicios.md). Las soluciones
verificadas están en [docs/soluciones-ejercicios.md](docs/soluciones-ejercicios.md) y [soluciones/](soluciones).

## Opcional: Maze sobre la app publicada

Al hacer push a `main`, `pages.yml` compila y publica las dos versiones:

- https://danielpulido01.github.io/Taller-Usabilidad/v1/
- https://danielpulido01.github.io/Taller-Usabilidad/v2/

Con esas URL se puede hacer en Maze una prueba de sitio en vivo (*live website testing*). El protocolo, con tareas,
SEQ, SUS y análisis, está en [docs/estudio-maze.md](docs/estudio-maze.md).

```bash
npm run sitio            # genera _site/ localmente para revisar lo que se publica
npm run sus              # calcula el SUS por versión desde estudio/resultados-sus.csv
npm run sus:ejemplo      # prueba el cálculo con datos ficticios
```

## Estructura

```
app/v1, app/v2           App de demostración (React + Vite + Tailwind); APP_VERSION=v1|v2 elige cuál
figma/                   Exportación original de Figma Make
vite.config.mjs          Servidor y compilación de la versión elegida
playwright.config.js     Proyecto "escritorio" (Chrome, 1440 × 900)
tests/
  ayudantes.js                      ingresar, abrirTransferencia, completarTransferencia, revisarAccesibilidad
  01-transferencia.spec.js          T-01, T-02  flujo de transferencia y mensaje de error
  02-accesibilidad.spec.js          T-03        axe-core en 4 pantallas
  03-regresion-visual.spec.js       T-04        captura contra línea base (@visual)
soluciones/              Pruebas S-01..S-06 de las soluciones (fuera de testDir)
scripts/resumen.js       Matriz de resultados v1 vs v2
scripts/preparar-pages.js  Compila v1 y v2 en _site/ e inserta el snippet de Maze
scripts/sus.js           Calcula el System Usability Scale desde un CSV
estudio/                 Plantilla CSV del SUS y datos ficticios de ejemplo
docs/                    Problemas sembrados, guía de ejercicios, soluciones y protocolo de Maze
.github/workflows/       usabilidad.yml (CI de pruebas) y pages.yml (publicación)
```
