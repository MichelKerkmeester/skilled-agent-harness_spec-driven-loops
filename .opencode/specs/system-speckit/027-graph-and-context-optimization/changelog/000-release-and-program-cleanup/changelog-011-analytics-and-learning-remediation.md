---
title: "Analytics and Learning Remediation: 3 Tier-2 Backlog Fixes"
description: "Three deliberate Tier-2 backlog remediations across the analytics + learning subsystems: consumption-log PII redaction (raw query_text replaced by a query_hash truncate+hash fingerprint plus a lazy idempotent migration that eliminates the live 241 PII rows on the next daemon recycle), model-pricing single-source-of-truth cleanup (deleting the dead model_pricing_versioned table + listModelPricing path with zero non-test callers, keeping the hardcoded SEEDED_MODEL_PRICING_ROWS constant), and batch-learning boost-math correctness (SCORE_NORMALIZATION so the cap can fire and signal volume is no longer ignored)."
trigger_phrases:
  - "analytics and learning remediation"
  - "consumption-log pii redaction query_hash"
  - "model-pricing single source of truth"
  - "batch-learning boost math normalization"
  - "tier-2 backlog remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/011-analytics-and-learning-remediation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup`

### Summary

Three deliberate Tier-2 backlog items across the analytics + learning subsystems were remediated, one per defect class — privacy, dead-path, correctness — each confirmed against the real code, fixed with the minimal scope-locked change, and proven by tests. (1) **Privacy:** `consumption_log.query_text` stored raw agent-prompt text (241 live rows); the column was changed to `query_hash` storing a truncate+hash fingerprint (first 8 chars + ':' + 16 hex chars of sha256) computed in-process before any SQL, plus a lazy idempotent migration (PRAGMA `table_info` detects the old `query_text` column → DROP TABLE → recreate with `query_hash`; the rows are disposable telemetry, so the drop IS the PII elimination); the write path and all readers (`getConsumptionPatterns` group-by + the intent-mismatch path now key on `query_hash`; examples emit `fingerprint:` strings) were updated; the 3 handler callers (memory-context, memory-search, memory-triggers) rename the input field `query_text` → `query`; `session_id` is left as-is (internal derived id, not PII); 45 tests pass incl. 9 new privacy tests. (2) **Dead-path:** the live cost path already used the hardcoded `SEEDED_MODEL_PRICING_ROWS` constant, while the parallel `model_pricing_versioned` DB table was read only by `listModelPricing()`, which had zero non-test callers — so the table CREATE, the seed INSERT, the `listModelPricing` function + its row interface, and the test references were deleted (75 deletions) and the constant documented as the single source of family-level pricing for internal analytics; 3/3 tests pass. (3) **Correctness:** the batch-learning boost formula divided by event count (a per-event average) so the `Math.min(.., MAX_BOOST_DELTA)` cap never fired and signal volume was ignored (3 vs 300 sessions → identical boost); `SCORE_NORMALIZATION = 10.0` was added (named, documented, tunable) and the formula changed to `min((weightedScore/10)*0.10, 0.10)` so boost scales with volume; shadow-only (writes `batch_learning_log.computed_boost` for dashboards, does NOT mutate live ranking); 55 tests pass. Affected TS typechecks clean. **The live 241 PII rows are eliminated when the daemon recycles and runs the Fix 1 migration.**

### Added

- `consumption-logger-privacy.vitest.ts`: 9 new privacy tests asserting no raw agent-prompt text is persisted to `consumption_log` (only the `query_hash` fingerprint).
- `batch-learning.vitest.ts`: a new low-vs-high-volume differentiation test proving the boost now scales with signal volume.
- `SCORE_NORMALIZATION = 10.0` in `batch-learning.ts`: a named, documented, tunable constant (~10 strong-equivalent signals in the 7-day window saturate the 0.10 cap).

### Changed

- `consumption-logger.ts`: the `consumption_log.query_text` column is replaced with `query_hash`, storing a truncate+hash fingerprint (first 8 chars + ':' + 16 hex chars of sha256) computed in-process before any SQL; a lazy idempotent migration (PRAGMA `table_info` → DROP TABLE → recreate) handles the legacy schema; the write path and all readers (`getConsumptionPatterns` group-by + the intent-mismatch path) key on `query_hash`, and examples emit `fingerprint:` strings.
- `memory-context.ts`, `memory-search.ts`, `memory-triggers.ts`: the consumption-log input field `query_text` is renamed to `query` in all 3 handlers.
- `session-analytics-db.ts`: `SEEDED_MODEL_PRICING_ROWS` is documented as the intentional single source of family-level pricing for internal analytics.
- `batch-learning.ts` boost formula: changed from a per-event average to `min((weightedScore/10)*0.10, 0.10)` so the boost scales with signal volume and the cap can fire; the computation remains shadow-only.

### Fixed

- `consumption-logger.ts`: `consumption_log.query_text` stored raw agent-prompt text — 241 live rows of user-derived PII. The column is now `query_hash` holding an in-process truncate+hash fingerprint, and a lazy idempotent migration drops + recreates the legacy table so the live PII rows are eliminated on the next daemon recycle. `session_id` is left as-is (internal derived id, not PII). 45 tests pass.
- `session-analytics-db.ts`: the `model_pricing_versioned` table (CREATE + seed INSERT) and `listModelPricing()` (function + row interface) were dead — `listModelPricing` had zero non-test callers and the live cost path already used `SEEDED_MODEL_PRICING_ROWS`. The dead table + path + test references were deleted (75 deletions), leaving one documented source of pricing truth. 3/3 tests pass.
- `batch-learning.ts`: the boost formula divided the weighted score by event count (a per-event average), so the `Math.min(.., MAX_BOOST_DELTA)` cap never fired and signal volume was ignored (3 vs 300 sessions produced an identical boost). With `SCORE_NORMALIZATION = 10.0` and `min((weightedScore/10)*0.10, 0.10)`, the boost now scales with volume and the cap is reachable. Shadow-only. 55 tests pass.

### Verification

| Check | Result |
|-------|--------|
| Each Tier-2 item confirmed against the real code before any edit | PASS — 3 CONFIRMED (PII column, dead pricing path, boost-math defect) |
| Fix 1: no raw prompt text persisted; migration idempotent; readers key on `query_hash` | PASS — 45 tests pass incl. 9 new privacy tests |
| Fix 2: dead pricing path removed; live cost path unaffected | PASS — `model_pricing_versioned` + `listModelPricing` deleted (75 deletions); 3/3 tests pass |
| Fix 3: boost scales with volume; cap can fire; shadow-only preserved | PASS — 55 tests pass incl. a new low-vs-high-volume differentiation test |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| Typecheck | PASS — all three changed surfaces typecheck clean (`tsc`) |
| Scope leak | PASS — edits confined to the confirmed-defect files (sources + handlers + tests) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `consumption-logger.ts` + `consumption-logger.vitest.ts` | Modified | `query_text` → `query_hash` fingerprint computed in-process; lazy idempotent migration; readers key on `query_hash`; examples emit `fingerprint:` strings |
| `consumption-logger-privacy.vitest.ts` | Added | 9 privacy tests asserting no raw prompt text is persisted |
| `memory-context.ts` + `memory-search.ts` + `memory-triggers.ts` | Modified | Rename the consumption-log input field `query_text` → `query` (3 handlers) |
| `session-analytics-db.ts` + `session-analytics-db.vitest.ts` | Modified | Delete `model_pricing_versioned` + `listModelPricing` + test references; document `SEEDED_MODEL_PRICING_ROWS` as single source (75 deletions) |
| `batch-learning.ts` + `batch-learning.vitest.ts` | Modified | Add `SCORE_NORMALIZATION = 10.0`; volume-scaled boost; new low-vs-high-volume test; shadow-only |

### Follow-Ups

- Deploy: recycle the mk-spec-memory daemon after commit so the consumption-logger, session-analytics-db, and batch-learning fixes take effect in the running daemon. The Fix 1 lazy migration runs on that recycle and eliminates the live 241 raw `query_text` PII rows.
- The dropped PII rows are disposable telemetry and intentionally not recoverable — the drop IS the redaction.
- Fix 3 stays shadow-only; promoting the volume-scaled boost to live ranking is a separate, out-of-scope decision.
