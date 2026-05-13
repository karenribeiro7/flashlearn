const { Router } = require("express");

const { startStudySession } = require("../controllers/studySessionController");

const router = Router();

router.post("/study-sessions", startStudySession);

module.exports = router;