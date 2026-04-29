# 📁 environments/

Aqui ficam os environments exportados do Postman.

## O que tem aqui

- `dev.postman_environment.json` — environment de exemplo apontando para JSONPlaceholder
- `hml.postman_environment.json` — environment de exemplo apontando para ReqRes (usado no bônus)

## Como exportar do Postman

1. Clique no ícone de **engrenagem (⚙️)** no canto superior direito
2. Em **Environments**, passe o mouse sobre o environment desejado
3. Clique no ícone de **download (⬇️)** ou nos três pontinhos → **Export**
4. Salve o `.json` nesta pasta

## ⚠️ Antes de commitar

**Verifique se nenhuma variável marcada como "secret" tem valor real preenchido em `Initial Value`.**

`Current Value` fica só na sua máquina. `Initial Value` vai para o JSON exportado e portanto para o Git.

Se houver tokens, senhas ou chaves de API, deixe `Initial Value` em branco e use:

```
*.secret.json
```

(já está no `.gitignore`).
