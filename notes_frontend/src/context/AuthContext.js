import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/tokenStorage";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (token presence) and helpers for login/logout. */
  const [accessToken, setAccessTokenState] = useState(() => getAccessToken());

  useEffect(() => {
    // Sync in case token was written elsewhere.
    setAccessTokenState(getAccessToken());
  }, []);

  const setToken = useCallback((token) => {
    setAccessToken(token);
    setAccessTokenState(token);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setAccessTokenState(null);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      setToken,
      logout,
    }),
    [accessToken, setToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns auth state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
