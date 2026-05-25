import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";

export default function StudyStatsScreen() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get(
          "/study-sessions/stats"
        );

        setStats(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  function formatDuration(secs) {
    const h = Math.floor(secs / 3600);

    const m = Math.floor((secs % 3600) / 60);

    const s = secs % 60;

    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  }

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.totalSessions}
          </Text>

          <Text style={styles.statLabel}>
            Total de Sessões
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.totalStudyHours}h
          </Text>

          <Text style={styles.statLabel}>
            Horas Estudadas
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.totalCardsReviewed}
          </Text>

          <Text style={styles.statLabel}>
            Cards Revisados
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.accuracyRate}%
          </Text>

          <Text style={styles.statLabel}>
            Taxa de Acertos
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        DESEMPENHO POR BARALHO
      </Text>

      {stats.deckPerformance.map((deck, index) => (
        <View key={index} style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <Text style={styles.performanceTitle}>
              {deck.deckTitle}
            </Text>

            <Text style={styles.performancePercent}>
              {deck.accuracy}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${deck.accuracy}%` },
              ]}
            />
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>HISTÓRICO</Text>

      {stats.history.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View>
            <Text style={styles.historyDeck}>
              {item.deckTitle}
            </Text>

            <Text style={styles.historyDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.historyRight}>
            <Text style={styles.historyDuration}>
              {formatDuration(item.durationSecs)}
            </Text>

            <Text style={styles.historyAccuracy}>
              {item.accuracy}%
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 24,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#161B22",
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
  },

  statValue: {
    color: "#F0F6FC",
    fontSize: 34,
    fontWeight: "700",
  },

  statLabel: {
    color: "#8B949E",
    marginTop: 8,
    fontSize: 13,
  },

  sectionTitle: {
    color: "#8B949E",
    fontSize: 13,
    marginTop: 28,
    marginBottom: 14,
    fontWeight: "700",
  },

  performanceCard: {
    backgroundColor: "#161B22",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  performanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  performanceTitle: {
    color: "#F0F6FC",
    fontSize: 15,
  },

  performancePercent: {
    color: "#4F8EF7",
    fontSize: 24,
    fontWeight: "700",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#30363D",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: 6,
    backgroundColor: "#0583F2",
  },

  historyCard: {
    backgroundColor: "#161B22",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  historyDeck: {
    color: "#F0F6FC",
    fontSize: 15,
    marginBottom: 8,
  },

  historyDate: {
    color: "#8B949E",
    fontSize: 13,
  },

  historyRight: {
    alignItems: "flex-end",
  },

  historyDuration: {
    color: "#C9D1D9",
    fontSize: 20,
    marginBottom: 6,
  },

  historyAccuracy: {
    color: "#3FB950",
    fontSize: 22,
    fontWeight: "700",
  },
});