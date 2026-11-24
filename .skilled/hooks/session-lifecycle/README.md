---
title: "Session Lifecycle Hooks: Continuity + Context Priming"
description: "Session-lifecycle adapters prime or restore context for Claude, Codex, Cursor, Devin, DSH, Pi and Vibe, while OpenCode handles session events in its own plugins."
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

`session-lifecycle/` adds context at session start and restores a cached brief after compaction. Stop handlers record state in runtimes that expose a stop event.

Claude's `session-prime.ts` handles start context. `compact-inject.ts` stores the pre-compaction brief. `session-stop.ts` records per-session state. Several runtime adapters call these handlers where their event models match. Devin and Pi also recover from their post-compaction events. Vibe composes its own context. OpenCode keeps lifecycle work in its owning plugins and has no directory in this folder.

The concern key is `session-lifecycle`. It matches the folder name. Its switch is `SYSTEM_SESSION_LIFECYCLE_DISABLED`. The master switch is `SYSTEM_HOOKS_DISABLED`.

---

## 2. HOW IT WORKS

`runSessionStartHook()` branches on the input `source`. It handles `startup` and `resume` directly. For `compact`, it checks the cached brief's age and semantic validity before writing recovered context. A missing or stale brief returns a `/speckit:resume` pointer. A rejected brief follows the same recovery path. The `clear` source emits a fresh-context notice.

`buildMergedCompactResult()` removes recovered cache lines from the transcript tail. It builds active-file and recent-context sections, then calls `mergeCompactBrief()`. `persistCompactResult()` saves the result in per-session hook state.

When `transcript_path` is present, `processStopHook()` reads new transcript content from the saved offset. It collects state changes and writes them in one `updateState()` call. Context autosave runs only when this stop produced a summary and its state update succeeded.

After `processStopHook()`, Claude's `main()` runs `autoRecordDecisions()`. When the transcript tail names exactly one spec folder that holds a `spec.md`, it writes the session's queued tool answers into that folder's `decision-record.md` at the end of the turn. Chat candidates wait for a save. The decision-capture nudge then reports whatever is still pending.

Claude's `compact-inject.ts` handles `PreCompact`. Codex and Cursor use matching pre-compaction entries. Devin and Pi recover from their post-compaction events. DSH calls `runSessionPrime()` with `source: 'compact'` after a completed compaction. Vibe registers `compaction-post-tool.mjs` to check for new journal data after a tool call.

The stop handlers run at each runtime's end event. Claude, Codex and Devin run `session-stop` at `Stop`. Cursor runs `cursor/session-end.js` at `sessionEnd`. DSH runs `dsh/session-stop-context.mjs` at `agent/disposed`. Pi runs `pi/session-stop-context.ts` at `session_shutdown`. Vibe runs `vibe/turn-end.mjs` at `post_agent`.

---

## 3. RUNTIME COVERAGE

The table names each runtime's session-start entry. Section 2 names the compaction and stop events.

| Runtime | Event | Entry in this folder | Real file | Runtime output and failure |
|---|---|---|---|---|
| Claude | `SessionStart` | `claude/session-prime.js` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` | Context text on stdout. A top-level error is logged and the process exits 0. |
| Codex | `SessionStart` | `codex/session-start.js` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` | A `hookSpecificOutput.additionalContext` envelope. A handler error is logged to stderr and exits 0. |
| Cursor | `sessionStart` | `cursor/session-start.js` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js` | `permission: allow` with optional `agent_message`. A handler error logs to stderr and returns allow. |
| Devin | `SessionStart` | `devin/session-start.js` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js` | A `hookSpecificOutput.additionalContext` envelope. A handler error is logged to stderr and exits 0. |
| OpenCode | `session.created` and `session.compacted` | None | `.opencode/plugins/system-skill-advisor.js` | Session events stay inside the owning plugin. |
| Pi | `session_start` | `pi/session-start-context.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` | Sends a hidden context message. A missing build warns in the Pi UI. Other errors return `undefined`. |
| DSH | `agent/created` | `dsh/session-start-context.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-context.mjs` | Injects a user message. A failure is logged through `ctx.logger`. |
| Vibe | `session_start` | `vibe/session-start.mjs` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Returns an `additional_context` response. A failing part is skipped. |

Claude registers its start entry in `.claude/settings.json` with a 3-second timeout. Codex uses `.codex/hooks.json` with the same timeout. Cursor registers in `.cursor/hooks.json` with a 10-second timeout. Devin uses `.devin/hooks.v1.json` with a 10-second start timeout and a 5-second post-compaction timeout.

DSH registers its adapters through `.dsh/plugins/repo-guards/index.mjs`. Pi loads its start entry from `.pi/extensions/session-start-context.ts`. OpenCode loads its owning plugins from `.opencode/plugins/*.js`. Vibe registers its session and turn entries in `.vibe/hooks.toml`. The DSH and Pi start adapters limit the session-prime child to 2.8 seconds. Vibe gives `turn-start` and `turn-end` 20 seconds each. Its post-tool binding has a 10-second timeout.

---

## 4. DIRECTORY TREE

```text
session-lifecycle/
+-- README.md
+-- claude/
+-- codex/
+-- cursor/
+-- devin/
+-- dsh/
+-- pi/
+-- tests/
`-- vibe/
```

Claude, Codex, Cursor and Devin folders hold TypeScript sources and compiled JavaScript links. DSH and Pi point to source files in the runtime hooks tree. Vibe holds runnable hook files and tests. There is no `opencode/` folder.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `claude/session-prime.ts` | Selects start context from the session source and validates cached recovery context. |
| `claude/compact-inject.ts` | Builds and stores the brief used after compaction. |
| `claude/session-stop.ts` | Updates per-session state and may run context autosave. |
| `../shared/hook-flags.cjs` | Resolves concern and master switches for the adapters that call it. |
| `tests/dsh-session-lifecycle.test.mjs` | Covers DSH adapter registrations and their fail-open paths. |
| `tests/pi-session-start-advisories.test.ts` | Checks the quiet and warning paths for Pi start advisories. |

---

## 6. CONFIGURATION

The concern key is `session-lifecycle`. Set `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` to disable adapters that check this concern. The Vibe session-start entry uses it for the shared session-prime part.

| Variable | Concern key | Effect |
|---|---|---|
| `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` | `session-lifecycle` | Turns off adapters that check the concern switch. |
| `SYSTEM_HOOKS_DISABLED=1` | Shared hook resolver | Turns off a hook before its concern switch is checked. |

The resolver accepts `1`, `true`, `yes` or `on` as a disable value, in any case.

---

## 7. VALIDATION

The DSH adapter suite is `tests/dsh-session-lifecycle.test.mjs`. The Pi advisory suite is `tests/pi-session-start-advisories.test.ts`. Run this switch smoke check from the repository root.

```bash
SYSTEM_SESSION_LIFECYCLE_DISABLED=1 node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js </dev/null
```

Expected result: no output on either stream and exit status 0.

---

## 8. RELATED

- [Hooks index](../README.md): the hooks tree and runtime coverage matrix.
- [Runtime hook tree](../../skills/system-spec-kit/runtime/hooks/README.md): the owning skill's hook entries.
- [Switch resolver](../shared/hook-flags.cjs): the shared concern and master switch rules.
- [Adapter test notes](./tests/README.md): the DSH and Pi session lifecycle test suites.
