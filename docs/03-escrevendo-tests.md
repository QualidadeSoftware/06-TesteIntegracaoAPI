# 03 — Escrevendo testes com a API `pm.*`

No Postman atual, os testes são escritos em **Scripts → Post-response**. Esse JavaScript executa **após** cada resposta e tem acesso a um objeto global `pm`, que é a porta para todas as validações.

Em tutoriais antigos, essa área aparece como aba **Tests**. Na interface atual, procure **Scripts** e selecione **Post-response**. Não cole os asserts em **Pre-request**, porque essa área roda antes da chamada e ainda não tem resposta da API.

Pense em `pm.*` como uma versão limitada do JUnit/XUnit que vimos em aula, agora aplicada a APIs.

---

## Estrutura de um teste

```javascript
pm.test("Nome descritivo do teste", function () {
  // asserts aqui dentro
});
```

- O **nome** aparece no relatório — escreva como uma frase que descreve o comportamento esperado.
- A **função** contém os asserts. Se algum `expect` falhar, o teste é marcado como falhado.

---

## Acessando a resposta — `pm.response`

|Propriedade / método|Retorna|Exemplo|
|---|---|---|
|`pm.response.code`|número|`200`|
|`pm.response.status`|string|`"OK"`|
|`pm.response.responseTime`|número (ms)|`42`|
|`pm.response.json()`|objeto/array|`{ id: 1, title: "..." }`|
|`pm.response.text()`|string|`'{"id":1,...}'`|
|`pm.response.headers.get(name)`|string|`"application/json"`|

---

## Asserts mais usados

### Status code

```javascript
pm.response.to.have.status(200);
pm.expect(pm.response.code).to.eql(200);
pm.expect([200, 204]).to.include(pm.response.code);
```

### Tempo de resposta

```javascript
pm.expect(pm.response.responseTime).to.be.below(2000);
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

// Tipo
pm.expect(body.id).to.be.a("number");
pm.expect(body.title).to.be.a("string");
pm.expect(body.tags).to.be.an("array");

// Valor exato
pm.expect(body.id).to.eql(1);

// Tamanho
pm.expect(body.items).to.have.lengthOf(5);
```

### Negações

```javascript
pm.expect(body.error).to.be.undefined;
pm.expect(body.tags).to.not.be.empty;
```

---

## Trabalhando com variáveis — `pm.environment`

```javascript
// Ler
const baseUrl = pm.environment.get("base_url");

// Gravar (útil para guardar um id criado por POST e usar no GET seguinte)
pm.environment.set("last_created_id", body.id);
```

### Padrão "criar e reutilizar id"

```javascript
// Scripts → Post-response do POST /posts
pm.test("Status é 201", function () {
  pm.response.to.have.status(201);
});

const created = pm.response.json();
pm.environment.set("created_id", created.id);
```

```http
GET {{base_url}}/posts/{{created_id}}    ← outro request usa a variável
```

---

## Cheat sheet

```javascript
// === Status ===
pm.response.to.have.status(200);
pm.expect([200, 204]).to.include(pm.response.code);

// === Tempo ===
pm.expect(pm.response.responseTime).to.be.below(2000);

// === Headers ===
pm.response.to.have.header("Content-Type");
pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");

// === Body ===
const body = pm.response.json();
pm.expect(body).to.have.property("id");
pm.expect(body.id).to.be.a("number");
pm.expect(body.title).to.eql("esperado");

// === Variáveis ===
pm.environment.set("created_id", body.id);
const id = pm.environment.get("created_id");
```

---

## Boas práticas

✅ **Faça**

- Nomes de teste descritivos: `"Status é 201 quando criamos um post válido"`
- Pelo menos um assert de status, um de body e um de tempo em cada request
- Use `pm.expect([200, 204]).to.include(pm.response.code)` quando aceitar mais de um status
- Use `POST {{base_url}}/reset` antes de repetir uma coleção que altera dados fixos, como `id=1`

❌ **Evite**

- Asserts genéricos como `pm.expect(true).to.be.true` (não validam nada)
- `console.log` espalhado — limpe antes da entrega
- Hardcoded de ids e URLs (use variáveis)

---

[← Anterior: Criando primeiro request](02-criando-primeiro-request.md) · [→ Próximo: Cenários negativos](04-cenarios-negativos.md) · [↑ README](../README.md)
