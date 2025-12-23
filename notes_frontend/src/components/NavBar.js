import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../context/AuthContext";
import { useToasts } from "./ToastProvider";

// PUBLIC_INTERFACE
export function NavBar() {
  /** Top navigation bar. Auth UI is temporarily disabled. */
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToasts();

  const onLogout = () => {
    // Keep logout available for dev/testing (clears token if present),
    // but do not navigate to /login since auth pages are disabled.
    logout();
    pushToast({ title: "Logged out", description: "Local auth state cleared." });
    navigate("/app", { replace: true });
  };

  return (
    <div className="topNav">
      <div className="topNavInner">
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            <span style={{ fontWeight: 900, color: "var(--primary)" }}>S</span>
          </div>
          <Link to="/app" style={{ color: "inherit" }}>
            Secure Notes
          </Link>
          <span className="badge">Light theme</span>
        </div>

        <div className="navActions">
          <span className="badge">Auth disabled</span>
          <button className="btn btn-ghost" onClick={onLogout} type="button">
            Clear token
          </button>
        </div>
      </div>
    </div>
  );
}
