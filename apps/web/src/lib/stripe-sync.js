import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function confirmarPagoDesdeStripe({ tipo, id }) {
  const tabla = tipo === 'reserva' ? 'reservas' : 'pedidos'

  const { data: registro, error } = await supabaseAdmin
    .from(tabla)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !registro) return null
  if (registro.estado_pago === 'pagado') return registro
  if (!registro.stripe_session) return registro

  const session = await stripe.checkout.sessions.retrieve(registro.stripe_session)

  if (session.payment_status !== 'paid') return registro

  const update =
    tipo === 'reserva'
      ? {
          estado_pago: 'pagado',
          stripe_payment: session.payment_intent,
          qr_token: registro.qr_token ?? crypto.randomUUID(),
        }
      : {
          estado: 'en_barra',
          estado_pago: 'pagado',
          stripe_payment: session.payment_intent,
        }

  const { data: actualizado, error: updateError } = await supabaseAdmin
    .from(tabla)
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError) throw new Error(updateError.message)
  return actualizado
}
