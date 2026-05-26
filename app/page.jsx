"use client";

import Link from "next/link";
import Image from "next/image";
import { images, Logo, rooms } from "./_components/FlexUi";

export default function AccessPage() {
  return (
    <main className="access-page">
      <section className="access-hero">
        <Image alt="" fill priority sizes="(max-width: 1160px) 100vw, 70vw" src={images.venue} />
        <div className="access-overlay">
          <Logo />
          <p>Club, reservas, pedidos y acceso QR</p>
          <h1>Una interfaz real para operar la noche.</h1>
          <div className="access-rooms">
            {rooms.map((room) => (
              <article className={`room-chip ${room.tone}`} key={room.name}>
                <span>{room.name}</span>
                <strong>{room.price}€</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="access-panel">
        <div className="auth-tabs">
          <button className="active">Login</button>
          <button>Registro</button>
        </div>

        <form className="auth-form">
          <h2>Entrar a FLEX</h2>
          <label>
            Correo electronico
            <input type="email" />
          </label>
          <label>
            Contrasena
            <input type="password" />
          </label>
          <button className="primary-button" type="button">
            Iniciar sesion
          </button>
        </form>

        <div className="role-entry">
          <h2>Entrar como</h2>
          <Link href="/cliente">Cliente</Link>
          <Link href="/staff">Staff</Link>
          <Link href="/portero">Portero</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </section>
    </main>
  );
}
