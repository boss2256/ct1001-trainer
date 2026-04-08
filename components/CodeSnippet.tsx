"use client";

import { Terminal } from "lucide-react";

interface CodeSnippetProps {
  code: string;
  language?: string;
}

export default function CodeSnippet({ code, language = "python" }: CodeSnippetProps) {
  // Tokenize and highlight code
  const tokens = code.split(/(\b\w+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*|[^\w\s])/g);
  
  const highlighted = tokens
    .map((token) => {
      if (!token) return token;
      
      // Keywords
      if (/^(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|pass|break|continue|not|and|or|in|is|lambda|yield|True|False|None|global|nonlocal|del|assert)$/.test(token)) {
        return `<span style="color:#c084fc">${token}</span>`;
      }
      
      // Built-ins
      if (/^(print|input|len|range|int|float|str|bool|list|dict|set|tuple|type|open|enumerate|zip|map|filter|sorted|reversed|sum|max|min|abs|round|super|self)$/.test(token)) {
        return `<span style="color:#60a5fa">${token}</span>`;
      }
      
      // Strings (including f-strings)
      if (/^(f?["'](?:\\.|[^\\"'])*["'])/.test(token)) {
        return `<span style="color:#86efac">${escapeHtml(token)}</span>`;
      }
      
      // Numbers
      if (/^\d+\.?\d*$/.test(token)) {
        return `<span style="color:#fb923c">${token}</span>`;
      }
      
      // Comments
      if (/^#.*/.test(token)) {
        return `<span style="color:#64748b;font-style:italic">${escapeHtml(token)}</span>`;
      }
      
      // Regular text - escape HTML
      return escapeHtml(token);
    })
    .join("");

  function escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return text.replace(/[&<>"']/g, (c) => map[c]);
  }

  return (
    <div className="code-card">
      {/* Header bar */}
      <div className="code-card-header">
        <div className="code-dot" style={{ background: "#ef4444" }} />
        <div className="code-dot" style={{ background: "#f59e0b" }} />
        <div className="code-dot" style={{ background: "#10b981" }} />
        <span style={{ marginLeft: "0.5rem", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <Terminal size={12} />
          {language}
        </span>
      </div>

      {/* Code */}
      <pre
        style={{
          padding: "1.25rem 1.5rem",
          margin: 0,
          overflowX: "auto",
          lineHeight: 1.7,
          fontSize: "0.875rem",
          color: "var(--text-code)",
          tabSize: 4,
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}
