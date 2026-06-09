# Stripe: flujo local y errores corregidos

Esta guia explica, en orden, que hace falta para que Stripe funcione en local con Next.js y Supabase.

No guarda claves reales. Las claves reales van solo en `apps/web/.env.local`.

## 1. Que tiene que pasar en un pago

El flujo completo es este:

1. El cliente inicia sesion en la app.
2. El cliente elige mesa y productos.
3. Pulsa `Enviar pedido` o `Pagar`.
4. La app crea un pedido en Supabase.
5. El pedido queda como `estado_pago = 'pendiente'`.
6. La app llama a `/api/pagos`.
7. `/api/pagos` crea una sesion de pago en Stripe.
8. Stripe devuelve una URL de Checkout.
9. La app manda al cliente a Stripe.
10. El cliente paga con tarjeta de prueba.
11. Stripe avisa a la app llamando a `/api/webhook`.
12. El webhook cambia el pedido a `estado_pago = 'pagado'`.
13. El cliente vuelve a la pagina de exito.
14. El staff ya puede ver y gestionar el pedido.

## 2. Archivos importantes

Los archivos principales del flujo son:

```text
apps/web/.env.local
apps/web/src/lib/actions/pedidos.js
apps/web/src/lib/actions/reservas.js
apps/web/src/lib/pagos.js
apps/web/src/app/api/pagos/route.js
apps/web/src/app/api/webhook/route.js
apps/web/src/app/pedido/exito/page.jsx
apps/web/src/app/reserva/exito/page.jsx
apps/web/src/lib/stripe-sync.js
supabase/migrations/20260518105257_esquema_inicial.sql
supabase/migrations/20260518110300_politicas_rls.sql
supabase/migrations/20260609122000_fix_pedidos_insert_rls.sql
supabase/migrations/20260609124500_add_stripe_columns.sql
```

`docs/07-stripe.md` es el apunte principal que explica el flujo.

## 3. Paso 1: instalar dependencias

El codigo usa:

```js
import Stripe from 'stripe'
```

Por eso el paquete `stripe` tiene que estar instalado en `apps/web`.

Desde `apps/web`:

```bash
npm.cmd install
```

Si solo falta Stripe:

```bash
npm.cmd install stripe
```

Se usa `npm.cmd` porque en Windows PowerShell puede bloquear `npm.ps1` por la politica de ejecucion de scripts.

Si este paso falta, Next muestra:

```text
Module not found: Can't resolve 'stripe'
```

## 4. Paso 2: configurar `.env.local`

El archivo correcto es:

```text
apps/web/.env.local
```

Tiene que tener estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SUPABASE_SERVICE_ROLE_KEY=...
```

Que significa cada una:

- `NEXT_PUBLIC_SUPABASE_URL`: URL de Supabase local.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave publica de Supabase para la app.
- `NEXT_PUBLIC_APP_URL`: URL de la app Next local.
- `STRIPE_SECRET_KEY`: clave secreta de Stripe, empieza por `sk_test_`.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: clave publica de Stripe, empieza por `pk_test_`.
- `STRIPE_WEBHOOK_SECRET`: secreto del webhook, empieza por `whsec_`.
- `SUPABASE_SERVICE_ROLE_KEY`: clave service role de Supabase para rutas de servidor.

Importante:

- Las claves reales no se escriben en documentos.
- `.env.local` no se sube a Git.
- Cada vez que cambias `.env.local`, hay que reiniciar Next.
- En este proyecto ya quedaron configuradas todas las variables anteriores.

## 5. Paso 3: comprobar Supabase local

Comprobar que Supabase esta corriendo:

```bash
npx.cmd supabase status
```

La app local debe usar:

```text
http://127.0.0.1:54321
```

Si las migraciones no estan aplicadas:

```bash
npx.cmd supabase db push --local
```

En este proyecto se aplico una migracion extra para arreglar la insercion de pedidos:

```text
supabase/migrations/20260609122000_fix_pedidos_insert_rls.sql
```

Tambien se aplico una migracion para anadir columnas de Stripe que faltaban en la base local antigua:

```text
supabase/migrations/20260609124500_add_stripe_columns.sql
```

Columnas que deben existir segun los apuntes:

```text
perfiles.stripe_customer_id
pedidos.estado_pago
pedidos.stripe_session
pedidos.stripe_payment
reservas.estado_pago
reservas.stripe_session
reservas.stripe_payment
reservas.qr_token
```

## 6. Paso 4: arrancar Next

Desde la raiz del proyecto:

```bash
npm.cmd run dev
```

O desde `apps/web`:

```bash
npm.cmd run dev
```

La app debe abrir en:

```text
http://localhost:3000
```

Si cambiaste `.env.local`, para y vuelve a arrancar:

```bash
Ctrl+C
npm.cmd run dev
```

## 7. Paso 5: arrancar Stripe CLI

Primero hay que tener Stripe CLI instalado. En Windows se instalo con:

```bash
npm.cmd install -g @stripe/cli
```

En PowerShell puede fallar `stripe` porque Windows bloquea `stripe.ps1`. Si pasa eso, usa `stripe.cmd`.

En otra terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

En PowerShell, mejor:

```bash
stripe.cmd listen --forward-to localhost:3000/api/webhook
```

Stripe imprime algo asi:

```text
Ready! Your webhook signing secret is whsec_...
```

Ese `whsec_...` se copia en:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Luego hay que reiniciar Next.

Este secreto cambia si paras y vuelves a arrancar `stripe listen`.

En este proyecto ya se dejo `STRIPE_WEBHOOK_SECRET` configurado en `.env.local`. Si reinicias `stripe listen`, tendras que reemplazarlo por el nuevo `whsec_...`.

## 8. Paso 6: probar un pedido

En la app:

1. Inicia sesion.
2. Ve a la carta.
3. Elige una mesa.
4. Anade productos al carrito.
5. Pulsa `Enviar pedido` o `Pagar`.

Lo que debe pasar:

1. `pedidos.js` crea el pedido en Supabase.
2. Tambien crea las filas de `pedido_items`.
3. El pedido queda pendiente de pago.
4. `pagos.js` llama a `/api/pagos`.
5. `/api/pagos` crea la sesion en Stripe.
6. La app redirige a Stripe Checkout.

## 9. Paso 7: pagar con tarjeta de prueba

En Stripe Checkout usa:

```text
Numero: 4242 4242 4242 4242
Fecha: 12/34
CVC: 123
```

Como se usan claves `test`, no se cobra dinero real.

## 10. Paso 8: comprobar el webhook

Cuando el pago termina, la terminal de `stripe listen` debe mostrar algo parecido a:

```text
checkout.session.completed
200 POST http://localhost:3000/api/webhook
```

Ese `200` significa:

1. Stripe aviso a la app.
2. La app recibio el webhook.
3. `/api/webhook` respondio correctamente.

Lo que hace `/api/webhook`:

- Si es un pedido, actualiza `pedidos.estado_pago` a `pagado` y `pedidos.estado` a `en_barra`.
- Si es una reserva, actualiza `reservas.estado_pago` a `pagado` y genera `qr_token`.

En pedidos hay dos estados distintos:

- `estado_pago`: indica si se cobro o no. Valores: `pendiente`, `pagado`, `cancelado`.
- `estado`: indica el estado de cocina/barra. Valores: `pendiente`, `en_barra`, `listo`, `entregado`, `cancelado`.

Antes, Stripe ponia `estado_pago = pagado`, pero `estado` seguia en `pendiente`. Ahora, cuando Stripe confirma el pago, el pedido pasa tambien a `estado = en_barra`.

## 11. Paso 9: comprobar Supabase

Despues del pago:

1. Abre Supabase Studio.
2. Ve a la tabla `pedidos`.
3. Busca el pedido creado.
4. Comprueba que `estado_pago` sea `pagado`.

Tambien deberian existir sus filas en:

```text
pedido_items
```

## 12. Errores que salieron y como se arreglaron

### Error 1: faltaba Git o rama

Al principio parecia que el proyecto no tenia repo Git.

Se encontro una carpeta `.git` en la papelera de Windows y se restauro.

Resultado:

- La rama real era `susana`.
- El remoto era `git@github.com:kali10-cell/flexconcierto.git`.
- Despues se cambio a `main`.

### Error 2: `Module not found: Can't resolve 'stripe'`

El codigo importaba Stripe:

```js
import Stripe from 'stripe'
```

pero el paquete no estaba instalado en `apps/web/node_modules`.

Solucion:

```bash
npm.cmd install
```

### Error 3: RLS bloqueaba `pedidos`

Error visto:

```text
new row violates row-level security policy for table "pedidos"
```

Esto no significa que falte la tabla.

Significa que Supabase no dejaba insertar por las politicas RLS.

La politica correcta permite insertar solo si:

1. El usuario esta autenticado.
2. `cliente_id = auth.uid()`.

Se creo y aplico:

```text
supabase/migrations/20260609122000_fix_pedidos_insert_rls.sql
```

Con:

```bash
npx.cmd supabase db push --local
```

### Error 4: faltaban variables para `/api/pagos`

`/api/pagos` usa:

```js
process.env.SUPABASE_SERVICE_ROLE_KEY
```

Si esa variable falta, la ruta puede fallar al leer o actualizar datos protegidos por RLS.

Solucion:

```env
SUPABASE_SERVICE_ROLE_KEY=...
```

### Error 5: faltaban columnas de Stripe en la base local

Los apuntes dicen que estas columnas tienen que existir:

```text
perfiles.stripe_customer_id
pedidos.estado_pago
pedidos.stripe_session
pedidos.stripe_payment
reservas.estado_pago
reservas.stripe_session
reservas.stripe_payment
reservas.qr_token
```

La base local venia de una version anterior y faltaban algunas.

Solucion:

```text
supabase/migrations/20260609124500_add_stripe_columns.sql
```

Aplicada con:

```bash
npx.cmd supabase db push --local
```

### Error 6: firma invalida en webhook

Si sale:

```text
Firma invalida
```

significa que `STRIPE_WEBHOOK_SECRET` no coincide con el secreto actual de `stripe listen`.

Solucion:

1. Mira el `whsec_...` que imprime `stripe listen`.
2. Copialo en `.env.local`.
3. Reinicia Next.

En PowerShell usa:

```bash
stripe.cmd listen --forward-to localhost:3000/api/webhook
```

porque `stripe` puede intentar ejecutar `stripe.ps1` y quedar bloqueado por la politica de scripts.

### Error 7: cambias `.env.local` y sigue igual

Next no siempre recarga variables nuevas mientras esta arrancado.

Solucion:

```bash
Ctrl+C
npm.cmd run dev
```

### Error 8: Stripe sale exitoso pero Supabase sigue `pendiente`

Esto pasa cuando Stripe cobra bien, pero la base de datos no se actualiza.

En este proyecto, `estado_pago` cambia a `pagado` cuando ocurre una de estas dos cosas:

1. Stripe llama a `/api/webhook` y el webhook actualiza Supabase.
2. El usuario vuelve a `/pedido/exito` o `/reserva/exito` y la pagina comprueba la sesion en Stripe.

La segunda opcion se anadio como respaldo porque el webhook puede fallar si:

- `STRIPE_WEBHOOK_SECRET` no coincide con el `whsec_...` actual.
- Next no se reinicio despues de cambiar `.env.local`.
- `SUPABASE_SERVICE_ROLE_KEY` esta mal escrita.
- La clave viene con comillas copiadas desde `supabase status -o env`.

Se normalizo `.env.local` para quitar comillas alrededor de las claves.

Tambien se anadio:

```text
apps/web/src/lib/stripe-sync.js
```

Ese helper hace esto:

1. Lee el pedido o reserva.
2. Busca su `stripe_session`.
3. Pregunta a Stripe si esa sesion esta pagada.
4. Si Stripe dice `paid`, actualiza `estado_pago = 'pagado'`.

Tambien se reforzo `/api/webhook` para que no devuelva falso `200` si Supabase falla al actualizar.

Importante:

No todos los registros `pendiente` deben pasar a `pagado`.

- Si tienen `stripe_session`, se pueden comprobar contra Stripe.
- Si Stripe dice `paid`, se actualizan a `pagado`.
- Si no tienen `stripe_session`, nunca llegaron a crear Checkout en Stripe. Esos no se pueden marcar como pagados y deben quedar `cancelado`.

Se ajustaron las Server Actions:

```text
apps/web/src/lib/actions/pedidos.js
apps/web/src/lib/actions/reservas.js
```

Ahora, si se crea el pedido/reserva pero falla la creacion del checkout, se marca `estado_pago = 'cancelado'` para que no quede un `pendiente` eterno.

## 13. Antes y despues de los cambios

Esta seccion resume exactamente que se cambio, que habia antes y por que.

### Cambio 1: instalar Stripe

Antes:

El codigo tenia imports de Stripe:

```js
import Stripe from 'stripe'
```

pero el paquete no estaba instalado fisicamente en `apps/web/node_modules`.

Error:

```text
Module not found: Can't resolve 'stripe'
```

Despues:

Se instalo con:

```bash
npm.cmd install
```

Resultado:

Next ya puede cargar:

```js
import Stripe from 'stripe'
```

### Cambio 2: variables de entorno completas

Antes:

Faltaban o no estaban limpias algunas variables necesarias para el flujo completo.

Despues:

`apps/web/.env.local` quedo con todas estas variables configuradas:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SUPABASE_SERVICE_ROLE_KEY=...
```

Tambien se quitaron comillas copiadas desde `supabase status -o env`, porque una clave con comillas puede fallar en scripts o clientes de Supabase.

### Cambio 3: columnas de Stripe en Supabase

Antes:

La migracion inicial del repo tenia las columnas, pero la base local venia de una version vieja y no las tenia todas.

Faltaban columnas como:

```text
perfiles.stripe_customer_id
pedidos.estado_pago
pedidos.stripe_session
pedidos.stripe_payment
reservas.estado_pago
```

Despues:

Se anadio la migracion:

```text
supabase/migrations/20260609124500_add_stripe_columns.sql
```

Codigo principal:

```sql
alter table public.perfiles
  add column if not exists stripe_customer_id text;

alter table public.pedidos
  add column if not exists estado_pago text not null default 'pendiente',
  add column if not exists stripe_session text,
  add column if not exists stripe_payment text;

alter table public.reservas
  add column if not exists estado_pago text not null default 'pendiente',
  add column if not exists stripe_session text,
  add column if not exists stripe_payment text,
  add column if not exists qr_token text;
```

Resultado:

La base ya tiene todas las columnas necesarias para recordar el estado del pago.

### Cambio 4: politicas RLS para pedidos

Antes:

Supabase bloqueaba crear pedidos:

```text
new row violates row-level security policy for table "pedidos"
```

Despues:

Se anadio la migracion:

```text
supabase/migrations/20260609122000_fix_pedidos_insert_rls.sql
```

Codigo principal:

```sql
create policy "autenticado: crear pedidos"
  on public.pedidos for insert
  with check (
    auth.role() = 'authenticated'
    and cliente_id = auth.uid()
  );

create policy "cliente: insertar items"
  on public.pedido_items for insert
  with check (
    exists (
      select 1
      from public.pedidos
      where pedidos.id = pedido_items.pedido_id
        and pedidos.cliente_id = auth.uid()
    )
  );
```

Resultado:

Un usuario autenticado puede crear su propio pedido y sus items.

### Cambio 5: webhook de Stripe mas estricto

Antes:

El webhook actualizaba el pago, pero no comprobaba si Supabase fallaba. Eso podia dar un falso `200`.

Codigo anterior simplificado:

```js
await supabase
  .from('pedidos')
  .update({
    estado_pago: 'pagado',
    stripe_payment: session.payment_intent,
  })
  .eq('id', id)
  .eq('estado_pago', 'pendiente')

return NextResponse.json({ received: true })
```

Problema:

Si Supabase fallaba, Stripe podia recibir `200` igualmente y el pedido quedarse mal.

Despues:

Ahora se guarda el error y se devuelve `500` si Supabase no actualiza:

```js
const { error } = await supabase
  .from('pedidos')
  .update({
    estado: 'en_barra',
    estado_pago: 'pagado',
    stripe_payment: session.payment_intent,
  })
  .eq('id', id)
  .eq('estado_pago', 'pendiente')

if (error) {
  console.error('Error actualizando pedido pagado:', error)
  return NextResponse.json({ error: error.message }, { status: 500 })
}
```

Resultado:

Cuando Stripe confirma el pago:

```text
estado_pago = pagado
estado = en_barra
stripe_payment = pi_...
```

### Cambio 6: diferenciar `estado` y `estado_pago`

Antes:

El pago quedaba bien:

```text
estado_pago = pagado
```

pero el estado de cocina seguia:

```text
estado = pendiente
```

Eso parecia un fallo porque en la tabla se veia `pendiente`.

Despues:

Se decidio que cuando Stripe confirma un pedido, el pedido entra directamente en barra:

```text
estado_pago = pagado
estado = en_barra
```

Explicacion:

- `estado_pago` habla del dinero.
- `estado` habla de cocina/barra.

### Cambio 7: sincronizacion de respaldo desde pagina de exito

Antes:

Si Stripe cobraba pero el webhook no actualizaba a tiempo, la pagina de exito podia decir:

```text
Pedido no encontrado o pago aun no confirmado.
```

Despues:

Se creo:

```text
apps/web/src/lib/stripe-sync.js
```

Codigo principal:

```js
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
```

Las paginas:

```text
apps/web/src/app/pedido/exito/page.jsx
apps/web/src/app/reserva/exito/page.jsx
```

ahora usan ese helper.

Resultado:

Si el webhook va tarde, la pagina de exito consulta Stripe y corrige Supabase.

### Cambio 8: reservas de salas VIP pagadas

Las salas VIP no aparecen como pago en `pedidos`.

Las reservas de salas se guardan en:

```text
public.reservas
```

Columnas importantes:

```text
estado_pago
stripe_session
stripe_payment
qr_token
```

Cuando Stripe confirma una reserva:

```text
reservas.estado_pago = pagado
reservas.stripe_payment = pi_...
reservas.qr_token = uuid generado
```

El campo `reservas.estado` puede seguir como `pendiente`, porque ese campo representa el estado de la reserva como evento/uso de sala. El pago se mira en `estado_pago`.

Codigo del webhook para reservas:

```js
const { error } = await supabase
  .from('reservas')
  .update({
    estado_pago: 'pagado',
    stripe_payment: session.payment_intent,
    qr_token: crypto.randomUUID(),
  })
  .eq('id', id)
  .eq('estado_pago', 'pendiente')
```

Codigo de respaldo en `stripe-sync.js`:

```js
tipo === 'reserva'
  ? {
      estado_pago: 'pagado',
      stripe_payment: session.payment_intent,
      qr_token: registro.qr_token ?? crypto.randomUUID(),
    }
  : ...
```

Donde se ve en la app:

```text
/reserva/exito?reserva_id=...
```

La pagina `apps/web/src/app/reserva/exito/page.jsx` solo muestra confirmacion si:

```js
reservaConfirmada.estado_pago === 'pagado'
```

En Supabase Studio hay que mirar la tabla:

```text
reservas
```

No la tabla `pedidos`.

Estado actual de ejemplo:

```text
reserva pagada:
  estado = pendiente
  estado_pago = pagado
  stripe_session = cs_test_...
  stripe_payment = pi_...
  qr_token = uuid
```

### Cambio 9: cancelar intentos que no llegaron a Stripe

Antes:

Si se creaba un pedido/reserva pero fallaba crear la Checkout Session, quedaba:

```text
estado_pago = pendiente
stripe_session = NULL
```

Problema:

Ese registro nunca puede pasar a `pagado`, porque no existe sesion de Stripe que comprobar.

Despues:

En `apps/web/src/lib/actions/pedidos.js`:

```js
try {
  return await crearCheckout({
    tipo: 'pedido',
    id: pedido.id,
    items: items.map((i) => ({ nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
    user,
  })
} catch (err) {
  await createSupabaseAdmin()
    .from('pedidos')
    .update({ estado_pago: 'cancelado' })
    .eq('id', pedido.id)
    .is('stripe_session', null)

  throw err
}
```

En `apps/web/src/lib/actions/reservas.js` se hizo lo mismo para reservas:

```js
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
```

Resultado:

Los intentos que no llegan a Stripe ya no quedan como `pendiente` para siempre. Quedan `cancelado`.

### Cambio 10: limpiar datos antiguos de prueba

Antes:

Habia pedidos antiguos en esta situacion:

```text
estado_pago = pendiente
stripe_session = NULL
```

Despues:

Se marcaron como cancelados porque no tenian sesion de Stripe:

```sql
update public.pedidos
set estado_pago = 'cancelado'
where estado_pago = 'pendiente'
  and stripe_session is null;
```

Tambien se sincronizaron contra Stripe los pedidos/reservas que si tenian `stripe_session`.

Resultado final esperado:

```text
pedido pagado:
  estado = en_barra
  estado_pago = pagado
  stripe_session = cs_test_...
  stripe_payment = pi_...

pedido que no llego a Stripe:
  estado = pendiente
  estado_pago = cancelado
  stripe_session = NULL
  stripe_payment = NULL
```

## 14. Resumen rapido

Para probarlo todo desde cero:

```bash
npm.cmd install
npm.cmd install -g @stripe/cli
npx.cmd supabase status
npx.cmd supabase db push --local
npm.cmd run dev
```

En otra terminal:

```bash
stripe.cmd listen --forward-to localhost:3000/api/webhook
```

Despues:

1. Copiar el `whsec_...` a `.env.local`.
2. Reiniciar Next.
3. Crear pedido.
4. Pagar con `4242 4242 4242 4242`.
5. Ver `200` en `stripe listen`.
6. Comprobar `estado_pago = pagado` en Supabase.
