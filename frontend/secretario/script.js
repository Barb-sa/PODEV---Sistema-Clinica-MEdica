document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");
  const cpf = document.getElementById("cpf");
  const telefone = document.getElementById("telefone");

  const onlyDigits = (v) => v.replace(/\D/g, "");

  const maskCpf = (v) =>
    onlyDigits(v)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const maskTelefone = (v) =>
    onlyDigits(v)
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

  cpf.addEventListener("input", () => (cpf.value = maskCpf(cpf.value)));
  telefone.addEventListener("input", () => (telefone.value = maskTelefone(telefone.value)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    console.log("Cadastro:", Object.fromEntries(new FormData(form))); // troque pela chamada à sua API
  });
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

});
