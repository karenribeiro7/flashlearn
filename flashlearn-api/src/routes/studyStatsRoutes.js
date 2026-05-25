const { Router } = require("express");

const { getStudyStats, } = require("../controllers/studyStatsController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.get( "/study-sessions/stats", authMiddleware, getStudyStats );

module.exports = router;