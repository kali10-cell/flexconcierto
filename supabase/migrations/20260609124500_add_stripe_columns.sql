alter table public.perfiles
  add column if not exists stripe_customer_id text;

alter table public.pedidos
  add column if not exists estado_pago text not null default 'pendiente',
  add column if not exists stripe_session text,
  add column if not exists stripe_payment text;

alter table public.pedidos
  drop constraint if exists pedidos_estado_pago_check;

alter table public.pedidos
  add constraint pedidos_estado_pago_check
  check (estado_pago in ('pendiente', 'pagado', 'cancelado'));

alter table public.reservas
  add column if not exists estado_pago text not null default 'pendiente',
  add column if not exists stripe_session text,
  add column if not exists stripe_payment text,
  add column if not exists qr_token text;

alter table public.reservas
  drop constraint if exists reservas_estado_pago_check;

alter table public.reservas
  add constraint reservas_estado_pago_check
  check (estado_pago in ('pendiente', 'pagado', 'cancelado'));

create unique index if not exists reservas_qr_token_key
  on public.reservas (qr_token)
  where qr_token is not null;
