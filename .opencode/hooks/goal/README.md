---
title: "Goal Hooks: Cross-Runtime Session Goal Core + Manage CLI"
description: "Runtime-neutral session-goal state, RICCE prompt building, prompt-injection hardening, and heuristic verification, shared by every runtime through one state file plus a manage CLI."
trigger_phrases:
  - "cross-runtime goal core"
  - "goal manage cli"
  - "active goal injection"
  - "goal state file"
  - "goal heuristic verifier"
---

# Goal Hooks: Cross-Runtime Session Goal Core + Manage CLI

---

## 1. OVERVIEW

`goal/` is the runtime-neutral core for passive session-goal tracking outside OpenCode. OpenCode already has its own goal system — the `mk-goal` plugin (`.opencode/plugins/mk-goal.js`) with per-OpenCode-session state, native token accounting, and an auto-continue loop wired through OpenCode-only lifecycle events. This folder is a **sibling**, not a replacement: it ports mk-goal's template, prompt-injection hardening, and heuristic verifier into a single shared state file that any runtime adapter (Cursor, Pi hooks, or a plain terminal) can read and write through one manage CLI.

The two systems coexist by design: mk-goal owns OpenCode's per-session goal; `goal/lib/goal-core.cjs` owns one shared cross-runtime goal. Neither reads nor writes the other's state file.

**Status:** built. Phase 001 delivered the core, state, and manage CLI; phases 003/004/005 added the per-runtime injection adapters, now present under `cursor/` and `pi/`. Their honest parity tiers (probed live in phase 002): Cursor injects at `sessionStart` only (`beforeSubmitPrompt` never delivers, `stop` never fires); Pi injects on `input` (operator-visible transform) + restores on `session_start` + verifies on `turn_end` (no forced continuation). The `bin/goal.cjs` CLI remains available for any runtime without plugin tools, or a plain terminal.

---

## 2. WHAT IT DOES AND INJECTS

`renderGoalBrief()` builds the same passive steering block mk-goal's `renderGoalInjection` produces, with markers and field-line labels kept byte-compatible (`[active_goal:<id>]`, `status:`, `objective:`, `goal_prompt:`, `last_check:`, `usage:`, `directive:`, `[/active_goal]`) and the embedded `goalPrompt`'s Role line parameterized per runtime instead of hardcoded to OpenCode:

```text
[active_goal:<goalId>]
status: active
objective: <objective>
goal_prompt:
Role: Focused <runtimeLabel> execution agent operating under the active session goal.
Objective: <objective summary>
Context: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.
Method:
- Restate the concrete completion condition from available evidence before acting.
- <goal-focus hints selected from the objective text>
- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.
Success Criteria:
- The requested outcome is materially complete, not merely analyzed or partially prepared.
- Required verification has run, or any inability to run it is reported with the exact blocker.
- Status output distinguishes confirmed evidence from inference.
Stop Conditions:
- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.
- If blocked, preserve state and name the next safe action.
last_check: <verdict> ; reason: <reason>
usage: tokens n/a/<tokenBudget>; time <seconds>s; iteration <turnsUsed> (source: turn-count-estimate)
directive: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.
[/active_goal]
```

Falls back to mk-goal's compact shape (`[active_goal:<id>]` / `goal_prompt:` / `last_check:` / `directive:` / `[/active_goal]`, no `status:`/`objective:`/`usage:` lines) when the full block would exceed the char budget.

**Deliberate deviation from mk-goal:** the `usage:` line's token count is honestly `n/a` — no runtime outside OpenCode exposes a native per-message token feed to this core, so turn count (`turnsUsed`, incremented by `recordTurn()`) is the accounting primitive instead of tokens. The record's `usageSource` field is always `"turn-count-estimate"`, never silently implying token-level accuracy.

The `cursor/` and `pi/` adapters inject this block per their runtime's lifecycle (see §1 Status for each runtime's trigger and parity tier); the exact rendered text is `renderGoalBrief()`'s output, which an operator can also preview via `bin/goal.cjs show`'s `injection_preview` field.

---

## 3. DIRECTORY TREE

```text
goal/
+-- lib/
|   +-- goal-core.cjs        # state I/O, render, hardening, heuristic verifier
|   `-- goal-core.test.cjs   # node --test
+-- bin/
|   `-- goal.cjs             # manage CLI: set/show/history/doctor/health/clear/complete/pause/resume
+-- cursor/   goal-inject.mjs (sessionStart-only injection)
+-- pi/       goal-context.ts (input/session_start/turn_end factory; symlinked from .pi/extensions/)
`-- opencode/ mk-goal.js (browsability symlink -> ../../../plugins/; real file loaded from .opencode/plugins/)
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `lib/goal-core.cjs` | Runtime-neutral core. Resolves the shared state directory (`MK_GOAL_STATE_DIR` override, else `.opencode/skills/.goal-state/` under the walked-up repo root), does atomic temp+rename writes at mode `0600`, archives terminal records to `.goal-state/.archive/active-goal-<goalId>.json` before clear/complete, ports mk-goal's `normalizeUserAuthoredText` prompt-injection hardening and `defaultHeuristicSupervisorVerifier` heuristic verifier, and renders the `[active_goal]` block. Every exported function fails open — no read/parse error, and no `PLUGIN_DISABLED`-style guard failure, ever throws past a caller boundary except the explicit `GoalError`s mutation actions raise for the CLI to translate into `code=`. |
| `bin/goal.cjs` | Thin router over the core, mirroring `/goal-opencode`'s command contract: same action set (`set`/`show`/`history`/`doctor`/`health`/`clear`/`complete`/`pause`/`resume`), same `STATUS=<OK\|FAIL> ACTION=<...>` envelope, same `mutation=<created\|refreshed\|replaced>` line on `set`, same `--budget N` positive-base-10-integer parsing and `INVALID_TOKEN_BUDGET`/`INVALID_OBJECTIVE` error codes, same `MK_GOAL_PLUGIN_DISABLED=1` fail-closed behavior with `code=PLUGIN_DISABLED`. Bare text (no recognized action token) falls through to `set`, matching the router's "any other non-empty QUERY" rule. |

The shared state file lives at `.opencode/skills/.goal-state/active-goal.json`, beside — never touching — mk-goal's own per-session files and `.archive/` in that same directory.

OpenCode discovers plugins only from `.opencode/plugins/`, so `mk-goal.js` must live there; the `opencode/` folder here holds a browsability-only symlink pointing back into it (nothing loads through the symlink — it keeps this concern's runtimes visible in one tree, the reverse of Pi's `.pi/extensions/` direction). The `cursor/` and `pi/` adapters are the per-runtime wiring that reads the shared state through the core; their honest parity tiers (injection everywhere, verify/continue only where a real lifecycle event supports it) are recorded in the capability matrix under the `032-goal-hooks-cross-runtime` packet.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `lib/goal-core.cjs` imports Node builtins only. `bin/goal.cjs` imports only `../lib/goal-core.cjs`. Neither reaches into `.opencode/plugins/mk-goal.js` or vice versa. |
| State ownership | This core owns exactly one record, `active-goal.json`, plus its own `.archive/` entries. It never reads or writes mk-goal's per-session `<hex-session-id>.json` files or `.continuation.log`/`.goal-events.log`. |
| Failure | Reads fail open (missing/malformed state -> `null`). Mutations raise a `GoalError` with a `code` the CLI turns into `STATUS=FAIL ... code=<CODE>`; nothing here writes stdout/stderr directly except the CLI's own envelope output. |
| Disabled state | `MK_GOAL_PLUGIN_DISABLED=1` fails every mutating and read action closed with `code=PLUGIN_DISABLED`, mirroring mk-goal's own kill switch. |
| Test isolation | `MK_GOAL_STATE_DIR` (env) or an explicit `stateDir` option overrides the resolved state directory so tests, and any future adapter under active development, never touch the real `.goal-state/` tree. |

---

## 6. VALIDATION

```bash
node --test .opencode/hooks/goal/lib/goal-core.test.cjs
```

Expected result: all tests pass.

```bash
MK_GOAL_STATE_DIR=/tmp/goal-smoke node .opencode/hooks/goal/bin/goal.cjs set "Ship the widget" --budget 500
MK_GOAL_STATE_DIR=/tmp/goal-smoke node .opencode/hooks/goal/bin/goal.cjs show
MK_GOAL_STATE_DIR=/tmp/goal-smoke node .opencode/hooks/goal/bin/goal.cjs clear
```

Expected result: `STATUS=OK ACTION=set` with `mutation=created`, then `STATUS=OK ACTION=show` with `goal_present=true`, then `STATUS=OK ACTION=clear`.

---

## 7. RELATED

- [`../../plugins/mk-goal.js`](../../plugins/mk-goal.js): the OpenCode goal plugin this core ports its template, hardening, and heuristic verifier from.
- [`../../commands/goal-opencode.md`](../../commands/goal-opencode.md): the `/goal-opencode` router contract `bin/goal.cjs` mirrors action-for-action.
- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../injection-contract.md`](../injection-contract.md): what each hook injects and its operator visibility (pending an entry for this concern once per-runtime adapters land).
