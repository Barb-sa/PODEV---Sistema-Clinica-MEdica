const API_URL = "http://localhost:8000/api";

export async function api(rota, { metodo = "GET", dados, arquivo = false } = {}) {
  const headers = {};
  const token = sessionStorage.getItem("access");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body;
  if (arquivo) {
    body = dados;                         // FormData, para enviar exames
  } else if (dados) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(dados);
  }

  const resp = await fetch(`${API_URL}${rota}`, { method: metodo, headers, body });

  if (resp.status === 401) {              // sem login ou token vencido
    sessionStorage.clear();
    window.location.href = "../login/index.html";
    return;
  }
  if (!resp.ok) throw new Error(`Erro ${resp.status}`);
  return resp.status === 204 ? null : resp.json();
}