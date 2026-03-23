import { useState } from "react";
import { useAuth } from "./AuthContext";
import SpaceBackground from "./SpaceBackground";

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) return setError("Fill in all fields.");
    const result = mode === "login" ? login(username, password) : signup(username, password);
    if (result.error) setError(result.error);
  };

  return (
    <div className="auth-screen">
      <SpaceBackground />
      <div className="auth-box">
        <h1>Cop Or <span>Drop</span></h1>
        <p className="auth-tagline">✨ Swipe to cop. Or drop it. ✨</p>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Log In
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => { setMode("signup"); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit">
            {mode === "login" ? "🔓 Log In" : "🚀 Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
