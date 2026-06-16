const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const deckRoutes = require("./routes/deckRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const studyStatsRoutes = require("./routes/studyStatsRoutes");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", flashcardRoutes);

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", deckRoutes);
app.use("/api", studySessionRoutes);
app.use("/api", studyStatsRoutes);

module.exports = app;