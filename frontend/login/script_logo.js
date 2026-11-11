document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("password");
  const toggle = document.getElementById("toggle-password");
  const form = document.getElementById("login-form");

  toggle.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    toggle.classList.toggle("is-visible", show);
    toggle.setAttribute("aria-pressed", String(show));
    toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Login:", Object.fromEntries(new FormData(form))); // troque pela chamada à sua API
  });
});