import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecret || !webhookSecret) {
      console.error('Missing Stripe configuration. STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set.');
      return NextResponse.json(
        { error: 'Payment configuration missing on server' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecret);
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract track ID from metadata
        const trackId = session.metadata?.trackId || session.client_reference_id;
        
        if (!trackId) {
          console.error('No track ID found in session metadata');
          break;
        }

        // Generate download token (simple UUID-like string for now)
        const downloadToken = generateDownloadToken();
        
        // TODO: Store order in database
        console.log('Payment completed for track:', trackId);
        console.log('Download token generated:', downloadToken);
        
        // TODO: Send email with download link
        // For now, just log the download URL
        const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/download?token=${downloadToken}&track=${trackId}`;
        console.log('Download URL:', downloadUrl);
        
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

function generateDownloadToken(): string {
  return Math.random().toString(36).substring(2) + 
         Date.now().toString(36) + 
         Math.random().toString(36).substring(2);
}