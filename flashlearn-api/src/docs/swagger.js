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
 *         description: Todos os campos sao obrigatorios
 *       409:
 *         description: Email ja cadastrado
 */