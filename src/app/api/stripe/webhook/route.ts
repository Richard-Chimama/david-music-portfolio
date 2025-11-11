import Stripe from "stripe";
import { Resend } from "resend";

export const runtime = "nodejs";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return key;
}

function getWebhookSecret(): string {
  const wh = process.env.STRIPE_WEBHOOK_SECRET;
  if (!wh) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  return wh;
}

export async function POST(req: Request) {
  const stripe = new Stripe(getStripeSecretKey(), { apiVersion: "2025-09-30.clover" });
  const sig = req.headers.get("stripe-signature") || "";
  const payload = await req.text(); // raw string required

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, getWebhookSecret());
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || (session.customer_email as string | null);
    const trackId = (session.metadata?.trackId as string | undefined) || (session?.line_items?.data?.[0]?.price?.product as string | undefined);
    const src = (session.metadata?.src as string | undefined) || "";

    if (email && trackId) {
      try {
        const origin = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
        const downloadUrl = src.startsWith("/") && origin ? `${origin}${src}` : src;

        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Swiden <onboarding@resend.dev>",
          to: email,
          subject: "Your track is ready — thank you for your purchase",
          html: `
            <div style="font-family: Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:#e6e6e6; background:#0b0d12; padding:24px">
              <h2 style="color:#22d3ee;">Thank you for your support!</h2>
              <p>Hi there,</p>
              <p>We appreciate your purchase. Your track is ready to download:</p>
              <p>
                <a href="${downloadUrl}" style="color:#22d3ee; text-decoration:underline;">Download your track</a>
              </p>
              <p>If the link doesn’t work, reply to this email and we’ll help you out.</p>
              <hr style="border:none; border-top:1px solid #223; margin:20px 0;"/>
              <p style="font-size:12px; color:#a3a3a3;">Order reference: ${session.id}</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }
  }

  return new Response("ok", { status: 200 });
}