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
});