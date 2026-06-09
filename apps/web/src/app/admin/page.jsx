import { createClient } from '@/lib/supabase/server'
import AdminClient from '@/components/admin/AdminClient'

export default async function PaginaAdmin() {
  const supabase = await createClient()

  const { data: productos, error: errProductos } = await supabase
    .from('productos')
    .select('id, nombre, descripcion, precio, categoria, disponible')
    .order('categoria')

  const { data: perfiles, error: errPerfiles } = await supabase
    .from('perfiles')
    // activo permite que el admin vea y cambie si una cuenta esta habilitada.
    .select('id, nombre, rol, avatar_url, activo')
    .order('nombre')

  console.log('ERR PRODUCTOS:', errProductos)
  console.log('ERR PERFILES:', errPerfiles)

  if (errProductos || errPerfiles) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-red-400 text-sm">
          <p>Error al cargar los datos.</p>
          <p>{errProductos?.message || errPerfiles?.message}</p>
        </div>
      </div>
    )
  }

  return (
    <AdminClient
      productosIniciales={productos ?? []}
      perfilesIniciales={perfiles ?? []}
    />
  )
}
