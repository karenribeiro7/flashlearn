# FlashLearn - Aplicativo de Estudos com Flashcards

Autores: Karen Ribeiro, Liana Carvalho e Rodrigo Sena

## 1. Visão Geral
O FlashLearn é uma solução completa (API REST e aplicativo mobile) desenvolvida para auxiliar estudantes na organização e revisão ativa de conteúdos. Através do método de flashcards, o usuário pode criar materiais personalizados, realizar sessões de estudo cronometradas e acompanhar sua evolução por meio de estatísticas detalhadas.

## 2. Principais Funcionalidades
- Autenticação Segura: Cadastro e login utilizando tokens JWT e criptografia de senha com bcrypt.
- Gestão de Baralhos e Flashcards: Criação, edição e exclusão de coleções de cartões organizados por categorias.
- Categorias Globais: Organização por áreas de conhecimento (Exatas, Humanas, etc.), gerenciadas por administradores.
- Sessão de Estudo Ativa: Modo de estudo com cronômetro, embaralhamento de cartas e repetição de itens errados.
- Estatísticas de Desempenho: Visualização de horas estudadas, taxa de acerto geral e desempenho específico por baralho.

## 3. Tecnologias Utilizadas

### Backend
- Node.js e Express (Framework da API)
- Prisma ORM e SQLite (Banco de dados)
- JWT e Bcryptjs (Segurança)
- Swagger (Documentação da API)

### Mobile (App)
- React Native e Expo
- React Navigation (Navegação)
- Axios (Comunicação HTTP)
- AsyncStorage (Persistência de login)
- Animated API (Animações de interface)

## 4. Configuração do Ambiente (.env)
Antes de iniciar, é necessário criar os arquivos .env manualmente:

- No diretório /flashlearn-api:

DATABASE_URL="file:./dev.db"

JWT_SECRET="618062a4a235cb801b25b06a1e340d6bd064f29953f8c8175d3693c753f79e55"

IP_ADDRESS="SEU_IP_AQUI"

- No diretório /flashlearn-app:

API_URL=http://SEU_IP_AQUI:3000/api

## 5. Instruções de Instalação e Execução

### Rodando o Backend
1. Acesse a pasta: cd flashlearn-api
2. Instale as dependências:
   npm install express prisma @prisma/client jsonwebtoken bcryptjs cors swagger-ui-express swagger-jsdoc
3. Instale o nodemon: npm install nodemon --save-dev
4. Configure o banco de dados:
   npx prisma init --datasource-provider sqlite
   npx prisma migrate dev --name init
5. Inicie o servidor: npm run dev

### Rodando o Aplicativo (Mobile)
1. Acesse a pasta: cd flashlearn-app
2. Instale o Expo: npm install expo
3. Instale as dependências de navegação e armazenamento:
   npx expo install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-async-storage/async-storage
4. Instale bibliotecas adicionais:
   npm install axios jwt-decode react-native-dotenv
   npx expo install babel-preset-expo react-dom react-native-web
5. Inicie o projeto: npx expo start --clear

## 6. Regras de Negócio Importantes
- Segurança: Um usuário nunca pode acessar baralhos de terceiros.
- Estudo: Uma sessão só pode começar se o baralho tiver ao menos um card e só termina quando todos forem acertados.
- Integridade: Ao deletar um baralho, todos os seus cards e sessões são apagados (deleção em cascata).
```
