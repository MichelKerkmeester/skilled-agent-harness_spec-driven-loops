---
title: "Feature Specification: Phase 8: out-of-scope-cleanup"
description: "Four defects the earlier remediation builds found outside their scope: the drift guard scans frozen review evidence, doctor-phrase-reach.cjs has no test, every Hermes mirror header carries semicolons and sk-create-command states two gate positions. Each is verified first, then fixed or rejected with evidence."
trigger_phrases:
  - "out of scope cleanup"
  - "phase 8 out of scope cleanup"
  - "drift guard review evidence skip"
  - "doctor phrase reach test"
  - "hermes mirror header semicolons"
  - "command input gate placement"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: out-of-scope-cleanup

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Each of the four issues is fixed or rejected with evidence, and every gate in section 5 passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Fix the four issues the release remediation builds found outside their scope: the sk-code drift guards scan review evidence copies, doctor-phrase-reach.cjs has no test, sync-skills-hermes.cjs writes semicolons into every Hermes mirror header, and sk-create-command contradicts itself on where the input gate goes. specification.

**Scope Boundary**: The four issues named in section 2 and the files each one needs. Defects noticed elsewhere are recorded, not fixed.

**Dependencies**:
- The phase 7 implementation summary, which recorded these four issues as out of scope.
- The Hermes sync script, rerun after any canonical `SKILL.md` or header change.

**Deliverables**:
- A router dead-path check that skips spec evidence copies, with a test.
- A node:test suite for `doctor-phrase-reach.cjs` and READMEs that state the real coverage.
- A Hermes mirror header with no semicolons, regenerated into all 68 mirrors.
- One gate-placement rule stated the same way everywhere in sk-create-command.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase 7 build left four defects it found outside its scope. The sk-code drift guards fail on 16 dead-route errors, all in a frozen review-evidence copy of an old `SKILL.md`. `doctor-phrase-reach.cjs` is the one doctor script with no test, so the scripts README had to say "Most scripts". The Hermes sync writes a header with semicolons into every mirror, which breaks the Human Voice Rules. sk-create-command places the mandatory input gate in two different places.

### Purpose
Each issue is verified against the code and then fixed with a check that proves it, or rejected with the evidence that disproves it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Issue 1: the router dead-path walk in `verify_alignment_drift.py` reuses the existing spec-evidence exclusion that the language scan already applies.
- Issue 2: a node:test suite for `doctor-phrase-reach.cjs` covering the passing run and the stale-build exit 2, plus the two README coverage lines.
- Issue 3: the generated marker and canonical-source sentence in `sync-skills-hermes.cjs`, the drift verifier pattern that recognises that marker and the 68 regenerated mirrors.
- Issue 4: every statement of the gate position in sk-create-command, aligned to the rule the shipped commands follow.

### Out of Scope
- Editing the review evidence copy itself. It records what a review saw.
- Moving the gate in any shipped command. Outliers are recorded for the operator.
- Commits, pushes, trigger-index generation and track-root refreshes. The operator owns those.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | Router walk skips spec evidence, marker pattern follows the new header |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modify | Evidence skip test, marker fixture |
| `.skilled/commands/doctor/scripts/tests/doctor-phrase-reach.test.cjs` | Create | Passing run and stale-build exit 2 |
| `.skilled/commands/doctor/scripts/README.md` | Modify | Coverage claim |
| `.skilled/commands/doctor/scripts/tests/README.md` | Modify | Suite table row |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modify | Header text without semicolons |
| `.hermes/skills/*/SKILL.md` | Regenerate | 68 mirrors, header lines only |
| `.skilled/skills/sk-doc/sk-create-command/**` | Modify | Gate-position statements |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the four issues is fixed or rejected with evidence. | `tasks.md` closes one task per issue with its evidence or its rejection reason. MET: 4 fixed, 0 rejected. Issue 4 was fixed in the direction the shipped commands follow, not the proposed one. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The drift guards no longer report review evidence, and still report a dead route outside it. | `run-all-drift-guards.sh` exits 0, and a new test fails when the skip is removed. MET: exit 0, `all 4 guards PASSED`, mutant killed. |
| REQ-003 | `doctor-phrase-reach.cjs` has a test for its passing run and its stale-build exit 2. | The doctor runner passes with the new suite, and the edge test fails when the freshness refusal is removed. MET: node:test 334/334, mutant killed. |
| REQ-004 | No Hermes mirror header carries a semicolon, and each mirror changes only in its header. | `hvr_scan.py` finds no semicolon in the header, the sync check passes, and the mirror diff touches header lines only. MET: 0 header semicolons in 68 mirrors, `PASS: 68`, 125 header lines changed and nothing else. |
| REQ-005 | sk-create-command states one gate position everywhere. | A grep for gate-position statements finds no conflicting rule. MET: no hit for the old wording outside `changelog/`, and a second-model review found the last three. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `run-all-drift-guards.sh` exits 0, and the doctor runner, `doctor-phrase-reach.cjs`, the Hermes sync check and `sync-runtime-mirrors.cjs --check` pass.
- **SC-002**: `hvr_scan.py` reports zero hard blockers and `validate_document.py` reports no new issue on every touched doc, and `validate.sh specs/sk-git/033-git-setup-customization --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The drift verifier recognises Hermes mirrors by their marker | High | Change the marker and its pattern together and rerun the drift guards after the regeneration |
| Risk | The executor model edits outside its brief | Low | One change per dispatch, a backup before each and a diff check after |
| Risk | The phrase-reach happy path needs a fresh advisor build | Med | CI builds the advisor runtime before the doctor runner, so the test runs against a fresh build there |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The brief names each issue and the evidence rule for rejecting one.
<!-- /ANCHOR:questions -->

---


