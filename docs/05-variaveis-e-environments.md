# 05 — Variáveis e environments

> **Por que parametrizar?** Porque uma coleção que só roda em um ambiente é uma coleção morta. Times reais precisam rodar os mesmos testes em `dev`, `hml` e `prod`.

---

## Os 4 escopos de variáveis no Postman

| Escopo | Vida útil | Caso de uso típico |
|---|---|---|
| **Global** | Toda instância do Postman | Constantes do time. **Evite para credenciais.** |
| **Environment** | Enquanto o env estiver ativo | `base_url`, `token` — um conjunto por ambiente (dev/hml/prod) |
| **Collection** | Dentro da coleção | Constantes específicas daquele conjunto de testes |
| **Local (run)** | Apenas durante a execução do request | ID criado em um `POST` e reutilizado no `GET` seguinte |

A regra: **use o escopo mais restrito que resolve o problema.**

- Senha de banco? Nunca em Global. Vá de Environment marcado como `secret`.
- ID gerado por uma chamada anterior? Local.
- URL base? Environment.

---

## Criando seu primeiro environment

### Pelo Postman

1. Canto superior direito: ícone de **engrenagem (⚙️)**
2. **Environments → Add**
3. Nome: `dev`
4. Adicione duas variáveis:

| Variable | Type | Initial Value | Current Value |
|---|---|---|---|
| `base_url` | default | `https://jsonplaceholder.typicode.com` | `https://jsonplaceholder.typicode.com` |
| `resource_id` | default | `1` | `1` |

5. **Save**

> ⚠️ **`Initial Value` vs `Current Value`:**
> - `Initial Value` é o que vai parar no JSON exportado (e no Git)
> - `Current Value` é o que está sendo usado agora (fica só na sua máquina)
>
> **Para credenciais use só `Current Value`** e deixe `Initial Value` em branco. Assim a senha nunca vai para o repositório.

### Importando o exemplo do repo

```
Environments → Import → environments/dev.postman_environment.json
```

Esse arquivo já vem pronto neste repositório.

---

## Usando variáveis nos requests

Substitua URLs literais pela sintaxe `{{nomeVariavel}}`:

| Antes | Depois |
|---|---|
| `https://jsonplaceholder.typicode.com/posts/1` | `{{base_url}}/posts/{{resource_id}}` |
| `https://jsonplaceholder.typicode.com/posts` | `{{base_url}}/posts` |

Você pode usar variáveis em **qualquer campo de texto**: URL, headers, body, params.

### No body também

```json
{
  "userId": {{resource_id}},
  "title": "post de teste"
}
```

---

## Ativando o environment

Antes de rodar a coleção, **selecione o environment** no dropdown ao lado do ícone de olho (canto superior direito).

Se não houver environment ativo, `{{base_url}}` aparece em vermelho e o request falha com erro `Invalid URL`.

---

## Padrão "criar e reutilizar"

Caso de uso clássico: você cria um recurso com `POST`, recebe o id de volta, e quer usar esse id no próximo request.

### Aba Tests do `POST /users`:

```javascript
pm.test("Status é 201", function () {
  pm.response.to.have.status(201);
});

const created = pm.response.json();
pm.environment.set("created_user_id", created.id);
console.log("ID criado:", created.id);
```

### URL do próximo request:

```
GET {{base_url}}/users/{{created_user_id}}
```

> 💡 Esse padrão é o que torna possível **rodar uma coleção do zero em qualquer ambiente**, sem depender de dados pré-existentes.

---

## Múltiplos environments

Para o **bônus**, crie um segundo environment apontando para outra API:

### `hml.postman_environment.json`

```json
{
  "name": "hml",
  "values": [
    { "key": "base_url", "value": "https://reqres.in/api", "enabled": true },
    { "key": "resource_id", "value": "2", "enabled": true }
  ]
}
```

(Já está pronto em `environments/hml.postman_environment.json`.)

Rode a coleção com cada environment e mostre que **ambos passam**. Esse é o teste real da parametrização — se passar em só um, é porque tem URL hardcoded escapando em algum request.

---

## Boas práticas

✅ **Faça**

- Use `Initial Value` apenas para valores não sensíveis
- Mantenha um arquivo `*.postman_environment.json` por ambiente no repo
- Adicione `*.secret.json` ao `.gitignore` se houver credenciais
- Teste a coleção com mais de um environment antes de entregar

❌ **Evite**

- Hardcoded URLs misturadas com variáveis (ou usa tudo, ou nada)
- Senhas/tokens commitados no Git, nem que seja em `Initial Value`
- Variáveis com nomes vagos como `var1`, `temp`, `x`

---

[← Anterior: Cenários negativos](04-cenarios-negativos.md) · [→ Próximo: Newman CLI](06-newman-cli.md) · [↑ README](../README.md)
