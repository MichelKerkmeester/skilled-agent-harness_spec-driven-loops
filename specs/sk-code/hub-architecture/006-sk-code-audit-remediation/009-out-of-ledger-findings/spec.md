---
title: "Feature Specification: Phase 9: out-of-ledger-findings"
description: "Phases 006 to 008 logged findings that no ledger row names, and phase 002 left one checklist line waiting on the operator. This phase fixes each finding in the file it cites and closes that line."
trigger_phrases:
  - "out of ledger findings"
  - "phase 9 out of ledger findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: out-of-ledger-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-quality-packet-fixes |
| **Successor** | None |
| **Handoff Criteria** | `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the sk-code audit remediation specification.

**Scope Boundary**: This phase edits the eight documents its Files to Change table names, three release notes and three version lines. It changes no router block, no script and no test.

**Dependencies**:
- Phases 006, 007 and 008, whose goal logs and summaries list the findings
- The operator's instruction of 2026-11-14, `fix open items`

**Deliverables**:
- A fix for each finding in section 3
- One release note for each of the three packets
- The phase 002 checklist line `CHK-012` closed with the operator's answer
- A second reading of the MCP server checklist selector, recorded in `goal.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 006 to 008 could edit one packet each and fix only rows the ledger names. They logged what they saw outside those limits. Two checklists in `sk-code-skilled` cite `CHK-CMT-07`, an id the style guide dropped in phase 008. Five lines call the `.skilled/` tree OpenCode. The scripts README names two guard paths that do not resolve from its folder. The playbook's test table lists seven of nine test files. One review playbook line says the depth alias maps `lite` onto the M-1 gate, and `lite` applies the M-2 skip.

### Purpose
Each logged finding is fixed in the file it cites with a command that proves it, so the three packets' documents agree with the files they describe.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at commit `dee8838e83`.

```text
$ rg -c 'CHK-CMT' .skilled/skills/sk-code/sk-code-skilled
.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md:1
.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md:1
exit=0

$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/sk-code/sk-code-skilled/scripts/README.md | tail -2
FAIL .skilled/skills/sk-code/sk-code-skilled/scripts/README.md: references=34 unresolved=2 examples=0 allowed=0
SUMMARY files=1 pass=0 fail=1

$ rg -c '^\| `scripts/tests/' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md
7
exit=0

$ ls .skilled/skills/sk-code/sk-code-skilled/scripts/tests | wc -l
9
exit=0

$ rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/README.md .skilled/skills/sk-code/sk-code-quality/SKILL.md
.skilled/skills/sk-code/sk-code-quality/SKILL.md:2
.skilled/skills/sk-code/sk-code-quality/README.md:3
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the `CHK-CMT-07` id with the rule's name in the two JS and CSS style checklists.
- Rename `OpenCode` to `SKILLED` on three README lines and one load-table row in `sk-code-quality`, and on the opening line of the `sk-code-skilled` entry document.
- Write the two guard paths in the scripts README so they resolve from its folder.
- Add the two resolver tests to the playbook's test table.
- Remove the `lite` clause from one row of the minimum-evidence scenario.
- Raise the three packet versions and write one release note each.
- Tick `CHK-012` in `002-frontend-reach/tasks.md` with the operator's answer as evidence.
- Get a second reading of the MCP server checklist selector and record it.

### Out of Scope
- Ledger row `H7`, the `sk-code-ci` keyword copies. It changes routing vocabulary and needs a choice of authority, so the operator decides on a packet of its own
- The scenario step that runs the tests. It runs seven files and its text says seven, which is true as written
- New findings noticed while fixing. They go in the `goal.md` log for the operator

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md` | Modify | The rule's name in place of `CHK-CMT-07` |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md` | Modify | Drop `CHK-CMT-07` |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | `SKILLED system code`, version |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/README.md` | Modify | Two guard paths |
| `.skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md` | Modify | Two test rows |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/minimum-evidence-gate.md` | Modify | The M-1 row |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Version |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Three `SKILLED` names |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | One `SKILLED` name, version |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/`, `.skilled/skills/sk-code/sk-code-review/changelog/`, `.skilled/skills/sk-code/sk-code-quality/changelog/` | Create | One release note each |
| `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach/tasks.md` | Modify | `CHK-012` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1. |
| REQ-002 | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/sk-code/sk-code-skilled/scripts/README.md` prints a `PASS` line with `unresolved=0`. |
| REQ-004 | `rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1, and `rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints 1, the line that names OpenCode as a runtime. |
| REQ-005 | `rg -c 'depth alias maps' .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/minimum-evidence-gate.md` prints nothing and exits 1. |
| REQ-006 | `rg -c '^\| `scripts/tests/' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md` prints 9. |
| REQ-007 | In each of `sk-code-skilled`, `sk-code-review` and `sk-code-quality`, the newest file in `changelog/` matches the `version` in `SKILL.md`. |
| REQ-008 | `git show --stat` for this phase's code commit lists only files under those three packets. |
| REQ-009 | `grep -c '^- \[ \] CHK-012' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach/tasks.md` prints 0. |
| REQ-010 | The `goal.md` log holds one row that compares a second reader's statement of when the MCP server checklist applies with the selector wording. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No document in the hub cites `CHK-CMT-07` outside a release note.
- **SC-002**: The drift guards pass with no new failing leg.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The findings logged by phases 006 to 008 | A finding read wrongly is fixed wrongly | Setup task T001 reads each cited line before any edit |
| Risk | A renamed word is one a guard or test pins | Med | Run the three packets' tests and the drift guards after the edits |
| Risk | A path fix resolves for the README check and fails the doc-claims guard | Low | Both checks run in Verification |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase runs no service. Its limits are the counts and exit statuses in section 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a finding whose cited line already reads correctly changes no file, and its task records that.
- Maximum input: all eight documents change, in one code commit for the phase.
- Failure path: a dead path added to the scripts README makes the README reference check print `FAIL`, and the check passes again after the restore.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 8/25 | Eight one-line edits and three release notes in three packets |
| Risk | 4/25 | Documentation wording, no routing or script change |
| Research | 2/20 | Each cited line was read before planning |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
