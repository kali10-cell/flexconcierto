"use client";

import { AppFrame, DataList, Panel, StatGrid, orders } from "../_components/FlexUi";

export default function StaffPage() {
  return (
    <AppFrame
      role="staff"
      subtitle="Controla mesas, pedidos pendientes y estados de preparacion."
      title="Panel de sala"
    >
      <div className="staff-layout">
        <StatGrid
          stats={[
            ["12", "Mesas ocupadas"],
            ["8", "Pedidos pendientes", "warning"],
            ["5", "En preparacion"],
            ["24", "Completados hoy", "success"],
          ]}
        />

        <Panel action="Crear pedido" className="wide-panel" id="pedidos" title="Pedidos">
          <DataList action="Editar" rows={orders} />
        </Panel>

        <Panel id="mesas" title="Mesas">
          <div className="table-map">
            {Array.from({ length: 12 }).map((_, index) => (
              <button className={index % 3 === 0 ? "busy" : ""} key={index}>
                Mesa {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </Panel>

        <Panel id="actividad" title="Estado rapido">
          <div className="state-buttons">
            <button>Pendiente</button>
            <button>Preparando</button>
            <button className="success">Completado</button>
          </div>
        </Panel>
      </div>
    </AppFrame>
  );
}
