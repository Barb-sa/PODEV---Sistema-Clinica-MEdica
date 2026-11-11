// Troque estes dados pela resposta da sua API (ex.: GET /api/pacientes/<id>)
const ana = {
  nome: "Ana Silva",
  nascimento: "1994-03-15",
  cpf: "234.848.748.09",
  celular: "(22) 9 0000-0000",
  email: "ana.silva@gmail.com",
  exames: [
    { data: "2023-01-01T12:30", exame: "MRI", medico: "Dr. Paul MBBS,. MS." },
    { data: "2023-01-07T01:30", exame: "CGB", medico: "Dr. Jenni MBBS,. MS." },
    { data: "2023-01-15T13:30", exame: "VJB", medico: "Dr. Jenni MBBS,. MS." },
    { data: "2023-01-17T15:30", exame: "TIUSSE", medico: "Dr. Paul MBBS,. MS." },
    { data: "2023-01-21T20:30", exame: "BONE", medico: "Dr. Paul MBBS,. MS." },
  ],
};
const pacientes = [1, 2, 3, 4, 5, 6].map((id) => ({ id, ...ana }));

const fmtData = (iso) => new Date(iso).toLocaleDateString("pt-BR");
const fmtHora = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function calcIdade(nascimento) {
  const n = new Date(nascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - n.getFullYear();
  const fezAniversario =
    hoje.getMonth() > n.getMonth() ||
    (hoje.getMonth() === n.getMonth() && hoje.getDate() >= n.getDate());
  return fezAniversario ? idade : idade - 1;
}

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("detalhe");
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = pacientes.find((x) => x.id === id);

  if (!p) {
    el.innerHTML = '<p class="vazio">Paciente não encontrado.</p>';
    return;
  }

  const linhas = p.exames
    .map(
      (e) => `
      <tr>
        <td><time>${fmtData(e.data)}</time><time>${fmtHora(e.data)}</time></td>
        <td></td>
        <td></td>
      </tr>`
    )
    .join("");

  el.innerHTML = `
    <h1 class="detalhe__nome"></h1>
    <ul class="detalhe__info">
      <li><span>Idade: ${calcIdade(p.nascimento)}</span><span class="cpf"></span></li>
      <li class="celular"></li>
      <li class="email"></li>
    </ul>
    <section class="exames" aria-label="Exames do paciente">
      <table>
        <thead><tr><th scope="col">Data</th><th scope="col">Exame</th><th scope="col">Médico Responsável</th></tr></thead>
        <tbody>${linhas}</tbody>
      </table>
    </section>`;

  // textContent evita injetar HTML vindo de dados externos
  el.querySelector(".detalhe__nome").textContent = p.nome;
  el.querySelector(".cpf").textContent = "CPF: " + p.cpf;
  el.querySelector(".celular").textContent = "Celular : " + p.celular;
  el.querySelector(".email").textContent = "E-Mail : " + p.email;
  el.querySelectorAll("tbody tr").forEach((tr, i) => {
    tr.children[1].textContent = p.exames[i].exame;
    tr.children[2].textContent = p.exames[i].medico;
  });
});