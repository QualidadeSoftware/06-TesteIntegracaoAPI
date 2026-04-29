# 05 — Variáveis e environments

> **Por que parametrizar?** Porque a URL pública do Codespaces muda toda vez que ele é recriado. Uma coleção com URLs hardcoded vira lixo no primeiro restart.

---

## Os 4 escopos de variáveis no Postman

| Escopo | Vida útil | Caso de uso típico |
|---|---|---|
| **Global** | Toda instância do Postman | Constantes do time. **Evite para credenciais.** |
| **Environment** | Enquanto o env estiver ativo | `base_url`, `token` — um conjunto por ambiente |
| **Collection** | Dentro da coleção | Constantes específicas daquele conjunto de testes |
| **Local (run)** | Apenas durante a execução do request | ID criado em um `POST` e reutilizado no `GET` seguinte |

A regra: **use o escopo mais restrito que resolve o problema.**

- URL base (que muda quando o Codespace é recriado)? Environment.
- ID gerado por uma chamada anterior? Local.
- Senha? Nunca em Global. Vá de Environment marcado como `secret`.

---

## Criando seu environment

### Pelo Postman

1. Canto superior direito: ícone de **engrenagem (⚙️)**
2. **Environments → Add**
3. Nome: `dev`
4. Adicione duas variáveis:

| Variable | Type | Initial Value | Current Value |
|---|---|---|---|
| `base_url` | default | (deixe em branco) | URL do seu Codespace ou `http://localhost:3000` |
| `resource_id` | default | `1` | `1` |

5. **Save**

> ⚠️ **`Initial Value` vs `Current Value`:**
> - `Initial Value` é o que vai parar no JSON exportado (e portanto no documento de entrega).
> - `Current Value` é o que está sendo usado agora — fica só na sua máquina.
>
> Para esta atividade, como a URL muda a cada Codespace, **use `Current Value` para `base_url`** e deixe `Initial Value` em branco.

### Importando o exemplo

Há um environment pronto em [`environments/dev.postman_environment.json`](../environments/dev.postman_environment.json) que você pode importar (Environments → Import) e adaptar.

---

## Usando variáveis nos requests

Substitua URLs literais pela sintaxe `{{nomeVariavel}}`:

| Antes | Depois |
|---|---|
| `https://abc-3000.app.github.dev/posts/1` | `{{base_url}}/posts/{{resource_id}}` |
| `https://abc-3000.app.github.dev/posts` | `{{base_url}}/posts` |

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

Antes de rodar a coleção, **selecione o environment `dev`** no dropdown ao lado do ícone de olho (canto superior direito).

Se não houver environment ativo, `{{base_url}}` aparece em vermelho e o request falha com erro `Invalid URL`.

---

## Padrão "criar e reutilizar"

Caso de uso clássico: você cria um recurso com `POST`, recebe o id de volta, e quer usar esse id no próximo request.

### Aba Tests do `POST /posts`:

```javascript
pm.test("Status é 201", function () {
  pm.response.to.have.status(201);
});

const created = pm.response.json();
pm.environment.set("created_id", created.id);
console.log("ID criado:", created.id);
```

### URL do próximo request:

```
GET {{base_url}}/posts/{{created_id}}
```

> 💡 Esse padrão torna a coleção independente de dados pré-existentes — ela cria o que precisa antes de usar.

---

## Boas práticas

✅ **Faça**

- Use `Initial Value` apenas para valores não sensíveis e estáveis.
- Use `Current Value` para a URL do Codespaces (que muda).
- Adicione `*.secret.json` ao `.gitignore` se houver credenciais.
- Verifique antes da entrega que **todos** os requests usam `{{base_url}}`.

❌ **Evite**

- Misturar URL hardcoded com variável (ou usa tudo, ou nada).
- Senhas/tokens commitados, nem que seja em `Initial Value`.
- Variáveis com nomes vagos como `var1`, `temp`, `x`.

---

[← Anterior: Cenários negativos](04-cenarios-negativos.md) · [↑ README](../README.md)
