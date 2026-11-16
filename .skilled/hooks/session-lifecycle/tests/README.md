---
title: "Session Lifecycle: DSH Adapter Tests"
description: "node --test suite for the DSH session lifecycle, covering start context and advisories, compaction re-prime, stop autosave and the fail-open policy."
trigger_phrases:
  - "dsh session lifecycle tests"
  - "session lifecycle test"
  - "compaction context test"
version: 1.0.0.0
---

# Session Lifecycle: DSH Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the DSH session lifecycle adapters. The suite drives each registration function with a fake plugin context and stubbed cores. It then asserts the injected notices, the leaf gate, the concern switch and the fail-open policy. It runs under `node --test`.

The suite covers four adapters. `session-start-context` primes a new session. `session-start-advisories` runs the guard scripts and injects their warnings. `session-compact-context` re-primes after a completed compaction. `session-stop-context` checkpoints state when an agent is disposed.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-session-lifecycle.test.mjs` | The `node --test` suite for the DSH session lifecycle adapters. |

The suite covers the startup advisories and the command each one runs. It checks that a completed compaction re-primes the session and that a failed one does not. It checks that the stop autosave runs for an interactive agent and never for a fan-out leaf. It checks the start context injection and each fail-open throw path.

The suite has no error path of its own. It asserts behavior and fails the run when an assertion breaks.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix.
- [`../dsh/session-start-context.mjs`](../dsh/session-start-context.mjs): one adapter under test.
- [`../../shared/tests/`](../../shared/tests/): the shared DSH test helpers.
