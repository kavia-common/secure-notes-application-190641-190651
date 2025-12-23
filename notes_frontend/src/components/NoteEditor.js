import React, { useEffect, useMemo, useState } from "react";
import "../App.css";

// PUBLIC_INTERFACE
export function NoteEditor({
  mode, // "create" | "edit"
  note,
  open,
  onClose,
  onSave,
  onDelete,
  busy,
}) {
  /** Modal editor for creating/editing a note. */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [open, note]);

  const validation = useMemo(() => {
    const errors = {};
    if (!String(title || "").trim()) errors.title = "Title is required.";
    if (!String(content || "").trim()) errors.content = "Content is required.";
    return errors;
  }, [title, content]);

  const canSave = Object.keys(validation).length === 0 && !busy;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ title: title.trim(), content });
  };

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="card modal">
        <div className="modalHeader">
          <h2 className="modalTitle">
            {mode === "create" ? "Create note" : "Edit note"}
          </h2>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modalBody">
            <div>
              <label className="label" htmlFor="noteTitle">
                Title
              </label>
              <input
                id="noteTitle"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Things to remember"
              />
              {validation.title ? <div className="errorText">{validation.title}</div> : null}
            </div>

            <div>
              <label className="label" htmlFor="noteContent">
                Content
              </label>
              <textarea
                id="noteContent"
                className="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note…"
              />
              {validation.content ? (
                <div className="errorText">{validation.content}</div>
              ) : null}
            </div>

            <div className="formActions">
              {mode === "edit" ? (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => onDelete(note)}
                  disabled={busy}
                >
                  Delete
                </button>
              ) : (
                <div />
              )}

              <button className="btn" type="button" onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={!canSave}>
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
