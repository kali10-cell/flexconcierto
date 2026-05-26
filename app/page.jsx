"use client";

import { useMemo, useState } from "react";

const roles = {
  cliente: {
    name: "Cliente",
    subtitle: "Pide, reserva y entra con tu QR.",
    nav: ["Inicio", "Comida", "Reservas", "QR", "Perfil"],
  },
  staff: {
    name: "Staff",
    subtitle: "Mesas, pedidos y estados de cocina.",
    nav: ["Panel", "Mesas", "Pedidos", "Actividad"],
  },
  portero: {
    name: "Portero",
    subtitle: "Escaneo rapido de accesos a salas.",
    nav: ["Escaner", "Accesos", "Historial"],
  },
  admin: {
    name: "Admin",
    subtitle: "Usuarios, productos y control operativo.",
    nav: ["Panel", "Usuarios", "Productos", "Reportes"],
  },
};

const rooms = [
  { name: "Sala Negra", capacity: "6 - 10", price: "250", tone: "black" },
  { name: "Sala Roja", capacity: "6 - 12", price: "350", tone: "red" },
  { name: "Sala Dorada", capacity: "6 - 15", price: "500", tone: "gold" },
];

const products = [
  { name: "Burger FLEX", category: "Comida", price: "18,00" },
  { name: "Sushi Mix", category: "Comida", price: "24,00" },
  { name: "Mojito Gold", category: "Bebida", price: "12,00" },
];

const orders = [
  { table: "Mesa 05", items: "Burger FLEX + Agua", state: "Pendiente", total: "28,00" },
  { table: "Mesa 08", items: "Sushi Mix + Red Bull", state: "Preparando", total: "32,00" },
  { table: "Mesa 12", items: "Nachos + Mojito", state: "Completado", total: "30,00" },
];

const users = [
  { name: "Juan Perez", role: "cliente", status: "Activo" },
  { name: "Maria Lopez", role: "staff", status: "Activo" },
  { name: "Carlos Ruiz", role: "portero", status: "Invitado" },
];

function Logo() {
  return (
    <div className="brand">
      <strong>FLEX</strong>
      <span>Own the night</span>
    </div>
  );
}

function QR() {
  return (
    <div className="qr-code" aria-label="QR de acceso">
      {Array.from({ length: 100 }).map((_, index) => (
        <span key={index} className={(index * 11 + 3) % 7 < 3 ? "active" : ""} />
      ))}
    </div>
  );
}

function Field({ label, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} />
    </label>
  );
}

function RoleButton({ id, active, onClick }) {
  const role = roles[id];

  return (
    <button className={active ? "role-button active" : "role-button"} onClick={onClick}>
      <strong>{role.name}</strong>
      <span>{role.subtitle}</span>
    </button>
  );
}

function AuthScreen({ selectedRole, setSelectedRole, setAuthenticated }) {
  const [mode, setMode] = useState("login");

  return (
    <main className="auth-screen">
      <section className="auth-visual">
        <Logo />
        <div>
          <p className="eyebrow">Tres salas. Una app.</p>
          <h1>Gestiona la noche desde una interfaz rapida y clara.</h1>
          <p>
            Login, reservas, pedidos, QR y administracion con el mismo lenguaje
            visual de FLEX.
          </p>
        </div>
        <div className="room-strip">
          {rooms.map((room) => (
            <article className={`mini-room ${room.tone}`} key={room.name}>
              <span>{room.name}</span>
              <strong>{room.price}€</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Registro
          </button>
        </div>

        <div className="form-card">
          <h2>{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h2>
          {mode === "register" ? <Field label="Nombre completo" /> : null}
          <Field label="Correo electronico" type="email" />
          {mode === "register" ? <Field label="Telefono" type="tel" /> : null}
          <Field label="Contrasena" type="password" />
          {mode === "register" ? <Field label="Confirmar contrasena" type="password" /> : null}

          <div className="role-picker">
            {Object.keys(roles).map((roleId) => (
              <RoleButton
                active={selectedRole === roleId}
                id={roleId}
                key={roleId}
                onClick={() => setSelectedRole(roleId)}
              />
            ))}
          </div>

          <button className="primary" onClick={() => setAuthenticated(true)}>
            {mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </div>
      </section>
    </main>
  );
}

function AppShell({ selectedRole, setSelectedRole, setAuthenticated }) {
  const role = roles[selectedRole];
  const [activeNav, setActiveNav] = useState(role.nav[0]);

  const nav = useMemo(() => roles[selectedRole].nav, [selectedRole]);

  function changeRole(roleId) {
    setSelectedRole(roleId);
    setActiveNav(roles[roleId].nav[0]);
  }

  return (
    <main className="app-layout">
      <aside className="sidebar">
        <Logo />
        <div className="role-switcher">
          {Object.keys(roles).map((roleId) => (
            <button
              className={selectedRole === roleId ? "active" : ""}
              key={roleId}
              onClick={() => changeRole(roleId)}
            >
              {roles[roleId].name}
            </button>
          ))}
        </div>
        <nav>
          {nav.map((item) => (
            <button
              className={activeNav === item ? "active" : ""}
              key={item}
              onClick={() => setActiveNav(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <button className="ghost" onClick={() => setAuthenticated(false)}>
          Cerrar sesion
        </button>
      </aside>

      <section className="workspace">
        <header className="app-header">
          <div>
            <p className="eyebrow">{role.name}</p>
            <h1>{activeNav}</h1>
            <span>{role.subtitle}</span>
          </div>
          <div className="profile-chip">
            <span>JP</span>
            <strong>Juan Perez</strong>
          </div>
        </header>

        {selectedRole === "cliente" ? <ClienteView /> : null}
        {selectedRole === "staff" ? <StaffView /> : null}
        {selectedRole === "portero" ? <PorteroView /> : null}
        {selectedRole === "admin" ? <AdminView /> : null}
      </section>
    </main>
  );
}

function ClienteView() {
  return (
    <div className="screen-grid cliente-grid">
      <section className="hero-card">
        <h2>Reserva tu sala</h2>
        <p>Elige ambiente, confirma la hora y recibe tu QR de acceso.</p>
        <div className="room-cards">
          {rooms.map((room) => (
            <article className={`room-card ${room.tone}`} key={room.name}>
              <span>{room.name}</span>
              <strong>{room.price}€</strong>
              <small>{room.capacity} personas</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel qr-panel">
        <h2>Tu QR</h2>
        <QR />
        <p>Mesa Dorada 05 · 24 Mayo · 23:00</p>
        <span className="badge success">Entrada activa</span>
      </section>

      <section className="panel">
        <PanelHeader title="Pedir comida" action="Ver menu" />
        <ItemList items={products.map((item) => [item.name, item.category, `${item.price}€`])} />
      </section>
    </div>
  );
}

function StaffView() {
  return (
    <div className="screen-grid">
      <Metrics
        items={[
          ["12", "Mesas ocupadas"],
          ["8", "Pendientes"],
          ["5", "Preparando"],
          ["24", "Completados"],
        ]}
      />
      <section className="panel wide">
        <PanelHeader title="Pedidos en sala" action="Nuevo pedido" />
        <OrderList />
      </section>
      <section className="panel">
        <h2>Cambiar estado</h2>
        <div className="state-actions">
          <button>Pendiente</button>
          <button>Preparando</button>
          <button className="success">Completado</button>
        </div>
      </section>
    </div>
  );
}

function PorteroView() {
  return (
    <div className="door-grid">
      <section className="scanner">
        <div className="scan-line" />
        <QR />
      </section>
      <section className="panel access-result">
        <p className="eyebrow">Resultado</p>
        <h2>Acceso permitido</h2>
        <dl>
          <div>
            <dt>Sala</dt>
            <dd>Roja 07</dd>
          </div>
          <div>
            <dt>Invitado</dt>
            <dd>Juan Perez</dd>
          </div>
          <div>
            <dt>Personas</dt>
            <dd>6</dd>
          </div>
        </dl>
        <button className="primary">Validar entrada</button>
      </section>
    </div>
  );
}

function AdminView() {
  return (
    <div className="screen-grid">
      <Metrics
        items={[
          ["48", "Usuarios"],
          ["32", "Productos"],
          ["156", "Pedidos hoy"],
          ["2.450€", "Ingresos"],
        ]}
      />
      <section className="panel">
        <PanelHeader title="Usuarios" action="Crear usuario" />
        <ItemList items={users.map((user) => [user.name, user.role, user.status])} />
      </section>
      <section className="panel">
        <PanelHeader title="Productos" action="Crear producto" />
        <ItemList items={products.map((item) => [item.name, item.category, `${item.price}€`])} />
      </section>
      <section className="panel wide action-panel">
        <button>Editar usuario</button>
        <button>Editar producto</button>
        <button className="danger">Borrar producto</button>
      </section>
    </div>
  );
}

function Metrics({ items }) {
  return (
    <section className="metrics">
      {items.map(([value, label]) => (
        <article className="metric" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </section>
  );
}

function PanelHeader({ title, action }) {
  return (
    <div className="panel-header">
      <h2>{title}</h2>
      <button>{action}</button>
    </div>
  );
}

function ItemList({ items }) {
  return (
    <div className="item-list">
      {items.map(([title, meta, value]) => (
        <article className="item-row" key={`${title}-${meta}`}>
          <div>
            <strong>{title}</strong>
            <span>{meta}</span>
          </div>
          <b>{value}</b>
        </article>
      ))}
    </div>
  );
}

function OrderList() {
  return (
    <div className="item-list">
      {orders.map((order) => (
        <article className="item-row order-row" key={order.table}>
          <div>
            <strong>{order.table}</strong>
            <span>{order.items}</span>
          </div>
          <span className={`badge ${order.state === "Completado" ? "success" : ""}`}>
            {order.state}
          </span>
          <b>{order.total}€</b>
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState("cliente");
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (
      <AuthScreen
        selectedRole={selectedRole}
        setAuthenticated={setAuthenticated}
        setSelectedRole={setSelectedRole}
      />
    );
  }

  return (
    <AppShell
      selectedRole={selectedRole}
      setAuthenticated={setAuthenticated}
      setSelectedRole={setSelectedRole}
    />
  );
}
