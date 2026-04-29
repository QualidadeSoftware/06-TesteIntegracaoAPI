# Atividade Prática — Teste de APIs com Postman

> **Disciplina:** Qualidade de Software · **Instituição:** UNISANTA — Universidade Santa Cecília
> **Professor:** Claudio Nunes · **Carga prevista:** ~70 minutos em sala + finalização em casa

Esta atividade faz parte do encontro sobre **Teste de Integração com ênfase em APIs REST**. Você vai criar uma coleção Postman (ou Bruno) testando uma API pública, exercitando os três pilares da camada de integração na pirâmide de testes:

1. **Caminho feliz** — todas as operações CRUD funcionando
2. **Cenários negativos** — provocar e validar erros
3. **Parametrização** — coleção reutilizável em vários ambientes

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] [Postman](https://www.postman.com/downloads/) **OU** [Bruno](https://www.usebruno.com/downloads) instalado
- [ ] (Bônus) Node.js 18+ para rodar Newman via CLI
- [ ] Ter visto em aula: pirâmide de testes, conceitos de teste de integração, CI/CD

---

## 🎯 Objetivos de aprendizagem

Ao concluir esta atividade você será capaz de:

- Posicionar o teste de API na pirâmide de testes e justificar seu custo-benefício
- Construir uma coleção REST cobrindo `GET`, `POST`, `PUT`, `PATCH` e `DELETE`
- Escrever testes automatizados em `pm.test()` validando status, body, headers e tempo
- Modelar cenários negativos para `404`, `400/422` e `405`
- Parametrizar coleções com variáveis de ambiente reutilizáveis em pipelines CI/CD

---

## 🚀 Como começar

### 1. Faça o fork deste repositório

Clique em **Fork** no canto superior direito desta página. Você terá uma cópia em `https://github.com/SEU-USUARIO/postman-api-testing-activity`.

### 2. Clone o seu fork

```bash
git clone https://github.com/SEU-USUARIO/postman-api-testing-activity.git
cd postman-api-testing-activity
```

### 3. Escolha uma API pública

Você pode escolher qualquer API pública que aceite as operações abaixo. Sugestões testadas:

| API | URL base | Suporta |
|---|---|---|
| **JSONPlaceholder** | `https://jsonplaceholder.typicode.com` | GET, POST, PUT, PATCH, DELETE *(simulados — não persistem)* |
| **ReqRes.in** | `https://reqres.in/api` | GET, POST, PUT, PATCH, DELETE + delays e cenários de erro |
| **PokeAPI** | `https://pokeapi.co/api/v2` | Apenas GET *(use só se for combinar com mock para POST/PUT)* |

> 💡 Recomendamos **JSONPlaceholder** ou **ReqRes.in** para esta atividade — ambas suportam o ciclo completo CRUD e são gratuitas/sem autenticação.

---

## 🛠 Etapa 1 — Coleção básica · 30 min

**Objetivo:** criar 6 requests cobrindo as quatro operações CRUD com testes automatizados em cada um.

### Requests obrigatórios

Cada linha desta tabela é um request da sua coleção. **Cada request precisa ter no mínimo 2 testes na aba Tests.**

| # | Método | Operação | Exemplo de URL (JSONPlaceholder) | Testes mínimos |
|---|---|---|---|---|
| 1 | `GET` | Listar todos os recursos | `/posts` | Status 200 · body é array · tempo < 2s |
| 2 | `GET` | Buscar recurso por ID | `/posts/1` | Status 200 · campo `id` igual ao solicitado · campo `title` existe |
| 3 | `POST` | Criar novo recurso | `/posts` | Status 201 · resposta inclui `id` gerado · dados do body retornam ecoados |
| 4 | `PUT` | Substituir recurso | `/posts/1` | Status 200 · campo atualizado tem o novo valor |
| 5 | `PATCH` | Atualizar parcialmente | `/posts/1` | Status 200 · só o campo enviado mudou |
| 6 | `DELETE` | Remover recurso | `/posts/1` | Status 200 ou 204 · `Content-Type` apropriado |

### Como criar um request com testes (passo a passo)

1. No Postman: **Collections → New Collection** → nomeie como `Atividade-Teste-API`
2. Dentro da coleção: **Add Request** → escolha o método e cole a URL completa
3. Aba **Body** (apenas para POST/PUT/PATCH): selecione `raw` + `JSON` e cole o body de exemplo
4. Aba **Tests** (a mais importante!): cole testes como os do exemplo abaixo
5. Clique em **Send** e veja na aba **Test Results** se passaram

### Exemplo de aba Tests para o request `GET /posts/1`

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

> 📚 Mais snippets prontos para copiar e adaptar em [`exemplos/snippets-pm-test.md`](exemplos/snippets-pm-test.md)

✅ **Ao final da Etapa 1 você deve ter:** 6 requests funcionando, cada um com 2+ testes verdes.

---

## 🛠 Etapa 2 — Cenários negativos · 20 min

**Objetivo:** adicionar 3 requests que **provoquem o erro de propósito** e validar o comportamento de falha da API.

> 💡 **Por que isso importa?** Uma cobertura que só testa o caminho feliz é uma cobertura mentirosa. Um sistema bem testado falha *do jeito esperado* quando recebe entrada inválida — e é isso que um cenário negativo verifica.

### Requests obrigatórios

| # | Cenário | O que fazer | Resposta esperada |
|---|---|---|---|
| 7 | **Recurso inexistente** | `GET /posts/999999` | Status `404` · body com mensagem de erro |
| 8 | **Body inválido** | `POST /posts` com body vazio `{}` ou JSON malformado | Status `400` ou `422` |
| 9 | **Método não permitido** | Tente um método não suportado pela rota *(ex: `DELETE /posts` sem id)* | Status `405` ou `404`, dependendo da API |

### Exemplo de teste para o cenário 404

```javascript
pm.test("API retorna 404 para recurso inexistente", function () {
  pm.response.to.have.status(404);
});

pm.test("Resposta indica que recurso não existe", function () {
  // Em algumas APIs o body é vazio em 404 — adapte conforme sua escolha
  pm.expect(pm.response.text()).to.not.be.empty;
});
```

> ⚠️ **Atenção:** APIs públicas variam no comportamento. JSONPlaceholder retorna `404` mas com body `{}`, ReqRes pode retornar diferente. **Documente no README do seu fork qual comportamento você observou** — isso é parte do aprendizado.

✅ **Ao final da Etapa 2 você deve ter:** 9 requests no total (6 positivos + 3 negativos), todos com testes que **passam** validando o comportamento esperado (mesmo que o comportamento seja "retornar erro").

---

## 🛠 Etapa 3 — Variáveis e ambiente · 20 min

**Objetivo:** refatorar a coleção para que ela rode em qualquer ambiente sem editar request por request.

### Por que parametrizar?

Você terminou a Etapa 1 com URLs assim:

```
https://jsonplaceholder.typicode.com/posts/1
```

Em uma equipe real você precisaria rodar a mesma coleção em `dev`, `hml` e `prod` — três URLs diferentes. **Editar 9 requests todo deploy não é viável.** A solução: variáveis.

### Passo a passo

#### 1️⃣ Criar um Environment

- No Postman: ícone de engrenagem (canto superior direito) → **Environments → Add**
- Nomeie como `dev`
- Adicione as variáveis:

| Variável | Valor inicial |
|---|---|
| `base_url` | `https://jsonplaceholder.typicode.com` |
| `resource_id` | `1` |

> 💡 Veja o exemplo pronto em [`environments/dev.postman_environment.json`](environments/dev.postman_environment.json) — você pode importar e adaptar.

#### 2️⃣ Trocar URLs por variáveis

Em cada request, substitua a URL literal:

| Antes | Depois |
|---|---|
| `https://jsonplaceholder.typicode.com/posts/1` | `{{base_url}}/posts/{{resource_id}}` |
| `https://jsonplaceholder.typicode.com/posts` | `{{base_url}}/posts` |

#### 3️⃣ Ativar o environment e rodar tudo

- No canto superior direito, selecione `dev` no dropdown de environments
- Clique nos três pontinhos da coleção → **Run collection** → **Run Atividade-Teste-API**
- Verifique que todos os testes passam com o environment ativo

#### 4️⃣ Exportar tudo para o repositório

- Coleção: três pontinhos → **Export** → salve em `collections/`
- Environment: ícone de olho ao lado do environment → **Export** → salve em `environments/`

✅ **Ao final da Etapa 3 você deve ter:** coleção e environment exportados como `.json` na pasta correta do repositório.

---

## ⭐ Bônus — Newman + CI/CD · vale +5%

**Objetivo:** rodar a coleção via linha de comando e plugar no GitHub Actions.

### 1. Instalar o Newman

```bash
npm install -g newman newman-reporter-htmlextra
```

### 2. Rodar a coleção exportada

```bash
newman run collections/sua-colecao.postman_collection.json \
  -e environments/dev.postman_environment.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export newman-report.html
```

### 3. Plugar no CI/CD

Este repositório já vem com um workflow pronto em [`.github/workflows/newman.yml`](.github/workflows/newman.yml). Ele roda sua coleção a cada `push` e publica o relatório como artefato. Você só precisa:

1. Garantir que sua coleção está em `collections/` com o nome esperado
2. Garantir que o environment está em `environments/dev.postman_environment.json`
3. Fazer um `git push` — o GitHub Actions roda sozinho

> 📷 **Para o bônus:** anexe ao seu PR um print da action **verde** rodando, e o relatório HTML do Newman commitado.

---

## 📦 Como entregar

### Estrutura final esperada do seu fork

```
postman-api-testing-activity/
├── README.md                          ← preencha a seção "Submissão do aluno" no fim
├── collections/
│   └── atividade-teste-api.postman_collection.json   ← sua coleção exportada
├── environments/
│   ├── dev.postman_environment.json                  ← environment exportado
│   └── hml.postman_environment.json                  ← (opcional, para o bônus)
├── prints/
│   ├── 01-collection-runner-passou.png               ← print do Collection Runner verde
│   └── 02-cenario-404.png                            ← print de um cenário negativo passando
└── newman-report.html                                ← (bônus) relatório do Newman
```

### Submissão

1. **Commit e push** de tudo para o seu fork
2. Abra um **Pull Request** do seu fork para este repositório original (ou apenas envie a URL do fork pelo Classroom — combine com o professor)
3. No PR (ou no campo de submissão), preencha a seção **"Submissão do aluno"** abaixo

### 📝 Submissão do aluno (preencha)

> Copie esta seção para o final do README do seu fork e preencha:

```markdown
## Submissão

- **Nome:** _________________________
- **RA:** _________________________
- **API escolhida:** _________________________
- **Quantidade de requests:** ___ (mínimo 9)
- **Quantidade de testes (asserts):** ___ (mínimo 18)
- **Bônus realizado:** [ ] Newman CLI  [ ] GitHub Actions  [ ] Segundo environment

### Observações que aprendi
(O que mais te surpreendeu? Algum comportamento da API que não bateu com o esperado?)

```

---

## 📊 Critérios de avaliação

| Critério | Peso | O que precisa entregar para pontuar |
|---|---:|---|
| **Coleção CRUD completa** | 30% | 6 requests cobrindo `GET` (listar e por id), `POST`, `PUT`, `PATCH`, `DELETE` |
| **Testes automatizados** | 25% | ≥ 12 asserts no total — pelo menos 2 por request, validando status, body e tempo |
| **Cenários negativos** | 20% | 3 requests cobrindo `404`, `400/422` e `405` com testes que validam o erro |
| **Variáveis e ambiente** | 15% | `base_url` e `resource_id` parametrizados, environment exportado junto |
| **Organização e README** | 10% | Repo bem estruturado, README com submissão preenchida, prints anexados |
| 🎯 **Bônus — Newman + 2 ambientes** | +5% | Rodou via CLI com `newman` e exportou relatório html/junit, ou criou um segundo environment |

> Detalhamento completo da rubrica em [`docs/RUBRICA.md`](docs/RUBRICA.md).

---

## 📚 Material de apoio

- [`docs/01-instalacao-postman.md`](docs/01-instalacao-postman.md) — Como instalar e configurar Postman/Bruno
- [`docs/02-criando-primeiro-request.md`](docs/02-criando-primeiro-request.md) — Passo a passo do primeiro request
- [`docs/03-escrevendo-tests.md`](docs/03-escrevendo-tests.md) — Guia rápido da API `pm.*`
- [`docs/04-cenarios-negativos.md`](docs/04-cenarios-negativos.md) — Padrões de teste para erros
- [`docs/05-variaveis-e-environments.md`](docs/05-variaveis-e-environments.md) — Variáveis, escopos e environments
- [`docs/06-newman-cli.md`](docs/06-newman-cli.md) — Newman e integração com CI/CD
- [`exemplos/snippets-pm-test.md`](exemplos/snippets-pm-test.md) — Coleção de snippets prontos

### Documentação oficial

- [Postman Learning Center](https://learning.postman.com/)
- [Bruno Docs](https://docs.usebruno.com/)
- [Newman GitHub](https://github.com/postmanlabs/newman)
- [Chai Assertion Library](https://www.chaijs.com/api/bdd/) — base do `pm.expect()`

---

## ❓ Dúvidas frequentes

<details>
<summary><b>Posso usar Bruno em vez de Postman?</b></summary>

Sim. Bruno é open-source e armazena coleções como arquivos `.bru` versionáveis no Git — em alguns aspectos é até preferível. A sintaxe dos testes é diferente (não usa `pm.*`), mas os conceitos são os mesmos. Se for usar Bruno, exporte em formato Postman (Bruno suporta) para que a rubrica continue compatível.
</details>

<details>
<summary><b>A API que escolhi não retorna o status que a rubrica pede</b></summary>

Documente isso no seu README. Por exemplo: "JSONPlaceholder retorna 200 em vez de 404 para alguns recursos inexistentes em rotas aninhadas." Identificar a divergência **é parte do aprendizado** e não tira nota — esconder ou mentir tira.
</details>

<details>
<summary><b>Meus testes passam mas o status code é 500</b></summary>

Cuidado: um teste que valida `status 500` num cenário negativo está errado. `5xx` indica erro do servidor (problema na API), enquanto cenários negativos esperam `4xx` (erro do cliente — você mandou algo inválido). Reveja o teste.
</details>

<details>
<summary><b>Posso usar uma API que exige autenticação?</b></summary>

Pode, mas adiciona complexidade. Se for usar (ex: GitHub API com token), **nunca commite o token** — use uma variável de environment marcada como `secret` no Postman e adicione `environments/*.secret.*` ao `.gitignore`.
</details>

---

## 📜 Licença

Material didático sob [MIT License](LICENSE) — sinta-se à vontade para reutilizar, adaptar ou contribuir.

---

**Qualidade de Software · UNISANTA**
