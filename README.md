# AdoteUmPet - Plataforma para gerenciar pets para adoção e consultar informações de raças.

**Status:** Funcional com endereçamento brasileiro

Sistema completo para gerenciamento de adoção de animais com backend Node.js + Express, frontend React e integração com padrão brasileiro de endereçamento (CEP).

---

## Visão Geral
Sistema completo para gerenciamento de pets com CRUD, filtros, paginação, ordenação e integração com TheDogAPI/TheCatAPI. **Agora com endereçamento brasileiro (CEP) e integração automática com ViaCEP!**

---

## Funcionalidades

### Já implementadas

**API Backend:**
- Endpoint de health check (`/health`) para monitoramento
- **POST /pets**: Cadastro de novos pets com validação completa dos dados
- **GET /pets**: Listagem de pets com sistema de filtros, paginação e ordenação
- **GET /pets/:id**: Busca de pet específico por ID
- **GET /breeds/:species**: Consulta de informações de raças via APIs externas com normalização inteligente
- **PUT /pets/:id**: Atualização de dados de pets existentes
- **DELETE /pets/:id**: Remoção de pets existentes

**Gerenciamento de dados:**
- Integração completa com PostgreSQL usando Sequelize ORM
- Sistema de status para pets (`available` / `adopted`)
- **Endereçamento brasileiro completo**: CEP, rua, número, bairro, cidade, estado
- **Integração automática com ViaCEP**: Preenchimento automático de endereço via CEP
- Validação robusta de campos obrigatórios e opcionais
- Cache em memória para consultas de raças (1 hora de duração)
- **Normalização inteligente de dados de raças**: Mapeamento automático de origem e nível de energia

**Sistema de filtros e busca:**
- Busca por nome do pet (busca parcial)
- Filtro por espécie (cão ou gato)
- Filtro por raça (busca parcial)
- Filtro por cidade do abrigo (busca parcial)
- Filtro por estado (busca parcial)
- Filtro por bairro (busca parcial)
- Filtro por status de adoção
- Paginação configurável (padrão: 10 itens por página, máximo: 100)
- Ordenação por diferentes campos (crescente/decrescente)

**Frontend React:**
- Interface completa desenvolvida com Vite e Tailwind CSS
- Páginas: Lista de Pets, Cadastro de Pet, Detalhes do Pet, Consulta de Raças
- **Formulário brasileiro:** Campos de CEP, rua, número, bairro, cidade, estado no lugar de latitude e longitude
- **Preenchimento automático:** Integração com ViaCEP para busca por CEP
- **Exibição de endereço**: Lista e detalhes mostram endereço completo formatado
- **Mapa interativo**: Visualização da localização dos abrigos com Leaflet
- Componentes reutilizáveis: Navbar, Loader, ErrorMessage
- Navegação com React Router
- Integração com a API via axios

**Sistema de dados:**
- **Seeds idempotentes**: Script automatizado para popular banco com dados CSV
- **Dados de exemplo**: 15 pets de diferentes cidades brasileiras
- **Upsert seguro**: Importação que pode ser executada múltiplas vezes

### Próximas melhorias
- **Testes automatizados**: Backend e frontend com cobertura > 60% e relatórios
- **Cache de filtros**: Sistema de cache para consultas de pets com filtros
- **Docker Compose**: Containerização completa (API + PostgreSQL + Adminer/PgAdmin)
- **CI/CD Pipeline**: Integração contínua com lint e testes automatizados
- **Swagger/OpenAPI**: Documentação interativa da API

---

## Tecnologias Utilizadas

**Backend:**
- Node.js (versão 16 ou superior)
- Express.js para criação da API REST
- PostgreSQL (versão 12 ou superior) como banco de dados
- Sequelize ORM para interação com o banco

**Frontend:**
- React com Vite para desenvolvimento rápido
- Tailwind CSS para estilização
- React Router para navegação
- Axios para comunicação com a API

**Ferramentas e bibliotecas:**
- Helmet e CORS para segurança da API
- Morgan para logging de requisições
- dotenv para gerenciamento de variáveis de ambiente
- Nodemon para desenvolvimento  
- Sequelize CLI para migrations e seeders
- **csv-parser** para processamento de arquivos CSV
- **ViaCEP API** para consulta automática de endereços brasileiros

---

## Decisões Arquiteturais

O projeto foi estruturado seguindo boas práticas de desenvolvimento:

- **Separação em camadas**: controllers, models, routes e utils para melhor organização
- **PostgreSQL com Sequelize**: escolhido pela robustez e facilidade de manutenção
- **UUID como chave primária**: garante identificadores únicos e seguros
- **Migrations e Seeders**: permitem versionamento e replicação do banco de dados
- **Endereçamento brasileiro**: Migração de coordenadas para padrão nacional (CEP)
- **Integração com APIs nacionais**: ViaCEP para validação e preenchimento automático
- **Configuração flexível**: suporte tanto para desenvolvimento quanto para produção

---

## Histórico de Desenvolvimento

Durante o desenvolvimento, o projeto passou por várias etapas bem definidas:

### 1. Configuração Inicial
Configurei a base do projeto com Node.js e Express, integrei o PostgreSQL usando Sequelize e adicionei os middlewares essenciais (Helmet, CORS, Morgan). Também criei os scripts npm necessários e configurei as variáveis de ambiente.

### 2. Modelagem do Banco de Dados
Desenvolvi o modelo `Pet` no Sequelize e criei a migration correspondente. Tive que resolver alguns desafios técnicos relacionados à configuração do dialect do PostgreSQL e à função `uuid_generate_v4()`.

### 3. Conexão e Configuração do Banco
Implementei a configuração de conexão com o banco através do arquivo `database.js` e organizei a inicialização dos modelos. Realizei testes para garantir que a conexão estava funcionando corretamente.

### 4. Endpoints da API
Implementei progressivamente os endpoints principais:
- **POST /pets**: Para cadastrar novos pets com validação completa
- **GET /pets**: Para listar pets com sistema de filtros, paginação e ordenação
- **GET /pets/:id**: Para buscar pets específicos por ID
- **GET /breeds/:species**: Para consultar informações de raças

### 5. Frontend React
Desenvolvi uma interface completa usando React, Vite e Tailwind CSS, com páginas para listagem, cadastro e detalhes dos pets, além da consulta de raças.

Todos os endpoints foram testados extensivamente usando Postman para garantir o funcionamento correto em diferentes cenários.

### 6. Normalização Inteligente de APIs Externas
Implementei um sistema robusto de normalização para as APIs de raças (TheDogAPI/TheCatAPI) que resolve inconsistências nos dados:

**Mapeamento de Origem:**
- Prioridade 1: Campo `origin` da API
- Prioridade 2: Campo `country_code` quando disponível  
- Prioridade 3: Análise inteligente do nome da raça (ex: "Afghan" → Afeganistão, "Akita" → Japão)

**Nível de Energia:**
- Para gatos: Usa o campo `energy_level` nativo da API
- Para cães: Mapeia o campo `temperament` para níveis de energia:
  - Temperamentos ativos/brincalhões → nível 5 (alta energia)
  - Temperamentos calmos/dóceis → nível 2 (baixa energia)
  - Temperamentos alertas/inteligentes → nível 4 (média-alta energia)
  - Padrão → nível 3 (energia média)

Essa normalização garante que ambas as APIs retornem dados consistentes e completos.

---

## Estrutura do Projeto
```
AdoteUmPet/
├── backend/                    # Backend API (Node.js + Express)
│   ├── config/
│   │   └── config.js          # Configuração do Sequelize CLI
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Configuração do banco de dados
│   │   ├── controllers/       # Controladores da API
│   │   │   ├── index.js
│   │   │   └── petController.js # Controller de pets (GET, POST)
│   │   ├── models/            # Modelos Sequelize
│   │   │   ├── index.js
│   │   │   └── pet.js
│   │   ├── routes/            # Rotas da API
│   │   │   ├── index.js
│   │   │   └── petRoutes.js   # Rotas de pets (/pets)
│   │   ├── utils/             # Funções utilitárias
│   │   ├── migrations/        # Migrações do banco
│   │   ├── seeders/           # Seeders do banco
│   │   └── index.js           # Ponto de entrada da aplicação
│   ├── .env.example           # Variáveis de ambiente
│   ├── package.json           # Dependências do backend
│   └── .sequelizerc           # Configuração do Sequelize CLI
├── .gitignore                 # Arquivos ignorados pelo Git
└── README.md                  # Documentação do projeto
```

---

## Como Executar o Projeto

### Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- Git

### Passo a Passo da Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd AdoteUmPet
```

2. **Configure o backend:**
```bash
cd backend
npm install
cp .env.example .env
```

3. **Configure as variáveis de ambiente:**
Edite o arquivo `.env` e preencha as informações necessárias:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/adote_um_pet
DOG_API_KEY=sua_chave_da_dog_api
CAT_API_KEY=sua_chave_da_cat_api
PORT=3000
```

4. **Configure o banco de dados:**
```bash
# Crie o banco de dados
createdb adote_um_pet

# Execute as migrations
npm run migrate

# Execute as seeds (opcional)
npm run seed
```
5. **Inicie o servidor:**
```bash
# Para desenvolvimento 
npm run dev

# Para produção
npm start
```

6. **Configure o frontend (em outro terminal):**
```bash
cd frontend
npm install
npm run dev
```

O backend estará rodando em `http://localhost:3000` e o frontend em `http://localhost:5173`.

---

## Endpoints da API

### Health
- `GET /health` → Retorna status da API

### Pets
- `GET /pets` → Lista pets com filtros, paginação e ordenação
  - Query params: `name`, `species`, `breed`, `shelter_city`, `shelter_state`, `shelter_neighborhood`, `status`, `page`, `perPage`, `sortBy`, `order`
  - Resposta: `{ total, page, perPage, totalPages, data }`
- `GET /pets/:id` → Busca pet por ID
  - Params: `id` (UUID do pet)
  - Resposta: 200 com dados do pet ou 404 se não encontrado
- `POST /pets` → Cria novo pet
  - Body: `{ name, species, breed, age_years, shelter_city, shelter_cep, shelter_street, shelter_number, shelter_neighborhood, shelter_state, status? }`
  - **🇧🇷 Endereçamento brasileiro completo**
  - Validação completa de campos
  - Resposta: 201 com pet criado ou 400 com erros
- `PUT /pets/:id` → Atualiza pet existente (suporte a atualizações parciais)
- `DELETE /pets/:id` → Remove pet do sistema

### Breeds
- `GET /breeds/:species` → Lista raças do TheDogAPI/TheCatAPI com normalização inteligente
  - **Normalização de origem**: Múltiplos fallbacks (origin → country_code → análise do nome)
  - **Nível de energia**: Mapeamento baseado no temperamento da raça
  - **Cache**: 1 hora de duração para otimizar performance
  - **Resposta padronizada**: `{ name, origin, energy_level, temperament, image_url }`

---

## Modelo de Dados – Pets
| Campo                 | Tipo          | Descrição           |
|-----------------------|---------------|-----------          |
| id                    | UUID (PK)     | Identificador único |
| name                  | STRING        | Nome do pet         |
| species               | ENUM          | dog / cat           |
| breed                 | STRING        | Raça                |
| age_years             | INTEGER       | Idade               |
| shelter_city          | STRING        | Cidade do abrigo    |
| shelter_cep           | STRING(9)     | CEP do abrigo       |
| shelter_street*       | STRING(255)   | Rua do abrigo       |
| shelter_number        | STRING(20)    | Número do abrigo    |
| shelter_neighborhood  | STRING(100)   | Bairro do abrigo    |
| shelter_state         | STRING(2)     | Estado do abrigo(UF)|
| status                | ENUM          | available/adopted   |
| created_at            | TIMESTAMP     | Data de criação     |
| updated_at            | TIMESTAMP     | Data de atualização |

> **🇧🇷 Migração realizada**: Campos de latitude/longitude foram substituídos por endereçamento brasileiro completo

---

## Fluxo de Dados
1. Requisição chega na rota em `routes/`.  
2. Rota chama o controller correspondente (`controllers/`).  
3. Controller interage com o modelo Sequelize (`models/`).  
4. Resultado retorna ao cliente via JSON.  
5. Middlewares de logging, segurança e validação interceptam requisições conforme necessário.

---

## Variáveis de Ambiente
| Variável     | Descrição |
|--------------|-----------|
| DATABASE_URL | String de conexão com PostgreSQL |
| PORT         | Porta do servidor |
| NODE_ENV     | Ambiente de execução (development/production) |
| DOG_API_KEY  | Chave API externa para cães |
| CAT_API_KEY  | Chave API externa para gatos |
| JWT_SECRET   | Chave para autenticação futura |
| CORS_ORIGIN  | Origem permitida para CORS |

---

## Scripts Disponíveis

No diretório `backend/`, você pode executar:

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot reload
- `npm start` - Inicia o servidor em modo de produção
- `npm run migrate` - Executa as migrations do banco de dados
- `npm run seed` - Executa script idempotente para popular banco com dados CSV
- `npm run seed:sequelize` - Executa os seeders tradicionais do Sequelize

---

## Uso de IA

Durante o desenvolvimento deste projeto, utilizei ferramentas de inteligência artificial (como ChatGPT, gemini) para acelerar algumas etapas do desenvolvimento, principalmente para:

- Geração de código boilerplate inicial
- Sugestões de estrutura de arquivos e organização
- Auxílio na documentação e comentários
- Resolução de problemas técnicos específicos

É importante destacar que todo o código gerado foi cuidadosamente revisado, adaptado às necessidades específicas do projeto e testado manualmente. As decisões arquiteturais e a lógica de negócio foram desenvolvidas com base no meu entendimento dos requisitos e boas práticas de desenvolvimento.
O uso dessas ferramentas serviu como um acelerador do processo de desenvolvimento, mas não substituiu o trabalho de análise, teste e refinamento que realizei em cada funcionalidade implementada.

---

## Licença

MIT License
