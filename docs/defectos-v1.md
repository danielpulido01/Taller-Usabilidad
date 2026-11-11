# Defectos intencionales de UniCursos v1

La versión `app/v1` contiene 14 defectos de usabilidad sembrados a propósito. La versión `app/v2` los corrige.
Cada defecto está asociado a la(s) prueba(s) que lo detectan.

| ID | Defecto en v1 | Corrección en v2 | Norma / heurística | Prueba |
| --- | --- | --- | --- | --- |
| D-01 | `<html>` sin `lang` y sin `<title>` | `lang="es"` y título descriptivo | WCAG 3.1.1, 2.4.2 | U-01, U-02 |
| D-02 | Logo sin texto alternativo | `alt="UniCursos"` | WCAG 1.1.1 | U-01, U-03 |
| D-03 | Campos con placeholder como única etiqueta | `<label for>` visible | WCAG 1.3.1, 3.3.2 · H6 | U-04 |
| D-04 | Error genérico "Error" lejos del campo y se borran los datos | Mensaje específico junto al campo, `aria-invalid`, foco al primer error, datos conservados | WCAG 3.3.1, 3.3.3 · H9 | U-06, U-07, U-08 |
| D-05 | Confirmación de registro tarda 3 s | Confirmación inmediata en región `role="status"` | H1 · Nielsen (1 s) | U-09 |
| D-06 | Texto gris #b0b0b0 sobre blanco (2.1:1) | Contraste ≥ 4.5:1 | WCAG 1.4.3 | U-01 |
| D-07 | "Inscribir" es un `<div>` con `onclick` | `<button>` nativo | WCAG 2.1.1, 4.1.2 | U-11, U-13 |
| D-08 | `*:focus { outline: none }` | `:focus-visible` con contorno de 3 px | WCAG 2.4.7 | U-12 |
| D-09 | La búsqueda no informa resultados ni orienta si no hay | Mensaje con conteo y sugerencia | H1, H9 · WCAG 4.1.3 | U-14, U-15 |
| D-10 | Botón de retiro de 16×16 px con texto "x" | Botón "Retirar <curso>" de 44 px | WCAG 2.5.8 · H2 | U-17, U-18 |
| D-11 | Retiro inmediato, sin confirmación | `confirm()` con opción de cancelar | H3, H5 | U-16 |
| D-12 | Ancho fijo de 1100 px y sin `meta viewport` | Diseño fluido y viewport adaptable | WCAG 1.4.10 | U-20, U-21 |
| D-13 | Banner que aparece tarde y empuja el contenido | Sin inserciones tardías sobre el contenido | Core Web Vitals (CLS) | U-22 |
| D-14 | Script que bloquea la carga 1.2 s y texto de 12 px | Sin scripts bloqueantes; texto ≥ 16 px | Core Web Vitals · legibilidad | U-19, U-23 |

Además, el menú de v1 usa `<span onclick>` (no alcanzable por teclado), y no existe enlace "Saltar al contenido" (U-10, WCAG 2.4.1).
