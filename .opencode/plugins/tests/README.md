---
title: "Plugin tests"
description: "Node built-in test-runner suites for the OpenCode plugin entrypoints in the parent directory. Hermetic fixtures; no live OpenCode session or daemon required. Shared helpers under helpers/."
trigger_phrases:
  - "plugin tests"
  - "plugin regression suite"
  - "OpenCode plugin test coverage"
---

# Plugin tests

---

## 1. OVERVIEW

`.opencode/plugins/tests/` contains the Node built-in test-runner suites for the plugin entrypoints in the parent directory. Tests are **hermetic**: they use temporary directories (`os.tmpdir()`), in-process `import()` of the plugin module under test, stubbed `ctx.client` / bridge / subprocess seams, and per-test env var save/restore. No live OpenCode session, daemon, or network is required.

The suites pin three contracts above all: the **kill-switch ordering** (a disabled plugin must be a genuine full no-op, checked before any `output` read or mutation — not just a no-emit no-op that still normalizes `output.system`), the **fail-open boundary** (a missing payload, a subprocess timeout, a parse failure, or any internal error resolves to a no-op), and the **hook behavior** (correct injection / deny / advise / cache / lifecycle) when the kill-switch is off. Several plugins expose a `.__test` surface hanging off the default export so tests can reach internal helpers without a stray named export being mistaken for a second plugin.

Tests are CJS (`.test.cjs`) so they can `require()` Node builtins and the shared `hook-flags.cjs` resolver directly, while importing the ESM plugin under test via `import(pathToFileURL(...))`. Some suites use cache-busting query strings (`?${label}-${Date.now()}`) or `data:text/javascript;base64,...` instrumented modules to get a fresh module instance per test.

---

## 2. WHAT'S HERE / INVENTORY

| File | Plugin under test | Pins |
|---|---|---|
| `claude-task-dispatch-guard.test.cjs` | Claude adapter over the shared dispatch-guard core | Adapter behavior over the shared core. |
| `opencode-goal-capabilities.test.cjs` | `opencode-goal.js` | Goal capability and operator-status reporting. |
| `opencode-goal-continuation.test.cjs` | `opencode-goal.js` | Guarded continuation behavior; uses `helpers/continuation-log.cjs`. |
| `opencode-goal-export-contract.test.cjs` | `opencode-goal.js` | The goal plugin export contract (default export shape, `.__test` surface). |
| `opencode-goal-lifecycle.test.cjs` | `opencode-goal.js` | Goal lifecycle events and usage tracking; uses `helpers/continuation-log.cjs`. |
| `opencode-goal-state.test.cjs` | `opencode-goal.js` | Session-keyed goal persistence; uses `helpers/continuation-log.cjs`. |
| `opencode-goal-supervisor.test.cjs` | `opencode-goal.js` | Verifier results and durable goal state. |
| `opencode-goal-tool-path.test.cjs` | `opencode-goal.js` | Tool-context session resolution. |
| `session-cleanup.test.cjs` | `session-cleanup.js` | Lifecycle cleanup and safety gating. |
| `sk-code-post-edit-quality.test.cjs` | `sk-code-post-edit-quality.js` | Post-edit routing and adapter behavior; `tool.execute.before`/`after` callID correlation. |
| `sk-communication-projection.test.cjs` | `sk-communication-projection.js` | Projection gate matrix, snapshot restore, and fail-open boundary. |
| `speckit-goal-offer-contract.test.cjs` | goal-offer command wiring | Goal-offer command wiring outside the plugin entrypoint set. |
| `system-completion-sentinel.test.cjs` | `system-completion-sentinel.js` | Completion-sentinel lifecycle behavior; `session.idle` resolution via stubbed `ctx.client`. |
| `system-deep-loop-guard.test.cjs` | `system-deep-loop-guard.js` | Deep-loop guard identity, repeat detection, and fail-open paths. |
| `system-dist-freshness-guard.test.cjs` | `system-dist-freshness-guard.js` | Freshness detection and terminal-output guarantees. |
| `system-skill-advisor.test.cjs` | `system-skill-advisor.js` | Advisor caching, lifecycle, and bridge behavior; bridge imported via `pathToFileURL`. |
| `system-spec-gate.test.cjs` | `system-spec-gate.js` | Mutation-gate kill-switch ordering (disabled checked before `output` read), hook behavior when enabled. |
| `system-speckit-completion.test.cjs` | `system-speckit-completion.js` | Completion-tool kill-switch behavior. |
| `helpers/` | — | Shared fixture utilities (see `helpers/README.md`). |

---

## 3. DIRECTORY TREE

```text
tests/
+-- README.md                                   # this index
+-- claude-task-dispatch-guard.test.cjs
+-- opencode-goal-capabilities.test.cjs
+-- opencode-goal-continuation.test.cjs
+-- opencode-goal-export-contract.test.cjs
+-- opencode-goal-lifecycle.test.cjs
+-- opencode-goal-state.test.cjs
+-- opencode-goal-supervisor.test.cjs
+-- opencode-goal-tool-path.test.cjs
+-- session-cleanup.test.cjs
+-- sk-code-post-edit-quality.test.cjs
+-- sk-communication-projection.test.cjs
+-- speckit-goal-offer-contract.test.cjs
+-- system-completion-sentinel.test.cjs
+-- system-deep-loop-guard.test.cjs
+-- system-dist-freshness-guard.test.cjs
+-- system-skill-advisor.test.cjs
+-- system-spec-gate.test.cjs
+-- system-speckit-completion.test.cjs
`-- helpers/
    +-- README.md
    `-- continuation-log.cjs
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `system-spec-gate.test.cjs` | Pins the kill-switch ordering contract: `SYSTEM_SPEC_GATE_DISABLED=1` must be checked before `experimental.chat.system.transform` reads or mutates `output` at all. Also pins normal hook behavior (normalize + inject) when enabled. |
| `system-skill-advisor.test.cjs` | Pins advisor caching, lifecycle, and bridge behavior. Imports the bridge via `pathToFileURL(BRIDGE_PATH)` and exercises the TTL+LRU cache, in-flight dedup, and fail-open paths. |
| `opencode-goal-*.test.cjs` (7 files) | The goal plugin's split test surface: capabilities, continuation, export contract, lifecycle, state, supervisor, tool-path. Uses `helpers/continuation-log.cjs` for continuation-log fixtures. |
| `sk-code-post-edit-quality.test.cjs` | Pins the `tool.execute.before`/`after` callID-to-filePath correlation and the post-edit router drain on the next transform. |
| `sk-communication-projection.test.cjs` | Pins the projection gate matrix, snapshot-backed byte-exact restore, and fail-open boundary. |

---

## 5. CONFIGURATION

Tests manage their own env per test (save/restore). The kill-switch env each suite toggles is the same one documented in the parent `plugins/README.md` and each plugin's own README (e.g. `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED`, `SYSTEM_SPEC_MEMORY_DISABLED`, `SK_CODE_POST_EDIT_QUALITY_DISABLED`). No external configuration is required to run the suites.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Hermetic | Temporary directories, in-process `import()`, stubbed `ctx.client` / bridge / subprocess seams, per-test env save/restore. No live OpenCode session, daemon, or network. |
| Kill-switch ordering | A disabled plugin must be a genuine full no-op, checked before any `output` read or mutation — not just a no-emit no-op that still normalizes `output.system`. |
| Fail-open boundary | A missing payload, a subprocess timeout, a parse failure, or any internal error resolves to a no-op. |
| CJS shell, ESM under test | Tests are `.test.cjs` so they can `require()` Node builtins and `hook-flags.cjs`; the ESM plugin under test is imported via `import(pathToFileURL(...))`. Cache-busting query strings or `data:text/javascript;base64,...` instrumented modules give a fresh module instance per test where needed. |
| `.__test` surface | Several plugins expose internal helpers hanging off the default export so tests can reach them without a stray named export being mistaken for a second plugin. |
| Helpers | Shared fixture utilities live under `helpers/` (see `helpers/README.md`). |

---

## 7. VALIDATION

Run the Node test runner from the repository root:

```bash
node --test .opencode/plugins/tests/*.test.cjs
```

Expected result: Node discovers every current CJS test file and reports the suite result. Any failing test blocks validation.

To run a single suite:

```bash
node --test .opencode/plugins/tests/system-spec-gate.test.cjs
```

Expected result: that suite's tests pass.

---

## 8. RELATED

- [`../README.md`](../README.md): the plugin entrypoints these suites cover.
- [`helpers/README.md`](helpers/README.md): the shared test helpers.
- [`../../hooks/README.md`](../../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix.
