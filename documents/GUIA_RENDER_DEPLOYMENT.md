# 🚀 Guia de Deploy no Render.com

Este guia fornece instruções passo a passo para fazer deploy do SocorroEdu no Render.com.

## 📋 Pré-requisitos

- ✅ Repositório GitHub com código do SocorroEdu
- ✅ Conta no Render.com (gratuita em [render.com](https://render.com))
- ✅ Chave de API Google Gemini

## 🎯 Tipos de Serviço Render

| Tipo | Custo | Melhor Para |
|------|-------|-----------|
| **Static Site** | Gratuito | Sites estáticos puros (sem backend) |
| **Web Service** | Gratuito/Pago | Aplicações com backend (Node.js, Python, etc.) |
| **Background Worker** | Pago | Tarefas em background |
| **Cron Job** | Pago | Tarefas agendadas |

**Para SocorroEdu:** Usar **Web Service** (tem backend Express)

## 🔧 Configuração do Projeto

### 1. Verificar render.yaml

O arquivo `render.yaml` já está configurado no projeto:

```yaml
services:
  - type: web
    name: socorroedu
    runtime: node
    plan: free
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
```

### 2. Verificar package.json

Certifique-se que os scripts estão corretos:

```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### 3. Verificar server/index.ts

O servidor deve estar escutando na porta correta:

```typescript
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
```

## 🚀 Passo 1: Preparar Repositório GitHub

### 1.1 Criar Repositório

```bash
# No diretório do projeto
git init
git add .
git commit -m "Initial commit: SocorroEdu MVP"
git branch -M main
git remote add origin https://github.com/seu-usuario/socorroedu.git
git push -u origin main
```

### 1.2 Verificar Arquivo .gitignore

Certifique-se que `.env.local` está no `.gitignore`:

```
.env
.env.local
.env.development.local
.env.production.local
```

### 1.3 Fazer Push do Código

```bash
git push origin main
```

## 🌐 Passo 2: Criar Conta no Render.com

1. Acesse [render.com](https://render.com)
2. Clique em **Sign Up**
3. Escolha **Sign up with GitHub** (recomendado)
4. Autorize o Render a acessar seus repositórios
5. Complete o setup da conta

## 📦 Passo 3: Criar Web Service no Render

### 3.1 Iniciar Novo Serviço

1. No dashboard do Render, clique em **New +**
2. Selecione **Web Service**

### 3.2 Conectar Repositório GitHub

1. Clique em **Connect a repository**
2. Procure por `socorroedu`
3. Clique em **Connect**

### 3.3 Configurar Serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `socorroedu` |
| **Environment** | `Node` |
| **Region** | `São Paulo (South America)` (mais próximo) |
| **Branch** | `main` |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |
| **Plan** | `Free` |

### 3.4 Configurar Variáveis de Ambiente

Clique em **Environment** e adicione:

| Chave | Valor | Escopo |
|-------|-------|--------|
| `NODE_ENV` | `production` | Runtime |
| `VITE_GEMINI_API_KEY` | `sua_chave_aqui` | Build + Runtime |
| `VITE_GEMINI_API_URL` | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` | Build |

**⚠️ Importante:** 
- `VITE_GEMINI_API_KEY` deve estar em **Build** e **Runtime**
- Variáveis com prefixo `VITE_` são injetadas no build do Vite

### 3.5 Revisar Configuração

Verifique se tudo está correto:

```
Name: socorroedu
Environment: Node
Region: São Paulo
Branch: main
Build Command: pnpm install && pnpm build
Start Command: pnpm start
Plan: Free
```

### 3.6 Fazer Deploy

Clique em **Create Web Service**

O Render iniciará:
1. ✅ Clone do repositório
2. ✅ Instalação de dependências (`pnpm install`)
3. ✅ Build (`pnpm build`)
4. ✅ Start do servidor (`pnpm start`)

## 📊 Passo 4: Monitorar Deploy

### 4.1 Acompanhar Build

1. Vá para a página do serviço
2. Clique em **Logs**
3. Acompanhe o progresso do build

**Esperado:**
```
=== Building on ubuntu-22.04
...
pnpm install
pnpm build
...
=== Deploying
...
Server running on http://localhost:3000/
```

### 4.2 Verificar Status

- 🟢 **Live** - Deploy bem-sucedido
- 🟡 **Building** - Em progresso
- 🔴 **Failed** - Erro no deploy

## ✅ Passo 5: Testar Aplicação

### 5.1 Acessar URL

1. Vá para a página do serviço
2. Copie a URL (ex: `https://socorroedu.onrender.com`)
3. Abra em um navegador

### 5.2 Testar Funcionalidades

- ✅ Página carrega sem erros
- ✅ Selecionar disciplina funciona
- ✅ Enviar mensagem funciona
- ✅ Receber resposta da IA funciona
- ✅ Limpar histórico funciona

### 5.3 Verificar Console

Abra DevTools (F12) e verifique:
- ✅ Sem erros de console
- ✅ Sem avisos de segurança
- ✅ Requisições para Gemini API bem-sucedidas

## 🔄 Passo 6: Configurar Deploy Automático

### 6.1 GitHub Integration

O Render já está integrado com GitHub. Cada push para `main` dispara um novo deploy automaticamente.

### 6.2 Desabilitar Deploy Automático (opcional)

Se desejar fazer deploy manual:

1. Vá para **Settings**
2. Desabilite **Auto-deploy**
3. Clique em **Manual Deploy** para fazer deploy

### 6.3 Configurar Webhook (opcional)

Para deploy apenas em tags:

1. Vá para **Settings**
2. Copie o **Deploy Hook**
3. Use em CI/CD ou scripts

## 🐛 Passo 7: Troubleshooting

### Problema: Build falha com "pnpm not found"

**Solução:**
- Render detecta `pnpm-lock.yaml` automaticamente
- Se não funcionar, adicione em `render.yaml`:
```yaml
packageManager: pnpm
```

### Problema: Variáveis de ambiente não funcionam

**Solução:**
- Verifique se `VITE_GEMINI_API_KEY` está em **Build** e **Runtime**
- Variáveis `VITE_*` precisam estar no escopo Build
- Redeploy após adicionar variáveis

### Problema: "Cannot find module 'express'"

**Solução:**
- Execute `pnpm install` localmente
- Verifique se `pnpm-lock.yaml` está no repositório
- Faça push do arquivo lock

### Problema: Aplicação carrega mas não funciona

**Solução:**
- Verifique logs: **Logs** → procure por erros
- Abra DevTools (F12) e verifique console
- Verifique se `VITE_GEMINI_API_KEY` está configurada
- Teste localmente: `pnpm dev`

### Problema: "Error: ENOENT: no such file or directory"

**Solução:**
- Verifique se `dist/public/index.html` existe após build
- Verifique `server/index.ts` - caminho correto para arquivos estáticos
- Teste build localmente: `pnpm build && pnpm preview`

## 📈 Passo 8: Monitoramento em Produção

### 8.1 Logs

Acesse **Logs** para monitorar:
- Erros de aplicação
- Requisições HTTP
- Performance

### 8.2 Métricas

Render fornece:
- CPU usage
- Memory usage
- Bandwidth
- Requests/segundo

### 8.3 Alertas

Configure alertas em **Settings** → **Alerts**

## 🔐 Passo 9: Segurança

### 9.1 Proteger Chave de API

✅ Já feito:
- Chave em variável de ambiente
- Não hardcoded no código
- Não versionado no Git

### 9.2 HTTPS

✅ Automático:
- Render fornece certificado SSL gratuito
- URL: `https://socorroedu.onrender.com`

### 9.3 Recomendações Adicionais

1. **Rate Limiting** - Implementar no backend
2. **CORS** - Configurar adequadamente
3. **CSP Headers** - Adicionar Content-Security-Policy
4. **Autenticação** - Implementar para versão final

## 💰 Passo 10: Gerenciar Custos

### 10.1 Plano Free

- ✅ Gratuito
- ✅ 750 horas/mês
- ✅ Hibernação após 15 min inatividade
- ⚠️ Spin-up lento (30-60 segundos)

### 10.2 Plano Pago

- 💵 $7/mês (Pro)
- ✅ Sem hibernação
- ✅ Spin-up rápido
- ✅ Suporte prioritário

### 10.3 Reduzir Custos

1. Use plano Free para desenvolvimento
2. Upgrade para Pro apenas em produção
3. Monitore uso de recursos
4. Otimize código para performance

## 🎯 Checklist Final

- [ ] Repositório GitHub criado
- [ ] Código feito push para `main`
- [ ] Conta Render.com criada
- [ ] Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido (status 🟢 Live)
- [ ] Aplicação testada e funcionando
- [ ] Logs verificados sem erros
- [ ] URL acessível publicamente
- [ ] HTTPS funcionando

## 📞 Suporte

Se encontrar problemas:

1. **Verificar Logs** - Render Dashboard → Logs
2. **Documentação Render** - [render.com/docs](https://render.com/docs)
3. **GitHub Issues** - Abra issue no repositório
4. **Comunidade** - Discord/Slack do Render

## 🔄 Próximos Passos

Após deploy bem-sucedido:

1. **Monitorar Performance** - Verificar métricas
2. **Coletar Feedback** - Usuários testando
3. **Implementar Melhorias** - Baseado em feedback
4. **Escalar** - Se necessário, upgrade de plano
5. **Adicionar Features** - Autenticação, BD, etc.

---

**Fim do Guia de Deploy Render.com**

**Dúvidas?** Consulte [GUIA_PRODUCAO.md](./GUIA_PRODUCAO.md) para mais informações.
