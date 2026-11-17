---
title: "Goal Hooks: Session-Isolated Cross-Runtime Goals"
description: "Packet-bound goals: the packet goal.md is the directive, a per-session record holds the pointer and liveness, while Pi, Cursor, Devin and OpenCode inject a runtime brief built from the objective slice, and DSH and Vibe inject the chat slice."
trigger_phrases:
  - "cross-runtime goal core"
  - "goal manage cli"
  - "session goal isolation"
  - "legacy active goal migration"
  - "packet goal binding"
  - "goal durable slice"
  - "opencode goal plugin"
  - "native goal tools"
  - "plugin mirror link"
---

# Goal Hooks: Session-Isolated Cross-Runtime Goals

---

## 1. OVERVIEW

`.skilled/hooks/goal/` connects runtime sessions to packet `goal.md` files. The file holds the directive. The adapters add its goal text where their runtime supports injection.

The runtime-neutral core lives in `lib/goal-core.cjs`. It scopes records to native sessions. `lib/goal-slice.cjs` builds the packet's objective and chat slices, and the adapters and the OpenCode plugin render them into each runtime's context. OpenCode has a separate native plugin at `.opencode/plugins/opencode-goal.js` that shares the slice module.

The concern key is `goal`. Its canonical switch is `OPENCODE_GOAL_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch.

---

## 2. HOW IT WORKS

A packet-bound session record points to a packet. For such a goal the core reads the current `goal.md` before it renders a brief. If the file is missing, the bound session gets no brief. A goal set directly as text has no packet and renders from its stored objective.

The slice module removes frontmatter before it builds injection text. Session adapters use the objective slice for their briefs. The DSH context adapter and Vibe use the chat slice directly.

The core hashes each native session identity into an opaque state key. The resolved workspace and runtime also form part of the scope. Its default state directory is `.skilled/skills/.state/goal/`.

OpenCode's plugin owns its native goal state and tools. It shares packet projections with the core through `lib/goal-slice.cjs`.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime receives |
|---|---|---|---|---|
| Claude | None | None | None | The hooks matrix describes a native host goal command. This folder adds no Claude adapter. |
| Codex | None | None | None | The hooks matrix describes a native host goal command. This folder adds no Codex adapter. |
| Cursor | `sessionStart` | `cursor/goal-inject.mjs` | `.skilled/hooks/goal/cursor/goal-inject.mjs` | An active brief in `agent_message`. Errors return `permission: "allow"` without a message. |
| Devin | `SessionStart`, `UserPromptSubmit` | `devin/goal-inject.mjs` | `.skilled/hooks/goal/devin/goal-inject.mjs` | An active brief in `hookSpecificOutput.additionalContext`. Errors return an empty object. |
| OpenCode | Plugin event and system transform | `opencode/opencode-goal.js` | `.opencode/plugins/opencode-goal.js` | An `[active_goal]` block, plus the `opencode_goal` and `opencode_goal_status` tools. |
| Pi | `input`, `session_start` and `turn_end` | `pi/goal-context.ts` | `.skilled/hooks/goal/pi/goal-context.ts` | A brief on input and a restore message at session start. At turn end, an unmet goal queues a note for the next prompt. |
| DSH | `agent/created`, `agent/pre-step`, `agent/turn-stopping` and `agent/status` | `dsh/goal-context.mjs`, `dsh/goal-manage.mjs` | `.skilled/hooks/goal/dsh/goal-context.mjs`, `.skilled/hooks/goal/dsh/goal-manage.mjs` | Adds a packet slice notice at creation and a brief on operator turns. An unmet goal queues a verification note at idle. Adapter errors log a warning and continue. |
| Vibe | `session_start`, `pre_agent` | `vibe/goal-inject.mjs` | `.skilled/hooks/goal/vibe/goal-inject.mjs` | A packet chat slice at session start. Turn-start context can restore it after compaction. |

The runtime registration points are:

- **Claude:** `.claude/settings.json` has no goal hook entry. The hooks matrix records the native host goal command.
- **Codex:** `.codex/hooks.json` has no goal hook entry. The hooks matrix records the native host goal command.
- **Cursor:** `.cursor/hooks.json` registers the adapter on `sessionStart`.
- **Devin:** `.devin/hooks.v1.json` registers the adapter on `SessionStart` and `UserPromptSubmit`.
- **OpenCode:** the flat `.opencode/plugins/` glob loads `.opencode/plugins/opencode-goal.js`.
- **Pi:** `.pi/extensions/goal-context.ts` re-exports the Pi adapter.
- **DSH:** `.dsh/plugins/repo-guards/index.mjs` registers the context and management adapters from the guard bundle.
- **Vibe:** `.vibe/hooks.toml` runs the session-start composer, which imports the goal adapter, and the `pre_agent` turn-start composer, whose compaction part restores the goal slice.

---

## 4. DIRECTORY TREE

```text
goal/
+-- README.md
+-- goal-plugin.md
+-- bin/
|   +-- goal.cjs
|   `-- goal.test.cjs
+-- cursor/
|   +-- goal-inject.mjs
|   `-- goal-cursor.test.mjs
+-- devin/
|   +-- goal-inject.mjs
|   `-- goal-devin.test.mjs
+-- dsh/
|   +-- goal-context.mjs
|   `-- goal-manage.mjs
+-- lib/
|   +-- goal-core.cjs
|   +-- goal-core.test.cjs
|   +-- goal-slice.cjs
|   `-- goal-slice.test.cjs
+-- opencode/
|   `-- opencode-goal.js -> ../../../../.opencode/plugins/opencode-goal.js
+-- pi/
|   +-- goal-context.ts
|   `-- goal-pi.test.mjs
+-- tests/
|   `-- dsh-goal.test.mjs
`-- vibe/
    +-- goal-inject.mjs
    `-- goal-vibe.test.mjs
```

Every subfolder except `opencode/` also carries its own `README.md`.

The OpenCode entry in this tree is a browsing symlink. The flat plugin loader reads its real file under `.opencode/plugins/`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/goal-core.cjs` | Scopes session records and handles reads, bindings, lifecycle changes and packet log writes. |
| `lib/goal-slice.cjs` | Reads packet `goal.md` and builds the objective and chat slices. |
| `bin/goal.cjs` | Routes goal management and packet actions through the shared core. |
| `.opencode/plugins/opencode-goal.js` | OpenCode's native goal plugin and tool surface. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the goal switch and the master switch. |

---

## 6. CONFIGURATION

The goal concern is enabled by default. Disable values are `1`, `true`, `yes` and `on`, in any case.

| Variable | Effect |
|---|---|
| `OPENCODE_GOAL_DISABLED=1` | Disables goal behavior across the supported adapters. |
| `OPENCODE_GOAL_PLUGIN_DISABLED=1` | Legacy alias for the goal switch. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables every repository hook. |
| `OPENCODE_GOAL_STATE_DIR` | Overrides the default goal state directory. |

---

## 7. VALIDATION

| Suite | Test path |
|---|---|
| Core state | `lib/goal-core.test.cjs` |
| Packet slices | `lib/goal-slice.test.cjs` |
| Manage CLI | `bin/goal.test.cjs` |
| Cursor | `cursor/goal-cursor.test.mjs` |
| Devin | `devin/goal-devin.test.mjs` |
| Pi | `pi/goal-pi.test.mjs` |
| DSH | `tests/dsh-goal.test.mjs` |
| Vibe | `vibe/goal-vibe.test.mjs` |
| OpenCode | `.opencode/plugins/tests/` |

These suites cover the shared core, CLI and runtime adapters.

Run this read-only smoke check from the repository root:

```bash
OPENCODE_GOAL_DISABLED=1 bun .skilled/hooks/goal/cursor/goal-inject.mjs < /dev/null
```

Expected output: `{"permission":"allow"}` and exit status 0.

---

## 8. RELATED

- [Hooks overview](../README.md): the runtime coverage matrix and switch index.
- [OpenCode plugin contract](goal-plugin.md): the OpenCode goal plugin's behavior.
- [Injection contract](../injection-contract.md): the content each runtime injects.
- [Shared hook resolver](../shared/README.md): the common switch rules.
