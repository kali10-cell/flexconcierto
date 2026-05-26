"use client";

import {
  AppFrame,
  DataList,
  HeroMedia,
  Panel,
  QRBlock,
  products,
  rooms,
} from "../_components/FlexUi";

export default function ClientePage() {
  return (
    <AppFrame
      role="cliente"
      subtitle="Pide comida, reserva salas y muestra tu QR de acceso."
      title="Bienvenido, Juan"
    >
      <div className="client-layout">
        <HeroMedia eyebrow="Proxima reserva" title="Sala Dorada 05">
          <p>Tu mesa VIP esta confirmada para las 23:00. Puedes pedir antes de llegar.</p>
          <button className="primary-button">Pedir comida</button>
        </HeroMedia>

        <Panel className="qr-panel" id="qr" title="Mi QR">
          <QRBlock />
        </Panel>

        <Panel action="Ver menu" id="comida" title="Pedir comida">
          <DataList rows={products} />
        </Panel>

        <Panel action="Reservar sala" id="salas" title="Reservar salas">
          <div className="room-grid">
            {rooms.map((room) => (
              <article className={`room-card ${room.tone}`} key={room.name}>
                <span>{room.detail}</span>
                <strong>{room.name}</strong>
                <b>Desde {room.price}€</b>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </AppFrame>
  );
}
