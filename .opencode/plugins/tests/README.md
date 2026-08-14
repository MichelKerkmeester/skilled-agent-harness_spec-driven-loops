---
title: "Plugin tests"
description: "Node test-runner suites for OpenCode plugin exports, hook behavior, lifecycle handling and fail-open guarantees."
trigger_phrases:
  - "plugin tests"
  - "plugin regression suite"
  - "OpenCode plugin test coverage"
---

# Plugin tests

---

## 1. OVERVIEW

`.opencode/plugins/tests/` contains the Node built-in test-runner suites for the plugin entrypoints in the parent directory. Tests use hermetic fixtures and do not require a live OpenCode session or daemon. The nested `helpers/` directory contains shared fixture utilities.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `claude-task-dispatch-guard.test.cjs` | Tests the Claude adapter over the shared dispatch-guard core. |
| `mk-completion-sentinel.test.cjs` | Tests completion-sentinel lifecycle behavior. |
| `mk-communication-projection.test.cjs` | Tests the projection plugin's gate matrix, snapshot restore, and fail-open boundary. |
| `mk-deep-loop-guard.test.cjs` | Tests deep-loop guard identity, repeat detection and fail-open paths. |
| `mk-dist-freshness-guard.test.cjs` | Tests freshness detection and terminal-output guarantees. |
| `mk-goal-capabilities.test.cjs` | Tests goal capability and operator-status reporting. |
| `mk-goal-continuation.test.cjs` | Tests guarded continuation behavior. |
| `mk-goal-export-contract.test.cjs` | Tests the goal plugin export contract. |
| `mk-goal-lifecycle.test.cjs` | Tests goal lifecycle events and usage tracking. |
| `mk-goal-state.test.cjs` | Tests session-keyed goal persistence. |
| `mk-goal-supervisor.test.cjs` | Tests verifier results and durable goal state. |
| `mk-goal-tool-path.test.cjs` | Tests tool-context session resolution. |
| `mk-post-edit-quality.test.cjs` | Tests post-edit routing and adapter behavior. |
| `mk-skill-advisor.test.cjs` | Tests advisor caching, lifecycle and bridge behavior. |
| `mk-spec-gate.test.cjs` | Tests mutation-gate kill-switch and hook behavior. |
| `mk-spec-memory.test.cjs` | Tests memory bridge, cache and hook-boundary behavior. |
| `mk-speckit-completion.test.cjs` | Tests completion-tool kill-switch behavior. |
| `session-cleanup.test.cjs` | Tests lifecycle cleanup and safety gating. |
| `speckit-goal-offer-contract.test.cjs` | Tests goal-offer command wiring outside the plugin entrypoint set. |
| `helpers/` | Shared continuation-log and environment-fixture helpers. |

## 3. VALIDATION

Run the Node test runner from the repository root:

```bash
node --test .opencode/plugins/tests/*.test.cjs
```

Expected result: Node discovers every current CJS test file and reports the suite result. Any failing test blocks validation.

## 4. RELATED

- [`Plugin entrypoints`](../README.md)
