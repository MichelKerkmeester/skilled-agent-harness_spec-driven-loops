// M0 adapter spike: prove every mobile-protocol-v1 kind has a working
// OpenCode call behind it, against whatever version is installed locally.
//
// Usage:  opencode serve --port 4517   (in another terminal, or backgrounded)
//         bun spikes/adapter/spike.ts [playgroundDir]
//
// Exercises, in order:
//   hello       → GET /global/health, GET /config/providers
//   projects    → GET /project
//   sessions    → GET /experimental/session (cross-project, recency-sorted)
//   prompt      → POST /session (with a permission ruleset forcing an ask),
//                 POST /session/{id}/prompt_async, SSE /event
//   permission  → wait for permission.updated, POST /permission/{id}/reply
//   diff        → GET /session/{id}/diff
//
// Every SSE event type seen is tallied and one raw sample of each is dumped
// to spikes/adapter/events/ — that corpus is what docs/protocol-v1.md is
// written from.

const BASE = process.env.OPENCODE_URL ?? "http://127.0.0.1:4517"
const PLAYGROUND = process.argv[2] ?? process.env.SPIKE_PLAYGROUND
if (!PLAYGROUND) {
  console.error("usage: bun spike.ts <playground-git-dir>")
  process.exit(1)
}
// Free-tier model so the spike costs nothing; override if the opencode
// provider isn't configured on this machine.
const MODEL = {
  providerID: process.env.SPIKE_PROVIDER ?? "opencode",
  modelID: process.env.SPIKE_MODEL ?? "big-pickle",
}

const dir = encodeURIComponent(PLAYGROUND)

async function api(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}: ${await res.text()}`)
  return res.json()
}

function step(name: string) {
  console.log(`\n━━ ${name} ${"━".repeat(Math.max(0, 60 - name.length))}`)
}

// ── hello ────────────────────────────────────────────────────────────────
step("hello: health + capabilities")
const health = await api("/global/health")
console.log("server:", JSON.stringify(health))

// ── projects ─────────────────────────────────────────────────────────────
step("projects: GET /project")
const projects = (await api("/project")) as any[]
console.log(`${projects.length} projects known to OpenCode; newest 5 by updated:`)
for (const p of projects
  .filter((p) => p.id !== "global")
  .sort((a, b) => b.time.updated - a.time.updated)
  .slice(0, 5))
  console.log(`  ${p.worktree}  (updated ${new Date(p.time.updated).toISOString().slice(0, 10)})`)

// ── sessions ─────────────────────────────────────────────────────────────
step("sessions: GET /experimental/session (cross-project)")
const sessions = (await api("/experimental/session?limit=5")) as any[]
for (const s of sessions)
  console.log(`  [${s.id.slice(0, 12)}…] ${JSON.stringify(s.title ?? "").slice(0, 60)} dir=${s.directory}`)

// ── event stream ─────────────────────────────────────────────────────────
// The Mac companion's model: one SSE subscription re-emitted to the phone.
// Instance-scoped /event; /global/event would cover all instances at once.
step(`event stream: SSE /event?directory=${PLAYGROUND}`)
const seen = new Map<string, number>()
const samples = new Map<string, any>()
const waiters: { match: (e: any) => boolean; resolve: (e: any) => void }[] = []

function waitFor(match: (e: any) => boolean, timeoutMs = 120_000): Promise<any> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timed out waiting for event")), timeoutMs)
    waiters.push({ match, resolve: (e) => (clearTimeout(t), resolve(e)) })
  })
}

const sse = new AbortController()
const stream = fetch(`${BASE}/event?directory=${dir}`, { signal: sse.signal }).then(async (res) => {
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
  let buf = ""
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buf += value
    let idx
    while ((idx = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, idx)
      buf = buf.slice(idx + 2)
      const data = chunk
        .split("\n")
        .filter((l) => l.startsWith("data: "))
        .map((l) => l.slice(6))
        .join("")
      if (!data) continue
      const event = JSON.parse(data)
      seen.set(event.type, (seen.get(event.type) ?? 0) + 1)
      if (!samples.has(event.type)) samples.set(event.type, event)
      for (let i = waiters.length - 1; i >= 0; i--)
        if (waiters[i]!.match(event)) waiters.splice(i, 1)[0]!.resolve(event)
    }
  }
}).catch((e) => {
  if (!sse.signal.aborted) throw e
})
await Bun.sleep(300) // let the subscription establish
console.log("subscribed")

// ── prompt ───────────────────────────────────────────────────────────────
step("prompt: create session with ask-for-bash ruleset, prompt_async")
const session = await api(`/session?directory=${dir}`, {
  method: "POST",
  body: JSON.stringify({
    title: "m0 adapter spike",
    // Force the approval flow deterministically: every bash call must ask.
    permission: [{ permission: "bash", pattern: "*", action: "ask" }],
  }),
})
console.log("session:", session.id)

await api(`/session/${session.id}/prompt_async?directory=${dir}`, {
  method: "POST",
  body: JSON.stringify({
    model: MODEL,
    parts: [
      {
        type: "text",
        text:
          "Add a one-line docstring to the greet function in greet.py, " +
          "then run `echo spike-ok` in the shell. Do nothing else.",
      },
    ],
  }),
})
console.log("prompt accepted (async) — streaming…")

// ── permission ───────────────────────────────────────────────────────────
// 1.16-era servers emitted `permission.updated`; 1.18 renamed it to
// `permission.asked` (with a `permission.v2.asked` variant alongside).
// Accept both — this is exactly the skew the Mac adapter exists to absorb.
step("permission: wait for the ask, then approve")
const permission = await waitFor(
  (e) =>
    ["permission.asked", "permission.updated"].includes(e.type) &&
    (e.properties?.sessionID ?? e.properties?.request?.sessionID) === session.id,
)
console.log("event type:", permission.type)
const req = permission.properties.request ?? permission.properties
console.log(`agent asks: [${req.permission ?? req.type}] ${JSON.stringify(req.title ?? req.pattern ?? "").slice(0, 80)}`)
console.log("full request keys:", Object.keys(req).join(", "))
await api(`/permission/${req.id}/reply?directory=${dir}`, {
  method: "POST",
  body: JSON.stringify({ reply: "once" }),
})
console.log("replied: once (approved)")

// ── completion ───────────────────────────────────────────────────────────
step("completion: wait for session.idle")
await waitFor((e) => e.type === "session.idle" && e.properties?.sessionID === session.id, 180_000)
console.log("session idle")

// ── diff ─────────────────────────────────────────────────────────────────
// Two sources, different lifetimes: /session/{id}/diff is the LIVE pending
// diff (streams as session.diff events during the turn, empties once the
// turn settles). The durable per-turn record is the user message's
// info.summary.diffs — that's what the phone's review screen reads.
step("diff: live endpoint + per-turn summary")
const live = (await api(`/session/${session.id}/diff?directory=${dir}`)) as any[]
console.log(`live pending diff: ${live.length} files (empty after idle is expected)`)
const transcript = (await api(`/session/${session.id}/message?directory=${dir}`)) as any[]
for (const m of transcript)
  for (const f of m.info?.summary?.diffs ?? []) {
    console.log(`  ${f.file} +${f.additions} -${f.deletions} (${f.status})`)
    console.log(f.patch.split("\n").map((l: string) => "    " + l).join("\n"))
  }

// ── transcript ───────────────────────────────────────────────────────────
step("transcript: GET /session/{id}/message")
const messages = transcript
for (const m of messages) {
  const parts = (m.parts ?? [])
    .map((p: any) => p.type + (p.type === "text" ? `("${(p.text ?? "").slice(0, 50)}…")` : p.type === "tool" ? `[${p.tool}]` : ""))
    .join(" ")
  console.log(`  ${m.info?.role ?? m.role}: ${parts}`)
}

// ── event corpus ─────────────────────────────────────────────────────────
step("event corpus")
sse.abort()
await stream
const outDir = new URL("./events/", import.meta.url).pathname
for (const [type, sample] of samples)
  await Bun.write(`${outDir}${type.replaceAll(".", "_")}.json`, JSON.stringify(sample, null, 2))
console.log("event types seen (count) — samples in spikes/adapter/events/:")
for (const [type, count] of [...seen].sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(count).padStart(4)}  ${type}`)

console.log("\n✅ every protocol-v1 kind exercised: hello, projects, sessions, prompt, permission, diff")
