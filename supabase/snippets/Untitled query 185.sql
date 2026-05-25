-- ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "cliente: cancelar reserva pendiente"
-- ON public.reservas
-- FOR UPDATE
-- TO authenticated
-- USING (
--   cliente_id = auth.uid()
--   AND estado = 'pendiente'
-- )
-- WITH CHECK (
--   cliente_id = auth.uid()
--   AND estado = 'cancelada'
-- );

-- CREATE POLICY "cliente: ver sus reservas"
-- ON public.reservas
-- FOR SELECT
-- TO authenticated
-- USING (
--   cliente_id = auth.uid()
-- );

-- SET request.jwt.claims = '{"sub":"369ef3f6-d7e7-4bca-9523-4c7ee8db9f81","role":"authenticated"}';

-- UPDATE public.reservas
-- SET estado = 'cancelada'
-- WHERE id = 6;

-- SELECT * FROM public.reservas;