---
title: "Evaluation and housekeeping fixes"
description: "Covers six fixes addressing evaluation framework reliability and protocol-boundary safety, including ablation recallK, evalRunId persistence and exit handler cleanup."
trigger_phrases:
  - "evaluation and housekeeping fixes"
  - "eval framework reliability fixes"
  - "evalrunid persistence fix"
  - "ablation recallk parameter fix"
  - "exit handler cleanup fix"
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
| `mcp_server/lib/eval/ablation-framework.ts` | Lib | #33 Ablation `recallK` parameter replacing hardcoded 20 |
| `mcp_server/lib/eval/eval-logger.ts` | Lib | #34 `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in eval DB |
| `mcp_server/handlers/session-learning.ts` | Handler | #35 Postflight SELECT matches `phase IN ('preflight', 'complete')` for re-correction |
| `mcp_server/tools/types.ts` | Tool | #36 `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input |
| `mcp_server/lib/session/session-manager.ts` | Lib | #37 Session dedup hash extended from `.slice(0, 16)` to `.slice(0, 32)` (128-bit) |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | #38 `_exitFlushHandler` ref stored, `cleanupExitHandlers()` calls `process.removeListener()` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/ablation-framework.vitest.ts` | Automated test | Ablation recallK parameter behavior |
| `mcp_server/tests/eval-logger.vitest.ts` | Automated test | evalRunId persistence across restarts |
| `mcp_server/tests/learning-stats-filters.vitest.ts` | Automated test | Postflight phase matching |
| `mcp_server/tests/context-server.vitest.ts` | Automated test | parseArgs guard coverage |
| `mcp_server/tests/session-manager.vitest.ts` | Automated test | Dedup hash length validation |
| `mcp_server/tests/access-tracker-extended.vitest.ts` | Automated test | Exit handler cleanup behavior |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--evaluation-and-measurement/evaluation-and-housekeeping-fixes.md`
Related references:
- [test-quality-improvements.md](test-quality-improvements.md) — Test quality improvements
- [cross-ai-validation-fixes.md](cross-ai-validation-fixes.md) — Cross-AI validation fixes

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 082
