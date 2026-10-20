export type Media = { name: string; type: string; data: Buffer };

const MAX_CONTENT = 2000;
const MAX_FILES = 10;

async function send(url: string, body: FormData | string, headers?: Record<string, string>) {
  return fetch(url, { method: "POST", body, headers });
}

export async function publishToDiscord(text: string, media: Media[] = []) {
  const base = process.env.DISCORD_WEBHOOK_URL;
  if (!base) throw new Error("DISCORD_WEBHOOK_URL is not set");
  // wait=true makes Discord return the created message instead of 204.
  const url = base + (base.includes("?") ? "&" : "?") + "wait=true";

  const content = text.slice(0, MAX_CONTENT);
  const files = media.slice(0, MAX_FILES);

  const build = () => {
    if (files.length === 0) return { body: JSON.stringify({ content }), headers: { "Content-Type": "application/json" } };
    const form = new FormData();
    form.append("payload_json", JSON.stringify({ content }));
    files.forEach((f, i) => {
      form.append(`files[${i}]`, new Blob([new Uint8Array(f.data)], { type: f.type }), f.name);
    });
    return { body: form, headers: undefined };
  };

  let { body, headers } = build();
  let res = await send(url, body, headers);

  if (res.status === 429) {
    const info = await res.json().catch(() => ({ retry_after: 1 }));
    await new Promise((r) => setTimeout(r, Math.ceil((info.retry_after ?? 1) * 1000)));
    ({ body, headers } = build());
    res = await send(url, body, headers);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Discord ${res.status}: ${detail.slice(0, 300)}`);
  }
  const msg = await res.json();
  return { id: msg.id as string };
}