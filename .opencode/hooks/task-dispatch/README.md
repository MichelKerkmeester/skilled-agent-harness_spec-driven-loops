---
title: "Task Dispatch Hooks: Deep-Loop Guard + Fable Subagent Policy"
description: "PreToolUse guards for Task/subagent dispatches: deep-loop loop-repeat protection shared across runtimes, plus Claude's Fable-model subagent policy."
trigger_phrases:
  - "task dispatch guard"
  - "deep loop guard"
  - "fable subagent guard"
---

# Task Dispatch Hooks: Deep-Loop Guard + Fable Subagent Policy

---

## 1. OVERVIEW

`task-dispatch/` gates Task-tool dispatches before they execute. The main concern is deep-loop protection: `lib/dispatch-guard.cjs` recognizes dispatches that target deep-loop sub-agents and distinguishes a bounded external handoff from repeated handoffs that recreate a command-owned iteration loop outside its parent command. A second, Claude-only guard enforces the Fable-model subagent policy.

The core returns a transport-free `allow`/`warn`/`reject` decision; adapters translate it into their runtime's envelope. Warning state persists under `.opencode/skills/.loop-guard-state/` so both OpenCode and Claude share one bounded audit trail.

---

## 2. DIRECTORY TREE

```text
task-dispatch/
+-- lib/
|   `-- dispatch-guard.cjs        # registry indexing, target identity, loop-repeat state, policy
+-- claude/
|   +-- task-dispatch-guard.cjs   # PreToolUse(Task) adapter
|   `-- fable-subagent-guard.mjs  # PreToolUse(Task|Agent) Fable-model policy
+-- devin/    task-dispatch-guard.cjs
`-- cursor/   task-dispatch-guard.mjs
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lib/dispatch-guard.cjs` | Owns registry indexing, target identity resolution, Deep Route mode-mismatch detection, command-driven iteration recognition (requires a real on-disk deep-loop config, not just marker text), session-scoped loop-repeat state, the bounded warning log contract, and age-based state sweep. Never writes stdout/stderr. |
| `claude/task-dispatch-guard.cjs` | Claude `PreToolUse(Task)` adapter. Returns warnings as `additionalContext`, confirmed rejections through Claude's deny response. |
| `claude/fable-subagent-guard.mjs` | When the main session runs on a Fable model, denies the two dispatch shapes that would silently inherit it: `subagent_type: "fork"` and any call omitting `model`. Reads the active model from the session transcript; fails open when unreadable. |
| `devin/task-dispatch-guard.cjs` | Devin adapter over the same core. |
| `cursor/task-dispatch-guard.mjs` | Cursor `preToolUse` (matcher `Task`) adapter; `spawnSync`s the Claude adapter so policy cannot drift. |

OpenCode reaches the core through `.opencode/plugins/mk-deep-loop-guard.js`.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only. Adapters import `../lib/` and (CommonJS ones) `../../shared/hook-adapter-shared.cjs` — nothing outside this tree. |
| State | Loop-repeat counters and warning logs live in `.opencode/skills/.loop-guard-state/`, written by adapters (never the core) so both runtimes share one bounded log. |
| Failure | Fails open on malformed stdin or missing state. Rejection is reserved for confirmed loop-recreation and the Fable policy's two forbidden shapes. |

---

## 5. VALIDATION

```bash
node --test .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs .opencode/plugins/tests/mk-deep-loop-guard.test.cjs
```

Expected result: all tests pass (includes the forged-iteration-marker regression cases).

---

## 6. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../../skills/.loop-guard-state/README.md`](../../skills/.loop-guard-state/README.md): the shared state directory contract.
- [`../../skills/system-spec-kit/references/hooks/injection-contract.md`](../../skills/system-spec-kit/references/hooks/injection-contract.md): decision visibility per runtime.
