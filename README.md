# AdoteUmPet - Plataforma para gerenciar pets para adoção e consultar informações de raças.

**Status:** Em desenvolvimento

Backend API construída em Node.js + Express para gerenciamento de adoção de animais, utilizando PostgreSQL e Sequelize ORM.

---

## Visão Geral
API para gerenciamento de pets com CRUD completo, filtros, paginação, ordenação e integração com TheDogAPI/TheCatAPI para informações de raças.

---

## Funcionalidades

### Implementadas
- Health check (`/health`)  
- CRUD completo de pets (via Sequelize)  
- Integração com PostgreSQL  
- Status de pets (`available` / `adopted`)  
- Localização por cidade e coordenada(`shelter_city` , `shelter_lat` , `shelter_lng`) 
- Tabela `pets` com campos: `id (UUID)`, `name`, `species (dog|cat)`, `breed`, `age_years`, `shelter_city`, `shelter_lat`, `shelter_lng`, `status`, `created_at`, `updated_at`

### Em andamento
- **POST /pets**: validação de campos, inserção no banco e retorno de 201 ou 400  
- **GET /pets**: filtros, paginação e ordenação usando query params (`name`, `species`, `breed`, `shelter_city`, `status`, `page`, `perPage`, `sortBy`, `order`)  
- **GET /pets/:id**: busca por ID, retorna 404 se não encontrado  
- **GET /breeds/:species**: integração com TheDogAPI/TheCatAPI, cache em memória de 1 hora, normalização de resposta `{ name, origin, energy_level, image_url }`

---

## Stack Tecnológico
- Node.js (>=16)  
- Express.js  
- PostgreSQL (>=12)  
- Sequelize ORM  
- Helmet e CORS para segurança  
- Morgan para logging  
- dotenv para gerenciamento de variáveis de ambiente  
- Nodemon para desenvolvimento  
- Sequelize CLI para migrations e seeders

---

## Arquitetura e Decisões
- Separação em camadas: controllers, models, routes e utils.  
- Uso de PostgreSQL com Sequelize para consistência e integridade.  
- UUID como chave primária para garantir unicidade.  
- Migrations e Seeders para replicação e versionamento do banco.  
- Configuração do Sequelize via `database.js` e compatibilidade com Sequelize CLI (`config/config.js` e `.sequelizerc`).

---

## Etapas do Desenvolvimento Concluidas

### Etapa 1 – Esqueleto do Projeto
- Node.js + Express, PostgreSQL com Sequelize.  
- Middlewares: Helmet, CORS, Morgan.  
- Scripts: `dev`, `start`, `migrate`, `seed`.  
- `.env` configurado com `DATABASE_URL`, `DOG_API_KEY` e `CAT_API_KEY`.  
- Teste do servidor com `npm run dev` retornando status OK.

### Etapa 2 – Modelo Sequelize e Migração Pet
- Criação do modelo `Pet` e migration.  
- Resolução de erros: `dialect needs to be explicitly supplied` e `uuid_generate_v4()`.  
- Migration executada com sucesso.

### Etapa 3 – Conexão com o Banco de Dados
- `src/config/database.js`: exporta Sequelize via `DATABASE_URL`.  
- `src/models/index.js`: inicializa Sequelize, importa `Pet` e exporta instância.  
- Testes de conexão realizados com sucesso.


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
│   │   ├── models/            # Modelos Sequelize
│   │   │   ├── index.js
│   │   │   └── pet.js
│   │   ├── routes/            # Rotas da API
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

## Configuração e Execução

### Pré-requisitos
- Node.js >=16  
- PostgreSQL >=12

### Instalação
```bash
git clone <repository-url>
cd AdoteUmPet
cd backend
npm install
cp .env.example .env
```

### Banco de Dados
```bash
createdb adote_um_pet
npm run migrate
npm run seed
```

### Rodando o servidor
```bash
# Dentro do diretório backend/
npm run dev
npm start
```

---

## Endpoints da API

### Health
- `GET /health` → Retorna status da API

### Pets
- `GET /api/pets` → Lista todos os pets  
- `GET /api/pets/:id` → Detalhes do pet  
- `POST /api/pets` → Cria novo pet  
- `PUT /api/pets/:id` → Atualiza pet  
- `DELETE /api/pets/:id` → Remove pet

### Breeds
- `GET /breeds/:species` → Lista raças do TheDogAPI/TheCatAPI, resposta normalizada, cache 1 hora

---

## Modelo de Dados – Pets
| Campo        | Tipo           | Descrição |
|--------------|---------------|-----------|
| id           | UUID (PK)     | Identificador único |
| name         | STRING        | Nome do pet |
| species      | ENUM          | dog / cat |
| breed        | STRING        | Raça |
| age_years    | INTEGER       | Idade |
| shelter_city | STRING        | Cidade do abrigo |
| shelter_lat  | DECIMAL(10,7) | Latitude |
| shelter_lng  | DECIMAL(10,7) | Longitude |
| status       | ENUM          | available/adopted |
| created_at   | TIMESTAMP     | Data de criação |
| updated_at   | TIMESTAMP     | Data de atualização |

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

## Scripts de Desenvolvimento
```bash
npm run dev      # Servidor em desenvolvimento
npm start        # Servidor em produção
npm run migrate  # Executa migrations
npm run seed     # Executa seeders
```

---

## Licença
MIT License

