# 📊 Rubrica detalhada de avaliação

> Esta rubrica detalha **exatamente** como a nota da atividade é composta. Use como checklist antes de submeter.

| Critério | Peso | 100% (excelente) | 60% (aceitável) | 0% (não atende) |
|---|---:|---|---|---|
| **Coleção CRUD completa** | 30% | 6 requests cobrindo `GET` (listar e por id), `POST`, `PUT`, `PATCH`, `DELETE`, com URLs corretas e responses 2xx | 4-5 requests funcionando, alguns sem response esperado | Menos de 4 requests ou coleção não importável |
| **Testes automatizados** | 25% | ≥ 18 asserts no total. Pelo menos 3 por request (status, body, tempo). Nomes de teste descritivos | ≥ 12 asserts. Apenas status validado. Nomes vagos | < 12 asserts ou aba `Tests` vazia em ≥ 2 requests |
| **Cenários negativos** | 20% | 3 requests cobrindo 404, 400/422 e 405 com **assert do status correto e justificativa documentada** se a API divergir | 2 cenários funcionando, ou 3 sem documentação da divergência | Nenhum cenário negativo, ou validando 5xx em vez de 4xx |
| **Variáveis e ambiente** | 15% | `base_url` e `resource_id` em **todos** os requests via `{{}}`, environment exportado, coleção rodando 100% verde com env ativo | Variáveis em alguns requests, alguns hardcoded | Nenhuma variável, URLs literais em todos os requests |
| **Organização e README** | 10% | Repo bem estruturado, README com seção "Submissão" preenchida, prints anexados, observações documentadas | Estrutura ok, README incompleto, faltam prints | Sem README, arquivos no lugar errado, sem prints |
| **🎯 Bônus: Newman + 2 ambientes** | +5% | `newman` rodando local + workflow verde no Actions + segundo environment passando | Apenas Newman local OU apenas Actions OU apenas segundo env | — |

**Nota mínima para aprovação:** 60% (6,0).

---

## Checklist do aluno antes de submeter

### Etapa 1 — Coleção básica (30%)

- [ ] Tenho exatamente 6 requests positivos (não menos)
- [ ] Cada um cobre uma operação CRUD diferente (GET listar, GET id, POST, PUT, PATCH, DELETE)
- [ ] Todos retornam status 2xx quando rodados
- [ ] Os requests POST/PUT/PATCH têm body em formato JSON
- [ ] Tem `Content-Type: application/json` nos requests com body

### Etapa 2 — Testes automatizados (25%)

- [ ] Cada request tem **mínimo 2 asserts** na aba `Tests`
- [ ] Pelo menos um request valida tempo de resposta
- [ ] Pelo menos um request valida campo específico do body
- [ ] Pelo menos um request valida o tipo de um campo (`.to.be.a(...)`)
- [ ] Nenhum teste do tipo `pm.expect(true).to.be.true` (não vale)
- [ ] Nomes dos testes são frases descritivas

### Etapa 3 — Cenários negativos (20%)

- [ ] Tenho 3 requests negativos: 404, 400/422 e 405
- [ ] Os 3 testes **passam** (validam o status de erro correto)
- [ ] Não estou validando 5xx como sucesso
- [ ] Documentei no README qualquer divergência da API real

### Etapa 4 — Variáveis (15%)

- [ ] Todos os 9 requests usam `{{base_url}}`
- [ ] Pelo menos 4 requests usam `{{resource_id}}`
- [ ] Tenho `environments/dev.postman_environment.json` exportado
- [ ] A coleção **só funciona** com o environment ativo (testei tirando o env e ela falha)

### Etapa 5 — Entrega (10%)

- [ ] Coleção exportada em `collections/`
- [ ] Environment exportado em `environments/`
- [ ] Pelo menos 2 prints em `prints/`
- [ ] README com seção "Submissão" preenchida (nome, RA, API, contadores)
- [ ] README com seção "Observações" descrevendo o que aprendi
- [ ] Commitei tudo, fiz push, abri PR ou enviei a URL do fork

### Bônus (+5%)

- [ ] Rodei `newman run` localmente e funciona
- [ ] Tem `newman-report.html` no repo
- [ ] GitHub Actions verde
- [ ] (Extra) Segundo environment passando 100%

---

## O que reduz nota mesmo se os critérios técnicos estão OK

- **Plágio:** entregar coleção idêntica à de outro aluno (zero)
- **Coleção não importável:** o JSON não abre no Postman/Bruno (zero no critério "Coleção")
- **Testes que não testam:** asserts triviais como `pm.expect(true).to.be.true`
- **README com placeholders não preenchidos:** "________ (preencher)" no campo de nome
- **Tokens commitados:** chave de API exposta no Git (zero no critério "Organização" + comunicação ao docente)

---

## Como aumentar a nota além do bônus

Estes não estão na rubrica, mas mostram domínio extra e podem virar pontos de participação:

- **Schema validation:** usar `tv4` ou `ajv` para validar schema completo do response
- **Encadeamento de requests:** criar via POST → guardar id → usar no GET seguinte
- **Pre-request script:** preparar body dinamicamente com `pm.environment.set()`
- **Diferentes tipos de body:** form-data, x-www-form-urlencoded, raw text
- **Documentar a coleção:** preencher description em cada request
- **Pull request capricado:** descrição do PR explicando o que foi feito, commits semânticos

---

[↑ README principal](../README.md)
