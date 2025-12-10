// api/create-checkout-session.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const priceId = process.env.STRIPE_PRICE_ID as string;
const frontendUrl = process.env.FRONTEND_URL as string;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // 若你未來改成單次付款，改 'payment'
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/payment-success`,
      cancel_url: `${frontendUrl}/payment-cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: 'Stripe error', detail: err.message });
  }
}
