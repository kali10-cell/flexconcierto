"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = {
  cliente: [
    ["Inicio", "/cliente"],
    ["Pedir comida", "/cliente#comida"],
    ["Reservar salas", "/cliente#salas"],
    ["Mi QR", "/cliente#qr"],
  ],
  staff: [
    ["Panel", "/staff"],
    ["Mesas", "/staff#mesas"],
    ["Pedidos", "/staff#pedidos"],
    ["Actividad", "/staff#actividad"],
  ],
  portero: [
    ["Escaner", "/portero"],
    ["Entradas", "/portero#entradas"],
    ["Historial", "/portero#historial"],
  ],
  admin: [
    ["Panel", "/admin"],
    ["Usuarios", "/admin#usuarios"],
    ["Productos", "/admin#productos"],
    ["Reportes", "/admin#reportes"],
  ],
};

export const rooms = [
  { name: "Sala Negra", detail: "Intimidad, estilo, conexion", price: "250", tone: "black" },
  { name: "Sala Roja", detail: "Energia, ritmo, pasion", price: "350", tone: "red" },
  { name: "Sala Dorada", detail: "Lujo, exclusividad, poder", price: "500", tone: "gold" },
];

export const products = [
  ["Burger FLEX", "Comida", "18,00"],
  ["Sushi Mix", "Comida", "24,00"],
  ["Mojito Gold", "Bebida", "12,00"],
  ["Red Bull", "Bebida", "6,00"],
];

export const orders = [
  ["Mesa 05", "Burger FLEX + Agua", "Pendiente", "28,00"],
  ["Mesa 08", "Sushi Mix + Red Bull", "Preparando", "32,00"],
  ["Mesa 12", "Nachos Supreme + Mojito", "Completado", "30,00"],
];

export const users = [
  ["Juan Perez", "cliente", "Activo"],
  ["Maria Lopez", "staff", "Activo"],
  ["Carlos Ruiz", "portero", "Invitado"],
  ["Ana Martinez", "cliente", "VIP"],
];

export function Logo() {
  return (
    <Link className="logo" href="/">
      <strong>FLEX</strong>
      <span>Own the night</span>
    </Link>
  );
}

export function AppFrame({ role, title, subtitle, children }) {
  const pathname = usePathname();

  return (
    <main className="app-frame">
      <aside className="side-nav">
        <Logo />
        <div className="role-label">{role}</div>
        <nav>
          {navItems[role].map(([label, href]) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="side-card">
          <span>FLEX Club</span>
          <strong>QR y salas en tiempo real</strong>
        </div>
        <Link className="logout-link" href="/">
          Cerrar sesion
        </Link>
      </aside>

      <section className="app-content">
        <header className="page-header">
          <div>
            <p>{role}</p>
            <h1>{title}</h1>
            <span>{subtitle}</span>
          </div>
          <div className="user-pill">
            <span>JP</span>
            <strong>Juan Perez</strong>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function StatGrid({ stats }) {
  return (
    <section className="stat-grid">
      {stats.map(([value, label, tone]) => (
        <article className={`stat-card ${tone || ""}`} key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </section>
  );
}

export function Panel({ title, action, children, id, className = "" }) {
  return (
    <section className={`panel ${className}`} id={id}>
      <div className="panel-heading">
        <h2>{title}</h2>
        {action ? <button>{action}</button> : null}
      </div>
      {children}
    </section>
  );
}

export function DataList({ rows, action }) {
  return (
    <div className="data-list">
      {rows.map((row) => (
        <article className="data-row" key={row.join("-")}>
          <div>
            <strong>{row[0]}</strong>
            <span>{row.slice(1, -1).join(" · ")}</span>
          </div>
          <div className="row-actions">
            <b>{row.at(-1)}</b>
            {action ? <button>{action}</button> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function QRBlock({ label = "Mesa Dorada 05" }) {
  return (
    <div className="qr-block">
      <div className="qr-code" aria-label="QR de acceso">
        {Array.from({ length: 100 }).map((_, index) => (
          <span key={index} className={(index * 9 + 5) % 7 < 3 ? "active" : ""} />
        ))}
      </div>
      <strong>{label}</strong>
      <span>24 Mayo · 23:00 · Invitado VIP</span>
    </div>
  );
}

export function HeroMedia({ title, eyebrow, children }) {
  return (
    <section className="hero-media">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
