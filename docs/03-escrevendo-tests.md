# 03 — Escrevendo testes com a API `pm.*`

A aba **Tests** do Postman executa JavaScript **após** cada resposta. Esse JS tem acesso a um objeto global `pm` que é a porta para todas as validações.

Pense em `pm.*` como uma versão limitada do JUnit/XUnit que vimos em aula, agora aplicada a APIs.

---

## Estrutura de um teste

```javascript
pm.test("Nome descritivo do teste", function () {
  // asserts aqui dentro
});
```

- O **nome** aparece no relatório — escreva como uma frase que descreve o comportamento esperado
- A **função** contém os asserts. Se algum `expect` falhar, o teste é marcado como falhado

---

## Acessando a resposta — `pm.response`

| Propriedade / método | Retorna | Exemplo |
|---|---|---|
| `pm.response.code` | número | `200` |
| `pm.response.status` | string | `"OK"` |
| `pm.response.responseTime` | número (ms) | `342` |
| `pm.response.json()` | objeto/array | `{ id: 1, title: "..." }` |
| `pm.response.text()` | string | `'{"id":1,...}'` |
| `pm.response.headers.get(name)` | string | `"application/json"` |

---

## Asserts mais usados (sintaxe Chai)

### Status code

```javascript
// Helper específico do Postman
pm.response.to.have.status(200);

// Equivalente com pm.expect
pm.expect(pm.response.code).to.eql(200);

// Múltiplos códigos aceitáveis
pm.expect([200, 204]).to.include(pm.response.code);
```

### Tempo de resposta

```javascript
pm.expect(pm.response.responseTime).to.be.below(2000);  // < 2s
pm.expect(pm.response.responseTime).to.be.above(0);
```

### Headers

```javascript
pm.response.to.have.header("Content-Type");
pm.expect(pm.response.headers.get("Content-Type"))
  .to.include("application/json");
```

### Campos do body

```javascript
const body = pm.response.json();

// Existência
pm.expect(body).to.have.property("id");
pm.expect(body).to.have.property("user.email");

// Tipo
pm.expect(body.id).to.be.a("number");
pm.expect(body.title).to.be.a("string");
pm.expect(body.tags).to.be.an("array");

// Valor exato
pm.expect(body.id).to.eql(1);
pm.expect(body.status).to.eql("active");

// Conteúdo de string
pm.expect(body.email).to.include("@");

// Tamanho de array
pm.expect(body.items).to.have.lengthOf(5);
pm.expect(body.items.length).to.be.above(0);
```

### Negações

```javascript
pm.expect(body.error).to.be.undefined;
pm.expect(body.deleted).to.not.be.true;
pm.expect(body.tags).to.not.be.empty;
```

---

## Trabalhando com variáveis — `pm.environment` e `pm.collectionVariables`

```javascript
// Ler uma variável de environment
const baseUrl = pm.environment.get("base_url");

// Gravar (útil para guardar um id criado por POST e usar no GET seguinte)
pm.environment.set("last_created_id", body.id);

// Variáveis da coleção (escopo mais restrito)
pm.collectionVariables.set("token", body.access_token);

// Variável local (existe só durante a execução)
pm.variables.set("temp", "valor");
```

### Padrão "criar e reutilizar id"

```javascript
// Na aba Tests do request POST /users
pm.test("Status é 201", function () {
  pm.response.to.have.status(201);
});

const created = pm.response.json();
pm.environment.set("created_user_id", created.id);
```

```
GET /users/{{created_user_id}}    ← outro request usa a variável
```

---

## Validação de schema (mini exemplo)

Postman tem `tv4` embutido para validação de JSON Schema:

```javascript
const schema = {
  type: "object",
  required: ["id", "title", "userId"],
  properties: {
    id:     { type: "number" },
    title:  { type: "string" },
    body:   { type: "string" },
    userId: { type: "number" }
  }
};

pm.test("Body bate com o schema esperado", function () {
  pm.expect(tv4.validate(pm.response.json(), schema)).to.be.true;
});
```

---

## Boas práticas

✅ **Faça**

- Escreva nomes de testes que descrevem o comportamento, não a implementação
  - 👍 `"Status é 201 quando criamos um post válido"`
  - 👎 `"teste1"`, `"verifica codigo"`
- Tenha pelo menos um assert de status, um de body e um de tempo em cada request
- Salve ids criados em variáveis para encadear requests
- Use `pm.expect([400, 422]).to.include(pm.response.code)` quando aceitar mais de um status

❌ **Evite**

- Asserts genéricos como `pm.expect(true).to.be.true` (não validam nada)
- Confiar em ordem específica de campos do body (algumas APIs reordenam)
- `console.log` espalhado — limpe antes de entregar
- Testes que dependem de um id específico que pode não existir (use variáveis)

---

## Cheat sheet imprimível

```javascript
// === Status ===
pm.response.to.have.status(200);
pm.expect([200, 204]).to.include(pm.response.code);

// === Tempo ===
pm.expect(pm.response.responseTime).to.be.below(2000);

// === Headers ===
pm.response.to.have.header("Content-Type");
pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");

// === Body — leitura ===
const body = pm.response.json();

// === Body — existência ===
pm.expect(body).to.have.property("id");

// === Body — tipo ===
pm.expect(body.id).to.be.a("number");
pm.expect(body.title).to.be.a("string");

// === Body — valor ===
pm.expect(body.id).to.eql(1);

// === Variáveis ===
pm.environment.get("base_url");
pm.environment.set("created_id", body.id);
```

---

[← Anterior: Primeiro request](02-criando-primeiro-request.md) · [→ Próximo: Cenários negativos](04-cenarios-negativos.md) · [↑ README](../README.md)
