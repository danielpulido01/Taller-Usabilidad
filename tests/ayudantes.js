// Funciones de apoyo compartidas por las pruebas de usabilidad.

/** Describe un elemento de forma legible para los mensajes de error. */
async function describir(locator) {
  return locator.evaluate((el) => {
    const texto = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim();
    return `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).split(' ').join('.') : ''}> "${texto.slice(0, 40)}"`;
  });
}

/**
 * Recorre la página con la tecla Tab y devuelve información de cada elemento enfocado.
 * Marca cada elemento visitado con data-visitado="1" para verificar alcance por teclado.
 */
async function recorrerConTab(page, maxPasos = 60) {
  const paradas = [];
  for (let i = 0; i < maxPasos; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      el.setAttribute('data-visitado', '1');
      const s = getComputedStyle(el);
      const contorno = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
      const sombra = s.boxShadow && s.boxShadow !== 'none';
      return {
        etiqueta: el.tagName.toLowerCase(),
        texto: (el.innerText || el.value || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 40),
        focoVisible: Boolean(contorno || sombra),
      };
    });
    if (!info) break;
    paradas.push(info);
  }
  return paradas;
}

/** Mide el Cumulative Layout Shift acumulado en la página. */
async function medirCLS(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        let total = 0;
        new PerformanceObserver((lista) => {
          for (const e of lista.getEntries()) if (!e.hadRecentInput) total += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(Number(total.toFixed(3))), 200);
      })
  );
}

module.exports = { describir, recorrerConTab, medirCLS };
