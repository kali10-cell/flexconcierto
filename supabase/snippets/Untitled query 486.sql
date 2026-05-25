
-- CREATE POLICY "autor: acceso total a sus tareas"
-- ON public.tareas FOR SELECT
-- USING ( autor_id = auth.uid() );


-- CREATE POLICY "autor: borrar sus tareas"
-- ON public.tareas FOR DELETE
-- USING ( autor_id = auth.uid() );



-- CREATE POLICY "autor: editar tareas"
-- ON public.tareas FOR UPDATE
-- USING ( autor_id = auth.uid() )
-- WITH CHECK ( autor_id = auth.uid() );  


  
-- CREATE POLICY "autor: crear tareas"
-- ON public.tareas FOR INSERT 
-- WITH CHECK (autor_id = auth.uid())