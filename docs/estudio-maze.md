# Protocolo de prueba con usuarios en Maze

Complementa la suite automatizada: las pruebas automáticas verifican criterios conocidos; el estudio con personas mide
**efectividad, eficiencia y satisfacción** (ISO 9241-11) y descubre problemas que ninguna regla detecta.

## 1. Objetivos

1. Comparar la tasa de éxito, el tiempo por tarea y la satisfacción (SUS) de UniCursos v1 frente a v2.
2. Confirmar si los defectos que detectó la suite automática afectan a personas reales.
3. Descubrir problemas de usabilidad que la suite automática no detecta.

## 2. Diseño

| Aspecto | Decisión | Motivo |
| --- | --- | --- |
| Tipo | No moderado, remoto, en computadora | Cada participante lo completa en 10–15 min antes de la sesión |
| Comparación | Entre sujetos: un estudio Maze para v1 y otro idéntico para v2 | Las tareas son iguales; hacer ambas versiones causaría efecto de aprendizaje |
| Asignación | Lista del curso: números impares → v1, pares → v2 | Asignación simple y balanceada |
| Participantes | Mínimo 5 por versión; ideal 8–10 | 5 usuarios encuentran cerca del 85 % de los problemas (Nielsen y Landauer, 1993); más usuarios dan métricas más estables |
| Exclusión | Integrantes del grupo expositor y quien ya haya visto la app | Evitar sesgo de conocimiento previo |

## 3. Preparación técnica

1. **Publicar la app.** En GitHub: *Settings › Pages › Source: GitHub Actions*. Al hacer push a `main`, el flujo
   `.github/workflows/pages.yml` publica:
   - `https://<usuario>.github.io/Taller-Usabilidad/v1/`
   - `https://<usuario>.github.io/Taller-Usabilidad/v2/`
2. **Cuenta de Maze.** Crear cuenta en [maze.co](https://maze.co). Las cuentas nuevas inician una prueba gratuita de
   30 días con funciones premium. Revise los límites vigentes del plan gratuito en maze.co/pricing antes de planificar
   (por ejemplo, cuántos estudios activos permite).
3. **Snippet de Maze (opcional, recomendado).** Sin snippet, Maze puede probar cualquier URL pública, pero los mapas de
   calor, clics y rutas solo están disponibles con el snippet instalado en todas las páginas. Para instalarlo:
   1. Copie el código que muestra Maze al crear el bloque *Website test*.
   2. En GitHub: *Settings › Secrets and variables › Actions › Variables* → nueva variable `MAZE_SNIPPET` con ese código.
   3. Ejecute de nuevo el flujo *Publicar en GitHub Pages* (pestaña Actions › Run workflow).
   4. En Maze, pulse *Verify*.
   Para probarlo localmente: `MAZE_SNIPPET='<script>…</script>' node scripts/preparar-pages.js` y revise `_site/`.

## 4. Estructura del estudio en Maze

Cree el estudio **UniCursos v1** con estos bloques; luego duplíquelo como **UniCursos v2** y cambie solo las URL.

| # | Bloque Maze | Contenido |
| --- | --- | --- |
| 0 | Context screen | Bienvenida y consentimiento: \"Evaluamos el sistema, no a usted. Sus respuestas son anónimas. Puede abandonar cuando quiera.\" |
| 1 | Multiple choice | ¿Con qué frecuencia usa sistemas de matrícula en línea? (Nunca / 1 vez por ciclo / Varias veces por ciclo) |
| 2 | Multiple choice | ¿Usa normalmente teclado sin mouse, lector de pantalla o zoom? (Ninguno / Teclado / Lector de pantalla / Zoom) |
| 3 | Website test (T1) | \"Busque los cursos que contengan la palabra *programación*. Cuando lo logre, indique que terminó.\" |
| 4 | Multiple choice | Verificación T1: ¿Cuántos cursos encontró? (1 / **2** / 3 / 4 / No sé) |
| 5 | Opinion scale 1–7 | SEQ T1: En general, ¿qué tan fácil o difícil fue esta tarea? |
| 6 | Website test (T2) | \"Inscríbase en el curso *Calidad del Software*.\" |
| 7 | Open question | Verificación T2: ¿Cómo supo que la inscripción se realizó? |
| 8 | Opinion scale 1–7 | SEQ T2 |
| 9 | Website test (T3) | \"Inscríbase en *Estadística* y luego retire ese curso de sus cursos.\" |
| 10 | Yes/No | Verificación T3: ¿El sistema le pidió confirmar antes de retirar el curso? |
| 11 | Opinion scale 1–7 | SEQ T3 |
| 12 | Website test (T4) | \"Cree una cuenta con estos datos: Nombre *Ana Pérez Mora*, Correo *ana.perez@correo.com*, Carrera *Ingeniería de Software*, Contraseña *Clave26*. Si el sistema rechaza algún dato, corríjalo como le parezca y termine el registro.\" |
| 13 | Yes/No | Verificación T4: ¿Logró crear la cuenta? |
| 14 | Open question | Si apareció un error, ¿qué le indicó el sistema y qué hizo para corregirlo? |
| 15 | Opinion scale 1–7 | SEQ T4 |
| 16–25 | Opinion scale 1–5 | Cuestionario SUS (ítems en la sección 6) |
| 26 | Open question | ¿Qué fue lo más difícil o confuso? |
| 27 | Open question | Si pudiera cambiar una sola cosa, ¿cuál sería? |

**Notas de diseño de tareas**

- La contraseña de T4 (`Clave26`, 7 caracteres) es inválida a propósito: ambas versiones exigen 8. Mide la heurística
  H9 (recuperarse de errores) con personas reales, igual que U-06 a U-08 en la suite automática: v2 explica el error
  junto al campo y conserva los datos; v1 muestra solo "Error" y borra el formulario.
- UniCursos es una página única: inscribir o retirar no cambia la URL, así que el éxito no puede definirse solo por la
  ruta de páginas. Por eso cada tarea tiene una **pregunta de verificación**; el éxito se cuenta cuando el participante
  indica que terminó **y** responde correctamente.
- Desactive la grabación de cámara y voz en Maze; no son necesarias y reducen la tasa de participación.

## 5. Métricas

| Métrica | Dimensión ISO 9241-11 | Cálculo | Referencia |
| --- | --- | --- | --- |
| Tasa de éxito por tarea | Efectividad | Participantes con tarea terminada y verificación correcta ÷ total | — |
| Tiempo en tarea | Eficiencia | Mediana en segundos (Maze lo reporta por bloque) | Comparar v1 vs v2 |
| Clics fuera de zona (misclicks) | Eficiencia | Reporte de Maze (requiere snippet) | — |
| SEQ | Satisfacción por tarea | Promedio 1–7 | Promedio histórico cercano a 5.5 (Sauro) |
| SUS | Satisfacción global | 0–100 con `npm run sus` | 68 = promedio de la industria |
| Problemas observados | Cualitativa | Lista con frecuencia y severidad 0–4 (Nielsen) | — |

Con 5–10 participantes por versión los resultados son **descriptivos**: muestran tendencias y problemas, no
significancia estadística.

## 6. Cuestionario SUS (escala 1 = Muy en desacuerdo … 5 = Muy de acuerdo)

1. Creo que me gustaría usar este sistema con frecuencia.
2. Encontré el sistema innecesariamente complejo.
3. Pensé que el sistema era fácil de usar.
4. Creo que necesitaría el apoyo de una persona técnica para poder usar este sistema.
5. Encontré que las diversas funciones del sistema estaban bien integradas.
6. Pensé que había demasiada inconsistencia en el sistema.
7. Imagino que la mayoría de las personas aprendería a usar este sistema muy rápidamente.
8. Encontré el sistema muy engorroso de usar.
9. Me sentí muy seguro(a) usando el sistema.
10. Necesité aprender muchas cosas antes de poder usar el sistema.

## 7. Análisis

1. Al llegar al número de respuestas previsto, cierre ambos estudios y exporte los resultados (CSV) desde Maze.
2. Copie las respuestas SUS a `estudio/resultados-sus.csv` usando el formato de `estudio/plantilla-sus.csv`
   (`participante,version,p1..p10`) y ejecute:
   ```bash
   node scripts/sus.js estudio/resultados-sus.csv
   ```
   `estudio/ejemplo-sus-ficticio.csv` contiene datos **inventados** solo para probar el cálculo.
3. Calcule la tasa de éxito, mediana de tiempo y SEQ por tarea y versión.
4. Agrupe las respuestas abiertas en problemas, asigne severidad 0–4 y cuente cuántos participantes los mencionaron.
5. Llene la matriz de triangulación:

| Defecto | ¿Lo detectó la suite automática? | ¿Lo sufrieron los participantes? (tarea, n) | Severidad |
| --- | --- | --- | --- |
| D-04 Error genérico y datos borrados | Sí (U-06 a U-08) | | |
| D-09 Búsqueda sin retroalimentación | Sí (U-14, U-15) | | |
| D-11 Retiro sin confirmación | Sí (U-16) | | |
| … | | | |
| Problema nuevo descubierto por usuarios | No | | |

## 8. Plan B sin Maze

Si no hay cuenta de Maze disponible, las mismas tareas sirven con herramientas similares (Lyssna, UXtweak, Useberry) o
en una sesión moderada presencial: el moderador lee cada tarea, cronometra, anota éxito y comentarios, y las preguntas
SEQ/SUS se aplican con un formulario. El análisis y `scripts/sus.js` no cambian.
