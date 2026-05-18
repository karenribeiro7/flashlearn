const prisma = require("../database/prismaClient");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function startStudySession(req, res) {
  const { deckId } = req.body;

  if (!deckId) {
    return res.status(400).json({ error: "deckId é obrigatório" });
  }

  const deck = await prisma.deck.findFirst({
    where: {
      id: Number(deckId),
      userId: req.userId,
    },
    include: {
      flashcards: true,
    },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  if (deck.flashcards.length === 0) {
    return res.status(400).json({ error: "Esse deck não possui flashcards" });
  }

  const shuffledCards = shuffleArray([...deck.flashcards]);

  return res.status(200).json({
    flashcards: shuffledCards,
  });
}

async function finishStudySession(req, res) {
  const { deckId, durationSecs, totalCards, correctCards } = req.body;

  if (!deckId || !durationSecs ||  !totalCards || correctCards === undefined) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const deck = await prisma.deck.findFirst({
    where: {
      id: Number(deckId),
      userId: req.userId,
    },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  const studySession = await prisma.studySession.create({
    data: {
      userId: req.userId,
      deckId: Number(deckId),
      durationSecs: Number(durationSecs),
      totalCards: Number(totalCards),
      correctCards: Number(correctCards),
    },
  });

  return res.status(201).json(studySession);
}

module.exports = { startStudySession, finishStudySession };