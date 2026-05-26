"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo, RoomShowcase, brand, photos } from "./_components/FlexUi";

export default function AccessPage() {
  return (
    <main className="access-page">
      <section className="access-hero">
        <Image
          alt="Público en una noche de concierto dentro de FLEX"
          className="access-photo"
          fill
          priority
          sizes="100vw"
          src={photos.club}
        />

        <header className="site-header">
          <Logo />
          <nav>
            <a href="#salas">Salas</a>
            <a href="#acceso">Acceso</a>
            <Link href="/cliente">Cliente</Link>
            <Link href="/staff">Staff</Link>
          </nav>
          <Link className="header-cta" href="/cliente">
            Reservar VIP
          </Link>
        </header>

        <div className="access-overlay">
          <div className="access-copy">
            <p>Flex concierto club</p>
            <h1>Reservas VIP, salas privadas y acceso QR.</h1>
            <span>{brand.slogan}</span>
            <div className="hero-actions">
              <Link className="primary-button" href="/cliente">
                Reservar ahora
              </Link>
              <a className="secondary-button" href="#salas">
                Ver salas
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="access-salas" id="salas">
        <div className="section-kicker">
          <span>VIP reservations</span>
          <strong>Salas privadas para vivir la noche desde dentro.</strong>
        </div>
        <RoomShowcase />
      </section>

      <section className="access-panel" id="acceso">
        <div className="access-panel-copy">
          <span>Access</span>
          <h2>Entra según tu rol</h2>
          <p>Reserva, pide comida, muestra tu QR o gestiona la operación del club desde el panel correspondiente.</p>
        </div>

        <div className="role-entry">
          <Link href="/cliente">Cliente</Link>
          <Link href="/staff">Staff</Link>
          <Link href="/portero">Portero</Link>
          <Link href="/admin">Admin</Link>
        </div>

        <form className="auth-form">
          <label>
            Correo electrónico
            <input type="email" />
          </label>
          <label>
            Contraseña
            <input type="password" />
          </label>
          <button className="primary-button" type="button">
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}
