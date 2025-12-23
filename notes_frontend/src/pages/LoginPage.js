import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { login as loginApi } from "../api/notesApi";
import { useAuth } from "../context/AuthContext";
import { useToasts } from "../components/ToastProvider";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login form. On success, stores JWT access token and routes to /app. */
  const { setToken } = useAuth();
  const { pushToast } = useToasts();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const validation = useMemo(() => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    return errors;
  }, [email, password]);

  const canSubmit = Object.keys(validation).length === 0 && !busy;

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!canSubmit) return;

    try {
      setBusy(true);
      const data = await loginApi({ email: email.trim(), password });
      setToken(data.access_token);
      pushToast({ title: "Welcome back", description: "You are now logged in." });
      navigate("/app", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed. Check your credentials.";
      setFormError(String(msg));
      pushToast({ title: "Login failed", description: String(msg), variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page">
      <div className="card authWrap">
        <h1 className="h1">Login</h1>
        <p className="sub">Access your encrypted-ish notes. (JWT protected.)</p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
          {validation.email ? <div className="errorText">{validation.email}</div> : null}

          <div style={{ height: 12 }} />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
          {validation.password ? (
            <div className="errorText">{validation.password}</div>
          ) : null}

          {formError ? (
            <>
              <div style={{ height: 12 }} />
              <div className="errorText">{formError}</div>
            </>
          ) : null}

          <div className="formActions">
            <Link className="btn" to="/signup">
              Create account
            </Link>
            <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
              {busy ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>

        <hr className="sep" />
        <p className="helper">
          Tip: You can search notes with <kbd>q</kbd> on the server via the search box in the app.
        </p>
      </div>
    </div>
  );
}
