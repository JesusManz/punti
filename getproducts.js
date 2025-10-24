/**
 * función para cargar productos desde el JSON y mostrarlos en la página.
 * @param {string} jsonPath - Ruta del JSON de productos
 * @param {number} [limite] - Número máximo de productos a mostrar (opcional)
 */
function cargarProductos(jsonPath, limite) {
  fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById('product-grid');
      let productos = [];

      // si el JSON contiene solo un objeto lo convierte en un array (no debe pasar)
      if (Array.isArray(data)) {
        productos = data;
      } else {
        productos = [data];
      }

      // limitar productos si se especifica límite
      const productosMostrados = limite ? productos.slice(0, limite) : productos;

      productosMostrados.forEach(producto => {
        const primeraImagen = producto.imagenes && producto.imagenes.length > 0
          ? producto.imagenes[0]
          : 'no-image.png'; // imagen por defecto si no hay imágenes

        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
          <img src="${primeraImagen}" alt="${producto.titulo}">
          <div>${producto.titulo}</div>
          <a href="/producto.html?id=${producto.id}">ver producto</a>
        `;
        grid.appendChild(card);
      });
    })
    .catch(error => console.error('Error cargando los productos:', error));
}
