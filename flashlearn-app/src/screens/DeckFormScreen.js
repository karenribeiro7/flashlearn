import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import api from "../services/api";

export default function DeckFormScreen({ navigation }) {
  const route = useRoute();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

async function handleCreateCategory() {
  if (!newCategory.trim()) {
    Alert.alert("Erro", "Digite o nome da categoria");
    return;
  }

  try {
    const response = await api.post("/categories", { name: newCategory.trim() });
    setCategories((prev) => [...prev, response.data]);
    setSelectedCategoryId(response.data.id);
    setNewCategory("");
    setShowNewCategory(false);
  } catch (error) {
    Alert.alert(
      "Erro",
      error.response?.data?.error || "Erro ao criar categoria"
    );
  }
}

  const fetchCategories = useCallback(async () => {
    const { data } = await api.get("/categories");
    return Array.isArray(data) ? data : [];
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          setLoadingCategories(true);
          const list = await fetchCategories();
          if (cancelled) return;
          setCategories(list);
          const deck = route.params?.deck;
          if (deck && deck.id) {
            setTitle(deck.title ?? "");
            setDescription(deck.description ?? "");
            setSelectedCategoryId(deck.categoryId);
          } else {
            setTitle("");
            setDescription("");
            setSelectedCategoryId(list.length === 1 ? list[0].id : null);
          }
        } catch (error) {
          if (!cancelled) {
            Alert.alert(
              "Erro",
              error.response?.data?.error || "Não foi possível carregar as categorias"
            );
            setCategories([]);
            setSelectedCategoryId(null);
          }
        } finally {
          if (!cancelled) setLoadingCategories(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [fetchCategories, route.params?.deck?.id])
  );

  const editingDeck = route.params?.deck?.id ? route.params.deck : null;

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Atenção", "Informe o título do deck");
      return;
    }
    if (selectedCategoryId == null) {
      Alert.alert("Atenção", "Selecione uma categoria");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId: selectedCategoryId,
    };

    try {
      setSubmitting(true);
      if (editingDeck) {
        await api.put(`/decks/${editingDeck.id}`, payload);
        Alert.alert("Sucesso", "Deck atualizado com sucesso", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await api.post("/decks", payload);
        Alert.alert("Sucesso", "Deck criado com sucesso", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          (editingDeck ? "Erro ao atualizar deck" : "Erro ao criar deck")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{editingDeck ? "Editar deck" : "Novo deck"}</Text>
      <Text style={styles.subtitle}>
        Defina título, descrição opcional e categoria
      </Text>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>TÍTULO</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex.: Vocabulário de viagem"
            placeholderTextColor="#484F58"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>DESCRIÇÃO (OPCIONAL)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Notas ou contexto do deck"
            placeholderTextColor="#484F58"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>CATEGORIA</Text>
          {loadingCategories ? (
            <ActivityIndicator color="#4F8EF7" style={styles.categoriesLoader} />
          ) : categories.length === 0 ? (
            <Text style={styles.emptyCategories}>
              Nenhuma categoria disponível.
            </Text>
          ) : (
            <View style={styles.chips}>
              {categories.map((cat) => {
                const selected = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Text
                      style={[styles.chipText, selected && styles.chipTextSelected]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.newCategoryButton}
          onPress={() => setShowNewCategory(!showNewCategory)}
        >
          <Text style={styles.newCategoryButtonText}>
            {showNewCategory ? "Cancelar" : "+ Criar nova categoria"}
          </Text>
        </TouchableOpacity>

        {showNewCategory && (
          <View style={styles.newCategoryContainer}>
            <Text style={styles.label}>NOVA CATEGORIA</Text>
            <TextInput
              style={styles.input}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Nome da categoria"
              placeholderTextColor="#484F58"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={styles.createCategoryButton}
              onPress={handleCreateCategory}
            >
              <Text style={styles.createCategoryButtonText}>Criar e selecionar</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || loadingCategories}
        >
          {submitting ? (
            <ActivityIndicator color="#0D1117" />
          ) : (
            <Text style={styles.buttonText}>
              {editingDeck ? "Salvar alterações" : "Criar deck"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  content: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F0F6FC",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8B949E",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8B949E",
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: "#21262D",
    borderWidth: 1,
    borderColor: "#30363D",
    borderRadius: 10,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#F0F6FC",
  },
  inputMultiline: {
    minHeight: 100,
  },
  categoriesLoader: {
    paddingVertical: 12,
  },
  emptyCategories: {
    color: "#8B949E",
    fontSize: 14,
    lineHeight: 20,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#30363D",
    backgroundColor: "#21262D",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: "#4F8EF7",
    backgroundColor: "rgba(79, 142, 247, 0.15)",
  },
  chipText: {
    color: "#C9D1D9",
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#4F8EF7",
  },
  button: {
    backgroundColor: "#4F8EF7",
    borderRadius: 10,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#F0F6FC",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  newCategoryButton: {
  alignItems: "center",
  paddingVertical: 8,
},
newCategoryButtonText: {
  color: "#4F8EF7",
  fontSize: 14,
  fontWeight: "600",
},
newCategoryContainer: {
  gap: 8,
  backgroundColor: "#161B22",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#30363D",
  padding: 16,
},
createCategoryButton: {
  backgroundColor: "#4F8EF7",
  borderRadius: 10,
  height: 44,
  alignItems: "center",
  justifyContent: "center",
},
createCategoryButtonText: {
  color: "#F0F6FC",
  fontSize: 14,
  fontWeight: "600",
},
});
