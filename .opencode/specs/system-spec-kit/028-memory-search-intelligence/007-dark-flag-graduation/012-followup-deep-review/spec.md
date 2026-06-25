---
title: "Feature Specification: Graduation Follow-Ups, Opus Deep Review and Fixes"
description: "An opus deep review of the 010 graduation follow-ups, run as ten iterative passes loop-until-dry, and the fixes that cleared its verdict. The review FAILED the follow-ups with three P0 in the bitemporal wiring, which corrupted live reads and was defeated on the real reindex path, plus eight P1 and four P2 the cli test pass had missed because the existing tests never exercised the real failure modes. The fixes resolved all three P0 (replaceNodes and pruneDanglingEdges close instead of delete under the flag, the live readers filter closed edges, the generation stamp is fixed, the integration test drives the real reindex), the four search and advisor and deep-loop P1, and the P2 advisories, each behind its existing default-off flag and unit-tested. A second batch then shipped seven more recs and follow-ups (ensure-ready bump, lineage validity, the as-of query surface, the degree-cap-15 evidence, the stall detector, and the title-aware dedup gate), confirmed by a third re-review at zero findings. The bitemporal cluster moves from a false graduate back to genuinely working, and the dedup title-only false-collapse risk is quantified at 0.50 then driven to 0."
trigger_phrases:
  - "opus deep review of the follow-ups"
  - "bitemporal wiring corrupts live reads"
  - "graduation follow-up review findings"
  - "deep review FAIL fixed"
  - "P0 bitemporal reindex fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/012-followup-deep-review"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Cleared the FAIL verdict and shipped the second batch of fixes"
    next_safe_action: "Evidence-gated decision to flip any of the involved defaults on"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/012-followup-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Graduation Follow-Ups, Opus Deep Review and Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 010 graduation follow-ups passed a cli test run and were reported graduate-ready, but the tests never exercised the real failure modes. A ten-pass opus deep review, reading the code rather than running the existing tests, found the code-graph bitemporal wiring corrupts live reads and is defeated on the production reindex path. The hard-delete in `replaceNodes` and `pruneDanglingEdges` ran regardless of the flag, the live readers had no validity filter, and the as-of stamps were off by one generation, so the wiring the cli pass had reported as working returned an empty as-of result on every real reindex.

### Purpose
Record that deep review and drive the fixes so the follow-ups are correct on evidence rather than on an incomplete test surface. Resolve every P0 and P1 and the actionable P2 behind their existing default-off flags, then take a second batch of recs and follow-ups to genuine completion, with each fix byte-identical when its flag is off and confirmed by an independent re-review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The opus deep-review record (`review/review-report.md`): the FAIL verdict, the fifteen findings by severity, and the per-cluster readiness
- The fixes for the three P0 bitemporal blockers: close-not-delete in `replaceNodes` and `pruneDanglingEdges`, the live-reader validity filter, and the generation-stamp correction
- The fixes for the conditional P1: the search budget-trim and density-gate, the advisor alias guard, the deep-loop lag metric, and a real-reindex integration test
- The second batch of seven recs and follow-ups: the ensure-ready bump, the lineage validity stamp, the as-of query surface, the degree-cap-15 evidence, the stall detector, and the title-aware dedup gate

### Out of Scope
- Flipping any production default on, which stays a separate evidence-gated decision
- Editing `review/review-report.md`, which is the frozen review record this packet documents
- Any file outside the involved subsystems and this packet folder

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| review/review-report.md | Reference | The opus review record, read-only, documented not edited |
| spec.md | Create | This conformant Level 1 spec from the template |
| plan.md | Create | The deep-review method and the remediation approach |
| tasks.md | Create | The audit lenses and the fix tasks, marked complete with evidence |
| implementation-summary.md | Create | The outcome, the verification, and the re-review evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every P0 bitemporal blocker is fixed | `replaceNodes` and `pruneDanglingEdges` close instead of delete under the flag, the live readers filter on `invalid_at IS NULL`, and a real-reindex as-of read returns the old target |
| REQ-002 | Each fix is byte-identical when its flag is off | The off branch keeps its original statement verbatim, proven by a flag-off unit test for every change |
| REQ-003 | The FAIL verdict clears under re-review | An independent opus re-review against the committed code returns PASS with zero P0 and zero P1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The conditional P1 findings are resolved | The budget-trim primary-row reservation, the advisor alias guard, the lag metric, and the real-reindex test all land and unit-test |
| REQ-005 | The second-batch recs and follow-ups complete | The ensure-ready bump, the lineage validity, the as-of query surface, the degree-cap-15, the stall detector, and the title-aware dedup all ship and a third re-review confirms zero findings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The bitemporal cluster moves from a false graduate back to genuinely working, confirmed because the live readers filter on `invalid_at IS NULL` and a real two-scan reindex preserves a readable as-of window
- **SC-002**: The dedup title-only false-collapse rate is measured at 0.50 then driven to 0 by a Jaccard title-overlap gate while identical-dup collapse holds 7 of 7
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A green cli test pass hides real failure modes | High | The opus deep read confirms each finding against source before any fix |
| Risk | A bitemporal fix corrupts live reads | High | Every fix is flag-gated and byte-identical off, proven by a flag-off unit test per change |
| Dependency | The existing default-off flags | The fixes ride on them | No production default is flipped, the flips stay a separate decision |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should any of the involved defaults flip on now? **RESOLVED: No, each flip stays a separate evidence-gated decision outside this packet**
- Is the orphaned as-of reader still de-scoped? **RESOLVED: No, the second batch wired an optional `asOf` onto `code_graph_query` so the reader is now consumable**
<!-- /ANCHOR:questions -->
