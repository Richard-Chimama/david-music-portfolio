import Stripe from "stripe";

export const runtime = "nodejs";

function getStripeSecretKey(): string {
  // Use the actual Stripe secret key; allow STRIPE_API_KEY as a secondary alias.
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  if (!key) {
    throw new Error("Stripe secret key not configured. Set STRIPE_SECRET_KEY in your environment.");
  }
  return key;
}

export async function POST(req: Request) {
  try {
    const { trackId, title, amount, currency } = await req.json();

    if (!trackId) {
      return new Response(JSON.stringify({ error: "Missing trackId" }), { status: 400 });
    }

    // Match the SDK's expected API version to avoid type mismatches.
    const stripe = new Stripe(getStripeSecretKey(), { apiVersion: "2025-09-30.clover" });

    // Fallbacks if client didn’t send
    const unitAmount = typeof amount === "number" && amount > 0 ? amount : 200; // default €2
    const unitCurrency = typeof currency === "string" ? currency : "eur";

    const requestUrl = new URL(req.url);
    const origin = `${requestUrl.protocol}//${requestUrl.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: unitCurrency,
            unit_amount: unitAmount, // amount in smallest currency unit
            product_data: {
              name: title ? `Track: ${title}` : `Track #${trackId}`,
              metadata: { trackId: String(trackId) },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?success=true&track=${encodeURIComponent(String(trackId))}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: { trackId: String(trackId) },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    return new Response(JSON.stringify({ error: "Checkout session creation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}