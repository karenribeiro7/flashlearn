import React, { useCallback, useState, useLayoutEffect, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";

export default function DeckListScreen() {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "FlashLearn",
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={logout}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.logoutIcon}>⍈</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DeckForm", { deck: null })
            }
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.plusIcon}></Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, logout]);

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
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.deckCard}
        onPress={() =>
          navigation.navigate("FlashcardList", {
            deckId: item.id,
            deckTitle: item.title,
          })
        }
      >
        <Text style={styles.deckCount}>
          {cardCount} {cardCount === 1 ? "card" : "cards"}
        </Text>
        <View style={styles.deckContent}>
          <Text style={styles.deckTitle}>{item.title}</Text>

          <Text style={styles.deckArrow}>›</Text>
        </View>
        <Text style={styles.deckCategory}>
          {item.category?.name ?? "Sem categoria"}
        </Text>
      </TouchableOpacity>
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
      <View style={styles.topBar}>
        <Text style={styles.meusDecks}>Meus Decks</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("DeckForm", { deck: null })}
        >
          <Text style={styles.plusButton}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>

        <View>
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>

          <Text style={styles.userInfo}>
            {decks.length} {decks.length === 1 ? "Baralho criado" : "Baralhos criados"}
          </Text>
        </View>
      </View>
      <FlatList
        data={decks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[decks.length === 0 ? styles.emptyList : styles.list, { paddingHorizontal: 20 }]}
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },

  meusDecks: {
    color: "#F0F6FC",
    fontSize: 22,
    fontWeight: "700",
  },

  plusButton: {
    color: "#4F8EF7",
    fontSize: 34,
    fontWeight: "300",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#D0BCFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#0D1117",
    fontWeight: "700",
    fontSize: 18,
  },

  userName: {
    color: "#F0F6FC",
    fontSize: 16,
    fontWeight: "600",
  },

  userInfo: {
    color: "#8B949E",
    fontSize: 13,
    marginTop: 2,
  },

  deckCard: {
    backgroundColor: "#C9C4CC",
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
  },

  deckCount: {
    color: "#5C5560",
    fontSize: 12,
    marginBottom: 8,
  },

  deckContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deckTitle: {
    color: "#2A2430",
    fontSize: 24,
    fontWeight: "500",
  },

  deckArrow: {
    color: "#4F8EF7",
    fontSize: 34,
    fontWeight: "300",
  },

  deckCategory: {
    color: "#6E6772",
    fontSize: 13,
    marginTop: 14,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginRight: 12,
  },

  logoutIcon: {
    color: "#F85149",
    fontSize: 20,
    marginRight: -15,
    fontWeight: "600",
  },
});
