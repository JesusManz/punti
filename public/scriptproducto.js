document.addEventListener('DOMContentLoaded', async () => {
  // obtener el parámetro "id" de la URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.body.innerHTML = "<p>❌ No se especificó un producto.</p>";
    return;
  }

  try {
    // cargar el JSON
    const res = await fetch('producto.json');
    const productos = await res.json();

    // buscar el producto por id
    const producto = productos.find(p => p.id === id);

    if (!producto) {
      document.body.innerHTML = `<p>❌ Producto con id "${id}" no encontrado.</p>`;
      return;
    }

    // renderizar galería
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = producto.imagenes
      .map(img => `<img src="${img}" alt="${producto.titulo}">`)
      .join('');

    // mostrar datos
    document.getElementById('titulo').textContent = producto.titulo;
    document.getElementById('precio').textContent = `( ${producto.precio.toFixed(2)} € )`;

    // mostrar descripción con saltos de línea (\n)
    const descripcion = document.getElementById('descripcion');
    descripcion.textContent = producto.descripcion; // mantenemos \n
    descripcion.style.whiteSpace = 'pre-wrap'; // respeta saltos


// botón de añadir al carrito
const btn = document.getElementById('btn-carrito');
btn.addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.id === producto.id);
  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ id: producto.id, titulo: producto.titulo, precio: producto.precio, cantidad: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${producto.titulo} añadido al carrito`);
});


  } catch (error) {
    console.error('Error al cargar el producto:', error);
    document.body.innerHTML = "<p>❌ Error al cargar el producto.</p>";
  }
});
