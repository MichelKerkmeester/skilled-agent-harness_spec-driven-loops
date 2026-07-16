---
title: "Feature Specification: C2 Prod-Mode Recall Gate [template:level_2/spec.md]"
description: "The dual-mode run-eval-v2.mjs harness reports an eval-versus-prod fidelity delta but performs no baseline comparison and ships only single-target goldens that saturate. There is no prod-window recall gate over the completeRecall@3/@5/@8 columns the harness already emits plus an order-sensitive companion, so every downstream Tier-C retrieval candidate stays an unprovable hypothesis."
trigger_phrases:
  - "prod mode recall gate"
  - "complete recall at 3"
  - "spec corpus golden"
  - "run spec recall gate"
  - "retrieval regression gate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/003-retrieval-gated-tuning/015-prodmode-recall-gate"
    last_updated_at: "2026-07-04T17:11:50.789Z"
    last_updated_by: "markdown-agent"
    recent_action: "Round-2 remediation: widened gate to @3/@5/@8 plus order-sensitive metric, ceiling-aware"
    next_safe_action: "Run /speckit:plan to decompose the multi-target golden and the prod-window gate build"
    blockers: []
    key_files:
      - "../research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:c2a7e9d10f4b86352c1d0e74a9b5f823e6470d1c8a92b34f5e6071d2c84a9b35"
      session_id: "phase-015-prodmode-recall-gate"
      parent_session_id: "phase-015-prodmode-recall-gate"
    completion_pct: 0
    open_questions:
      - "Which K (@3/@5/@8) carries each measurability class headline given the K/N ceiling for multi-target classes"
    answered_questions:
      - "Whether the gate reads the eval column or the prod column, it reads ONLY the prod lens, across the @3/@5/@8 columns rather than @3 alone"
      - "Whether @5/@8 are admissible, they are, the floor-versus-cap reason for excluding them was a misread"
---
# Feature Specification: C2 Prod-Mode Recall Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `015-prodmode-recall-gate` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The prod retrieval path diverges from the external eval path, and the harness already measures the gap. `DEFAULT_MIN_RESULTS = 3` (`confidence-truncation.ts`) is a never-cut-below-3 MINIMUM guarantee, not a cap. Confidence truncation is cliff-conditional and returns 3..20, and token-budget truncation is the real prod-limiting stage. The eval lens runs `forceAllChannels` with no truncation while the prod lens runs the routed channel subset with confidence truncation active, so 028 measured a real eval-versus-prod fidelity gap on this corpus, reported as the harness `evalVsProdDelta`. The dual-mode harness `run-eval-v2.mjs` already runs both lenses on one copy DB and computes completeRecall at K of 3, 5 and 8 (`COMPLETE_RECALL_KS = '3,5,8'`), but it performs no baseline comparison and its `process.exitCode = 1` (line 357) is a crash handler rather than a recall verdict. The shipped single-target goldens saturate and hide wins because a multi-target query has something to be incomplete about and a single-target query does not. The net effect is that every downstream Tier-C retrieval candidate (C1, C3, C4, C5) stays a hypothesis with no instrument to promote or regress it.

### Purpose
Build a prod-window recall instrument that reads the prod-lens completeRecall@3/@5/@8 columns the harness already emits plus an order-sensitive companion (NDCG@K with a top1 guard), so any retrieval-class change can be promoted only on a measured prod-column rise that also holds ranking quality, and regressed automatically when any of those reads falls. The @3/@5/@8 window lets the gate see the rank 4-8 band its own dependents (the 027 floor sweep, C1 and C4) exist to move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A multi-target `spec-corpus-golden.json` whose every CITABLE-class query carries a relevance set, so completeRecall has multiple targets to be incomplete about across the @3/@5/@8 prod-window columns. The `hard_negative` class is expected-NOT-citable and is excluded from the completeRecall gated pool (see REQ-004).
- A `run-spec-recall-gate.mjs` wrapper with a PROMOTION mode (assert the prod-column completeRecall across @3/@5/@8 rises over a stored baseline, the order-sensitive NDCG@K holds or rises, and top1 does not fall) and a REGRESSION mode (assert none of those prod-column reads falls below the baseline by more than the configured tolerance), reading ONLY the prod lens and never the eval lens.
- Reuse of the export already present on `run-eval-v2.mjs` (line 361 exports `buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS`) so the gate consumes its prod-lens completeRecall profile and measurability classes without re-implementing the lenses, plus the pure `computeNDCG` and `computeMRR` from `dist/lib/eval/eval-metrics.js` (the same module the harness imports) to compute the order-sensitive companion over the prod-lens per-query results, all without any harness change.
- A defined ingestion path that carries `spec-corpus-golden.json` into the harness retrieval loop, either by extending the harness ground-truth source (`GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` in `dist/lib/eval/ground-truth-data.js`) or by a gate-side loader that builds its own `relevancesByQuery` map. The REQ-005 reuse boundary covers only the prod lens, `meanCompleteRecallProfile` and the measurability classes, so copy-DB prep, ground-truth grouping and retrieval orchestration are gate-owned rather than harness exports.
- A stored baseline file the gate compares against, plus a real recall-verdict exit code distinct from the existing crash handler.

### Out of Scope
- Any change to ranking, retrieval lanes or the truncation floor itself - this phase measures, it does not move recall (the floor-moving work is C1).
- The full re-index plus coverage guard - this phase is the gate, not the re-embed. The coverage guard is a separate retrieval-migration prerequisite.
- Wiring the gate into CI on a `schedule:` trigger - that is the B1 sweep surface, not this phase.
- Eval-lens @K and external known-item @20 numbers as a pass condition - the eval lens runs `forceAllChannels` with no truncation and the external numbers skip routing, so they overstate prod recall and cannot promote a retrieval candidate. The prod-lens @5/@8 columns are admissible and IN scope - they are the prod window, not a hidden band. The earlier "the K=3 floor hides that band" reason was a floor-versus-cap misread: `DEFAULT_MIN_RESULTS = 3` guarantees at least 3, it does not cap at 3.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json` | Create | Multi-target gold set, one relevance set per query across the three measurability classes |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs` | Create | PROMOTION and REGRESSION gate reading only the prod-lens completeRecall@3/@5/@8 columns plus the order-sensitive NDCG@K and top1, ceiling-aware |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json` | Create | Stored prod-column completeRecall@3/@5/@8, NDCG@K and top1 baseline with a per-class headline-K the gate compares against |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Verify (no change) | Export already present at line 361 (`buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS`). Confirm it covers the gate's needs and add no second export, lenses unchanged |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js` | Verify (no change) | Order-sensitive `computeNDCG` and `computeMRR` already exported here (the same module the harness imports as `evalMetrics`). The gate computes its NDCG@K and top1 companion from them, no edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The gate MUST read the prod-lens completeRecall@3/@5/@8 columns and never the eval-lens column | A unit assertion confirms the verdict input is the prod profile across all three Ks, and flipping the lens input fails the test |
| REQ-002 | WHEN run in REGRESSION mode the gate SHALL exit non-zero IF any prod-column read (completeRecall@3/@5/@8, the order-sensitive NDCG@K, or top1) falls below the stored baseline by more than the configured tolerance | A scratch run with a degraded prod profile exits non-zero with a recall-verdict code distinct from the crash code |
| REQ-003 | WHEN run in PROMOTION mode the gate SHALL exit zero ONLY IF prod completeRecall rises over the stored baseline AND the order-sensitive NDCG@K holds or rises AND top1 does not fall | A promotion run with an unchanged prod profile exits non-zero, a run that lifts window membership but degrades top1 exits non-zero, and a run with a measured rise that holds ranking quality exits zero |
| REQ-004 | The `spec-corpus-golden.json` MUST carry multiple relevant targets per query for every CITABLE measurability class, and the `hard_negative` class MUST be excluded from the completeRecall gated pool | Every `thematic_multi_target` and `causal_chain` query has a relevance set of length 2 or more, no `hard_negative` query carries fabricated targets, and `meanCompleteRecallProfile` skips the zero-ground-truth `hard_negative` rows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The gate SHALL reuse the `run-eval-v2.mjs` prod lens, completeRecall profile and measurability classes through the export already present at line 361, plus the pure `computeNDCG` and `computeMRR` from `dist/lib/eval/eval-metrics.js`, rather than re-implementing them or adding a new export | The gate imports `buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES` from the existing line-361 export and the order-sensitive metrics from the shared eval-metrics module, no lens logic is duplicated, and the harness gains no second `export {}` |
| REQ-006 | The baseline file SHALL record the prod-column completeRecall@3/@5/@8, the order-sensitive NDCG@K and top1 per class and overall, with a per-class headline-K and a generated-at stamp and source DB path | The baseline JSON parses and carries `prodMode` completeRecall@3/@5/@8, NDCG@K and top1 fields plus the per-class headline-K and provenance |
| REQ-007 | The gate SHALL run in ceiling-aware delta mode, reading each class headline at the K that gives it headroom and never reading a sub-1.0 K/N ceiling as a regression | For a class with N targets, the per-class headline K is chosen so K does not exceed the class target count, and an unchanged profile at its K/N ceiling does not trip REGRESSION |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A degraded scratch prod profile fails REGRESSION mode with a recall-verdict exit code that is not the existing crash code (line 357), proving the gate verdicts recall rather than crashes.
- **SC-002**: A measured prod completeRecall@3/@5/@8 rise that holds NDCG@K and top1 passes PROMOTION mode, while an unchanged profile and a window-membership rise that degrades top1 both fail, proving promotions require a real prod-column move that also holds ranking quality.
- **SC-003**: `spec-corpus-golden.json` has no single-target CITABLE query, so completeRecall across @3/@5/@8 is non-saturating for the gated pool, and the expected-NOT-citable `hard_negative` class is excluded from that pool rather than seeded with fabricated targets.
- **SC-004**: A multi-target class sitting at its K/N ceiling (for example a 10-target query at @3) does not trip REGRESSION, proving the gate is ceiling-aware and reads each class at its headline K.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `run-eval-v2.mjs` dual-mode harness | The gate reuses the exported lens and classes but must own copy-DB prep, ground-truth grouping and the retrieval loop (all unexported), so it is more than a thin wrapper and still breaks if the lens contract changes | Consume only the exported lens and class symbols, never fork the lens body, and factor the gate-owned orchestration explicitly |
| Dependency | This phase unblocks the downstream Tier-C and 027 retrieval items, not itself | C1, C3, C4 and C5 cannot promote until this gate exists, and 015 is itself a Tier-C item that does not gate on itself | Ship the gate first because it is the keystone instrument for the downstream retrieval tier |
| Risk | Per-class thresholds mis-calibrated from a saturating gold set | High | Author multi-target goldens first and freeze the baseline only after the first non-saturating prod run |
| Risk | A @3-only or order-insensitive gate certifies window membership while the reader experience degrades | High | Read the @3/@5/@8 columns the harness already emits, fold in NDCG@K with a top1 guard, and run ceiling-aware so a sub-1.0 K/N ceiling is not read as a regression |
| Risk | A reviewer reads the eval column and repeats the 028 saturation mistake | High | REQ-001 hard-binds the verdict to the prod column and the gate refuses an eval-lens input |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate runs on the existing copy-DB path the harness already builds, with no second DB backup introduced.

### Reliability
- **NFR-R01**: The gate is deterministic on a fixed copy DB and gold set, so the recall-verdict exit code is stable across reruns of the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty relevance set for a citable-class query: the gate rejects the gold set at load rather than scoring a zero-target query as trivially complete. The expected-NOT-citable `hard_negative` class is excluded from the completeRecall pool instead, not rejected.
- A query whose targets all fall outside the prod window in prod (trimmed by the cliff-conditional confidence cut or the token-budget stage): it scores incomplete across @3/@5/@8 by design, which is the signal the gate exists to read.

### Error Scenarios
- Missing baseline file: PROMOTION mode writes a first baseline and exits with a neutral seed code, while REGRESSION mode fails closed.
- Harness export missing or renamed: the gate fails at import with a clear contract error rather than silently re-implementing a lens.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two net-new files reusing the existing export on a 361-line harness, plus gate-owned copy-DB prep, ground-truth grouping, retrieval orchestration and an order-sensitive companion computed from the shared eval-metrics functions |
| Risk | 8/25 | No ranking or floor change, risk is calibration and reading the right columns at the right Ks |
| Research | 4/20 | Seams already verified to file:line in research.md section 4 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which K (@3/@5/@8) carries each measurability class headline, given the K/N ceiling that bounds completeRecall@K below 1.0 for any class with more targets than K.
- Whether the verdict tier for this phase reads as conditional-C2-gated or as the gate that lifts that condition for the items downstream.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Tier C unblocker. The verdict for the gate itself is GO-on-cost and it is buildable-now: it touches measurement not ranking, the dual-mode harness already ships, and the build is two narrow files reusing the export already present on the harness plus the shared eval-metrics functions, with the gate-owned orchestration it must replicate. The downstream Tier-C retrieval items (C1, C3, C4, C5) and the 027 retrieval items are conditional-C2-gated on this instrument and stay deferred-until-measured behind it. 015 is itself a Tier-C item and does not gate on itself. The gate reads the prod lens, never the eval lens, because the eval lens runs `forceAllChannels` with no truncation and overstates prod recall. It reads the prod-lens completeRecall@3/@5/@8 columns the harness already emits plus an order-sensitive NDCG@K companion with a top1 guard, run ceiling-aware. The earlier claim that @5/@8 are inadmissible because the K=3 floor hides that band was a floor-versus-cap misread: `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-3 minimum guarantee, confidence truncation is cliff-conditional and returns 3..20, and token-budget truncation is the real prod-limiting stage. The direction survives unchanged (retrieval stays gated on a prod read, write-time ships on cost). Only the every-query-to-3 magnitude was wrong, and correcting it makes the prod-window columns the gate's proper read.
<!-- /ANCHOR:verdict -->
