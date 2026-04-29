# 02 — Criando seu primeiro request com testes

Este guia mostra o ciclo completo: **criar coleção → criar request → escrever testes → rodar → ver resultado**. Use a API JSONPlaceholder.

---

## 1. Criar uma coleção

A coleção é a "pasta" que agrupa seus requests relacionados.

1. No painel esquerdo, aba **Collections**
2. Clique em **+** ou **New Collection**
3. Nomeie como `Atividade-Teste-API`
4. (Opcional) Adicione uma descrição: "Atividade prática da disciplina Qualidade de Software — UNISANTA"
5. Clique em **Create**

Você verá a coleção vazia no painel esquerdo.

---

## 2. Criar o primeiro request

1. Clique nos **três pontinhos (⋯)** ao lado do nome da coleção
2. Selecione **Add Request**
3. Nomeie: `01 - GET listar todos`
4. No painel central, configure:
   - **Método:** `GET` (já vem selecionado)
   - **URL:** `https://jsonplaceholder.typicode.com/posts`
5. Clique em **Send**

Você verá no painel inferior:

- **Status:** `200 OK` (em verde)
- **Time:** algo entre 100ms e 1500ms
- **Body:** um JSON array com 100 posts

---

## 3. Salvar o request na coleção

> ⚠️ Por padrão, o Postman cria requests em "abas temporárias" que somem se você fechar a janela.

1. Pressione **Ctrl+S** (ou **Cmd+S** no Mac)
2. Escolha a coleção `Atividade-Teste-API`
3. Confirme em **Save**

Agora o request aparece dentro da coleção no painel esquerdo. ✅

---

## 4. Escrever testes na aba `Tests`

Esta é a etapa mais importante. **Sem testes na aba `Tests`, sua entrega não vale.**

1. Com o request aberto, clique na aba **Tests** (entre `Body` e `Settings`)
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
2. No painel inferior, clique na aba **Test Results** (ela mostra `(3/3)` se tudo passou)
3. Você verá:

```
✓ Status é 200
✓ Body é um array com mais de 0 itens
✓ Resposta veio em menos de 2s
```

Se algum testar **falhar**, ele aparece em vermelho com a mensagem do erro.

---

## 6. Repita para os outros 5 requests positivos

Use o exemplo acima como modelo. Para cada request adicione:

- Pelo menos **2 testes** na aba `Tests`
- Use `pm.test(nomeDescritivo, função)` — o nome aparece no relatório
- Para `POST`, `PUT`, `PATCH`, lembre de configurar a aba **Body** com `raw` + `JSON`

### Exemplo de body para POST `/posts`

Aba **Body** → **raw** → **JSON**:

```json
{
  "title": "teste UNISANTA",
  "body": "corpo do post de teste",
  "userId": 1
}
```

E também adicione um header:

Aba **Headers**:

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |

---

## 7. Rodar a coleção inteira de uma vez (Collection Runner)

Quando todos os 6 requests estiverem prontos:

1. Clique nos **três pontinhos (⋯)** da coleção
2. Selecione **Run collection**
3. Marque todos os requests
4. Clique em **Run Atividade-Teste-API**

Você verá um relatório com **N tests passed, 0 failed**. Esse é o "verde" que a rubrica pede. **Tire um print desta tela** — ela vai para `prints/01-collection-runner-passou.png` no seu fork.

---

## Erros comuns

<details>
<summary><b>Status 200 mas body vazio</b></summary>

Algumas APIs retornam `200` em vez de `404` para recursos inexistentes. Verifique se você está mandando para a URL certa.
</details>

<details>
<summary><b>"Could not get response: certificate has expired"</b></summary>

Vá em **Settings → General → SSL certificate verification** e desligue. Em produção isso seria perigoso, mas para uma API pública de aprendizado é seguro.
</details>

<details>
<summary><b>Os testes não aparecem em "Test Results"</b></summary>

Confirme que você colou o código na aba **Tests** (e não em `Pre-request Script`). Os testes só rodam **depois** da resposta chegar.
</details>

---

[← Anterior: Instalação](01-instalacao-postman.md) · [→ Próximo: Escrevendo Tests com `pm.*`](03-escrevendo-tests.md) · [↑ README](../README.md)
