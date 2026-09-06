---
title: "Feature Specification: Parent Set-String Playbook"
description: "The operator-facing contract for what actually gets set as the objective: a short pointer plus the completion criteria copied out, because no stop evaluator opens the referenced file."
trigger_phrases:
  - "parent set string playbook"
  - "set string playbook"
  - "goal pointer"
  - "completion criteria copied"
  - "stop evaluator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/010-goal-file-addon/004-parent-set-string-playbook"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the playbook and its worked example"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/"
    session_dedup:
      fingerprint: "sha256:03350617000c8c8d29d202583e298dc19191d71e2926adc98c9d2a59223d3d4b"
      session_id: "2026-08-29-042-004-parent-set-string-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Completion criteria are copied into the set string because evaluators do not read the file"
---

# Feature Specification: Parent Set-String Playbook

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
| **Parent Packet** | system-speckit/033-system-speckit-v4/010-goal-file-addon |
| **Predecessor** | 003-runtime-neutral-goal-dispatch |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing dereferences a path inside a goal string. An operator who sets a pointer alone leaves the stop evaluator with a table of contents and no way to judge whether the work is done, while an operator who pastes the whole directive hits the character cap and loses the tail, which is where the completion criteria live.

### Purpose
An operator knows exactly what to set: short enough to survive the cap, complete enough to be judged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The set-string shape: a pointer to the packet's goal document plus the completion criteria copied out.
- The binding and precedence wording that makes the reference an obligation rather than a citation.
- A worked example built from a real packet.

### Out of Scope
- Any runtime change - this phase writes guidance, not code.
- The validator - phase 2 owns enforcement; this phase owns the instruction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/` | Create | The set-string playbook and its worked example |
| `references/workflows/quick-reference.md` | Modify | Point at the playbook from the first-touch surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The playbook states the set-string shape: pointer plus copied completion criteria |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The playbook explains why the criteria are copied rather than referenced |
| REQ-004 | A worked example is built from a real packet rather than invented |
| REQ-005 | The playbook states what an operator does when the durable slice will not fit |
| REQ-002 | The playbook states the precedence rule between parent decisions and child detail |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can produce a valid set string from the playbook without opening the packet.
- **SC-002**: The worked example's set string is within the smallest documented runtime cap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The goal document shape from phase 1 | Nothing to check or point at | Phase 1 lands first |
| Risk | Guidance is ignored because nothing enforces it | Med | Phase 2's rule enforces the file shape; the playbook covers only what an operator types |
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
| Scope | 6/25 | One reference document and one pointer |
| Risk | 4/25 | Auth: N, API: N, Breaking: N |
| Research | 3/20 | Caps and evaluator behaviour already established |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


