// Troque este array pelos dados da sua API
const pacientes = [
  { id: 1, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 2, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 3, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 4, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 5, nome: "Ana Silva", data: "2023-01-01T12:30" },
  { id: 6, nome: "Ana Silva", data: "2023-01-01T12:30" },
];

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("patient-list");
  const search = document.getElementById("search");
  const form = document.getElementById("search-form");
  const sortBtn = document.getElementById("sort-btn");
  let recentesPrimeiro = true;

  const normalize = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const fmtData = (iso) => new Date(iso).toLocaleDateString("pt-BR");
  const fmtHora = (iso) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  function render() {
    const termo = normalize(search.value.trim());
    const itens = pacientes
      .filter((p) => normalize(p.nome).includes(termo))
      .sort((a, b) => (recentesPrimeiro ? 1 : -1) * (new Date(b.data) - new Date(a.data)));

    list.innerHTML = "";
    if (!itens.length) {
      list.innerHTML = '<li class="empty">Nenhum paciente encontrado.</li>';
      return;
    }

    itens.forEach((p) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "patient";
      a.href = `paciente-detalhe.html?id=${p.id}`; // ajuste para a sua rota
      a.innerHTML = `
        <span class="patient__name"></span>
        <span class="patient__when"><time>${fmtData(p.data)}</time><time>${fmtHora(p.data)}</time></span>`;
      a.querySelector(".patient__name").textContent = p.nome;
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  search.addEventListener("input", render);
  form.addEventListener("submit", (e) => { e.preventDefault(); render(); });
  sortBtn.addEventListener("click", () => {
    recentesPrimeiro = !recentesPrimeiro;
    sortBtn.setAttribute("aria-pressed", String(!recentesPrimeiro));
    sortBtn.setAttribute(
      "aria-label",
      recentesPrimeiro ? "Ordenar: mais recentes primeiro" : "Ordenar: mais antigos primeiro"
    );
    render();
  });

  render();
});