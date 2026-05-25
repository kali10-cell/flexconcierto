```sql
-- POLÍTICAS DE SEGURIDAD PARA LA TABLA NOTAS

-- 1. Un usuario autenticado puede leer notas públicas.
-- auth.role() = 'authenticated' verifica que el usuario haya iniciado sesión.
-- publica = true significa que solo verá notas marcadas como públicas.

CREATE POLICY "autenticado: ver notas públicas"
ON public.notas
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND publica = true
);

-- 2. El autor puede leer y borrar SUS propias notas,
-- incluso si son privadas.
-- autor_id = auth.uid() compara el dueño de la nota
-- con el usuario conectado actualmente.

CREATE POLICY "autor: acceso total a sus notas"
ON public.notas
FOR SELECT
USING (
  autor_id = auth.uid()
);

CREATE POLICY "autor: borrar sus notas"
ON public.notas
FOR DELETE
USING (
  autor_id = auth.uid()
);

-- 3. El autor puede editar sus propias notas.
-- USING controla qué filas puede modificar.
-- WITH CHECK controla cómo quedará guardada la fila.
-- Aquí se evita que el usuario cambie el autor_id
-- y robe la nota de otro usuario.

CREATE POLICY "autor: editar sus notas"
ON public.notas
FOR UPDATE
USING (
  autor_id = auth.uid()
)
WITH CHECK (
  autor_id = auth.uid()
);
```


| Inglés                    | Español                       |
| ------------------------- | ----------------------------- |
| select                    | ver / consultar               |
| insert                    | crear / insertar              |
| update                    | editar / actualizar           |
| delete                    | borrar / eliminar             |
| using                     | qué filas puede tocar o ver   |
| with check                | qué datos puede crear o dejar |
| authenticated             | usuarios logueados            |
| auth.uid()                | id del usuario conectado      |
| user_id                   | dueño de la fila              |
| policy                    | regla de seguridad            |
| enable row level security | activar seguridad por filas   |


| Rol           | Función                           |
| ------------- | --------------------------------- |
| anon          | usuarios públicos/no autenticados |
| authenticated | usuarios logueados                |
| service_role  | administrador total/backend       |


anon

Usuario normal entrando desde frontend sin login.

Ejemplo:

visitante web
cliente no registrado
authenticated

Usuario que YA inició sesión.

Ejemplo:

login correcto
tiene JWT/token
service_role

Super admin 🔥

Puede:

saltarse RLS
borrar todo
acceder a todo

⚠️ Nunca poner en frontend.
Solo backend/server.

Flujo
anon
↓ login
authenticated

Y el backend privado usa:

service_roleON





----BASE DE TABLAS 
-- -- TABLA CURSOS
-- CREATE TABLE cursos (
--   id serial primary key,
--   instructor_id uuid,
--   titulo text,
--   publicado boolean
-- );

-- -- TABLA MATRICULAS
-- CREATE TABLE matriculas (
--   id serial primary key,
--   alumno_id uuid,
--  curso_id integer,
--   completado boolean
-- );

-- -- TABLA LECCIONES
-- CREATE TABLE lecciones (
--   id serial primary key,
--   curso_id integer,
--   titulo text,
--   contenido text
-- );






EJERCICIO EJEMPLO

CREATE TABLE cursos (
  id serial PRIMARY KEY,
  id_instructor
  titulo text  not null 
  publicado boolean not null default false 

 );

  CREATE TABLE matriculas (
  id serial PRIMARY KEY,
  id_alumno uuid, not null references public.perfiles (id),
  id_curso integrar not null references cursos (id)
  completado boolean
  )

   CREATE TABLE lecciones (
  id serial PRIMARY KEY,
  id_curso integrar not null references cursos (id)
  titulo text NOT NULL,
  contenido text not null
   )

   cursos:
- quién crea el curso
- si está publicado o no

matriculas:
- qué alumno está en qué curso
- si terminó el curso

lecciones:
- contenido y temas de cada curso




create table public.perfiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nombre     text,
  rol        text not null default 'cliente'
             check (rol in ('cliente', 'staff', 'admin')),
  avatar_url text,
  creado_en  timestamptz not null default now()
);