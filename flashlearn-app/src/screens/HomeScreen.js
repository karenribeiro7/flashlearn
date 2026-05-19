import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      <Text style={styles.greeting}>Ola, {user?.name}</Text>
      <Text style={styles.subtitle}>Em desenvolvimento...</Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("DeckList")}
      >
        <Text style={styles.primaryButtonText}>Meus decks</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("DeckForm", { deck: null })}
      >
        <Text style={styles.secondaryButtonText}>Novo deck</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F0F6FC",
  },
  subtitle: {
    fontSize: 15,
    color: "#8B949E",
  },
  primaryButton: {
    backgroundColor: "#4F8EF7",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#F0F6FC",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4F8EF7",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 4,
  },
  secondaryButtonText: {
    color: "#4F8EF7",
    fontSize: 15,
    fontWeight: "600",
  },
  button: {
    borderWidth: 1,
    borderColor: "#F85149",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  buttonText: {
    color: "#F85149",
    fontSize: 15,
    fontWeight: "600",
  },
});