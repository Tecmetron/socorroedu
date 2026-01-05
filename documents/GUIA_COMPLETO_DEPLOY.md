# 📘 Guia Completo de Deploy: Projeto SocorroEdu com Render.com

**Autor:** Manus AI  
**Data:** 05 de Janeiro de 2026  
**Versão do Guia:** 1.0

---

## Introdução

Este documento fornece um guia passo a passo, extremamente detalhado, para realizar o deploy da aplicação **SocorroEdu** em um ambiente de produção utilizando a plataforma [Render.com](https://render.com). O guia abrange desde a preparação inicial do código e sua publicação em um repositório GitHub até a configuração completa do serviço no Render, incluindo a gestão de variáveis de ambiente, monitoramento e resolução de problemas comuns.

O objetivo é capacitar qualquer pessoa com conhecimentos básicos de Git e desenvolvimento web a publicar a aplicação de forma segura, eficiente e automatizada.

### Stack Tecnológico do Projeto

| Categoria | Tecnologia | Versão | Propósito |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 19.2.1 | Biblioteca para construção da interface de usuário |
| **Linguagem** | TypeScript | 5.6.3 | Superset do JavaScript com tipagem estática |
| **Build Tool** | Vite | 7.1.7 | Ferramenta de build e servidor de desenvolvimento |
| **Estilização** | Tailwind CSS | 4.1.14 | Framework de CSS utility-first |
| **Backend** | Node.js + Express | 20.x + 4.21.2 | Ambiente de execução e framework para o servidor |
| **Gerenciador de Pacotes** | pnpm | 10.4.1 | Gerenciador de pacotes rápido e eficiente |

---

## Parte 1: Preparação do Projeto e Publicação no GitHub

A primeira fase consiste em garantir que o projeto esteja seguro, bem documentado e corretamente estruturado para ser publicado em um repositório público no GitHub.

### 1.1. Revisão das Alterações Estruturais

Antes da publicação, foram realizadas as seguintes alterações críticas para adequar o projeto às boas práticas de produção:

1.  **Remoção de Chaves de API:** A chave da API do Google Gemini, que estava *hardcoded* (fixa no código) no arquivo `client/src/lib/geminiClient.ts`, foi removida e substituída por um sistema de variáveis de ambiente. Isso previne a exposição de credenciais sensíveis.

2.  **Criação de `.env.example`:** Um arquivo de exemplo para as variáveis de ambiente foi criado para documentar quais chaves são necessárias para o funcionamento do projeto.

3.  **Criação de Documentação:** Foram criados os seguintes arquivos para garantir a clareza e a manutenibilidade do projeto:
    *   `README.md`: Documentação principal com visão geral, instruções de instalação e uso.
    *   `LICENSE`: Licença MIT, definindo os termos de uso do código.
    *   `CONTRIBUTING.md`: Diretrizes para futuros contribuidores.
    *   `CHANGELOG.md`: Registro de todas as alterações realizadas.

4.  **Ajuste do `.gitignore`:** O arquivo foi aprimorado para garantir que nenhum arquivo sensível ou desnecessário (como `.env.local`) seja enviado para o repositório.

### 1.2. Criando o Repositório no GitHub

Siga os passos abaixo para criar um novo repositório e enviar o código do projeto.

1.  **Acesse o GitHub:** Faça login na sua conta e vá para [github.com/new](https://github.com/new).

2.  **Preencha os Detalhes do Repositório:**
    *   **Repository name:** `socorroedu`
    *   **Description:** `Plataforma inteligente de reforço escolar com integração de IA via Google Gemini.`
    *   **Visibility:** `Public`
    *   **NÃO** marque a opção "Add a README file", pois o projeto já possui um.

3.  **Clique em "Create repository".**

### 1.3. Enviando o Código para o Repositório

Abra um terminal na pasta raiz do projeto `socorroedu` e execute os seguintes comandos na ordem especificada.

```bash
# 1. Inicializa um novo repositório Git local
git init -b main

# 2. Adiciona todos os arquivos do projeto ao staging
git add .

# 3. Cria o primeiro commit com uma mensagem descritiva
git commit -m "feat: Initial commit of SocorroEdu MVP"

# 4. Adiciona o repositório remoto do GitHub (substitua 'seu-usuario')
git remote add origin https://github.com/seu-usuario/socorroedu.git

# 5. Envia o código da branch 'main' para o GitHub
git push -u origin main
```

Ao final desses passos, o código do projeto estará seguro e disponível no seu repositório público no GitHub.

---

## Parte 2: Configuração do Projeto no Render.com

Com o código no GitHub, o próximo passo é configurar a plataforma de deploy, o Render.com.

### 2.1. Criando uma Conta no Render

1.  Acesse [dashboard.render.com/register](https://dashboard.render.com/register).
2.  É altamente recomendável se inscrever utilizando sua conta do GitHub. Clique em **"Sign up with GitHub"** e autorize o acesso do Render aos seus repositórios. Isso simplificará enormemente o processo de deploy.

### 2.2. Criando um Novo Serviço Web

O SocorroEdu é composto por um frontend (React) e um backend (Express), portanto, deve ser publicado como um **Web Service**.

1.  No painel do Render, clique no botão **New +** e selecione **Web Service**.

    ![New Web Service](https://i.imgur.com/your-image-url.png) <!-- Placeholder for image -->

2.  Na tela seguinte, conecte seu repositório GitHub. Se você se inscreveu com o GitHub, seus repositórios já estarão listados. Encontre o repositório `socorroedu` e clique em **Connect**.

### 2.3. Configurando os Detalhes do Serviço

Preencha os campos de configuração conforme a tabela abaixo. O Render pode preencher alguns deles automaticamente, mas é crucial verificar se estão corretos.

| Campo | Valor Sugerido | Descrição |
| :--- | :--- | :--- |
| **Name** | `socorroedu` | O nome da sua aplicação. Será parte da URL pública. |
| **Region** | `São Paulo (South America)` | Escolha a região mais próxima dos seus usuários para menor latência. |
| **Branch** | `main` | A branch do GitHub que o Render irá monitorar para deploys automáticos. |
| **Runtime** | `Node` | O Render detectará automaticamente o ambiente Node.js. |
| **Build Command** | `pnpm install && pnpm build` | Comando para instalar dependências e compilar o projeto. |
| **Start Command** | `pnpm start` | Comando para iniciar o servidor em produção após o build. |
| **Instance Type** | `Free` | O plano gratuito é suficiente para começar e suporta a aplicação. |

**Importante:** O Render detecta o uso de `pnpm` através do arquivo `pnpm-lock.yaml` e o instala automaticamente. Os comandos de build e start são lidos do arquivo `render.yaml` que já está no projeto, mas é bom confirmá-los.

---

## Parte 3: Configuração de Variáveis de Ambiente

Esta é a etapa de segurança mais importante. Aqui você informará ao Render a sua chave de API do Google Gemini sem expô-la no código.

1.  Ainda na página de configuração do serviço, role para baixo até a seção **Environment**.

2.  Clique em **Add Environment Variable** e adicione as seguintes variáveis:

| Chave (Key) | Valor (Value) | Observação |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Informa ao Node.js que a aplicação está em modo de produção. |
| `VITE_GEMINI_API_KEY` | `sua_chave_secreta_aqui` | **Substitua pela sua chave de API do Google Gemini.** |
| `VITE_GEMINI_API_URL` | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` | URL da API do Gemini. |

**Atenção:** As variáveis que começam com `VITE_` são especiais. O Vite as injeta no código do frontend durante o processo de build. É fundamental que a chave `VITE_GEMINI_API_KEY` esteja correta, ou a aplicação não conseguirá se comunicar com a IA.

---

## Parte 4: Realizando o Primeiro Deploy

Após preencher todas as configurações, você está pronto para o primeiro deploy.

1.  Role até o final da página e clique em **Create Web Service**.

2.  O Render iniciará o processo de deploy imediatamente. Você será redirecionado para o painel do seu novo serviço, onde poderá acompanhar o progresso em tempo real na aba **Logs**.

O processo de build seguirá os seguintes passos:

```log
==> Cloning repository...
==> Using Node.js version 20.11.1
==> Running build command 'pnpm install && pnpm build'...
...
> vite build && esbuild server/index.ts ...
...
==> Uploading build...
==> Build successful
==> Deploying...
==> Starting service with 'pnpm start'
> NODE_ENV=production node dist/index.js
Server running on http://localhost:10000/
==> Your service is live
```

Quando você vir a mensagem **"Your service is live"**, o deploy foi concluído com sucesso.

---

## Parte 5: Verificando o Sucesso do Deploy

1.  **Acesse a URL:** No topo do painel do serviço, o Render exibe a URL pública da sua aplicação (ex: `https://socorroedu.onrender.com`). Clique nela para abrir o site.

2.  **Teste as Funcionalidades:**
    *   Verifique se a página inicial carrega corretamente.
    *   Selecione uma disciplina.
    *   Envie uma pergunta no chat e confirme se a IA responde.
    *   Teste o botão de limpar o histórico.

3.  **Verifique o Console do Navegador:**
    *   Pressione `F12` (ou `Cmd+Opt+I` no Mac) para abrir as Ferramentas de Desenvolvedor.
    *   Vá para a aba **Console** e verifique se não há erros em vermelho. Avisos (em amarelo) são geralmente aceitáveis, mas erros indicam problemas.

---

## Parte 6: Resolvendo Erros Comuns (Troubleshooting)

| Erro Comum | Causa Provável | Solução |
| :--- | :--- | :--- |
| **Build Falha** | Dependência faltando ou erro de sintaxe. | Verifique os logs de build no Render para identificar o erro exato. Teste o comando `pnpm build` localmente. |
| **Aplicação não Inicia (Application failed to start)** | O `startCommand` está incorreto ou o servidor tem um erro. | Verifique o `startCommand` nas configurações do Render. Verifique os logs para ver a mensagem de erro do Node.js. |
| **"Cannot find module 'express'"** | O arquivo `pnpm-lock.yaml` não foi enviado para o GitHub. | Certifique-se de que `pnpm-lock.yaml` está no seu repositório e faça push. O Render usa este arquivo para instalar as dependências exatas. |
| **Página em Branco ou Erro 404** | O servidor Express não está servindo os arquivos estáticos corretamente. | Verifique o `server/index.ts` e o `vite.config.ts` para garantir que os caminhos de build (`dist/public`) estão corretos. |
| **Chat não responde (Erro de API)** | A variável de ambiente `VITE_GEMINI_API_KEY` está incorreta ou não foi definida. | Vá para a aba **Environment** no Render, verifique se a chave está correta e clique em **"Save Changes"**. Um novo deploy será iniciado. |

---

## Parte 7: Atualizando o Projeto (Redeploy)

Graças à integração com o GitHub, atualizar sua aplicação é um processo automático.

1.  **Faça Alterações no Código:** Modifique o código localmente na sua máquina.

2.  **Faça Commit e Push:** Envie as alterações para a branch `main` do seu repositório no GitHub.

    ```bash
    git add .
    git commit -m "feat: Adiciona nova funcionalidade X"
    git push origin main
    ```

3.  **Deploy Automático:** O Render detectará o `push` na branch `main` e iniciará um novo processo de deploy automaticamente, utilizando as mesmas configurações. Você pode acompanhar o progresso na aba **Events** do seu serviço.

Após alguns minutos, as alterações estarão no ar.

---

## Conclusão

Parabéns! Seguindo este guia, você publicou com sucesso a aplicação SocorroEdu em um ambiente de produção robusto, seguro e escalável. Você configurou um fluxo de trabalho de deploy contínuo (CI/CD) que automatiza a publicação de futuras atualizações, permitindo que você se concentre no que mais importa: desenvolver novas funcionalidades para o projeto.

Para os próximos passos, considere explorar os guias `GUIA_PRODUCAO.md` e `GUIA_BANCO_DADOS.md` no repositório para implementar funcionalidades avançadas como autenticação de usuários e persistência de dados.
