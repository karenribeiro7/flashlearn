import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import api from "../services/api";

export default function StudyScreen({ route, navigation }) {
  const { deckId, deckTitle } = route.params;

  const [flashcards, setFlashcards] = useState([]);
  const [sessionCards, setSessionCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [correctCards, setCorrectCards] = useState(0);
  const [loading, setLoading] = useState(true);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const wrongCardIds = useRef(new Set());

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await api.post("/study-sessions/start", { deckId });
        wrongCardIds.current = new Set();
        setCorrectCards(0);
        setFlashcards(response.data.flashcards);
        setSessionCards(response.data.flashcards);
      } catch (error) {
        Alert.alert("Erro", "Nao foi possivel carregar os flashcards");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  }

  function handleFlip() {
    if (flipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFlipped(false));
    } else {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFlipped(true));
    }
  }

  async function handleCorrect() {
    const card = sessionCards[currentIndex];
    const isFirstTry = card && !wrongCardIds.current.has(card.id);
    const newCorrectCards = isFirstTry ? correctCards + 1 : correctCards;

    if (isFirstTry) {
      setCorrectCards(newCorrectCards);
    }

    const remaining = sessionCards.filter((_, i) => i !== currentIndex);

    if (remaining.length === 0) {
      await finishSession(newCorrectCards);
      return;
    }

    setSessionCards(remaining);
    setCurrentIndex(0);
    resetCard();
  }

  function handleWrong() {
    const card = sessionCards[currentIndex];
    if (card?.id != null) {
      wrongCardIds.current.add(card.id);
    }
    const remaining = sessionCards.filter((_, i) => i !== currentIndex);
    remaining.push(card);
    setSessionCards(remaining);
    setCurrentIndex(0);
    resetCard();
  }
  

  function resetCard() {
    flipAnim.setValue(0);
    setFlipped(false);
  }

  async function finishSession(finalCorrectCards) {
    try {
      await api.post("/study-sessions/finish", {
        deckId,
        durationSecs: seconds,
        totalCards: flashcards.length,
        correctCards: finalCorrectCards,
      });

      navigation.replace("StudyResult", {
        durationSecs: seconds,
        totalCards: flashcards.length,
        correctCards: finalCorrectCards,
        deckTitle,
      });
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel registrar a sessao");
    }
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const currentCard = sessionCards[currentIndex];
  const progress = (flashcards.length - sessionCards.length) / flashcards.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sessao de Estudo</Text>
        <Text style={styles.headerCounter}>
          {sessionCards.length} {sessionCards.length===1 ? " card restante" : " cards restantes"}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
      </View>

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={handleFlip}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <Text style={styles.cardLabel}>PERGUNTA</Text>
          <Text style={styles.cardText}>{currentCard?.question}</Text>
          <Text style={styles.cardHint}>Toque para ver a resposta</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Text style={[styles.cardLabel, styles.cardLabelBack]}>RESPOSTA</Text>
          <Text style={styles.cardText}>{currentCard?.answer}</Text>
        </Animated.View>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.wrongButton} onPress={handleWrong}>
            <Text style={styles.wrongButtonText}>Errei</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.correctButton} onPress={handleCorrect}>
            <Text style={styles.correctButtonText}>Acertei</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#F0F6FC",
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F0F6FC",
  },
  headerCounter: {
    fontSize: 13,
    color: "#8B949E",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#21262D",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#4F8EF7",
    borderRadius: 999,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  timer: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F0F6FC",
    fontVariant: ["tabular-nums"],
    backgroundColor: "#21262D",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cardContainer: {
    flex: 1,
    marginBottom: 24,
    position: "relative",
  },
  card: {
    position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#161B22",
  borderWidth: 1,
  borderColor: "#30363D",
  borderRadius: 14,
  padding: 32,
  justifyContent: "center",
  alignItems: "center",
  gap: 16,
  backfaceVisibility: "hidden",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 24,
  elevation: 8,
  },
  cardFront: {},
  cardBack: {},
  cardLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8B949E",
    letterSpacing: 1.5,
  },
  cardLabelBack: {
    color: "#3FB950",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F0F6FC",
    textAlign: "center",
    lineHeight: 30,
  },
  cardHint: {
    fontSize: 13,
    color: "#484F58",
    position: "absolute",
    bottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  wrongButton: {
    flex: 1,
    height: 52,
    backgroundColor: "#F8514920",
    borderWidth: 1,
    borderColor: "#F85149",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  wrongButtonText: {
    color: "#F85149",
    fontSize: 15,
    fontWeight: "600",
  },
  correctButton: {
    flex: 1,
    height: 52,
    backgroundColor: "#3FB95020",
    borderWidth: 1,
    borderColor: "#3FB950",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  correctButtonText: {
    color: "#3FB950",
    fontSize: 15,
    fontWeight: "600",
  },
});