---
title: "Deep-Review Scripts Tests: reducer regression"
description: "node:test regression coverage for the shared review-state reducer's summary fallback path."
---

# Deep-Review Scripts Tests

---

## 1. OVERVIEW

Regression suite for `../` (deep-review's own scripts) and the shared reducer it consumes from `../../../runtime/scripts/reduce-state.cjs`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `reduce-state-summary-fallback.test.cjs` | Proves `reduceReviewState()` falls back correctly when a review iteration is missing its own summary |
| `fixtures/blocked-stop-session/` | A pre-built review spec folder (state log, findings registry, dashboard, three iterations) that manually exercises the `blocked_stop` reducer path via its own runnable command. Not read by `reduce-state-summary-fallback.test.cjs`, which builds its fixtures dynamically with `mkdtemp` |

## 3. VALIDATION

```bash
node .opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs
```

## 4. RELATED

- [`../README.md`](../README.md)
