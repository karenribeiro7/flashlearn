const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FlashLearn API",
      version: "1.0.0",
      description: "API REST para o aplicativo de estudos FlashLearn",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/docs/swagger.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Cadastra um novo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Joao Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuario cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Todos os campos são obrigatórios
 *       409:
 *         description: Email já cadastrado
 */
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza o login e retorna o token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Todos os campos são obrigatórios
 *       401:
 *         description: Email ou senha inválidos
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Token nao informado ou invalido
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Exatas
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Nome e obrigatorio
 *       401:
 *         description: Token nao informado ou invalido
 *       403:
 *         description: Acesso restrito a administradores
 *       409:
 *         description: Categoria ja cadastrada
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       400:
 *         description: Categoria possui baralhos vinculados
 *       401:
 *         description: Token nao informado ou invalido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Categoria nao encontrada
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     StudySession:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         deckId:
 *           type: integer
 *         durationSecs:
 *           type: integer
 *         totalCards:
 *           type: integer
 *         correctCards:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/study-sessions/start:
 *   post:
 *     summary: Inicia uma sessão de estudo e retorna os flashcards embaralhados
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deckId
 *             properties:
 *               deckId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Flashcards embaralhados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       question:
 *                         type: string
 *                       answer:
 *                         type: string
 *                       deckId:
 *                         type: integer
 *       400:
 *         description: deckId e obrigatório ou deck não possui flashcards
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Deck não encontrado
 */

/**
 * @swagger
 * /api/study-sessions/finish:
 *   post:
 *     summary: Finaliza uma sessao de estudo e registra os dados no banco
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deckId
 *               - durationSecs
 *               - totalCards
 *               - correctCards
 *             properties:
 *               deckId:
 *                 type: integer
 *                 example: 1
 *               durationSecs:
 *                 type: integer
 *                 example: 120
 *               totalCards:
 *                 type: integer
 *                 example: 10
 *               correctCards:
 *                 type: integer
 *                 example: 8
 *     responses:
 *       201:
 *         description: Sessao registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudySession'
 *       400:
 *         description: Todos os campos são obrigatórios
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Deck não encontrado
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lista categorias padrao e categorias do usuario autenticado
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Token nao informado ou invalido
 *   post:
 *     summary: Cria uma nova categoria vinculada ao usuario autenticado
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Direito Civil
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Nome e obrigatorio
 *       401:
 *         description: Token nao informado ou invalido
 *       409:
 *         description: Categoria ja existe
 */

/**
 * @swagger
 * /api/decks:
 *   post:
 *     summary: Cria um novo deck para o usuário autenticado
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Vocabulário inglês
 *               description:
 *                 type: string
 *                 example: Palavras do dia a dia
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Deck criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 userId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       400:
 *         description: Campos obrigatórios inválidos
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Categoria não encontrada
 */

/**
 * @swagger
 * /api/decks:
 *   get:
 *     summary: Lista decks do usuário autenticado
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de decks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                     nullable: true
 *                   userId:
 *                     type: integer
 *                   categoryId:
 *                     type: integer
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   _count:
 *                     type: object
 *                     properties:
 *                       flashcards:
 *                         type: integer
 *       401:
 *         description: Token não informado ou inválido
 */

/**
 * @swagger
 * /api/decks/{id}:
 *   put:
 *     summary: Atualiza um deck do usuário autenticado
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Deck atualizado
 *       400:
 *         description: id ou corpo inválido
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Deck ou categoria não encontrado
 *   delete:
 *     summary: Remove um deck do usuário autenticado (e flashcards/sessões associados)
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deck removido
 *       400:
 *         description: id inválido
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Deck não encontrado
 */

/**
 * @swagger
 * /api/decks/{deckId}/flashcards:
 *   get:
 *     summary: Lista flashcards de um deck do usuário autenticado
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   question:
 *                     type: string
 *                   answer:
 *                     type: string
 *                   deckId:
 *                     type: integer
 *       400:
 *         description: deckId inválido
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Deck não encontrado
 *   post:
 *     summary: Cria um flashcard em um deck do usuário autenticado
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 example: O que significa "hello"?
 *               answer:
 *                 type: string
 *                 example: Olá
 *     responses:
 *       201:
 *         description: Flashcard criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *                 deckId:
 *                   type: integer
 *       400:
 *         description: deckId ou corpo inválido
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Deck não encontrado
 */