---
title: "Feature Specification: Phase 8: decision-and-handoff-rules"
description: "Land five candidates across the decision-shape rule, the handback rule and the evidence rule, including the resolution of the error-reporting conflict."
trigger_phrases:
  - "decision and handoff rules"
  - "reader triage before drafting"
  - "state restatement cadence"
  - "unconfirmed cause qualifier"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: decision-and-handoff-rules

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 006-reply-shape-rules |
| **Successor** | 007-wording-standard-restructure |
| **Handoff Criteria** | Five candidates landed, and the evidence-rule row matches the conflict resolution phase 2 recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-communication clarity program.

**Scope Boundary**: Three rule files, five candidates. This phase does not depend on the split,
because none of the five lands on the file being split.

**Dependencies**:
- Phase 2's resolution of the error-reporting conflict, which decides whether the fifth candidate is adopted at all and in what form.

**Deliverables**:
- Two candidates in the decision-shape rule: reader triage before drafting, and concrete time estimates.
- Two candidates in the handback rule: state restatement every turn, and a closing contract.
- One candidate in the evidence rule: the qualifier that keeps a cause-then-fix ordering honest.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Five adopted candidates belong to rules that shape a decision, a handback and a claim rather than a
sentence. Two of them are the pre-drafting reader decisions the research found have no owner
anywhere: choosing the reader, and modelling the gap between what they hold and what they need. One
is a cadence obligation the handback rule does not carry, since it requires naming the operator's
next action but never requires restating position in a multi-step run. One is the fifth candidate's
harder case: an error report that names a single cause reads as a finding, and the evidence rule
requires an unconfirmed cause be marked as unconfirmed, so the source's ordering is adoptable only
with a qualifier.

### Purpose

Land the five where they belong, with the error-reporting candidate carrying the qualifier that
makes it compatible with the evidence rule rather than in tension with it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reader triage before drafting: who the reader is, what they hold, what they need, and the single thing they take away.
- Concrete time estimates in real units rather than vague magnitude.
- State restatement every turn in multi-step work, so the reader is not asked to hold position.
- A closing contract: one action doable in about two minutes, and completed work shown in concrete terms.
- The error-report qualifier: keep the cause-then-fix ordering, and mark the cause's status when nothing has confirmed it.

### Out of Scope
- The reply-shape rule, which is phase 6's and is being split.
- The wording standard, which is phase 7's.
- Re-opening whether the error-reporting conflict is adopted, which phase 2 decides.
- Any new rule file, because all five candidates have an existing owner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/presenting-decisions.md` | Modify | Reader triage and time estimates |
| `repo-rules/handoff-and-questions.md` | Modify | State restatement and the closing contract |
| `repo-rules/evidence-and-proof.md` | Modify | The unconfirmed-cause qualifier |
| `REPO RULES.md` | Modify | Only if a trigger phrase needs widening to reach a new clause |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the five candidates lands in exactly one file, matching the allocation table |
| REQ-002 | Each added rule names the specific failure it prevents |
| REQ-003 | The error-report qualifier is written so it cannot be read as licence to assert an unconfirmed cause, and the evidence rule's three tiers still govern |
| REQ-004 | The reader-triage rule states what to do before drafting, distinct from the existing rule that restates the request after it arrives |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The state-restatement rule states a cadence rather than a preference, so a reader can tell whether they complied |
| REQ-006 | The closing contract does not duplicate the handback rule's existing obligation, it sharpens it, and the existing text is edited rather than appended to |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five candidates, five landed rules, each traceable to its allocation row.
- **SC-002**: The evidence rule still refuses an unconfirmed cause presented as confirmed, tested by reading the added clause against the three tiers.
- **SC-003**: No file gained a rule that another file already carries, checked by a duplication scan across the three.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2's conflict resolution | The fifth candidate's form is undecided | This phase does not open until it is recorded |
| Risk | The qualifier weakens the evidence rule | An unconfirmed cause starts reading as a finding, which is the failure the rule exists to stop | REQ-003 makes the three tiers still govern, and the clause is read against them before it lands |
| Risk | The closing contract is appended rather than merged | The handback rule grows two overlapping obligations | REQ-006 requires editing the existing text |
| Risk | Reader triage duplicates the existing restate-the-request step | Two rules for one moment, and a reader follows whichever they hit | REQ-004 requires the distinction be stated in the rule itself |
| Risk | The three files drift apart on what a close-out contains | Close-outs vary by which file loaded | The duplication scan in SC-003 covers all three together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: None of the three files passes its readable ceiling; the decision-shape rule is the closest and is checked first.
- **NFR-P02**: No file gains a section where a sentence in an existing section would do.

### Security
- **NFR-S01**: No credential or private identifier enters a rule file.
- **NFR-S02**: The evidence rule's verification standards are unchanged in force; the qualifier narrows a reporting shape, never a proof obligation.

### Reliability
- **NFR-R01**: All three files stay reachable through their existing trigger rows.
- **NFR-R02**: The added clauses fire on the same actions their host files already fire on.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a candidate that cannot name a failure is dropped and the drop is recorded.
- Maximum length: a file at its ceiling takes the clause by editing an existing section rather than adding one.
- Invalid format: a clause written outside the host file's shape fails that file's own gate.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: phase 6 holds a different file, so these two phases may run in either order.

### State Transitions
- Partial completion: each clause is independently valid, so a stopped session leaves consistent files.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three files, five clauses |
| Risk | 14/25 | One clause touches the evidence rule, which every completion claim reads |
| Research | 4/20 | Execution, not investigation |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does reader triage belong to the decision-shape rule, which fires on a recommendation, or does it need its own trigger since it fires before any drafting at all?
- Should the state-restatement cadence bind on every turn of multi-step work, or only when the reader has to act between turns?
<!-- /ANCHOR:questions -->

---

