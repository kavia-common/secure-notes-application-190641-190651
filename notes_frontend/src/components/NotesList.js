import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import "../App.css";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

function excerpt(content) {
  const s = String(content || "").trim().replace(/\s+/g, " ");
  if (!s) return "";
  return s.length > 90 ? `${s.slice(0, 90)}…` : s;
}

// PUBLIC_INTERFACE
export function NotesList({
  notes,
  selectedId,
  loading,
  error,
  search,
  setSearch,
  onSelect,
  onCreateClick,
}) {
  /** Sidebar list for notes with search input. */
  const [localSearch, setLocalSearch] = useState(search || "");
  const debounced = useDebouncedValue(localSearch, 350);

  // Keep parent in sync once debounced changes.
  React.useEffect(() => {
    setSearch(debounced);
  }, [debounced, setSearch]);

  const list = useMemo(() => notes || [], [notes]);

  return (
    <div className="card sidebar" aria-label="Notes sidebar">
      <div className="sidebarHeader">
        <div className="row">
          <input
            className="input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search notes…"
            aria-label="Search notes"
          />
          <button className="btn btn-primary" onClick={onCreateClick} type="button">
            New
          </button>
        </div>
        <div className="helper" style={{ marginTop: 10 }}>
          Server search uses <kbd>q</kbd> query param.
        </div>
      </div>

      <div className="sidebarList">
        {loading ? (
          <div style={{ display: "grid", gap: 10, padding: 6 }}>
            <div className="skeleton" style={{ height: 66 }} />
            <div className="skeleton" style={{ height: 66 }} />
            <div className="skeleton" style={{ height: 66 }} />
          </div>
        ) : error ? (
          <div className="emptyState">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Could not load notes</div>
            <div className="helper">{String(error)}</div>
          </div>
        ) : list.length === 0 ? (
          <div className="emptyState">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              {debounced ? "No matches" : "No notes yet"}
            </div>
            <div className="helper">
              {debounced ? "Try a different search term." : "Create your first note with “New”."}
            </div>
          </div>
        ) : (
          list.map((n) => {
            const active = n.id === selectedId;
            return (
              <button
                key={n.id}
                className={`noteItem ${active ? "noteItemActive" : ""}`}
                onClick={() => onSelect(n)}
                type="button"
              >
                <div className="noteTitle">{n.title || "Untitled"}</div>
                <div className="noteMeta">
                  Updated {dayjs(n.updated_at).format("MMM D, YYYY h:mm A")}
                </div>
                <div className="noteExcerpt">{excerpt(n.content)}</div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
