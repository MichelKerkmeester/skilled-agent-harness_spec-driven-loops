---
title: "Implementation Plan: Analytics and Learning Remediation"
description: "Plan for three deliberate Tier-2 backlog remediations: consumption-log PII redaction (query_text -> query_hash fingerprint + lazy idempotent migration), model-pricing dead-path removal (delete model_pricing_versioned + listModelPricing, keep SEEDED_MODEL_PRICING_ROWS as single source), and batch-learning boost-math correctness (add SCORE_NORMALIZATION so the cap can fire and volume matters). All 3 implemented + tested in the working tree; the live 241 PII rows clear on the next daemon recycle migration."
trigger_phrases:
  - "analytics and learning remediation plan"
  - "tier-2 remediation workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/011-analytics-and-learning-remediation"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 Tier-2 fixes implemented on disjoint files; tests green; tsc clean"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "analytics-and-learning-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Analytics and Learning Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | TypeScript (system-spec-kit mcp_server: telemetry consumption-logger, analytics session-analytics-db, feedback batch-learning, + 3 memory handlers) |
| **Executor** | Implement-and-test agents on disjoint file sets, one per remediation |
| **Parallelism** | 3 implement agents on disjoint subsystems (telemetry+handlers / analytics / feedback) |
| **Ground truth** | Real source code: `consumption_log` schema + readers, `model_pricing_versioned` callers (zero non-test), `SEEDED_MODEL_PRICING_ROWS` live cost path, batch-learning boost formula + `MAX_BOOST_DELTA` cap |

### Overview
Three deliberate Tier-2 backlog items, one per defect class — privacy, dead-path, correctness — each fixed with the minimal scope-locked change and proven by tests. Fix 1 (privacy) replaces the raw `query_text` column with a hashed `query_hash` fingerprint computed in-process before any SQL, adds a lazy idempotent migration so the live 241 PII rows are eliminated on the next daemon recycle, updates the write path + all readers, and renames the handler input field `query_text` → `query`. Fix 2 (dead-path) deletes the `model_pricing_versioned` table + `listModelPricing` path (zero non-test callers) so the hardcoded `SEEDED_MODEL_PRICING_ROWS` constant is the single documented source of family-level pricing. Fix 3 (correctness) adds a named `SCORE_NORMALIZATION` so the boost cap can fire and the shadow-only boost scales with signal volume. Each agent worked a disjoint file set; the orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the affected TS typechecks before ship.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 3 Tier-2 backlog items confirmed against the real code (PII column, dead pricing path, boost-math defect)
- [x] Each fix assigned a disjoint file partition so implement agents never collide
- [x] Confirmed `listModelPricing` had zero non-test callers and the live cost path uses `SEEDED_MODEL_PRICING_ROWS`

### Definition of Done
- [x] Fix 1: `query_text` → `query_hash` fingerprint; lazy idempotent migration; all readers + handlers updated
- [x] Fix 2: `model_pricing_versioned` + `listModelPricing` deleted; `SEEDED_MODEL_PRICING_ROWS` documented as single source (75 deletions)
- [x] Fix 3: `SCORE_NORMALIZATION = 10.0` added; volume-scaled boost; shadow-only preserved
- [x] Tests green per fix (consumption-logger 45; session-analytics-db 3/3; batch-learning 55); `tsc` clean
- [x] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent scope-locked remediations on disjoint subsystems, run in parallel and reviewed in one fan-in. Each fix touches only its own files; no two agents wrote the same file. A confirm step grounded every fix on the real code before any edit.

### Key Components
- **FIX 1 — consumption-log PII redaction (privacy)**: `consumption-logger.ts` stores a `query_hash` fingerprint instead of raw `query_text`; the fingerprint is computed in-process before any SQL; a lazy idempotent migration (PRAGMA `table_info` → DROP TABLE → recreate) eliminates the live 241 PII rows on recycle; `getConsumptionPatterns` and the intent-mismatch path key on `query_hash`; examples emit `fingerprint:` strings; the 3 handlers rename `query_text` → `query`.
- **FIX 2 — model-pricing single source of truth (dead-path)**: `session-analytics-db.ts` drops the `model_pricing_versioned` CREATE + seed INSERT, the `listModelPricing` function + its row interface, and the test references; `SEEDED_MODEL_PRICING_ROWS` is documented as the single source.
- **FIX 3 — batch-learning boost math (correctness)**: `batch-learning.ts` adds `SCORE_NORMALIZATION = 10.0` and changes the boost formula to `min((weightedScore/10)*0.10, 0.10)`; stays shadow-only (`batch_learning_log.computed_boost`, no live-ranking mutation).
- **REVIEW (orchestrator)**: read every diff, confirm comment-hygiene, confirm typecheck before ship.

### Data Flow
3 Tier-2 backlog items → CONFIRM (real-code grounding) → 3 disjoint implement agents → 10 files (sources + handlers + tests) → REVIEW (diffs + hygiene + typecheck) → ship → (orchestrator) daemon recycle runs the Fix 1 migration → live 241 PII rows eliminated.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `consumption-logger.ts` + 3 handlers (P0/P1) | Stored raw `query_text` (241 live PII rows); readers grouped on raw text; handlers passed `query_text` | Replace with `query_hash` fingerprint computed in-process; lazy idempotent migration (PRAGMA → DROP → recreate); readers key on `query_hash`; handlers rename `query_text` → `query` | 45 tests pass (incl. 9 new privacy tests); `tsc` clean |
| `session-analytics-db.ts` `model_pricing_versioned` / `listModelPricing` (P1) | Parallel DB-backed pricing table read only by `listModelPricing`, which had zero non-test callers; live cost path already used `SEEDED_MODEL_PRICING_ROWS` | Delete the table CREATE + seed INSERT, `listModelPricing` + row interface, and test references; document the constant as single source | 3/3 tests pass; 75 deletions; `tsc` clean |
| `batch-learning.ts` boost formula (P0) | Divided weighted score by event count (per-event average) so the cap never fired and volume was ignored (3 vs 300 sessions → identical boost) | Add `SCORE_NORMALIZATION = 10.0`; change formula to `min((weightedScore/10)*0.10, 0.10)`; stays shadow-only | 55 tests pass (incl. new low-vs-high-volume differentiation test); `tsc` clean |

Tier-2 backlog census:
- 3 CONFIRMED + FIXED: consumption-log PII redaction (privacy), model-pricing dead-path removal, batch-learning boost-math correctness.
- Fix 1's live-PII elimination is a deferred action: it runs on the next daemon recycle migration, not at commit time.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm — ground each item on the real code (done)
- [x] Confirm `consumption_log.query_text` stores raw prompt text (241 live rows)
- [x] Confirm `listModelPricing` has zero non-test callers and the live cost path uses `SEEDED_MODEL_PRICING_ROWS`
- [x] Confirm the batch-learning boost cap never fires and volume is ignored (3 vs 300 sessions → identical boost)

### Phase 2: Implement + verify (done)
- [x] Fix 1 — consumption-log PII redaction (P0): `query_text` → `query_hash` fingerprint computed in-process; lazy idempotent migration (PRAGMA → DROP → recreate); readers + handlers updated; 45 tests pass (9 new privacy tests)
- [x] Fix 2 — model-pricing single source of truth (P1): delete `model_pricing_versioned` CREATE + seed INSERT, `listModelPricing` + row interface, test references; document `SEEDED_MODEL_PRICING_ROWS`; 75 deletions; 3/3 tests pass
- [x] Fix 3 — batch-learning boost math (P0): add `SCORE_NORMALIZATION = 10.0`; formula `min((weightedScore/10)*0.10, 0.10)`; shadow-only; 55 tests pass (new low-vs-high-volume test)
- [x] Orchestrator reviewed every diff; comment-hygiene clean; affected TS typechecks

### Phase 3: Ship
- [x] description.json + graph-metadata.json
- [x] validate --strict → 0
- [x] reconcile completion metadata
- [ ] (deferred, orchestrator) daemon recycle runs the Fix 1 migration → live 241 PII rows eliminated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Privacy regression | no raw prompt text persisted; migration idempotency; readers key on `query_hash` | `consumption-logger-privacy.vitest.ts` (9 new) + `consumption-logger.vitest.ts` (45 total) |
| Dead-path regression | `listModelPricing` references removed; live cost path unaffected | `session-analytics-db.vitest.ts` (3/3) |
| Correctness regression | boost scales with volume; cap can fire; shadow-only preserved | `batch-learning.vitest.ts` (55, incl. low-vs-high-volume) |
| TS typecheck | all three changed surfaces | `tsc` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Fix 1's `query_hash` fingerprint is computed with sha256 in-process; no new dependency, no raw text reaches SQL.
- Fix 1's live-PII elimination depends on a daemon recycle: the lazy migration runs at next daemon start; until then the 241 rows persist.
- Fix 2 has no runtime dependency — `listModelPricing` had zero non-test callers, so only test references needed updating; the live cost path already used `SEEDED_MODEL_PRICING_ROWS`.
- Fix 3 is shadow-only and independent of the live ranking path; it writes `batch_learning_log.computed_boost` for dashboards only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Targeted code changes across 10 files in 3 disjoint subsystems; rollback is a clean revert of those files.

- **Revert**: restore the 10 edited/added files (3 sources + 3 handlers + 4 tests) to pre-fix state.
- **Deploy**: recycle the mk-spec-memory daemon after commit so the consumption-logger, session-analytics-db, and batch-learning fixes take effect in the running daemon. The Fix 1 migration runs on that recycle and eliminates the live 241 PII rows.
- **Migration reversal note**: Fix 1's migration DROPs the legacy `query_text` table; the dropped PII rows are not recoverable by design — that drop IS the redaction. A rollback restores the old code but cannot restore the dropped rows (intentional).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm) ──► Phase 2 (Implement) ──► Phase 3 (Ship) ──► (orchestrator) Daemon recycle / Fix 1 migration
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm | 3 Tier-2 backlog items | Implement |
| Implement | Confirm (grounded defects) | Ship |
| Ship | Implement (typecheck + tests green) | Daemon recycle |
| Daemon recycle | Ship (commit) | None (eliminates live 241 PII rows) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm (3 backlog items vs real code) | Low-Med | ~1 hour |
| Implement + verify (3 disjoint agents) | Med | ~2 hours |
| Ship (review, metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Fix 1 has a data migration that DROPs the legacy `query_text` table (intentional PII elimination; not reversible by design)
- [x] No feature flag required (Fix 2/3 are behavior fixes; Fix 3 is shadow-only)
- [x] Scope-locked to the 10 confirmed-defect files across 3 disjoint subsystems (no adjacent cleanup)

### Rollback Procedure
1. Restore the 10 edited/added files from version control.
2. Recycle the mk-spec-memory daemon for the reverted code to take effect.

### Data Reversal
- **Has data migrations?** Yes — Fix 1 DROPs the legacy `query_text` table and recreates it with `query_hash`.
- **Reversal procedure**: N/A — the dropped PII rows are disposable telemetry and are intentionally not recoverable; the drop IS the redaction. Reverting the code restores the old schema for future writes but does not resurrect the dropped rows.
<!-- /ANCHOR:enhanced-rollback -->
