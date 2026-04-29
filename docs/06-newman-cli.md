# 06 — Newman: do Postman ao CI/CD

> **Newman é o que conecta sua coleção do Postman aos pipelines de CI/CD.** É a CLI oficial do Postman — instala via `npm`, roda no terminal, gera relatórios.

Esta é a parte do **bônus** da atividade (+5%). Não é obrigatória, mas é o que prepara você para o cenário real de QA em times de DevOps.

---

## Pré-requisitos

```bash
node --version    # precisa ser 18 ou superior
npm --version
```

Se não tiver Node, instale via [nodejs.org](https://nodejs.org/) (versão LTS).

---

## Instalação

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

Verifique:

```bash
newman --version    # deve imprimir 6.x.x ou superior
```

---

## Rodando a coleção

Pelo terminal, dentro do seu fork:

```bash
newman run collections/atividade-teste-api.postman_collection.json \
  -e environments/dev.postman_environment.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export newman-report.html
```

### O que cada flag faz

| Flag | Para que serve |
|---|---|
| `run <arquivo>` | A coleção exportada do Postman |
| `-e <arquivo>` | O environment a usar |
| `-r cli,htmlextra` | Reporters: `cli` (na tela) + `htmlextra` (HTML bonito) |
| `--reporter-htmlextra-export` | Onde salvar o HTML |

### Saída esperada (resumo)

```
┌─────────────────────────┬───────────────────┬───────────────────┐
│                         │          executed │            failed │
├─────────────────────────┼───────────────────┼───────────────────┤
│              iterations │                 1 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│                requests │                 9 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│            test-scripts │                 9 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│      prerequest-scripts │                 1 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│              assertions │                21 │                 0 │
├─────────────────────────┴───────────────────┴───────────────────┤
│ total run duration: 4.2s                                        │
│ total data received: 8.94kB (approx)                            │
│ average response time: 312ms                                    │
└─────────────────────────────────────────────────────────────────┘
```

Esse "21 assertions, 0 failed" é o relatório que vai para o CI/CD.

---

## Outros reporters úteis

### JUnit XML (para Jenkins, Azure DevOps, GitLab CI)

```bash
newman run colecao.json -r junit \
  --reporter-junit-export results.xml
```

### JSON (para processar com scripts próprios)

```bash
newman run colecao.json -r json \
  --reporter-json-export results.json
```

### Combinando vários

```bash
newman run colecao.json -r cli,htmlextra,junit \
  --reporter-htmlextra-export report.html \
  --reporter-junit-export report.xml
```

---

## Plugando no GitHub Actions

Este repositório já vem com um workflow pronto em `.github/workflows/newman.yml`. O conteúdo dele:

```yaml
name: Newman API Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra

      - name: Run Postman Collection
        run: |
          newman run collections/*.postman_collection.json \
            -e environments/dev.postman_environment.json \
            -r cli,htmlextra \
            --reporter-htmlextra-export newman-report.html

      - name: Upload report
        if: always()    # roda mesmo se os testes falharem
        uses: actions/upload-artifact@v4
        with:
          name: newman-report
          path: newman-report.html
```

### Como ativar

1. Faça commit da sua coleção em `collections/`
2. Faça commit do environment em `environments/dev.postman_environment.json`
3. `git push`
4. Vá em **Actions** no seu fork → veja o workflow rodando
5. Quando terminar, baixe o artifact `newman-report` (canto superior direito)

---

## Variáveis sensíveis no CI

Se sua API exigir token, **nunca** commite o token. Use **GitHub Secrets**:

1. No seu repo: **Settings → Secrets and variables → Actions → New secret**
2. Nome: `API_TOKEN`, valor: `ghp_xxxxx...`
3. No workflow:

```yaml
- name: Run with secret
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
  run: |
    newman run colecao.json \
      -e environments/dev.postman_environment.json \
      --env-var "token=$API_TOKEN"
```

A flag `--env-var` sobrescreve a variável do environment em runtime.

---

## Checklist do bônus

Para garantir os +5% do bônus:

- [ ] `newman` instalado localmente e rodando sua coleção sem erros
- [ ] Relatório HTML gerado e commitado em `newman-report.html`
- [ ] Workflow `.github/workflows/newman.yml` rodando verde no GitHub Actions
- [ ] Print da action verde anexado em `prints/`
- [ ] (Extra) Segundo environment criado e testado

---

[← Anterior: Variáveis](05-variaveis-e-environments.md) · [↑ README](../README.md)
