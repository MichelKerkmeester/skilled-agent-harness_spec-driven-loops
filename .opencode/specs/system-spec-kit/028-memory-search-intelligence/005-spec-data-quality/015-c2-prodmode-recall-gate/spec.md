---
title: "Feature Specification: C2 Prod-Mode Recall Gate [template:level_2/spec.md]"
description: "The dual-mode run-eval-v2.mjs harness reports an eval-versus-prod fidelity delta but performs no baseline comparison and ships only single-target goldens that saturate. There is no prod-mode completeRecall@3 gate, so every Tier-C retrieval candidate stays an unprovable hypothesis."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/015-c2-prodmode-recall-gate"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the C2 prod-mode recall gate implementation spec from research.md"
    next_safe_action: "Run /speckit:plan to decompose the multi-target golden and gate build"
    blockers: []
    key_files:
      - "../research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:c2a7e9d10f4b86352c1d0e74a9b5f823e6470d1c8a92b34f5e6071d2c84a9b35"
      session_id: "phase-015-c2-prodmode-recall-gate"
      parent_session_id: "phase-015-c2-prodmode-recall-gate"
    completion_pct: 0
    open_questions:
      - "Whether per-class completeRecall@3 thresholds are calibrated from the first prod baseline or set as fixed floors"
    answered_questions:
      - "Whether the gate reads the eval column or the prod column, it reads ONLY prod"
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
| **Branch** | `015-c2-prodmode-recall-gate` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The prod retrieval path truncates every query to a 3-result floor (`confidence-truncation.ts`, `DEFAULT_MIN_RESULTS = 3`, applied at the prod seam), so 028 measured a 5.9x eval-versus-prod fidelity gap on this corpus. The dual-mode harness `run-eval-v2.mjs` already runs an eval lens and a prod lens on one copy DB and reports an `evalVsProdDelta` fidelity metric at K of 3, 5 and 8, but it performs no baseline comparison and its `process.exitCode = 1` (line 357) is a crash handler rather than a recall verdict. The shipped single-target goldens saturate and hide wins because a 3-target query has something to be incomplete about and a single-target query does not. The net effect is that every Tier-C retrieval candidate (C1, C3, C4, C5) stays a hypothesis with no instrument to promote or regress it.

### Purpose
Build a prod-mode completeRecall@3 instrument so any retrieval-class change can be promoted only on a measured prod-column rise and regressed automatically when it falls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A multi-target `spec-corpus-golden.json` whose every query carries a relevance set across the enumerated measurability classes, so completeRecall@3 has multiple targets to be incomplete about.
- A `run-spec-recall-gate.mjs` wrapper with a PROMOTION mode (assert the prod-column completeRecall@3 rises over a stored baseline) and a REGRESSION mode (assert the prod-column completeRecall@3 does not fall below the baseline), reading ONLY the prod column.
- Reuse of the export already present on `run-eval-v2.mjs` (line 361 exports `buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS`) so the gate consumes its prod-lens profile and measurability classes without re-implementing the lenses and without any harness change.
- A defined ingestion path that carries `spec-corpus-golden.json` into the harness retrieval loop, either by extending the harness ground-truth source (`GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` in `dist/lib/eval/ground-truth-data.js`) or by a gate-side loader that builds its own `relevancesByQuery` map. The REQ-005 reuse boundary covers only the prod lens, `meanCompleteRecallProfile` and the measurability classes, so copy-DB prep, ground-truth grouping and retrieval orchestration are gate-owned rather than harness exports.
- A stored baseline file the gate compares against, plus a real recall-verdict exit code distinct from the existing crash handler.

### Out of Scope
- Any change to ranking, retrieval lanes or the truncation floor itself - this phase measures, it does not move recall (the floor-moving work is C1).
- The full re-index plus coverage guard - this phase is the gate, not the re-embed. The coverage guard is a separate retrieval-migration prerequisite.
- Wiring the gate into CI on a `schedule:` trigger - that is the B1 sweep surface, not this phase.
- Eval-mode @K and external @5/@10/@20 numbers as a pass condition - they are explicitly inadmissible because the K=3 floor hides exactly that band.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json` | Create | Multi-target gold set, one relevance set per query across the three measurability classes |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs` | Create | PROMOTION and REGRESSION gate reading only the prod-lens completeRecall@3 column |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json` | Create | Stored prod-column completeRecall@3 baseline the gate compares against |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Verify (no change) | Export already present at line 361 (`buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS`); confirm it covers the gate's needs and add no second export, lenses unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The gate MUST read the prod-lens completeRecall@3 column and never the eval-lens column | A unit assertion confirms the verdict input is the prod profile, and flipping the lens input fails the test |
| REQ-002 | WHEN run in REGRESSION mode the gate SHALL exit non-zero IF prod completeRecall@3 falls below the stored baseline by more than the configured tolerance | A scratch run with a degraded prod profile exits non-zero with a recall-verdict code distinct from the crash code |
| REQ-003 | WHEN run in PROMOTION mode the gate SHALL exit zero ONLY IF prod completeRecall@3 rises over the stored baseline | A promotion run with an unchanged prod profile exits non-zero and a run with a measured rise exits zero |
| REQ-004 | The `spec-corpus-golden.json` MUST carry multiple relevant targets per query across the enumerated measurability classes | Every query has a relevance set of length 2 or more and a class tag drawn from `MEASURABILITY_CLASSES` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The gate SHALL reuse the `run-eval-v2.mjs` prod lens and measurability classes through the export already present at line 361 rather than re-implementing them or adding a new export | The gate imports `buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES` from the existing line-361 export, no lens logic is duplicated, and the harness gains no second `export {}` |
| REQ-006 | The baseline file SHALL record the prod-column completeRecall@3 per class and overall, with a generated-at stamp and source DB path | The baseline JSON parses and carries `prodMode` completeRecall@3 fields plus provenance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A degraded scratch prod profile fails REGRESSION mode with a recall-verdict exit code that is not the existing crash code (line 357), proving the gate verdicts recall rather than crashes.
- **SC-002**: A measured prod completeRecall@3 rise passes PROMOTION mode and an unchanged profile does not, proving promotions require a real prod-column move.
- **SC-003**: `spec-corpus-golden.json` has no single-target queries, so completeRecall@3 is non-saturating and every query contributes a measurable incompleteness.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `run-eval-v2.mjs` dual-mode harness | The gate reuses the exported lens and classes but must own copy-DB prep, ground-truth grouping and the retrieval loop (all unexported), so it is more than a thin wrapper and still breaks if the lens contract changes | Consume only the exported lens and class symbols, never fork the lens body, and factor the gate-owned orchestration explicitly |
| Dependency | This phase unblocks every Tier-C and 027 retrieval item | C1, C3, C4 and C5 cannot promote until this gate exists | Ship the gate first because it is the keystone for the whole retrieval tier |
| Risk | Per-class thresholds mis-calibrated from a saturating gold set | High | Author multi-target goldens first and freeze the baseline only after the first non-saturating prod run |
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
- Empty relevance set for a query: the gate rejects the gold set at load rather than scoring a zero-target query as trivially complete.
- A query whose targets are all below the 3-result floor in prod: it scores incomplete in prod by design, which is the signal the gate exists to read.

### Error Scenarios
- Missing baseline file: PROMOTION mode writes a first baseline and exits with a neutral seed code, while REGRESSION mode fails closed.
- Harness export missing or renamed: the gate fails at import with a clear contract error rather than silently re-implementing a lens.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two net-new files reusing the existing export on a 361-line harness, plus gate-owned copy-DB prep, ground-truth grouping and retrieval orchestration |
| Risk | 8/25 | No ranking or floor change, risk is calibration and reading the right column |
| Research | 4/20 | Seams already verified to file:line in research.md section 4 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether per-class completeRecall@3 thresholds are calibrated from the first prod baseline or set as fixed floors before the first run.
- Whether the verdict tier for this phase reads as conditional-C2-gated or as the gate that lifts that condition for the items downstream.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Tier C unblocker. The verdict for the gate itself is GO-on-cost: it touches measurement not ranking, the dual-mode harness already ships and the build is two narrow files reusing the export already present on the harness, plus the gate-owned orchestration it must replicate. Every Tier-C retrieval item (C1, C3, C4, C5) and every 027 retrieval item is conditional-C2-gated on this instrument, so this phase is the keystone that lifts that condition. The prod-mode completeRecall@3 read is non-negotiable: eval-mode @K and external @5/@10/@20 numbers are inadmissible as a pass condition because the K=3 floor hides exactly that band.
<!-- /ANCHOR:verdict -->
