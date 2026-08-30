---
title: "Feature Specification: Durable Slice Validator"
description: "A present-file rule that checks a goal document's shape: its durable and log headings, a binding block on phase parents, listed child paths that exist, and a durable slice within its character budget."
trigger_phrases:
  - "goal validator"
  - "durable slice cap"
  - "binding block check"
  - "child path existence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/002-durable-slice-validator"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the rule and register it"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/"
    session_dedup:
      fingerprint: "sha256:7515009c4ebb37c00e38ca39491c7fb3e7fd4644557a9224c93209d67f5a3105"
      session_id: "2026-08-29-042-002-durable-slice-validator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The cap applies to the durable slice only; a progress log is not a defect"
---

# Feature Specification: Durable Slice Validator

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
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/042-nested-goal-template-addon |
| **Predecessor** | 001-manifest-and-goal-template |
| **Successor** | 003-runtime-neutral-goal-dispatch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing checks a goal document. A durable directive can quietly outgrow what a runtime goal surface will hold, a phase parent can list child paths that do not exist, and the split between durable directive and volatile log can collapse into one undifferentiated file. Packet 033 reached 15,028 bytes with no signal that anything was wrong.

### Purpose
A goal document that has drifted out of shape says so, before an operator discovers it by pasting a truncated objective.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A present-file rule: it runs when the document exists and stays silent when it does not.
- Checks for the durable and log headings, the binding block on phase parents, and listed child paths resolving inside the packet.
- A character budget on the durable slice, measured on that slice alone.

### Out of Scope
- Any cap on the whole file - a progress log is expected to grow and is not a defect.
- Runtime dereferencing of listed paths - the rule checks existence; nothing follows them at goal-evaluation time.
- The contract entry and template - phase 1 owns those, and this rule needs them first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/rules/` | Create | The present-file rule |
| `scripts/lib/validator-registry.json` | Modify | Register the rule with its severity and flags |
| `references/validation/validation-rules.md` | Modify | Document the rule and its failure modes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A goal document that is absent produces no finding at all |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A phase-parent goal document without a binding block is reported |
| REQ-004 | A listed child path that does not resolve inside the packet is reported |
| REQ-005 | A well-formed goal document produces no finding |
| REQ-002 | A durable slice over its character budget is reported, measured on that slice alone |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deliberately over-budget durable slice fails, and trimming it passes.
- **SC-002**: A packet with no goal document validates exactly as it does today.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The goal document shape from phase 1 | Nothing to check or point at | Phase 1 lands first |
| Risk | The rule fires on packets that never opted into a goal document | High | Present-file by construction: absence is silent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cost is a few file reads, matching the sibling rules and references.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Reads packet documents only; writes nothing.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: A packet without a goal document is unaffected.
- **NFR-R02**: An unreadable document degrades to a reported finding rather than a crash.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty durable slice is reported as shape, not silently accepted.
- Maximum length: the durable slice has a budget; the file as a whole does not.
- Invalid format: a document whose headings cannot be found is reported rather than skipped.

### Error Scenarios
- Not applicable; nothing external is called.
- Not applicable.
- Concurrent access: not applicable; these are authored files.

### State Transitions
- Partial completion: a half-authored document reports its missing parts by name.
- Not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One rule, its registration and its documentation |
| Risk | 8/25 | Auth: N, API: N, Breaking: N |
| Research | 3/20 | Shape settled by phase 1 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The measured template boilerplate floor is 1276 characters at phase level, which leaves roughly 724 characters of
  authored room under a 2000-character budget. A four-phase parent authored during phase 1 landed at 2023 before
  trimming. This phase must decide whether the budget measures the whole durable slice or only authored content
  outside the template's own instructional prose, and whether a phase parent needs a larger allowance than a leaf.
<!-- /ANCHOR:questions -->

---


