# Guia Completo de Deploy em Produção - ReforçaJu

## Índice
1. [Visão Geral](#visão-geral)
2. [Preparação do Projeto](#preparação-do-projeto)
3. [Escolha da Plataforma de Hospedagem](#escolha-da-plataforma-de-hospedagem)
4. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
5. [Build e Otimização](#build-e-otimização)
6. [Deploy em Diferentes Plataformas](#deploy-em-diferentes-plataformas)
7. [Monitoramento e Manutenção](#monitoramento-e-manutenção)
8. [Segurança](#segurança)

---

## Visão Geral

O **ReforçaJu** é uma aplicação React estática (SPA - Single Page Application) que se conecta à API do Google Gemini para fornecer respostas de IA em tempo real. A versão atual é uma demonstração sem autenticação ou banco de dados persistente.

### Arquitetura Atual
- **Frontend:** React 19 + Tailwind CSS 4 + Vite
- **API Externa:** Google Gemini API
- **Hospedagem:** Estática (CDN)
- **Armazenamento:** Memória do navegador (sessão)

---

## Preparação do Projeto

### 1. Verificar Dependências

Antes de fazer o deploy, certifique-se de que todas as dependências estão instaladas e atualizadas:

```bash
cd /home/ubuntu/reforcaju-demo
pnpm install
```

### 2. Testar Localmente

Execute o servidor de desenvolvimento e teste todas as funcionalidades:

```bash
pnpm dev
```

Acesse `http://localhost:3000` e verifique:
- Carregamento da página inicial
- Seleção de disciplinas
- Envio de mensagens
- Recebimento de respostas da IA
- Limpeza do histórico de chat

### 3. Build de Produção

Gere o build otimizado para produção:

```bash
pnpm build
```

Isso criará uma pasta `dist/` com os arquivos otimizados e minificados.

### 4. Testar o Build Localmente

Antes de fazer deploy, teste o build localmente:

```bash
pnpm preview
```

Isso serve os arquivos estáticos como seriam servidos em produção.

---

## Escolha da Plataforma de Hospedagem

### Opções Recomendadas

| Plataforma | Custo | Facilidade | Escalabilidade | Recomendado Para |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel** | Gratuito/Pago | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Melhor opção - Otimizado para React |
| **Netlify** | Gratuito/Pago | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Ótima alternativa |
| **GitHub Pages** | Gratuito | ⭐⭐⭐⭐ | ⭐⭐⭐ | Projetos pequenos |
| **AWS S3 + CloudFront** | Pago | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Produção em larga escala |
| **DigitalOcean** | Pago | ⭐⭐⭐ | ⭐⭐⭐⭐ | Controle total |

### Recomendação: Vercel

O **Vercel** é a melhor opção porque:
- Otimizado especificamente para aplicações React/Next.js
- Deploy automático via Git
- Suporte a variáveis de ambiente
- CDN global com latência baixa
- Plano gratuito generoso para projetos pequenos
- Suporte a serverless functions (para futuras expansões)

---

## Configuração de Variáveis de Ambiente

### Variáveis Necessárias

A chave da API Gemini está atualmente hardcoded no arquivo `client/src/lib/geminiClient.ts`. Para produção, **NUNCA** deixe chaves de API expostas no código.

### Passo 1: Criar Arquivo `.env.local` (Desenvolvimento)

```bash
# .env.local (NÃO fazer commit deste arquivo)
VITE_GEMINI_API_KEY=AlzaSyAurRsjXtAgShtZY4MVYzgyNRX4-0dyZY
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Passo 2: Atualizar `geminiClient.ts`

Modifique o arquivo para usar variáveis de ambiente:

```typescript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL || "";

if (!GEMINI_API_KEY) {
  console.error("VITE_GEMINI_API_KEY não está configurada");
}
```

### Passo 3: Configurar em Vercel (ou outra plataforma)

1. Acesse o painel do Vercel
2. Vá para **Settings → Environment Variables**
3. Adicione as variáveis:
   - `VITE_GEMINI_API_KEY`: Sua chave de API
   - `VITE_GEMINI_API_URL`: URL da API

---

## Build e Otimização

### Otimizações Automáticas

O Vite já realiza várias otimizações automaticamente:
- **Minificação** de JavaScript e CSS
- **Tree-shaking** para remover código não utilizado
- **Code splitting** para carregar apenas o necessário
- **Compressão** de imagens

### Verificar Tamanho do Bundle

```bash
pnpm build
# Verifique o tamanho dos arquivos em dist/
```

### Melhorias Adicionais (Opcional)

1. **Compressão Gzip:** A maioria dos servidores já suporta automaticamente
2. **Lazy Loading:** Implementar code splitting por rota (se necessário)
3. **Caching:** Configurar headers de cache apropriados

---

## Deploy em Diferentes Plataformas

### 1. Deploy em Vercel (Recomendado)

#### Opção A: Via GitHub

1. Faça push do seu código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em **New Project**
4. Selecione seu repositório
5. Vercel detectará automaticamente que é um projeto Vite
6. Clique em **Deploy**

#### Opção B: Via CLI

```bash
# Instalar CLI do Vercel
npm i -g vercel

# Fazer deploy
vercel

# Seguir as instruções interativas
```

### 2. Deploy em Netlify

```bash
# Instalar CLI do Netlify
npm i -g netlify-cli

# Fazer deploy
netlify deploy --prod --dir=dist
```

### 3. Deploy em GitHub Pages

1. Adicione ao `package.json`:
```json
{
  "homepage": "https://seu-usuario.github.io/reforcaju-demo"
}
```

2. Atualize `vite.config.ts`:
```typescript
export default {
  base: '/reforcaju-demo/',
  // ... resto da config
}
```

3. Deploy:
```bash
pnpm build
pnpm deploy
```

### 4. Deploy em AWS S3 + CloudFront

```bash
# Build
pnpm build

# Fazer upload para S3
aws s3 sync dist/ s3://seu-bucket-name --delete

# Invalidar CloudFront (se configurado)
aws cloudfront create-invalidation --distribution-id SEU_ID --paths "/*"
```

---

## Monitoramento e Manutenção

### 1. Monitoramento de Erros

Implemente um serviço de rastreamento de erros como **Sentry**:

```bash
npm install @sentry/react @sentry/tracing
```

Adicione ao `App.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://seu-dsn@sentry.io/seu-id",
  environment: process.env.NODE_ENV,
});
```

### 2. Analytics

Configure Google Analytics para rastrear uso:

```html
<!-- Em client/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 3. Logs

Use o console do navegador ou um serviço como **LogRocket** para monitorar comportamento dos usuários.

### 4. Performance

Monitore performance com:
- **Lighthouse** (Chrome DevTools)
- **WebPageTest**
- **GTmetrix**

---

## Segurança

### 1. Proteção da Chave de API

**NUNCA** exponha a chave de API no código cliente. Para produção com backend:

```typescript
// Frontend - Chamar seu próprio backend
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userMessage })
});

// Backend (Node.js/Python) - Chamar Gemini com chave protegida
const geminiResponse = await fetch(GEMINI_URL, {
  headers: {
    'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
  }
});
```

### 2. CORS (Cross-Origin Resource Sharing)

A API do Gemini permite requisições diretas do navegador, mas para produção, considere:
- Usar um proxy backend
- Implementar rate limiting
- Validar requisições

### 3. Content Security Policy (CSP)

Adicione headers de segurança no seu servidor:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://generativelanguage.googleapis.com;
```

### 4. HTTPS

Sempre use HTTPS em produção. Vercel, Netlify e outros serviços fornecem certificados SSL automaticamente.

### 5. Atualizações de Dependências

Mantenha as dependências atualizadas:

```bash
pnpm outdated
pnpm update
```

---

## Checklist de Deploy

- [ ] Todas as dependências instaladas (`pnpm install`)
- [ ] Testes locais passando (`pnpm dev`)
- [ ] Build funcionando (`pnpm build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Chave de API protegida (não hardcoded)
- [ ] HTTPS habilitado
- [ ] CDN configurado
- [ ] Monitoramento de erros ativo
- [ ] Analytics configurado
- [ ] Backup do código no Git
- [ ] Documentação atualizada
- [ ] Testes de performance realizados

---

## Próximos Passos

Após o deploy inicial, considere:

1. **Adicionar Autenticação:** Firebase Auth, Auth0, ou Supabase
2. **Implementar Banco de Dados:** Para salvar histórico de conversas
3. **Criar Backend:** Para proteger chaves de API e adicionar lógica complexa
4. **Integrar Pagamentos:** Stripe para versão premium
5. **Implementar PWA:** Para funcionar offline

Consulte o documento `GUIA_BANCO_DADOS.md` para detalhes sobre estrutura de dados em produção.
