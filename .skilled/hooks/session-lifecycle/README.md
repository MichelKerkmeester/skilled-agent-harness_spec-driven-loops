---
title: "Session Lifecycle Hooks: Continuity + Context Priming"
description: "Spec-Kit session-lifecycle adapters that prime, restore and checkpoint continuity context at session start, stop and compaction, across Claude, Codex, Cursor, Devin, DSH, Pi and Vibe. OpenCode is by-design: its session events run inside the owning plugins."
trigger_phrases:
  - "session lifecycle hooks"
  - "session start context"
  - "compact inject"
  - "session continuity priming"
  - "claude session lifecycle"
  - "claude session prime"
  - "claude compact inject"
  - "codex session lifecycle"
  - "codex session start hook"
  - "codex compact inject"
  - "cursor session lifecycle"
  - "cursor session start hook"
  - "cursor precompact"
  - "devin session lifecycle"
  - "devin post compaction"
  - "devin session start hook"
  - "dsh session lifecycle"
  - "dsh session prime"
  - "dsh compaction context"
  - "pi session lifecycle"
  - "pi session start context"
  - "pi compaction context"
importance_tier: "important"
contextType: "reference"
---

# Session Lifecycle Hooks: Continuity + Context Priming

---

## 1. OVERVIEW

`session-lifecycle/` is the index for the Spec-Kit session-lifecycle concern. Its adapters fire on a runtime's session boundaries: start, stop and the compaction boundary. They prime continuity context into a fresh session, checkpoint state on stop and re-inject the recovered brief after a compaction. The real code lives in `system-spec-kit/runtime/hooks/<runtime>/` and is linked here per runtime for browsability.

The concern is advisory and model-context-only. The adapters add recovery or priming text, or checkpoint state on stop. Vibe's `turn-end.mjs` is the one exception, because it can send a turn back with a single deny.

A missing payload, an unreadable transcript, a parse error or any internal error resolves to a no-op. A hook bug therefore cannot break session startup, stop or compaction.

Claude is the canonical implementation. Codex, Cursor and Devin are thin adapters that reshape their runtime's event into Claude's input shape. Each one delegates to the compiled Claude hook (`session-prime.js`, `session-stop.js`, `compact-inject.js`) through a shared `runClaudeHookAdapter` helper. Pi and DSH carry native adapters that bridge the same Claude hooks, and Pi adds a native post-compaction chain. Vibe composes its own context from the same parts.

OpenCode is `by-design`. Its session events run inside the owning `system-skill-advisor`, `opencode-goal` and similar plugins, so there is no `opencode/` subfolder here.

The kill-switch is `session-lifecycle`, read through `isHookEnabled('session-lifecycle')`. The canonical switch is `SYSTEM_SESSION_LIFECYCLE_DISABLED` and the master switch is `SYSTEM_HOOKS_DISABLED`. The concern is on by default.

---

## 2. HOW IT WORKS

### Session start

`session-prime` runs on `SessionStart` and branches on `source`.

- `compact`: reads the cached brief that `PreCompact` persisted. It validates the brief semantically and for staleness (30-minute TTL), then sanitizes it and wraps it with provenance markers. It injects it as `Recovered Context (Post-Compaction)` plus `Recovery Instructions`. A stale or quarantined cache falls back to a one-line pointer to `/speckit:resume`.
- `startup`: emits a `Session Context` surface with the recovery-tools list. The richer startup brief and the cached `Session Continuity` summary both read from a structural index that no longer exists. This fallback surface is the only one left.
- `resume`: emits the last active spec folder from per-session state and a resume pointer.
- `clear`: a minimal fresh-context notice.

The payload carries `source`, `session_id`, `transcript_path`, `stop_hook_active`, `context_window_tokens` and `context_window_max`. A token-pressure adjustment shrinks the budget when the context window is filling. Output is truncated to the budget and written to stdout. The cached brief is cleared only after the write callback confirms handoff, so compact recovery is never dropped early.

A fork that compacted under its parent's session id is skipped, so the parent's cached brief is not spent on the fork.

### Compaction boundary

Two shapes exist because runtimes fire compaction at different points.

Claude, Codex and Cursor fire `PreCompact` before compaction. `compact-inject` precomputes a merged context through the merge pipeline (`mergeCompactBrief`), which combines active files with session-state attention signals. An anti-feedback guard strips recovered hook-cache markers from the transcript tail before summarization. It drops lines matching six patterns, such as `[SOURCE:hook-cache]`, `[PROVENANCE:`, `## Recovered Context`, `## Recovery Instructions` and `auto-recovered`.

The result is cached to per-session hook state. It emits no stdout on `PreCompact`, because the cache is delivered by the next `SessionStart(source=compact)`. An optional authored-continuity-snapshot worker runs in a bounded child process.

Devin fires `PostCompaction` and Pi fires `session_compact`, both after compaction. Each runs a recovery chain: retain the summary, rehydrate spec-folder continuity from the shared tmpdir state file, filter for provenance and length. Devin emits `additionalContext`, and Pi sends a hidden `pi.sendMessage`. These runtimes give no transcript path and no guaranteed follow-up event to defer to.

### Session stop

`session-stop` parses the transcript tail for token usage, incrementally from the last offset. It builds producer metadata (transcript fingerprint, cache tokens) and auto-detects or retargets the active spec folder from transcript paths. It extracts a summary of at most 200 characters. All of it lands in one atomic `updateState()` call, so there is no torn-state window.

It then runs a bounded context autosave (`generate-context.js`) from the in-memory merged state, never a disk reload, with a shadow-only true-citation emit. A missing `generate-context.js` skips the autosave with a warning and no save. A `--finalize` mode cleans stale states older than 24h. A payload whose `stop_hook_active` is false is skipped.

### Vibe turn boundaries

Vibe has no compaction event and no idle event. `vibe/session-start.mjs` is the only `session_start` entry. It composes four parts in a fixed order: the goal slice, the session context, the startup-guard warnings and the stale-dist warning. The Vibe hooks answer with `{"hook_specific_output": {"additional_context": "..."}}`, and `turn-end.mjs` may answer with one deny instead.

`vibe/turn-start.mjs` is the only turn-start composer. It delivers a pending completion advisory, the compaction context, the advisor brief, the save reminder and the hand-over text, in that order.

`vibe/turn-end.mjs` is the only `post_agent` entry, because Vibe skips every later `post_agent` hook once one denies. It runs the completion part of `completion-evidence` first, then the ask-surface part of `ask-surface-guard`, then the hand-over part.

`vibe/compaction-post-tool.mjs` is a non-strict `post_tool` binding. It runs the same detector after a tool call when the journal grew, so a compaction inside one long headless turn is caught mid-turn.

### Error paths

Each adapter has its own. The Claude `main()` catches unhandled errors and exits 0. The Codex, Cursor and Devin adapters return null from `runClaudeHookAdapter` when the child fails. Their entry wrapper reports the error on stderr and exits 0, and Cursor also emits a plain allow envelope.

The Devin post-compaction adapter writes the error to stderr and emits nothing. The DSH adapters log a warning through `ctx.logger` and continue. The Pi extensions catch and return `undefined`. The Vibe hooks skip a failing part and keep the rest, and always exit 0.

### Imports

Adapters import the shared `hook-flags` resolver and the `system-spec-kit` continuity core (`shared.js`, `hook-state.js`, `mergeCompactBrief`). Nothing outside the skill tree.

### History locator offer

No compaction path adds a history lookup section. The session handover offers the lookup when a handoff note is claimed. `claim` mints a versioned history locator for the sending session and prints one bounded section.

That section lists the search, browse, load and page operations. It is withheld unless the note's checkout is the receiver's own. Any failure leaves the claim output unchanged. Retrieved history is untrusted input.

### Reader capability matrix

The lookup is served by the shared, read-only reader package at [`../shared/session-readers/index.mjs`](../shared/session-readers/index.mjs). Its `capabilities` export is the source of truth, and this table mirrors it. A reader resolves one exact session id, returns the shared `HistoryEntry` list and writes nothing. The decision-capture sweeps remain the writers.

| Runtime | Status | Locator kind | Store root |
|---|---|---|---|
| Claude | `ready` | `transcript_path` | `~/.claude/projects` |
| Codex | `ready` | `transcript_path` | `$CODEX_HOME/sessions` |
| Pi | `ready` | `live_branch_or_session_log` | `~/.pi/agent/sessions` |
| OpenCode | `ready` | `session-store` | `$XDG_DATA_HOME/opencode/opencode.db` |
| Devin | `ready` | `transcript_file` | `$XDG_DATA_HOME/devin/cli/sessions.db` |
| DSH | `ready` | `session_log` | `$DSH_HOME/sessions` |
| Vibe | `ready` | `transcript_path` | `$VIBE_HOME/logs/session/unified/<session_id>` |
| Cursor | `gated` | `capability_flag` | `(unconfirmed)` |

Cursor stays gated because PreCompact delivery is unconfirmed, so `readSession` returns `capability_gated` before it reads anything. A runtime outside the table returns `capability_gated` too, never a guessed store.

---

## 3. RUNTIME COVERAGE

The table folds every entry of the runtime subfolders into one place. A row names the event the runtime fires and the file this folder holds for it.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreCompact` | `claude/compact-inject.js` and `claude/compact-inject.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js` and `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Nothing. It caches the brief for the next start. |
| Claude | `SessionStart` | `claude/session-prime.js` and `claude/session-prime.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` and `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | The context sections on stdout, injected into the conversation. |
| Claude | `Stop` | `claude/session-stop.js` and `claude/session-stop.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` and `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | Nothing to the model. A queued decision-capture answer adds one `systemMessage` line. |
| Codex | `PreCompact` | `codex/compact-inject.js` and `codex/compact-inject.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js` and `.skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts` | Nothing. It caches the brief for the next start. |
| Codex | `SessionStart` | `codex/session-start.js` and `codex/session-start.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` and `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` | The `hookSpecificOutput.additionalContext` envelope from `emitCodexContext`. |
| Codex | `Stop` | `codex/session-stop.js` and `codex/session-stop.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js` and `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-stop.ts` | Nothing. |
| Cursor | `preCompact` | `cursor/precompact.js` and `cursor/precompact.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js` and `.skilled/skills/system-spec-kit/runtime/hooks/cursor/precompact.ts` | `permission: allow` and no `agent_message`. |
| Cursor | `sessionEnd` | `cursor/session-end.js` and `cursor/session-end.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js` and `.skilled/skills/system-spec-kit/runtime/hooks/cursor/session-end.ts` | Nothing. No envelope is emitted. |
| Cursor | `sessionStart` | `cursor/session-start.js` and `cursor/session-start.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js` and `.skilled/skills/system-spec-kit/runtime/hooks/cursor/session-start.ts` | `permission: allow` plus an `agent_message` holding the context. |
| Devin | `PostCompaction` | `devin/post-compaction.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | `hookSpecificOutput.additionalContext` with the summary, the active spec folder and the recovery pointer. |
| Devin | `SessionStart` | `devin/session-start.js` and `devin/session-start.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js` and `.skilled/skills/system-spec-kit/runtime/hooks/devin/session-start.ts` | The `hookSpecificOutput.additionalContext` envelope from `emitDevinContext`. |
| Devin | `Stop` | `devin/session-stop.js` and `devin/session-stop.ts` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js` and `.skilled/skills/system-spec-kit/runtime/hooks/devin/session-stop.ts` | Nothing. |
| DSH | `session/event` (`compaction/end`) | `dsh/session-compact-context.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs` | An injected user message with the session-prime `compact` output. |
| DSH | `agent/created` (`startup`) | `dsh/session-start-advisories.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | One injected notice with the guard warnings. |
| DSH | `agent/created` | `dsh/session-start-context.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-context.mjs` | An injected user message with the session-prime output. |
| DSH | `agent/disposed` | `dsh/session-stop-context.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-stop-context.mjs` | Nothing. |
| Pi | `session_compact` | `pi/session-compact-context.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | A hidden message with the summary, the packet purpose, the active spec folder and the recovery pointer. |
| Pi | `session_start` | `pi/session-start-advisories.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | `ctx.ui.notify` warnings, one per failing guard. |
| Pi | `session_start` | `pi/session-start-context.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` | A hidden `sendMessage`. A missing build raises a `ctx.ui.notify` warning. |
| Pi | `session_shutdown` (reason `quit`) | `pi/session-stop-context.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-stop-context.ts` | Nothing. |
| Vibe | `session_start` | `vibe/session-start.mjs` | This folder. The file is real, not a link. | `hook_specific_output.additional_context` with the four parts. |
| Vibe | `pre_agent` | `vibe/turn-start.mjs` | This folder. The file is real, not a link. | `additional_context` with the pending advisory, the compaction context, the advisor brief, the save reminder and the hand-over text. |
| Vibe | `post_agent` | `vibe/turn-end.mjs` | This folder. The file is real, not a link. | One `deny` with a reprompt reason when the ask-surface part denies. Otherwise nothing. |
| Vibe | `post_tool` | `vibe/compaction-post-tool.mjs` | This folder. The file is real, not a link. | `additional_context` with the compaction context and the hand-over text. |
| Vibe | None | `vibe/compaction-context.mjs` | This folder. The file is real, not a link. | Nothing on its own. `turn-start.mjs` and `compaction-post-tool.mjs` import it. |
| OpenCode | None | None | None | Nothing. Session events run inside the owning plugins. |

Claude, Codex, Cursor and Devin register in `hook-registry.json`. Claude gives `SessionStart` and `PreCompact` 3 seconds and `Stop` 10. Codex gives `SessionStart` 3 seconds and gives `compact-inject` and `session-stop` no timeout. Cursor gives all three 10 seconds. Devin gives `SessionStart` and `Stop` 10 seconds and `PostCompaction` 5.

Each adapter also bounds the child call it makes. Codex and Devin give `session-prime` 2.8 seconds and `session-stop` 10 seconds, and Codex gives `compact-inject` 2.8 seconds. Cursor gives `session-prime` 2.8 seconds, `precompact` 3 seconds and `session-end` 10 seconds.

DSH gives `session-prime` 2.8 seconds and `session-stop` 10 seconds. Pi gives `session-prime` 2.8 seconds and `session-stop` 10 seconds. The autosave inside `session-stop` gets 4 seconds.

The registrations themselves live in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`. DSH registers through `.dsh/plugins/repo-guards/adapters/`, which holds links to the real files. Pi registers through `.pi/extensions/`, whose entry files re-export the real files in `system-spec-kit/runtime/hooks/pi/`. Vibe registers in `.vibe/hooks.toml`.

Cursor's `precompact.ts` is registered but delivery is unconfirmed. Research found no forcing mechanism for `preCompact` reachable from a single `cursor-agent -p` dispatch. The `session-start` and `session-end` adapters are confirmed live-firing under this probe:

```text
cursor-agent 2026.07.23-e383d2b
```

`sessionEnd` substitutes for `stop`, which never fires under `cursor-agent -p`. The deployed entrypoints are the compiled `dist/hooks/<runtime>/*.js` files. A `session-lifecycle/<runtime>/` subfolder carries both the `.ts` source and a relative link to the built `.js` only for `claude/`, `codex/`, `cursor/` and `devin/`.

The `dsh/` and `pi/` subfolders hold single links to the real files, and `vibe/` holds real files. Devin's `post-compaction.cjs` is plain CommonJS with no build step.

`.vibe/hooks.toml` runs `turn-start` as a `pre_agent` hook, `turn-end` as a `post_agent` hook, `compaction-post-tool` as a `post_tool` hook with a 10-second timeout and `session-start` as the only `session_start` hook. `turn-start` and `turn-end` run for the main session only, with a 20-second timeout. `compaction-context.mjs` is a module that `turn-start.mjs` and `compaction-post-tool.mjs` import.

`vibe/session-start.mjs` composes four parts in a fixed order. The first is the goal slice. The second is the session context. The third is the startup-guard warnings from `.vibe/plugins/repo-guards/session-cleanup.mjs`, which reuses `.opencode/plugins/session-cleanup.js` and its `session.created` guards: worktree guard, git-hooks check, live follow and primary reconcile. The fourth is the output of `check-dist-staleness.sh --all` when the `dist-freshness` concern is on.

`turn-end.mjs` also runs the completion part of `completion-evidence` and the ask-surface part of `ask-surface-guard`.

DSH runs the advisories only on a `startup` source and skips them for a fan-out leaf. It skips the stop autosave for a leaf too. A compaction that ended with an error gets nothing. DSH gates `primary-reconcile` on its own `primary-reconcile` concern, while Pi gates the same check on `session-lifecycle`. Pi maps the `session_start` reasons `resume` and `fork` to `resume`, and any other reason to `startup`.

---

## 4. DIRECTORY TREE

```text
session-lifecycle/
+-- README.md
+-- claude/    compact-inject.{ts,js}, session-prime.{ts,js}, session-stop.{ts,js}
+-- codex/     compact-inject.{ts,js}, session-start.{ts,js}, session-stop.{ts,js}
+-- cursor/    precompact.{ts,js}, session-end.{ts,js}, session-start.{ts,js}
+-- devin/     post-compaction.cjs, session-start.{ts,js}, session-stop.{ts,js}
+-- dsh/       session-compact-context.mjs, session-start-advisories.mjs,
              session-start-context.mjs, session-stop-context.mjs
+-- pi/        session-compact-context.ts, session-start-advisories.ts,
              session-start-context.ts, session-stop-context.ts
+-- tests/     README.md, dsh-session-lifecycle.test.mjs,
              pi-session-start-advisories.test.ts
`-- vibe/      README.md, compaction-context.mjs, compaction-context.test.mjs,
              compaction-post-tool.mjs, compaction-post-tool.test.mjs,
              session-start.mjs, turn-end.mjs, turn-end.test.mjs,
              turn-start.mjs, turn-start.test.mjs, fixtures/
```

The real code lives in `.skilled/skills/system-spec-kit/runtime/hooks/<runtime>/`. The `.js` siblings are relative links into `system-spec-kit`'s built `dist/hooks/`, so they resolve after a build. The `dsh/` and `pi/` entries are links to the real files. There is no `opencode/` subfolder, by design.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `claude/session-prime.ts` | Canonical `SessionStart` handler. Branches on `source`, reads and validates the cached compact brief, builds the startup surface, applies the token-pressure budget, writes stdout and then clears the compact prime once the write callback confirms handoff. |
| `claude/session-stop.ts` | Canonical `Stop` handler. Incremental transcript parse, producer metadata, spec-folder retarget, summary extraction, one atomic `updateState`, bounded autosave from memory and the `--finalize` sweep. |
| `claude/compact-inject.ts` | `PreCompact` handler. Transcript-tail extraction with the anti-feedback guard, the `mergeCompactBrief` pipeline, token-budgeted rendering and a cache write with no stdout. |
| `codex/session-start.ts`, `codex/session-stop.ts`, `codex/compact-inject.ts` | Thin Codex adapters. `readCodexHookInput` and `runClaudeHookAdapter` delegate to the Claude hooks, and `emitCodexContext` wraps the result. |
| `cursor/session-start.ts`, `cursor/session-end.ts`, `cursor/precompact.ts` | Thin Cursor adapters. `toClaudeShape` and `runClaudeHookAdapter` do the work, `emitCursorResponse` answers, and `sessionEnd` substitutes for `stop`. |
| `devin/session-start.ts`, `devin/session-stop.ts` | Thin Devin adapters. `readDevinHookInput`, `runClaudeHookAdapter` and `runDevinHook` delegate to the Claude hooks. |
| `devin/post-compaction.cjs` | Bespoke `PostCompaction` recovery chain in CommonJS with no build. It retains the summary, rehydrates the spec folder, sanitizes and emits `additionalContext`. |
| `dsh/session-start-context.mjs`, `dsh/session-stop-context.mjs`, `dsh/session-compact-context.mjs`, `dsh/session-start-advisories.mjs` | DSH adapters. They spawn the Claude hooks, inject through `agent.inject` and log a failure through `ctx.logger`. |
| `pi/session-start-context.ts`, `pi/session-stop-context.ts`, `pi/session-compact-context.ts`, `pi/session-start-advisories.ts` | Pi extensions. Start and stop bridge the Claude hooks, compact is a native port of Devin's chain reading `compactionEntry.summary` in-process, and the advisories run the warn-only startup guards. Context goes out through `pi.sendMessage({ customType, display: false })`. |
| `vibe/session-start.mjs` | The one Vibe `session_start` entry. Composes the packet goal `chat_slice`, the session-prime context, the startup-guard warnings and the stale-dist warning into one `additional_context` value. |
| `vibe/turn-start.mjs` | The one Vibe `pre_agent` composer. Runs the pending completion advisory, the compaction context, the advisor brief, the save reminder and the hand-over part. |
| `vibe/turn-end.mjs` | The one Vibe `post_agent` entry. Runs the completion part, the ask-surface part and the hand-over part, and returns at most one deny. |
| `vibe/compaction-post-tool.mjs` | The non-strict `post_tool` binding. Runs the detector when the journal grew and adds the hand-over text. |
| `vibe/compaction-context.mjs` | The compaction detector. Reads the journal after a per-session watermark, writes the watermark and returns the goal slice and the open handoff pointer. |
| `shared/hook-flags.cjs` / `shared/hook-flags.mjs` | The kill-switch resolver the adapters call through `isHookEnabled('session-lifecycle')`. |
| `tests/dsh-session-lifecycle.test.mjs` | The DSH adapter tests. Covers the start context, the advisories, the post-compaction re-prime and the stop autosave. |
| `tests/pi-session-start-advisories.test.ts` | The Pi advisory tests. A passing Codex hook check shows nothing, a failing one warns, and other guards still warn on a clean exit. |

---

## 6. CONFIGURATION

The concern is enabled by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` | Turns off the concern. |
| `SYSTEM_HOOKS_DISABLED=1` | The master switch. It turns off this concern along with every other repository hook. |

Every adapter but Vibe's calls `isHookEnabled('session-lifecycle')` at entry and returns at once. The Claude adapters short-circuit before `ensureStateDir`, the thin adapters before reading stdin, and the Pi extensions return `undefined` before registering handlers. The Vibe hooks do not return at entry. `vibe/session-start.mjs` drops only its session-prime part, and `turn-start.mjs` and `turn-end.mjs` ignore the switch.

Optional tuning variables: `SPECKIT_STOP_HOOK_SPEC_TAIL_BYTES` (spec-folder detection tail size, default 50 KiB), `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1` (opt-in authored snapshot worker on `PreCompact`), `HOOK_TIMEOUT_MS` (per-hook deadline), `COMPACTION_TOKEN_BUDGET` and `SESSION_PRIME_TOKEN_BUDGET` (output budgets).

The Pi `session-start-advisories` extension and the DSH advisories adapter also honor each guard's own concern switch: `git-worktree-guard`, `git-hooks-check`, `live-sync`, `dist-freshness` and `hook-install`. DSH names the live-follow switch `live-follow`.

Set a flag inline for one command, export it for a session or persist it in `.skilled/hooks/hook-flags.env`. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for one session.

---

## 7. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-spec-kit/runtime && npm run build
```

Expected result: `tsc --build` succeeds and the `dist/hooks/<runtime>/*.js` entrypoints are produced.

```bash
cd .skilled/skills/system-spec-kit/runtime && npm run typecheck
```

Expected result: no type errors, which confirms the `.ts` sources still compile against the skill's shared modules.

```bash
node -e "import('./.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error. Repeat for `session-stop.js`, `compact-inject.js` and the `codex/`, `cursor/` and `devin/` siblings.

```bash
node --test .skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-lifecycle/tests/pi-session-start-advisories.test.ts
```

Expected result: every test passes in both runs.

```bash
pi --offline --approve -p "list your available tools" </dev/null
```

Expected result: exit 0 and no extension-load error, which confirms `.pi/extensions/session-*.ts` resolve their imports.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree this concern lives in, with the kill-switch index and the coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): what these hooks inject and how visible it is to the operator.
- [`../session-cleanup/README.md`](../session-cleanup/README.md): the teardown concern that reaps MCP helpers using the `CLAUDE_SESSION_PID` these hooks persist.
- [`../completion-evidence/README.md`](../completion-evidence/README.md): the completion sentinel that reads the per-session `lastSpecFolder` state these hooks write.
- [`../ask-surface-guard/`](../ask-surface-guard/): the ask-surface concern whose turn-end part `vibe/turn-end.mjs` runs.
- [`../../skills/system-spec-kit/runtime/hooks/README.md`](../../skills/system-spec-kit/runtime/hooks/README.md): the owning skill's hook contract.
