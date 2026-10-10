---
title: "Feature Specification: Phase 5: rule-amendments"
description: "Six round-two amendments to two repo rule files. They add a decode floor with a tiebreak for overengineering moves, a reach list for the pre-write pass, a moves-and-merges check, an accessibility restraint and a residual-risk close-out item."
trigger_phrases:
  - "rule amendments"
  - "phase 5 rule amendments"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: rule-amendments

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-debt-report-and-hermes-gate |
| **Successor** | None |
| **Handoff Criteria** | The six amendments sit at their expected lines, `check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)`, and `validate.sh --strict` prints `RESULT: PASSED` on this folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Round two research recommendations specification.

**Scope Boundary**: Two repo rule files, `.skilled/repo-rules/prevent-overengineering.md` and `.skilled/repo-rules/evidence-and-proof.md`. Six amendments, their self-check lines and their version bumps. No other file changes, because no rebuild is needed.

**Dependencies**:
- The second Ponytail research round, whose six gaps are the source. The Ponytail text is `../../context/skills/ponytail/SKILL.md`, and it is read as data.
- The repo-rule authoring contract, `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md`.
- No sibling child edits these files. On 2026-10-10 the spec, plan and tasks of children 001 to 004 were searched for the rule file names, `repo-rules`, `REPO RULES` and `AGENTS.md`, and none named them.
- Parent decision D3 in `../goal.md`: `AGENTS.md` and `REPO RULES.md` stay unchanged.

**Deliverables**:
- Six amendments in the two rule files, listed in section 3.
- Version bumps: `prevent-overengineering.md` from 1.0.1.2 to 1.0.1.3, and `evidence-and-proof.md` from 1.1.1.2 to 1.1.1.3.
- A self-check line for each new obligation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The second Ponytail research round found six gaps in the repo rules. The overengineering rule orders moves by reversal cost, with no floor against a short diff that the next reader has to decode and no tiebreak between moves that cost the same. Its pre-write pass asks for the owner, one real caller and the contract, but not for the tests, fixtures, config and exports a change must reach. Nothing says that moved or merged code keeps its checks, and no rule file names accessibility among the things restraint never cuts. The evidence rule closes out with four items and no known residual risk for the operator to weigh.

### Purpose
The six gaps are closed inside the two rule files, with the router, `AGENTS.md` and the trigger index unchanged, and with the repo-rule checker still passing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Amendment 1: a paragraph in section 1 of `prevent-overengineering.md` on decode cost and the tiebreak.
- Amendment 2: item 2 of section 2 in `prevent-overengineering.md`, the reach list.
- Amendment 3: a bold-led "Moves and merges." paragraph in section 4 of `prevent-overengineering.md`.
- Amendment 4: a "Not a reason to cut accessibility." bullet in section 5 of `prevent-overengineering.md`.
- Amendment 5: a fifth close-out item in section 10 of `evidence-and-proof.md`, and "Four things" becomes "Five things".
- Amendment 6: a search for dependents on the close-out count, reported in `plan.md` and not edited.
- Self-check lines and version bumps for both files.

### Out of Scope
- `AGENTS.md` and `REPO RULES.md`: parent decision D3 keeps both unchanged. The `AGENTS.md` close-out sentence keeps its four items, a known difference recorded in `plan.md`.
- A Fires-when bullet for moves and merges: a bullet needs a router row in `REPO RULES.md`, which D3 forbids. Open question 1.
- A trigger index rebuild: the rule files sit outside the index corpus, so nothing they change goes stale.
- Rule cards and a changelog entry: the repo has no `cards/` directory, and the sk-create-repo-rule changelog tracks the skill, not each rule.
- The Ponytail sources and the sk-code standards: read for wording, never edited.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/prevent-overengineering.md` | Modify | Amendments 1 to 4, their self-check lines and version 1.0.1.3 |
| `.skilled/repo-rules/evidence-and-proof.md` | Modify | Amendment 5, its self-check line and version 1.1.1.3 |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` in this folder | Modify | Filled from the scaffold |
| `implementation-summary.md` in this folder | Modify | Filled at closeout |
| `description.json`, `graph-metadata.json` in this folder | Modify | Rewritten by `repair-derived.cjs` |
| `scratch/` in this folder | Create | Before copies and scope receipts, kept as evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Section 1 of `prevent-overengineering.md` gains a paragraph: a short diff is not a cheaper move when the next reader has to decode it, and when two moves cost the same, the one that handles the edge cases correctly wins. | `rg` finds the paragraph's opening sentence at line 86 and the self-check line at line 165. |
| REQ-002 | Item 2 of section 2 names the tests, fixtures, config and exports a change must reach, alongside the owning module, one real caller and the contract. | `rg` finds "list the tests, fixtures, config and exports" at line 98 and the self-check at line 170. |
| REQ-003 | Section 4 gains a bold-led "Moves and merges." paragraph: moved or merged code keeps its error handling and validation, and dropping a check during a move needs its own reason. | `rg` finds "Moves and merges." at line 145 and the self-check at line 173. |
| REQ-004 | Section 5 gains a bullet "Not a reason to cut accessibility." that uses the sk-code standard's wording for what it covers. | `rg` finds the bullet at line 158 and the self-check at line 174, and the standard's wording appears at its line 85. |
| REQ-005 | Section 10 of `evidence-and-proof.md` gains a fifth item for any known residual risk the operator must weigh, with "none known" as the answer when there is none. The count word changes from "Four things" to "Five things". | `rg` finds "Five things, briefly" at line 187, "Known residual risk." at line 193 and the self-check at line 231, and no "Four things" remains in the file. |
| REQ-006 | Each file's version is bumped in the fourth segment only. | `rg` reads `version: 1.0.1.3` at line 28 of `prevent-overengineering.md` and `version: 1.1.1.3` at line 29 of `evidence-and-proof.md`. |
| REQ-007 | The repo-rule contract's validator passes on the amended tree. | `check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)` and exits 0. |
| REQ-008 | No em dash, semicolon or serial comma appears in any added line. | The added-line check prints nothing and exits 1 for both files. |
| REQ-009 | Only the two rule files change. `AGENTS.md`, `REPO RULES.md` and the trigger index stay unchanged. | `git status --porcelain` over those paths lists only the two rule files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | The close-out count dependents are searched and reported. `AGENTS.md` keeps its four items and that difference is recorded. | After the change, `rg -i 'four things'` prints only the unrelated feature-catalog hit. The `AGENTS.md` difference is recorded in `implementation-summary.md`. |
| REQ-011 | The trigger index is confirmed unaffected, so no rebuild runs. | `rg -c -F '.skilled/repo-rules/'` on the index prints nothing and exits 1, and `CORPUS_ROOTS` lists no repo-rules root. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six amendments are found by `rg` at their expected lines, in one receipt.
- **SC-002**: The contract checker and `validate.sh --strict` both pass from the final state, with their output read.
- **SC-003**: The Fires-when section of each file is identical to its copy in `scratch/before/`, so no firing condition changed.
- **SC-004**: No scaffold text remains in the four documents, and `implementation-summary.md` holds the closeout evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `check-repo-rules.cjs` from sk-create-repo-rule | If it fails, the amendments do not ship | Run it before and after. Fix the text rather than the checker |
| Dependency | `validate.sh --strict` | It printed `RESULT: PASSED` on this folder's unfilled scaffold, so it cannot prove the documents are filled | The scaffold-text grep in `tasks.md` T038 is the gate for that |
| Risk | Moves and merges has no Fires-when bullet, so the paragraph loads only when the rule fires for another reason | Med | Operator decision, open question 1. No router change in this child |
| Risk | `AGENTS.md` section 10 keeps four close-out items while `evidence-and-proof.md` lists five | Low | Known difference, recorded and not fixed, because D3 keeps `AGENTS.md` unchanged |
| Risk | `evidence-and-proof.md` grows from 236 to 238 lines | Low | It stays under the 250-line ceiling, though it sits in the at-the-limit band the contract asks a rule to justify. The fifth close-out item is that justification |
| Risk | A sibling child edits the same rule files | Low | Checked on 2026-10-10: no sibling document names them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Should "moving or merging code" become a Fires-when bullet and a router row, so the moves-and-merges paragraph loads on a move? That needs a `REPO RULES.md` change, which parent decision D3 forbids. This child adds no firing condition.
2. Should `AGENTS.md` section 10 mirror the residual-risk item? `AGENTS.md` carries the hard blockers, so this is an operator decision.
<!-- /ANCHOR:questions -->

---
