---
title: "Evaluation and housekeeping fixes"
description: "Covers six fixes addressing evaluation framework reliability and protocol-boundary safety, including ablation recallK, evalRunId persistence and exit handler cleanup."
trigger_phrases:
  - "evaluation and housekeeping fixes"
  - "eval framework reliability fixes"
  - "evalrunid persistence fix"
  - "ablation recallk parameter fix"
  - "exit handler cleanup fix"
version: 3.6.0.16
---

# Evaluation and housekeeping fixes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers six fixes addressing evaluation framework reliability and protocol-boundary safety, including ablation recallK, evalRunId persistence and exit handler cleanup.

These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.

---

## 2. HOW IT WORKS

Six fixes addressed evaluation framework reliability and protocol-boundary safety:

- **Ablation recallK (#33):** Ablation search limit uses `recallK` parameter instead of hardcoded 20.
- **evalRunId persistence (#34):** `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in the eval DB on first call, surviving server restarts.
- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
- **parseArgs guard (#36):** `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input at the protocol boundary.
- **128-bit dedup hash (#37):** Session dedup hash extended from `.slice(0, 16)` (64-bit) to `.slice(0, 32)` (128-bit) to reduce collision probability.
- **Exit handler cleanup (#38):** `_exitFlushHandler` reference stored. `cleanupExitHandlers()` now calls `process.removeListener()` for `beforeExit`, `SIGTERM` and `SIGINT`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/eval/ablation-framework.ts` | Lib | #33 Ablation `recallK` parameter replacing hardcoded 20 |
| `mcp-server/lib/eval/eval-logger.ts` | Lib | #34 `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in eval DB |
| `mcp-server/handlers/session-learning.ts` | Handler | #35 Postflight SELECT matches `phase IN ('preflight', 'complete')` for re-correction |
| `mcp-server/tools/types.ts` | Tool | #36 `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input |
| `mcp-server/lib/session/session-manager.ts` | Lib | #37 Session dedup hash extended from `.slice(0, 16)` to `.slice(0, 32)` (128-bit) |
| `mcp-server/lib/storage/access-tracker.ts` | Lib | #38 `_exitFlushHandler` ref stored, `cleanupExitHandlers()` calls `process.removeListener()` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/ablation-framework.vitest.ts` | Automated test | Ablation recallK parameter behavior |
| `mcp-server/tests/eval-logger.vitest.ts` | Automated test | evalRunId persistence across restarts |
| `mcp-server/tests/learning-stats-filters.vitest.ts` | Automated test | Postflight phase matching |
| `mcp-server/tests/context-server.vitest.ts` | Automated test | parseArgs guard coverage |
| `mcp-server/tests/session-manager.vitest.ts` | Automated test | Dedup hash length validation |
| `mcp-server/tests/access-tracker-extended.vitest.ts` | Automated test | Exit handler cleanup behavior |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-and-measurement/evaluation-and-housekeeping-fixes.md`
Related references:
- [test-quality-improvements.md](../../feature-catalog/evaluation-and-measurement/test-quality-improvements.md) — Test quality improvements
- [cross-ai-validation-fixes.md](../../feature-catalog/evaluation-and-measurement/cross-ai-validation-fixes.md) — Cross-AI validation fixes

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 082
