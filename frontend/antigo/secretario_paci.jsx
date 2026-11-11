import { useState } from "react";
import "./secretario_paci.css";
import Sidebar from "./sidebar_paci";

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
      <Sidebar active="cadastro" nome={nome} email={email} />

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