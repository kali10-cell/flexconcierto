"use client";

import { AppFrame, DataList, Panel, QRBlock, StatGrid } from "../_components/FlexUi";

const accessRows = [
  ["María González", "Sala Roja privada", "23:47", "Válido"],
  ["Juan Pérez", "Entrada general", "23:45", "Válido"],
  ["Andrés López", "Sala Roja privada", "23:40", "Denegado"],
];

export default function PorteroPage() {
  return (
    <AppFrame
      role="portero"
      subtitle="Escanea entradas QR y valida accesos a salas en segundos."
      title="Escanear QR"
    >
      <div className="door-layout">
        <section className="scanner-card">
          <div className="scanner-overlay">
            <QRBlock label="Entrada #FLEX-2X7B" />
            <button className="primary-button">Permitir acceso</button>
          </div>
        </section>

        <Panel title="Último acceso">
          <div className="access-valid">
            <span>Acceso válido</span>
            <strong>Sala Roja 07</strong>
            <p>Juan Pérez · 6 personas · 23:47</p>
          </div>
        </Panel>

        <Panel id="historial" title="Accesos recientes">
          <DataList rows={accessRows} />
        </Panel>

        <StatGrid
          stats={[
            ["342", "Personas en local"],
            ["198", "Accesos hoy", "success"],
            ["7", "Denegados", "danger"],
            ["3/5", "Salas activas"],
          ]}
        />
      </div>
    </AppFrame>
  );
}
