# 📚 Snippets prontos de `pm.test()`

> Copie, cole e adapte. Todos foram testados na atividade de Teste de APIs com Postman.

---

## 🟢 Asserts de status

```javascript
// Status exato
pm.test("Status é 200", function () {
  pm.response.to.have.status(200);
});

// Status entre dois aceitáveis
pm.test("Status é 200 ou 204", function () {
  pm.expect([200, 204]).to.include(pm.response.code);
});

// Família de status
pm.test("Status é 2xx (sucesso)", function () {
  pm.expect(pm.response.code).to.be.within(200, 299);
});

pm.test("Status é 4xx (erro do cliente)", function () {
  pm.expect(pm.response.code).to.be.within(400, 499);
});
```

---

## ⏱️ Asserts de tempo

```javascript
// Limite máximo (mais comum)
pm.test("Resposta veio em menos de 2s", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Limite mais agressivo (APIs internas)
pm.test("Resposta veio em menos de 500ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(500);
});

// Validar que não foi instantâneo (cuidado: pode ser flaky)
pm.test("Resposta veio entre 50ms e 3s", function () {
  pm.expect(pm.response.responseTime).to.be.within(50, 3000);
});
```

---

## 📋 Asserts de headers

```javascript
// Header existe
pm.test("Tem header Content-Type", function () {
  pm.response.to.have.header("Content-Type");
});

// Header tem valor específico
pm.test("Content-Type é JSON", function () {
  pm.expect(pm.response.headers.get("Content-Type"))
    .to.include("application/json");
});

// Header CORS
pm.test("CORS habilitado", function () {
  pm.response.to.have.header("Access-Control-Allow-Origin");
});

// Cache desativado em rota sensível
pm.test("Resposta não é cacheada", function () {
  const cache = pm.response.headers.get("Cache-Control");
  pm.expect(cache).to.include("no-store");
});
```

---

## 🧱 Asserts de body — existência e tipos

```javascript
const body = pm.response.json();

// Campo existe
pm.test("Body tem campo id", function () {
  pm.expect(body).to.have.property("id");
});

// Múltiplos campos
pm.test("Body tem todos os campos esperados", function () {
  pm.expect(body).to.have.all.keys("id", "title", "body", "userId");
});

// Tipo
pm.test("Campo id é número", function () {
  pm.expect(body.id).to.be.a("number");
});

pm.test("Campo title é string não vazia", function () {
  pm.expect(body.title).to.be.a("string");
  pm.expect(body.title).to.not.be.empty;
});

// Array
pm.test("Body é um array com pelo menos 1 item", function () {
  pm.expect(body).to.be.an("array");
  pm.expect(body.length).to.be.above(0);
});
```

---

## 🎯 Asserts de body — valores

```javascript
// Igualdade exata
pm.test("Id retornado é o solicitado", function () {
  pm.expect(body.id).to.eql(1);
});

// Comparação com variável de environment
pm.test("Id retornado bate com a variável", function () {
  const expected = Number(pm.environment.get("resource_id"));
  pm.expect(body.id).to.eql(expected);
});

// String contém substring
pm.test("Email parece válido", function () {
  pm.expect(body.email).to.include("@");
});

// Regex
pm.test("CEP no formato 00000-000", function () {
  pm.expect(body.cep).to.match(/^\d{5}-\d{3}$/);
});

// Negação
pm.test("Body não tem campo error", function () {
  pm.expect(body).to.not.have.property("error");
});
```

---

## 🔢 Asserts de listas

```javascript
const lista = pm.response.json();

// Tamanho exato
pm.test("Lista tem exatamente 10 itens", function () {
  pm.expect(lista).to.have.lengthOf(10);
});

// Tamanho mínimo
pm.test("Lista não está vazia", function () {
  pm.expect(lista.length).to.be.above(0);
});

// Todo item tem um campo
pm.test("Todo item da lista tem id", function () {
  lista.forEach((item, idx) => {
    pm.expect(item, `Item ${idx} sem id`).to.have.property("id");
  });
});

// Lista contém valor
pm.test("Lista inclui usuário com id 1", function () {
  const ids = lista.map(u => u.id);
  pm.expect(ids).to.include(1);
});
```

---

## 🔄 Padrão "criar e reutilizar id"

### Aba Tests do `POST /users` (cria e guarda)

```javascript
pm.test("Status é 201 Created", function () {
  pm.response.to.have.status(201);
});

const created = pm.response.json();

pm.test("Resposta contém id gerado", function () {
  pm.expect(created).to.have.property("id");
  pm.expect(created.id).to.be.a("number");
});

// Guarda no environment para usar em requests seguintes
pm.environment.set("created_user_id", created.id);
console.log("ID guardado:", created.id);
```

### URL do `GET /users/:id` (usa o id guardado)

```
{{base_url}}/users/{{created_user_id}}
```

---

## 🔐 Asserts de schema (com `tv4`)

```javascript
const schema = {
  type: "object",
  required: ["id", "title", "userId"],
  properties: {
    id:     { type: "integer" },
    title:  { type: "string", minLength: 1 },
    body:   { type: "string" },
    userId: { type: "integer" }
  },
  additionalProperties: false
};

pm.test("Body bate com o schema definido", function () {
  const result = tv4.validate(pm.response.json(), schema);
  if (!result) {
    console.error(tv4.error);
  }
  pm.expect(result).to.be.true;
});
```

---

## 🔥 Asserts para cenários negativos

```javascript
// 404 — recurso inexistente
pm.test("Recurso inexistente retorna 404", function () {
  pm.response.to.have.status(404);
});

// 400/422 — body inválido
pm.test("Body inválido retorna 400 ou 422", function () {
  pm.expect([400, 422]).to.include(pm.response.code);
});

// 405 — método não permitido
pm.test("Método não permitido retorna 405", function () {
  pm.expect([404, 405]).to.include(pm.response.code);
});

// 401 — sem autenticação
pm.test("Sem token retorna 401 Unauthorized", function () {
  pm.response.to.have.status(401);
});

// 403 — autenticado mas sem permissão
pm.test("Usuário sem permissão recebe 403", function () {
  pm.response.to.have.status(403);
});

// Validar mensagem de erro
pm.test("Erro tem mensagem descritiva", function () {
  const body = pm.response.json();
  pm.expect(body).to.have.property("message");
  pm.expect(body.message).to.be.a("string").and.not.be.empty;
});
```

---

## 🧰 Padrões avançados

### Testar paginação

```javascript
const body = pm.response.json();

pm.test("Paginação tem campos esperados", function () {
  pm.expect(body).to.have.property("page");
  pm.expect(body).to.have.property("per_page");
  pm.expect(body).to.have.property("total");
  pm.expect(body).to.have.property("data");
});

pm.test("Página retornada bate com a solicitada", function () {
  const requested = Number(pm.request.url.query.get("page") || 1);
  pm.expect(body.page).to.eql(requested);
});
```

### Asserts dinâmicos por item

```javascript
const items = pm.response.json();

items.forEach((item, idx) => {
  pm.test(`Item ${idx} tem estrutura válida`, function () {
    pm.expect(item).to.have.property("id");
    pm.expect(item).to.have.property("name");
    pm.expect(item.id).to.be.a("number");
  });
});
```

### Validar timestamp ISO

```javascript
pm.test("createdAt é um ISO 8601 válido", function () {
  const date = new Date(body.createdAt);
  pm.expect(date.toString()).to.not.eql("Invalid Date");
});
```

---

[↑ Voltar ao README](../README.md)
