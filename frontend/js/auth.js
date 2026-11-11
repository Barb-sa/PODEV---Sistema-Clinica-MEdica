import { api } from "./api.js";

export async function entrar(email, senha) {
  const resp = await fetch("http://localhost:8000/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // se o login do Django for por usuário, troque "email" por "username"
    body: JSON.stringify({ email, password: senha }),
  });
  if (!resp.ok) throw new Error("E-mail ou senha inválidos");

  const tokens = await resp.json();
  sessionStorage.setItem("access", tokens.access);
  sessionStorage.setItem("refresh", tokens.refresh);

  const me = await api("/me/");
  sessionStorage.setItem("perfil", me.tipo_perfil);
  sessionStorage.setItem("nome", me.nome);
  return me.tipo_perfil;
}

export function proteger(perfisPermitidos) {
  const token = sessionStorage.getItem("access");
  const perfil = sessionStorage.getItem("perfil");
  if (!token || !perfisPermitidos.includes(perfil)) {
    window.location.href = "../login/index.html";
  }
}

export function sair() {
  sessionStorage.clear();
  window.location.href = "../login/index.html";
}