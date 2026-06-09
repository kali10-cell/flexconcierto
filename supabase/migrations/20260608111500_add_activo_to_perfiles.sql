-- Correccion admin/perfiles:
-- El panel admin necesita perfiles.activo para mostrar si una cuenta esta activa
-- y para permitir activar/desactivar usuarios desde el modal de edicion.
-- La base local podia venir de una version anterior sin esta columna.
alter table public.perfiles
  add column if not exists activo boolean not null default true;
