# 05 — Variáveis e environments

> **Por que parametrizar?** Porque a URL pública do Codespaces muda toda vez que ele é recriado. Uma coleção com URLs hardcoded vira lixo no primeiro restart.

---

## Os 4 escopos de variáveis no Postman

- **Global:** vale para toda instância do Postman. Use para constantes do time, mas evite credenciais.
- **Environment:** vale enquanto o environment estiver ativo. Use para `base_url`, `token` e outros valores por ambiente.
- **Collection:** vale dentro da coleção. Use para constantes específicas daquele conjunto de testes.
- **Local (run):** vale apenas durante a execução do request. Use para IDs criados em um `POST` e reutilizados no request seguinte.

A regra: **use o escopo mais restrito que resolve o problema.**

- URL base (que muda quando o Codespace é recriado)? Environment.
- ID gerado por uma chamada anterior? Local.
- Senha? Nunca em Global. Vá de Environment marcado como `secret`.

---

## Criando seu environment

### Pelo Postman

1. No painel esquerdo, abra **Environments**.
2. Clique em **+** ou **Create Environment**.
3. Nome: `dev`
4. Adicione duas variáveis:

- `base_url`
  - Type: `default`
  - Initial Value: deixe em branco, ou use `http://localhost:3000` se for local
  - Current Value: URL do seu Codespace ou `http://localhost:3000`
- `resource_id`
  - Type: `default`
  - Initial Value: `1`
  - Current Value: `1`

1. Clique em **Save**.

> ⚠️ **`Initial Value` vs `Current Value`:**
> `Initial Value` é o valor que aparece no JSON exportado. `Current Value` é o valor usado na execução.
> Para esta atividade, como a URL muda a cada Codespace, **use `Current Value` para `base_url`** e deixe `Initial Value` em branco. Se você estiver rodando localmente, pode usar `http://localhost:3000` nos dois campos.

### Importando o exemplo

Há um environment pronto em [`environments/dev.postman_environment.json`](../environments/dev.postman_environment.json) que você pode importar e adaptar. Clique em **Import**, selecione o arquivo `.json`, abra o environment `dev` importado e substitua o `Current Value` de `base_url` pela URL pública da porta `3000`.

Depois de alterar o `Current Value`, clique em **Save** no environment. Se você estiver usando Codespaces, a URL pública deve ficar no **Current Value**. No JSON exportado, é aceitável que o `Initial Value` de `base_url` fique vazio ou com `http://localhost:3000`.

---

## Usando variáveis nos requests

Substitua URLs literais pela sintaxe `{{nomeVariavel}}`:

- Antes: `https://abc-3000.app.github.dev/posts/1`
  Depois: `{{base_url}}/posts/{{resource_id}}`
- Antes: `https://abc-3000.app.github.dev/posts`
  Depois: `{{base_url}}/posts`

Você pode usar variáveis em **qualquer campo de texto**: URL, headers, body, params.

### No body também

```json
{
  "userId": {{resource_id}},
  "title": "post de teste"
}
```

Como `userId` é numérico, a variável fica sem aspas. Para valores de texto, use aspas, por exemplo `"title": "{{title}}"`.

---

## Ativando o environment

Antes de rodar a coleção, **selecione o environment `dev`** no dropdown ao lado do ícone de olho (canto superior direito).

Na interface atual, esse dropdown pode aparecer como **No environment**. Troque **No environment** por `dev`. Se não houver environment ativo, `{{base_url}}` aparece em vermelho e o request falha com erro `Invalid URL`.

---

## Padrão "criar e reutilizar"

Caso de uso clássico: você cria um recurso com `POST`, recebe o id de volta, e quer usar esse id no próximo request.

### Scripts → Post-response do `POST /posts`

```javascript
pm.test("Status é 201", function () {
  pm.response.to.have.status(201);
});

const created = pm.response.json();
pm.environment.set("created_id", created.id);
```

### URL do próximo request

```http
GET {{base_url}}/posts/{{created_id}}
```

> 💡 Esse padrão torna a coleção independente de dados pré-existentes — ela cria o que precisa antes de usar.

## Obrigatório x desafio extra

Para concluir a atividade, basta usar `{{base_url}}` em todos os requests e `{{resource_id}}` nos requests que acessam `/posts/1`.

Como desafio extra, use o padrão `created_id` para deixar a coleção menos dependente do estado inicial da API. Ele é útil quando você quer que a própria coleção crie o recurso que será consultado, atualizado e removido depois.

---

## Boas práticas

✅ **Faça**

- Use `Initial Value` apenas para valores não sensíveis e estáveis.
- Use `Current Value` para a URL do Codespaces (que muda).
- Adicione `*.secret.json` ao `.gitignore` se houver credenciais.
- Verifique antes da entrega que **todos** os requests usam `{{base_url}}`.
- Execute `POST {{base_url}}/reset` antes de repetir a coleção quando ela usar dados fixos como `{{resource_id}} = 1`.

❌ **Evite**

- Misturar URL hardcoded com variável (ou usa tudo, ou nada).
- Senhas/tokens commitados, nem que seja em `Initial Value`.
- Variáveis com nomes vagos como `var1`, `temp`, `x`.

---

[← Anterior: Cenários negativos](04-cenarios-negativos.md) · [↑ README](../README.md)
