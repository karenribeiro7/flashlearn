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
import { Ionicons } from "@expo/vector-icons";
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
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => {
              if (flashcards.length === 0) {
                Alert.alert("Aviso", "Adicione pelo menos um flashcard antes de estudar.");
                return;
              }
              navigation.navigate("Study", { deckId, deckTitle });
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="school-outline" size={22} color="#4F8EF7" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("FlashcardForm", { deckId, deckTitle })}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="add" size={26} color="#4F8EF7" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, deckId, deckTitle, flashcards]);

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
        error.response?.data?.error || "Nao foi possivel carregar os flashcards"
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
              error.response?.data?.error || "Nao foi possivel carregar os flashcards"
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
      <View style={styles.summary}>
        <Text style={styles.summaryCount}>{flashcards.length}</Text>
        <Text style={styles.summaryLabel}>
          {flashcards.length === 1 ? "card neste baralho" : "cards neste baralho"}
        </Text>
      </View>

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
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={48} color="#484F58" />
            <Text style={styles.emptyTitle}>Nenhum flashcard ainda</Text>
            <Text style={styles.emptyText}>
              Toque em + para adicionar seu primeiro flashcard
            </Text>
          </View>
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
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F0F6FC",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8B949E",
    marginTop: 2,
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
  emptyContainer: {
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8B949E",
  },
  emptyText: {
    fontSize: 14,
    color: "#484F58",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#30363D",
    borderLeftWidth: 3,
    borderLeftColor: "#4F8EF7",
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
  cardQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F0F6FC",
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginRight: 12,
  },
});