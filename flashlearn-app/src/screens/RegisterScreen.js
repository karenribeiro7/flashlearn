import React, { useState } from "react";
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
import api from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);
      await api.post("/users/register", { name, email, password });
      Alert.alert("Sucesso", "Conta criada com sucesso", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao criar conta"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>
        Preencha os dados abaixo para se cadastrar
      </Text>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
            placeholderTextColor="#484F58"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#484F58"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            placeholderTextColor="#484F58"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0D1117" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLinkText}>
            Ja tem conta?{" "}
            <Text style={styles.loginLinkHighlight}>Entrar</Text>
          </Text>
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
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#F0F6FC",
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
  loginLink: {
    alignItems: "center",
    marginTop: 8,
  },
  loginLinkText: {
    fontSize: 13,
    color: "#8B949E",
  },
  loginLinkHighlight: {
    color: "#4F8EF7",
    fontWeight: "600",
  },
});