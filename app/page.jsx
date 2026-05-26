const highlights = [
  "Agenda de eventos",
  "Control de entradas",
  "Panel operativo",
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Flex Concierto</p>
        <h1>Gestiona conciertos desde una base Next.js lista para crecer.</h1>
        <p className="intro">
          La aplicacion ya tiene una ruta raiz valida con App Router para poder
          compilar, ejecutar lint y continuar el desarrollo sobre una estructura
          soportada por Next.js 16.
        </p>
        <div className="actions" aria-label="Areas iniciales">
          {highlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
