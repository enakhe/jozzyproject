import dotenv from 'dotenv';
dotenv.config();

import { Router } from 'express';
import Stripe from 'stripe';
const router = Router();

const stripe = new Stripe(process.env.stripe_secret);

router.post('/create-checkout-session', async (req, res) => {
	const { product } = req.body;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: product.currency,
						product_data: {
							name: product.name,
						},
						unit_amount: product.price, // in cents
					},
					quantity: 1,
				},
			],
			success_url: 
			`http://localhost:3000/trinityfoundation/stripesuccess?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: 'http://localhost:3000/cancel',
		});

		res.json({ url: session.url });
	} catch (err) {
		console.error('Stripe Checkout session error:', err);
		res.status(500).json({ error: 'Something went wrong creating session' });
	}
});

export default router;