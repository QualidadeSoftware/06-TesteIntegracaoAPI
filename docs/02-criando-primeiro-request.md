# 02 — Criando seu primeiro request com testes

Este guia mostra o ciclo completo: **subir a API → criar coleção → criar request → escrever testes → rodar → ver resultado**. Use a API didática que vem neste repositório (porta `3000`).

---

## 0. Suba a API antes de tudo

Veja a seção *"Subindo a API no Codespaces"* do [README principal](../README.md). Você precisa ter à mão a URL pública (Codespaces) ou `http://localhost:3000` (local).

Se a porta pública do Codespaces estiver bloqueada pela sua conta/organização, use a extensão Postman dentro do Codespaces ou rode a API localmente.

Daqui em diante, vamos chamar essa URL de `BASE`.

---

## 1. Criar uma coleção

A coleção é a "pasta" que agrupa seus requests relacionados.

1. No painel esquerdo, abra **Collections**.
2. Clique em **+** ou **New Collection**. Se o Postman oferecer templates, escolha uma coleção em branco.
3. Nomeie como `Atividade-Teste-API`
4. (Opcional) Adicione uma descrição: "Atividade prática — Qualidade de Software / UNISANTA"
5. Clique em **Create**

---

## 2. Criar o primeiro request

1. Clique nos **três pontinhos (⋯)** ao lado do nome da coleção e selecione **Add request**. Você também pode usar o botão **+** no topo e salvar o request dentro da coleção.
2. Se o request abrir como uma aba temporária, salve-o na coleção antes de continuar.
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

## 4. Escrever testes em Scripts → Post-response

**Sem testes em Scripts → Post-response, sua entrega não vale.**

1. Com o request aberto, clique na aba **Scripts**.
2. No painel lateral/interno de Scripts, selecione **Post-response**.
3. Cole o seguinte código:

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

1. Clique em **Save** no topo direito do request ou pressione **Ctrl+S** para salvar.

---

## 5. Rodar o request e ver os testes

1. Clique em **Send** novamente
2. No painel inferior, clique na aba **Test Results** — deve mostrar `(3/3)`:

```text
✓ Status é 200
✓ Body é um array com mais de 0 itens
✓ Resposta veio em menos de 2s
```

---

## 6. Repita para os outros 5 requests positivos

Use o exemplo acima como modelo. Para cada request adicione **pelo menos 2 testes** em **Scripts → Post-response**. Para `POST`, `PUT`, `PATCH`, configure a aba **Body** com `raw` + `JSON`.

### Exemplo de body para `POST /posts`

Aba **Body** → **raw** → dropdown de formato **JSON**:

```json
{
  "title": "teste UNISANTA",
  "body": "corpo do post de teste",
  "userId": 1
}
```

E adicione o header:

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

O Postman normalmente adiciona esse header automaticamente quando você escolhe **raw** + **JSON**. Se não adicionar, configure manualmente na aba **Headers**. Na interface atual, essa aba pode aparecer como **Headers 8**, **Headers 9** etc.; o número só indica quantos headers existem.

### Exemplos de body para `PUT` e `PATCH`

`PUT BASE/posts/1` substitui o recurso inteiro:

```json
{
  "title": "título atualizado",
  "body": "corpo atualizado",
  "userId": 1
}
```

`PATCH BASE/posts/1` altera só os campos enviados:

```json
{
  "title": "patch parcial"
}
```

---

## 7. Rodar a coleção inteira (Collection Runner)

Quando todos os 6 requests estiverem prontos:

Se você já tiver rodado a coleção antes, execute `POST BASE/reset` para recriar os dados iniciais.

Ritual recomendado antes de tirar prints: rode `POST BASE/reset` uma vez, depois execute os requests na ordem numérica.

1. Passe o mouse sobre a coleção no painel esquerdo, clique em **⋯** e escolha **Run collection**.
2. Na tela do Runner, marque os requests que serão executados.
3. Confira se a ordem está `00 - Resetar dados`, `01`, `02`, ..., `09`. Se o Runner mostrar pastas, expanda e confirme a sequência.
4. Clique em **Run** ou **Run Atividade-Teste-API**.

Você verá um relatório com **N tests passed, 0 failed**. **Tire um print desta tela** — ele faz parte dos entregáveis.

> ⚠️ Rode os requests na ordem numérica. Os últimos requests alteram o estado da API, especialmente o `DELETE /posts/1`.

---

## Erros comuns

### "Could not get response: ECONNREFUSED"

A API não está rodando. Volte ao terminal do Codespaces (ou local) e confirme que aparece `API didática rodando em http://localhost:3000`.

### Status 502 ao bater na URL pública do Codespaces

Provavelmente o Codespace hibernou. Reabra-o pela aba **Codespaces** no GitHub e aguarde a API iniciar novamente.

### Erro EADDRINUSE no terminal

Esse erro normalmente significa que a API já está rodando na porta `3000`. Confira a aba **Ports** e use a URL encaminhada. Se precisar reiniciar do zero, pare o processo antigo no terminal antes de rodar `npm start` novamente.

### Os testes não aparecem em "Test Results"

Confirme que você colou o código em **Scripts → Post-response**, não em **Pre-request**. Os testes só rodam **depois** da resposta chegar.

---

[← Anterior: Instalação](01-instalacao-postman.md) · [→ Próximo: Escrevendo testes com `pm.*`](03-escrevendo-tests.md) · [↑ README](../README.md)
