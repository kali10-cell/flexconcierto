-- CREATE POLICY "admin: notas"
--   ON public.notas FOR ALL
--   USING ( public.mi_rol() = 'admin' )
--   WITH CHECK ( public.mi_rol() = 'admin' );



-- 1. Leer notas públicas

-- CREATE POLICY "autotentificado: ver notas publicas"
--   ON public.notas 
--   FOR SELECT          -- qué operación: SELECT, INSERT, UPDATE, DELETE o ALL
--   USING ( autor_role() 'authenticated'
--   AND publica = true
--   );  -- condición que debe cumplirse



-- -- 2. El autor lee y borra sus propias notas (incluso privadas)
-- CREATE POLICY "autor: acceso total a sus notas"
--   ON public.notas FOR SELECT
--   USING ( autor_id = auth.uid() );

-- CREATE POLICY "autor: borrar sus notas"
--   ON public.notas FOR DELETE
--   USING ( autor_id = auth.uid() );

-- -- 3. El autor puede editar su nota, pero no cambiar quién es el autor
-- CREATE POLICY "autor: editar sus notas"
--   ON public.notas FOR UPDATE
--   USING ( autor_id = auth.uid() )
--   WITH CHECK ( autor_id = auth.uid() );  -- el autor_id debe seguir siendo el suyo
