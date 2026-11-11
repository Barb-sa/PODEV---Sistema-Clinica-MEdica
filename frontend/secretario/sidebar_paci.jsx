import logo from "./logo-cb-clinical.svg"; // exporte a logo do seu design

function BedIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
      <path d="M3 6h3v17h28v-4.5A5.5 5.5 0 0 0 28.5 13H15v10H12V10h16.5A8.5 8.5 0 0 1 37 18.5V34h-3v-8H6v8H3V6Z" />
      <circle cx="10" cy="17" r="3.2" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3.2" aria-hidden="true">
      <rect x="5" y="5" width="12" height="12" rx="1.5" />
      <rect x="23" y="5" width="12" height="20" rx="1.5" />
      <rect x="5" y="23" width="12" height="12" rx="1.5" />
      <rect x="23" y="31" width="12" height="4" rx="1.5" />
    </svg>
  );
}

// active: "paciente" | "cadastro"
export default function Sidebar({ active, nome, email }) {
  const cls = (name) => `nav__item${active === name ? " nav__item--active" : ""}`;
  const current = (name) => (active === name ? "page" : undefined);

  return (
    <aside className="sidebar">
      <img className="sidebar__logo" src={logo} alt="CB Clinical Ultrassonografia" />

      <nav className="nav" aria-label="Menu principal">
        <a className={cls("paciente")} href="/paciente" aria-current={current("paciente")}>
          <BedIcon /> Paciente
        </a>
        <a className={cls("cadastro")} href="/cadastro" aria-current={current("cadastro")}>
          <GridIcon /> Cadastro
        </a>
      </nav>

      <div className="sidebar__user">
        <p className="sidebar__name">{nome}</p>
        <p className="sidebar__email">{email}</p>
      </div>
    </aside>
  );
}