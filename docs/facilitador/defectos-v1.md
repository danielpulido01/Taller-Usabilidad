# Problemas sembrados en Banco Aurora v1

`app/v2` es el prototipo de Figma Make tal como se exportó (carpeta `figma/`). `app/v1` es una copia con 9 problemas
sembrados a propósito: 7 de usabilidad, para las Partes 1 a 4 del taller, y 2 de accesibilidad, para el paso 5.3. Cada
cambio está marcado en el código con un comentario `Defecto D-xx`.

| ID | Problema en v1 | Corrección (v2) | Heurística o criterio | Dónde (`app/v1/src/`) | Prueba |
| --- | --- | --- | --- | --- | --- |
| D-01 | El menú llama "Mi Aurora" a la configuración del perfil | "Configuración" | 2 Coincidencia con el mundo real · 4 Consistencia | `components/Shell.tsx` | S-01 |
| D-02 | En el paso 1, "Continuar" parece un enlace gris pequeño y "Cancelar" es el botón destacado | "Continuar" es el botón principal de 48 px | 8 Diseño estético y minimalista · 5 Prevención de errores | `screens/Transfer.tsx` | S-05 |
| D-03 | Guardar el perfil no muestra ningún aviso | Aviso "Guardamos los cambios de tu perfil." | 1 Visibilidad del estado | `App.tsx` | S-02 |
| D-04 | Si el monto supera el saldo, solo dice "Error: monto inválido." | Explica el problema y cuánto se puede transferir | 9 Reconocer y recuperarse de errores | `screens/Transfer.tsx` | T-02 |
| D-05 | "Descargar comprobante" está escondido en un menú "⋯" | Botón visible en la pantalla de éxito | 6 Reconocer antes que recordar · 7 Flexibilidad | `screens/Transfer.tsx` | S-03 |
| D-06 | "Continuar" en el paso 2 envía el dinero sin mostrar el resumen | Paso 3 "Confirma tu transferencia" con el total | 5 Prevención de errores · 3 Control y libertad | `App.tsx` | T-01 |
| D-07 | No se indica en qué paso del proceso está el usuario | "Paso 1 de 3" e indicador de progreso | 1 Visibilidad del estado | `screens/Transfer.tsx` | S-04 |
| D-08 | El campo del monto no tiene etiqueta asociada | `<label for="amount">Monto en colones</label>` | WCAG 1.3.1, 3.3.2 | `screens/Transfer.tsx` | T-03 |
| D-09 | El texto secundario tiene bajo contraste (#a1a1aa, 2.6:1) | #6b6b6b (5.3:1) | WCAG 1.4.3 | `index.css` | T-03 |

**Pruebas.** Los ejemplos T-01 a T-04 están en `tests/`. Las pruebas S-01 a S-05 son las soluciones de referencia del
paso 5.2 y están en `soluciones/`. Todas pasan con v2 y fallan con v1.

**Orden de las fallas en v1.** T-01 y T-02 fallan primero porque no encuentran el campo del monto por su etiqueta
(D-08). Cuando se corrige D-08 en el paso 5.3, fallan por el problema de usabilidad que protegen: D-06 y D-04.
