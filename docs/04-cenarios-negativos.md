# 04 — Cenários negativos: provocando o erro de propósito

> **A regra de ouro:** uma cobertura que só testa o caminho feliz é uma cobertura mentirosa.

Em aula vimos que `4xx` indica erro do cliente (você mandou algo inválido) e `5xx` indica erro do servidor (a API quebrou). **Cenários negativos validam que a API responde com o `4xx` correto quando o cliente erra.**

Se a API retornasse `5xx` em vez de `4xx`, isso seria um *bug*. Ela deveria ter recusado a entrada de forma controlada.

A API didática deste repositório foi projetada para responder corretamente nos três cenários abaixo.

---

## Os três cenários da atividade

### 1️⃣ Recurso inexistente → `404 Not Found`

**O que fazer:** acessar um id que não existe.

```http
GET {{base_url}}/posts/999999
```

**Aba Tests:**

```javascript
pm.test("Status é 404 Not Found", function () {
  pm.response.to.have.status(404);
});

pm.test("Body indica o erro", function () {
  const body = pm.response.json();
  pm.expect(body).to.have.property("error");
});

pm.test("Tempo de resposta razoável (<2s)", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

> 💡 **Por que validar tempo aqui?** Porque mesmo o caminho de erro tem que ser rápido. Uma API que demora 30s para responder `404` é uma API quebrada.

---

### 2️⃣ Body inválido → `400 Bad Request`

**O que fazer:** mandar um body que não é JSON válido.

```http
POST {{base_url}}/posts
Content-Type: application/json

isso não é json válido {{{
```

No Postman, configure a aba **Body** como `raw` + `JSON`. O header `Content-Type: application/json` é essencial para a API tentar interpretar o corpo como JSON e retornar `400` quando ele estiver malformado.

```javascript
pm.test("Status é 400 Bad Request", function () {
  pm.response.to.have.status(400);
});

pm.test("Mensagem de erro presente", function () {
  const body = pm.response.json();
  pm.expect(body).to.have.property("message");
});
```

> 💡 **Variação:** se você mandar um JSON **válido mas com campos faltando** (`{}`), a API responde `422 Unprocessable Entity`. Os dois são códigos legítimos para body errado: `400` = não consegui sequer parsear sua requisição; `422` = parseei, mas o conteúdo viola as regras de negócio. Você pode aceitar ambos com `pm.expect([400, 422]).to.include(pm.response.code)`.

Para a atividade avaliativa, use o JSON malformado com `Content-Type: application/json` e valide especificamente `400`.

---

### 3️⃣ Método não permitido → `405 Method Not Allowed`

**O que fazer:** usar um método que a rota não suporta. A rota `/posts` aceita apenas `GET` e `POST`; nesta API didática, `DELETE`, `PUT` e `PATCH` em `/posts` retornam `405`.

```http
DELETE {{base_url}}/posts
```

**Aba Tests:**

```javascript
pm.test("Status é 405 Method Not Allowed", function () {
  pm.response.to.have.status(405);
});

pm.test("Header Allow lista métodos suportados", function () {
  pm.response.to.have.header("Allow");
  const allow = pm.response.headers.get("Allow");
  pm.expect(allow).to.include("GET");
  pm.expect(allow).to.include("POST");
});
```

> 💡 Em cenários negativos, o request retorna erro HTTP, mas o teste fica verde porque esse erro é o comportamento esperado. Este request não depende do post `id=1`, mas a coleção completa depende. Antes de repetir uma execução com os 9 requests, rode `POST {{base_url}}/reset`.

---

## Anti-padrões — o que NÃO fazer

### ❌ Validar `5xx` em cenário negativo

```javascript
// ERRADO
pm.test("API retorna 500", function () {
  pm.response.to.have.status(500);
});
```

`5xx` significa que **a API quebrou**. Você está documentando um bug, não validando comportamento esperado.

### ❌ Testar `2xx` "porque é o que a API retorna"

```javascript
// ERRADO
pm.test("Status é 200 mesmo com body inválido", function () {
  pm.response.to.have.status(200);
});
```

Se a API retorna `200` para body inválido, **a API tem um bug**. Seu teste deveria FALHAR e gerar uma issue, não passar.

### ❌ Cenários negativos sem assert do status

```javascript
// ERRADO — não valida o que importa
pm.test("Tempo OK", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

O ponto central de um cenário negativo é o **status code de erro correto**. Tudo mais é complemento.

---

[← Anterior: Escrevendo tests](03-escrevendo-tests.md) · [→ Próximo: Variáveis](05-variaveis-e-environments.md) · [↑ README](../README.md)
