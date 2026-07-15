---
title: "Implementation Summary: Analytics and Learning Remediation"
description: "Three deliberate Tier-2 backlog remediations across the analytics + learning subsystems. (1) Privacy: consumption_log.query_text (raw agent-prompt text, 241 live rows) replaced with a query_hash truncate+hash fingerprint computed in-process before any SQL, plus a lazy idempotent migration (PRAGMA -> DROP TABLE -> recreate) so the live PII rows are eliminated on the next daemon recycle; write path + all readers updated; 3 handlers rename query_text -> query; 45 tests pass. (2) Dead-path: model_pricing_versioned table + listModelPricing (zero non-test callers) deleted; the hardcoded SEEDED_MODEL_PRICING_ROWS constant documented as the single source of family-level pricing; 75 deletions; 3/3 tests pass. (3) Correctness: SCORE_NORMALIZATION = 10.0 added so the batch-learning boost cap can fire and the shadow-only boost scales with signal volume; 55 tests pass. Affected TS typechecks clean."
trigger_phrases:
  - "analytics and learning remediation summary"
  - "tier-2 backlog remediation shipped"
  - "consumption-log pii redaction shipped"
  - "batch-learning boost normalization shipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/011-analytics-and-learning-remediation"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 Tier-2 fixes shipped; tests green; tsc clean; 241 PII rows clear on recycle"
    next_safe_action: "Recycle daemon to run Fix 1 migration; Fix 2/3 live on same recycle"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts"
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
# Implementation Summary: Analytics and Learning Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/011-analytics-and-learning-remediation` |
| **Completed** | 2026-06-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three deliberate Tier-2 backlog remediations across the analytics + learning subsystems, one per defect class — privacy, dead-path, correctness. Each was confirmed against the real code, fixed with the minimal scope-locked change, and proven by tests. The three fixes touched disjoint subsystems (telemetry + handlers / analytics / feedback), so parallel implementation never collided. The orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the affected TS typechecks before ship.

### 3 Fixes

| # | Target | Severity | Fix |
|---|--------|----------|-----|
| 1 | **consumption-log-pii-redaction** | P0 (privacy) | `consumption_log.query_text` stored raw agent-prompt text (241 live rows). The column is now `query_hash`, storing a truncate+hash fingerprint (first 8 chars + ':' + 16 hex chars of sha256) computed in-process before any SQL. A lazy idempotent migration (PRAGMA `table_info` detects the old `query_text` column → DROP TABLE → recreate with `query_hash`; the rows are disposable telemetry, so the drop IS the PII elimination) handles the existing schema. The write path and ALL readers were updated: `getConsumptionPatterns` high-frequency group-by and the intent-mismatch path now key on `query_hash`, and examples emit `fingerprint:` strings. The 3 handler callers (memory-context, memory-search, memory-triggers) rename the input field `query_text` → `query`. `session_id` is left as-is (internal derived id, not user PII). |
| 2 | **model-pricing-single-source** | P1 (dead-path) | The live cost path already used the hardcoded `SEEDED_MODEL_PRICING_ROWS` constant; the parallel `model_pricing_versioned` DB table was read only by `listModelPricing()`, which had ZERO non-test callers. The table CREATE, the seed INSERT, the `listModelPricing` function + its row interface, and the test references were deleted (75 deletions); the hardcoded constant is documented as the intentional single source of family-level pricing for internal analytics. |
| 3 | **batch-learning-boost-math** | P0 (correctness) | The boost formula divided the weighted score by event count (a per-event average), so the `Math.min(.., MAX_BOOST_DELTA)` cap never fired and signal VOLUME was ignored (3 vs 300 sessions produced an identical boost). `SCORE_NORMALIZATION = 10.0` was added (named, documented, tunable: ~10 strong-equivalent signals in the 7-day window saturate the 0.10 cap) and the formula changed to `min((weightedScore/10)*0.10, 0.10)` so boost scales with volume. Shadow-only: writes `batch_learning_log.computed_boost` for dashboards; does NOT mutate live ranking. |

> All 3 fixes shipped with tests. **Fix 1's live-PII elimination is a deferred action:** the lazy migration runs on the next mk-spec-memory daemon recycle, at which point the existing 241 raw `query_text` rows are dropped. Until that recycle, those rows persist.

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `consumption-logger.ts` + `consumption-logger.vitest.ts` | Modified | `query_text` → `query_hash` fingerprint computed in-process; lazy idempotent migration; readers key on `query_hash`; examples emit `fingerprint:` strings |
| `consumption-logger-privacy.vitest.ts` | Added | 9 new privacy tests asserting no raw prompt text is persisted |
| `memory-context.ts` + `memory-search.ts` + `memory-triggers.ts` | Modified | Rename the consumption-log input field `query_text` → `query` (3 handlers) |
| `session-analytics-db.ts` + `session-analytics-db.vitest.ts` | Modified | Delete `model_pricing_versioned` CREATE + seed INSERT, `listModelPricing` + row interface, test references; document `SEEDED_MODEL_PRICING_ROWS` as single source (75 deletions) |
| `batch-learning.ts` + `batch-learning.vitest.ts` | Modified | Add `SCORE_NORMALIZATION = 10.0`; volume-scaled boost formula; new low-vs-high-volume differentiation test; shadow-only |

Total: **10 files** (3 source fixes + 3 handlers + 4 tests, one of them new) across 3 disjoint subsystems, scope-locked to confirmed Tier-2 defects.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A confirm-then-implement pipeline on disjoint subsystems. The confirm stage grounded each Tier-2 item on the real code: `consumption_log.query_text` holding raw prompt text (241 live rows), `listModelPricing` having zero non-test callers while the live cost path used `SEEDED_MODEL_PRICING_ROWS`, and the batch-learning boost cap never firing because the per-event-average formula made volume irrelevant. The implement stage ran 3 agents on disjoint file sets so parallel writes never collided, each fixing only its confirmed defect and proving it with tests. The orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the affected TS typechecks before ship.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Store a `query_hash` fingerprint, not the raw `query_text` | The raw prompt text is user-derived PII; a truncate+hash fingerprint (first 8 chars + ':' + 16 hex of sha256) computed in-process before any SQL keeps stable per-query grouping for analytics while never persisting the payload. |
| Make the PII migration a DROP + recreate, not a column rewrite | The 241 existing rows are disposable telemetry AND the PII payload; dropping the table IS the redaction. A lazy idempotent migration (PRAGMA detects `query_text` → DROP → recreate with `query_hash`) eliminates them on the next daemon recycle with no manual step. |
| Delete the `model_pricing_versioned` table + `listModelPricing` outright | It was a dead parallel source of pricing truth (zero non-test callers); the live cost path already read the hardcoded `SEEDED_MODEL_PRICING_ROWS`. Removing it leaves one documented source of family-level pricing. |
| Add a named `SCORE_NORMALIZATION` rather than re-deriving per-event | A documented, tunable constant makes the boost cap reachable and ties boost to signal volume; the old per-event average ignored volume so 3 and 300 sessions produced an identical boost. |
| Keep Fix 3 shadow-only | The boost is written to `batch_learning_log.computed_boost` for dashboards and does NOT mutate live ranking, so the correctness fix carries no production-ranking risk. |
| Leave `session_id` on `consumption_log` untouched | It is an internal derived id, not user PII; redacting it would lose useful join/grouping signal for no privacy gain. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Each Tier-2 item confirmed against the real code before any edit | PASS — 3 CONFIRMED (PII column, dead pricing path, boost-math defect) |
| Fix 1: no raw prompt text persisted; migration idempotent; readers key on `query_hash` | PASS — 45 tests pass incl. 9 new privacy tests in `consumption-logger-privacy.vitest.ts` |
| Fix 2: dead pricing path removed; live cost path unaffected | PASS — `model_pricing_versioned` + `listModelPricing` deleted (75 deletions); 3/3 tests pass |
| Fix 3: boost scales with volume; cap can fire; shadow-only preserved | PASS — 55 tests pass incl. a new low-vs-high-volume differentiation test |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| Typecheck | PASS — all three changed surfaces typecheck clean (`tsc`) |
| Scope leak | PASS — edits land only in the confirmed-defect files (sources + handlers + tests) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fix 1's live-PII elimination happens on the next daemon recycle.** The lazy idempotent migration (PRAGMA `table_info` → DROP TABLE → recreate with `query_hash`) runs when the mk-spec-memory daemon next starts. Until that recycle, the existing 241 raw `query_text` rows persist on disk. After commit the orchestrator should recycle the daemon to run the migration and eliminate the PII. The new code never writes raw text, so no new PII accumulates in the meantime.
2. **The dropped PII rows are not recoverable.** By design — the drop IS the redaction; the rows are disposable telemetry. A code rollback restores the old schema for future writes but cannot resurrect the dropped rows.
3. **Fix 3 is shadow-only.** The volume-scaled boost is persisted to `batch_learning_log.computed_boost` for dashboards and does NOT yet affect live ranking. Promoting it to live ranking is a separate, out-of-scope decision.

### Downstream

The redacted consumption-log fingerprint, the single-source pricing constant, and the volume-scaled shadow boost are consumed by their respective subsystems (consumption analytics, internal cost analytics, and the batch-learning dashboards). After the orchestrator daemon recycle: the consumption-logger, session-analytics-db, and batch-learning fixes are live in the running daemon, and the Fix 1 migration has eliminated the 241 raw `query_text` PII rows.
<!-- /ANCHOR:limitations -->
