import "../js/perfil-teste.js";               // TEMPORÁRIO: apagar junto com o arquivo
import { montarSidebar } from "../js/sidebar.js";
// Quando o login e a API estiverem prontos, descomente:
// import { api } from "../js/api.js";
// import { proteger } from "../js/auth.js";
// proteger(["MEDICO", "ADMIN"]);

// ---------------------------------------------------------------
// CONFIGURAÇÕES (mude só aqui)
// ---------------------------------------------------------------
const PERFIS_PERMITIDOS = ["MEDICO", "ADMIN"];

// Tipos de exame do Figma. Depois podem vir da API.
const EXAMES = ["Abdome Total", "Tireóide"];

// Figma: "até 10 MB". Vídeo de ultrassom é maior, então tem limite próprio.
// O limite de vídeo (200 MB) é uma PROPOSTA: combinem com o Cicero, porque o Django
// e o servidor também precisam aceitar esse tamanho.
const LIMITE_IMAGEM_PDF_MB = 10;
const LIMITE_VIDEO_MB = 200;
const MB = 1024 * 1024;

const TIPOS_ACEITOS = {
  "image/jpeg": "imagem",
  "image/png": "imagem",
  "application/pdf": "pdf",
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/webm": "video",
};

const perfil = sessionStorage.getItem("perfil");
const pacienteId = Number(new URLSearchParams(location.search).get("id"));

// ---------------------------------------------------------------
// DADOS DE EXEMPLO (troque pela API quando ela existir)
// ---------------------------------------------------------------
const PACIENTES = [1, 2, 3, 4, 5, 6].map((id) => ({ id, nome: "Ana Silva" }));

async function carregarPaciente(id) {
  // return api(`/pacientes/${id}/`);
  return PACIENTES.find((p) => p.id === id) || null;
}

// SIMULAÇÃO: por enquanto só espera um pouco e finge que deu certo.
// Quando a API existir, apague a simulação e use a chamada real.
// Não envie o id do médico: o Django deve pegar do usuário logado.
// E a data do exame pode ser definida pelo servidor (hoje).
async function enviarExame(dados) {
  // await api("/exames/", { metodo: "POST", dados, arquivo: true });
  await new Promise((resolve) => setTimeout(resolve, 600));
}

// ---------------------------------------------------------------
// FUNÇÕES AUXILIARES
// ---------------------------------------------------------------
const $ = (id) => document.getElementById(id);

function el(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function formatarTamanho(bytes) {
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / MB).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

// devolve uma mensagem de erro, ou null se o arquivo é válido
function validarArquivo(f) {
  const tipo = TIPOS_ACEITOS[f.type];
  if (!tipo) return "formato não aceito.";
  const limite = (tipo === "video" ? LIMITE_VIDEO_MB : LIMITE_IMAGEM_PDF_MB) * MB;
  if (f.size > limite) {
    return `maior que ${tipo === "video" ? LIMITE_VIDEO_MB : LIMITE_IMAGEM_PDF_MB} MB.`;
  }
  return null;
}

const chaveArquivo = (f) => `${f.name}|${f.size}|${f.lastModified}`;

function bloquear(mensagem) {
  const aviso = el("p", "aviso", `${mensagem} `);
  const voltar = el("a", null, "Voltar para a lista");
  voltar.href = "../pacientes/lista.html";
  aviso.append(voltar);
  $("conteudo").replaceChildren(aviso);
}

// ---------------------------------------------------------------
// TELA
// ---------------------------------------------------------------
function preparar(paciente) {
  const form = $("form-exame");
  const select = $("tipo-exame");
  const parte = $("parte-exame");
  const entrada = $("arquivos");
  const dropzone = $("dropzone");
  let arquivos = [];

  // opções do exame
  EXAMES.forEach((nome) => {
    const op = el("option", null, nome);
    op.value = nome;
    select.append(op);
  });
  $("ajuda-arquivos").textContent =
    `JPG, PNG ou PDF (até ${LIMITE_IMAGEM_PDF_MB} MB) e vídeos MP4, MOV ou WebM (até ${LIMITE_VIDEO_MB} MB)`;

  // só mostra a parte de baixo depois de escolher o exame
  const atualizarParte = () => {
    parte.hidden = !select.value;
  };
  select.addEventListener("change", () => {
    $("erro-tipo").textContent = "";
    atualizarParte();
  });
  atualizarParte();

  // ----- arquivos -----
  function mostrarErrosArquivos(mensagens) {
    $("erro-arquivos").replaceChildren(...mensagens.map((m) => el("span", "erro__linha", m)));
  }

  function desenharLista() {
    $("lista-arquivos").replaceChildren(
      ...arquivos.map((f, i) => {
        const li = el("li");
        const remover = el("button", null, "Remover");
        remover.type = "button";
        remover.setAttribute("aria-label", `Remover ${f.name}`);
        remover.addEventListener("click", () => {
          arquivos.splice(i, 1);
          desenharLista();
          entrada.focus();
        });
        li.append(el("span", "arquivos__nome", f.name), el("span", "arquivos__tamanho", formatarTamanho(f.size)), remover);
        return li;
      })
    );
  }

  function adicionar(novos) {
    const erros = [];
    for (const f of novos) {
      const problema = validarArquivo(f);
      if (problema) {
        erros.push(`${f.name}: ${problema}`);
        continue;
      }
      if (!arquivos.some((x) => chaveArquivo(x) === chaveArquivo(f))) arquivos.push(f);
    }
    desenharLista();
    mostrarErrosArquivos(erros);
  }

  entrada.addEventListener("change", () => {
    adicionar(entrada.files);
    entrada.value = ""; // permite escolher o mesmo arquivo de novo
  });

  // arrastar e soltar
  ["dragenter", "dragover"].forEach((nome) =>
    dropzone.addEventListener(nome, (e) => {
      e.preventDefault();
      dropzone.classList.add("dropzone--ativa");
    })
  );
  ["dragleave", "drop"].forEach((nome) =>
    dropzone.addEventListener(nome, () => dropzone.classList.remove("dropzone--ativa"))
  );
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    adicionar(e.dataTransfer.files);
  });
  // se soltar um arquivo fora da área, o navegador não abre o arquivo e sai da página
  ["dragover", "drop"].forEach((nome) =>
    window.addEventListener(nome, (e) => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
    })
  );

  // ----- envio -----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    $("erro-tipo").textContent = "";
    $("erro-arquivos").replaceChildren();
    $("erro-envio").textContent = "";

    if (!EXAMES.includes(select.value)) {
      $("erro-tipo").textContent = "Escolha o tipo de exame.";
      select.focus();
      return;
    }
    if (!arquivos.length) {
      mostrarErrosArquivos(["Anexe pelo menos um arquivo."]);
      entrada.focus();
      return;
    }

    const dados = new FormData();
    dados.append("paciente", String(paciente.id));
    dados.append("tipo_exame", select.value);
    dados.append("observacoes", $("observacoes").value.trim());
    arquivos.forEach((f) => dados.append("arquivos", f));

    const botao = $("enviar");
    botao.disabled = true;
    botao.textContent = "Enviando...";
    try {
      await enviarExame(dados);
      form.hidden = true;
      $("link-voltar").href = `../pacientes/detalhe.html?id=${encodeURIComponent(paciente.id)}`;
      $("link-outro").href = `novo-exame.html?id=${encodeURIComponent(paciente.id)}`;
      $("sucesso").hidden = false;
      $("sucesso").focus();
    } catch {
      $("erro-envio").textContent = "Não foi possível enviar o exame. Tente novamente.";
    } finally {
      botao.disabled = false;
      botao.textContent = "Enviar informações";
    }
  });
}

async function iniciar() {
  montarSidebar();

  if (!PERFIS_PERMITIDOS.includes(perfil)) {
    bloquear("Você não tem permissão para inserir exames.");
    return;
  }

  const paciente = pacienteId ? await carregarPaciente(pacienteId) : null;
  if (!paciente) {
    bloquear("Paciente não encontrado.");
    return;
  }

  $("paciente-nome").textContent = paciente.nome;
  document.title = `CB Clinical | Novo exame - ${paciente.nome}`;
  preparar(paciente);
}

iniciar().catch(() => bloquear("Não foi possível carregar a página. Tente novamente."));
