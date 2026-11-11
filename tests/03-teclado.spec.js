// Categoría: Operabilidad por teclado — WCAG 2.1.1, 2.4.1, 2.4.7 · ISO/IEC 25010: Operabilidad
const { test, expect } = require('@playwright/test');
const { recorrerConTab } = require('./ayudantes');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('U-10 El primer Tab lleva a un enlace "Saltar al contenido"', async ({ page }) => {
  await page.keyboard.press('Tab');
  const enfocado = page.locator(':focus');
  await expect(enfocado, 'No existe un enlace para saltar la navegación').toHaveText(/saltar al contenido/i);
  await expect(enfocado).toBeVisible();
});

test('U-11 Todos los controles interactivos son alcanzables con Tab', async ({ page }) => {
  await recorrerConTab(page, 80);
  const noAlcanzados = await page
    .locator('.inscribir, nav a, nav span, #form-registro input, #form-registro select, #form-registro [type="submit"], #buscar')
    .evaluateAll((els) =>
      els
        .filter((el) => el.getAttribute('data-visitado') !== '1' && !el.disabled)
        .map((el) => `${el.tagName.toLowerCase()}: ${(el.innerText || el.name || el.id).trim().slice(0, 30)}`)
    );
  expect(noAlcanzados, 'Controles que no se pueden usar con teclado').toEqual([]);
});

test('U-12 El indicador de foco es visible en cada control', async ({ page }) => {
  const paradas = await recorrerConTab(page, 30);
  expect(paradas.length).toBeGreaterThan(0);
  const sinFoco = paradas.filter((p) => !p.focoVisible).map((p) => `${p.etiqueta}: ${p.texto}`);
  expect(sinFoco, 'Controles sin indicador de foco visible').toEqual([]);
});

test('U-13 Se puede inscribir un curso usando solo el teclado', async ({ page }) => {
  let encontrado = false;
  for (let i = 0; i < 40 && !encontrado; i++) {
    await page.keyboard.press('Tab');
    encontrado = await page.evaluate(() => document.activeElement?.classList.contains('inscribir') ?? false);
  }
  expect(encontrado, 'El botón "Inscribir" no recibe el foco con Tab').toBe(true);
  await page.keyboard.press('Enter');
  await expect(page.locator('#lista-inscritos li')).toHaveCount(1);
});
