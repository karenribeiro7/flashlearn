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