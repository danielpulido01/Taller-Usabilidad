# Taller de usabilidad de software

En este taller vas a evaluar y mejorar la usabilidad de **Banco Aurora**, un prototipo de banca en línea. 

**inspeccionar → probar con usuarios → medir → priorizar → iterar → proteger**

La versión 1 (v1) del prototipo trae problemas de usabilidad sembrados a propósito. Tu equipo la evalúa, la prueba con personas, la mejora (v2) y al final compara las métricas de v1 contra v2.

| Recurso | Enlace |
| --- | --- |
| Prototipo v1 | https://danielpulido01.github.io/Taller-Usabilidad/v1/ |
| Prototipo v2 de referencia | https://danielpulido01.github.io/Taller-Usabilidad/v2/ |
| Archivo de Figma para el rediseño | [Figma](https://www.figma.com/make/PDx3YgBTHZygXRdFL0hE3q/Prototipo-de-Transferencias-Bancarias?p=f&t=wZQFSqsVF7QVphZH-0) |

Para entrar al prototipo, escribe cualquier usuario y contraseña.

---

## Requisitos

1. Instala [Node.js](https://nodejs.org/) 20 o superior y [Git](https://git-scm.com/).
2. Ejecuta en una terminal:

   ```bash
   git clone https://github.com/danielpulido01/Taller-Usabilidad.git
   cd Taller-Usabilidad
   npm install
   npx playwright install chromium
   npm run test:v2
   ```

3. La última línea debe decir **`3 passed`**. Crear una cuenta en [Maze](https://maze.co).

---

## Las 10 heurísticas de Nielsen

| # | Heurística | En una frase |
| --- | --- | --- |
| 1 | Visibilidad del estado del sistema | El usuario siempre sabe qué está pasando: cargando, guardado, error |
| 2 | Coincidencia entre el sistema y el mundo real | Lenguaje y conceptos del usuario, no jerga interna |
| 3 | Control y libertad del usuario | Deshacer, cancelar y salir fácilmente |
| 4 | Consistencia y estándares | Lo mismo se ve y se llama igual en todas partes, y respeta las convenciones |
| 5 | Prevención de errores | Mejor evitar el error que explicarlo: confirmaciones, valores por defecto, restricciones |
| 6 | Reconocer antes que recordar | Opciones visibles; no obligar a memorizar |
| 7 | Flexibilidad y eficiencia de uso | Atajos para expertos sin estorbar a quienes empiezan |
| 8 | Diseño estético y minimalista | Cada elemento extra compite con lo importante |
| 9 | Ayudar a reconocer, diagnosticar y recuperarse de errores | Mensajes claros, en lenguaje simple, con una solución |
| 10 | Ayuda y documentación | Fácil de encontrar y orientada a tareas |

### Escala de severidad

| Nivel | Significado |
| --- | --- |
| 0 | No es un problema de usabilidad |
| 1 | Cosmético: se arregla si sobra tiempo |
| 2 | Menor: prioridad baja |
| 3 | Mayor: prioridad alta |
| 4 | Catástrofe: hay que arreglarlo antes de lanzar |

### Ejercicio: evaluación heurística del prototipo v1

1. En los grupos de trabajo.
2. **Evaluación individual** Recorre el [prototipo v1](https://danielpulido01.github.io/Taller-Usabilidad/v1/) por tu cuenta y anota tus hallazgos en la plantilla. No los comentes todavía.
3. **Consolidación en equipo.** Unan los duplicados y acuerden una severidad por hallazgo.
4. **Puesta en común.** Definir sus 3 problemas más graves.

**Plantilla de hallazgos**
| # | Pantalla | Heurística violada | Descripción del problema | Severidad (0–4) | Propuesta de solución |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |

**Resultado:** la lista de hallazgos.

---

## Pruebas de tareas con Maze

[Maze](https://maze.co) hace pruebas de usabilidad remotas y no moderadas. Defines tareas, compartes un enlace y los participantes las hacen solos. Maze registra clics, rutas, tiempos y abandonos.

### Preparar el test

1. En Maze, crea un estudio con un bloque **Website test** por tarea y usa la URL del [prototipo v1](https://danielpulido01.github.io/Taller-Usabilidad/v1/).
2. Define de 3 a 5 tareas realistas.
3. Redacta las tareas sin dar pistas: describe el objetivo, no la interfaz.
4. Haz un piloto con 1 o 2 personas para detectar tareas confusas o mal redactadas.

| ❌ Redacción con pista | ✅ Redacción neutral |
| --- | --- |
| "Haz clic en Configuración y cambia tu foto" | "Quieres que tus amigos te reconozcan. Cambia tu foto de perfil." |
| "Usa el botón Filtros para buscar laptops baratas" | "Encuentra una laptop de menos de $500." |

### Métricas que hay que mirar

- **Éxito directo:** completó la tarea por el camino esperado.
- **Éxito indirecto:** la completó, pero dando vueltas. Es señal de navegación confusa.
- **Abandono o fallo:** no la completó.
- **Misclicks y mapas de calor:** dónde hace clic la gente esperando encontrar algo.
- **Tiempo por tarea** y pantallas donde se pierden.

### Definir la meta antes de probar

Acuerden los criterios de aceptación **antes** de ver resultados. Por ejemplo: éxito directo ≥ 80 % en cada tarea, sin pantallas con abandono masivo y SUS ≥ 68. Sin una meta previa es muy fácil justificar cualquier resultado.

### SEQ (Single Ease Question): después de cada tarea

Una sola pregunta, justo al terminar cada tarea:

> En general, ¿qué tan fácil o difícil fue esta tarea? (1 = Muy difícil, 7 = Muy fácil)

- En Maze se agrega como pregunta de escala (*Opinion scale*) después de cada tarea.
- Permite comparar tareas entre sí: la de peor SEQ suele ser la primera candidata a rediseñar.
- Como referencia, el promedio en la literatura ronda 5.5.

### SUS (System Usability Scale): una vez, al final

Diez afirmaciones (John Brooke, 1986), cada una de 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo):

1. Creo que me gustaría usar este sistema con frecuencia.
2. Encontré el sistema innecesariamente complejo.
3. Pensé que el sistema era fácil de usar.
4. Creo que necesitaría el apoyo de una persona técnica para poder usar este sistema.
5. Encontré que las distintas funciones del sistema estaban bien integradas.
6. Pensé que había demasiadas inconsistencias en el sistema.
7. Imagino que la mayoría de las personas aprendería a usar este sistema muy rápido.
8. Encontré el sistema muy engorroso de usar.
9. Me sentí muy seguro/a usando el sistema.
10. Necesité aprender muchas cosas antes de poder empezar a usar el sistema.

Las afirmaciones alternan entre positivas (impares) y negativas (pares) para que la gente no responda todo igual sin
leer.

**Cálculo**

1. Ítems impares (1, 3, 5, 7, 9): valor − 1.
2. Ítems pares (2, 4, 6, 8, 10): 5 − valor.
3. Suma los 10 resultados (de 0 a 40) y multiplica por 2.5. Queda un puntaje de 0 a 100.
4. El puntaje del sistema es el promedio de todos los participantes.

El SUS **no es un porcentaje**: un 68 no significa "68 % usable".

| Puntaje SUS | Lectura aproximada |
| --- | --- |
| < 51 | Problemas serios |
| ≈ 68 | Promedio de la industria |
| ≈ 71 | "Bueno" en la escala de adjetivos |
| ≥ 80 | Muy bueno (cerca del 10 % superior) |
| ≥ 85 | Excelente |

- **Análisis por ítem.** Los ítems 4 y 10 se asocian a la facilidad de aprendizaje. Si solo esos salen mal, el
  problema probablemente está en la bienvenida y la ayuda, no en el flujo principal.
- **Muestras pequeñas.** Con 5 a 8 personas el número varía mucho. Úsalo para comparar v1 contra v2, no como verdad
  absoluta.
- **Pregunta abierta al final:** "¿Qué fue lo más difícil o frustrante?". Da el porqué que el número no da.

### Ejercicio

1. Cada persona hace el Maze.
2. Responde cuestionarios SEQ y SUS.
3. Revisamos resultados.

---

## Análisis, priorización e iteración

### El ciclo de iteración

1. **Triangular** los datos de todas las fuentes.
2. **Priorizar** por gravedad y frecuencia.
3. **Formular hipótesis** de por qué ocurre cada problema.
4. **Rediseñar** solo los 2 o 3 problemas más graves (v2).
5. **Volver a probar** con usuarios nuevos y comparar v1 contra v2.
6. **Decidir:** parar si se alcanzó la meta o si las rondas ya no encuentran problemas graves; si no, volver al paso 1.

### Paso 1: triangular

Junta en una sola tabla lo que dijeron las tres fuentes. Un problema que aparece en varias fuentes es más confiable.

| Problema | Heurística | Maze (éxito, misclicks, abandono) | SEQ / SUS | Comentarios de usuarios |
| --- | --- | --- | --- | --- |
| Ej.: no encuentran cómo guardar | 6 Reconocer antes que recordar, sev. 3 | Tarea 2: 40 % éxito directo, misclicks en el menú superior | SEQ 3.1 | "No sabía si se había guardado" |
| | | | | |

### Paso 2: priorizar

- **Prioridad = severidad × frecuencia** (cuántos usuarios lo sufrieron).
- Si hay empate, usa una matriz impacto/esfuerzo: primero lo de alto impacto y bajo esfuerzo.

### Paso 3: hipótesis

> Creemos que **[cambio]** hará que **[usuarios]** logren **[resultado]**. Lo sabremos cuando **[métrica]** pase de
> **[valor v1]** a **[meta]**.

Ejemplo: "Creemos que mover el botón Guardar a la parte inferior del formulario y mostrar una confirmación hará que los
usuarios completen la tarea 2. Lo sabremos cuando el éxito directo pase de 40 % a ≥ 80 %."

### Paso 4: rediseñar (v2)

- Duplica el archivo o la página de Figma para conservar v1 intacta.
- Cambia solo lo que dicen las hipótesis elegidas. Si cambias todo a la vez, no sabrás qué funcionó.

### Paso 5: volver a probar y comparar

- Duplica tu Maze, cambia la URL a tu v2 y mantén las mismas tareas y cuestionarios.
- Prueba con personas nuevas (otro equipo): quienes ya hicieron v1 aprendieron la interfaz.

| Métrica | v1 | v2 | ¿Alcanzó la meta? |
| --- | --- | --- | --- |
| Éxito directo tarea 1 | | | |
| Éxito directo tarea 2 | | | |
| Éxito directo tarea 3 | | | |
| Misclicks promedio | | | |
| SEQ promedio | | | |
| SUS | | | |

### Si los resultados no mejoran

| Lo que ves | Causa probable | Qué hacer |
| --- | --- | --- |
| La tarea falla igual en v1 y v2 | La hipótesis estaba equivocada | Observar a 1 o 2 personas pensando en voz alta para entender el porqué |
| Mejora la tarea, pero aparece un problema nuevo | El cambio rompió otra cosa | Revisar los mapas de calor de la pantalla cambiada |
| Los resultados varían muchísimo entre personas | Tarea mal redactada o muestra muy chica | Revisar la redacción con un piloto y sumar participantes |
| Las tareas salen bien, pero el SUS sigue bajo | Problemas fuera de las tareas probadas: estética, confianza, aprendizaje | Revisar los ítems 4 y 10 y los comentarios abiertos |
| Éxito alto, pero muchos éxitos indirectos | La navegación confunde aunque al final lo logran | Revisar las rutas; considerar tree testing |

### Ejercicio

1. Llena la tabla de triangulación con los datos.
2. Elige los 2 o 3 problemas prioritarios y escribe sus hipótesis.
3. Rediseña la v2 en Figma.
4. Vuelve a correr el Maze con otro equipo y llena la tabla de v1 contra v2.
5. **Cierre:** cada equipo presenta qué cambió, qué métrica se movió y qué haría en una tercera ronda.

---

## Proteger los flujos con Playwright

[Playwright](https://playwright.dev/) automatiza un navegador real para correr pruebas de extremo a extremo. **No mide usabilidad**: no sabe si algo es fácil o confuso. Su papel en el ciclo es **proteger lo que ya aprendiste**: cada problema corregido se convierte en una prueba que avisa si alguien lo vuelve a romper.

Este repositorio tiene Banco Aurora como app web:

- `app/v1`: la misma v1 que evaluaste, con los mismos problemas.
- `app/v2`: una versión con los problemas corregidos.

### De hallazgo a prueba

| Hallazgo de usabilidad corregido | Prueba en Playwright |
| --- | --- |
| No encontraban cómo completar un flujo | Prueba de flujo: se completa de principio a fin |
| No había confirmación al guardar | Verificar que aparece el mensaje de confirmación |
| El error no explicaba qué hacer | Verificar el texto del mensaje de error |
| Botón sin texto, solo un ícono | Ubicarlo por rol y nombre accesible; si no lo encuentra, el botón no tiene nombre |
| Bajo contraste o campos sin etiqueta | Revisión automática de accesibilidad con axe |
| El botón principal volvió a quedar escondido | Regresión visual con captura de pantalla |

Usar localizadores como `getByRole` y `getByLabel` ya es una pequeña prueba de accesibilidad, porque solo funcionan si los elementos tienen rol y nombre accesibles.

### Las pruebas de ejemplo

| Prueba | Archivo | Qué protege |
| --- | --- | --- |
| T-01 | `tests/01-transferencia.spec.js` | La transferencia se revisa antes de enviarse y termina con un comprobante |
| T-02 | `tests/01-transferencia.spec.js` | El error de monto explica cuánto se puede transferir |
| T-03 | `tests/02-accesibilidad.spec.js` | Ninguna de 4 pantallas tiene violaciones de accesibilidad detectables por axe |
| T-04 | `tests/03-regresion-visual.spec.js` | El paso 1 de la transferencia se ve igual que la versión aprobada |

Así se ve una prueba (T-02):

```js
test('T-02 el error de monto explica qué pasó y cómo corregirlo', async ({ page }) => {
  await page.getByLabel('Monto en colones').fill('2000000');

  const error = page.getByRole('alert');
  await expect(error).toContainText('El monto supera tu saldo disponible');
  await expect(error).toContainText(/Puedes transferir hasta ₡1\s284\s560,75/);
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
});
```

Antes de cada prueba, `test.beforeEach` inicia sesión y llega al paso 2 de la transferencia.

```bash
npm run test:v2      # 3 passed: la versión corregida cumple
npm run test:v1      # 3 failed: las pruebas detectan los problemas
```

---

## Referencia del repositorio

| Comando | Qué hace |
| --- | --- |
| `npm run servidor:v1` / `servidor:v2` | Abre la app en http://localhost:4173 |
| `npm run test:v1` / `test:v2` | Ejecuta las pruebas T-01 a T-03 contra esa versión |
| `npm run visual:base` | Crea la línea base visual con v2 |
| `npm run visual:v1` / `visual:v2` | Compara esa versión con la línea base |
| `npm run reporte` | Abre el reporte HTML del último run, con capturas y trazas |
| `npm run resumen` | Genera la matriz v1 vs v2 en `reportes/resumen.md` |
| `npm run sus` | Calcula el SUS por versión desde `estudio/resultados-sus.csv` |

```
app/v1, app/v2        App de demostración (React, Vite y Tailwind, exportada de Figma Make)
tests/                Pruebas de ejemplo T-01..T-04 y funciones de apoyo (ayudantes.js)
estudio/              Plantilla CSV para el SUS
figma/                Exportación original del prototipo en Figma Make
docs/facilitador/     Material para quien dirige el taller (contiene las soluciones)
soluciones/           Pruebas de solución (contiene las soluciones)
```

Herramientas: [Playwright](https://playwright.dev/), [axe-core](https://github.com/dequelabs/axe-core-npm),
[Maze](https://maze.co), React 19, Vite 6 y Tailwind CSS 4.
