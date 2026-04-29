# 04 — Cenários negativos: provocando o erro de propósito

> **A regra de ouro:** uma cobertura que só testa o caminho feliz é uma cobertura mentirosa.

Em aula vimos que `4xx` indica erro do cliente (você mandou algo inválido) e `5xx` indica erro do servidor (a API quebrou). **Cenários negativos validam que a API responde com o `4xx` correto quando o cliente erra.**

Se a API retornasse `5xx` em vez de `4xx`, isso seria um *bug* — porque `5xx` significa "tive uma falha que não esperava". Ela deveria ter recusado a entrada de forma controlada.

---

## Os três cenários da atividade

### 1️⃣ Recurso inexistente → `404 Not Found`

**O que fazer:** acessar um id que não existe no banco da API.

```http
GET {{base_url}}/posts/999999
```

**Aba Tests:**

```javascript
pm.test("Status é 404 Not Found", function () {
  pm.response.to.have.status(404);
});

pm.test("Tempo de resposta razoável (<2s)", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

> 💡 **Por que validar tempo aqui?** Porque mesmo o caminho de erro tem que ser rápido. Uma API que demora 30s para responder `404` é uma API quebrada.

---

### 2️⃣ Body inválido → `400 Bad Request` ou `422 Unprocessable Entity`

**O que fazer:** mandar um body que não respeita o contrato.

Existem duas variantes:

#### Variante A — JSON malformado (`400`)

```http
POST {{base_url}}/posts
Content-Type: application/json

isso não é json válido {{{
```

```javascript
pm.test("Status é 400 Bad Request", function () {
  pm.response.to.have.status(400);
});
```

#### Variante B — JSON válido mas semanticamente errado (`422`)

```http
POST {{base_url}}/posts
Content-Type: application/json

{}
```

(body vazio: faltam campos obrigatórios)

```javascript
pm.test("Status é 400 ou 422", function () {
  pm.expect([400, 422]).to.include(pm.response.code);
});
```

> ⚠️ **Diferença entre 400 e 422:**
> - `400` = não consegui sequer parsear sua requisição
> - `422` = parseei, mas o conteúdo viola regras de negócio
>
> APIs mais maduras separam os dois. APIs mais simples retornam `400` para tudo.

---

### 3️⃣ Método não permitido → `405 Method Not Allowed`

**O que fazer:** usar um método que a rota não suporta.

Por exemplo, `/posts` aceita `GET` (listar) e `POST` (criar), mas geralmente não aceita `DELETE` (não faz sentido deletar a coleção inteira).

```http
DELETE {{base_url}}/posts
```

**Aba Tests:**

```javascript
pm.test("Status indica método não permitido", function () {
  // 405 é o ideal, mas algumas APIs retornam 404
  pm.expect([404, 405]).to.include(pm.response.code);
});

pm.test("Header Allow (quando presente) lista métodos suportados", function () {
  if (pm.response.headers.has("Allow")) {
    const allow = pm.response.headers.get("Allow");
    pm.expect(allow).to.include("GET");
  }
});
```

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

Se a API retorna `200` para body inválido, **a API tem um bug** — ela aceitou silenciosamente um dado errado. Seu teste deveria FALHAR e gerar uma issue, não passar.

### ❌ Cenários negativos sem assert do status

```javascript
// ERRADO — não valida o que importa
pm.test("Tempo OK", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

O ponto central de um cenário negativo é o **status code de erro correto**. Tudo mais é complemento.

---

## Lidando com APIs que se comportam diferente do esperado

Em produção, você confia no contrato (OpenAPI/Swagger). Em APIs públicas, às vezes o contrato não bate com a documentação.

**Documente o comportamento observado** no README do seu fork:

```markdown
## Observações que aprendi

- JSONPlaceholder retorna `200` (não `404`) ao buscar `/posts/999999` em algumas
  rotas — provavelmente porque é uma API simulada e nunca retorna "not found"
  para a rota base. Documentei isso e adaptei o teste para `pm.expect([200, 404])`.
```

Identificar e documentar essa divergência **vale tanto quanto acertar de primeira**.

---

[← Anterior: Escrevendo tests](03-escrevendo-tests.md) · [→ Próximo: Variáveis](05-variaveis-e-environments.md) · [↑ README](../README.md)
