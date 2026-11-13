# Protocolo de prueba con usuarios en Maze (sitio en vivo)

> **Alcance.** En el taller, cada equipo arma su propio Maze sobre el prototipo (Partes 2 y 3 del plan). Este protocolo
> es un estudio de referencia ya diseñado: las mismas tareas sobre Banco Aurora v1 y v2 publicadas en GitHub Pages,
> con Maze en modo *live website testing*. Sirve como ejemplo para los equipos, como piloto del facilitador o para
> medir con personas la diferencia entre v1 y v2.

Complementa la suite automatizada: las pruebas automáticas verifican criterios conocidos; el estudio con personas mide
**efectividad, eficiencia y satisfacción** (ISO 9241-11) y descubre problemas que ninguna regla detecta.

## 1. Objetivos

1. Comparar la tasa de éxito, el tiempo por tarea y la satisfacción (SUS) de Banco Aurora v1 frente a v2.
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
   - https://danielpulido01.github.io/Taller-Usabilidad/v1/
   - https://danielpulido01.github.io/Taller-Usabilidad/v2/
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

Cree el estudio **Banco Aurora v1** con estos bloques; luego duplíquelo como **Banco Aurora v2** y cambie solo las URL.
Cada tarea empieza en la pantalla de inicio de sesión de la URL de la versión.

| # | Bloque Maze | Contenido |
| --- | --- | --- |
| 0 | Context screen | Bienvenida y consentimiento: "Evaluamos el sistema, no a usted. Sus respuestas son anónimas. Puede abandonar cuando quiera. Es un prototipo: para entrar, escriba cualquier usuario y contraseña." |
| 1 | Multiple choice | ¿Con qué frecuencia usa la banca en línea? (Nunca / Algunas veces al mes / Cada semana o más) |
| 2 | Website test (T1) | "Envíe ₡25 000 a Ana Rodríguez Mora desde su cuenta de ahorros y descargue el comprobante." |
| 3 | Yes/No | Verificación T1: ¿Logró enviar el dinero y descargar el comprobante? |
| 4 | Multiple choice | Antes de enviar el dinero, ¿pudo revisar un resumen con el total? (Sí / No / No me fijé) |
| 5 | Opinion scale 1–7 | SEQ T1: En general, ¿qué tan fácil o difícil fue esta tarea? |
| 6 | Website test (T2) | "Quiere enviarle ₡2 000 000 a José Pablo Jiménez. Averigüe si es posible y, si no lo es, cuánto podría enviarle como máximo." |
| 7 | Yes/No | Verificación T2: ¿El sistema le indicó cuánto podía enviar como máximo? |
| 8 | Opinion scale 1–7 | SEQ T2 |
| 9 | Website test (T3) | "Cambió de número de celular. Actualícelo a 8812 9999." |
| 10 | Yes/No | Verificación T3: ¿Logró cambiar el número? |
| 11 | Open question | ¿Cómo supo que el cambio se guardó? |
| 12 | Opinion scale 1–7 | SEQ T3 |
| 13–22 | Opinion scale 1–5 | Cuestionario SUS (ítems en la sección 6) |
| 23 | Open question | ¿Qué fue lo más difícil o confuso? |
| 24 | Open question | Si pudiera cambiar una sola cosa, ¿cuál sería? |

**Qué problema de v1 mide cada tarea**

| Tarea | Problemas sembrados que encuentra el participante | Qué esperar en v1 |
| --- | --- | --- |
| T1 | D-02 "Continuar" poco visible, D-07 sin indicador de progreso, D-06 sin paso de revisión, D-05 comprobante escondido | Clics en "Cancelar", éxito indirecto y respuestas "No" a la pregunta del resumen |
| T2 | D-04 el error no explica cuánto se puede enviar | "No" en la verificación y SEQ bajo |
| T3 | D-01 menú "Mi Aurora", D-03 guardar sin aviso | Clics fuera de ruta en el menú; "no supe si se guardó" |

**Notas de diseño de tareas**

- Las tareas describen el objetivo, no la interfaz: no mencionan "Transferir", "Configuración" ni "Continuar".
- La app es una sola página: pasar de una pantalla a otra no cambia la URL, así que el éxito no puede definirse por la
  ruta de páginas. Por eso cada tarea tiene una **pregunta de verificación**; el éxito se cuenta cuando el participante
  indica que terminó **y** responde "Sí".
- La app está diseñada para computadora (1440 px). Configure el estudio solo para escritorio.
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

| Problema | ¿Lo detecta una prueba automática? | ¿Lo sufrieron los participantes? (tarea, n) | Severidad |
| --- | --- | --- | --- |
| D-06 Sin paso de revisión | Sí (T-01) | | |
| D-04 Error de monto sin explicación | Sí (T-02) | | |
| D-02 "Continuar" poco visible | Solo el síntoma (S-05) | | |
| D-01 Menú "Mi Aurora" | Solo si alguien escribe la prueba (S-01) | | |
| Problema nuevo descubierto por usuarios | No | | |

## 8. Plan B sin Maze

Si no hay cuenta de Maze disponible, las mismas tareas sirven con herramientas similares (Lyssna, UXtweak, Useberry) o
en una sesión moderada presencial: el moderador lee cada tarea, cronometra, anota éxito y comentarios, y las preguntas
SEQ/SUS se aplican con un formulario. El análisis y `scripts/sus.js` no cambian.
