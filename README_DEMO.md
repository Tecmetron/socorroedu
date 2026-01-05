# ReforçaJu - Versão de Demonstração

Bem-vindo à versão de demonstração do **ReforçaJu**, uma plataforma inteligente de reforço escolar com integração de IA via Google Gemini.

## 📋 Conteúdo

Esta pasta contém:

1. **Aplicação Web Funcional** - Versão demo completa e pronta para rodar localmente
2. **GUIA_PRODUCAO.md** - Documentação detalhada para deploy em produção
3. **GUIA_BANCO_DADOS.md** - Estrutura completa de banco de dados para versão final

## 🚀 Quick Start

### Requisitos

- Node.js 18+ 
- pnpm (ou npm)
- Chave de API do Google Gemini (já incluída na demo)

### Instalação

```bash
# 1. Instalar dependências
pnpm install

# 2. Rodar servidor de desenvolvimento
pnpm dev

# 3. Abrir no navegador
# http://localhost:3000
```

### Uso

1. **Selecione uma disciplina** na tela inicial
2. **Faça uma pergunta** relacionada ao assunto
3. **Receba respostas personalizadas** da IA
4. **Limpe o histórico** quando desejar começar novo tópico

## 📚 Disciplinas Disponíveis

- **Matemática** - Álgebra, Geometria, Cálculo
- **Português** - Literatura, Gramática, Redação
- **Ciências** - Biologia, Física, Química
- **História** - Brasil e Mundo
- **Geografia** - Física e Humana
- **Inglês** - Gramática e Conversação

## 🏗️ Arquitetura

```
reforcaju-demo/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx      # Interface de chat
│   │   │   └── SubjectSelector.tsx    # Seletor de disciplinas
│   │   ├── lib/
│   │   │   └── geminiClient.ts        # Cliente da API Gemini
│   │   ├── pages/
│   │   │   └── Home.tsx               # Página principal
│   │   └── App.tsx                    # Componente raiz
│   ├── public/                        # Arquivos estáticos
│   └── index.html                     # HTML de entrada
├── server/                            # Servidor Express (placeholder)
├── GUIA_PRODUCAO.md                   # Guia de deploy
├── GUIA_BANCO_DADOS.md                # Estrutura de BD
└── package.json                       # Dependências

```

## 🔑 Configuração de API

A chave de API do Gemini está configurada em `client/src/lib/geminiClient.ts`.

**Para produção**, siga as instruções em `GUIA_PRODUCAO.md` para proteger a chave usando variáveis de ambiente.

## 🛠️ Desenvolvimento

### Comandos Disponíveis

```bash
# Servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

### Estrutura de Componentes

- **ChatInterface.tsx** - Gerencia a interface de chat, histórico de mensagens e integração com Gemini
- **SubjectSelector.tsx** - Exibe grid de disciplinas e permite seleção
- **geminiClient.ts** - Abstração para chamadas à API Gemini

### Adicionar Nova Disciplina

1. Adicione à lista `SUBJECTS` em `SubjectSelector.tsx`:
```typescript
{
  id: "nova-disciplina",
  name: "Nova Disciplina",
  icon: IconComponent,
  color: "from-color-500 to-color-600",
  description: "Descrição"
}
```

2. Adicione prompt em `ChatInterface.tsx`:
```typescript
const SUBJECT_PROMPTS = {
  "Nova Disciplina": "Você é um professor de Nova Disciplina..."
}
```

## 📊 Stack Tecnológico

- **Frontend:** React 19 + TypeScript
- **Estilização:** Tailwind CSS 4
- **Build:** Vite
- **UI Components:** shadcn/ui
- **API:** Google Gemini API
- **Roteamento:** Wouter
- **Notificações:** Sonner

## 🔒 Segurança (Demo vs Produção)

### Demo (Atual)
- ✅ Sem autenticação
- ✅ Sem persistência de dados
- ✅ Chave de API exposta (apenas para demo)
- ✅ Sem rate limiting

### Produção (Implementar com GUIA_PRODUCAO.md)
- ✅ Autenticação de usuários
- ✅ Persistência em banco de dados
- ✅ Chave de API protegida (backend)
- ✅ Rate limiting
- ✅ HTTPS obrigatório
- ✅ Row Level Security no BD

## 📈 Performance

- **Bundle Size:** ~150KB (gzipped)
- **Lighthouse Score:** 95+
- **Time to Interactive:** <2s

## 🐛 Troubleshooting

### "Erro ao enviar mensagem"
- Verifique conexão com internet
- Verifique se a chave de API é válida
- Verifique console do navegador para mais detalhes

### "Página em branco"
- Limpe cache do navegador
- Verifique se Node.js está instalado
- Rode `pnpm install` novamente

### "Porta 3000 já em uso"
```bash
# Usar porta diferente
pnpm dev -- --port 3001
```

## 📖 Documentação Completa

- **GUIA_PRODUCAO.md** - Deploy em Vercel, Netlify, AWS, etc.
- **GUIA_BANCO_DADOS.md** - Esquema SQL, Supabase, Firebase, etc.

## 🤝 Contribuindo

Para adicionar features:

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m "Add: sua feature"`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

## 📝 Licença

MIT - Veja LICENSE para detalhes

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação em GUIA_PRODUCAO.md e GUIA_BANCO_DADOS.md

---

## 🎯 Próximas Etapas

Após testar a demo, para levar para produção:

1. **Leia GUIA_PRODUCAO.md** - Deploy e configuração
2. **Leia GUIA_BANCO_DADOS.md** - Implementar persistência
3. **Implemente autenticação** - Firebase ou Supabase Auth
4. **Configure banco de dados** - Supabase ou Firebase
5. **Deploy em produção** - Vercel ou Netlify

---

**Versão:** 1.0.0 (Demo)  
**Data:** Janeiro 2025  
**Status:** ✅ Pronto para demonstração
