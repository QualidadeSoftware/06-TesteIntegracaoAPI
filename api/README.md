# 🧪 API didática da atividade

Esta API existe **apenas para você poder testar com o Postman**. É uma aplicação Node.js + Express que sobe automaticamente no Codespaces na porta `3000`.

## Endpoints disponíveis

| Método | Rota | Resposta |
|---|---|---|
| `GET` | `/` | Mensagem inicial e total de posts |
| `GET` | `/health` | `{ status: "ok" }` |
| `POST` | `/reset` | Recria os posts iniciais (útil entre execuções) |
| `GET` | `/posts` | Lista todos os posts (200) |
| `GET` | `/posts/:id` | Retorna um post (200) ou 404 |
| `POST` | `/posts` | Cria um post — 201 / 400 (JSON inválido) / 422 (campos obrigatórios) |
| `PUT` | `/posts/:id` | Substitui — 200 / 404 / 422 |
| `PATCH` | `/posts/:id` | Atualiza parcial — 200 / 404 |
| `DELETE` | `/posts/:id` | Remove — 204 / 404 |
| `DELETE` `PUT` `PATCH` | `/posts` | **405 Method Not Allowed** com header `Allow: GET, POST` |

## Rodando localmente (fora do Codespaces)

```bash
cd api
npm install
npm start
```

A API responde em `http://localhost:3000`.

## Schema de um post

```json
{
  "id": 1,
  "title": "primeiro post",
  "body": "conteúdo inicial número 1",
  "userId": 1
}
```

## Body esperado em `POST /posts` e `PUT /posts/:id`

```json
{
  "title": "string obrigatória",
  "body":  "string obrigatória",
  "userId": 1
}
```

Faltando algum campo → `422 Unprocessable Entity`.
JSON malformado → `400 Bad Request`.
