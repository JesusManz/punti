import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { items } = req.body;

    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.titulo,
        },
        unit_amount: Math.round(item.precio * 100), // en céntimos
      },
      quantity: item.cantidad,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      // 👇 Pide dirección de envío
      shipping_address_collection: {
        allowed_countries: ['ES', 'FR', 'PT', 'IT', 'DE'],
      },

      // 👇 Pide número de teléfono
      phone_number_collection: {
        enabled: true,
      },

      // 👇 Opcional: agrega un coste de envío fijo
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 100, currency: 'eur' }, // 5 €
            display_name: 'Envío estándar (3-5 días)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],

      line_items,
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/tienda.html`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error Stripe:', err);
    res.status(500).json({ error: 'Error creando la sesión' });
  }
}
