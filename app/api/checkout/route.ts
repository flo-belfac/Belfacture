import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { priceId, userId, userEmail, plan } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/abonnement`,
    customer_email: userEmail,
    metadata: { userId, plan },
  })

  return NextResponse.json({ url: session.url })
}