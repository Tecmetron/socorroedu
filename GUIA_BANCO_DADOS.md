# Guia Completo de Estrutura de Banco de Dados - ReforçaJu

## Índice
1. [Visão Geral](#visão-geral)
2. [Diagrama de Entidades](#diagrama-de-entidades)
3. [Esquema Detalhado](#esquema-detalhado)
4. [Relacionamentos](#relacionamentos)
5. [Índices e Performance](#índices-e-performance)
6. [Implementação com Supabase](#implementação-com-supabase)
7. [Implementação com Firebase](#implementação-com-firebase)
8. [Migrações e Versionamento](#migrações-e-versionamento)

---

## Visão Geral

O **ReforçaJu** necessita de um banco de dados para:
- **Persistir conversas** entre sessões
- **Rastrear progresso** do aluno
- **Armazenar preferências** do usuário
- **Gerar relatórios** de aprendizado
- **Implementar autenticação** de usuários

### Tecnologias Recomendadas

| Tecnologia | Tipo | Custo | Escalabilidade | Recomendado |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL + Auth | Gratuito/Pago | ⭐⭐⭐⭐⭐ | ✅ Melhor opção |
| **Firebase** | NoSQL + Auth | Gratuito/Pago | ⭐⭐⭐⭐⭐ | ✅ Ótima alternativa |
| **MongoDB Atlas** | NoSQL | Gratuito/Pago | ⭐⭐⭐⭐⭐ | ✅ Flexível |
| **PostgreSQL** | SQL | Pago | ⭐⭐⭐⭐⭐ | ✅ Tradicional |

**Recomendação:** **Supabase** - Combina PostgreSQL (SQL robusto) com autenticação integrada.

---

## Diagrama de Entidades

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ id (PK)             │
│ email (UNIQUE)      │
│ name                │
│ avatar_url          │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────────┐
│    Conversations            │
├─────────────────────────────┤
│ id (PK)                     │
│ user_id (FK)                │
│ subject                     │
│ title                       │
│ created_at                  │
│ updated_at                  │
│ is_archived                 │
└──────────┬──────────────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────────┐
│      Messages               │
├─────────────────────────────┤
│ id (PK)                     │
│ conversation_id (FK)        │
│ role (user/assistant)       │
│ content                     │
│ tokens_used                 │
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────┐
│   UserProgress      │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ subject             │
│ level               │
│ points              │
│ messages_count      │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│   FlashcardSets     │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ subject             │
│ title               │
│ description         │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────────┐
│      Flashcards             │
├─────────────────────────────┤
│ id (PK)                     │
│ flashcard_set_id (FK)       │
│ question                    │
│ answer                      │
│ difficulty                  │
│ created_at                  │
└─────────────────────────────┘
```

---

## Esquema Detalhado

### 1. Tabela: `users`

Armazena informações dos usuários.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  grade_level VARCHAR(50), -- "6º ano", "7º ano", etc.
  school_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Campos:**
- `id`: Identificador único (UUID)
- `email`: Email único do usuário
- `name`: Nome completo
- `avatar_url`: URL da foto de perfil
- `grade_level`: Série/Ano escolar
- `school_name`: Nome da escola
- `created_at`: Data de criação
- `updated_at`: Última atualização
- `last_login`: Último acesso
- `is_active`: Status ativo/inativo

---

### 2. Tabela: `conversations`

Armazena histórico de conversas de cada usuário.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL, -- "Matemática", "Português", etc.
  title VARCHAR(255),
  summary TEXT,
  message_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  rating INTEGER, -- 1-5 stars
  feedback TEXT
);

-- Índices
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_subject ON conversations(subject);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
```

**Campos:**
- `id`: Identificador único
- `user_id`: Referência ao usuário
- `subject`: Disciplina (Matemática, Português, etc.)
- `title`: Título da conversa (gerado automaticamente)
- `summary`: Resumo da conversa
- `message_count`: Quantidade de mensagens
- `tokens_used`: Tokens consumidos da API
- `created_at`: Data de criação
- `updated_at`: Última atualização
- `is_archived`: Se foi arquivada
- `rating`: Avaliação do usuário (1-5)
- `feedback`: Feedback textual

---

### 3. Tabela: `messages`

Armazena mensagens individuais de cada conversa.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- "user" ou "assistant"
  content TEXT NOT NULL,
  tokens_used INTEGER,
  metadata JSONB, -- Dados adicionais em JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

**Campos:**
- `id`: Identificador único
- `conversation_id`: Referência à conversa
- `role`: "user" (aluno) ou "assistant" (IA)
- `content`: Texto da mensagem
- `tokens_used`: Tokens consumidos nesta mensagem
- `metadata`: Dados adicionais (JSON)
- `created_at`: Data/hora da mensagem

---

### 4. Tabela: `user_progress`

Rastreia o progresso de cada aluno por disciplina.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1, -- 1-10
  points INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  conversations_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject)
);

-- Índices
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_subject ON user_progress(subject);
```

**Campos:**
- `id`: Identificador único
- `user_id`: Referência ao usuário
- `subject`: Disciplina
- `level`: Nível de proficiência (1-10)
- `points`: Pontos acumulados
- `messages_count`: Total de mensagens
- `conversations_count`: Total de conversas
- `last_activity`: Última atividade
- `created_at`: Data de criação
- `updated_at`: Última atualização

---

### 5. Tabela: `flashcard_sets`

Armazena coleções de flashcards criadas pelos usuários.

```sql
CREATE TABLE flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT FALSE
);

-- Índices
CREATE INDEX idx_flashcard_sets_user_id ON flashcard_sets(user_id);
CREATE INDEX idx_flashcard_sets_subject ON flashcard_sets(subject);
```

---

### 6. Tabela: `flashcards`

Armazena cards individuais.

```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty VARCHAR(20), -- "fácil", "médio", "difícil"
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_flashcards_set_id ON flashcards(flashcard_set_id);
```

---

### 7. Tabela: `api_usage`

Rastreia uso da API Gemini para billing e análise.

```sql
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  tokens_input INTEGER,
  tokens_output INTEGER,
  total_tokens INTEGER,
  cost DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);
```

---

## Relacionamentos

### 1. Users → Conversations (1:N)
- Um usuário pode ter múltiplas conversas
- Quando um usuário é deletado, suas conversas são deletadas (CASCADE)

### 2. Conversations → Messages (1:N)
- Uma conversa contém múltiplas mensagens
- Quando uma conversa é deletada, suas mensagens são deletadas

### 3. Users → UserProgress (1:N)
- Um usuário tem um registro de progresso por disciplina
- Chave única em (user_id, subject)

### 4. Users → FlashcardSets (1:N)
- Um usuário pode criar múltiplos conjuntos de flashcards

### 5. FlashcardSets → Flashcards (1:N)
- Um conjunto contém múltiplos flashcards

---

## Índices e Performance

### Índices Criados

| Tabela | Campo | Tipo | Razão |
| :--- | :--- | :--- | :--- |
| users | email | UNIQUE | Busca rápida por email |
| conversations | user_id | INDEX | Listar conversas do usuário |
| conversations | subject | INDEX | Filtrar por disciplina |
| messages | conversation_id | INDEX | Buscar mensagens de uma conversa |
| user_progress | user_id | INDEX | Buscar progresso do usuário |
| api_usage | user_id | INDEX | Rastrear uso por usuário |

### Otimizações Recomendadas

1. **Particionamento de Mensagens:** Para milhões de mensagens, particionar por data
2. **Arquivamento:** Mover conversas antigas para tabela de arquivo
3. **Caching:** Usar Redis para dados frequentemente acessados
4. **Paginação:** Sempre usar LIMIT nas queries de listagem

---

## Implementação com Supabase

### Passo 1: Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **New Project**
3. Escolha um nome e região (próxima ao seu público)
4. Aguarde a criação

### Passo 2: Executar SQL

1. Vá para **SQL Editor**
2. Copie e cole o SQL das tabelas acima
3. Execute cada script

### Passo 3: Configurar Autenticação

1. Vá para **Authentication → Providers**
2. Ative **Email** e **Google**
3. Configure URLs de redirect

### Passo 4: Integrar no Frontend

```bash
npm install @supabase/supabase-js
```

Crie `client/src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Exemplo: Salvar conversa
export async function saveConversation(
  userId: string,
  subject: string,
  messages: any[]
) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      subject,
      message_count: messages.length,
      title: `${subject} - ${new Date().toLocaleDateString('pt-BR')}`
    });

  if (error) throw error;
  return data;
}
```

---

## Implementação com Firebase

### Passo 1: Criar Projeto Firebase

1. Acesse [firebase.google.com](https://firebase.google.com)
2. Clique em **Create Project**
3. Configure o projeto

### Passo 2: Estrutura de Coleções

```
firestore/
├── users/
│   ├── {userId}/
│   │   ├── email: string
│   │   ├── name: string
│   │   └── createdAt: timestamp
│
├── conversations/
│   ├── {conversationId}/
│   │   ├── userId: string
│   │   ├── subject: string
│   │   ├── messages: array
│   │   └── createdAt: timestamp
│
├── userProgress/
│   ├── {userId}/
│   │   ├── {subject}/
│   │   │   ├── level: number
│   │   │   ├── points: number
│   │   │   └── updatedAt: timestamp
```

### Passo 3: Integrar no Frontend

```bash
npm install firebase
```

Crie `client/src/lib/firebaseClient.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... outros campos
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## Migrações e Versionamento

### Estratégia de Versionamento

Mantenha um arquivo de histórico de migrações:

```
migrations/
├── 001_initial_schema.sql
├── 002_add_user_progress.sql
├── 003_add_api_usage.sql
└── 004_add_flashcards.sql
```

### Exemplo de Migração

```sql
-- migrations/002_add_user_progress.sql
-- Data: 2025-01-15
-- Descrição: Adiciona tabela de progresso do usuário

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

### Rollback

```sql
-- Rollback para 002
DROP TABLE user_progress;
```

---

## Segurança do Banco de Dados

### 1. Row Level Security (RLS) - Supabase

```sql
-- Apenas usuários podem ver suas próprias conversas
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 2. Validação de Dados

```typescript
// No backend
import { z } from 'zod';

const messageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  role: z.enum(['user', 'assistant'])
});
```

### 3. Rate Limiting

```typescript
// Limitar requisições por usuário
const rateLimit = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimit.get(userId) || [];
  const recentRequests = userRequests.filter(t => now - t < 60000);
  
  if (recentRequests.length > 30) return true; // 30 requisições por minuto
  
  recentRequests.push(now);
  rateLimit.set(userId, recentRequests);
  return false;
}
```

---

## Backup e Disaster Recovery

### Backup Automático

**Supabase:** Backups automáticos diários (plano pago)

**Firebase:** Backups automáticos habilitados por padrão

### Backup Manual

```bash
# Supabase - Exportar dados
pg_dump "postgresql://user:password@host:port/database" > backup.sql

# Firebase - Exportar via CLI
firebase firestore:export ./backup
```

---

## Checklist de Implementação

- [ ] Tabelas criadas no banco de dados
- [ ] Índices configurados
- [ ] Row Level Security ativado
- [ ] Autenticação integrada
- [ ] Frontend conectado ao banco
- [ ] Testes de leitura/escrita funcionando
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Documentação atualizada

---

## Próximos Passos

1. **Implementar Autenticação:** Integrar login de usuários
2. **Persistência de Dados:** Salvar conversas no banco
3. **Analytics:** Rastrear uso e progresso
4. **Relatórios:** Gerar insights sobre aprendizado
5. **Recomendações:** Sugerir tópicos com base no progresso

Consulte `GUIA_PRODUCAO.md` para detalhes sobre deploy da aplicação.
