import React, { useContext } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DeckListScreen from "../screens/DeckListScreen";
import DeckFormScreen from "../screens/DeckFormScreen";
import FlashcardListScreen from "../screens/FlashcardListScreen";
import FlashcardFormScreen from "../screens/FlashcardFormScreen";
import StudyScreen from "../screens/StudyScreen";
import StudyResultScreen from "../screens/StudyResultScreen";
import StudyStatsScreen from "../screens/StudyStatsScreen";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#161B22" },
        headerTintColor: "#4F8EF7",
        headerTitleStyle: { color: "#F0F6FC", fontWeight: "600" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Cadastro" }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#161B22" },
        headerTintColor: "#4F8EF7",
        headerTitleStyle: { color: "#F0F6FC", fontWeight: "600" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="DeckList"
        component={DeckListScreen}
        options={{ title: "Meus decks" }}
      />
      <Stack.Screen
        name="DeckForm"
        component={DeckFormScreen}
        options={({ route }) => ({
          title: route.params?.deck?.id ? "Editar deck" : "Novo deck",
        })}
      />
      <Stack.Screen
        name="FlashcardList"
        component={FlashcardListScreen}
        options={{ title: "Flashcards" }}
      />
      <Stack.Screen
        name="FlashcardForm"
        component={FlashcardFormScreen}
        options={({ route }) => ({
          title: route.params?.flashcard?.id ? "Editar flashcard" : "Novo flashcard",
        })}
      />
      <Stack.Screen
        name="Study"
        component={StudyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudyResult"
        component={StudyResultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudyStats"
        component={StudyStatsScreen}
        options={{
          title: "Estatísticas",
          headerStyle: {
            backgroundColor: "#0D1117",
          },
          headerTintColor: "#F0F6FC",
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D1117", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#F0F6FC" }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}