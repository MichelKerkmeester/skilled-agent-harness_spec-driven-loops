---
title: "Feature Specification: Phase 4: forced-depth-empty-records"
description: "Forced-depth validation fails a lane whose state log holds no usable iteration records, and the state-record appender refuses an iteration record without a positive integer iteration number."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: forced-depth-empty-records

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-orchestrate-mirror-alignment |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Remediate the alignment review findings specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
One alignment-review lane wrote its five iteration records numbered under `run` instead of `iteration`. The forced-depth validator collapsed them to an empty set and checked the set only when records existed, so five iteration files and zero usable records passed. Nothing at the appender required an iteration record to carry an integer iteration number.

### Purpose
A lane cannot pass forced-depth validation on records the runner cannot use, and an unnumbered iteration record is refused before it lands.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An empty collapsed record set under max-iterations with a positive cap is a violation naming the state log and the count of unnumbered iteration records
- The appender refuses an iteration record whose iteration is not a positive integer, before appending anything
- Tests at both call sites of the validator and five appender cases

### Out of Scope
- The research YAML directive that still numbers an iteration record under `run` - owned by the command-asset phase that follows
- The mode gateway's upcaster - untouched

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Empty or unnumbered record set fails forced depth with a message naming the state log |
| `.opencode/skills/system-deep-loop/runtime/scripts/append-state-record.cjs` | Modify | Iteration records require a positive integer iteration; refusal names the field |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Two validator tests, one per call site |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/trustworthy-state-records.vitest.ts` | Modify | Five appender cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Under the max-iterations stop policy with a positive cap, an empty collapsed iteration record set is a violation that names the state log path and the count of unnumbered iteration records |
| REQ-002 | The state-record appender refuses a record of type iteration whose iteration is not a positive integer, with a message naming the missing field, and appends nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Numbered iteration records and non-iteration records append as before |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The unnumbered-records test passes against the unmodified validator (proving the hole) and fails-closed after; the refusal tests fail against the unmodified appender and pass after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A research directive that emits `run` meets the strict appender | Med | That directive goes through the mode gateway's upcaster today; the follow-on phase adds the iteration number at the source |
| Risk | Load-induced timeout in an unrelated timestamp-window test | Low | Reproduced as a timeout, not a failure; green on rerun and in isolation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One count over records already parsed

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: A refusal at the appender is explicit and names the field; a validation failure names the log it read
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Records under `run`: counted as unnumbered, lane fails
- No iteration records at all: lane fails
- Iteration zero or negative: refused

### Error Scenarios
- Non-iteration record without a number: appended as before

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two scripts, two test files |
| Risk | 8/25 | Settle-time validator and the appender every leaf uses |
| Research | 3/20 | Finding located by a lane's own defect |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


