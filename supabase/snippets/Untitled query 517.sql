-- Simula ser el usuario con ese UUID
set request.jwt.claims = '{"sub":"<UUID-del-cliente>","role":"authenticated"}';

-- Esto debería devolver solo los pedidos de ese usuario
select * from public.pedidos;

-- Esto debería devolver 0 filas (el cliente no ve pedidos de otros)
select * from public.pedidos where cliente_id != '<UUID-del-cliente>';