import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "../App.css";
import { createNote, deleteNote, listNotes, updateNote } from "../api/notesApi";
import { NotesList } from "../components/NotesList";
import { NoteEditor } from "../components/NoteEditor";
import { useToasts } from "../components/ToastProvider";

// PUBLIC_INTERFACE
export function AppPage() {
  /** Main protected application view (notes list + detail panel). */
  const { pushToast } = useToasts();

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState("create");
  const [editorNote, setEditorNote] = useState(null);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const refresh = useCallback(
    async (q) => {
      try {
        setLoadError("");
        setLoading(true);
        const data = await listNotes({ q });
        setNotes(data);
        // Keep selection if possible.
        setSelectedId((prev) => {
          if (prev && data.some((n) => n.id === prev)) return prev;
          return data[0]?.id ?? null;
        });
      } catch (err) {
        const msg =
          err?.response?.data?.detail || err?.message || "Failed to fetch notes.";
        setLoadError(String(msg));
        pushToast({ title: "Error", description: String(msg), variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [pushToast]
  );

  useEffect(() => {
    refresh(search);
  }, [refresh, search]);

  const openCreate = () => {
    setEditorMode("create");
    setEditorNote(null);
    setEditorOpen(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setEditorMode("edit");
    setEditorNote(selected);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditorNote(null);
  };

  const onSave = async ({ title, content }) => {
    try {
      setSaving(true);
      if (editorMode === "create") {
        const created = await createNote({ title, content });
        pushToast({ title: "Saved", description: "New note created." });
        // Re-fetch to keep list consistent with server ordering/search
        await refresh(search);
        setSelectedId(created.id);
      } else if (editorMode === "edit" && editorNote) {
        const updated = await updateNote(editorNote.id, { title, content });
        pushToast({ title: "Updated", description: "Note updated." });
        await refresh(search);
        setSelectedId(updated.id);
      }
      closeEditor();
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "Failed to save note.";
      pushToast({ title: "Save failed", description: String(msg), variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (note) => {
    if (!note) return;
    const ok = window.confirm("Delete this note? This cannot be undone.");
    if (!ok) return;

    try {
      setSaving(true);
      await deleteNote(note.id);
      pushToast({ title: "Deleted", description: "Note removed." });
      await refresh(search);
      closeEditor();
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "Failed to delete note.";
      pushToast({ title: "Delete failed", description: String(msg), variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="layout">
        <NotesList
          notes={notes}
          selectedId={selectedId}
          loading={loading}
          error={loadError}
          search={search}
          setSearch={setSearch}
          onSelect={(n) => setSelectedId(n.id)}
          onCreateClick={openCreate}
        />

        <div className="card mainPanel" aria-label="Main note panel">
          <div className="mainHeader">
            <div>
              <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                {selected?.title || "Select a note"}
              </div>
              <div className="helper">
                {selected
                  ? `Updated ${dayjs(selected.updated_at).format("MMM D, YYYY h:mm A")}`
                  : loading
                    ? "Loading…"
                    : "Pick a note on the left or create a new one."}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={openCreate} type="button">
                New
              </button>
              <button className="btn btn-primary" onClick={openEdit} disabled={!selected} type="button">
                Edit
              </button>
            </div>
          </div>

          <div className="mainBody">
            {loading ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div className="skeleton" style={{ height: 18, width: "62%" }} />
                <div className="skeleton" style={{ height: 14, width: "45%" }} />
                <div className="skeleton" style={{ height: 180 }} />
              </div>
            ) : selected ? (
              <div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{selected.content}</div>
              </div>
            ) : (
              <div className="emptyState">
                <div style={{ fontWeight: 900, marginBottom: 6 }}>No note selected</div>
                <div className="helper">
                  Create one or select from the sidebar.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NoteEditor
        mode={editorMode}
        note={editorMode === "edit" ? editorNote : null}
        open={editorOpen}
        onClose={closeEditor}
        onSave={onSave}
        onDelete={onDelete}
        busy={saving}
      />
    </div>
  );
}
