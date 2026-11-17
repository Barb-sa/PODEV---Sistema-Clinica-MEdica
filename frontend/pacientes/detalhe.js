import "../js/perfil-teste.js";               // TEMPORÁRIO: apagar junto com o arquivo
import { montarSidebar } from "../js/sidebar.js";
// Quando o login e a API estiverem prontos, descomente:
// import { proteger } from "../js/auth.js";
// import { api } from "../js/api.js";
// proteger(["SECRETARIO", "MEDICO", "ADMIN"]);

// ---------------------------------------------------------------
// QUEM VÊ O QUÊ (para mudar uma regra, mude só estas listas)
// ---------------------------------------------------------------
const PERFIS_BUSCA = ["MEDICO", "ADMIN"];       // barra de busca no topo
const PERFIS_NOVO_EXAME = ["MEDICO", "ADMIN"];  // botão "Inserir Novo Exame"


const PERFIS_EXAMES = ["MEDICO", "ADMIN"];

const COLUNAS = {
  MEDICO: ["data", "exame", "laudo"],               // só vê os próprios pacientes
  ADMIN: ["data", "exame", "medico", "laudo"],      // vê todos, então mostra o médico
  SECRETARIO: ["data", "exame", "medico"],
};
const TITULOS = { data: "Data", exame: "Exame", medico: "Médico Responsável", laudo: "Laudo" };

const perfil = sessionStorage.getItem("perfil");
const pode = (lista) => lista.includes(perfil);

// ---------------------------------------------------------------
// DADOS DE EXEMPLO (troque pelas chamadas à API quando ela existir)
// ---------------------------------------------------------------
const ana = {
  nome: "Ana Silva",
  nascimento: "1994-03-15",
  cpf: "234.848.748-09",
  celular: "(22) 9 0000-0000",
  email: "ana.silva@gmail.com",
  exames: [
    { data: "2023-01-01T12:30", exame: "MRI", medico: "Dr. Paul MBBS,. MS.", laudo_url: "#" },
    { data: "2023-01-07T01:30", exame: "CGB", medico: "Dr. Jenni MBBS,. MS.", laudo_url: "#" },
    { data: "2023-01-15T13:30", exame: "VJB", medico: "Dr. Jenni MBBS,. MS.", laudo_url: "#" },
    { data: "2023-01-17T15:30", exame: "TIUSSE", medico: "Dr. Paul MBBS,. MS.", laudo_url: "#" },
    { data: "2023-01-21T20:30", exame: "BONE", medico: "Dr. Paul MBBS,. MS.", laudo_url: null }, // sem laudo ainda
  ],
};
const PACIENTES = [1, 2, 3, 4, 5, 6].map((id) => ({ id, ...ana }));

async function carregarPaciente(id) {
  // return api(`/pacientes/${id}/`);
  return PACIENTES.find((p) => p.id === id) || null;
}

// Só é chamada para quem pode ver exames: o secretário nem chega a pedir.
// O Django também precisa recusar (403) e, para o médico, devolver só os pacientes dele.
async function carregarExames(id) {
  // return api(`/pacientes/${id}/exames/`);
  return PACIENTES.find((p) => p.id === id)?.exames ?? [];
}

// ---------------------------------------------------------------
// FUNÇÕES AUXILIARES
// ---------------------------------------------------------------
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

// Cria um elemento e coloca o texto com textContent (nunca interpreta HTML).
function el(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

// Só aceita links http/https (evita "javascript:" vindo de dados externos).
function urlSegura(u) {
  try {
    const x = new URL(u, location.href);
    return ["http:", "https:"].includes(x.protocol) ? x.href : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// PEÇAS DA TELA
// ---------------------------------------------------------------
const SVG_LUPA = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="14" cy="14" r="9" /><line x1="21" y1="21" x2="28" y2="28" /></svg>`;

function criarBusca() {
  const form = el("form", "search");
  form.setAttribute("role", "search");

  const input = el("input");
  input.type = "search";
  input.placeholder = "Buscar paciente";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Buscar paciente");

  const botao = el("button", "icon-btn");
  botao.type = "submit";
  botao.setAttribute("aria-label", "Buscar");
  botao.innerHTML = SVG_LUPA; // markup fixo, sem dados do usuário

  form.append(input, botao);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const termo = input.value.trim();
    location.href = "lista.html" + (termo ? `?q=${encodeURIComponent(termo)}` : "");
  });
  return form;
}

function criarCabecalho(p) {
  const cab = el("header", "detalhe__cab");
  cab.append(el("h1", "detalhe__nome", p.nome));

  const info = el("ul", "detalhe__info");
  const linha = el("li", "detalhe__linha");
  linha.append(el("span", null, `Idade: ${calcIdade(p.nascimento)}`), el("span", null, `CPF: ${p.cpf}`));
  info.append(linha, el("li", null, `Celular : ${p.celular}`), el("li", null, `E-Mail : ${p.email}`));

  cab.append(info);
  return cab;
}

function criarBotaoNovoExame(id) {
  const caixa = el("div", "detalhe__acoes");
  const link = el("a", "btn-pilula", "Inserir Novo Exame");
  link.href = `../medico/novo-exame.html?id=${encodeURIComponent(id)}`; // página ainda a criar
  caixa.append(link);
  return caixa;
}

function criarCelula(coluna, exame) {
  const td = el("td");
  if (coluna === "data") {
    td.append(el("time", null, fmtData(exame.data)), el("time", null, fmtHora(exame.data)));
  } else if (coluna === "exame") {
    td.textContent = exame.exame;
  } else if (coluna === "medico") {
    td.textContent = exame.medico;
  } else if (coluna === "laudo") {
    const url = exame.laudo_url ? urlSegura(exame.laudo_url) : null;
    if (url) {
      const a = el("a", "laudo", "Clique Aqui");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      td.append(a);
    } else {
      td.append(el("span", "laudo laudo--pendente", "Pendente"));
    }
  }
  return td;
}

function criarTabelaExames(exames, colunas) {
  const secao = el("section", "exames");
  secao.setAttribute("aria-label", "Exames do paciente");

  const tabela = el("table");
  const cabecalho = el("tr");
  colunas.forEach((c) => {
    const th = el("th", null, TITULOS[c]);
    th.scope = "col";
    cabecalho.append(th);
  });
  const thead = el("thead");
  thead.append(cabecalho);
  tabela.append(thead);

  const corpo = el("tbody");
  if (!exames.length) {
    const tr = el("tr");
    const td = el("td", "exames__vazio", "Nenhum exame cadastrado.");
    td.colSpan = colunas.length;
    tr.append(td);
    corpo.append(tr);
  }
  exames.forEach((exame) => {
    const tr = el("tr");
    colunas.forEach((c) => tr.append(criarCelula(c, exame)));
    corpo.append(tr);
  });

  tabela.append(corpo);
  secao.append(tabela);
  return secao;
}

function mostrarMensagem(main, texto, comLink = false) {
  const p = el("p", "vazio", texto);
  if (comLink) {
    p.append(" ");
    const voltar = el("a", null, "Voltar para a lista");
    voltar.href = "lista.html";
    p.append(voltar);
  }
  main.replaceChildren(p);
}

// ---------------------------------------------------------------
// MONTAGEM DA PÁGINA
// ---------------------------------------------------------------
async function iniciar() {
  montarSidebar();

  const main = document.getElementById("detalhe");
  const id = Number(new URLSearchParams(location.search).get("id"));
  const paciente = await carregarPaciente(id);

  if (!paciente) {
    mostrarMensagem(main, "Paciente não encontrado.", true);
    return;
  }

  main.replaceChildren();
  main.classList.toggle("detalhe--sem-busca", !pode(PERFIS_BUSCA));

  if (pode(PERFIS_BUSCA)) main.append(criarBusca());
  main.append(criarCabecalho(paciente));
  if (pode(PERFIS_NOVO_EXAME)) main.append(criarBotaoNovoExame(paciente.id));

  if (pode(PERFIS_EXAMES)) {
    const exames = await carregarExames(paciente.id);
    main.append(criarTabelaExames(exames, COLUNAS[perfil]));
  }
}

iniciar().catch(() => {
  mostrarMensagem(document.getElementById("detalhe"), "Não foi possível carregar o paciente. Tente novamente.");
});
