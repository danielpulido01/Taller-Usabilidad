// Categoría: Accesibilidad (WCAG 2.2 AA) — ISO/IEC 25010: Usabilidad › Accesibilidad
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('U-01 La página no presenta violaciones WCAG 2.2 A/AA detectables por axe-core', async ({ page }, testInfo) => {
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  await testInfo.attach('axe-resultado.json', {
    body: JSON.stringify(resultado.violations, null, 2),
    contentType: 'application/json',
  });

  const resumen = resultado.violations.map(
    (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elemento/s)`
  );
  expect(resumen, 'Violaciones de accesibilidad encontradas').toEqual([]);
});

test('U-02 El documento declara idioma español y un título descriptivo', async ({ page }) => {
  const idioma = await page.locator('html').getAttribute('lang');
  expect(idioma, 'Falta lang="es" en <html> (lectores de pantalla pronuncian mal)').toMatch(/^es/);
  const titulo = await page.title();
  expect(titulo.length, 'El <title> está vacío o es genérico').toBeGreaterThan(5);
});

test('U-03 Todas las imágenes tienen texto alternativo', async ({ page }) => {
  const sinAlt = await page.locator('img').evaluateAll((imgs) =>
    imgs
      .filter((i) => !i.hasAttribute('alt') && i.getAttribute('role') !== 'presentation')
      .map((i) => i.getAttribute('src'))
  );
  expect(sinAlt, 'Imágenes sin atributo alt').toEqual([]);
});
