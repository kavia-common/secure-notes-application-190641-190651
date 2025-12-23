import React from "react";
import "../App.css";

// PUBLIC_INTERFACE
export class ErrorBoundary extends React.Component {
  /** Catches rendering errors and shows a friendly message instead of crashing the whole app. */
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Unexpected error" };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("UI ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div className="card authWrap">
            <h1 className="h1">Something went wrong</h1>
            <p className="sub">
              The app hit an unexpected error. Refresh the page to try again.
            </p>
            <p className="helper">Details: {this.state.message}</p>
            <div className="formActions">
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
