
import { useState } from "react";
import "./Auth.css";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
  `https://memora-digital-diary.onrender.com/api/auth/${isRegister ? "register" : "login"}`,
  {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      if (isRegister) {
        setIsRegister(false);
        setName("");
        setPassword("");
        setMessage("Account created successfully! Please login 💖");
      } else {
        localStorage.setItem("token", data.token);
        onLogin(data.name);
      }
    } catch {
      setMessage("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-decoration decoration-one">✿</div>
      <div className="auth-decoration decoration-two">♡</div>
      <div className="auth-decoration decoration-three">✧</div>

      <div className="auth-card">
        <div className="auth-logo">✦</div>
        <h1>Memora</h1>
        <p className="auth-tagline">YOUR LITTLE WORLD OF MEMORIES</p>

        <div className="auth-divider"></div>

        <h2>{isRegister ? "Create Your Account" : "Welcome Back!"}</h2>

        <p className="auth-description">
          {isRegister
            ? "Begin your beautiful memory journey with us."
            : "Every memory deserves a special place."}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-input-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create My Account →"
              : "Login to Memora →"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="switch-auth">
          {isRegister
            ? "Already have an account?"
            : "New to Memora?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
          >
            {isRegister ? "Login" : "Create Account"}
          </button>
        </div>

        <p className="auth-footer">Made with ♡ for your memories</p>
      </div>
    </div>
  );
}

export default Auth;
