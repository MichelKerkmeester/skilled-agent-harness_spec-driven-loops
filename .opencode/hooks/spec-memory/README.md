---
title: "Spec Memory Hook: OpenCode Continuity Retrieval"
description: "OpenCode plugin that surfaces Spec-Kit memory continuity into a session via a warm bridge subprocess; an OpenCode-plugin-only concern with no cross-runtime hook equivalent by design."
trigger_phrases:
  - "spec memory plugin"
  - "continuity retrieval hook"
  - "system spec memory"
importance_tier: "reference"
contextType: "reference"
---

# Spec Memory Hook: OpenCode Continuity Retrieval

---

## 1. OVERVIEW

`spec-memory/` is the index for the spec-memory concern. The plugin bridges the Spec-Kit Memory engine into an OpenCode session so continuity and prior-work context are retrievable at runtime: on each chat system transform it asks a warm bridge subprocess for a continuity brief and, when one is returned, appends it as a marked system block the model sees. It also exposes a read-only status tool so the operator can inspect bridge health without leaking local paths.

This is an **OpenCode-plugin-only** concern by design. It hooks OpenCode's plugin API (`experimental.chat.system.transform`, `event`, `tool`) and has no equivalent lifecycle event on the other runtimes — the coverage matrix marks Claude, Codex, Cursor, Devin, and Pi `by-design: OpenCode plugin owns continuity retrieval`. The real code lives at `.opencode/plugins/system-spec-memory.js` and is mirrored here via a browsability symlink; nothing loads through the symlink (OpenCode's loader globs `.opencode/plugins/`, not this tree).

The single most important property is that it **fails open**. A disabled plugin, a bridge timeout, a spawn error, a non-zero exit, a stdout overflow, a parse failure, or any internal error resolves to "no brief appended" — the conversation proceeds untouched. The plugin never blocks, denies, or throws into the host.

---

## 2. WHAT IT DOES

The plugin registers three hooks:

**`experimental.chat.system.transform`** — the primary surface. On each transform it resolves the session id, checks the per-session/per-workspace continuity cache (TTL-bounded, LRU-evicted), and on a miss spawns the warm bridge subprocess (`system-spec-memory-bridge.mjs`) with a JSON payload (`request: "brief"`, workspace root, timeouts, optional spec folder, session id). The bridge returns `{ status, brief, data, metadata }` where status is `ok` / `skipped` / `fail_open`. On `ok` with a non-empty brief, the plugin clamps the brief to `maxBriefChars`, appends a content-digest marker `[system-spec-memory:continuity:<16-hex>]`, deduplicates against an existing system entry carrying the same marker, and pushes it onto `output.system`. On any non-`ok` status it appends nothing. An in-flight dedup collapses concurrent transforms for the same cache key onto one bridge call.

**`event`** — session lifecycle bookkeeping. `session.created` marks the runtime ready; `session.resumed` / `session.compacted` / `session.compact` clear that session's transform-dedup state; `session.deleted` invalidates that session's cache entries and in-flight promises and clears its dedup state; `server.instance.disposed` / `global.disposed` reset all runtime state.

**`tool: system_spec_memory_status`** — a read-only diagnostic returning a multi-line key=value report (plugin id, enabled, disabled reason, config status/error, cache TTL/size, runtime ready, node binary sanitized to `[configured-node]` when it contains a path separator, bridge timeouts, last bridge status/error/duration, bridge invocations, continuity lookups, cache hits/misses/hit-rate, and the warm bridge's own status/route/exit code). It never leaks the bridge path or the raw node binary path.

Optional transform dedup (off by default; `deduplicateTransforms` config or `OPENCODE_TRANSFORM_DEDUP_ENV=1`) suppresses duplicate same-message system blocks across co-resident transforms by recording each block's content hash against the resolved message identity.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **OpenCode** | `.opencode/plugins/system-spec-memory.js` (mirrored at `opencode/` via browsability symlink) | Plugin, loaded by OpenCode's flat glob over `.opencode/plugins/`. `experimental.chat.system.transform` for continuity injection; `event` for session lifecycle; `tool` for status | Resolves session id from `input.sessionID` / `sessionId` / `session.id` / `properties.…` (falls back to `__global__`); workspace root from `ctx.directory` (falls back to `process.cwd()`); config merged from `~/.config/opencode/plugin/system-spec-memory.json` + plugin options + env | Marked brief appended to `output.system`; status tool returns a key=value string |
| Claude, Codex, Cursor, Devin, Pi | — | — | — by-design: OpenCode plugin owns continuity retrieval | — by-design |

The `opencode/system-spec-memory.js` symlink is a documentation mirror only — OpenCode's loader globs `.opencode/plugins/*.js` by a flat pattern and never traverses this tree, so nothing loads through the symlink. It exists so the hooks index shows the OpenCode adapter beside the other concerns.

---

## 4. DIRECTORY TREE

```text
spec-memory/
`-- opencode/ system-spec-memory.js   # symlink -> ../../../plugins/system-spec-memory.js
```

The real code lives at `.opencode/plugins/system-spec-memory.js`. It spawns the bridge at `.opencode/skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs` and shares message-identity helpers from `.opencode/plugins/lib/opencode-message-identity.js`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/plugins/system-spec-memory.js` | The entire plugin: config load (`~/.config/opencode/plugin/system-spec-memory.json`), option normalization (env + config + plugin options), source-signature cache key, warm bridge subprocess with bounded timeout/overflow/kill, TTL+LRU continuity cache with in-flight dedup, marked-brief injection with marker dedup, session-lifecycle event bookkeeping, transform-dedup integration, and the read-only `system_spec_memory_status` tool. |
| `.opencode/skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs` | The warm bridge subprocess the plugin spawns. Receives a JSON request on stdin, performs the continuity retrieval, returns `{ status, brief, data, metadata }` on stdout. |
| `.opencode/plugins/lib/opencode-message-identity.js` | Message-identity and transform-dedup helpers the plugin uses when `deduplicateTransforms` is on. |
| `.opencode/hooks/shared/hook-flags.cjs` | Kill-switch resolver the plugin calls via `isHookEnabled('spec-memory')` before appending any brief. |

---

## 6. CONFIGURATION

The plugin is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver; the plugin's own `envDisablesPlugin` checks `1` only for its two plugin-specific env names.

| Variable | Effect |
|---|---|
| `SYSTEM_SPEC_MEMORY_DISABLED=1` | Shared kill-switch. `specMemoryHookEnabled()` returns false and `appendContinuityBrief` returns before any bridge work. |
| `SYSTEM_SPEC_MEMORY_PLUGIN_DISABLED=1` | Plugin-specific disable. `envDisablesPlugin()` returns true, `options.enabled` becomes false, the status tool reports the disabled reason, and no brief is appended. |
| `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED=1` | Legacy alias of the plugin-specific disable. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Optional tuning variables: `SYSTEM_SPEC_MEMORY_CACHE_TTL_MS` (default 5000), `SYSTEM_SPEC_MEMORY_BRIDGE_TIMEOUT_MS` (default 3000), `SYSTEM_SPEC_MEMORY_CLI_TIMEOUT_MS` (default 2500, passed to the bridge), `SYSTEM_SPEC_MEMORY_MAX_BRIEF_CHARS` (default 2400, floored to the marker length), `SYSTEM_SPEC_MEMORY_MAX_CACHE_ENTRIES` (default 200), `SYSTEM_SPEC_MEMORY_NODE_BINARY` / `SPEC_KIT_PLUGIN_NODE_BINARY` (node binary for the bridge subprocess), `SYSTEM_SPEC_MEMORY_SPEC_FOLDER` (optional spec-folder scope). Config file: `~/.config/opencode/plugin/system-spec-memory.json` with keys `enabled`, `cacheTtlMs`, `bridgeTimeoutMs`, `cliTimeoutMs`, `nodeBinaryOverride`, `specFolder`, `maxBriefChars`, `maxCacheEntries`, `deduplicateTransforms`, `sourceSignatureOverride`. Plugin options override config, which overrides env defaults.

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory only | The plugin appends a marked system block or a status string; it never blocks, denies, or throws into the host. |
| Fail-open | A disabled plugin, a bridge timeout (SIGTERM then SIGKILL after 1s), a spawn error, a non-zero exit, a stdout overflow (1 MiB cap), a stdin/EPIPE error, or a JSON parse failure all resolve to `fail_open` with `brief: null` — nothing is appended. |
| Cache | TTL+LRU continuity cache keyed by (session, spec folder, workspace root, source signature). In-flight dedup collapses concurrent transforms for the same key onto one bridge call. Session invalidation on `session.deleted`; full reset on dispose. |
| Dedup | The injected brief carries a content-digest marker; the plugin skips pushing a second entry that already carries the same marker. Optional transform-dedup suppresses duplicate same-message blocks across co-resident transforms. |
| Path leakage | The status tool sanitizes a path-containing node binary to `[configured-node]` and reports the bridge path as `[spec-memory-bridge]`; no raw local path reaches the model. |
| Output | The plugin writes only to `output.system` (transform) or returns a string (tool). It never writes to stdout/stderr of the host process. |
| Imports | Node builtins, `@opencode-ai/plugin/tool`, the shared `hook-flags.cjs` resolver, the in-tree `lib/opencode-message-identity.js`, and the bridge by absolute path. Nothing outside the repo. |

---

## 8. VALIDATION

```bash
node --test .opencode/plugins/tests/system-spec-memory.test.cjs
```

Expected result: all tests pass (the plugin's cache, in-flight dedup, marked-brief injection, fail-open paths, and status tool are exercised through the test seams and `.__test` surface).

```bash
node -e "import('./.opencode/plugins/system-spec-memory.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (confirms the plugin and its bridge path still resolve).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): what this plugin injects and its visibility to the operator.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md): the session-lifecycle concern whose compaction/recovery path complements this plugin's continuity retrieval.
- [`../../plugins/README.md`](../../plugins/README.md): the OpenCode plugins folder that loads this plugin.
- [`../../skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs`](../../skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs): the warm bridge subprocess this plugin spawns.
