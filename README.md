# Taller: Pruebas Automatizadas de Usabilidad

Taller práctico del curso **Aseguramiento de la Calidad del Software**. Demuestra cómo convertir criterios de usabilidad
(heurísticas de Nielsen, WCAG 2.2, ISO/IEC 25010, Core Web Vitals) en pruebas automatizadas que se ejecutan en cada cambio,
igual que las pruebas unitarias.

## Contexto

**UniCursos** es un portal de matrícula universitaria con tres tareas: buscar cursos, inscribir/retirar cursos y registrarse.
Hay dos versiones:

| Carpeta | Descripción |
| --- | --- |
| `app/v1` | Versión con 14 defectos de usabilidad intencionales (ver [docs/defectos-v1.md](docs/defectos-v1.md)) |
| `app/v2` | Versión corregida |

La suite de 24 pruebas (`tests/`) debe **fallar en v1** y **pasar en v2**. Así se demuestra que las pruebas detectan
los defectos y no producen falsos positivos.

## Requisitos

- Node.js 18 o superior (probado con 20.14)
- Git
- Windows, macOS o Linux

## Herramientas

| Herramienta | Uso |
| --- | --- |
| [Playwright Test](https://playwright.dev/) | Ejecuta el navegador, simula teclado/toque, emula móvil, toma capturas |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | Motor de reglas WCAG de Deque |
| Performance API del navegador | Mide CLS y tiempo de carga |
| cross-env | Variables de entorno multiplataforma |
| GitHub Actions | Ejecución en CI (`.github/workflows/usabilidad.yml`) |

## Pasos del taller

```bash
# 1. Instalar
git clone <url-del-repositorio>
cd Taller-Usabilidad
npm install
npx playwright install chromium

# 2. Explorar la app manualmente (abrir http://localhost:4173)
npm run servidor:v1      # Ctrl+C para detener
npm run servidor:v2

# 3. Ejecutar la suite contra la versión con defectos (se esperan fallas)
npm run test:v1

# 4. Ejecutar la suite contra la versión corregida (se espera todo en verde)
npm run test:v2

# 5. Ver la matriz comparativa y el reporte HTML
npm run resumen          # genera reportes/resumen.md
npm run reporte          # abre el reporte HTML (último run)

# 6. Regresión visual
npm run visual:base      # crea la línea base con v2
npm run visual:v2        # pasa: no hay cambios
npm run visual:v1        # falla: muestra la imagen de diferencias en el reporte
```

## Parte 2: prueba con usuarios en Maze

La suite automática verifica criterios conocidos; la prueba con personas mide éxito, tiempo y satisfacción, y encuentra
problemas nuevos. El protocolo completo (tareas, preguntas, SUS, análisis) está en
[docs/estudio-maze.md](docs/estudio-maze.md).

```bash
# 1. Publicar v1 y v2 en GitHub Pages (Settings › Pages › Source: GitHub Actions; luego push a main)
#    → https://<usuario>.github.io/Taller-Usabilidad/v1/  y  /v2/
# 2. (Opcional) Guardar el snippet de Maze en la variable de repositorio MAZE_SNIPPET y volver a publicar
npm run sitio            # genera _site/ localmente para revisar lo que se publica
# 3. Crear en Maze los estudios "UniCursos v1" y "UniCursos v2" según el protocolo y compartir los enlaces
# 4. Exportar resultados, copiar respuestas SUS a estudio/resultados-sus.csv (formato de plantilla-sus.csv)
npm run sus              # calcula el SUS promedio por versión
npm run sus:ejemplo      # prueba el cálculo con datos ficticios
```

## Estructura

```
app/v1, app/v2           Aplicación bajo prueba (HTML/CSS/JS sin frameworks)
servidor.js              Servidor estático (APP_VERSION=v1|v2)
playwright.config.js     Proyectos "escritorio" (Desktop Chrome) y "movil" (Pixel 5)
tests/
  01-accesibilidad.spec.js          U-01..U-03  axe-core, idioma, texto alternativo
  02-formularios.spec.js            U-04..U-09  etiquetas, tipos, errores, retroalimentación
  03-teclado.spec.js                U-10..U-13  skip link, alcance por Tab, foco visible
  04-heuristicas.spec.js            U-14..U-19  Nielsen, objetivos táctiles, legibilidad
  05-responsive-rendimiento.spec.js U-20..U-23  viewport, scroll horizontal, CLS, carga
  06-regresion-visual.spec.js       U-24        captura contra línea base
scripts/resumen.js       Matriz de resultados v1 vs v2
scripts/preparar-pages.js  Genera _site/ para GitHub Pages e inserta el snippet de Maze
scripts/sus.js           Calcula el System Usability Scale desde un CSV
estudio/                 Plantilla CSV del SUS y datos ficticios de ejemplo
docs/defectos-v1.md      Catálogo de defectos y prueba que los detecta
docs/estudio-maze.md     Protocolo de la prueba con usuarios en Maze
docs/ejercicios.md       Guía de ejercicios del taller (E1..E7)
docs/soluciones-ejercicios.md  Soluciones y resultados verificados
soluciones/              Pruebas U-25 y U-26 de las soluciones (fuera de testDir)
.github/workflows/       usabilidad.yml (CI de pruebas) y pages.yml (publicación)
```

## Ejercicios

La guía completa, con pasos, resultado esperado y preguntas, está en [docs/ejercicios.md](docs/ejercicios.md).

| # | Ejercicio | Qué se aprende |
| --- | --- | --- |
| E1 | Leer un reporte de fallas de v1 | Traducir una prueba fallida en defecto, criterio y severidad |
| E2 | Quitar la etiqueta del campo Correo en v2 | La suite detecta regresiones (fallan U-01 y U-04) |
| E3 | Corregir el foco invisible (D-08) en v1 | Verificar una corrección con su prueba (U-12 pasa) |
| E4 | Escribir U-25 para "Mostrar contraseña" | Convertir un criterio en una prueba nueva |
| E5 | Cambiar el color primario de v2 | La regresión visual detecta cambios; las demás pruebas juzgan si son defectos |
| E6 | Introducir un defecto que la suite no detecte (reto) | Límites de la automatización |
| E7 | Triangular con los resultados de Maze | Comparar la suite con la experiencia de personas reales |

Las soluciones verificadas están en [docs/soluciones-ejercicios.md](docs/soluciones-ejercicios.md) y
[soluciones/](soluciones).
