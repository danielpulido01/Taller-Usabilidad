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
docs/defectos-v1.md      Catálogo de defectos y prueba que los detecta
```

## Ejercicios propuestos

1. **Romper v2:** quite el `<label>` del campo Correo en `app/v2/index.html` y ejecute `npm run test:v2`. ¿Qué pruebas fallan?
2. **Corregir v1:** arregle el defecto D-08 (foco invisible) en `app/v1/estilos.css` y verifique que U-12 pasa.
3. **Nueva prueba:** escriba U-25 que verifique que el botón "Mostrar contraseña" cambia `aria-pressed`.
4. **Analizar un falso negativo:** U-22 (CLS) pasa en `v1/movil`. Lea la sección de lecciones del documento y explique por qué.
