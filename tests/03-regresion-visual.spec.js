// Regresión visual: detecta cambios no intencionales en la interfaz.
// Paso 1: npm run visual:base  (crea la línea base con v2)
// Paso 2: npm run visual:v1    (compara v1 contra la línea base y genera la imagen de diferencias)
import { test, expect } from '@playwright/test';
import { ingresar, abrirTransferencia } from './ayudantes';

test('T-04 @visual el paso 1 de la transferencia coincide con la línea base aprobada', async ({ page }) => {
  await ingresar(page);
  await abrirTransferencia(page);
  await page.getByText('Ana Rodríguez Mora', { exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('paso-1-destinatario.png', {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});
