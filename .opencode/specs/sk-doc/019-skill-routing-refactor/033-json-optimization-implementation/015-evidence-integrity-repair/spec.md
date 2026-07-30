---
title: "Feature Specification: Evidence Integrity and Completion-Claim Repair"
description: "Rewrite the rubber-stamped rollout checklist with per-item evidence, re-open the three items that certify a regression as absent, reconcile the command-metadata phase's four contradictory status fields, and re-run the strict validation the program claimed as blocked."
trigger_phrases:
  - "checklist rubber stamp"
  - "completion claim contradicts evidence"
  - "re-open false checklist items"
  - "validate strict still failing"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/015-evidence-integrity-repair"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Await phase 013 disposition, then rewrite the three false items against real evidence"
    blockers:
      - "The three regression-related checklist items cannot be truthfully restated until phase 013 establishes the real numbers"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/015-evidence-integrity-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the strict-validation failures are one root cause or several is unknown until the validator is run per-folder and the errors are grouped"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Evidence Integrity and Completion-Claim Repair

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

This phase repairs the control that failed. It is not documentation hygiene.

The rollout phase's checklist carries 21 completed items sharing **exactly one unique evidence blob**. Three of those items certify precisely the property that phase 013 disproves: that the top-1 delta was reported, that top-3 was reported across all slices, and that no unexplained top-1 or top-3 regression exists. All three are marked complete. All three are false. A checklist that certifies the absence of a regression by pasting the same text into every row is not weak evidence, it is the mechanism by which the regression passed review.

That this went uncaught by three independent review lineages is itself diagnostic. Cross-model agreement surfaced the findings visible in a status table; only one lineage compared evidence *content* across rows, and no lineage executed a measurement. Agreement measured surface visibility rather than severity.

Two adjacent completion defects belong with it. The command-metadata phase's summary asserts four mutually contradictory things in one file: a Status of Complete, a Delivered field reading "Not yet — Planned, blocked", a Verification section reading "Not yet run — this packet is Planned", and continuity claiming 100 percent completion. And `validate --recursive --strict` fails today across all 13 folders with exit 2, while the parent spec requires Errors:0 before Complete and separately declares itself Complete. The program excused that failure as an external breakage from a concurrent session; that breakage has since been fixed and the validation still fails, so the excuse has expired and no audit leg re-tested it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — rewriting the rollout checklist so each item carries evidence specific to that item; re-opening the three items whose claims phase 013 disproves and restating them against real measurements; reconciling the command-metadata phase's four contradictory fields into one truthful state; running the strict validator, grouping its failures by root cause, and fixing those that belong to this program.

Out of scope — the regression itself (phase 013); the ratchet and CI wiring (phase 014); bulk metadata regeneration, which shares a root cause with some validation failures and is owned by phase 016; and the disposition of refuted audit findings (phase 018).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every checklist item carries evidence specific to itself | No two items in the rollout checklist share identical evidence text. Where several items genuinely rest on one artifact, each cites the specific section or line of that artifact that supports it. A shared appendix is acceptable only with an explicit per-item map into it |
| REQ-002 | The three regression-certifying items are re-opened and truthfully restated | The items covering top-1 delta reporting, top-3 reporting across slices, and absence of unexplained regression are unchecked, then restated against phase 013's measured figures. If the regression is accepted rather than fixed, the items record the accepted delta explicitly rather than reverting to a pass |
| REQ-003 | The command-metadata phase states one truth | Status, Delivered, Verification and continuity completion agree with each other and with what actually shipped. Whichever value is correct, the other three change to match it |
| REQ-004 | Strict validation failures are diagnosed by root cause, not by count | The validator is run per folder and its errors are grouped into causes. Each group is either fixed here, assigned to phase 016 where it shares that phase's generator root cause, or recorded as out of scope with a reason |
| REQ-005 | The program's completion gate is either satisfied or the completion claim is withdrawn | Either `validate --recursive --strict` reports Errors:0 across all folders, or the parent and affected child Status fields stop claiming Complete until it does. Claiming completion against a failing gate is the defect this phase exists to close, and must not survive it |
| REQ-006 | No completion claim in this program outruns its evidence at close | A final sweep confirms every remaining Complete marker in the packet has evidence that a reader can check independently, and that no checklist item is marked done against evidence that does not mention it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

No two checklist items share evidence text; the three regression items are re-opened and restated against measured figures; the command-metadata phase's four fields agree; strict-validation errors are grouped by cause with each group fixed, assigned or explicitly deferred; the completion gate either passes or the completion claim is withdrawn; and a final sweep finds no completion marker whose evidence a reader cannot verify.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Rewriting checklist evidence could become a second rubber-stamp exercise at higher word count | REQ-001 forbids duplicate evidence text outright, which is mechanically checkable, rather than asking for better prose |
| Risk | Re-opening items on a packet marked Complete makes the program look worse before it looks better | That is the intended effect. An accurate CONDITIONAL is more useful than an inaccurate Complete, and REQ-005 makes withdrawing the claim an acceptable outcome |
| Risk | Fixing validation errors by suppressing or excluding folders would satisfy the gate without satisfying the requirement | REQ-004 requires errors to be grouped by cause and dispositioned individually; exclusion is not among the permitted dispositions |
| Dependency | Phase 013 | The three regression items cannot be restated truthfully before the real numbers exist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether the strict-validation failures reduce to a single generator root cause shared with phase 016, or are several independent defects, is unknown until the errors are grouped.
<!-- /ANCHOR:questions -->
