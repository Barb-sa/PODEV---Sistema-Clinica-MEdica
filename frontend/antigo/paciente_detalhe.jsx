import "./Secretario_paci.css";
import Sidebar from "./sidebar_paci";

// Troque por dados da sua API (ex.: GET /api/pacientes/<id>)
const PACIENTE_MOCK = {
  nome: "Ana Silva",
  nascimento: "1994-03-15",
  cpf: "234.848.748.09",
  celular: "(22) 9 0000-0000",
  email: "ana.silva@gmail.com",
  exames: [
    { id: 1, data: "2023-01-01T12:30", exame: "MRI", medico: "Dr. Paul MBBS,. MS." },
    { id: 2, data: "2023-01-07T01:30", exame: "CGB", medico: "Dr. Jenni MBBS,. MS." },
    { id: 3, data: "2023-01-15T13:30", exame: "VJB", medico: "Dr. Jenni MBBS,. MS." },
    { id: 4, data: "2023-01-17T15:30", exame: "TIUSSE", medico: "Dr. Paul MBBS,. MS." },
    { id: 5, data: "2023-01-21T20:30", exame: "BONE", medico: "Dr. Paul MBBS,. MS." },
  ],
};

const fmtData = (iso) => new Date(iso).toLocaleDateString("pt-BR");
const fmtHora = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function calcIdade(nascimento) {
  const n = new Date(nascimento);
  const hoje = new Date();
  const idade = hoje.getFullYear() - n.getFullYear();
  const fezAniversario =
    hoje.getMonth() > n.getMonth() ||
    (hoje.getMonth() === n.getMonth() && hoje.getDate() >= n.getDate());
  return fezAniversario ? idade : idade - 1;
}

export default function PacienteDetalhe({
  paciente = PACIENTE_MOCK, // objeto com a mesma forma do mock; use null se não encontrado
  nome = "Nome Secretario",
  email = "nome.secretario@gmail.com",
}) {
  return (
    <div className="app">
      <Sidebar active="paciente" nome={nome} email={email} />

      <main className="main detalhe">
        {!paciente ? (
          <p className="vazio">Paciente não encontrado.</p>
        ) : (
          <>
            <h1 className="detalhe__nome">{paciente.nome}</h1>
            <ul className="detalhe__info">
              <li>
                <span>Idade: {calcIdade(paciente.nascimento)}</span>
                <span>CPF: {paciente.cpf}</span>
              </li>
              <li>Celular : {paciente.celular}</li>
              <li>E-Mail : {paciente.email}</li>
            </ul>

            <section className="exames" aria-label="Exames do paciente">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Exame</th>
                    <th scope="col">Médico Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {paciente.exames.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <time>{fmtData(e.data)}</time>
                        <time>{fmtHora(e.data)}</time>
                      </td>
                      <td>{e.exame}</td>
                      <td>{e.medico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
}