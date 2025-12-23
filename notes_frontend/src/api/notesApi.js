import { api } from "./client";

// PUBLIC_INTERFACE
export async function signup({ email, password }) {
  /** Calls POST /auth/signup */
  const res = await api.post("/auth/signup", { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Calls POST /auth/login -> {access_token, refresh_token, token_type} */
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function listNotes({ q } = {}) {
  /** Calls GET /notes with optional ?q= */
  const res = await api.get("/notes", { params: q ? { q } : {} });
  return res.data;
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Calls POST /notes */
  const res = await api.post("/notes", { title, content });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, { title, content }) {
  /** Calls PUT /notes/{note_id} */
  const res = await api.put(`/notes/${noteId}`, { title, content });
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId) {
  /** Calls DELETE /notes/{note_id} */
  await api.delete(`/notes/${noteId}`);
}
