import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("ds_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const signup = (username, password) => {
    const users = JSON.parse(localStorage.getItem("ds_users") || "{}");
    if (users[username]) return { error: "Username already taken" };
    users[username] = { username, password };
    localStorage.setItem("ds_users", JSON.stringify(users));
    const u = { username };
    localStorage.setItem("ds_user", JSON.stringify(u));
    setUser(u);
    return { success: true };
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("ds_users") || "{}");
    if (!users[username] || users[username].password !== password)
      return { error: "Invalid username or password" };
    const u = { username };
    localStorage.setItem("ds_user", JSON.stringify(u));
    setUser(u);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("ds_user");
    setUser(null);
  };

  const getUserData = (key) => {
    if (!user) return [];
    const data = localStorage.getItem(`ds_${user.username}_${key}`);
    return data ? JSON.parse(data) : [];
  };

  const setUserData = (key, value) => {
    if (!user) return;
    localStorage.setItem(`ds_${user.username}_${key}`, JSON.stringify(value));
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, getUserData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
