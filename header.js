export function loadHeader(containerId = 'header-container') {
  fetch('header.html')
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(containerId);
      container.innerHTML = html;

      const cartBtn = document.getElementById('cartBtn');
      const cartPanel = document.getElementById('cartPanel');
      const closeCart = document.getElementById('closeCart');

      cartBtn.addEventListener('click', () => {
        cartPanel.classList.add('open');
        renderCart();
      });
      closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));

      window.addEventListener('click', (e) => {
        if (!cartPanel.contains(e.target) && !cartBtn.contains(e.target)) {
          cartPanel.classList.remove('open');
        }
      });

      const checkoutBtn = document.createElement('button');
      checkoutBtn.textContent = '● Checkout';
      checkoutBtn.id = 'checkoutBtn';
      cartPanel.appendChild(checkoutBtn);

      checkoutBtn.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cart.length) return alert('Carrito vacío');

        try {
          const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart }),
          });
          const data = await res.json();
          window.location = data.url; // redirige a Stripe
        } catch (err) {
          console.error(err);
          alert('Error al iniciar checkout');
        }
      });

function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  cartPanel.innerHTML = '<h2>Tu Carrito 🛒</h2>';

  let total = 0;

  if (cartItems.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Tu carrito está vacío';
    cartPanel.appendChild(emptyMsg);
  }

  cartItems.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.marginBottom = '8px';

    // nombre producto y precio
    const info = document.createElement('span');
    info.textContent = `${item.titulo} x ${item.cantidad} ( ${item.precio.toFixed(2)} € )`;
    div.appendChild(info);

    // controles de cantidad
    const controls = document.createElement('div');

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.style.marginRight = '4px';
    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // evita que cierre el carrito
      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cartItems));
      renderCart();
    });

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.style.marginRight = '4px';
    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      item.cantidad += 1;
      localStorage.setItem('cart', JSON.stringify(cartItems));
      renderCart();
    });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartItems.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      renderCart();
    });

    controls.appendChild(minusBtn);
    controls.appendChild(plusBtn);
    controls.appendChild(removeBtn);

    div.appendChild(controls);
    cartPanel.appendChild(div);

    total += item.precio * item.cantidad;
  });

  // mostrar importe total
  const totalDiv = document.createElement('div');
  totalDiv.style.fontWeight = 'bold';
  totalDiv.style.marginTop = '10px';
  totalDiv.textContent = `Total: ${total.toFixed(2)} €`;
  cartPanel.appendChild(totalDiv);

  // mensaje de coste de envío
  const shippingMsg = document.createElement('p');
  shippingMsg.style.fontSize = '13px';
  shippingMsg.style.fontStyle = 'italic';
  shippingMsg.textContent = 'Precio de envío calculado en el checkout';
  cartPanel.appendChild(shippingMsg);

  // botón de checkout
  if (cartItems.length > 0) {
    cartPanel.appendChild(checkoutBtn);
  }
}


    })
    .catch(err => console.error('Error cargando el header:', err));
}
