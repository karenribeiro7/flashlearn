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
    return res.status(400).json({
      error: "deckId é obrigatório",
    });
  }

  const deck = await prisma.deck.findUnique({
    where: {
      id: deckId,
    },
    include: {
      flashcards: true,
    },
  });

  if (!deck) {
    return res.status(404).json({
      error: "Deck não encontrado",
    });
  }

  if (deck.flashcards.length === 0) {
    return res.status(400).json({
      error: "Esse deck não possui flashcards",
    });
  }

  const shuffledCards = shuffleArray([...deck.flashcards]);

  const studySession = await prisma.studySession.create({
    data: {
      userId: 1,
      deckId: deck.id,
      totalCards: shuffledCards.length,
      durationSecs: 0,
      correctCards: 0,
    },
  });

  return res.status(201).json({
    session: studySession,
    flashcards: shuffledCards,
  });
}

module.exports = { startStudySession };