"use client";

import { useState } from "react";

const roles = [
  {
    id: "cliente",
    label: "Cliente",
    summary: "Pedir comida, reservar salas y ver QR de entrada.",
  },
  {
    id: "staff",
    label: "Staff",
    summary: "Ver mesas, pedidos y cambiar estados.",
  },
  {
    id: "portero",
    label: "Portero",
    summary: "Escanear QR y validar accesos a salas.",
  },
  {
    id: "admin",
    label: "Admin",
    summary: "Gestionar usuarios, productos y reportes.",
  },
];

const menuItems = ["Inicio", "Pedir comida", "Reservar salas", "Mis QR", "Perfil"];

const products = [
  ["Burger FLEX", "18,00", "Mesa 05"],
  ["Sushi Mix", "24,00", "Mesa 08"],
  ["Mojito Gold", "12,00", "Mesa 12"],
];

const orders = [
  ["Mesa 05", "Burger FLEX + Agua", "Pendiente", "28,00"],
  ["Mesa 08", "Sushi Mix + Red Bull", "Preparando", "32,00"],
  ["Mesa 12", "Nachos + Mojito", "Completado", "30,00"],
];

const users = [
  ["Juan Perez", "cliente"],
  ["Maria Lopez", "staff"],
  ["Carlos Ruiz", "portero"],
];

function Logo() {
  return (
    <div className="logo" aria-label="Flex">
      FLEX
      <span>Own the night</span>
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

function Status({ children, tone = "gold" }) {
  return <span className={`status ${tone}`}>{children}</span>;
}

function QrMock() {
  return (
    <div className="qr" aria-label="QR de muestra">
      {Array.from({ length: 81 }).map((_, index) => (
        <span key={index} className={(index * 7 + index) % 5 < 2 ? "on" : ""} />
      ))}
    </div>
  );
}

function LoginRegister() {
  const [selectedRole, setSelectedRole] = useState("cliente");

  return (
    <section className="auth-grid" aria-labelledby="auth-title">
      <div className="section-title">
        <p>Acceso</p>
        <h1 id="auth-title">Login y registro para operar FLEX.</h1>
      </div>

      <article className="panel auth-card">
        <Logo />
        <h2>Iniciar sesion</h2>
        <Field label="Correo electronico" type="email" />
        <Field label="Contrasena" type="password" />
        <div className="inline-row">
          <label>
            <input type="checkbox" /> Recordarme
          </label>
          <button className="link-button">Recuperar</button>
        </div>
        <button className="primary-button">Iniciar sesion</button>
        <div className="oauth-row">
          <button>Google</button>
          <button>Apple</button>
        </div>
      </article>

      <article className="panel auth-card">
        <h2>Crear cuenta</h2>
        <Field label="Nombre completo" />
        <Field label="Correo electronico" type="email" />
        <Field label="Telefono opcional" type="tel" />
        <Field label="Contrasena" type="password" />
        <Field label="Confirmar contrasena" type="password" />
        <label className="checkline">
          <input type="checkbox" /> Acepto terminos y condiciones
        </label>
        <button className="primary-button">Registrarme</button>
      </article>

      <article className="panel role-card">
        <h2>Elige tu rol</h2>
        <p className="muted">El selector define que panel se abre tras acceder.</p>
        <div className="role-list">
          {roles.map((role) => (
            <button
              className={selectedRole === role.id ? "role-option active" : "role-option"}
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
            >
              <span>{role.label}</span>
              <small>{role.summary}</small>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function RoleShell({ role, title, children, nav = [] }) {
  return (
    <article className={`dashboard ${role}`}>
      <aside className="sidebar">
        <Logo />
        <nav>
          {nav.map((item, index) => (
            <button className={index === 0 ? "active" : ""} key={item}>
              {item}
            </button>
          ))}
        </nav>
        <button className="logout">Cerrar sesion</button>
      </aside>
      <div className="workspace">
        <div className="workspace-header">
          <p>{role}</p>
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </article>
  );
}

function ClientePanel() {
  return (
    <RoleShell role="cliente" title="Bienvenido, Juan" nav={menuItems}>
      <div className="action-grid">
        <div className="feature-card food">
          <h3>Pedir comida</h3>
          <p>Explora productos y pide desde tu mesa.</p>
          <button className="primary-button">Ver menu</button>
        </div>
        <div className="feature-card room">
          <h3>Reservar salas</h3>
          <p>Elige sala negra, roja o dorada.</p>
          <button className="primary-button">Reservar</button>
        </div>
        <div className="ticket-card">
          <h3>QR de entrada</h3>
          <QrMock />
          <Status tone="green">Entrada activa</Status>
        </div>
      </div>
      <div className="list-grid">
        <List title="Pedidos recientes" rows={products} />
        <List title="Reservas proximas" rows={[["Sala Dorada 05", "24 Mayo 23:00", "Confirmada"]]} />
      </div>
    </RoleShell>
  );
}

function StaffPanel() {
  return (
    <RoleShell
      role="staff"
      title="Panel de mesas y pedidos"
      nav={["Panel", "Mesas", "Pedidos", "Pendientes", "Completados"]}
    >
      <div className="metric-grid">
        <Metric label="Mesas ocupadas" value="12" />
        <Metric label="Pedidos pendientes" value="8" />
        <Metric label="En preparacion" value="5" />
        <Metric label="Completados hoy" value="24" tone="green" />
      </div>
      <div className="split-grid">
        <List title="Pedidos pendientes" rows={orders} action="Editar" />
        <div className="panel inner-panel">
          <h3>Estado de pedidos</h3>
          <div className="state-list">
            <Status>Pendiente</Status>
            <Status>Preparando</Status>
            <Status tone="green">Completado</Status>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}

function PorteroPanel() {
  return (
    <RoleShell role="portero" title="Escanear QR" nav={["Escanear QR", "Historial"]}>
      <div className="scanner-layout">
        <div className="scanner-frame">
          <QrMock />
        </div>
        <div className="access-card">
          <h3>Sala Roja 07</h3>
          <p>24 Mayo 2024 - 23:00</p>
          <p>6 personas - Juan Perez</p>
          <Status tone="green">Acceso permitido</Status>
        </div>
      </div>
    </RoleShell>
  );
}

function AdminPanel() {
  return (
    <RoleShell
      role="admin"
      title="Panel de administracion"
      nav={["Panel", "Usuarios", "Productos", "Reportes", "Configuracion"]}
    >
      <div className="metric-grid">
        <Metric label="Usuarios" value="48" />
        <Metric label="Productos" value="32" />
        <Metric label="Pedidos hoy" value="156" />
        <Metric label="Ingresos" value="2.450" />
      </div>
      <div className="split-grid">
        <List title="Usuarios recientes" rows={users} action="Editar" />
        <List title="Productos vendidos" rows={products} action="Editar" />
      </div>
      <div className="quick-actions">
        <button>Crear usuario</button>
        <button>Crear producto</button>
        <button>Editar producto</button>
        <button>Borrar producto</button>
      </div>
    </RoleShell>
  );
}

function Metric({ label, value, tone = "gold" }) {
  return (
    <div className={`metric ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function List({ title, rows, action }) {
  return (
    <div className="panel inner-panel">
      <div className="list-title">
        <h3>{title}</h3>
        <button className="link-button">Ver todos</button>
      </div>
      <div className="rows">
        {rows.map((row) => (
          <div className="row" key={row.join("-")}>
            <div>
              <strong>{row[0]}</strong>
              <span>{row.slice(1, -1).join(" - ")}</span>
            </div>
            <div className="row-end">
              <span>{row.at(-1)}</span>
              {action ? <button>{action}</button> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <Logo />
        <div>
          <p>Tres salas. Tres experiencias.</p>
          <span>Interfaz base para login, registro y roles operativos.</span>
        </div>
      </header>
      <LoginRegister />
      <section className="dashboards" aria-label="Paneles por rol">
        <ClientePanel />
        <StaffPanel />
        <PorteroPanel />
        <AdminPanel />
      </section>
    </main>
  );
}
