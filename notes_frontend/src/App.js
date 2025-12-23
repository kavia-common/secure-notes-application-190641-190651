import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import "./theme.css";

import { NavBar } from "./components/NavBar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ToastProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setUnauthorizedHandler } from "./api/client";

import { AppPage } from "./pages/AppPage";

function RouterWith401Handler() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Auth UI is temporarily disabled. If backend returns 401, clear auth and
    // keep the user in the app; AppPage will show an error/toast as appropriate.
    setUnauthorizedHandler(() => {
      logout();
      navigate("/app", { replace: true });
    });
  }, [logout, navigate]);

  return (
    <div className="appShell">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App root: providers, router, navbar, routes. */
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <RouterWith401Handler />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
