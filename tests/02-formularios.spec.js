// Categoría: Formularios — Nielsen H5 (prevención de errores), H9 (ayudar a reconocer y recuperarse de errores)
const { test, expect } = require('@playwright/test');

const obligatorios = ['nombre', 'correo', 'carrera', 'contrasena'];
const campo = (page, nombre) => page.locator(`#form-registro [name="${nombre}"]`);
const enviar = (page) => page.locator('#form-registro [type="submit"]').click();

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('U-04 Cada campo tiene una etiqueta visible asociada (no solo placeholder)', async ({ page }) => {
  const sinEtiqueta = await page.locator('#form-registro input, #form-registro select').evaluateAll((els) =>
    els
      .filter((el) => {
        const etiquetas = Array.from(el.labels || []).filter((l) => l.offsetParent !== null && l.innerText.trim());
        return etiquetas.length === 0;
      })
      .map((el) => el.name || el.id)
  );
  expect(sinEtiqueta, 'Campos que dependen del placeholder como única etiqueta').toEqual([]);
});

test('U-05 Los campos usan el tipo de entrada y autocompletado adecuados', async ({ page }) => {
  const esperado = {
    nombre: { type: 'text', autocomplete: 'name' },
    correo: { type: 'email', autocomplete: 'email' },
    telefono: { type: 'tel', autocomplete: 'tel' },
    contrasena: { type: 'password', autocomplete: 'new-password' },
  };
  const problemas = [];
  for (const [nombre, attrs] of Object.entries(esperado)) {
    const loc = campo(page, nombre);
    const type = (await loc.getAttribute('type')) || 'text';
    const autocomplete = await loc.getAttribute('autocomplete');
    if (type !== attrs.type) problemas.push(`${nombre}: type="${type}" (esperado "${attrs.type}")`);
    if (autocomplete !== attrs.autocomplete)
      problemas.push(`${nombre}: autocomplete="${autocomplete}" (esperado "${attrs.autocomplete}")`);
  }
  expect(problemas).toEqual([]);
});

test('U-06 Enviar vacío muestra un error específico junto a cada campo obligatorio', async ({ page }) => {
  await enviar(page);
  for (const nombre of obligatorios) {
    const loc = campo(page, nombre);
    await expect(loc, `${nombre} debe marcarse como inválido`).toHaveAttribute('aria-invalid', 'true');
    const ids = ((await loc.getAttribute('aria-describedby')) || '').split(/\s+/).filter(Boolean);
    const textos = [];
    for (const id of ids) {
      const desc = page.locator(`[id="${id}"]`);
      if (await desc.isVisible()) textos.push((await desc.innerText()).trim());
    }
    const error = textos.find((t) => t.length > 10);
    expect(error, `${nombre}: no hay mensaje de error descriptivo asociado al campo`).toBeTruthy();
  }
});

test('U-07 Tras un error, el foco se mueve al primer campo inválido', async ({ page }) => {
  await enviar(page);
  await expect(campo(page, 'nombre')).toBeFocused();
});

test('U-08 Los datos escritos se conservan cuando hay un error de validación', async ({ page }) => {
  await campo(page, 'nombre').fill('Ana Pérez Mora');
  await campo(page, 'correo').fill('ana-correo-invalido');
  await enviar(page);
  await expect(campo(page, 'nombre'), 'El formulario borró lo que el usuario escribió').toHaveValue('Ana Pérez Mora');
  await expect(campo(page, 'correo')).toHaveValue('ana-correo-invalido');
});

test('U-09 Un registro exitoso confirma la acción en menos de 1 segundo', async ({ page }) => {
  await campo(page, 'nombre').fill('Ana Pérez Mora');
  await campo(page, 'correo').fill('ana.perez@correo.com');
  await campo(page, 'carrera').selectOption('Ingeniería de Software');
  await campo(page, 'contrasena').fill('ClaveSegura2026');
  await enviar(page);
  // Nielsen (1993): 1 s es el límite para que el usuario no pierda el hilo de la acción.
  await expect(page.locator('#mensaje-registro')).toContainText(/cuenta creada/i, { timeout: 1_000 });
});
