const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const deckRoutes = require("./routes/deckRoutes");
const studyStatsRoutes = require("./routes/studyStatsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", studySessionRoutes);
app.use("/api", deckRoutes);
app.use("/api", studyStatsRoutes);

module.exports = app;