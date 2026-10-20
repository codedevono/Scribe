"use client";
import { useEffect, useRef, useState } from "react";

type Result = { platform: string; ok: boolean; detail?: string };
type Preview = { name: string; url: string | null };

const PLATFORMS = [
  { id: "discord", label: "Discord", ready: true },
  { id: "github", label: "GitHub", ready: false },
  { id: "linkedin", label: "LinkedIn", ready: false },
];
const LABEL: Record<string, string> = { discord: "Discord", github: "GitHub", linkedin: "LinkedIn" };
const DISCORD_LIMIT = 2000;

export default function Home() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [selected, setSelected] = useState<string[]>(["discord"]);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Set the date after mount so server and browser HTML match.
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }));
  }, []);

  // Build image previews and release them when the file list changes.
  useEffect(() => {
    const next = files.map((f) => ({
      name: f.name,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setPreviews(next);
    return () => next.forEach((p) => p.url && URL.revokeObjectURL(p.url));
  }, [files]);

  function addFiles(list: FileList | File[]) {
    const accepted = Array.from(list).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (accepted.length) setFiles((prev) => [...prev, ...accepted]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  const overLimit = selected.includes("discord") && text.length > DISCORD_LIMIT;
  const canPublish = !busy && !overLimit && text.trim().length > 0 && selected.length > 0;

  async function publish() {
    if (!canPublish) return;
    setBusy(true);
    setError("");
    setResults([]);
    const form = new FormData();
    form.append("text", text);
    selected.forEach((p) => form.append("platforms", p));
    files.forEach((f) => form.append("media", f));
    try {
      const res = await fetch("/api/publish", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong. Try again.");
      else setResults(data.results);
    } catch {
      setError("Could not reach the app. Check that npm run dev is still running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="top">
        <span className="wordmark">Scribe</span>
      </header>

      <section className="sheet">
        <h1 className="entry-date">{today || "\u00A0"}</h1>
        <textarea
          className="write"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") publish();
          }}
          placeholder="What did you work on, and what did you learn?"
          aria-label="Your update"
        />
        <div className="sheet-foot">
          {selected.includes("discord") && (
            <span className={overLimit ? "count over" : "count"}>
              {text.length} of {DISCORD_LIMIT} characters for Discord
            </span>
          )}
        </div>
      </section>

      <section className="tray">
        <div
          className={dragging ? "drop dragging" : "drop"}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <button type="button" className="add" onClick={() => fileInput.current?.click()}>
            Add photos or video
          </button>
          <span className="drop-hint">or drop them here</span>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {previews.length > 0 && (
          <ul className="thumbs">
            {previews.map((p, i) => (
              <li className="thumb" key={`${p.name}-${i}`}>
                {p.url ? <img src={p.url} alt={p.name} /> : <span>{p.name}</span>}
                <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${p.name}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="row">
          <div className="chips" role="group" aria-label="Publish to">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="chip"
                aria-pressed={selected.includes(p.id)}
                disabled={!p.ready}
                onClick={() => toggle(p.id)}
              >
                {p.label}
                {!p.ready && <small>soon</small>}
              </button>
            ))}
          </div>
          <button type="button" className="publish" onClick={publish} disabled={!canPublish}>
            {busy ? "Publishing…" : "Publish"}
          </button>
        </div>
        <p className="hint">Ctrl or Cmd + Enter also publishes.</p>

        {overLimit && (
          <p className="note bad">Shorten your update to {DISCORD_LIMIT} characters to publish to Discord.</p>
        )}
        {error && (
          <p className="note bad" role="alert">
            {error}
          </p>
        )}
        <ul className="results" aria-live="polite">
          {results.map((r) => (
            <li key={r.platform} className={r.ok ? "ok" : "bad"}>
              {r.ok
                ? `Published to ${LABEL[r.platform] ?? r.platform}`
                : `Couldn't publish to ${LABEL[r.platform] ?? r.platform}: ${r.detail ?? "unknown error"}`}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}