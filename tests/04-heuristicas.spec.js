// Categoría: Heurísticas de Nielsen y ergonomía de la interfaz
const { test, expect } = require('@playwright/test');
const { describir } = require('./ayudantes');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function buscar(page, termino) {
  await page.locator('#buscar').fill(termino);
  await page.locator('#buscar').press('Enter');
}

test('U-14 H1 Visibilidad del estado: la búsqueda informa cuántos resultados encontró', async ({ page }) => {
  await buscar(page, 'programación');
  await expect(page.locator('#lista-cursos > *')).toHaveCount(2);
  await expect(page.getByText(/2 cursos encontrados/i)).toBeVisible();
});

test('U-15 H9 Recuperación: una búsqueda sin resultados orienta al usuario', async ({ page }) => {
  await buscar(page, 'astrofísica');
  await expect(page.getByText(/no se encontraron cursos/i)).toBeVisible();
});

test('U-16 H3/H5 Retirar un curso pide confirmación y permite cancelar', async ({ page }) => {
  await page.locator('.inscribir').first().click();
  await expect(page.locator('#lista-inscritos li')).toHaveCount(1);

  let seConfirmo = false;
  page.once('dialog', async (d) => {
    seConfirmo = true;
    await d.dismiss(); // El usuario se arrepiente y cancela.
  });
  await page.locator('.retirar').first().click();

  expect(seConfirmo, 'La acción destructiva no pidió confirmación').toBe(true);
  await expect(page.locator('#lista-inscritos li'), 'El curso se eliminó aunque el usuario canceló').toHaveCount(1);
});

test('U-17 H2/H4 Los botones tienen nombres descriptivos', async ({ page }) => {
  await page.locator('.inscribir').first().click();
  const genericos = ['x', 'ok', 'ir', '...', 'aquí', 'click'];
  const malos = [];
  for (const b of await page.getByRole('button').all()) {
    const nombre = ((await b.getAttribute('aria-label')) || (await b.innerText())).trim().toLowerCase();
    if (nombre.length < 3 || genericos.includes(nombre)) malos.push(await describir(b));
  }
  expect(malos, 'Botones con nombre ambiguo').toEqual([]);
});

test('U-18 Los objetivos táctiles miden al menos 24 px (44 px en móvil)', async ({ page }, testInfo) => {
  await page.locator('.inscribir').first().click();
  const minimo = testInfo.project.name === 'movil' ? 44 : 24; // WCAG 2.5.8 (AA) / 2.5.5 (AAA)
  const pequenos = [];
  const controles = page.locator('button, .inscribir, nav a, nav span, #form-registro input, #form-registro select');
  for (const c of await controles.all()) {
    if (!(await c.isVisible())) continue;
    const caja = await c.boundingBox();
    if (caja && (caja.width < minimo || caja.height < minimo))
      pequenos.push(`${await describir(c)} ${Math.round(caja.width)}x${Math.round(caja.height)} px`);
  }
  expect(pequenos, `Controles menores de ${minimo}x${minimo} px`).toEqual([]);
});

test('U-19 El texto tiene un tamaño legible (al menos 16 px)', async ({ page }) => {
  const pequenos = await page.locator('body, p, li, label, input, select, button').evaluateAll((els) =>
    els
      .filter((el) => el.offsetParent !== null || el.tagName === 'BODY')
      .filter((el) => !el.classList.contains('sr-only'))
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
      .map((el) => `${el.tagName.toLowerCase()} (${getComputedStyle(el).fontSize})`)
  );
  expect([...new Set(pequenos)], 'Elementos con texto menor a 16 px').toEqual([]);
});
