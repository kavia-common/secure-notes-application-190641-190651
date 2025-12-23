import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../context/AuthContext";
import { useToasts } from "./ToastProvider";

// PUBLIC_INTERFACE
export function NavBar() {
  /** Top navigation bar with auth actions. */
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToasts();

  const onLogout = () => {
    logout();
    pushToast({ title: "Logged out", description: "You have been signed out." });
    navigate("/login", { replace: true });
  };

  return (
    <div className="topNav">
      <div className="topNavInner">
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            <span style={{ fontWeight: 900, color: "var(--primary)" }}>S</span>
          </div>
          <Link to={isAuthenticated ? "/app" : "/login"} style={{ color: "inherit" }}>
            Secure Notes
          </Link>
          <span className="badge">Light theme</span>
        </div>

        <div className="navActions">
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="badge">Profile</span>
              <button className="btn btn-danger" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
