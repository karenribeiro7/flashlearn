import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          setToken(storedToken);
          setUser(decoded);
        }
      } catch (error) {
        await AsyncStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    loadToken();
  }, []);

  async function login(email, password) {
    const response = await api.post("/users/login", { email, password });
    const { token } = response.data;
    const decoded = jwtDecode(token);
    await AsyncStorage.setItem("token", token);
    setUser(decoded);
    setToken(token);
  }

  async function logout() {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}