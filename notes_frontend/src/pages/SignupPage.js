import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { signup as signupApi, login as loginApi } from "../api/notesApi";
import { useAuth } from "../context/AuthContext";
import { useToasts } from "../components/ToastProvider";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// PUBLIC_INTERFACE
export function SignupPage() {
  /** Signup form. Creates user and logs in immediately to get token. */
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
    else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    return errors;
  }, [email, password]);

  const canSubmit = Object.keys(validation).length === 0 && !busy;

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!canSubmit) return;

    try {
      setBusy(true);
      await signupApi({ email: email.trim(), password });
      const tokens = await loginApi({ email: email.trim(), password });
      setToken(tokens.access_token);

      pushToast({ title: "Account created", description: "Welcome to Secure Notes." });
      navigate("/app", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Signup failed. Try a different email.";
      setFormError(String(msg));
      pushToast({ title: "Signup failed", description: String(msg), variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page">
      <div className="card authWrap">
        <h1 className="h1">Signup</h1>
        <p className="sub">Create an account to store notes per-user.</p>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
            <Link className="btn" to="/login">
              I have an account
            </Link>
            <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
              {busy ? "Creating..." : "Signup"}
            </button>
          </div>
        </form>

        <hr className="sep" />
        <p className="helper">
          Password rules are enforced server-side too (min 8 chars).
        </p>
      </div>
    </div>
  );
}
