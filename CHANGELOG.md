# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-05

### Added
- ✅ MVP inicial do SocorroEdu com integração Google Gemini API
- ✅ Interface de chat intuitiva com histórico de conversas
- ✅ Suporte a 6 disciplinas (Matemática, Português, Ciências, História, Geografia, Inglês)
- ✅ Design responsivo com Tailwind CSS
- ✅ Componentes acessíveis com Radix UI
- ✅ TypeScript para segurança de tipos
- ✅ Vite para build otimizado
- ✅ Express server para servir aplicação
- ✅ Documentação completa (GUIA_PRODUCAO.md, GUIA_BANCO_DADOS.md)
- ✅ Variáveis de ambiente para configuração segura
- ✅ README.md com instruções de setup
- ✅ LICENSE MIT
- ✅ CONTRIBUTING.md para contribuições

### Changed
- Movido chave de API Gemini para variáveis de ambiente
- Padronizado nome do projeto para "socorroedu"
- Melhorado package.json com metadados completos

### Security
- Protegida chave de API com variáveis de ambiente
- Adicionado .env.example com instruções
- Configurado .gitignore para não versionarr dados sensíveis

---

## Planejado para Futuras Versões

### v1.1.0 (Próximo)
- [ ] Autenticação de usuários (Firebase/Supabase)
- [ ] Persistência de conversas em banco de dados
- [ ] Histórico de progresso do aluno
- [ ] Sistema de avaliações

### v1.2.0
- [ ] Testes automatizados (Vitest)
- [ ] CI/CD com GitHub Actions
- [ ] Integração com mais modelos de IA
- [ ] Modo dark/light theme

### v2.0.0
- [ ] Aplicativo mobile (React Native)
- [ ] PWA (Progressive Web App)
- [ ] Suporte offline
- [ ] Integração com LMS (Learning Management System)

---

## Como Reportar Mudanças

Para adicionar uma mudança a este changelog:

1. Edite este arquivo
2. Adicione a mudança na seção apropriada
3. Inclua um link para a issue/PR relacionada
4. Faça commit com mensagem: `Docs: atualizar CHANGELOG`

## Formato de Entrada

```markdown
### Added
- Nova funcionalidade ([#123](link))

### Changed
- Mudança em funcionalidade existente ([#124](link))

### Deprecated
- Funcionalidade que será removida em breve

### Removed
- Funcionalidade removida

### Fixed
- Correção de bug ([#125](link))

### Security
- Correção de segurança ([#126](link))
```

---

**Última atualização:** 05 de Janeiro de 2025
