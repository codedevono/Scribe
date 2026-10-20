"use client";
import { useState } from "react";

type Result = { platform: string; ok: boolean; detail?: string };

export default function Home() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [discord, setDiscord] = useState(true);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");

  async function publish() {
    setBusy(true); setError(""); setResults([]);
    const form = new FormData();
    form.append("text", text);
    if (discord) form.append("platforms", "discord");
    files.forEach((f) => form.append("media", f));
    try {
      const res = await fetch("/api/publish", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong.");
      else setResults(data.results);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Scribe</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="What did you do today?"
        style={{ width: "100%", padding: 8 }}
      />
      <p>
        <input type="file" multiple accept="image/*,video/*" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
      </p>
      <p>
        <label><input type="checkbox" checked={discord} onChange={(e) => setDiscord(e.target.checked)} /> Discord</label>{" "}
        <label style={{ opacity: 0.5 }}><input type="checkbox" disabled /> GitHub (soon)</label>{" "}
        <label style={{ opacity: 0.5 }}><input type="checkbox" disabled /> LinkedIn (soon)</label>
      </p>
      <button onClick={publish} disabled={busy || !text.trim()}>{busy ? "Publishing..." : "Publish"}</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul>
        {results.map((r) => (
          <li key={r.platform}>{r.platform}: {r.ok ? "published" : `failed - ${r.detail}`}</li>
        ))}
      </ul>
    </main>
  );
}