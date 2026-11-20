---
title: "Subagent Dispatch Tests: DSH Adapter Cases"
description: "Node test suite for the DSH task dispatch adapter against the shared deep-loop policy core."
trigger_phrases:
  - "task dispatch dsh tests"
  - "dsh adapter parity tests"
  - "task dispatch throw policy"
version: 1.0.0.0
---

# Subagent Dispatch Tests: DSH Adapter Cases

---

## 1. OVERVIEW

`.skilled/hooks/subagent-dispatch-guard/tests/` holds the `node --test` suite for the DSH task dispatch adapter. The suite registers the adapter on a fake plugin context, then calls the handler the adapter subscribes to `tools/pre-execute`. Nothing here starts a live runtime.

The DSH guard bundle reaches this adapter through a link at `.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs`, so the file under test is the one the bundle loads.

Current state:

- Registration passes an `isEnabled` that always returns true, so the suite exercises the handler rather than the kill switch.
- The parity case drives a hand-off in a temporary project that has no registry file, so the core takes its no-registry allow path. The throw case drives a core that raises.

Both cases assert that the handler result is an allow. The adapter calls `next()` on every path, so a hand-off proceeds even when its core fails.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────╮
│ node --test                              │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ dsh-task-dispatch-guard.test.mjs         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ adapterHarness()                         │
│ fake context, handler map and log lines  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ registerTaskDispatchGuard(ctx, options)  │
│ subscribes to tools/pre-execute          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ core.evaluateDispatch(), or a core that  │
│ raises and then next()                   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ result kind and recorded log lines       │
╰──────────────────────────────────────────╯
```

The suite imports the production core and the production adapter. The fake context comes from the shared hook tests, so the suite asserts on what the adapter registers and on the lines it logs.

Dependency direction: this folder imports from the sibling folders and no imported module reaches back into the suite.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `dsh-task-dispatch-guard.test.mjs` | Runs the parity case and the throw-policy case against the DSH adapter. |

The parity case builds a request for `unregistered-fixture-agent`, checks that the core answers allow, then sends `subagent_fork` through the registered handler. The throw case checks that the exported `ERROR_POLICY` is `fail-open` and sends `subagent` with a core that raises.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The suite imports the core from `../lib/`, the adapter from `../dsh/` and the fake context helper from the shared tests. No test opens a runtime store or a transcript. |
| Kill switch | The adapter returns without subscribing when `isEnabled('task-dispatch')` is false. The suite passes `enabled`, which always returns true. |
| Temporary state | The parity case makes a project folder with `tempDir()` and removes it with `cleanup()` in a `finally` block. The adapter reads its registry and state paths from that folder. |
| Logging | The throw case counts the warn lines the fake context recorded through `ctx.logger.warn`. |

The parity target is not a loop executor, so the core records no count and writes no state file under the temporary folder.

On a core error the adapter wraps the log call in its own `try` block and then calls `next()`. A logging failure therefore cannot block the hand-off. The suite asserts that the fake context recorded exactly one log line.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node --test` | CLI | Runs the suite file. |
| `dsh-task-dispatch-guard.test.mjs` | Module | Holds the parity and throw-policy cases. |
| `registerTaskDispatchGuard` | Function | Builds the handler each case drives on the fake context. |

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs
```

Expected output: the summary reports `pass 2` and `fail 0`. A failed assertion exits non-zero, so the runner reports the file as failed.

---

## 7. RELATED

- [the concern README](../README.md) covers the shared policy and the per-runtime table.
- [the DSH adapter](../dsh/task-dispatch-guard.mjs) is the file each case registers.
- [the shared policy core](../lib/subagent-dispatch-guard.cjs) holds `evaluateDispatch`.
- [the shared hook tests](../../shared/tests/README.md) describe the fake context helper this suite imports.
