---
title: "Feature Specification: Phase 4: playbook-scenarios"
description: "The mcp-figma playbook has no figma-to-code category, so the five-pass check and token drift have no operator scenario, and fundamentals has no scenario for an unknown project loading no profile. This phase adds the generic scenarios Barter proved, after checking each against what Skilled already covers."
trigger_phrases:
  - "playbook scenarios"
  - "phase 4 playbook scenarios"
  - "figma to code playbook category"
  - "unknown project loads no profile"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: playbook-scenarios

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-design-handoffs |
| **Successor** | 005-inferred-confirmations |
| **Handoff Criteria** | The playbook validator passes for both packages with the new scenario counts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Frontend upstream proposals from Barter's frontend practice program specification. It covers proposal rank 8, which waits for the check (phase 001) and the profile slot (phase 003) to exist.

**Scope Boundary**: New scenario files and the index updates in `mcp-tooling/mcp-figma/manual-testing-playbook/` and `sk-design/sk-design-fundamentals/manual-testing-playbook/`. No skill doc changes.

**Dependencies**:
- Phase 001's `figma-to-code.md`, which the check scenario exercises.
- Phase 003's profile slot, which the unknown-project scenario exercises.

**Deliverables**:
- An mcp-figma `figma-to-code/` category with token drift, node to token markup, and check a built screen with an `INCOMPLETE` outcome.
- A fundamentals scenario where an unknown project loads no profile.
- The "every value traces to a token or a scale" scenario only if the existing `SKD-010` scenario does not already cover it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-figma playbook's six categories are daemon-health, detection-setup, intra-routing-recall, optional-mcp, read-only and safety-gate, so nothing tests a Figma read that feeds code or a check that cannot finish. Fundamentals has no scenario for the profile slot that phase 003 adds.

### Purpose
An operator can run a scenario for each new behavior phases 001 and 003 ship, and both playbook packages still validate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook
daemon-health  detection-setup  intra-routing-recall  manual-testing-playbook.md  optional-mcp  read-only  safety-gate

$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook | tail -2
  WARN HAND_TYPED_CENSUS manual-testing-playbook.md root contains a hand-typed census (17 scenarios, 6 categories); derived census is 17 scenarios across 6 categories
exit=0

$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook | tail -2
PASS package=sk-design/sk-design-fundamentals tier=FAIL_CLOSED scenarios=12 categories=4 operator=12 routing_gold_excluded=0 violations=0 warnings=0
exit=0

$ grep -n "^title" .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/on-scale-values.md
2:title: "SKD-010 -- Every value comes from a scale"
```
`SKD-010` may already cover the proposed "every value traces to a token or a scale" scenario. T002 decides.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the mcp-figma `figma-to-code/` category with three scenarios: token drift, node to token markup, and check a built screen whose verdict is `INCOMPLETE` when a pass cannot run.
- Add a fundamentals scenario: a request naming an unknown project loads no profile and falls back to defaults.
- Compare the proposed token-or-scale scenario with `SKD-010` and add it only if it tests something `SKD-010` does not.
- Update each root `manual-testing-playbook.md` so its census matches the derived count.

### Out of Scope
- The six Barter repository profile-load scenarios - Barter-only.
- A `skcode-handoff` scenario - `boundary/implementation-defers-to-sk-code.md` already covers it, per the proposals.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/` | Create | Three scenario files |
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/manual-testing-playbook.md` | Modify | Category and census |
| `.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/` | Create | One or two scenario files |
| `.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md` | Modify | Census |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The playbook validator exits 0 for the mcp-figma package and reports 20 scenarios across 7 categories. |
| REQ-002 | The playbook validator prints `PASS` for the fundamentals package with 13 or 14 scenarios and `violations=0`. |
| REQ-003 | The check-a-built-screen scenario's expected outcome is `INCOMPLETE` when one pass cannot run. |
| REQ-004 | `rg -n -i "barter"` on every new scenario file prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The token-or-scale decision against `SKD-010` is recorded with the reason, and the scenario exists only if the decision is to add it. |
| REQ-006 | The mcp-figma root census matches the derived census, so the `HAND_TYPED_CENSUS` warning reports equal counts. |
| REQ-007 | Each new scenario names the file it exercises: `sk-code-frontend/references/figma-to-code.md` or the fundamentals profile slot. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: mcp-figma goes from 17 scenarios in 6 categories to 20 in 7, and the validator exits 0.
- **SC-002**: Fundamentals goes from 12 scenarios to 13 or 14, and the validator prints `PASS`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 and 003 shipped | High | The phase does not start until both close |
| Risk | A new scenario duplicates `SKD-010` | Low | T002 compares them before writing |
| Risk | A scenario carries a Barter value from the Barter copies | Med | REQ-004 grep |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A - scenario docs have no runtime cost.
- **NFR-P02**: N/A - no service.

### Security
- **NFR-S01**: The check scenario uses read-only Figma inputs only.
- **NFR-S02**: N/A - no credential.

### Reliability
- **NFR-R01**: Each scenario's expected outcome is deterministic: one named verdict or one named file loaded.
- **NFR-R02**: Both validators pass from the final state.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a check with no Figma frame given returns `INCOMPLETE` at the inputs step.
- Maximum input: a token-drift scenario with many differing tokens lists each, not a count only.
- Failure path: an unknown project name loads no profile and says so.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Four or five scenario files and two indexes |
| Risk | 4/25 | Duplication and Barter values |
| Research | 3/20 | One overlap comparison |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does `SKD-010` already test "every value traces to a token or a scale"? T002 decides and REQ-005 records it.
<!-- /ANCHOR:questions -->

---
