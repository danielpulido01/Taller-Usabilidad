// Funciones de apoyo compartidas por las pruebas.
const AxeBuilder = require('@axe-core/playwright').default;

/** Inicia sesión en el prototipo (acepta cualquier usuario y contraseña) y espera el inicio. */
async function ingresar(page) {
  await page.goto('/');
  await page.getByLabel('Usuario').fill('mvargas');
  await page.getByLabel('Contraseña', { exact: true }).fill('Prueba123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('heading', { name: 'Usuario Test' }).waitFor();
}

/** Desde el inicio, abre el paso 1 de la transferencia con el botón principal de la tarjeta de saldo. */
async function abrirTransferencia(page) {
  // El primero es el botón principal de la tarjeta de saldo; el segundo, el acceso rápido.
  await page.getByRole('main').getByRole('button', { name: 'Transferir', exact: true }).first().click();
  await page.getByRole('heading', { name: '¿A quién le transfieres?' }).waitFor();
}

/** Ejecuta axe-core con las reglas WCAG 2.2 A/AA y devuelve un resumen legible por violación. */
async function revisarAccesibilidad(page) {
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return resultado.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`
  );
}

module.exports = { ingresar, abrirTransferencia, revisarAccesibilidad };

/**
 * Hace una transferencia de ₡25 000 a Ana Rodríguez hasta la pantalla de éxito.
 * Funciona en v1 y en v2 (ubica el monto por id y confirma solo si existe el paso de confirmación) para que las
 * pruebas de la pantalla de éxito no fallen por otros defectos del camino.
 */
async function completarTransferencia(page) {
  await abrirTransferencia(page);
  await page.getByText('Ana Rodríguez Mora', { exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.locator('#amount').fill('25000');
  await page.getByRole('button', { name: 'Continuar' }).click();
  const confirmar = page.getByRole('button', { name: 'Confirmar transferencia' });
  const exito = page.getByRole('heading', { name: 'Transferencia exitosa' });
  await confirmar.or(exito).waitFor();
  if (await confirmar.isVisible()) await confirmar.click();
  await exito.waitFor();
}

module.exports.completarTransferencia = completarTransferencia;
