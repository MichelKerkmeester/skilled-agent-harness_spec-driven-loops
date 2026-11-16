---
title: "Session Lifecycle: Adapter Tests"
description: "Tests for the DSH session lifecycle adapters and the Pi session-start advisories, covering start context, advisory warnings, compaction re-prime, stop autosave and the fail-open policy."
trigger_phrases:
  - "dsh session lifecycle tests"
  - "session lifecycle test"
  - "compaction context test"
version: 1.0.0.0
---

# Session Lifecycle: Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the DSH session lifecycle adapters and the Pi session-start advisories. The DSH suite drives each registration function with a fake plugin context and stubbed cores. It then asserts the injected notices, the leaf gate, the concern switch and the fail-open policy. It runs under `node --test`. The Pi suite runs under Vitest with a fake `exec`, so no guard script runs.

The suite covers four adapters. `session-start-context` primes a new session. `session-start-advisories` runs the guard scripts and injects their warnings. `session-compact-context` re-primes after a completed compaction. `session-stop-context` checkpoints state when an agent is disposed.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-session-lifecycle.test.mjs` | The `node --test` suite for the DSH session lifecycle adapters. |
| `pi-session-start-advisories.test.ts` | The Vitest suite for the Pi session-start advisories. |

The suite covers the startup advisories and the command each one runs. It checks that a completed compaction re-primes the session and that a failed one does not. It checks that the stop autosave runs for an interactive agent and never for a fan-out leaf. It checks the start context injection and each fail-open throw path. On both runtimes it checks that a passing Codex hook check shows nothing and a failing one warns.

The suite has no error path of its own. It asserts behavior and fails the run when an assertion breaks.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-lifecycle/tests/pi-session-start-advisories.test.ts
```

Expected result: every test passes in both runs.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix.
- [`../dsh/session-start-context.mjs`](../dsh/session-start-context.mjs): one adapter under test.
- [`../../shared/tests/`](../../shared/tests/): the shared DSH test helpers.
