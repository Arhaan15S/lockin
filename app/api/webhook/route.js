import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return Response.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object
    const customerId = subscription.customer

    const customer = await stripe.customers.retrieve(customerId)
    const email = customer.email

    await supabase
      .from('profiles')
      .update({ plan: 'pro', stripe_customer_id: customerId })
      .eq('email', email)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const customerId = subscription.customer

    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('stripe_customer_id', customerId)
  }

  return Response.json({ received: true })
}