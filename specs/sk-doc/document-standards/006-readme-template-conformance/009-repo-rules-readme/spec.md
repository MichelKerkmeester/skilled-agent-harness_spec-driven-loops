---
title: "Feature Specification: Phase 9: repo-rules-readme"
description: "The repo-rules folder has no README, and the repo-rules checker and card builder read any README there as an eleventh rule and fail. This phase skips the README in both scripts and writes the folder README under the alert and fold rule."
trigger_phrases:
  - "repo rules readme"
  - "phase 9 repo rules readme"
  - "repo rules checker skips readme"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: repo-rules-readme

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-readme-html-conventions |
| **Successor** | None |
| **Handoff Criteria** | The folder README validates, the checker passes 11/11 with it in place and the alert and fold rule is applied as written |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the README template conformance specification. Phase 8 wrote the rule for GitHub alerts and folded tables and piloted it on four existing files. This phase tests the rule on a README written from nothing.

**Scope Boundary**: `.skilled/repo-rules/README.md`, the two repo-rules scripts that list the folder and their tests. No rule file and no router row changes.

**Dependencies**:
- Phase 8, which wrote the alert and fold rule this README follows

**Deliverables**:
- `.skilled/repo-rules/README.md`
- A README skip in `check-repo-rules.cjs` and `build-rule-cards.cjs`, with one test each
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader who opens `.skilled/repo-rules/` finds ten rule files and nothing that says how they load or how to add one. A README cannot simply be added, because the repo-rules checker and the card builder read every `.md` file in the folder as a rule. The document validator already types a README there as a README, so the three tools disagree.

### Purpose
The folder explains itself, and all three tools agree that its README is not a rule.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ printf '# Repo Rules\n\n> probe\n' > .skilled/repo-rules/README.md
$ node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
[repo-rules-check] 1/11 FAIL count parity        - files=11 triggerRows=10 indexRows=10
[repo-rules-check] 2/11 FAIL row coverage        - README.md: no trigger row; README.md: no index row
[repo-rules-check] 5/11 FAIL frontmatter keys    - README.md: missing title, description, trigger_phrases, importance_tier, contextType, version
[repo-rules-check] 8/11 FAIL fires-when sections - README.md: no "## Fires when" section
[repo-rules-check] RESULT: FAILED (7/11 checks)
$ node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs --check
[rule-cards] ERROR: README.md: no "## Fires when" section
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skip a case-insensitive `readme.md` where the checker and the card builder list rule files, the same match the document validator uses
- Add one test per script with a README in the fixture folder
- Write `.skilled/repo-rules/README.md` from the general README template, applying the alert and fold rule as written

### Out of Scope
- A row for the README in `REPO RULES.md` - the router holds routes to rule files only
- Cards for the ten rules - the repository has never generated them, and `--check` reports the same 10 missing cards before and after this phase
- `measure-rule-compliance.py` and `rule-experiment.py` - both glob the folder, but a README carries no marker and copying it into a fixture is inert, and their tests pass unchanged

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/README.md` | Create | The folder README |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Skip the README when listing rules |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs` | Modify | Skip the README when listing rules |
| `.skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py` | Modify | README fixture test |
| `.skilled/skills/sk-doc/scripts/tests/test_build_rule_cards.py` | Modify | README fixture test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The checker ignores a README in the rules folder | With the README in place, `check-repo-rules.cjs` prints `files=10` and `RESULT: PASSED (11/11 checks)` |
| REQ-002 | The card builder ignores a README in the rules folder | The new builder test writes only `alpha.md` and `--check` exits 0 |
| REQ-003 | The README passes the README gates | `validate_document.py` prints `VALID` as type `readme`, 0 hard voice blockers, and both README checkers pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The README applies the alert and fold rule as written | One warning alert for a step that breaks something, and no fold, because its one table holds 10 rows, under the 15-row threshold. GitHub renders the alert |
| REQ-005 | Nothing else that reads the folder breaks | The doctor AGENTS.md tests, the repo-rules Python tests, the sk-doc suite and the repo link check all pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The probe README that failed 4 of 11 checks passes 11 of 11 as the real README.
- **SC-002**: `gh api markdown` renders the README with one `markdown-alert-warning` block and no `<details>` element.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/doctor:agents-md` copies the real rules folder in its tests and runs the checker | A README the checker rejects fails those tests | Run all four doctor AGENTS.md suites with the README in place |
| Risk | A rule someone names `README.md` would be skipped | Low | No rule carries that name, and the validator already treats the name as a README |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
