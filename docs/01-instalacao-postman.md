# 01 — Instalação do Postman ou Bruno

> Você só precisa de **uma** das duas ferramentas. Escolha pelo seu sistema operacional e preferência.

## Opção A — Postman (recomendado para iniciantes)

Postman tem interface mais polida e documentação extensa. Padrão de mercado.

### Download

- **Site oficial:** https://www.postman.com/downloads/
- Versões disponíveis: Windows, macOS (Intel e Apple Silicon), Linux (`.tar.gz` e Snap)

### Após instalar

1. Abra o Postman
2. Você pode **pular** a criação de conta clicando em "Skip and go to the app" (canto inferior). Para esta atividade não é necessário sincronizar coleções na nuvem.
3. Confira a versão em **Help → About** — qualquer versão `10.x` ou superior funciona.

### Linux via Snap

```bash
sudo snap install postman
```

---

## Opção B — Bruno (open-source, leve, versionável)

Bruno armazena coleções como arquivos `.bru` em texto, **diretamente no Git**. Para alguém que vive no terminal e no GitHub, é mais natural.

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

- A sintaxe dos testes **não usa** `pm.*` — usa um DSL próprio do Bruno
- Bruno suporta **importar coleções Postman** (File → Import Collection → Postman)
- Para a entrega da atividade, exporte sua coleção em formato Postman para que a rubrica seja aplicada uniformemente

---

## Verificando que está funcionando

### Faça um GET de teste

1. Crie uma nova request (botão **+** em qualquer das ferramentas)
2. Cole a URL: `https://jsonplaceholder.typicode.com/posts/1`
3. Clique em **Send** (Postman) ou **Run** (Bruno)
4. Você deve ver na resposta um JSON parecido com:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident...",
  "body": "quia et suscipit\nsuscipit recusandae..."
}
```

Se viu este JSON com **status 200**, você está pronto para a Etapa 1. ✅

---

## (Opcional) Instalar Newman para o bônus

Newman é a CLI do Postman — necessária só para o bônus de CI/CD.

```bash
# Pré-requisito: Node.js 18+
node --version

# Instalação
npm install -g newman
npm install -g newman-reporter-htmlextra

# Verificação
newman --version
```

Se `newman --version` imprimir algo como `6.x.x`, está pronto.

---

[← Voltar ao README principal](../README.md)
