# 01 — Instalação do Postman ou Bruno

> Para iniciantes, use **Postman**. Bruno também pode ser usado, mas exige adaptar a sintaxe dos testes.

## Opção A — Postman (recomendado)

Padrão de mercado, interface polida, documentação extensa.

### Download

- **Site oficial:** https://www.postman.com/downloads/
- Versões para Windows, macOS (Intel e Apple Silicon) e Linux.

### Após instalar

1. Abra o Postman.
2. Pode **pular** a criação de conta clicando em "Skip and go to the app". Para esta atividade não é necessário sincronizar coleções na nuvem.
3. Confira a versão em **Help → About** — qualquer `10.x` ou superior funciona.

### Linux via Snap

```bash
sudo snap install postman
```

---

## Opção B — Bruno (open-source, leve, uso avançado)

Bruno armazena coleções como arquivos `.bru` em texto.

### Download

- **Site oficial:** https://www.usebruno.com/downloads
- **GitHub:** https://github.com/usebruno/bruno

### macOS via Homebrew

```bash
brew install bruno
```

### Windows via winget

```bash
winget install Bruno.Bruno
```

### ⚠️ Diferenças relevantes

- A sintaxe dos testes do Bruno **não usa** `pm.*` — usa um DSL próprio. Os exemplos desta atividade estão em Postman.
- Bruno suporta **importar coleções Postman** (File → Import Collection → Postman).
- Para a entrega, gere evidências equivalentes às do Postman. Se possível, exporte a coleção em formato Postman; se não for possível, anexe os arquivos `.bru` e deixe claro no documento que você usou Bruno.

---

## Verificando que está funcionando

A API didática que você vai testar sobe via Codespaces (ver [README principal](../README.md)). Para conferir que sua ferramenta funciona, abra a API e faça um GET de teste:

1. Suba a API (Codespaces ou `cd api && npm start` localmente).
2. No Postman/Bruno crie uma nova request com a URL:
   - Codespaces: `https://<seu-codespace>-3000.app.github.dev/posts/1`
   - Local: `http://localhost:3000/posts/1`
3. Clique em **Send** (Postman) ou **Run** (Bruno).
4. Você deve ver na resposta um JSON parecido com:

```json
{
  "id": 1,
  "title": "primeiro post",
  "body": "conteúdo inicial número 1",
  "userId": 1
}
```

Se viu este JSON com **status 200**, você está pronto para a Etapa 1. ✅

---

[← Voltar ao README principal](../README.md) · [→ Próximo: Criando primeiro request](02-criando-primeiro-request.md)
