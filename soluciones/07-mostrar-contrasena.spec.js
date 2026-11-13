// Solución del ejercicio E4. Copiar a tests/ para ejecutarla.
// Categoría: Formularios — WCAG 4.1.2 (nombre, rol, valor) · Nielsen H1 (visibilidad del estado)
const { test, expect } = require('@playwright/test');

test('U-25 "Mostrar contraseña" alterna la visibilidad e informa su estado con aria-pressed', async ({ page }) => {
  await page.goto('/');
  const campo = page.locator('#form-registro [name="contrasena"]');
  // Se ubica por id: su nombre accesible cambia al alternar (Mostrar → Ocultar).
  const boton = page.locator('#mostrar-contrasena');
  await expect(boton).toHaveText(/mostrar contraseña/i);

  await campo.fill('ClaveSegura2026');
  await expect(boton, 'El botón debe iniciar sin presionar').toHaveAttribute('aria-pressed', 'false');

  await boton.click();
  await expect(campo, 'La contraseña debe verse en texto plano').toHaveAttribute('type', 'text');
  await expect(boton).toHaveAttribute('aria-pressed', 'true');
  await expect(boton).toHaveText(/ocultar contraseña/i);

  await boton.click();
  await expect(campo).toHaveAttribute('type', 'password');
  await expect(boton).toHaveAttribute('aria-pressed', 'false');
  await expect(campo, 'Alternar no debe borrar lo escrito').toHaveValue('ClaveSegura2026');
});
