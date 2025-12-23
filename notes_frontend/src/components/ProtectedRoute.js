import React from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function ProtectedRoute({ children }) {
  /** Temporary passthrough: auth screens are disabled, so do not block routing. */
  // Keep reading auth state so the component remains compatible when auth is re-enabled.
  useAuth();
  return children;
}
