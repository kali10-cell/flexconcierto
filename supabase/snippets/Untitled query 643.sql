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

--    cursos:
-- - quién crea el curso
-- - si está publicado o no

-- matriculas:
-- - qué alumno está en qué curso
-- - si terminó el curso

-- lecciones:
-- - contenido y temas de cada curso

-- CREATE TABLE perfiles (
--   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   ...
-- );


CREATE TABLE cursos (
  id serial PRIMARY KEY,
  id_instructor not null references public.perfiles (id),
  titulo text  not null 
  publicado boolean not null default false 

 );

  CREATE TABLE matriculas (
  id serial PRIMARY KEY,
  id_alumno uuid, not null references public.perfiles (id),
  id_curso integrar not null references cursos (id)
  completado boolean
  );


   CREATE TABLE lecciones (
  id serial PRIMARY KEY,
  id_curso integrar not null references cursos (id) 
  titulo text NOT NULL,
  contenido text not null
   );
   
create table perfiles2 (
id serial primary key references auth.users(id), 
rol  text not null default 'perfiles'
     check (rol in )('alumno', 'instructor', 'admin')
avatar_url text,
creado_en timestamp not null dealloc now()
);


---tablas policy
-- Cualquier usuario autenticado puede ver los cursos publicados.
create policy "usuario ver los cursos publicados "
on cursos for select
using
auth.role authenticated
and publicado = true


-- Un instructor puede ver y editar solo sus propios cursos (publicados o no).
create policy "el instrcutor  pude ver y editar solo sus propios cursos"
on cursos for select
using( 
auth.iud() = id_instructor 
and publicado = 'instructor'
)


-- Un alumno puede ver las lecciones de los cursos en los que está matriculado.
create policy "el alumno puede ver lecciones de los cursos que esta matriculado"
on lecciones for select 
using (
  exists(
    select 1 form matriculas 
    where matriculas.curso_id = lecciones.curso_id
    and matriculas.alumno_id = auth.iud () 
  )

and publicado 'matricula'
)

-- Un alumno puede matricularse en un curso (INSERT en matriculas), pero solo con su propio alumno_id.
create policy " el alumnno puede matricularse en un curso con su propio id solo  "
on cursos  for insert
using(
  auth.iud () = id_alumno
)






