---
title: "Session Lifecycle Hooks: Continuity + Context Priming"
description: "Spec-Kit session-lifecycle adapters that prime, restore, and checkpoint continuity context at session start/stop and around compaction, across Claude, Codex, Cursor, Devin, and Pi. OpenCode is by-design: session events run inside the owning mk-* plugins."
trigger_phrases:
  - "session lifecycle hooks"
  - "session start context"
  - "compact inject"
  - "session continuity priming"
importance_tier: "important"
contextType: "reference"
---

# Session Lifecycle Hooks: Continuity + Context Priming

---

## 1. OVERVIEW

`session-lifecycle/` is the index for the Spec-Kit session-lifecycle concern. Its adapters fire on a runtime's session boundaries, start, stop/end, and the compaction boundary, to prime continuity context into a fresh session, checkpoint state on stop, and re-inject the recovered brief after a compaction so long sessions do not lose their spec-folder anchor. The real code lives in `system-spec-kit/runtime/hooks/<runtime>/` and is symlinked here per runtime for browsability.

The concern is **advisory and model-context-only**: every adapter adds recovery or priming text, never blocks or denies a session. The single most important property is that it **fails open**: a missing payload, an unreadable transcript, a parse error, or any internal error resolves to a no-op, so a hook bug can never break session startup, stop, or compaction.

The Claude adapters are the canonical implementation; Codex, Cursor, and Devin are thin adapters that reshape their runtime's event into Claude's input shape and delegate to the compiled Claude hook (`session-prime.js`, `session-stop.js`, `compact-inject.js`) via a shared `runClaudeHookAdapter` helper. Pi carries its own native TypeScript extensions (it cannot shell to a built `.js` the same way) that bridge the same Claude hooks for start/stop and implement a bespoke post-compaction recovery chain. OpenCode is `by-design` per the coverage matrix: its session events run inside the owning `mk-*` plugins rather than a separately indexed adapter, so there is no `opencode/` subfolder here.

Every adapter honors the `session-lifecycle` kill-switch (`isHookEnabled('session-lifecycle')`; canonical `SYSTEM_SESSION_LIFECYCLE_DISABLED` or the master `SYSTEM_HOOKS_DISABLED`), default-on.

---

## 2. WHAT IT DOES

The concern covers three session boundaries, each with a distinct job:

**Session start (`session-prime` / `session-start`).** Injects context via stdout (Claude) or the runtime's context-injection channel (Codex `emitCodexContext`, Cursor `agent_message`, Devin `emitDevinContext`, Pi `sendMessage`). It branches on the session source:
- `compact` (Claude only): reads the cached compact brief that the PreCompact hook persisted, validates it semantically and for staleness (30-minute TTL), sanitizes and wraps it with provenance markers, and injects it as `Recovered Context (Post-Compaction)` plus `Recovery Instructions`. A stale or quarantined cache falls back to a one-line pointer to `/speckit:resume`.
- `startup`: emits a `Session Context` surface (recovery-tools list) and, when a cached session summary is accepted, a `Session Continuity` section.
- `resume`: emits the last active spec folder (from per-session state) and a resume pointer.
- `clear` (Claude only): minimal fresh-context notice.

A token-pressure adjustment shrinks the budget when the context window is filling. Output is truncated to the budget and written to stdout only after the write callback confirms handoff (so compact recovery is never dropped early).

**Compaction boundary.** Two shapes exist because runtimes fire compaction at different points:
- Claude/Codex/Cursor `PreCompact` (before compaction): `compact-inject` precomputes a merged context via the merge pipeline (active files + session-state attention signals), runs an anti-feedback guard that strips recovered hook-cache markers from the transcript tail before summarization, and **caches** the result to per-session hook state. It deliberately emits no stdout on PreCompact: the cache is delivered by the next `SessionStart(source=compact)`. An optional authored-continuity-snapshot worker runs in a bounded child process.
- Devin `PostCompaction` / Pi `session_compact` (after compaction): a bespoke recovery chain (retain summary → rehydrate spec-folder continuity from the shared tmpdir state file → provenance/length filtering → emit `additionalContext` directly), because these runtimes give no transcript path and no guaranteed follow-up event to defer to.

**Session stop (`session-stop` / `session-end` / `session_shutdown`).** Parses the transcript tail for token usage (incremental from the last offset), builds producer metadata (transcript fingerprint, cache tokens), auto-detects/retargets the active spec folder from transcript paths, extracts a ≤200-char session summary, and writes all of it in **one atomic `updateState()` call** (no torn-state window). It then runs a bounded context autosave (`generate-context.js`) from the in-memory merged state: never a disk reload, and a shadow-only true-citation emit. A `--finalize` mode cleans stale states older than 24h. The `stop_hook_active` re-entrant case is skipped.

---

## 3. PER-RUNTIME DELIVERY

Every runtime's start/stop adapter bridges into the same compiled Claude hooks (`session-prime.js`, `session-stop.js`, `compact-inject.js`) or, for Pi and Devin's post-compaction, a native recovery chain. What differs is the lifecycle-event vocabulary, the payload shape each runtime's event carries, and the channel the recovered context is handed back through.

| Runtime | Adapters | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/session-prime.ts`, `claude/session-stop.ts`, `claude/compact-inject.ts` | `SessionStart`, `Stop`, `PreCompact` in `.claude/settings.json`; runs the compiled `dist/hooks/claude/*.js` | Canonical shape: `source` (`startup`/`compact`/`resume`/`clear`), `session_id`, `transcript_path`, `stop_hook_active`, `context_window_tokens`/`_max` | stdout (injected into the conversation); stop is fire-and-forget side effects |
| **Codex** | `codex/session-start.ts`, `codex/session-stop.ts`, `codex/compact-inject.ts` | `SessionStart`, `Stop`, `PreCompact` in `.codex/hooks.json`; thin adapters via `readCodexHookInput` + `runClaudeHookAdapter` | Reshapes Codex stdin into Claude shape; delegates to `session-prime.js`/`session-stop.js`/`compact-inject.js` (bounded 2.8s start/compact, 10s stop) | `emitCodexContext` envelope (`hookSpecificOutput.additionalContext`) |
| **Cursor** | `cursor/session-start.ts`, `cursor/session-end.ts`, `cursor/precompact.ts` | `sessionStart`, `sessionEnd`, `preCompact` in `.cursor/hooks.json`; `sessionEnd` substitutes for `stop` (which never fires under `cursor-agent -p`) | `toClaudeShape` reshapes Cursor's payload; `sessionEnd` has no permission decision (session over) | `emitCursorResponse` with `permission: allow` + `agent_message` for start; plain allow for precompact; no envelope for end |
| **Devin** | `devin/session-start.ts`, `devin/session-stop.ts`, `devin/post-compaction.cjs` | `SessionStart`, `Stop`, `PostCompaction` in `.devin/hooks.v1.json`; start/stop delegate to Claude hooks; post-compaction is a bespoke CommonJS adapter (no `.ts` build) | Start/stop reshape via `readDevinHookInput`; PostCompaction carries only `session_id` + a possibly-null `summary` (no transcript, no trigger): handled by the 5-step native chain | `emitDevinContext` for start; PostCompaction emits `hookSpecificOutput.additionalContext` directly |
| **Pi** | `pi/session-start-context.ts`, `pi/session-stop-context.ts`, `pi/session-compact-context.ts`, `pi/session-start-advisories.ts` (real files; `.pi/extensions/` symlinks here) | `session_start`, `session_shutdown` (reason `quit`), `session_compact` via `.pi/extensions/` | Native TS extensions; start/stop bridge to `session-prime.js`/`session-stop.js` via `runClaudeHookAdapter`; compact is a native port of Devin's chain reading `compactionEntry.summary`; `session-start-advisories` runs the same warn-only startup guard scripts Cursor/Devin wire in | `pi.sendMessage({ customType, display: false })` for context; `ctx.ui.notify` for advisory warnings |
| **OpenCode** |, (by-design) | — |, by-design: session events run inside the owning `mk-*` plugins |, by-design |

Cursor's `precompact.ts` is registered but **delivery unconfirmed**: research found no forcing mechanism for `preCompact` reachable from a single `cursor-agent -p` dispatch, so it is wired honestly as a thin proxy whose trigger condition could not be manufactured inside a short probe session. The `session-start` and `session-end` adapters are confirmed live-firing under `cursor-agent 2026.07.23-e383d2b`.

The deployed entrypoints are the compiled `dist/hooks/<runtime>/*.js` files; each `session-lifecycle/<runtime>/` subfolder here carries both the `.ts` source and a relative symlink to the built `.js` so the actually-executed file is browsable too. Devin's `post-compaction.cjs` is plain CommonJS with no build step.

---

## 4. DIRECTORY TREE

```text
session-lifecycle/
+-- claude/   compact-inject.{ts,js}, session-prime.{ts,js}, session-stop.{ts,js}   # .js -> dist/hooks/claude/
+-- codex/    compact-inject.{ts,js}, session-start.{ts,js}, session-stop.{ts,js}   # .js -> dist/hooks/codex/
+-- cursor/   precompact.{ts,js}, session-end.{ts,js}, session-start.{ts,js}        # .js -> dist/hooks/cursor/
+-- devin/    post-compaction.cjs, session-start.{ts,js}, session-stop.{ts,js}      # .js -> dist/hooks/devin/
`-- pi/       session-compact-context.ts, session-start-advisories.ts,
              session-start-context.ts, session-stop-context.ts                    # real files; .pi/extensions/ symlinks here
```

The real code lives in `.opencode/skills/system-spec-kit/runtime/hooks/<runtime>/`. The `.js` siblings are relative symlinks into `system-spec-kit`'s built `dist/hooks/`, so they resolve after a build. There is no `opencode/` subfolder (by-design. OpenCode session events run inside the owning plugins).

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `claude/session-prime.ts` | Canonical SessionStart handler. Branches on `source` (compact/startup/resume/clear), reads/validates/quarantines the cached compact brief, builds the startup surface, applies token-pressure budget adjustment, writes stdout after handoff confirm, then clears the compact prime. |
| `claude/session-stop.ts` | Canonical Stop handler. Incremental transcript parse for token usage, producer-metadata build, spec-folder auto-detect/retarget, ≤200-char summary extraction, single atomic `updateState`, bounded context autosave from in-memory state, shadow true-citation emit, `--finalize` stale-state sweep. |
| `claude/compact-inject.ts` | PreCompact handler. Transcript-tail extraction (anti-feedback guard), 3-source merge pipeline (`mergeCompactBrief`), token-budgeted section rendering, cache to hook state (no stdout), optional authored-continuity-snapshot worker. |
| `codex/session-start.ts`, `codex/session-stop.ts`, `codex/compact-inject.ts` | Thin Codex adapters. `readCodexHookInput` + `runClaudeHookAdapter` delegate to the compiled Claude hooks; `emitCodexContext` wraps the result. |
| `cursor/session-start.ts`, `cursor/session-end.ts`, `cursor/precompact.ts` | Thin Cursor adapters. `toClaudeShape` + `runClaudeHookAdapter`; `sessionEnd` substitutes for `stop`; `precompact` registered, delivery unconfirmed. |
| `devin/session-start.ts`, `devin/session-stop.ts` | Thin Devin adapters delegating to the Claude hooks via `runDevinHook`/`runClaudeHookAdapter`. |
| `devin/post-compaction.cjs` | Bespoke PostCompaction recovery chain (CommonJS, no build). Retains summary → rehydrates spec-folder continuity → sanitize/filter → emit `additionalContext`. Fails open. |
| `pi/session-start-context.ts` | Native Pi `session_start` extension. Bridges `session-prime.js` via `runClaudeHookAdapter`; maps Pi reasons to Claude `startup`/`resume`; `sendMessage` with `display: false`. |
| `pi/session-stop-context.ts` | Native Pi `session_shutdown` (reason `quit`) extension. Fire-and-forget bridge to `session-stop.js`. |
| `pi/session-compact-context.ts` | Native Pi `session_compact` extension. Port of Devin's post-compaction chain reading `compactionEntry.summary` in-process; reuses the shared tmpdir state file. |
| `pi/session-start-advisories.ts` | Native Pi `session_start` extension running the same warn-only startup guard scripts (worktree-guard, check-git-hooks, primary-reconcile, live-sync-follow, dist-staleness, install-codex-hooks) Cursor/Devin wire in, surfacing warnings via `ctx.ui.notify`. Each check honors its own concern kill-switch. |
| `shared/hook-flags.cjs` / `shared/hook-flags.mjs` | Kill-switch resolver every adapter calls via `isHookEnabled('session-lifecycle')`. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` | Every adapter calls `isHookEnabled('session-lifecycle')` at entry and returns immediately when truthy. The Claude adapters short-circuit before `ensureStateDir`; the thin adapters short-circuit before reading stdin; the Pi extensions return `undefined` before registering handlers. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Optional tuning variables: `SPECKIT_STOP_HOOK_SPEC_TAIL_BYTES` (spec-folder detection tail size, default 50 KiB), `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1` (opt-in authored snapshot worker on PreCompact), `HOOK_TIMEOUT_MS` (per-hook deadline), `COMPACTION_TOKEN_BUDGET` / `SESSION_PRIME_TOKEN_BUDGET` (output budgets). The `session-start-advisories` Pi extension additionally honors each guard's own concern kill-switch (`git-worktree-guard`, `git-hooks-check`, `live-sync`, `dist-freshness`, `hook-install`).

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory only | Every adapter injects recovery/priming context or performs fire-and-forget side effects; none ever denies or halts a session. |
| Fail-open | A missing payload, an unreadable transcript, a parse error, a missing `generate-context.js`, or any internal error resolves to a no-op. The Claude `main()` catches unhandled errors and exits 0; the thin adapters and Pi extensions wrap their bodies in try/catch. |
| Atomic state | `session-stop` accumulates a single patch and writes it in one atomic `updateState()`; autosave reads from the in-memory merged state, never a disk reload, so interleaved writers cannot produce a torn-state window. |
| Anti-feedback | `compact-inject` strips recovered hook-cache source markers (`[SOURCE:hook-cache]`, `## Recovered Context`, `auto-recovered`, …) from the transcript tail before summarization, so the next compaction cannot re-ingest its own prior output. |
| Bounded | All subprocesses (autosave 4s, authored-snapshot worker) are deadline-bounded against `HOOK_TIMEOUT_MS`; the thin adapters pass explicit per-call timeouts (2.8s start/compact, 10s stop). |
| Output | Start/compact emit context via the runtime's injection channel (stdout, `additionalContext`, `agent_message`, `sendMessage`); stop emits nothing to the model (side effects + bounded log only). The core never writes to the TUI directly. |
| Imports | Adapters import the shared `hook-flags` resolver and the `system-spec-kit` continuity core (`shared.js`, `hook-state.js`, `mergeCompactBrief`). Nothing outside the skill tree. |

---

## 8. VALIDATION

```bash
cd .opencode/skills/system-spec-kit/runtime && npm run build
```

Expected result: `tsc --build` succeeds and `dist/hooks/<runtime>/*.js` are produced (the deployed entrypoints the runtime configs point at).

```bash
cd .opencode/skills/system-spec-kit/runtime && npm run typecheck
```

Expected result: no type errors (confirms the `.ts` sources here still compile against the skill's shared modules).

```bash
node -e "import('./.opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (repeat for `session-stop.js`, `compact-inject.js`, and the `codex/`/`cursor/`/`devin/` siblings: confirms the deployed entrypoints resolve).

```bash
pi --offline --approve -p "list your available tools" </dev/null
```

Expected result: exit 0, no extension-load error (confirms `.pi/extensions/session-*.ts` resolve their imports).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): what these hooks inject and their visibility to the operator.
- [`../session-cleanup/README.md`](../session-cleanup/README.md): the teardown concern that reaps MCP helpers using the `CLAUDE_SESSION_PID` these hooks persist.
- [`../completion/README.md`](../completion/README.md): the completion sentinel that reads the per-session `lastSpecFolder` state these hooks write.
- [`../../skills/system-spec-kit/runtime/hooks/README.md`](../../skills/system-spec-kit/runtime/hooks/README.md): the owning skill's hook contract.
