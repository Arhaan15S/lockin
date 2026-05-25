import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}