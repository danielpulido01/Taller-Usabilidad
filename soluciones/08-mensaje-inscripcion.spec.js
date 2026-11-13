// Solución del ejercicio E6. Copiar a tests/ para ejecutarla.
// Categoría: Heurísticas — Nielsen H2 (lenguaje del usuario) y H1 (visibilidad del estado)
const { test, expect } = require('@playwright/test');

test('U-26 H1/H2 Inscribir confirma en lenguaje claro qué curso se inscribió', async ({ page }) => {
  await page.goto('/');
  const tarjeta = page.locator('#lista-cursos > *').filter({ hasText: 'Calidad del Software' });
  await tarjeta.locator('.inscribir').click();
  await expect(page.locator('#estado-inscripcion'), 'El mensaje debe nombrar el curso inscrito').toContainText(
    /inscribió en calidad del software/i,
    { timeout: 1_000 }
  );
});
