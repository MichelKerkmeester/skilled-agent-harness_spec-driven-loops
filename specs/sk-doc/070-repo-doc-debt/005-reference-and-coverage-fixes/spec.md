---
title: "Feature Specification: Repo doc debt reference and coverage fixes"
description: "The audit flags 96 README references it cannot resolve and 13 folders whose manifest, tsconfig or tests folder no README names. Most of the 96 are accurate references the audit reads from the wrong folder, so the work is sorting before fixing. This packet classifies all 109 findings, fixes the real ones and closes every coverage gap."
trigger_phrases:
  - "reference and coverage fixes"
  - "repo doc debt reference and coverage fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Repo doc debt reference and coverage fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/231-repo-doc-debt` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | The fast checker reports 0 coverage findings, every broken finding left is a rule-1 or rule-2 item with its reason recorded, and the 59 READMEs still pass the README validator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README audit flags 96 broken references and 13 coverage gaps across 59 READMEs outside the generated benchmark reports. A reader cannot tell which of the 96 is really dead: 19 point at gitignored runtime artifacts and 10 are package-relative shorthand, both of which the audit resolves from the wrong folder, 11 are placeholders an author was never meant to resolve, and 56 are drift a reader would follow to nothing. The 13 coverage gaps are the other direction: a folder holds a package manifest, a `tsconfig*.json` or a `tests/` tree that its README never mentions, so a newcomer has no way to know the artifact exists.

### Purpose
Every finding is classified, every dead pointer points at the file that exists now or reads as words when no file does, and every coverage gap is closed with one sentence about the artifact that was missing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
Fast checker (the audit's own extract and resolve functions) over the 59 READMEs in scope:
  before   96 broken / 13 coverage
  after    27 broken /  0 coverage
The 27 left are 17 rule-1 items and 10 rule-2 items.

$ python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file> --type readme
exit 0 on 59 of 59, before and after.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Rules Applied to Each Reference

Each of the 96 findings takes exactly one rule, applied in this order:

1. Gitignored runtime artifact: `git check-ignore -v` matches, so the text stays as written.
2. Package-relative: the token resolves from the nearest ancestor that holds a `package.json`, so the text stays as written.
3. Placeholder or example name: rewritten to an angle-bracket placeholder the audit skips.
4. Real broken reference: pointed at the current path, or described in words when no target exists.

What each rule took: 19, 10, 11 and 56 findings.

### In Scope
- Classify each of the 96 broken-reference findings under one of four rules and record its reason or its fix
- Rewrite the 11 placeholder names as angle-bracket placeholders the audit skips
- Point the 56 real broken references at the path that exists now, or describe them in words when no target exists
- Add one accurate mention of the artifact that each of the 13 coverage findings names
- Write one patch changelog entry per skill touched and move its version carriers to the same version

### Out of Scope
- READMEs under `*/benchmark/reports/` - another packet restructures those 235 reports
- `.skilled/commands/create/readme.md` - the audit's own exclusion list already covers it
- Changing the audit or the validator - a reference left in place is explained here, not taught to the checker
- Gitignored runtime paths that a fresh checkout does not have - recorded as open items rather than invented on disk

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/**/README.md` | Modify | 22 READMEs: placeholder names, compiled `.js` names, package-relative shorthand and two vitest commands |
| `.skilled/hooks/**/README.md` | Modify | 14 READMEs: symlink targets spelled from the link's folder, plus gitignored log and state paths |
| `.skilled/skills/sk-doc/**/README.md` | Modify | 4 READMEs: placeholder agent, skill, packet and spec paths |
| Other `.skilled` trees and `README.md` | Modify | 12 READMEs under `bin`, `logs`, `scripts`, `sk-git`, `sk-code`, `mcp-tooling`, `system-deep-loop`, `system-skill-advisor` and the repo root |
| 11 `*/changelog/v<next>.md` and their version carriers | Create, Modify | `SKILL.md` frontmatter, plus `description.json`, `mode-registry.json` and `hub-router.json` where the hub carries a version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 96 broken-reference findings is classified under rule 1, 2, 3 or 4 and appears in one evidence table with its reason or its fix |
| REQ-002 | Every reference left in place is a rule-1 or rule-2 item, so no rewritten pointer survives that resolves nowhere |
| REQ-003 | Every one of the 13 coverage findings is closed with one accurate mention of the artifact the README was missing |
| REQ-004 | The 59 READMEs still pass the README validator, the manifest test and the verdict parity test after the edits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The repo markdown link guard passes over the final tree |
| REQ-006 | Each skill touched carries one patch changelog entry, and every version carrier for that skill names the same version |
| REQ-007 | This packet validates strict with no error and no warning |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fast checker over the 59 READMEs prints 27 broken and 0 coverage, and the 27 are 17 rule-1 and 10 rule-2 items.
- **SC-002**: `validate_document.py --type readme` exits 0 on 59 of 59, and the manifest, parity and markdown link checks each pass.
- **SC-003**: Each of the 11 touched skills has one patch entry whose carriers name the same version.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The audit's own extract and resolve functions, run as the fast checker over the 59 READMEs | Without it there is no before and after count | Rerun it over the 59 files in scope rather than the whole tree |
| Risk | A rewrite invents a target that looks plausible | Med | Every new path is accepted only after `ls`, `git ls-files` or `readlink` shows it |
| Risk | A README loses a fact while a reference is reworded | Med | Every diff is read in full before the check reruns |
| Risk | Rule 1 leaves two state paths that a fresh checkout cannot resolve | Low | Recorded as open items in `implementation-summary.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: documentation-only change; no service, no request path and no credential is touched.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README whose only finding is a coverage gap gets one sentence added and no path edited.
- Maximum input: `.skilled/skills/system-spec-kit/shared/tests/README.md` carries 11 findings, which took one batched edit rather than 11 passes.
- Failure path: a reference with no target at all is described in words, and the README keeps its claim that the artifact belongs there.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 59 READMEs across 12 trees, about 96 reference lines and 13 sentences |
| Risk | 5/25 | Docs only; no API, schema or control flow moves |
| Research | 12/20 | Classifying 96 findings and reading 13 artifacts before writing about them |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Two gitignored state paths and a whole-tree audit rerun are recorded as open items in `implementation-summary.md` rather than guessed at.
<!-- /ANCHOR:questions -->

---
