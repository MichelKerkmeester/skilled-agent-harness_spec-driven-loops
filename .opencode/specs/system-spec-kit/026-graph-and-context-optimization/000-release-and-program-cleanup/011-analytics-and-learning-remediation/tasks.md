---
title: "Task Breakdown: Analytics and Learning Remediation"
description: "Task list for three Tier-2 backlog remediations: consumption-log PII redaction (query_hash fingerprint + lazy migration), model-pricing dead-path removal (delete model_pricing_versioned + listModelPricing), and batch-learning boost-math correctness (SCORE_NORMALIZATION). All 3 implemented + tested."
trigger_phrases:
  - "analytics and learning remediation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/011-analytics-and-learning-remediation"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All confirm + implement tasks complete; 3 fixes verified by tests"
    next_safe_action: "Metadata + validate + reconcile"
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
# Task Breakdown: Analytics and Learning Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Carry over the 3 Tier-2 backlog items (consumption-log PII, dead pricing path, boost-math defect)
- [x] T-02 [P] Confirm each item against the real code before any edit
- [x] T-03 Confirm `consumption_log.query_text` stores raw prompt text (241 live rows)
- [x] T-04 Confirm `listModelPricing` has zero non-test callers and the live cost path uses `SEEDED_MODEL_PRICING_ROWS`
- [x] T-05 Confirm the batch-learning boost cap never fires and volume is ignored (3 vs 300 sessions → identical boost)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-06 [P] Run 3 disjoint-file implement agents on the confirmed Tier-2 items
- [x] T-07 Fix (consumption-log-pii-redaction, P0): in `consumption-logger.ts` replace the `query_text` column with `query_hash` storing a truncate+hash fingerprint (first 8 chars + ':' + 16 hex chars of sha256) computed in-process before any SQL; add a lazy idempotent migration (PRAGMA `table_info` detects the old `query_text` column → DROP TABLE → recreate with `query_hash`; the disposable rows make the drop the PII elimination); update the write path and ALL readers (`getConsumptionPatterns` group-by + the intent-mismatch path key on `query_hash`; examples emit `fingerprint:` strings); the 3 handlers (memory-context, memory-search, memory-triggers) rename the input field `query_text` → `query`; `session_id` left as-is (internal derived id, not PII); 45 tests pass incl. 9 new in `consumption-logger-privacy.vitest.ts`; `tsc` clean
- [x] T-08 Fix (model-pricing-single-source, P1): in `session-analytics-db.ts` delete the `model_pricing_versioned` table CREATE, the seed INSERT, the `listModelPricing` function + its row interface, and the test references; document the hardcoded `SEEDED_MODEL_PRICING_ROWS` constant as the single source of family-level pricing for internal analytics; 75 deletions; 3/3 tests pass; `tsc` clean
- [x] T-09 Fix (batch-learning-boost-math, P0): in `batch-learning.ts` add `SCORE_NORMALIZATION = 10.0` (named, documented, tunable: ~10 strong-equivalent signals in the 7-day window saturate the 0.10 cap) and change the formula to `min((weightedScore/10)*0.10, 0.10)` so boost scales with volume and the cap can fire; stays shadow-only (writes `batch_learning_log.computed_boost` for dashboards; does NOT mutate live ranking); 55 tests pass incl. a new low-vs-high-volume differentiation test; `tsc` clean
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-10 Each of the 3 fixes has passing tests (consumption-logger 45; session-analytics-db 3/3; batch-learning 55)
- [x] T-11 Verify Fix 1: no raw prompt text persisted; migration idempotent; readers key on `query_hash`; handlers renamed to `query`
- [x] T-12 Verify Fix 2: `model_pricing_versioned` + `listModelPricing` removed; live cost path unaffected; `SEEDED_MODEL_PRICING_ROWS` documented as single source
- [x] T-13 Verify Fix 3: boost scales with volume; cap can fire; shadow-only preserved
- [x] T-14 Comment-hygiene clean: no spec-path / packet-id tracking artifacts introduced into any edited source file
- [x] T-15 Typecheck/build: all three changed surfaces typecheck clean
- [x] T-16 Orchestrator reviewed every diff; confirmed typecheck + tests; 3 agents touched disjoint file sets
- [x] T-17 description.json + graph-metadata.json
- [x] T-18 validate.sh --strict → 0
- [ ] T-19 (deferred, orchestrator) daemon recycle runs the Fix 1 migration → live 241 PII rows eliminated
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All confirm + implement tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 3 fixes applied; each stack-verified by tests
- [x] Ship tasks (metadata, validate) complete
- [ ] Fix 1 live-PII elimination deferred to the orchestrator daemon recycle (documented, not a packet blocker)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
