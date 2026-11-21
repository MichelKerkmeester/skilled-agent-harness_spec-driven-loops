---
title: "Feature Specification: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard"
description: "The system-deep-loop code has drifted from sk-code's checklists in doc comments and error-handling notes, and most of its code-folder READMEs fail the sk-doc code-folder validator or describe files that changed."
trigger_phrases:
  - "sk code and readme alignment"
  - "align system deep loop code with sk code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/455-expansive-depth-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A developer opening a system-deep-loop code folder meets READMEs that miss files, name moved paths and fail the sk-doc code-folder validator, and exported TypeScript functions, classes and interfaces that carry no TSDoc although the sk-code TypeScript checklist requires it at P1. The runtime folder `runtime/tests/_support` has no README at all.

### Purpose
Every code folder in the skill has a README that matches its code at HEAD and passes the three sk-create-readme checkers, and every behaviour-neutral sk-code finding is fixed while behaviour changes are listed for the operator.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py <78 skill READMEs> | tail -1
SUMMARY files=78 pass=64 fail=14
$ audit_readmes.py --document-type code-folder, filtered to the skill
71 { invalid: 50, valid: 21 }
$ node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files <582 code files> --lines file
gate NO_BLOCKER_FOUND, findings 0, files_checked 582
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Audit all tracked code files and code-folder READMEs under `.skilled/skills/system-deep-loop/` against sk-code and sk-create-readme, in seven folder lanes
- Fix every behaviour-neutral finding: doc comments, WHY comments on benign empty catches, non-null justifications, README inventories, paths and drifted claims
- Create `runtime/tests/_support/README.md` through `/create:readme`
- List every behaviour-changing or undecided finding for the operator

### Out of Scope
- Behaviour changes (path guards, error logging, exit-code alignment, locale sorting) - only the operator can approve them
- Command YAMLs under `.skilled/commands/deep/` - sk-code covers only CI workflow YAML
- `node_modules`, `dist` and test fixtures - generated or fixture code

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/**/*.{ts,cjs,sh}` | Modify | Comment and doc-comment lines only |
| `.skilled/skills/system-deep-loop/**/README.md` | Modify | Inventories, relative paths, drifted claims |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/README.md` | Create | New code-folder README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The full gate passes: vitest 0 failed with at least 3967 passed, ledger-stem, projection and drift checks exit 0, parity 18/18, validate 16/16. |
| REQ-003 | The code diff changes comment lines only, so exports, CLI flags, exit codes and JSON shapes stay the same. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `check_readme_references.py` and `check_derived_readme_counts.py` pass on every skill README, and the default-mode `audit_readmes.py` keeps 71 of 71 valid. |
| REQ-004 | `runtime/tests/_support/README.md` exists and passes the code-folder validator. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `check_readme_references.py` over the skill READMEs prints `fail=0`.
- **SC-002**: the sk-code quality gate over all changed files prints NO_BLOCKER_FOUND and the runtime typecheck exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-create-readme validator in code-folder mode | READMEs cannot be proven valid | Run all three checkers and report each remaining rule as a decision item |
| Risk | A WHY comment on an empty catch could hide a real bug | Med | Comment only benign catches; list the rest as behaviour items |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: the packet changes comments and docs only and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a folder with no code file (for example `runtime/database`) gets reference checks only
- Maximum input: `runtime/tests/unit` holds about 180 files, all listed in its README inventory
- Failure path: a checker rule that conflicts with the template is recorded as a decision item, not forced
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Hundreds of files across 65 folders, comment lines only |
| Risk | 5/25 | No behaviour change |
| Research | 10/20 | A full audit precedes the fixes |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which behaviour-changing findings does the operator approve? They are listed in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---


