/**
 * Token storage helper.
 * We keep an in-memory cache for quick reads and also persist to localStorage.
 */

const ACCESS_TOKEN_KEY = "secure_notes_access_token";

let inMemoryAccessToken = null;

// PUBLIC_INTERFACE
export function getAccessToken() {
  /** Returns the current access token if present, else null. */
  if (inMemoryAccessToken) return inMemoryAccessToken;
  try {
    const v = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    inMemoryAccessToken = v || null;
    return inMemoryAccessToken;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setAccessToken(token) {
  /** Sets (and persists) the access token. Pass null to clear it. */
  inMemoryAccessToken = token || null;
  try {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore storage errors (e.g., privacy mode). Token remains in memory.
  }
}

// PUBLIC_INTERFACE
export function clearAccessToken() {
  /** Clears the access token. */
  setAccessToken(null);
}
