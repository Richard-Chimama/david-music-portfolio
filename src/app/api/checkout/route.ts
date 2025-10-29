import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// NOTE: Avoid initializing Stripe at module scope so build doesn't fail
// when STRIPE_SECRET_KEY isn't configured. Initialize inside the handler
// with a clear error message if the key is missing.

export async function POST(request: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error('Missing STRIPE_SECRET_KEY environment variable.');
      return NextResponse.json(
        { error: 'Payment configuration missing on server' },
        { status: 500 }
      );
    }

    // Initialize Stripe with a valid API version (or omit to use default)
    const stripe = new Stripe(stripeSecret);
    const { trackId } = await request.json();

    if (!trackId) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }

    // TODO: Validate track exists in your data
    // For now, we'll use a fixed price of €2
    const priceInCents = 200; // €2.00

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Full Track Download - Track ${trackId}`,
              description: 'High-quality audio file with instant download',
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      client_reference_id: trackId.toString(),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure?track_id=${trackId}`,
      metadata: {
        trackId: trackId.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}