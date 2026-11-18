document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("password");
  const toggle = document.getElementById("toggle-password");

  toggle.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    toggle.classList.toggle("is-visible", show);
    toggle.setAttribute("aria-pressed", String(show));
    toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  });
});