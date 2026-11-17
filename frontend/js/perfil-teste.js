// TEMPORÁRIO: serve só para testar as telas SEM login.
// Quando o login estiver ligado ao Django, APAGUE este arquivo
// e a linha `import "../js/perfil-teste.js";` de cada página.
//
// Como usar: abra a página com ?perfil=MEDICO, ?perfil=SECRETARIO ou ?perfil=ADMIN
//   ex.: detalhe.html?id=1&perfil=SECRETARIO

const VALIDOS = ["MEDICO", "SECRETARIO", "ADMIN"];

if (!sessionStorage.getItem("access")) {
  const pedido = (new URLSearchParams(location.search).get("perfil") || "").toUpperCase();
  if (VALIDOS.includes(pedido)) {
    sessionStorage.setItem("perfil", pedido);
  } else if (!sessionStorage.getItem("perfil")) {
    sessionStorage.setItem("perfil", "MEDICO");
  }
}