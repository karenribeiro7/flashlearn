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

export default function FlashcardFormScreen({ navigation }) {
  const route = useRoute();
  const deckId = route.params?.deckId;
  const deckTitle = route.params?.deckTitle;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const flashcard = route.params?.flashcard;
      if (flashcard?.id) {
        setQuestion(flashcard.question ?? "");
        setAnswer(flashcard.answer ?? "");
      } else {
        setQuestion("");
        setAnswer("");
      }
    }, [route.params?.flashcard?.id])
  );

  const editingFlashcard = route.params?.flashcard?.id
    ? route.params.flashcard
    : null;

  async function handleSubmit() {
    if (!question.trim()) {
      Alert.alert("Atenção", "Informe a pergunta");
      return;
    }
    if (!answer.trim()) {
      Alert.alert("Atenção", "Informe a resposta");
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
    };

    try {
      setSubmitting(true);
      if (editingFlashcard) {
        await api.put(
          `/decks/${deckId}/flashcards/${editingFlashcard.id}`,
          payload
        );
        Alert.alert("Sucesso", "Flashcard atualizado com sucesso", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await api.post(`/decks/${deckId}/flashcards`, payload);
        Alert.alert("Sucesso", "Flashcard criado com sucesso", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          (editingFlashcard
            ? "Erro ao atualizar flashcard"
            : "Erro ao criar flashcard")
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
      <Text style={styles.title}>
        {editingFlashcard ? "Editar flashcard" : "Novo flashcard"}
      </Text>
      {deckTitle ? (
        <Text style={styles.subtitle}>Deck: {deckTitle}</Text>
      ) : (
        <Text style={styles.subtitle}>Pergunta na frente, resposta no verso</Text>
      )}

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PERGUNTA</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={question}
            onChangeText={setQuestion}
            placeholder="Ex.: Qual é a capital da França?"
            placeholderTextColor="#484F58"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>RESPOSTA</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Ex.: Paris"
            placeholderTextColor="#484F58"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#0D1117" />
          ) : (
            <Text style={styles.buttonText}>
              {editingFlashcard ? "Salvar alterações" : "Criar flashcard"}
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
});
