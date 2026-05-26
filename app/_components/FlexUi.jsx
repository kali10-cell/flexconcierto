"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const brand = {
  slogan: "La noche se reserva. La experiencia se controla.",
};

export const photos = {
  club: "/images/club-crowd.jpg",
  stage: "/images/live-stage.jpg",
  front: "/images/front-row.jpg",
  gold: "/images/gold-room.jpg",
  burger: "/images/food-burger.jpg",
  sushi: "/images/food-sushi.jpg",
  mojito: "/images/drink-mojito.jpg",
  energy: "/images/drink-energy.jpg",
};

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
    ["Escáner", "/portero"],
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
  {
    name: "Sala Negra",
    detail: "Intimidad, estilo, conexión",
    price: "250",
    tone: "black",
    capacity: "6 personas",
    time: "22:30",
    status: "Libre",
    image: photos.front,
  },
  {
    name: "Sala Roja",
    detail: "Energía, ritmo, pasión",
    price: "350",
    tone: "red",
    capacity: "8 personas",
    time: "23:00",
    status: "2 quedan",
    image: photos.club,
  },
  {
    name: "Sala Dorada",
    detail: "Lujo, exclusividad, poder",
    price: "500",
    tone: "gold",
    capacity: "10 personas",
    time: "23:30",
    status: "VIP",
    image: photos.gold,
  },
];

export const products = [
  { name: "Burger FLEX", category: "Comida", price: "18,00", image: photos.burger, tag: "Top noche" },
  { name: "Sushi Mix", category: "Comida", price: "24,00", image: photos.sushi, tag: "Para compartir" },
  { name: "Mojito Gold", category: "Bebida", price: "12,00", image: photos.mojito, tag: "Cóctel" },
  { name: "Red Bull", category: "Bebida", price: "6,00", image: photos.energy, tag: "Energía" },
];

export const productRows = products.map((product) => [product.name, product.category, product.price]);

export const orders = [
  ["Mesa 05", "Burger FLEX + Agua", "Pendiente", "28,00"],
  ["Mesa 08", "Sushi Mix + Red Bull", "Preparando", "32,00"],
  ["Mesa 12", "Nachos Supreme + Mojito", "Completado", "30,00"],
];

export const users = [
  ["Juan Pérez", "cliente", "Activo"],
  ["María López", "staff", "Activo"],
  ["Carlos Ruiz", "portero", "Invitado"],
  ["Ana Martínez", "cliente", "VIP"],
];

export function Logo() {
  return (
    <Link className="logo" href="/">
      <strong>FLEX</strong>
      <span>Concierto Club</span>
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
          <strong>{brand.slogan}</strong>
        </div>
        <Link className="logout-link" href="/">
          Cerrar sesión
        </Link>
      </aside>

      <section className="app-content">
        <header className="page-header">
          <div>
            <p>{role}</p>
            <h1>{title}</h1>
            <span>{subtitle}</span>
          </div>
          <div className="header-actions">
            <div className="ops-pill">
              <span>En vivo</span>
              <strong>23:47</strong>
            </div>
            <div className="user-pill">
              <span>JP</span>
              <strong>Juan Pérez</strong>
            </div>
          </div>
        </header>
        {children}
        <nav className="mobile-tabbar">
          {navItems[role].map(([label, href]) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
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

export function ProductMenu({ items = products }) {
  return (
    <div className="product-menu">
      {items.map((item) => (
        <article className="product-card" key={item.name}>
          <Image alt={item.name} className="product-photo" fill sizes="(max-width: 720px) 100vw, 25vw" src={item.image} />
          <div className="product-content">
            <div>
              <span>{item.tag}</span>
              <strong>{item.name}</strong>
              <p>{item.category}</p>
            </div>
            <div className="product-bottom">
              <b>{item.price}€</b>
              <button>Añadir</button>
            </div>
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

export function HeroMedia({ title, eyebrow, image = photos.stage, alt = "", children }) {
  return (
    <section className="hero-media">
      <Image alt={alt || title} className="hero-photo" fill priority sizes="(max-width: 1160px) 100vw, 58vw" src={image} />
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function RoomShowcase({ compact = false }) {
  return (
    <div className={compact ? "room-showcase compact" : "room-showcase"}>
      {rooms.map((room, index) => (
        <article className={`room-feature ${room.tone}`} key={room.name}>
          <Image alt={`${room.name} FLEX`} className="room-photo" fill sizes="(max-width: 720px) 100vw, 33vw" src={room.image} />
          <div className="room-feature-content">
            <div className="room-topline">
              <span>{room.status}</span>
              <b>{room.time}</b>
            </div>
            <strong>{room.name}</strong>
            <p>{room.detail}</p>
            <div className="room-meta">
              <span>{room.capacity}</span>
              <span>Desde {room.price}€</span>
            </div>
            <div className="room-plan" aria-label={`Mapa táctil de ${room.name}`}>
              {Array.from({ length: 12 }).map((_, seat) => (
                <i className={(seat + index) % 4 === 0 ? "taken" : ""} key={seat} />
              ))}
            </div>
            <button className="room-cta">Reservar</button>
          </div>
        </article>
      ))}
    </div>
  );
}
