import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import AppRoutes from "./src/routes/AppRoutes";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}