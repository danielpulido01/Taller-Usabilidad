// Soluciones de referencia del paso 5.2: una prueba por cada problema sembrado que no cubren T-01 a T-03.
// Para ejecutarlas, copie este archivo a tests/. Cada una debe pasar con v2 y fallar con v1.
import { test, expect } from '@playwright/test';
import { ingresar, abrirTransferencia, completarTransferencia } from './ayudantes';

const menu = (page) => page.getByRole('navigation', { name: 'Principal' });

test.beforeEach(async ({ page }) => {
  await ingresar(page);
});

test('S-01 D-01 el menú usa un nombre claro para la configuración del perfil', async ({ page }) => {
  await menu(page).getByRole('button', { name: 'Configuración' }).click();
  await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible();
});

test('S-02 D-03 guardar el perfil muestra una confirmación', async ({ page }) => {
  // Se aceptan los dos nombres del menú para que esta prueba evalúe solo la confirmación (D-03) y no la etiqueta (D-01).
  await menu(page).getByRole('button', { name: /^(Configuración|Mi Aurora)$/ }).click();
  await page.getByLabel('Teléfono celular').fill('8812 9999');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText('Guardamos los cambios de tu perfil.')).toBeVisible({ timeout: 1_000 });
});

test('S-03 D-05 el comprobante se descarga sin abrir menús secundarios', async ({ page }) => {
  await completarTransferencia(page);
  await expect(page.getByRole('button', { name: 'Descargar comprobante' })).toBeVisible();
});

test('S-04 D-07 el flujo de transferencia indica en qué paso está el usuario', async ({ page }) => {
  await abrirTransferencia(page);
  await expect(page.getByText('Paso 1 de 3')).toBeVisible();
  await expect(page.getByRole('list', { name: 'Progreso de la transferencia' })).toBeVisible();
});

test('S-05 D-02 "Continuar" es el botón destacado y tiene un tamaño fácil de pulsar', async ({ page }) => {
  await abrirTransferencia(page);
  await page.getByText('Ana Rodríguez Mora', { exact: true }).click();
  const continuar = page.getByRole('button', { name: 'Continuar' });
  await expect(continuar, 'La acción principal debe usar el color de marca').toHaveCSS('background-color', 'rgb(211, 23, 46)');
  const caja = await continuar.boundingBox();
  expect(caja?.height, 'Altura mínima de 44 px').toBeGreaterThanOrEqual(44);
});
