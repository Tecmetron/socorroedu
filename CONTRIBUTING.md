# 🤝 Guia de Contribuição - SocorroEdu

Obrigado por considerar contribuir para o SocorroEdu! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto adota um Código de Conduta para garantir um ambiente acolhedor para todos. Ao participar, você concorda em manter respeito e inclusão.

## 🚀 Como Começar

### 1. Fork o Repositório

Clique no botão "Fork" no GitHub para criar uma cópia do repositório na sua conta.

### 2. Clone Seu Fork

```bash
git clone https://github.com/seu-usuario/socorroedu.git
cd socorroedu
```

### 3. Configure o Upstream

```bash
git remote add upstream https://github.com/usuario-original/socorroedu.git
git fetch upstream
```

### 4. Instale Dependências

```bash
pnpm install
```

## 🔧 Desenvolvimento

### Criar uma Branch

```bash
# Atualize a branch main
git checkout main
git pull upstream main

# Crie uma nova branch
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-bug
```

### Padrões de Nomenclatura de Branch

- `feature/nome-da-feature` - Nova funcionalidade
- `fix/nome-do-bug` - Correção de bug
- `docs/nome-da-doc` - Documentação
- `refactor/nome-da-refatoracao` - Refatoração
- `test/nome-do-teste` - Testes

### Executar o Projeto

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Verificar Tipos e Formatação

```bash
# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format

# Ambos
pnpm lint
```

## 📝 Padrões de Código

### Commits

Siga o padrão de commit semântico:

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

**Tipos:**
- `Add:` - Nova funcionalidade
- `Fix:` - Correção de bug
- `Docs:` - Documentação
- `Style:` - Formatação de código (sem mudança lógica)
- `Refactor:` - Refatoração de código
- `Test:` - Adicionar ou atualizar testes
- `Chore:` - Tarefas de manutenção

**Exemplos:**

```bash
git commit -m "Add: nova disciplina de Filosofia"
git commit -m "Fix: erro ao enviar mensagem vazia"
git commit -m "Docs: atualizar README com instruções de deploy"
git commit -m "Refactor: simplificar lógica de chat"
```

### Código TypeScript/React

```typescript
// ✅ BOM: Nomes descritivos, tipos explícitos
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sendMessage = async (message: string): Promise<void> => {
  try {
    const response = await geminiClient.sendMessage(message);
    console.log("Resposta:", response);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

// ❌ RUIM: Nomes genéricos, sem tipos
const send = async (msg) => {
  try {
    const res = await geminiClient.sendMessage(msg);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
};
```

### Componentes React

```typescript
// ✅ BOM: Componente bem estruturado
interface ChatInterfaceProps {
  subject: string;
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  subject,
  onClose,
}) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      // Lógica de envio
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      {/* JSX */}
    </div>
  );
};
```

### CSS/Tailwind

```typescript
// ✅ BOM: Classes bem organizadas
<div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Título</h1>
  <p className="text-gray-600">Descrição</p>
</div>

// ❌ RUIM: Classes desorganizadas
<div className="flex p-4 bg-white rounded-lg shadow-md flex-col gap-4">
  <h1 className="font-bold text-gray-900 text-2xl">Título</h1>
  <p className="text-gray-600">Descrição</p>
</div>
```

## 🧪 Testes

Embora o projeto use Vitest, testes ainda não estão implementados. Ao adicionar novas funcionalidades, considere adicionar testes:

```typescript
import { describe, it, expect } from "vitest";
import { geminiClient } from "@/lib/geminiClient";

describe("GeminiClient", () => {
  it("deve enviar mensagem com sucesso", async () => {
    const response = await geminiClient.sendMessage("Olá");
    expect(response).toBeDefined();
    expect(typeof response).toBe("string");
  });
});
```

## 📤 Submeter Pull Request

### 1. Push para Seu Fork

```bash
git push origin feature/sua-feature
```

### 2. Crie um Pull Request

- Vá para o repositório original no GitHub
- Clique em "New Pull Request"
- Selecione sua branch
- Preencha o template de PR

### 3. Template de Pull Request

```markdown
## 📝 Descrição

Breve descrição do que foi alterado.

## 🎯 Tipo de Mudança

- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Documentação
- [ ] Refatoração
- [ ] Outro (descreva)

## 🧪 Como Testar

Passos para testar as mudanças:

1. ...
2. ...
3. ...

## ✅ Checklist

- [ ] Código segue os padrões do projeto
- [ ] Executei `pnpm format` e `pnpm check`
- [ ] Atualizei a documentação (se necessário)
- [ ] Testei localmente
- [ ] Sem quebra de funcionalidades existentes

## 📸 Screenshots (se aplicável)

Adicione screenshots de mudanças visuais.

## 🔗 Issues Relacionadas

Fecha #123 (número da issue)
```

### 4. Revisão de Código

- Responda aos comentários dos revisores
- Faça as alterações solicitadas
- Faça push das mudanças (o PR será atualizado automaticamente)

## 🐛 Reportar Bugs

### Antes de Reportar

- Verifique se o bug já foi reportado
- Tente reproduzir em ambiente limpo
- Reúna informações de debug

### Template de Issue

```markdown
## 🐛 Descrição do Bug

Descrição clara do problema.

## 🔄 Passos para Reproduzir

1. ...
2. ...
3. ...

## ✅ Comportamento Esperado

O que deveria acontecer.

## ❌ Comportamento Atual

O que realmente acontece.

## 🖥️ Ambiente

- Sistema Operacional: [ex: Windows 10]
- Node.js: [ex: 18.0.0]
- pnpm: [ex: 10.4.1]
- Navegador: [ex: Chrome 120]

## 📸 Screenshots

Se aplicável, adicione screenshots.

## 📝 Logs

```
Cole aqui os logs de erro
```
```

## 💡 Sugerir Melhorias

### Template de Feature Request

```markdown
## 🎯 Descrição da Feature

Descrição clara da funcionalidade desejada.

## 🤔 Motivação

Por que essa feature seria útil?

## 📋 Exemplo de Uso

Como você gostaria de usar essa feature?

## 🔄 Alternativas Consideradas

Outras formas de resolver o problema.
```

## 📚 Recursos Úteis

- [Documentação React](https://react.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google Gemini API](https://ai.google.dev/)

## 🎓 Estrutura do Projeto

```
client/src/
├── components/       # Componentes React reutilizáveis
├── contexts/         # Context API para estado global
├── hooks/            # Custom hooks
├── lib/              # Utilitários (geminiClient, etc)
├── pages/            # Páginas da aplicação
├── App.tsx           # Componente raiz
└── main.tsx          # Entrada da aplicação
```

## 🚀 Processo de Release

1. Atualizar versão em `package.json`
2. Atualizar `CHANGELOG.md` (se existir)
3. Criar tag Git: `git tag v1.0.0`
4. Push: `git push upstream main --tags`
5. Criar release no GitHub

## ❓ Dúvidas?

- 📖 Consulte [GUIA_PRODUCAO.md](./GUIA_PRODUCAO.md)
- 💬 Abra uma discussão no GitHub
- 📧 Entre em contato com os mantenedores

---

**Obrigado por contribuir com SocorroEdu! 🎓**
