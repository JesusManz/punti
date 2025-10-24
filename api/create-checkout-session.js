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
        unit_amount: item.precio * 100, // stripe usa centimos
      },
      quantity: item.cantidad,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando la sesión' });
  }
}
