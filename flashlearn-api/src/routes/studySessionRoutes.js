const express = require("express");
const router = express.Router();

const {
  startStudySession,
} = require("../controllers/studySessionController");

router.post("/", startStudySession);

module.exports = router;