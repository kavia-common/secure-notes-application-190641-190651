import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import "../App.css";

const ToastContext = createContext(null);

let nextId = 1;

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provides app-wide toast notifications. */
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((toast) => {
    const id = nextId++;
    const t = {
      id,
      title: toast.title || "Notice",
      description: toast.description || "",
      variant: toast.variant || "info", // info | error
      timeoutMs: toast.timeoutMs ?? 3500,
    };
    setToasts((prev) => [t, ...prev].slice(0, 4));
    if (t.timeoutMs > 0) {
      window.setTimeout(() => removeToast(id), t.timeoutMs);
    }
    return id;
  }, [removeToast]);

  const api = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toastHost" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.variant === "error" ? "toastError" : ""}`}
            role="status"
          >
            <p className="toastTitle">{t.title}</p>
            {t.description ? <p className="toastDesc">{t.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToasts() {
  /** Returns { pushToast, removeToast } */
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToasts must be used within ToastProvider");
  }
  return ctx;
}
