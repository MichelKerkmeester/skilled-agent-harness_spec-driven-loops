---
title: "Feature Specification: Restore and Wire the Non-Regression Gate"
description: "Repair the scorer-eval baseline ratchet — the only test that pins holdout accuracy exactly and enforces the release floors — and wire it into CI, so the hole that let a -2 routing regression ship undetected closes behind this program."
trigger_phrases:
  - "scorer eval baseline ratchet"
  - "wire routing accuracy gate into ci"
  - "holdout floor not enforced"
  - "non-regression gate dead"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/014-non-regression-gate-restoration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Decide the ratchet's baseline source in coordination with phase 013's disposition"
    blockers:
      - "The ratchet's expected values cannot be set until phase 013 decides whether the -2 is fixed or accepted"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/014-non-regression-gate-restoration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the review bucket's n=31 against its declared minimum of 32 is fixed by adding a prompt or by lowering the minimum with rationale"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Restore and Wire the Non-Regression Gate

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The repository owns a test built precisely to catch what phase 013 found, and it has been dead the whole time.

`system-skill-advisor/mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` is the only test that pins `holdout_top1` to an exact count and enforces the declared floors — `FULL_CORPUS_FLOOR = 0.75` at line 29 and `HOLDOUT_FLOOR = 0.725` at line 30. Run today it **fails 5 of 7 assertions**: the corpus hash pin no longer matches, the holdout count no longer matches, the bucket counts no longer match, and the review bucket's live n of 31 is below its own declared statistical-validity minimum of 32 (`REVIEW_MIN_N`, line 78). Its baseline file `scripts/routing-accuracy/scorer-eval-baseline.json` is pinned to a corpus that no longer exists.

It is also wired into nothing. `.github/workflows/routing-registry-drift.yml` runs the registry drift guard, two routing-parity suites, the golden-prompt suite, and the Python corpus scorer — and never this file. A grep for the ratchet across all workflows returns no hits.

The consequence is exactly the failure phase 013 documents: the gate the program *did* build, `tests/routing-golden-prompts.vitest.ts`, passes 10 of 10 right now, green straight through a live regression, because it checks a different and weaker property. The program's own baseline capture knew the ratchet was stale and filed it as "Recorded, not resolved."

Fixing the regression without fixing this leaves the identical hole open for the next program.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — repairing the ratchet so it runs green against a defensible baseline; resolving the review bucket's n-below-minimum condition; wiring the ratchet into `.github/workflows/routing-registry-drift.yml` so it gates merges; and confirming by deliberate mutation that the wired gate actually fails when a metric moves.

Out of scope — diagnosing or fixing the regression itself (phase 013, which this phase must not pre-empt); the golden-prompt suite's own coverage, which is adequate for what it tests; broadening the corpus; and any change to the scorer.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ratchet's baseline reflects a decided state, not an accidental one | The baseline values the ratchet pins are those phase 013 dispositioned — restored figures if 013 fixed the regression, or the accepted figures with 013's recorded rationale referenced if it did not. The baseline is never regenerated blind to make the test pass |
| REQ-002 | The corpus hash pin matches the live corpus | The hashes the ratchet asserts match the current corpus files, and the mismatch is resolved by re-pinning to the reviewed current corpus, with the previous hashes recorded so the corpus change itself remains auditable |
| REQ-003 | The review bucket satisfies its declared minimum, or the minimum is changed deliberately | Either the bucket reaches n≥32 by adding reviewed prompts, or `REVIEW_MIN_N` is lowered with a written rationale for why the smaller sample remains statistically adequate. Silently leaving n=31 under a declared minimum of 32 is not an acceptable close |
| REQ-004 | The ratchet runs in CI on every change that can move routing | The workflow invokes the ratchet suite alongside the existing routing suites, and the job fails when the ratchet fails. Verified by a CI run, not by local execution alone |
| REQ-005 | The wired gate is proven to catch a real regression | A deliberate, reverted mutation to a routing input demonstrates the gate failing, with the failure output recorded. A gate that has never been seen to fail has not been shown to work |
| REQ-006 | The floors remain enforced and are not weakened to accommodate current values | `FULL_CORPUS_FLOOR` and `HOLDOUT_FLOOR` keep their current values unless a floor change is separately justified and operator-approved. Lowering a floor to make a failing metric pass is explicitly forbidden |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The ratchet passes 7 of 7 against a baseline that reflects phase 013's disposition; the corpus hash pin matches live with the prior hashes recorded; the review bucket meets its minimum or the minimum is deliberately and defensibly changed; the workflow runs the ratchet and fails when it fails, proven by a real CI run; a deliberate mutation has been observed to trip the gate; and both floors hold at their current values.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Repairing the ratchet by regenerating its baseline would silently bless whatever the metrics currently are, including the regression | REQ-001 binds the baseline to phase 013's disposition rather than to a blind capture; this phase cannot close before 013 decides |
| Risk | Wiring a currently-failing test into CI turns the pipeline red for everyone until it is repaired | The wiring step lands only after the ratchet passes locally, in the same change or immediately after, never as a standalone red commit |
| Risk | Re-pinning the corpus hash could mask a corpus edit that itself caused a metric movement | REQ-002 requires the previous hashes to be recorded, so a later reader can tell a corpus change from a scorer change |
| Dependency | Phase 013 | The ratchet's expected values are whatever 013 dispositions; wiring a gate to a contested number would freeze the dispute into CI |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether to grow the review bucket to 32 or lower the declared minimum is unresolved and depends on whether a reviewed 32nd prompt exists that does not distort the bucket's intent.
<!-- /ANCHOR:questions -->
