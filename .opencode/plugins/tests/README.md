---
title: "Plugin Tests: Regression Coverage for OpenCode Plugin Entrypoints"
description: "Node test runner suites that pin each plugin entrypoint's export shape, hook behavior, and fail-open guarantees."
trigger_phrases:
  - "plugin tests"
  - "plugin regression suite"
  - "opencode plugin test coverage"
---

# Plugin Tests: Regression Coverage for OpenCode Plugin Entrypoints

---

## 1. OVERVIEW

`tests/` holds the regression suites for the plugin entrypoints in the parent `.opencode/plugins/` folder. Each suite runs under Node's built-in test runner (`node:test`), not vitest or jest, and exercises a single plugin against hermetic fixtures with no live OpenCode session or daemon required.

Current state:

- 19 `*.test.cjs` files. Most map one to one to a plugin entrypoint in `../`, confirmed per file rather than assumed.
- Two files test a different surface than an OpenCode plugin: `claude-task-dispatch-guard.test.cjs` pins the Claude hook adapter that shares `mk-deep-loop-guard.js`'s dispatch-guard core, and `speckit-goal-offer-contract.test.cjs` pins goal-offer text in `commands/speckit/*` rather than `mk-goal.js` itself.
- `helpers/` carries shared fixture readers used across the `mk-goal-*` suites. See [helpers/README.md](./helpers/README.md) for its own contract.

---

## 2. DIRECTORY TREE

```text
tests/
+-- claude-task-dispatch-guard.test.cjs   # Claude adapter over mk-deep-loop-guard.js's shared core
+-- helpers/                              # Shared fixture readers for the mk-goal-* suites
|   `-- continuation-log.cjs
+-- mk-code-graph-freshness.test.cjs      # mk-code-graph-freshness.js
+-- mk-code-graph.test.cjs                # mk-code-graph.js
+-- mk-deep-loop-guard.test.cjs           # mk-deep-loop-guard.js
+-- mk-dist-freshness-guard.test.cjs      # mk-dist-freshness-guard.js
+-- mk-goal-capabilities.test.cjs         # mk-goal.js
+-- mk-goal-continuation.test.cjs         # mk-goal.js
+-- mk-goal-export-contract.test.cjs      # mk-goal.js
+-- mk-goal-lifecycle.test.cjs            # mk-goal.js
+-- mk-goal-state.test.cjs                # mk-goal.js
+-- mk-goal-supervisor.test.cjs           # mk-goal.js
+-- mk-goal-tool-path.test.cjs            # mk-goal.js
+-- mk-post-edit-quality.test.cjs         # mk-post-edit-quality.js
+-- mk-skill-advisor.test.cjs             # mk-skill-advisor.js
+-- mk-spec-gate.test.cjs                 # mk-spec-gate.js
+-- mk-spec-memory.test.cjs               # mk-spec-memory.js
+-- mk-speckit-completion.test.cjs        # mk-speckit-completion.js
+-- session-cleanup.test.cjs              # session-cleanup.js
`-- speckit-goal-offer-contract.test.cjs  # commands/speckit/* (not a plugin file)
```

---

## 3. KEY FILES

`helpers/continuation-log.cjs` exports `readContinuationEntries` and `restoreEnv`. Every `mk-goal-*` suite pulls both via `require('./helpers/continuation-log.cjs')` to read the goal continuation log and reset environment overrides between tests.

| Plugin covered | Test file | What it pins |
|---|---|---|
| `mk-code-graph.js` | `mk-code-graph.test.cjs` | Transport validation, cache lifecycle, output guards and bounded bridge behavior. |
| `mk-code-graph-freshness.js` | `mk-code-graph-freshness.test.cjs` | The OpenCode before/after callID correlation and the Claude `.cjs` adapter's synchronous lock release, against temp-project fixtures. |
| `mk-deep-loop-guard.js` | `mk-deep-loop-guard.test.cjs` | Export shape and the `tool.execute.before` hook: warn/reject toggle, fail-open behavior, non-deep passthrough, prompt-based identity resolution and session-scoped loop-repeat detection. |
| `mk-deep-loop-guard.js` (Claude adapter) | `claude-task-dispatch-guard.test.cjs` | The Claude PreToolUse(Task) hook over the shared dispatch-guard core: silent approve, warn (with a write to the shared bounded warning log) and deny, plus the cross-process loop-repeat counter both runtimes persist to the same state directory. |
| `mk-dist-freshness-guard.js` | `mk-dist-freshness-guard.test.cjs` | Export shape, warn-only staleness detection across watched packages and the guarantee that the guard never writes to the terminal. |
| `mk-goal.js` | `mk-goal-capabilities.test.cjs` | Read-only operator-facing capabilities: goal history plus doctor/health reporting. |
| `mk-goal.js` | `mk-goal-continuation.test.cjs` | Default-off autonomy gates and continuation caps. |
| `mk-goal.js` | `mk-goal-export-contract.test.cjs` | The plugin loader's export shape and the full pinned `__test` seam list. |
| `mk-goal.js` | `mk-goal-lifecycle.test.cjs` | Lifecycle events accounting usage and tracking prompt blocks. |
| `mk-goal.js` | `mk-goal-state.test.cjs` | Session-keyed goal persistence and passive injection. |
| `mk-goal.js` | `mk-goal-supervisor.test.cjs` | Verifier verdicts mapping to durable goal state. |
| `mk-goal.js` | `mk-goal-tool-path.test.cjs` | The real tool execute path (`executeGoalAction`/`executeGoalStatus`) resolving a session id from a `ToolContext`. |
| `mk-post-edit-quality.js` | `mk-post-edit-quality.test.cjs` | The shared post-edit-router dispatch table and fail-open behavior. The plugin's export shape and callID correlation. The Claude `.cjs` adapter's warn-only, exit-0 contract. |
| `mk-skill-advisor.js` | `mk-skill-advisor.test.cjs` | Cache freshness, bounded subprocess behavior, lifecycle races and cross-runtime directive parity. |
| `mk-spec-gate.js` | `mk-spec-gate.test.cjs` | The kill-switch ordering contract: `MK_SPEC_GATE_DISABLED=1` must short-circuit before `output` is read or mutated at all. |
| `mk-spec-memory.js` | `mk-spec-memory.test.cjs` | Plugin cache, bridge, hook-boundary and message schema hardening without a live session. |
| `mk-speckit-completion.js` | `mk-speckit-completion.test.cjs` | The kill-switch contract: `MK_SPECKIT_COMPLETION_DISABLED=1` must return an empty hooks object rather than a registered tool that reports disabled. |
| `session-cleanup.js` | `session-cleanup.test.cjs` | Lifecycle, safety gating, diagnostics and live process-tree shell guards. |
| `commands/speckit/*` (not a plugin) | `speckit-goal-offer-contract.test.cjs` | The goal-offer text and `mk_goal`/`mk_goal_status` allowed-tools wiring across the speckit command presentation, workflow YAML and router files. |

---

## 4. VALIDATION

Run from the repository root:

```bash
node --test .opencode/plugins/tests/*.test.cjs
```

Baseline at the time of writing: 3 suites, 248 tests, 247 passing. One pre-existing failure, `regression graph key files exclude non-deliverable legacy basenames` in `mk-goal-tool-path.test.cjs`, is unrelated to this folder's documentation and stays open.

---

## 5. RELATED

- [`../README.md`](../README.md): the parent OpenCode plugin entrypoints README this suite covers
- [`./helpers/README.md`](./helpers/README.md): the shared test-helper module
