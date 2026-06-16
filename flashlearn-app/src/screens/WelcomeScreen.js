import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/Logo_FlashLearn.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>FlashLearn</Text>
        <Text style={styles.tagline}>Estude mais. Aprenda melhor.</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: "space-between",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F0F6FC",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: "#8B949E",
  },
  buttons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#4F8EF7",
    borderRadius: 10,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#F0F6FC",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4F8EF7",
    borderRadius: 10,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#4F8EF7",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});