# Atividade Prática — Teste de APIs com Postman

> **Disciplina:** Qualidade de Software · **Instituição:** UNISANTA — Universidade Santa Cecília
> **Professor:** Claudio Nunes · **Carga prevista:** ~70 minutos em sala + finalização em casa

Atividade do encontro sobre **Teste de Integração com ênfase em APIs REST**. Você vai criar uma coleção Postman testando uma **API didática que sobe automaticamente em um GitHub Codespace**. Não usamos APIs públicas porque elas podem mudar sem aviso, aplicar limites de uso ou ficar indisponíveis durante a aula. A atividade exercita os três pilares da camada de integração:

1. **Caminho feliz** — todas as operações CRUD funcionando
2. **Cenários negativos** — provocar e validar erros
3. **Parametrização** — coleção reutilizável via variáveis de ambiente

> ⚠️ **Você NÃO precisa modificar este repositório.** A entrega é um **documento avulso** com evidências (ver seção [📦 Entregáveis](#-entregáveis)).

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub (com Codespaces habilitado — qualquer conta gratuita já tem)
- [ ] [Postman](https://www.postman.com/downloads/) instalado na sua máquina (**recomendado para iniciantes**)
- [ ] Opcional: [Bruno](https://www.usebruno.com/downloads), apenas se você souber adaptar os testes, pois Bruno não usa `pm.test()`
- [ ] Ter visto em aula: pirâmide de testes, conceitos de teste de integração

---

## 🎯 Objetivos de aprendizagem

Ao concluir esta atividade você será capaz de:

- Posicionar o teste de API na pirâmide de testes e justificar seu custo-benefício
- Construir uma coleção REST cobrindo `GET`, `POST`, `PUT`, `PATCH` e `DELETE`
- Escrever testes automatizados em `pm.test()` no Postman, validando status, body, headers e tempo
- Modelar cenários negativos para `404`, `400` e `405`
- Parametrizar coleções com variáveis de ambiente

---

## 🚀 Subindo a API no Codespaces

A API didática que você vai testar está em [`api/`](api/). Ela é uma aplicação Node.js + Express minimalista, criada **só para esta atividade**.

### Passo a passo

1. Nesta página do GitHub, clique no botão verde **`<> Code` → aba `Codespaces` → `Create codespace on main`**.
2. Aguarde o ambiente subir (~1 min). O Codespace já vem com Node 20 instalado, faz `npm install` e inicia a API automaticamente.
3. Você verá no terminal a mensagem:
   ```
   API didática rodando em http://localhost:3000
   ```
4. Uma aba **Ports** vai aparecer no VS Code mostrando a porta `3000` encaminhada com uma URL pública do tipo:
   ```
   https://<seu-codespace>-3000.app.github.dev
   ```
5. **Copie essa URL pública** — é a sua `base_url` para usar no Postman.
6. A porta já deve aparecer como `Public`. Se não aparecer, mude a visibilidade da porta para `Public` na aba **Ports** para usar o Postman fora do Codespaces.

> 💡 Se a API não iniciar automaticamente, rode no terminal: `cd api && npm start`.

### Conferindo que a API está no ar

Acesse no navegador `https://<seu-codespace>-3000.app.github.dev/health` — você deve ver:

```json
{ "status": "ok", "uptime": 12.34 }
```

> 💡 Se preferir trabalhar 100% local, pode rodar `cd api && npm install && npm start` no seu próprio computador. Aí a `base_url` é `http://localhost:3000`.

---

## 📚 Endpoints da API

| Método | Rota | Resposta |
|---|---|---|
| `GET` | `/posts` | 200 — lista de posts |
| `GET` | `/posts/:id` | 200 — post · 404 se não existe |
| `POST` | `/posts` | 201 · 400 (JSON inválido) · 422 (campos faltando) |
| `PUT` | `/posts/:id` | 200 · 404 · 422 |
| `PATCH` | `/posts/:id` | 200 · 404 |
| `DELETE` | `/posts/:id` | 204 · 404 |
| `DELETE` `PUT` `PATCH` | `/posts` | **405 Method Not Allowed** + header `Allow: GET, POST` |
| `GET` | `/health` | 200 — status de saúde |
| `POST` | `/reset` | 200 — recria os posts iniciais (request auxiliar; não conta nos 9 requests avaliativos) |

Schema do post:

```json
{ "id": 1, "title": "string", "body": "string", "userId": 1 }
```

Body exigido em `POST` e `PUT`:

```json
{ "title": "obrigatório", "body": "obrigatório", "userId": 1 }
```

---

## 🛠 Etapa 1 — Coleção básica · 30 min

**Objetivo:** criar 6 requests cobrindo todas as operações CRUD com testes automatizados em cada um.

| # | Método | Operação | URL | Testes mínimos |
|---|---|---|---|---|
| 1 | `GET` | Listar todos | `/posts` | Status 200 · body é array · tempo < 2s |
| 2 | `GET` | Buscar por ID | `/posts/1` | Status 200 · campo `id` igual ao solicitado · campo `title` existe |
| 3 | `POST` | Criar novo | `/posts` | Status 201 · resposta inclui `id` · body retornado contém o `title` enviado |
| 4 | `PUT` | Substituir | `/posts/1` | Status 200 · campo atualizado tem o novo valor |
| 5 | `PATCH` | Atualizar parcial | `/posts/1` | Status 200 · campo enviado mudou · campos não enviados foram preservados |
| 6 | `DELETE` | Remover | `/posts/1` | Status 204 · tempo < 2s |

> ⚠️ **A ordem importa.** Esta API usa dados em memória. Rode os requests na ordem numérica e, antes de rodar a coleção novamente, execute `POST {{base_url}}/reset` para recriar o post `id=1`.

### Como criar um request com testes

1. No Postman: **Collections → New Collection** → nomeie `Atividade-Teste-API`
2. **Add Request** → escolha o método e cole a URL completa
3. Aba **Body** (apenas para POST/PUT/PATCH): selecione `raw` + `JSON` e cole o body de exemplo
4. Aba **Tests** (a mais importante): escreva pelo menos 2 asserts
5. Clique em **Send** e veja na aba **Test Results** se passaram

### Exemplo da aba Tests para `GET /posts/1`

```javascript
pm.test("Status é 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Body tem o id solicitado", function () {
  const body = pm.response.json();
  pm.expect(body.id).to.eql(1);
});

pm.test("Resposta veio em menos de 2s", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

✅ **Ao final da Etapa 1:** 6 requests avaliativos funcionando, cada um com 2+ testes verdes. Se quiser rodar tudo de novo, execute antes o request auxiliar `POST /reset`.

---

## 🛠 Etapa 2 — Cenários negativos · 20 min

**Objetivo:** adicionar 3 requests que **provoquem o erro de propósito** e validar o comportamento de falha.

| # | Cenário | O que fazer | Resposta esperada |
|---|---|---|---|
| 7 | **Recurso inexistente** | `GET /posts/999999` | Status `404` · body com `error` |
| 8 | **Body inválido** | `POST /posts` com body `isso não é json válido {{{` | Status `400` |
| 9 | **Método não permitido** | `DELETE /posts` | Status `405` · header `Allow` presente |

### Exemplo de teste para o cenário 405

```javascript
pm.test("Status é 405 Method Not Allowed", function () {
  pm.response.to.have.status(405);
});

pm.test("Header Allow lista métodos permitidos", function () {
pm.response.to.have.header("Allow");
const allow = pm.response.headers.get("Allow");
pm.expect(allow).to.include("GET");
pm.expect(allow).to.include("POST");
});
```

✅ **Ao final da Etapa 2:** 9 requests avaliativos no total (6 positivos + 3 negativos), todos com testes que **passam** validando o comportamento esperado (mesmo que o comportamento seja “retornar erro”). O request `POST /reset`, se você criar, é auxiliar e fica fora dessa contagem.

---

## 🛠 Etapa 3 — Variáveis e ambiente · 20 min

**Objetivo:** refatorar a coleção para que ela rode em qualquer URL sem editar request por request.

### Por que parametrizar?

Você terminou a Etapa 1 com URLs assim:

```
https://meu-codespace-3000.app.github.dev/posts/1
```

Quando o Codespace cair e for recriado, **a URL muda**. Você não vai querer editar 9 requests toda vez. Solução: variáveis.

### Passo a passo

1. **Criar um Environment** (Postman → engrenagem → Environments → Add → nome `dev`):

   | Variável | Initial Value | Current Value |
   |---|---|---|
   | `base_url` | deixe em branco, ou use `http://localhost:3000` se for local | URL do seu Codespace ou `http://localhost:3000` |
   | `resource_id` | `1` | `1` |

   O arquivo [`environments/dev.postman_environment.json`](environments/dev.postman_environment.json) vem com `http://localhost:3000` como exemplo. Se estiver no Codespaces, importe o arquivo e troque o `Current Value` de `base_url` pela URL pública da porta `3000`.

2. **Trocar URLs por variáveis:**

   | Antes | Depois |
   |---|---|
   | `https://...3000.app.github.dev/posts/1` | `{{base_url}}/posts/{{resource_id}}` |
   | `https://...3000.app.github.dev/posts` | `{{base_url}}/posts` |

3. **Ativar o environment `dev`** no dropdown e rodar a coleção inteira (**Run collection**). Se você já tiver rodado a coleção antes, execute `POST {{base_url}}/reset` primeiro.
4. **Exportar coleção e environment** como `.json` (você usará nos entregáveis).

✅ **Ao final da Etapa 3:** coleção e environment exportados, rodando 100% verde com o environment ativo.

---

## 📦 Entregáveis

> **Você NÃO precisa abrir Pull Request, fork ou alterar este repositório.** A entrega é um **documento único** (PDF ou DOCX) com as evidências abaixo. Envie pelo Classroom (ou pela forma combinada com o professor).

### O que enviar no documento avulso

1. **Identificação**
   - Nome completo, RA, turma
2. **Print da API rodando no Codespaces**
   - Aba do terminal mostrando `API didática rodando em http://localhost:3000`
   - Aba `Ports` mostrando a porta `3000` encaminhada
3. **Print do Collection Runner (Etapa 1) — 6 requests positivos**
   - Tela final do Run com `N tests passed, 0 failed`
4. **Print do Collection Runner (Etapa 2) — todos os 9 requests**
   - Mostrar os 3 cenários negativos passando
5. **Print de pelo menos um request usando variáveis**
   - URL do request mostrando `{{base_url}}/posts/{{resource_id}}` na barra
6. **Conteúdo da coleção exportada (`.json`)**
   - Cole o JSON dentro do documento (em bloco de código)
   - **OU** anexe o arquivo `.json` junto ao documento
7. **Conteúdo do environment exportado (`.json`)**
   - Mesma regra: cole o JSON ou anexe o arquivo
   - Se estiver usando Codespaces, tudo bem exportar `base_url` vazio ou com `http://localhost:3000`; o print do request/environment deve mostrar que você usou a URL pública correta no `Current Value`
8. **Observações que aprendi**
   - Pelo menos 1 parágrafo: o que mais te surpreendeu? Algum comportamento da API que não bateu com o esperado? Algum teste que demorou para ficar verde?

### Checklist rápido antes de enviar

- [ ] Tenho 9 requests avaliativos (6 positivos + 3 negativos); requests auxiliares como `/reset` ficam fora da contagem
- [ ] Cada request tem **no mínimo 2 asserts** na aba `Tests`
- [ ] Os 3 cenários negativos validam status `404`, `400` e `405` (sem usar `5xx`)
- [ ] Todos os 9 requests usam `{{base_url}}` (nada hardcoded)
- [ ] Antes de reexecutar a coleção, rodei `POST /reset` para recriar os dados iniciais
- [ ] A coleção roda 100% verde com o environment `dev` ativo
- [ ] O documento contém todos os prints e os JSONs exigidos
- [ ] Identifiquei nome, RA e turma na primeira página

---

## 📚 Material de apoio

- [`docs/01-instalacao-postman.md`](docs/01-instalacao-postman.md) — Como instalar e configurar Postman/Bruno
- [`docs/02-criando-primeiro-request.md`](docs/02-criando-primeiro-request.md) — Passo a passo do primeiro request
- [`docs/03-escrevendo-tests.md`](docs/03-escrevendo-tests.md) — Guia rápido da API `pm.*`
- [`docs/04-cenarios-negativos.md`](docs/04-cenarios-negativos.md) — Padrões de teste para erros
- [`docs/05-variaveis-e-environments.md`](docs/05-variaveis-e-environments.md) — Variáveis, escopos e environments
- [`api/README.md`](api/README.md) — Documentação dos endpoints da API didática
- [`collections/EXEMPLO-atividade-teste-api.postman_collection.json`](collections/EXEMPLO-atividade-teste-api.postman_collection.json) — Coleção de referência (não é a sua entrega)
- [`environments/dev.postman_environment.json`](environments/dev.postman_environment.json) — Environment de exemplo

### Documentação oficial

- [Postman Learning Center](https://learning.postman.com/)
- [Bruno Docs](https://docs.usebruno.com/)
- [Chai Assertion Library](https://www.chaijs.com/api/bdd/) — base do `pm.expect()`
- [GitHub Codespaces — Forwarding ports](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace)

---

## ❓ Dúvidas frequentes

<details>
<summary><b>Posso usar Bruno em vez de Postman?</b></summary>

Sim. Bruno é open-source e armazena coleções como arquivos `.bru` versionáveis no Git. A sintaxe dos testes é diferente (não usa `pm.*`), mas os conceitos são os mesmos. Para a entrega, gere evidências equivalentes; se possível, exporte a coleção em formato Postman, ou anexe os arquivos `.bru` junto ao documento.

Para esta atividade, **Postman é o caminho recomendado** porque todos os exemplos e asserts usam `pm.test()`. Use Bruno apenas se você se sentir confortável para adaptar a sintaxe dos testes e entregar evidências equivalentes.
</details>

<details>
<summary><b>O Codespaces parou ou expirou. E agora?</b></summary>

Codespaces gratuitos hibernam após 30 min ociosos. Basta abrir de novo o Codespace pela aba **Codespaces** no GitHub — ele retoma do estado anterior. Se ele for recriado do zero, **a URL pública muda** e você precisa atualizar `{{base_url}}` no environment do Postman.
</details>

<details>
<summary><b>Posso testar sem usar Codespaces?</b></summary>

Pode. Clone este repositório na sua máquina, rode `cd api && npm install && npm start` e use `http://localhost:3000` como `base_url`. Tire prints mostrando o terminal local + Postman.
</details>

<details>
<summary><b>Meus testes passam mas o status code é 500</b></summary>

Cuidado: `5xx` indica erro **do servidor** (a API quebrou). Cenários negativos esperam `4xx` (erro do cliente). Se aparecer `5xx`, provavelmente é bug no seu request — revise o body / método / URL.
</details>

---

## 📜 Licença

Material didático sob [MIT License](LICENSE) — sinta-se à vontade para reutilizar, adaptar ou contribuir.

---

**Qualidade de Software · UNISANTA**
