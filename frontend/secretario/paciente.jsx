import { useMemo, useState } from "react";
import "./secretario_paci.css";
import Sidebar from "./sidebar_paci";

// Troque por dados da sua API
const PACIENTES_MOCK = [
  { id: 1, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 2, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 3, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 4, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 5, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 6, nome: "Ana Silva", data: "2023-01-01T12:30" },
];

const normalize = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const fmtData = (iso) => new Date(iso).toLocaleDateString("pt-BR");
const fmtHora = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function SlidersIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="10" x2="15" y2="10" /><circle cx="19" cy="10" r="3" /><line x1="23" y1="10" x2="28" y2="10" />
      <line x1="4" y1="22" x2="9" y2="22" /><circle cx="13" cy="22" r="3" /><line x1="17" y1="22" x2="28" y2="22" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="14" cy="14" r="9" /><line x1="21" y1="21" x2="28" y2="28" />
    </svg>
  );
}

export default function Paciente({
  pacientes = PACIENTES_MOCK,
  nome = "Nome Secretario",
  email = "nome.secretario@gmail.com",
}) {
  const [busca, setBusca] = useState("");
  const [recentesPrimeiro, setRecentesPrimeiro] = useState(true);

  const itens = useMemo(() => {
    const termo = normalize(busca.trim());
    return pacientes
      .filter((p) => normalize(p.nome).includes(termo))
      .sort((a, b) => (recentesPrimeiro ? 1 : -1) * (new Date(b.data) - new Date(a.data)));
  }, [pacientes, busca, recentesPrimeiro]);

  return (
    <div className="app">
      <Sidebar active="paciente" nome={nome} email={email} />

      <main className="main pacientes">
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Buscar paciente"
            aria-label="Buscar paciente"
            autoComplete="off"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setRecentesPrimeiro((v) => !v)}
            aria-pressed={!recentesPrimeiro}
            aria-label={recentesPrimeiro ? "Ordenar: mais recentes primeiro" : "Ordenar: mais antigos primeiro"}
            title="Inverter ordem por data"
          >
            <SlidersIcon />
          </button>
          <button type="submit" className="icon-btn" aria-label="Buscar">
            <SearchIcon />
          </button>
        </form>

        <ul className="patient-list">
          {itens.length === 0 && <li className="empty">Nenhum paciente encontrado.</li>}
          {itens.map((p) => (
            <li key={p.id}>
              <a className="patient" href={`/paciente/${p.id}`}>
                <span className="patient__name">{p.nome}</span>
                <span className="patient__when">
                  <time>{fmtData(p.data)}</time>
                  <time>{fmtHora(p.data)}</time>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}