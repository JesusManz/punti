async function cargarProductos(jsonPath) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const container = document.getElementById('grid-container');

    // máximo 8 posiciones disponibles (excluyendo texto e imagen)
    const maxPos = 8;
    const productos = Array.isArray(data) ? data.slice(0, maxPos) : [data];

    productos.forEach((producto, i) => {
      const primeraImagen = (producto.imagenes && producto.imagenes.length > 0) ? producto.imagenes[0] : 'no-image.png';
      const index = i + 1; // 1..8
      const card = document.createElement('div');
      card.className = `product-card product-pos-${index}`;
      card.innerHTML = `
        <img src="${primeraImagen}" alt="${escapeHtml(producto.titulo || 'Producto')}">
        <p>${escapeHtml(producto.titulo || '')}</p>
        <a href="/producto.html?id=${producto.id}" target="_self">ver producto</a>
      `;
      // insertamos antes del elemento static-image para preservar orden visual (texto -> productos -> imagen)
      const staticImage = container.querySelector('.static-image');
      if (staticImage) {
        container.insertBefore(card, staticImage);
      } else {
        container.appendChild(card);
      }
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}

// ayudantes para evitar inyección de HTML por datos sucios
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

cargarProductos('producto.json');
