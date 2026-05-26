"use client";

import { AppFrame, DataList, Panel, StatGrid, productRows, users } from "../_components/FlexUi";

export default function AdminPage() {
  return (
    <AppFrame
      role="admin"
      subtitle="Gestiona usuarios, productos, ventas y configuración del club."
      title="Administración"
    >
      <div className="admin-layout">
        <StatGrid
          stats={[
            ["48", "Usuarios"],
            ["32", "Productos activos"],
            ["156", "Pedidos hoy"],
            ["2.450€", "Ingresos hoy", "success"],
          ]}
        />

        <Panel action="Crear usuario" id="usuarios" title="Usuarios">
          <DataList action="Editar" rows={users} />
        </Panel>

        <Panel action="Crear producto" id="productos" title="Productos">
          <DataList action="Editar" rows={productRows} />
        </Panel>

        <Panel className="wide-panel" id="reportes" title="Acciones rápidas">
          <div className="admin-actions">
            <button>Crear usuario</button>
            <button>Editar usuario</button>
            <button>Crear producto</button>
            <button>Editar producto</button>
            <button className="danger">Borrar producto</button>
          </div>
        </Panel>
      </div>
    </AppFrame>
  );
}
