---
title: "Feature Specification: Phase 11: level-match-operator-record"
description: "The level check warns on every Level 1 packet whose decision-record.md the save step wrote to hold operator answers. This phase teaches the check, and the level fallback in upgrade-level.sh, to tell that record from a hand-written ADR record."
trigger_phrases:
  - "level match operator record"
  - "phase 11 level match operator record"
  - "writer-only decision record level warning"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: level-match-operator-record

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/433-level-match-operator-record` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-decision-routing-vocabulary |
| **Successor** | None |
| **Handoff Criteria** | A Level 1 packet whose decision record holds only the writer's two anchors validates with no LEVEL_MATCH warning, and a hand-written ADR record still warns |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the decision capture series. The save step's decision-record writer now records operator answers in any packet, and the level check still reads that file as a sign of Level 3.

**Scope Boundary**: The LEVEL_MATCH rule, the level fallback in `upgrade-level.sh`, one shared predicate, their tests and fixtures, and the rule's reference row. The writer itself does not change.

**Dependencies**:
- The writer's anchor ids `operator-decisions` and `operator-answers-verbatim`, defined in `decision-record-writer.ts`.

**Deliverables**:
- A predicate that tells a writer-only record from any other record, used by both callers.
- Three fixtures and three LEVEL_MATCH test rows, plus two upgrade-level test cases.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-level-match.sh` warns "decision-record.md present but Level 1 declared" whenever a Level 1 packet holds that file. The save step creates exactly that file each time it records an operator answer, so every Level 1 packet with a captured answer warns, although nothing about its level is wrong. `upgrade-level.sh` makes the same mistake when spec.md declares no level: it infers Level 3 from the file's presence.

### Purpose
A record the save step wrote no longer counts as a Level 3 signal, while a hand-written ADR record still does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration --strict --recursive
EXIT=0
14 RESULT: PASSED, 0 RESULT: FAILED
007-review-remediation:          - decision-record.md present but Level 1 declared - consider upgrading level
009-deep-review-p2-remediation:  - decision-record.md present but Level 1 declared - consider upgrading level
011-opencode-pi-handover-parity: - decision-record.md present but Level 1 declared - consider upgrading level
012-opencode-model-carry:        - decision-record.md present but Level 1 declared - consider upgrading level
```
Each of the four records carries only the anchors `operator-decisions` and `operator-answers-verbatim`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `decision_record_is_writer_only` to `lib/shell-common.sh`. A record is writer-only when it has at least one anchor and every anchor id is `operator-decisions` or `operator-answers-verbatim`.
- Skip the LEVEL_MATCH presence warning for a writer-only record.
- Skip the Level 3 inference in `upgrade-level.sh` for a writer-only record.
- Prove both with fixtures, test rows and the live validator path, and update the LEVEL_MATCH reference.

### Out of Scope
- Changing what the writer writes. Its anchors are the contract this phase reads.
- Changing any other rule. The consumer trace found no other code that infers a level from the file's presence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/shell-common.sh` | Modify | Add the shared predicate |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh` | Modify | Source the helper and skip a writer-only record |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Modify | Infer Level 3 only from a record that is not writer-only |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh` | Modify | Three LEVEL_MATCH rows |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-upgrade-level.sh` | Modify | Two level-fallback cases |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/081-083` | Create | Writer-only, ADR and mixed records on a Level 1 copy |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md` | Modify | Fixture count and listing |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | LEVEL_MATCH presence hint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A Level 1 packet with a writer-only record passes LEVEL_MATCH | The `081-level-match-writer-record` row reads pass, and the same row warns on the old rule |
| REQ-002 | Any other record on a Level 1 packet still warns | The `082` ADR row and the `083` mixed row both read warn |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `upgrade-level.sh` infers Level 1, not 3, from a writer-only record when spec.md declares no level | `test-upgrade-level.sh` prints `Writer-only decision record infers Level 1` and still prints `Hand-written ADR record still infers Level 3` |
| REQ-004 | The live validator path stops warning on the real packets | Recursive strict validation of session-handover 001 prints no `decision-record.md present` line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `test-validation-extended.sh` reports 87 passed and 0 failed, up from 84 and 0.
- **SC-002**: Recursive strict validation of session-handover 001 prints 14 `RESULT: PASSED` and 0 LEVEL_MATCH warnings, down from 4.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The writer's two anchor ids | A renamed anchor would make every writer record warn again | The ids are named in the predicate and in the reference row, so a rename shows up in review |
| Risk | A hand-written record that reuses the writer's anchors and nothing else | It would pass silently | Such a record holds only operator answers, which every level may carry, so passing it is correct |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: The series goal's decision D1 says every child changes the decision-capture pipeline and other work gets its own packet. This phase changes validator scripts instead. The operator placed it here on 2026-11-16, choosing it over a separate spec-folder-tooling packet. Answered 2026-11-16: the operator added a D1 exception for 011, beside the one for 010.
<!-- /ANCHOR:questions -->

---
