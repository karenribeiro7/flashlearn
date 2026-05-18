import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StudyResultScreen({ route, navigation }) {
  const { durationSecs, totalCards, correctCards, deckTitle } = route.params;

  const accuracy = Math.round((correctCards / totalCards) * 100);

  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "00"),
    ].join(":");
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={64} color="#3FB950" />
        <Text style={styles.title}>Sessao Concluida</Text>
        <Text style={styles.subtitle}>{deckTitle}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#D29922" />
          <Text style={styles.statValue}>{formatTime(durationSecs)}</Text>
          <Text style={styles.statLabel}>Tempo</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="card-outline" size={24} color="#4F8EF7" />
          <Text style={styles.statValue}>{totalCards}</Text>
          <Text style={styles.statLabel}>Total de cards</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#3FB950" />
          <Text style={styles.statValue}>{correctCards}</Text>
          <Text style={styles.statLabel}>Acertos</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="stats-chart-outline" size={24} color="#4F8EF7" />
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Taxa de acerto</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar para o Baralho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F0F6FC",
  },
  subtitle: {
    fontSize: 15,
    color: "#8B949E",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#161B22",
    borderWidth: 1,
    borderColor: "#30363D",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F0F6FC",
  },
  statLabel: {
    fontSize: 13,
    color: "#8B949E",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4F8EF7",
    borderRadius: 10,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#F0F6FC",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});