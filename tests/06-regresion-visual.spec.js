// Categoría: Regresión visual — detecta cambios no intencionales en la interfaz
// Paso 1: npm run visual:base  (crea la línea base con la versión v2)
// Paso 2: npm run visual:v1    (compara v1 contra la línea base y genera la imagen de diferencias)
const { test, expect } = require('@playwright/test');

test('U-24 @visual La interfaz coincide con la línea base aprobada', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(600);
  await expect(page).toHaveScreenshot('inicio.png', {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});
