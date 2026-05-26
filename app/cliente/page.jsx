"use client";

import {
  AppFrame,
  DataList,
  HeroMedia,
  Panel,
  ProductMenu,
  QRBlock,
  RoomShowcase,
  photos,
  products,
} from "../_components/FlexUi";

export default function ClientePage() {
  return (
    <AppFrame
      role="cliente"
      subtitle="Pide comida, reserva salas y muestra tu QR de acceso."
      title="Bienvenido, Juan"
    >
      <section className="mobile-client-top">
        <div>
          <span>Reserva activa</span>
          <strong>Sala Dorada 05</strong>
          <p>23:00 · 6 invitados · QR listo</p>
        </div>
        <button>Ver QR</button>
      </section>

      <div className="client-layout">
        <HeroMedia alt="Escenario con luces para la próxima reserva" eyebrow="Próxima reserva" image={photos.stage} title="Sala Dorada 05">
          <p>Tu mesa VIP está confirmada para las 23:00. Puedes pedir antes de llegar.</p>
          <button className="primary-button">Pedir comida</button>
        </HeroMedia>

        <Panel className="qr-panel" id="qr" title="Mi QR">
          <QRBlock />
        </Panel>

        <Panel action="Ver menú" id="comida" title="Pedir comida">
          <ProductMenu items={products} />
        </Panel>

        <Panel action="Reservar sala" className="wide-panel rooms-panel" id="salas" title="Reservar salas">
          <RoomShowcase compact />
        </Panel>
      </div>
    </AppFrame>
  );
}
