---
title: "Pi Hooks: Spec-Gate + Session-Lifecycle Bridges"
description: "Pi extension factories for Gate-3 spec-gate enforcement and session-lifecycle context, discovered through one-line entry files in .pi/extensions/ that re-export them."
trigger_phrases:
  - "pi spec gate"
  - "pi session lifecycle"
---

# Pi Hooks: Spec-Gate + Session-Lifecycle Bridges

---

## 1. OVERVIEW

`hooks/pi/` holds the real files behind the `.pi/extensions/` entry files for this skill's Pi hooks. Pi discovers each one through its one-line entry file, which re-exports it, so it loads from this folder and every import Pi resolves in these files is relative to this folder. `completion-evidence.ts` also keeps a long test-only specifier left from the link-based layout.

---

## 2. DIRECTORY TREE

```text
pi/
├── lib/
│   └── claude-hook-adapter.ts  # Spawn proxy into the compiled Claude hook outputs
├── completion-evidence.ts      # Advisory completion-evidence check at turn end
├── session-compact-context.ts  # Post-compaction context, locator offer and recovery pointer
├── session-start-advisories.ts # Warn-only session-start guards
├── session-start-context.ts    # Session-start context bridge
├── session-stop-context.ts     # Autosave and state cleanup on quit
├── spec-gate-classify.ts       # Gate-3 classification on input
├── spec-gate-enforce.ts        # Gate-3 enforcement on tool calls
└── README.md
```

---

## 3. WHAT EACH ONE DOES AND INJECTS

| File | Pi event | Behavior and injected text |
|---|---|---|
| `spec-gate-classify.ts` | `input` | Runs the shared core's `classifyIntent()` and opens the gate on a mutation-shaped turn. A dialog-capable session (`ctx.hasUI`) keeps its turn untouched; a session without one relays the one-shot deferral instruction instead of the menu, so the model is told the decision is coming without being asked mid-turn. |
| `spec-gate-enforce.ts` | `tool_call` (bash/write/edit) | Runs `evaluateMutation()`. At the first undelivered write/edit with a dialog-capable UI it opens `ctx.ui.select` + a path input, binds the answer through `bindGate3Answer`, and blocks that one call with a retry reason naming the bound path; a denied write/edit blocks with the core's reason, and a cancelled dialog fails open. Bash is advise-only and never prompts. |
| `session-start-context.ts` | `session_start` | Bridges `session-prime.js`'s startup context (compact recovery, resume reminder) into the session via `pi.sendMessage()`. Pi has no `compact` or `clear` start reason, so both map to the `startup` default. |
| `completion-evidence.ts` | `turn_end` | Evaluates the same advisory-only sentinel as Claude against the ending assistant message, delegating policy to `../lib/completion-evidence-sentinel.cjs`. Never blocks. |
| `session-start-advisories.ts` | `session_start` | Runs the 4 warn-only CLI checks (worktree guard, git-hooks check, dist staleness, codex-hooks drift) and surfaces failures via `ctx.ui.notify()` (a no-op in print mode). |
| `session-stop-context.ts` | `session_shutdown` (`quit`) | Fire-and-forget bridge to `session-stop.js`'s autosave/state cleanup. Injects nothing. |
| `session-compact-context.ts` | `session_compact` | Rehydrates spec-folder continuity after a compaction (summary retention, shared state file, bounded CLI fallback). It mints a `live_branch_or_session_log` locator, persists it, and appends the bounded `## History Lookup` section only when the write succeeded and the Pi reader is `ready`. When the last active packet has an authored purpose, a `## Packet Purpose` section comes before `## Active Spec Folder`. Every message ends with the `## Recovery` pointer that names `/speckit:resume`. |
| `lib/claude-hook-adapter.ts` | (library) | `spawnSync` proxy into this skill's compiled Claude hook outputs plus the JSON-envelope parser. It is imported by the session bridges and the advisor's `prompt-advisor.ts`. |

Exact injected strings and per-runtime visibility: [`injection-contract.md`](../../../../../hooks/injection-contract.md).

---

## 4. RELATED

- [`lib/README.md`](lib/README.md): the Claude-adapter proxy the session bridges call into.
- [`../lib/spec-gate/README.md`](../lib/spec-gate/README.md): the shared Gate-3 policy core these bridges call.
- [`../../../../../../.pi/extensions/README.md`](../../../../../../.pi/extensions/README.md): the discovery mirror and entry map.
