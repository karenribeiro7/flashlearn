import React, { useCallback, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import api from "../services/api";

export default function FlashcardListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const deckId = route.params?.deckId;
  const deckTitle = route.params?.deckTitle ?? "Deck";

  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: deckTitle,
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FlashcardForm", { deckId, deckTitle })
          }
          style={styles.headerButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.headerButtonText}>Novo</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, deckId, deckTitle]);

  const loadFlashcards = useCallback(async () => {
    const { data } = await api.get(`/decks/${deckId}/flashcards`);
    setFlashcards(Array.isArray(data) ? data : []);
  }, [deckId]);

  const refresh = useCallback(async () => {
    try {
      await loadFlashcards();
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível carregar os flashcards"
      );
    }
  }, [loadFlashcards]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          await loadFlashcards();
        } catch (error) {
          if (active) {
            Alert.alert(
              "Erro",
              error.response?.data?.error || "Não foi possível carregar os flashcards"
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [loadFlashcards])
  );

  async function onRefresh() {
    try {
      setRefreshing(true);
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardLabel}>PERGUNTA</Text>
        <Text style={styles.cardQuestion}>{item.question}</Text>
        <Text style={[styles.cardLabel, styles.cardLabelAnswer]}>RESPOSTA</Text>
        <Text style={styles.cardAnswer}>{item.answer}</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={
          flashcards.length === 0 ? styles.emptyList : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F8EF7"
            colors={["#4F8EF7"]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum flashcard ainda. Toque em Novo para adicionar.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0D1117",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  emptyText: {
    color: "#8B949E",
    fontSize: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#30363D",
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8B949E",
    letterSpacing: 1.5,
  },
  cardLabelAnswer: {
    marginTop: 8,
  },
  cardQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F0F6FC",
    lineHeight: 22,
  },
  cardAnswer: {
    fontSize: 15,
    color: "#C9D1D9",
    lineHeight: 21,
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonText: {
    color: "#4F8EF7",
    fontSize: 16,
    fontWeight: "600",
  },
});
