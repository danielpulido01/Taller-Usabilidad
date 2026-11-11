// Categoría: Adaptabilidad móvil y rendimiento percibido — ISO/IEC 25010: Eficiencia de desempeño / Usabilidad
const { test, expect } = require('@playwright/test');
const { medirCLS } = require('./ayudantes');

test('U-20 La página declara un viewport adaptable a móviles', async ({ page }) => {
  await page.goto('/');
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content').catch(() => null);
  expect(viewport, 'Falta <meta name="viewport">').toContain('width=device-width');
});

test('U-21 No hay desplazamiento horizontal en un teléfono', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'movil', 'Solo aplica al proyecto móvil');
  await page.goto('/');
  const { ancho, visible } = await page.evaluate(() => ({
    ancho: document.documentElement.scrollWidth,
    visible: document.documentElement.clientWidth,
  }));
  expect(ancho, `El contenido mide ${ancho}px en una pantalla de ${visible}px`).toBeLessThanOrEqual(visible + 1);
});

test('U-22 El contenido es estable al cargar (CLS < 0.1)', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1_000); // Dar tiempo a elementos que aparecen tarde.
  const cls = await medirCLS(page);
  test.info().annotations.push({ type: 'CLS', description: String(cls) });
  expect(cls, 'Cumulative Layout Shift (Core Web Vitals: bueno < 0.1)').toBeLessThan(0.1);
});

test('U-23 La página está lista para usarse en menos de 1 segundo', async ({ page }) => {
  await page.goto('/');
  const ms = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return Math.round(nav.domContentLoadedEventEnd);
  });
  test.info().annotations.push({ type: 'DOMContentLoaded (ms)', description: String(ms) });
  expect(ms, 'Tiempo hasta DOMContentLoaded en ms').toBeLessThan(1_000);
});
