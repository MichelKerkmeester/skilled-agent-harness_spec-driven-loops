---
title: "Deep-Review Scripts Tests: reducer regression"
description: "Regression coverage for the shared review-state reducer's summary fallback, traceability and refines paths."
---

# Deep-Review Scripts Tests

---

## 1. OVERVIEW

Regression suite for `../` (deep-review's own scripts) and the shared reducer it consumes from `../../../runtime/scripts/reduce-state.cjs`.

---

## 2. CONTENTS

```text
tests/
+-- reduce-state-summary-fallback.test.cjs          # Summary fallback and delta-row regression
+-- reduce-state-traceability-and-refines.test.cjs  # Dead-end rendering and refines folding
+-- fixtures/
|   `-- blocked-stop-session/                       # Pre-built blocked_stop review session
`-- README.md
```

| File | Purpose |
|------|---------|
| `reduce-state-summary-fallback.test.cjs` | Proves `reduceReviewState()` falls back correctly when a review iteration is missing its own summary. It also covers delta finding rows keyed `id` or `findingId`, a running-total `findingsSummary` that pads only against findings still open by that run, and resolutions recorded only in delta files |
| `reduce-state-traceability-and-refines.test.cjs` | Proves a traceability-only iteration renders no BLOCKED dead end while an explicit Dead Ends entry still does. It also proves a row that refines a finding folds into it, an unknown refines target falls back to an ordinary insert and an id reuse without a refines link keeps both findings |
| `fixtures/blocked-stop-session/` | A pre-built review spec folder (state log, findings registry, dashboard, three iterations) that manually exercises the `blocked_stop` reducer path via its own runnable command. Not read by `reduce-state-summary-fallback.test.cjs`, which builds its fixtures dynamically with `mkdtemp` |

---

## 3. VALIDATION

```bash
node .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs
node .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs
```

Expected: the first prints `[deep-review] reduce-state summary fallback regression passed`. The second is a `node:test` file and reports `pass 4` and `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md)
