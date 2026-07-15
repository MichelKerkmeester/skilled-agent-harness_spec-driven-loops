---
title: "Feature Specification: Analytics and Learning Remediation"
description: "Three deliberate Tier-2 backlog remediations across the analytics + learning subsystems: consumption-log PII redaction (raw query_text replaced by a truncate+hash query_hash fingerprint with a lazy idempotent migration), model-pricing single-source-of-truth cleanup (deleting the dead model_pricing_versioned table + listModelPricing path that had zero non-test callers), and batch-learning boost-math correctness (introducing SCORE_NORMALIZATION so the boost cap can actually fire and signal volume is no longer ignored). All 3 implemented + tested in the working tree."
trigger_phrases:
  - "analytics and learning remediation"
  - "consumption-log pii redaction query_hash"
  - "model-pricing single source of truth"
  - "batch-learning boost math normalization"
  - "tier-2 backlog remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/011-analytics-and-learning-remediation"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 Tier-2 fixes shipped with tests; PII rows clear on next daemon recycle migration"
    next_safe_action: "validate --strict and reconcile completion metadata"
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
    answered_questions:
      - "User directive: document the 3 implemented Tier-2 remediations (consumption-log PII redaction, model-pricing dead-path removal, batch-learning boost-math correctness); each ships with tests; fix #1 live-PII elimination happens on the next daemon recycle migration."
---
# Feature Specification: Analytics and Learning Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `139-analytics-and-learning-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three deliberate Tier-2 backlog items in the analytics + learning subsystems each carried a distinct defect class. (1) **Privacy:** `consumption_log.query_text` stored raw agent-prompt text — 241 live rows of it — exposing user-derived prompt content in internal telemetry. (2) **Dead path:** a `model_pricing_versioned` DB table (CREATE + seed INSERT) was read only by `listModelPricing()`, which had ZERO non-test callers; the live cost path already used the hardcoded `SEEDED_MODEL_PRICING_ROWS` constant, so the table was a confusing parallel source of pricing truth. (3) **Correctness:** the batch-learning boost formula divided the weighted score by event count (a per-event average), so the `Math.min(.., MAX_BOOST_DELTA)` cap never fired and signal VOLUME was ignored — 3 sessions and 300 sessions produced an identical boost.

### Purpose
Remediate all three Tier-2 items with the minimal, scope-locked change per defect, each proven by tests: replace the raw `query_text` column with a hashed `query_hash` fingerprint (computed in-process before any SQL) plus a lazy idempotent migration so the live 241 PII rows are eliminated on the next daemon recycle; delete the dead `model_pricing_versioned` table + `listModelPricing` path so the hardcoded constant is the single, documented source of family-level pricing for internal analytics; and add a named, documented `SCORE_NORMALIZATION` so the boost cap can fire and the shadow-only boost scales with signal volume.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **FIX 1 (privacy):** redact `consumption_log` PII by replacing `query_text` with a `query_hash` truncate+hash fingerprint; add a lazy idempotent migration; update the write path and ALL readers; rename the handler input field `query_text` → `query`.
- **FIX 2 (dead-path removal):** delete the `model_pricing_versioned` table CREATE + seed INSERT, the `listModelPricing` function + its row interface, and the test references; document the hardcoded `SEEDED_MODEL_PRICING_ROWS` constant as the single source of truth.
- **FIX 3 (correctness):** add `SCORE_NORMALIZATION = 10.0` and change the boost formula so it scales with volume and the cap can fire; keep it shadow-only (writes `batch_learning_log.computed_boost`; does NOT mutate live ranking).
- **VERIFY** every fix: per-fix test evidence (45 / 3 / 55 tests respectively); `tsc` clean; `validate.sh --strict` Errors 0.

### Out of Scope
- Any change to the live ranking math — Fix 3 is shadow-only.
- The `session_id` column on `consumption_log` — it is an internal derived id, not user PII, left as-is.
- Daemon recycle / deploy orchestration: handled separately by the orchestrator after commit. The live 241 PII rows are eliminated when the daemon recycles and runs the Fix 1 migration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts` | Modify | Replace `query_text` with `query_hash`; compute truncate+hash fingerprint in-process; add lazy idempotent migration (PRAGMA → DROP TABLE → recreate); update write path + all readers |
| `system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Rename consumption-log input field `query_text` → `query` |
| `system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Rename consumption-log input field `query_text` → `query` |
| `system-spec-kit/mcp_server/handlers/memory-triggers.ts` | Modify | Rename consumption-log input field `query_text` → `query` |
| `system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts` | Modify | Update existing tests to the `query_hash` contract |
| `system-spec-kit/mcp_server/tests/consumption-logger-privacy.vitest.ts` | Add | 9 new privacy tests asserting no raw prompt text is persisted |
| `system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts` | Modify | Delete `model_pricing_versioned` CREATE + seed INSERT, `listModelPricing` + row interface; document `SEEDED_MODEL_PRICING_ROWS` as single source of truth |
| `system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts` | Modify | Remove `listModelPricing` test references |
| `system-spec-kit/mcp_server/lib/feedback/batch-learning.ts` | Modify | Add `SCORE_NORMALIZATION = 10.0`; change boost formula to `min((weightedScore/10)*0.10, 0.10)`; stays shadow-only |
| `system-spec-kit/mcp_server/tests/batch-learning.vitest.ts` | Modify | Add a low-vs-high-volume boost differentiation test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Raw agent-prompt text is never persisted to `consumption_log` | Column is `query_hash`; the truncate+hash fingerprint is computed in-process before any SQL; no raw `query_text` written |
| REQ-002 | Live 241 PII rows are eliminated by a lazy idempotent migration | PRAGMA `table_info` detects the old `query_text` column → DROP TABLE → recreate with `query_hash`; rows are disposable telemetry, so the drop IS the PII elimination |
| REQ-003 | The dead pricing path is fully removed, leaving one source of truth | `model_pricing_versioned` CREATE + seed INSERT + `listModelPricing` + row interface deleted; `SEEDED_MODEL_PRICING_ROWS` documented as the single source |
| REQ-004 | Batch-learning boost scales with signal volume and the cap can fire | Formula uses `SCORE_NORMALIZATION`; low-vs-high-volume inputs produce different boosts; the `MAX_BOOST_DELTA` cap can be reached |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All consumption-log readers key on `query_hash` | `getConsumptionPatterns` high-frequency group-by and the intent-mismatch path key on `query_hash`; examples emit `fingerprint:` strings; 45 tests pass |
| REQ-006 | The 3 handler callers rename the input field `query_text` → `query` | memory-context, memory-search, memory-triggers updated; `session_id` left as-is (internal derived id, not user PII) |
| REQ-007 | Fix 3 remains shadow-only | Boost is written to `batch_learning_log.computed_boost` for dashboards and does NOT mutate live ranking; 55 tests pass |
| REQ-008 | Affected TS still typechecks after edits | `tsc` clean across all three changed surfaces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 Tier-2 remediations implemented and proven by tests (consumption-logger 45; session-analytics-db 3/3; batch-learning 55).
- **SC-002**: Comment-hygiene clean (no spec-path / packet-id artifacts in edited source).
- **SC-003**: Affected TS typechecks clean; `validate.sh --strict` Errors 0 for this packet.
- **SC-004**: The live 241 PII rows are eliminated when the daemon recycles and runs the Fix 1 migration (documented limitation, not a blocker for this packet).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Migration drops live telemetry rows | The 241 existing rows are removed on recycle | Intentional: the rows are disposable telemetry AND the PII payload; the drop IS the redaction. Documented as the elimination mechanism |
| Risk | Hash fingerprint loses grouping fidelity | Group-by on `query_hash` could over- or under-collapse | Truncate+hash (first 8 chars + ':' + 16 hex of sha256) keeps a stable per-query fingerprint for group-by; examples emit `fingerprint:` strings |
| Risk | Deleting the pricing table breaks a hidden caller | A live reader could fail | Confirmed `listModelPricing` had ZERO non-test callers and the live cost path already used `SEEDED_MODEL_PRICING_ROWS`; only test references needed updating |
| Risk | Boost-math change perturbs live ranking | A correctness fix could shift production scores | Fix 3 is shadow-only — writes `computed_boost` for dashboards, does NOT mutate live ranking |
| Dependency | Daemon recycle for Fix 1 migration | The 241 live PII rows persist until recycle | Orchestrator recycles the mk-spec-memory daemon after commit; the lazy migration runs then |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Privacy
- **NFR-P01**: No raw agent-prompt text may be persisted to `consumption_log`. The stored value is a `query_hash` fingerprint (first 8 chars + ':' + 16 hex chars of sha256), computed in-process before any SQL statement runs.
- **NFR-P02**: The lazy idempotent migration must detect the legacy `query_text` column via PRAGMA `table_info` and DROP+recreate the table with `query_hash`, so the live PII payload is eliminated on the next daemon recycle without manual intervention.

### Correctness
- **NFR-C01**: The batch-learning boost must scale with signal volume; `SCORE_NORMALIZATION = 10.0` is named, documented, and tunable (~10 strong-equivalent signals in the 7-day window saturate the 0.10 cap). The cap `Math.min(.., MAX_BOOST_DELTA)` must be reachable.
- **NFR-C02**: Fix 3 is shadow-only: the computed boost is persisted to `batch_learning_log.computed_boost` for dashboards and must NOT mutate live ranking.

### Maintainability
- **NFR-M01**: After Fix 2, `SEEDED_MODEL_PRICING_ROWS` is the single, documented source of family-level pricing for internal analytics; no parallel DB-backed pricing path remains.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- A fresh DB with no `consumption_log` table → the table is created directly with `query_hash`; the migration's PRAGMA detects no legacy `query_text` column and is a no-op.
- A DB still on the legacy `query_text` schema (the live 241-row case) → PRAGMA detects `query_text` → DROP TABLE → recreate with `query_hash`; the PII rows are eliminated by the drop.
- The migration runs again after redaction → PRAGMA finds `query_hash` (no `query_text`) → no-op; the migration is idempotent.
- `getConsumptionPatterns` group-by → keys on `query_hash`, so identical prompts still collapse to one fingerprint; examples emit `fingerprint:` strings instead of raw text.
- `listModelPricing` removed → the live cost path is unaffected because it already read `SEEDED_MODEL_PRICING_ROWS`; only test references were deleted.
- Batch-learning with 3 sessions vs 300 sessions → the volume-scaled boost now differs (the old per-event-average formula produced an identical boost); high volume can reach the 0.10 cap.
- `session_id` on `consumption_log` → left as-is; it is an internal derived id, not user PII.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | 3 fixes across 10 files (sources + handlers + tests) in 3 analytics/learning subsystems |
| Risk | 12/25 | One privacy-class migration that drops live rows; one dead-path deletion; one boost-math correctness fix (shadow-only) |
| Research | 10/20 | Confirmed `listModelPricing` had zero non-test callers and the live cost path uses the hardcoded constant; confirmed the boost cap never fired |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The 3 remediations are fully documented and implemented. Scope is frozen. The only deferred action is the orchestrator daemon recycle that runs the Fix 1 migration to eliminate the live 241 PII rows.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
