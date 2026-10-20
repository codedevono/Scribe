import { NextResponse } from "next/server";
import { publishToDiscord, type Media } from "@/lib/discord";

export const runtime = "nodejs";

type Result = { platform: string; ok: boolean; detail?: string };

export async function POST(req: Request) {
  const form = await req.formData();
  const text = String(form.get("text") ?? "").trim();
  const platforms = form.getAll("platforms").map(String);
  if (!text) return NextResponse.json({ error: "Write something first." }, { status: 400 });
  if (platforms.length === 0) return NextResponse.json({ error: "Pick at least one platform." }, { status: 400 });

  const media: Media[] = [];
  for (const f of form.getAll("media")) {
    if (f instanceof File && f.size > 0) {
      media.push({ name: f.name, type: f.type || "application/octet-stream", data: Buffer.from(await f.arrayBuffer()) });
    }
  }

  const results: Result[] = [];
  for (const p of platforms) {
    try {
      if (p === "discord") {
        const r = await publishToDiscord(text, media);
        results.push({ platform: p, ok: true, detail: r.id });
      } else {
        results.push({ platform: p, ok: false, detail: "Not built yet" });
      }
    } catch (e) {
      results.push({ platform: p, ok: false, detail: e instanceof Error ? e.message : String(e) });
    }
  }
  return NextResponse.json({ results });
}