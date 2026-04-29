# 02 — Criando seu primeiro request com testes

Este guia mostra o ciclo completo: **subir a API → criar coleção → criar request → escrever testes → rodar → ver resultado**. Use a API didática que vem neste repositório (porta `3000`).

---

## 0. Suba a API antes de tudo

Veja a seção *"Subindo a API no Codespaces"* do [README principal](../README.md). Você precisa ter à mão a URL pública (Codespaces) ou `http://localhost:3000` (local).

Daqui em diante, vamos chamar essa URL de `BASE`.

---

## 1. Criar uma coleção

A coleção é a "pasta" que agrupa seus requests relacionados.

1. No painel esquerdo, aba **Collections**
2. Clique em **+** ou **New Collection**
3. Nomeie como `Atividade-Teste-API`
4. (Opcional) Adicione uma descrição: "Atividade prática — Qualidade de Software / UNISANTA"
5. Clique em **Create**

---

## 2. Criar o primeiro request

1. Clique nos **três pontinhos (⋯)** ao lado do nome da coleção
2. Selecione **Add Request**
3. Nomeie: `01 - GET listar todos`
4. No painel central, configure:
   - **Método:** `GET`
   - **URL:** `BASE/posts` (substituindo `BASE` pela sua URL real)
5. Clique em **Send**

Você verá no painel inferior:

- **Status:** `200 OK` (em verde)
- **Time:** algo entre 5ms e 200ms (API local é rápida)
- **Body:** um JSON array com os posts iniciais

---

## 3. Salvar o request na coleção

> ⚠️ Por padrão, o Postman cria requests em "abas temporárias" que somem se você fechar a janela.

1. Pressione **Ctrl+S** (ou **Cmd+S** no Mac)
2. Escolha a coleção `Atividade-Teste-API`
3. Confirme em **Save**

---

## 4. Escrever testes na aba `Tests`

**Sem testes na aba `Tests`, sua entrega não vale.**

1. Com o request aberto, clique na aba **Tests**
2. Cole o seguinte código:

```javascript
pm.test("Status é 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Body é um array com mais de 0 itens", function () {
  const body = pm.response.json();
  pm.expect(body).to.be.an("array");
  pm.expect(body.length).to.be.above(0);
});

pm.test("Resposta veio em menos de 2s", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

3. **Ctrl+S** para salvar

---

## 5. Rodar o request e ver os testes

1. Clique em **Send** novamente
2. No painel inferior, clique na aba **Test Results** — deve mostrar `(3/3)`:

```
✓ Status é 200
✓ Body é um array com mais de 0 itens
✓ Resposta veio em menos de 2s
```

---

## 6. Repita para os outros 5 requests positivos

Use o exemplo acima como modelo. Para cada request adicione **pelo menos 2 testes** na aba `Tests`. Para `POST`, `PUT`, `PATCH`, configure a aba **Body** com `raw` + `JSON`.

### Exemplo de body para `POST /posts`

Aba **Body** → **raw** → **JSON**:

```json
{
  "title": "teste UNISANTA",
  "body": "corpo do post de teste",
  "userId": 1
}
```

E adicione o header:

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |

---

## 7. Rodar a coleção inteira (Collection Runner)

Quando todos os 6 requests estiverem prontos:

Se você já tiver rodado a coleção antes, execute `POST BASE/reset` para recriar os dados iniciais.

1. **⋯** da coleção → **Run collection**
2. Marque todos os requests
3. Clique em **Run Atividade-Teste-API**

Você verá um relatório com **N tests passed, 0 failed**. **Tire um print desta tela** — ele faz parte dos entregáveis.

> ⚠️ Rode os requests na ordem numérica. Os últimos requests alteram o estado da API, especialmente o `DELETE /posts/1`.

---

## Erros comuns

<details>
<summary><b>"Could not get response: ECONNREFUSED"</b></summary>

A API não está rodando. Volte ao terminal do Codespaces (ou local) e confirme que aparece `API didática rodando em http://localhost:3000`.
</details>

<details>
<summary><b>Status 502 ao bater na URL pública do Codespaces</b></summary>

Provavelmente o Codespace hibernou. Reabra-o pela aba **Codespaces** no GitHub e aguarde a API iniciar novamente.
</details>

<details>
<summary><b>Os testes não aparecem em "Test Results"</b></summary>

Confirme que você colou o código na aba **Tests** (não em `Pre-request Script`). Os testes só rodam **depois** da resposta chegar.
</details>

---

[← Anterior: Instalação](01-instalacao-postman.md) · [→ Próximo: Escrevendo Tests com `pm.*`](03-escrevendo-tests.md) · [↑ README](../README.md)
