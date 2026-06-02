const prisma = require("../database/prismaClient");

async function getStudyStats(req, res) {
  try {
    const userId = req.userId;

    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
      },
      include: {
        deck: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalSessions = sessions.length;

    const totalStudySeconds = sessions.reduce(
      (acc, session) => acc + session.durationSecs,
      0
    );

    const totalCardsReviewed = sessions.reduce(
      (acc, session) => acc + session.totalCards,
      0
    );

    const totalCorrectCards = sessions.reduce(
      (acc, session) => acc + session.correctCards,
      0
    );

    const accuracyRate =
      totalCardsReviewed === 0
        ? 0
        : Math.round((totalCorrectCards / totalCardsReviewed) * 100);

    const deckPerformanceMap = {};

    sessions.forEach((session) => {
      const deckTitle = session.deck.title;

      if (!deckPerformanceMap[deckTitle]) {
        deckPerformanceMap[deckTitle] = {
          totalCorrect: 0,
          totalCards: 0,
          totalStudySeconds: 0,
          totalSessions: 0,
        };
      }

      deckPerformanceMap[deckTitle].totalCorrect +=
        session.correctCards;

      deckPerformanceMap[deckTitle].totalCards +=
        session.totalCards;

      deckPerformanceMap[deckTitle].totalStudySeconds +=
        session.durationSecs;

      deckPerformanceMap[deckTitle].totalSessions += 1;
    });

    const deckPerformance = Object.entries(deckPerformanceMap).map(
      ([deckTitle, data]) => ({
        deckTitle,
        accuracy:
          data.totalCards === 0
            ? 0
            : Math.round(
              (data.totalCorrect / data.totalCards) * 100
            ),

        totalStudyHours: (
          data.totalStudySeconds / 3600
        ).toFixed(1),

        totalCardsReviewed: data.totalCards,

        totalSessions: data.totalSessions,
      })
    );

    const history = sessions.map((session) => ({
      id: session.id,
      deckTitle: session.deck.title,
      date: session.createdAt,
      durationSecs: session.durationSecs,
      accuracy:
        session.totalCards === 0
          ? 0
          : Math.round(
            (session.correctCards / session.totalCards) * 100
          ),
    }));

    return res.json({
      totalSessions,
      totalStudyHours: (
        totalStudySeconds / 3600
      ).toFixed(1),

      totalCardsReviewed,

      accuracyRate,

      deckPerformance,

      history,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar estatisticas",
    });
  }
}

module.exports = { getStudyStats };