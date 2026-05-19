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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../services/api";

export default function DeckListScreen() {
  const navigation = useNavigation();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("DeckForm", { deck: null })}
          style={styles.headerButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.headerButtonText}>Novo</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadDecks = useCallback(async () => {
    const { data } = await api.get("/decks");
    setDecks(Array.isArray(data) ? data : []);
  }, []);

  const refresh = useCallback(async () => {
    try {
      await loadDecks();
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível carregar os decks"
      );
    }
  }, [loadDecks]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          await loadDecks();
        } catch (error) {
          if (active) {
            Alert.alert(
              "Erro",
              error.response?.data?.error || "Não foi possível carregar os decks"
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [loadDecks])
  );

  async function onRefresh() {
    try {
      setRefreshing(true);
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  function confirmDelete(deck) {
    Alert.alert(
      "Excluir deck",
      `Remover "${deck.title}"? Flashcards e sessões deste deck serão apagados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/decks/${deck.id}`);
              await refresh();
            } catch (error) {
              Alert.alert(
                "Erro",
                error.response?.data?.error || "Não foi possível excluir o deck"
              );
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    const cardCount = item._count?.flashcards ?? 0;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardMeta}>
            {item.category?.name ?? "—"} · {cardCount}{" "}
            {cardCount === 1 ? "cartão" : "cartões"}
          </Text>
          {item.description ? (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionPrimary}
            onPress={() =>
              navigation.navigate("FlashcardList", {
                deckId: item.id,
                deckTitle: item.title,
              })
            }
          >
            <Text style={styles.actionPrimaryText}>Cartões</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionSecondary}
            onPress={() =>
              navigation.navigate("DeckForm", {
                deck: {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  categoryId: item.categoryId,
                },
              })
            }
          >
            <Text style={styles.actionSecondaryText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionDanger}
            onPress={() => confirmDelete(item)}
          >
            <Text style={styles.actionDangerText}>Excluir</Text>
          </TouchableOpacity>
        </View>
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
        data={decks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={decks.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F8EF7"
            colors={["#4F8EF7"]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum deck ainda. Toque em + para criar.</Text>
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
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F0F6FC",
  },
  cardMeta: {
    fontSize: 13,
    color: "#8B949E",
  },
  cardDescription: {
    fontSize: 14,
    color: "#C9D1D9",
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#30363D",
  },
  actionPrimary: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#30363D",
  },
  actionPrimaryText: {
    color: "#3FB950",
    fontSize: 15,
    fontWeight: "600",
  },
  actionSecondary: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#30363D",
  },
  actionSecondaryText: {
    color: "#4F8EF7",
    fontSize: 15,
    fontWeight: "600",
  },
  actionDanger: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionDangerText: {
    color: "#F85149",
    fontSize: 15,
    fontWeight: "600",
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
