import { useState } from "react";
import "./Secretario.css";
import logo from "./logo-cb-clinical.svg"; // exporte a logo do seu design

const digits = (v) => v.replace(/\D/g, "");

const maskCpf = (v) =>
  digits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskTelefone = (v) =>
  digits(v)
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

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

function Sidebar({ nome, email }) {
  return (
    <aside className="sidebar">
      <img className="sidebar__logo" src={logo} alt="CB Clinical Ultrassonografia" />

      <nav className="nav" aria-label="Menu principal">
        <a className="nav__item" href="/paciente">
          <BedIcon /> Paciente
        </a>
        <a className="nav__item nav__item--active" href="/cadastro" aria-current="page">
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

export default function Secretario({
  nome = "Nome Secretario",
  email = "nome.secretario@gmail.com",
  onSubmit,
}) {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    nascimento: "",
    email: "",
  });

  const set = (field, transform = (v) => v) => (e) =>
    setForm((f) => ({ ...f, [field]: transform(e.target.value) }));

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form); // troque pela chamada à sua API
  }

  return (
    <div className="app">
      <Sidebar nome={nome} email={email} />

      <main className="main">
        <header className="main__header">
          <h1 className="badge">Cadastro</h1>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__grid">
            <div className="form__col">
              <div className="field">
                <label htmlFor="nome">Nome Completo</label>
                <input id="nome" type="text" autoComplete="name" value={form.nome} onChange={set("nome")} required />
              </div>
              <div className="field">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={set("telefone", maskTelefone)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={set("cpf", maskCpf)}
                  required
                />
              </div>
            </div>

            <div className="form__col">
              <div className="field">
                <label htmlFor="nascimento">Data de Nascimento</label>
                <input id="nascimento" type="date" value={form.nascimento} onChange={set("nascimento")} required />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
              </div>
            </div>
          </div>

          <button type="submit" className="form__submit">Enviar</button>
        </form>
      </main>
    </div>
  );
}