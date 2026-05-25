-- CREATE TABLE usuarios (
--   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   nombre text
-- );

-- CREATE TABLE tareas (
--   id serial PRIMARY KEY,
--   titulo text NOT NULL,
--   descripcion text NOT NULL,
--   usuario_id uuid REFERENCES usuarios(id)
-- );

-- ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "tareas: usuario ve solo sus tareas"
-- ON public.tareas
-- FOR SELECT
-- USING ( usuario_id = auth.uid() );

-- CREATE POLICY "tareas: usuario edita solo sus tareas"
-- ON public.tareas
-- FOR UPDATE
-- USING ( usuario_id = auth.uid() )
-- WITH CHECK ( usuario_id = auth.uid() );

-- CREATE POLICY "tareas: usuario INSERTA solo sus tareas"
-- ON public.tareas
-- FOR INSERT
-- WITH CHECK ( usuario_id = auth.uid() );

-- CREATE POLICY "tareas: usuario BORRA solo sus tareas"
-- ON public.tareas
-- FOR DELETE
-- USING ( usuario_id = auth.uid() );


--para hacer 4 politicas iguales el de abajo

-- CREATE POLICY "admin: gestionar tareas"
--  ON public.tareas 
--  FOR ALL
--  USING ( usuario_id = auth.uid() );
--  WITH CHECK ( usuari_id = auth.uid() );
