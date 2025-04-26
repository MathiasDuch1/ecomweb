import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function createCheckoutSession({
  lineItems,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
} 