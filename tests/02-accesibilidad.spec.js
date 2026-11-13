// Parte 5 del taller: revisión automática de accesibilidad (WCAG 2.2 A/AA) con axe-core.
// Hallazgo: "Bajo contraste o campos sin etiqueta". axe detecta solo una parte de los problemas de accesibilidad.
import { test, expect } from '@playwright/test';
import { ingresar, abrirTransferencia, revisarAccesibilidad } from './ayudantes';

test('T-03 las pantallas principales no tienen violaciones de accesibilidad detectables por axe', async ({ page }) => {
  const violaciones = [];
  const revisar = async (pantalla) => {
    for (const v of await revisarAccesibilidad(page)) violaciones.push(`[${pantalla}] ${v}`);
  };

  await page.goto('/');
  await revisar('Inicio de sesión');
  await ingresar(page);
  await revisar('Inicio');
  await abrirTransferencia(page);
  await revisar('Paso 1: destinatario');
  await page.getByText('Ana Rodríguez Mora', { exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await revisar('Paso 2: monto');

  expect(violaciones).toEqual([]);
});
