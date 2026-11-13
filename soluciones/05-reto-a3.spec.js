// Solución del ejercicio adicional A3. Copiar a tests/ para ejecutarla.
// Heurística 9: el error de inicio de sesión dice qué falta, en lenguaje del usuario.
import { test, expect } from '@playwright/test';

test('S-06 el error de inicio de sesión explica qué falta', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('alert')).toHaveText('Ingresa tu usuario y contraseña para continuar.');
});
