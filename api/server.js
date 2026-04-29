// API didática para a atividade de Teste de APIs com Postman
// UNISANTA — Qualidade de Software
//
// Suporta os 9 cenários da atividade:
//   GET    /posts            -> 200 lista
//   GET    /posts/:id        -> 200 ou 404
//   POST   /posts            -> 201 (ou 400 se body inválido / 422 se faltar campo obrigatório)
//   PUT    /posts/:id        -> 200 (ou 404)
//   PATCH  /posts/:id        -> 200 (ou 404)
//   DELETE /posts/:id        -> 204 (ou 404)
//   DELETE /posts            -> 405 com header Allow
//   POST   /reset            -> 200 recria dados iniciais

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- middlewares ----------

// Body parser com captura de erro de JSON malformado -> 400
app.use(express.json({ limit: "1mb" }));
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "JSON malformado no corpo da requisição." });
  }
  next(err);
});

// Log simples (útil para o aluno ver as chamadas no terminal do Codespaces)
app.use((req, _res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- "banco" em memória ----------

let nextId = 1;
const posts = new Map();

function seed() {
  posts.clear();
  nextId = 1;
  const fixtures = [
    { title: "primeiro post", body: "conteúdo inicial número 1", userId: 1 },
    { title: "segundo post", body: "conteúdo inicial número 2", userId: 1 },
    { title: "terceiro post", body: "conteúdo inicial número 3", userId: 2 },
    { title: "quarto post", body: "conteúdo inicial número 4", userId: 2 },
    { title: "quinto post", body: "conteúdo inicial número 5", userId: 3 }
  ];
  for (const f of fixtures) {
    const id = nextId++;
    posts.set(id, { id, ...f });
  }
}
seed();

// ---------- raiz e health ----------

app.get("/", (_req, res) => {
  res.json({
    name: "API didática — UNISANTA Qualidade de Software",
    docs: "Use os endpoints /posts (GET, POST), /posts/:id (GET, PUT, PATCH, DELETE), /health e /reset (POST auxiliar).",
    total: posts.size
  });
});

app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// Permite "resetar" o estado entre execuções da coleção (opcional para o aluno)
app.post("/reset", (_req, res) => {
  seed();
  res.json({ status: "reset", total: posts.size });
});

// ---------- /posts ----------

app.get("/posts", (_req, res) => {
  res.json([...posts.values()]);
});

// 405: a rota /posts NÃO aceita DELETE / PUT / PATCH (não faz sentido sem id)
const methodNotAllowed = (req, res) => {
  res.set("Allow", "GET, POST");
  res.status(405).json({
    error: "Method Not Allowed",
    message: `O método ${req.method} não é permitido em /posts. Métodos aceitos: GET, POST.`
  });
};
app.delete("/posts", methodNotAllowed);
app.put("/posts", methodNotAllowed);
app.patch("/posts", methodNotAllowed);

app.post("/posts", (req, res) => {
  const { title, body, userId } = req.body || {};
  // 422: JSON é válido mas não respeita o contrato
  if (!title || !body || typeof userId !== "number") {
    return res.status(422).json({
      error: "Unprocessable Entity",
      message: "Campos obrigatórios: title (string), body (string), userId (number).",
      received: req.body || {}
    });
  }
  const id = nextId++;
  const post = { id, title, body, userId };
  posts.set(id, post);
  res.status(201).json(post);
});

// ---------- /posts/:id ----------

app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.get(id);
  if (!post) {
    return res
      .status(404)
      .json({ error: "Not Found", message: `Post com id=${req.params.id} não encontrado.` });
  }
  res.json(post);
});

app.put("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!posts.has(id)) {
    return res
      .status(404)
      .json({ error: "Not Found", message: `Post com id=${req.params.id} não encontrado.` });
  }
  const { title, body, userId } = req.body || {};
  if (!title || !body || typeof userId !== "number") {
    return res.status(422).json({
      error: "Unprocessable Entity",
      message: "PUT exige title (string), body (string) e userId (number).",
      received: req.body || {}
    });
  }
  const updated = { id, title, body, userId };
  posts.set(id, updated);
  res.json(updated);
});

app.patch("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const current = posts.get(id);
  if (!current) {
    return res
      .status(404)
      .json({ error: "Not Found", message: `Post com id=${req.params.id} não encontrado.` });
  }
  const merged = { ...current, ...(req.body || {}), id };
  posts.set(id, merged);
  res.json(merged);
});

app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!posts.has(id)) {
    return res
      .status(404)
      .json({ error: "Not Found", message: `Post com id=${req.params.id} não encontrado.` });
  }
  posts.delete(id);
  res.status(204).send();
});

// ---------- 404 fallback ----------

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "Not Found", message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// ---------- start ----------

app.listen(PORT, () => {
  console.log("=================================================");
  console.log(`  API didática rodando em http://localhost:${PORT}`);
  console.log("  UNISANTA — Qualidade de Software");
  console.log("=================================================");
});
