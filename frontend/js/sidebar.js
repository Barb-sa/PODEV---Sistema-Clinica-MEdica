const ICONES = {
  cama: `<svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
    <path d="M3 6h3v17h28v-4.5A5.5 5.5 0 0 0 28.5 13H15v10H12V10h16.5A8.5 8.5 0 0 1 37 18.5V34h-3v-8H6v8H3V6Z" />
    <circle cx="10" cy="17" r="3.2" />
  </svg>`,
  grade: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3.2" aria-hidden="true">
    <rect x="5" y="5" width="12" height="12" rx="1.5" />
    <rect x="23" y="5" width="12" height="20" rx="1.5" />
    <rect x="5" y="23" width="12" height="12" rx="1.5" />
    <rect x="23" y="31" width="12" height="4" rx="1.5" />
  </svg>`,
};

// href relativo a uma página dentro de qualquer pasta de primeiro nível
const MENUS = {
  secretario: [
    { chave: "paciente", texto: "Paciente", href: "../secretario/paciente.html", icone: "cama" },
    { chave: "cadastro", texto: "Cadastro", href: "../secretario/index.html", icone: "grade" },
  ],
  medico: [
    { chave: "paciente", texto: "Paciente", href: "../medico/index.html", icone: "cama" },
  ],
  paciente: [
    { chave: "perfil", texto: "Perfil", href: "../paciente/index.html", icone: "cama" },
  ],
};

// aparecem só enquanto não há login (valores do Figma)
const PADRAO = {
  secretario: { nome: "Nome Secretario", email: "nome.secretario@gmail.com" },
  medico: { nome: "Nome Medico", email: "nome.medico@gmail.com" },
  paciente: { nome: "Nome Paciente", email: "nome.paciente@gmail.com" },
};

export function montarSidebar() {
  const alvo = document.querySelector("#sidebar");
  if (!alvo) return;

  const perfil = alvo.dataset.perfil;
  const ativo = alvo.dataset.ativo;

  const links = (MENUS[perfil] || [])
    .map((item) => {
      const ehAtivo = item.chave === ativo;
      return `<a class="nav__item${ehAtivo ? " nav__item--active" : ""}" href="${item.href}"${ehAtivo ? ' aria-current="page"' : ""}>${ICONES[item.icone]}${item.texto}</a>`;
    })
    .join("");

  // só texto fixo vai no innerHTML
  alvo.innerHTML = `
    <img class="sidebar__logo" src="../assets/logo_escura.png" alt="CB Clinical Ultrassonografia" />
    <nav class="nav" aria-label="Menu principal">${links}</nav>
    <div class="sidebar__user">
      <p class="sidebar__name"></p>
      <p class="sidebar__email"></p>
    </div>`;

  // nome e e-mail vêm do login, então entram como texto puro
  const padrao = PADRAO[perfil] || {};
  alvo.querySelector(".sidebar__name").textContent =
    sessionStorage.getItem("nome") || padrao.nome || "";
  alvo.querySelector(".sidebar__email").textContent =
    sessionStorage.getItem("email") || padrao.email || "";
}