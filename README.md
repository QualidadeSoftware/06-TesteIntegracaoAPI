# Atividade Prática — Teste de APIs com Postman

> **Disciplina:** Qualidade de Software · 
> **Professor:** Claudio Nunes · **Duração prevista:** 70 minutos

Atividade do encontro sobre **Teste de Integração com ênfase em APIs REST**. Você vai criar uma coleção Postman testando uma **API didática que sobe automaticamente em um GitHub Codespace**. Não usamos APIs públicas porque elas podem mudar sem aviso, aplicar limites de uso ou ficar indisponíveis durante a aula. A atividade exercita os três pilares da camada de integração:

1. **Caminho feliz** — todas as operações CRUD funcionando
2. **Cenários negativos** — provocar e validar erros
3. **Parametrização** — coleção reutilizável via variáveis de ambiente

> ⚠️ **Você NÃO precisa modificar este repositório.** A entrega é um **documento avulso** com evidências (ver seção [📦 Entregáveis](#-entregáveis)).

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub (com Codespaces habilitado — qualquer conta gratuita já tem)
- [ ] [Postman](https://www.postman.com/downloads/) instalado na sua máquina (**caminho recomendado para iniciantes**)
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
> 💡 Se aparecer erro `EADDRINUSE`, a API provavelmente já está rodando na porta `3000`. Confira a aba **Ports** e use a URL encaminhada.

### Se a porta pública não funcionar

Em algumas contas GitHub vinculadas a organizações, políticas de segurança podem impedir portas `Public`. Se isso acontecer, use uma destas alternativas:

- Use a extensão **Postman** dentro do próprio Codespaces/VS Code.
- Rode a API localmente com `cd api && npm install && npm start` e use `http://localhost:3000`.
- Peça ao professor orientação para ajustar a visibilidade da porta, se a política da conta permitir.

Para esta atividade, o caminho principal é: **Postman desktop + URL pública da porta 3000**. A extensão Postman no Codespaces é um plano B útil quando o acesso público à porta não estiver disponível.

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

### Request auxiliar: reset dos dados

A API guarda os posts em memória. Isso significa que requests como `PUT`, `PATCH` e `DELETE` alteram os dados enquanto a API estiver rodando. Por exemplo: depois que você executa `DELETE /posts/1`, o post `id=1` deixa de existir. Se você rodar a coleção de novo sem resetar, os requests que usam `/posts/1` podem falhar com `404`.

Para voltar ao estado inicial, crie e execute um request auxiliar no Postman:

- **Nome:** `00 - Resetar dados`
- **Método:** `POST`
- **URL:** `{{base_url}}/reset`
- **Body:** vazio

Esse request recria os 5 posts iniciais e responde algo como:

```json
{ "status": "reset", "total": 5 }
```

Ele **não conta** nos 9 requests avaliativos da atividade. Use `POST {{base_url}}/reset` antes de rodar a coleção completa novamente, antes dos prints finais ou sempre que algum request com `/posts/1` começar a retornar `404` por causa de uma execução anterior.

> ✅ Ritual recomendado antes dos prints finais: execute `00 - Resetar dados` uma vez e, em seguida, rode os 9 requests avaliativos na ordem numérica. No Runner, o reset pode ficar marcado para preparar os dados, mas continua fora da contagem de requests avaliativos.

Schema do post:

```json
{ "id": 1, "title": "string", "body": "string", "userId": 1 }
```

Body exigido em `POST` e `PUT`:

```json
{ "title": "obrigatório", "body": "obrigatório", "userId": 1 }
```

Bodies sugeridos para os requests positivos:

**POST `/posts`**

```json
{
   "title": "teste UNISANTA",
   "body": "corpo do post de teste",
   "userId": 1
}
```

**PUT `/posts/{{resource_id}}`**

```json
{
   "title": "título atualizado",
   "body": "corpo atualizado",
   "userId": 1
}
```

**PATCH `/posts/{{resource_id}}`**

```json
{
   "title": "patch parcial"
}
```

---

## 🧭 Onde fica cada coisa no Postman atual

Na versão atual do Postman para Windows, alguns nomes mudaram em relação a tutoriais antigos. Use este mapa rápido:

- **Collections:** painel esquerdo, onde ficam suas coleções e requests.
- **Método, URL e Send:** faixa superior do request aberto.
- **Params, Authorization, Headers, Body, Scripts e Settings:** abas do request.
- **Scripts → Post-response:** local correto para escrever testes com `pm.test()`.
- **Pre-request:** script que roda antes da chamada; não cole os asserts aqui.
- **Test Results:** aba inferior que aparece depois do **Send** e mostra se os testes passaram.
- **No environment / dev:** dropdown no canto superior direito para selecionar o environment.
- **Save:** botão no topo direito do request. Use após alterar URL, Body, Headers ou Scripts.

> 💡 Quando o request tem script salvo, o Postman pode mostrar um ponto/indicador na aba **Scripts**.

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

> ⚠️ **A ordem importa.** Esta API usa dados em memória. Rode os requests na ordem numérica e, antes de rodar a coleção novamente, execute o request auxiliar `POST {{base_url}}/reset` para recriar o post `id=1`.

### Como criar um request com testes

1. No painel esquerdo, em **Collections**, clique em **+** ou **New Collection** e nomeie `Atividade-Teste-API`. Se o Postman oferecer modelos/templates, escolha uma coleção em branco.
2. Para criar um request, clique nos três pontos da coleção e escolha **Add request**, ou use o botão **+** no topo e depois salve o request dentro da coleção.
3. Escolha o método e cole a URL completa. No começo, pode usar a URL pública inteira do Codespaces; na Etapa 3 você trocará por `{{base_url}}`.
4. Aba **Body**: aparece em todos os requests, mas nesta atividade você só deve preenchê-la em `POST`, `PUT`, `PATCH` e no cenário `POST` inválido. Selecione **raw** e, no dropdown de formato ao lado, escolha **JSON**.
5. Aba **Scripts → Post-response**: escreva pelo menos 2 asserts com `pm.test()`.
6. Clique em **Save** no topo direito do request ou pressione **Ctrl+S**.
7. Clique em **Send** e veja na aba inferior **Test Results** se passaram.

### Mini tutorial — escrevendo e executando testes no Postman

No Postman atual, os testes ficam em **Scripts → Post-response**. Eles rodam **depois** que você clica em **Send** e a API responde. Cada teste é escrito em JavaScript usando `pm.test()`:

```javascript
pm.test("Descrição do comportamento esperado", function () {
   // asserts aqui dentro
});
```

O primeiro texto, entre aspas, é o nome que aparece no relatório. Dentro da função entram as validações. Se uma validação falhar, o teste fica vermelho.

Os comandos mais usados nesta atividade são:

```javascript
// Validar status HTTP
pm.response.to.have.status(200);

// Ler o corpo JSON da resposta
const body = pm.response.json();

// Validar campos do body
pm.expect(body).to.have.property("id");
pm.expect(body.id).to.eql(1);
pm.expect(body.title).to.be.a("string");

// Validar tempo de resposta
pm.expect(pm.response.responseTime).to.be.below(2000);

// Validar headers
pm.response.to.have.header("Content-Type");
```

Para executar e conferir:

1. Abra o request no Postman.
2. Configure método, URL, headers e body quando necessário.
3. Cole os testes em **Scripts → Post-response**.
4. Clique em **Send**.
5. Veja a aba **Test Results** na parte inferior: testes verdes passaram; testes vermelhos falharam.
6. Depois de testar cada request individualmente, use **Run collection** para executar todos em sequência.

> ⚠️ Não cole os asserts em **Pre-request**. Essa área roda antes da chamada e ainda não tem acesso à resposta da API.

> 💡 Um bom request da atividade deve ter pelo menos um teste de status e outro teste validando body, header ou tempo. Evite testes que sempre passam, como `pm.expect(true).to.be.true`, porque eles não verificam o comportamento real da API.

### Exemplo de Scripts → Post-response para `GET /posts/1`

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

### Configuração exata para o cenário 400

Para o request `08 - POST body inválido (400)`, configure assim:

| Campo | Valor |
|---|---|
| Método | `POST` |
| URL | `{{base_url}}/posts` |
| Header | `Content-Type: application/json` |
| Body | `raw` + `JSON` |
| Conteúdo do body | `isso não é json válido {{{` |
| Scripts | **Post-response** com os asserts `pm.test()` |

Se o header `Content-Type: application/json` não estiver presente, o Postman/API pode tratar o corpo de outro jeito e o status esperado pode deixar de ser `400`. Na interface atual, a aba pode aparecer como **Headers 8**, **Headers 9** etc.; esse número é apenas a quantidade de headers configurados automaticamente ou manualmente.

> 💡 O request retorna um erro HTTP, mas o teste fica verde porque esse erro era exatamente o comportamento esperado.

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

1. **Criar um Environment**:

   - No painel esquerdo, abra **Environments**.
   - Clique em **+** ou **Create Environment**.
   - Nomeie como `dev`.
   - Adicione as variáveis abaixo.

   | Variável | Initial Value | Current Value |
   |---|---|---|
   | `base_url` | deixe em branco, ou use `http://localhost:3000` se for local | URL do seu Codespace ou `http://localhost:3000` |
   | `resource_id` | `1` | `1` |

   Depois de alterar o `Current Value`, clique em **Save** no environment.

   O arquivo [`environments/dev.postman_environment.json`](environments/dev.postman_environment.json) vem com `http://localhost:3000` como exemplo. Para importar o exemplo: clique em **Import**, selecione esse arquivo `.json`, abra o environment `dev` importado e troque o `Current Value` de `base_url` pela URL pública da porta `3000`.

   A URL pública do Codespaces deve ficar no **Current Value**, que é o valor usado na execução. No JSON exportado, tudo bem o `Initial Value` aparecer vazio ou como `http://localhost:3000`.

2. **Trocar URLs por variáveis:**

   | Antes | Depois |
   |---|---|
   | `https://...3000.app.github.dev/posts/1` | `{{base_url}}/posts/{{resource_id}}` |
   | `https://...3000.app.github.dev/posts` | `{{base_url}}/posts` |

3. **Ativar o environment `dev`**: no canto superior direito, onde aparece **No environment**, selecione `dev`. Se continuar aparecendo **No environment**, `{{base_url}}` não será resolvido.
4. **Rodar a coleção inteira**: no painel esquerdo, passe o mouse sobre a coleção, clique nos três pontos e escolha **Run collection**. Na tela do Runner, confira se os requests estão marcados e clique em **Run**.
5. Antes de clicar em **Run**, confira se a ordem está `00 - Resetar dados`, `01`, `02`, ..., `09`. Se o Runner mostrar pastas, expanda e confirme a sequência.
6. **Exportar coleção e environment** como `.json`:
   - Collection: painel esquerdo → três pontos da coleção → **Export** → formato Collection v2.1.
   - Environment: painel esquerdo → **Environments** → três pontos em `dev` → **Export**.
   - Se a opção não aparecer, clique com o botão direito no item ou abra o item e procure o menu de mais opções.

✅ **Ao final da Etapa 3:** coleção e environment exportados, rodando 100% verde com o environment ativo.

### Obrigatório x desafio extra

Para a entrega mínima, faça:

- 9 requests avaliativos, sendo 6 positivos e 3 negativos.
- Pelo menos 2 asserts em cada request.
- Todos os requests usando `{{base_url}}`.
- Environment `dev` ativo no momento da execução.

Como desafio extra, você pode tornar a coleção menos dependente do `resource_id = 1`: em **Scripts → Post-response** do `POST /posts`, salve o `id` criado com `pm.environment.set("created_id", body.id)` e use `{{created_id}}` em requests seguintes. Esse padrão é mais robusto, mas não é obrigatório para concluir a atividade.

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
   - O dropdown de environment deve mostrar `dev` ativo
   - A aba **Scripts** deve estar selecionada, com **Post-response** ativo e os testes `pm.test()` visíveis
   - A aba inferior **Test Results** deve mostrar os testes passando após o **Send**
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
- [ ] Cada request tem **no mínimo 2 asserts** em **Scripts → Post-response**
- [ ] Os 3 cenários negativos validam status `404`, `400` e `405` (sem usar `5xx`)
- [ ] Todos os 9 requests usam `{{base_url}}` (nada hardcoded)
- [ ] Antes de reexecutar a coleção, rodei `POST /reset` para recriar os dados iniciais
- [ ] A coleção roda 100% verde com o environment `dev` ativo
- [ ] O documento contém todos os prints e os JSONs exigidos
- [ ] Identifiquei nome, RA e turma na primeira página

### Prints: o que precisa aparecer

Nos prints, garanta que a informação importante esteja visível:

- API rodando: terminal com `API didática rodando em http://localhost:3000` e aba **Ports** com a porta `3000`.
- Etapa 1: Collection Runner mostrando os 6 requests positivos, total de testes e `0 failed`.
- Etapa 2: Collection Runner mostrando os 9 requests avaliativos, incluindo `404`, `400` e `405`, com `0 failed`.
- Variáveis: barra da URL com `{{base_url}}`, dropdown do environment `dev` ativo, **Scripts → Post-response** visível e **Test Results** com testes passando.

### Diagnóstico rápido

| Sintoma | Causa provável | Como resolver |
|---|---|---|
| `Invalid URL` | Environment `dev` não está ativo ou `base_url` está vazio | Selecione o environment `dev` e confira o `Current Value` de `base_url` |
| `404` em `/posts/1` | O post `id=1` foi removido em execução anterior | Rode `POST {{base_url}}/reset` e execute a coleção de novo na ordem |
| Esperava `400`, mas veio `422` | Body inválido não foi enviado como JSON malformado | Confira `Content-Type: application/json` e Body `raw` + `JSON` |
| Testes não aparecem em `Test Results` | Código foi colado no lugar errado | Cole os asserts em **Scripts → Post-response**, não em **Pre-request** |
| `ECONNREFUSED` | API não está rodando | Inicie com `cd api && npm start` ou reabra o Codespace |
| `502` na URL do Codespaces | Codespace hibernou ou API não iniciou | Reabra o Codespace e aguarde a porta `3000` aparecer |
| `EADDRINUSE` no terminal | Já existe uma API usando a porta `3000` | Use a URL da aba **Ports** ou pare o processo antigo |

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

Para esta atividade, **Postman é o caminho recomendado** porque todos os exemplos, prints esperados e asserts usam `pm.test()`. O suporte em aula seguirá os exemplos em Postman. Use Bruno apenas se você se sentir confortável para adaptar a sintaxe dos testes e entregar evidências equivalentes.

Se estiver usando a extensão Postman no VS Code, os nomes e posições podem variar um pouco. Siga o conceito equivalente: request, body, script de pós-resposta e resultados dos testes.
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

**Qualidade de Software**
