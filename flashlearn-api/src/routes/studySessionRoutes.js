const { Router } = require("express");

const { startStudySession, finishStudySession } = require("../controllers/studySessionController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.post("/study-sessions/start", authMiddleware, startStudySession);
router.post("/study-sessions/finish", authMiddleware, finishStudySession);

module.exports = router;