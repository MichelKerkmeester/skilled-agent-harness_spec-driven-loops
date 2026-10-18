# Iteration 4 — A4: Event streams and the UI half

## Focus

Which v1 event types and payload fields the repo's plugin fleet and `cli-opencode` consumers depend on (`session.created`, `session.idle`, `session.compacted`, `message.*`, `permission.*`), what their v2 equivalents are via `ctx.event.subscribe()`, how `opencode run --format json` differs between versions, and whether a repo-local plugin can render TUI output (a toast) on v2 through `cli.json` and the `./tui` export.

## Actions Taken

1. Enumerated every event-name literal in `.skilled/plugins/**`, located each `event:` handler, and collected every `event.properties` field read.
2. Read the one real dual-version plugin on this machine — `~/.config/opencode/plugins/orca-opencode-status.js`, the plugin the brief names as already running on both hosts — for its export selector, its v2 `ctx.event.subscribe()` loop, its v2→v1 event translator, and its TUI adapter.
3. Read both v2 doc pages: `https://opencode.ai/v2/docs/build/plugins/cli/` and `https://opencode.ai/v2/docs/cli/plugins/`.
4. Read the home TUI config `~/.config/opencode/tui.json` as a working v1 TUI-plugin registration, and checked that no `cli.json` exists yet.
5. Traced the `--format json` claim in cli-opencode to its consumers, then searched the repo for a captured real v1 stream and inspected it.
6. Attempted `opencode run --help` / `opencode2 run --help` for a flag diff — **blocked** by the local dispatch guard (F10).

## Findings

### F1 (P0) — The fleet's event contract is v1-only, on a different transport, with different field names

The repo's plugins receive events through the v1 hooks bag: `event: async ({ event }) => …` reading `event.type` / `event.properties` [SOURCE: .skilled/plugins/system-skill-advisor.js:1382] [SOURCE: .skilled/plugins/opencode-goal.js:3312]. v2 has no hooks bag. The working dual-version plugin consumes a server-side **async iterable** — `for await (const input of ctx.event.subscribe({ signal: controller.signal }))` yielding `{ type, data }` — and registers prompt delivery separately through `ctx.session.hook("prompt", …)` (`~/.config/opencode/plugins/orca-opencode-status.js:1281`–`1290`).

Three non-cosmetic consequences:

- `event.properties` becomes `input.data`, so every field read in the fleet needs an adapter.
- Push callbacks become a stream that must be drained inside a long-lived task and cancelled through an `AbortController` returned from the cleanup function (`~/.config/opencode/plugins/orca-opencode-status.js:1284`–`1300`). There is no per-event hook to return from.
- Version detection can only be a **feature probe on the context**, because no version field is guaranteed: the reference plugin gates on `typeof ctx.session?.hook !== "function" || typeof ctx.event?.subscribe !== "function"` → no-op (`~/.config/opencode/plugins/orca-opencode-status.js:1268`).

### F2 (P0) — `session.idle` and `session.compacted` are the two load-bearing v1 events with no v2 peer

Fleet dependencies, exhaustively:

| v1 event | Consumers | Payload fields read |
|---|---|---|
| `session.created` | skill-advisor:1386, spec-gate:182, completion-sentinel:132, session-cleanup (via `properties.info.id` at :239), goal:710 | `properties.info.id`, `properties.sessionID` |
| `session.deleted` | skill-advisor:1420, spec-gate:196 | `properties.info.id` |
| `session.idle` | completion-sentinel:136 (**its only trigger**), goal:3262 | `properties.sessionID` |
| `session.compacted` (and the `session.compact` alias) | skill-advisor:770 + :1403, spec-gate:187 | — |
| `session.resumed` | skill-advisor:769 + :1402, spec-gate:186 | — |
| `message.updated` | goal:3230 | `properties.info.{id,role,sessionID}` |
| `message.part.updated` | goal:3235 | `properties.part.sessionID` |
| `permission.asked` | goal:3246 | `properties.{id,sessionID}` |
| `permission.replied` | goal:3254 | `properties.requestID` |
| `server.instance.disposed` / `global.disposed` | skill-advisor:1441, dist-freshness:220 | — |

v2 correspondence, from the reference translator's *input* vocabulary:

- `session.created` exists in both, but v2 carries `sessionID` at top level while v1 carries `info.id`; the adapter synthesizes the v1 shape (`~/.config/opencode/plugins/orca-opencode-status.js:1201`–`1203`).
- `session.idle` is **not** an input to the v2 translator. Idle reaches the shared handler only as a synthesized `session.status { type: "idle" }` derived from `session.execution.succeeded` / `session.execution.failed` / `session.execution.interrupted` (`~/.config/opencode/plugins/orca-opencode-status.js:1204`–`1208`).
- `session.compacted` has **no v2 counterpart anywhere** in the observed vocabulary — not in the translator, not in the TUI event list. Its two repo consumers (skill-advisor context re-injection, spec-gate re-arm) lose their trigger outright.
- `session.resumed` is not in the v2 set either; both repo consumers already guard it defensively, so it is a pre-existing soft dependency, not a new gap.
- `server.instance.disposed` has no v2 equivalent: teardown is the cleanup function `setup` returns plus aborting the subscription (`~/.config/opencode/plugins/orca-opencode-status.js:1296`–`1300`).

### F3 (P1) — `permission.*` and `question.*` payload fields are renamed, and questions become forms

The translator rewrites `permission.asked` properties `action` → `permission` and `resources` → `patterns` (`~/.config/opencode/plugins/orca-opencode-status.js:1209`–`1211`). The v1 consumers read exactly the *target* names, so a v2 plugin must either keep the translator or have `opencode-goal.js:3246`–`3258` rewritten to the v2 names.

Questions are a bigger break: v2 emits `form.created` / `form.replied` / `form.cancelled` with a nested `form` object (`form.fields[]`, and `id` rewritten to `requestID` on reply), which the adapter has to rebuild into v1's `question.asked` option shape (`~/.config/opencode/plugins/orca-opencode-status.js:1212`–`1233`). `opencode-goal.js:3246` and `:3254` consume `question.asked` / `question.replied` / `question.rejected`, so goal-tracking on v2 depends on that reconstruction.

### F4 (P1) — v2's own event vocabulary is not stable; the reference plugin carries two normalizers

Two distinct v2-era naming schemes appear in the same 72 KB plugin:

- `normalizeNextLifecycleEvent` handles `permission.v2.asked`, `permission.v2.replied`, `question.v2.*`, `session.next.step.started`, `session.next.tool.called`, `session.next.tool.progress`, `session.next.retried`, and rewrites them into `permission.asked` / `session.status` (`~/.config/opencode/plugins/orca-opencode-status.js:851`–`860`, :977–`979`).
- `translateOpenCode2Event` handles `session.execution.*`, `session.text.*`, `form.*`, and rewrites `session.text.*` into `session.next.text.*` (`~/.config/opencode/plugins/orca-opencode-status.js:1198`–`1238`).

So a dual-compat design must **normalize, never pin**: naming either scheme as "the v2 event API" guarantees breakage on the other. This also means the v2 half of any port needs its own regression test per event family, not a one-time mapping.

### F5 (P0 for the plugin-shape question) — One module can host both contracts, but only through a load-time selector

The reference plugin ends with:

```js
// OpenCode 1 requires a callable default; OpenCode 2 validates a plugin object.
export default process.env.ORCA_OPENCODE_PLUGIN_API === "v1" ? OrcaOpenCodeStatusPlugin : {
  id: "orca-opencode-status",
  server: OrcaOpenCodeStatusPlugin,
  setup: setupOpenCode2Status,
}
```

(`~/.config/opencode/plugins/orca-opencode-status.js:1646`–`1651`)

Two facts follow. First, **no single shape satisfies both loaders** — v1 needs a callable default, v2 validates an object, and iteration 1 established that v2 rejects a function carrying `.id`/`.setup`. Second, a **two-file split is not mandatory**: one file suffices because the shape is chosen at module-evaluation time. The `server` field is the bridge that lets the v2 object reuse the entire v1 hooks implementation instead of duplicating it — the v2 `setup` builds a synthetic `client`, calls the v1 factory, and forwards translated events into `hooks.event(...)` (`~/.config/opencode/plugins/orca-opencode-status.js:1271`–`1290`).

Cost: the selector is currently an **environment variable** (`ORCA_OPENCODE_PLUGIN_API=v1`), i.e. the caller decides, not the host. A repo-installed plugin cannot rely on the user exporting a variable, so the port needs a host-derived selector (feature-probe on the module's inputs or a config-file read) instead of an env flag.

### F6 (P1) — v2's documented discovery layout is per-plugin directories; the repo ships 16 flat files

v2 documents discovery as package-shaped directories:

```text
<global-config>/plugins/status/index.ts
<global-config>/plugins/status/tui.ts
<project>/.opencode/plugins/status/index.ts
<project>/.opencode/plugins/status/tui.ts
```

Each plugin uses "the same layout as a published package, with server and TUI entrypoints kept together" (`https://opencode.ai/v2/docs/cli/plugins/`).

The repo's fleet is 16 flat `.js` files directly under `.opencode/plugins/` plus one symlinked module (`sk-vision.js` → `../skills/sk-vision/vision-runtime/dist/plugin.js`), loaded by a flat non-recursive glob [SOURCE: .opencode/plugins/README.md:16]. Whether v2's CLI still honours flat files is **UNVERIFIED** — the docs describe only the directory layout. If flat files are unsupported, the port is a **layout migration** (16 directories, each with an entry file) before any code change, and the symlinked `sk-vision.js` becomes a directory-level decision as well.

Also note: server plugins registered in `opencode.json(c)` that expose a TUI component are loaded by the v2 CLI automatically, and `cli.json` is only needed for **CLI-only** plugins that must keep working against a remote server (`https://opencode.ai/v2/docs/cli/plugins/`).

### F7 (P2) — TUI output is fully available on v2, and **no repo plugin needs it**

v2 CLI plugins import `@opencode/plugin/tui` and use `Plugin.define({ id, setup })`; inside `setup`:

- `context.ui.toast.show({ message, variant })` — the canonical "plugin loaded" example (`https://opencode.ai/v2/docs/build/plugins/cli/`).
- `context.data.on(type, cb)` / `context.data.listen(cb)` for server events, both returning an unsubscribe.
- `context.attention.notify({ title, message, notification: { when }, sound })`, `context.ui.dialog.{alert,confirm,prompt,select}`, `context.keymap.layer(...)`, `context.storage.store|memory`, `context.client.plugin.list(...)`, plus `context.renderer` / `context.theme` for OpenTUI JSX.

On v1, the same job is done by a `tui.json` entry (singular `plugin` key) pointing at a module that receives the v1 TUI `api` (`api.event.on(type, cb)`, `api.route.current`) — see `~/.config/opencode/tui.json` and the adapter at `~/.config/opencode/plugins/orca-opencode-status.js:1169`–`1182`, which maps v2's `ctx.data.listen` onto that v1 `api.event.on` surface.

Critically: a grep for `showToast`, `client.tui`, `toast` and `tui.` across `.skilled/plugins/*.js` returns **zero hits**. None of the 16 plugins renders UI. The toast capability therefore **does not gate the fleet port**; it is only a requirement for out-of-repo tooling like Orca's status plugin, which is already branched.

### F8 (P2) — The TUI config keys diverge and neither host is documented to accept the other

| | v1 (1.19.x) | v2 (2.0.x) |
|---|---|---|
| File | `tui.json` | `cli.json` |
| Key | `plugin` (singular) | `plugins` (plural) |
| Entry forms | `file://` URL (observed), module path | package, `pkg@version`, `./rel`, `../rel`, `/abs`, `file://`, `{ package, options }` |
| Disable / wildcard | none observed | `-`-prefixed ids and `*` wildcards, entries processed in order |
| Server-plugin TUI auto-load | n/a | yes, from `opencode.json(c)` |

Evidence for the v1 column is the live home config (`~/.config/opencode/tui.json` holds a single `plugin` array with one `file://` entry); for v2 it is `https://opencode.ai/v2/docs/cli/plugins/`. A dual-version install must therefore ship **both** files, and no documentation states either host tolerates the other's key or filename.

### F9 (P1) — cli-opencode's documented `--format json` vocabulary looks invented, and nothing parses it

`references/opencode-tools.md:107` states `--format json` "emits a newline-delimited JSON stream with typed events: `session.started`, `message.delta`, `tool.call`, `tool.result`, `session.completed`" with a `session_id` per event [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:107]. The only consumers of those names are the doc's own `jq` examples a few lines below [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:123]. No production parser in the repo reads them: the deep-loop runtime has no `--format json` reader at all, and its only related fixtures are test shims.

A real captured v1 stream **is** in the repo: `specs/system-deep-loop/039-deprecate-improvement-modes/001-removal-research/001-model-benchmark-inventory/research/lineages/deepseek/logs/fanout-lineage.out:1`. Its records are shaped `{ type, timestamp, sessionID, id, messageID, part: { … } }` with tool parts carrying `part.type`, `part.tool`, `part.callID`, `part.state.{status,input,output,metadata,title}` — a per-part stream, not `session.started` / `message.delta` / `tool.call`.

(Byte-level caveat: this environment's bash output pipeline visibly mangles some token sequences — `require('node:child_process')` rendered as `require('n')`, `jq` as `n` — so the captured stream's exact `part.type` literals must be re-read with the `read` tool before they are quoted as ground truth. The *shape* above is unambiguous; the literal event names are not yet.)

Conclusion for Q4: the cli-opencode flag/subcommand matrix **cannot be written from the existing documentation** — the JSON half of it is contradicted by the repo's own captured output, so v2's `--format json` and `--standalone` behaviour must be captured empirically before it is documented.

### F10 (P2, environment blocker) — Local CLI invocation is refused here

`opencode run --help` and `opencode2 run --help` were both refused by the local dispatch guard ("Pi dispatch denied: the command does not prove one direct executor"), which blocks any `opencode`/`opencode2` invocation from this session. Both binaries are installed (`opencode --version` → `1.19.3`, `opencode2 --version` → `opencode v2.0.32`). Deferred work: run the help diff and a one-token `run --format json` capture from an unguarded shell, or take the v2 schema from the `opencode2 api` surface.

### Old → new event map (fleet-relevant)

| v1 event | v1 payload read by the fleet | v2 peer | v2 payload / adaptation | Port risk |
|---|---|---|---|---|
| `session.created` | `properties.info.id` [SOURCE: .skilled/plugins/session-cleanup.js:239] | `session.created` | top-level `sessionID`; adapter synthesizes `info.id` | Low |
| `session.deleted` | `properties.info.id` [SOURCE: .skilled/plugins/system-spec-gate.js:196] | `session.deleted` | same synthesis | Low |
| `session.idle` | `properties.sessionID` [SOURCE: .skilled/plugins/system-completion-sentinel.js:136] | none — derive from `session.execution.succeeded\|failed\|interrupted` | synthesize `session.status{type:"idle"}` | **High** (sentinel's sole trigger) |
| `session.compacted` | — [SOURCE: .skilled/plugins/system-skill-advisor.js:770] | **none observed** | no substitute; needs a different re-arm signal | **High** |
| `session.resumed` | — [SOURCE: .skilled/plugins/system-spec-gate.js:186] | none observed | already defensive in both consumers | Low |
| `message.updated` | `properties.info.{id,role,sessionID}` [SOURCE: .skilled/plugins/opencode-goal.js:3230] | `message.updated` present, but token accounting moves to `session.text.*` | map `data.info.*` | Medium |
| `message.part.updated` | `properties.part.sessionID` [SOURCE: .skilled/plugins/opencode-goal.js:3235] | `session.text.delta` / `session.next.text.delta` | two competing names (F4) | **High** |
| `permission.asked` | `properties.{id,sessionID}` [SOURCE: .skilled/plugins/opencode-goal.js:3246] | `permission.asked` (+ `permission.v2.asked`) | fields `action`→`permission`, `resources`→`patterns` | Medium |
| `permission.replied` | `properties.requestID` [SOURCE: .skilled/plugins/opencode-goal.js:3254] | `permission.replied` (+ `permission.v2.replied`) | rename fields | Medium |
| `question.asked` / `.replied` / `.rejected` | option shape from `properties.questions` [SOURCE: .skilled/plugins/opencode-goal.js:3246] | `form.created` / `form.replied` / `form.cancelled` | rebuild questions from `form.fields`, `id`→`requestID` | **High** |
| `server.instance.disposed` | teardown [SOURCE: .skilled/plugins/system-dist-freshness-guard.js:220] | none | return a cleanup fn; abort the subscription | Low |
| — | — | `session.inbox.enqueued`, `session.execution.*`, `session.next.*` | new-only; no v1 consumer | n/a |

### UI capability table

| Capability | v1 (1.19.x) | v2 (2.0.x) | Repo need |
|---|---|---|---|
| Register a TUI plugin | `tui.json` → `plugin: ["file://…"]` | `cli.json` → `plugins: [...]`, or auto from `opencode.json(c)` | Orca only |
| Toast | via the v1 TUI `api` surface | `context.ui.toast.show({ message, variant })` | none |
| Server → UI event push | `api.event.on(type, cb)` | `context.data.on(type, cb)` / `context.data.listen(cb)` | Orca only |
| Attention / sound | — | `context.attention.notify({...})` | none |
| Dialogs | — | `context.ui.dialog.{alert,confirm,prompt,select}` | none |
| Keymap + palette commands | — | `context.keymap.layer({...})`, `context.keymap.dispatch(...)` | none |
| Durable UI state | — | `context.storage.store(...)` / `.memory(...)` | none |
| Markdown code-block renderer | — | `context.markdown.registerCodeBlockRenderer(...)` | none |
| Discovery shape | flat files in `.opencode/plugins/` (repo README:16) | per-plugin dirs `<name>/index.ts` + `<name>/tui.ts` (docs) | **all 16** |
| Import for TUI entry | none (module-level `api`) | `@opencode/plugin/tui` | none |

## Questions Answered

None of the five strategy questions is fully satisfied. Q3 (*hooks, guards and dependencies version-aware*) and Q4 (*cli-opencode dispatch matrix*) each moved substantially: Q3 now has a concrete, evidenced pattern set (feature-probe the context, translate the event vocabulary, rename payload fields, adapt the response envelope, select the export shape at load time), but its "plugin dependencies" half is untouched; Q4 now has the `--format json` half **invalidated** rather than answered, which is progress of a sort.

One carried-forward question from iteration 1 is settled: *"Can one module default-export satisfy both contracts, or is a two-file split mandatory?"* — neither. One module can, via a load-time selector on the default export, because the shape is resolved when the module is evaluated; a two-file split is optional, not mandatory.

## Questions Remaining

1. Does v2's CLI still load **flat** `.opencode/plugins/*.js`, or only the documented per-plugin directories? (blocking the layout decision; P0)
2. Does v2 emit any compaction event at all, and what should replace `session.compacted` for skill-advisor's context re-injection and spec-gate's re-arm? (P0)
3. Can `session.idle` be derived reliably from `session.execution.*` for `system-completion-sentinel`, whose entire behaviour rests on that event? (P0)
4. Which v2 event scheme is current — `session.next.*` / `permission.v2.*` or `session.execution.*` / `form.*` — and does 2.0.32 emit both? (P1)
5. What is v2's real `run --format json` output, and does `--standalone` change it? (P1, blocked locally by F10)
6. Is the host-derived replacement for `ORCA_OPENCODE_PLUGIN_API` (the env-gated selector) available in both hosts, or does each plugin need two entry files after all? (P1)

## Next Focus

A5: settlement of the three P0 gaps. (a) Probe v2 flat-file discovery with a throwaway project in `scratch/` — one flat `.js` plugin that writes a marker plus one directory-shaped plugin `<name>/index.ts` — and compare which marker appears; that single experiment decides whether the 16-plugin port is a code change or a layout migration. (b) Establish the compaction and idle substitutes by capturing a v2 session that compacts: subscribe to `ctx.event.subscribe()` and dump every `input.type` into a file, then trigger `/compact`. (c) Re-read the captured v1 stream at `specs/system-deep-loop/039-…/logs/fanout-lineage.out` with the `read` tool (not grep) to fix the literal `part.type` names, since the bash pipeline obscures them.

## SCOPE VIOLATIONS

None. Only this iteration's narrative and delta files were written, plus the append-gateway call into the run directory. The researched surfaces (`.skilled/plugins/**`, `~/.config/opencode/**`, the 039 lineage logs) were read only. `opencode`/`opencode2` were never invoked successfully, so no project state exists to clean up.

## GATEWAY OBSERVATION (f-iter004-011, P1)

The append gateway accepted the record — `ok:true`, ledger stream sequence 9, `projectionRefreshed:true`, exit 0 — with one warning: "Trusted evidence yield was absent and remains explicitly zero." The refreshed `deep-research-state.jsonl` row is again the reduced projection, carrying only `type, iteration, run, status, newInfoRatio, ruledOut, timestamp`. `answeredQuestions` and the 12-node / 11-edge `graphEvents` array were dropped in transit, exactly as iteration 1 recorded in `f-iter001-007`.

Consequence, unchanged: the reducer reading the state log alone sees `iteration:4` with no identity fields and an empty convergence graph. `deltas/iter-004.jsonl` therefore remains the authoritative artifact — 19 lines, all JSON-valid, one `type:"iteration"` record and 11 findings.
