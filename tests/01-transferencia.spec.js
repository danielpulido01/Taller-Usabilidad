// Parte 5 del taller: de hallazgo de usabilidad corregido a prueba que lo protege.
// Hallazgos: "El dinero se enviaba sin poder revisar" y "El error de monto no explicaba qué hacer".
import { test, expect } from '@playwright/test';
import { ingresar, abrirTransferencia } from './ayudantes';

test.beforeEach(async ({ page }) => {
  await ingresar(page);
  await abrirTransferencia(page);
  await page.getByText('Ana Rodríguez Mora', { exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
});

test('T-01 el usuario revisa la transferencia antes de enviarla y recibe un comprobante', async ({ page }) => {
  await page.getByLabel('Monto en colones').fill('25000');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Prevención de errores (heurística 5): una operación que no se puede revertir se revisa antes de enviarla.
  await expect(page.getByRole('heading', { name: 'Confirma tu transferencia' }), 'No hay paso de revisión').toBeVisible();
  await expect(page.getByText('Total a debitar')).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar transferencia' }).click();

  await expect(page.getByRole('heading', { name: 'Transferencia exitosa' })).toBeVisible();
  await expect(page.getByText(/AUR-\d{4}-\d{8}/), 'El comprobante debe mostrar el número de referencia').toBeVisible();
});

test('T-02 el error de monto explica qué pasó y cómo corregirlo', async ({ page }) => {
  await page.getByLabel('Monto en colones').fill('2000000');

  // Heurística 9: el mensaje dice qué pasó y cuánto se puede transferir.
  const error = page.getByRole('alert');
  await expect(error).toContainText('El monto supera tu saldo disponible');
  await expect(error).toContainText(/Puedes transferir hasta ₡1\s284\s560,75/);
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
});
