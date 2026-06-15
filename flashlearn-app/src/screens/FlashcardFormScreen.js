import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import api from "../services/api";

export default function FlashcardFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId, deckTitle, flashcard } = route.params || {};

  const [question, setQuestion] = useState(flashcard?.question || "");
  const [answer, setAnswer] = useState(flashcard?.answer || "");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(flashcard?.imageUrl || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: flashcard ? "Editar Flashcard" : "Novo Flashcard",
    });
  }, []);

  async function handlePickImage() {
    try {
      console.log("solicitando permissao...");
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("permissao:", permission);

      if (!permission.granted) {
        Alert.alert("Permissao negada", "E necessario permitir o acesso a galeria para adicionar uma imagem.");
        return;
      }

      console.log("abrindo galeria...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log("resultado:", result);

      if (!result.canceled) {
        setImage(result.assets[0]);
        setExistingImage(null);
      }
    } catch (error) {
      console.log("erro:", error);
    }
  }

  function handleRemoveImage() {
    setImage(null);
    setExistingImage(null);
  }

  async function handleSubmit() {
  if (!question.trim() || !answer.trim()) {
    Alert.alert("Erro", "Pergunta e resposta sao obrigatorias");
    return;
  }

  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("token");
    const url = image
      ? `${API_URL}/decks/${deckId}/flashcards${flashcard ? `/${flashcard.id}` : ""}`
      : null;

    if (image) {
      const formData = new FormData();
      formData.append("question", question.trim());
      formData.append("answer", answer.trim());
      formData.append("image", {
        uri: image.uri,
        name: image.fileName || "image.jpg",
        type: image.mimeType || "image/jpeg",
      });

      const response = await fetch(url, {
        method: flashcard ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("resposta upload:", data);

      if (!response.ok) {
        Alert.alert("Erro", data.error || "Erro ao salvar flashcard");
        return;
      }
    } else {
      if (flashcard) {
        await api.put(`/decks/${deckId}/flashcards/${flashcard.id}`, {
          question: question.trim(),
          answer: answer.trim(),
        });
      } else {
        await api.post(`/decks/${deckId}/flashcards`, {
          question: question.trim(),
          answer: answer.trim(),
        });
      }
    }

    navigation.goBack();
  } catch (error) {
    console.log("erro completo:", error);
    Alert.alert("Erro", error.message || "Erro ao salvar flashcard");
  } finally {
    setLoading(false);
  }
}

  const imageSource = image
    ? { uri: image.uri }
    : existingImage
    ? { uri: `${API_URL.replace("/api", "")}${existingImage}` }
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>PERGUNTA</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={question}
        onChangeText={setQuestion}
        placeholder="Digite a pergunta..."
        placeholderTextColor="#484F58"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text style={styles.label}>IMAGEM DA PERGUNTA</Text>
      {imageSource ? (
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
            <Ionicons name="close-circle" size={24} color="#F85149" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Ionicons name="image-outline" size={32} color="#484F58" />
          <Text style={styles.imagePickerText}>Toque para adicionar uma imagem</Text>
          <Text style={styles.imagePickerSubtext}>JPEG, PNG ou WebP ate 5MB</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>RESPOSTA</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Digite a resposta..."
        placeholderTextColor="#484F58"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0D1117" />
        ) : (
          <Text style={styles.buttonText}>
            {flashcard ? "Atualizar" : "Criar"}
          </Text>
        )}
      </TouchableOpacity>
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
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8B949E",
    letterSpacing: 1.5,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#21262D",
    borderWidth: 1,
    borderColor: "#30363D",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#F0F6FC",
    marginBottom: 8,
  },
  textArea: {
    height: 100,
  },
  imagePicker: {
    backgroundColor: "#21262D",
    borderWidth: 1,
    borderColor: "#30363D",
    borderRadius: 10,
    borderStyle: "dashed",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: "#8B949E",
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: "#484F58",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
        resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#0D1117",
    borderRadius: 999,
  },
  button: {
    backgroundColor: "#4F8EF7",
    borderRadius: 10,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 40,
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