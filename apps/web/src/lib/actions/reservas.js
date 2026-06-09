'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { crearCheckout } from '@/lib/pagos'

function createSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function crearReserva({ sala_id, fecha, hora, duracionHoras }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const inicio = new Date(`${fecha}T${hora}:00`)
  const fin = new Date(inicio.getTime() + duracionHoras * 60 * 60 * 1000)

  const { data: sala } = await supabase
    .from('salas_vip')
    .select('precio_hora')
    .eq('id', sala_id)
    .single()

  const total = sala ? sala.precio_hora * duracionHoras : 0

  const { data: reserva, error } = await supabase
    .from('reservas')
    .insert({
      sala_id,
      cliente_id: user.id,
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      estado: 'pendiente',
      total,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/mi-area')
  return reserva
}

export async function iniciarPagoReserva({ sala_id, fecha, hora, duracionHoras }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const reserva = await crearReserva({ sala_id, fecha, hora, duracionHoras })

  try {
    return await crearCheckout({
      tipo: 'reserva',
      id: reserva.id,
      items: [{
        nombre: `Reserva sala - ${new Date(reserva.inicio).toLocaleDateString('es-ES')}`,
        precio: reserva.total,
        cantidad: 1,
      }],
      user,
    })
  } catch (err) {
    await createSupabaseAdmin()
      .from('reservas')
      .update({ estado_pago: 'cancelado' })
      .eq('id', reserva.id)
      .is('stripe_session', null)

    throw err
  }
}
