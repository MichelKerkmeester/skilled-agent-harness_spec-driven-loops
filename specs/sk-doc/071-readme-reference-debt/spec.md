---
title: "Feature Specification: Triage and fix the README reference and derived-count check failures across the root and hub READMEs"
description: "The README reference check reports 573 unresolved references and the derived-count check 83 failures across 12 root and hub READMEs, and most of them are slash commands, generic file names and prose numbers the checkers misread as paths and counts."
trigger_phrases:
  - "readme reference debt"
  - "triage and fix the readme reference and derived"
  - "check_readme_references false positives"
  - "check_derived_readme_counts false positives"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Triage and fix the README reference and derived-count check failures across the root and hub READMEs

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
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check_readme_references.py` and `check_derived_readme_counts.py` fail on all 12 root and hub READMEs. The root README alone reports 298 unresolved references and 41 count failures. Most of these are not drift: the reference check reads slash commands such as `/doctor:git` and generic names such as `graph-metadata.json` as paths, and the count check reads `Gate 4: Workflow` or `in one file` as a file count.

### Purpose
Every real broken reference or wrong count in the 12 READMEs is fixed, every systematic false positive is fixed once in the checker, and every failure left standing is recorded with its reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py $READMES   # the 12 READMEs named in the output below
FAIL README.md: references=418 unresolved=298 examples=0
FAIL .skilled/bin/README.md: references=145 unresolved=33 examples=0
FAIL .skilled/skills/cli-external-orchestration/README.md: references=56 unresolved=6 examples=0
FAIL .skilled/skills/cli-external-orchestration/cli-codex/README.md: references=61 unresolved=21 examples=0
FAIL .skilled/skills/cli-external-orchestration/cli-opencode/README.md: references=134 unresolved=48 examples=0
FAIL .skilled/skills/cli-external-orchestration/cli-pi/README.md: references=45 unresolved=3 examples=0
FAIL .skilled/skills/sk-code/README.md: references=125 unresolved=29 examples=0
FAIL .skilled/skills/sk-code/sk-code-skilled/README.md: references=36 unresolved=4 examples=0
FAIL .skilled/skills/sk-doc/README.md: references=140 unresolved=59 examples=0
FAIL .skilled/skills/sk-doc/sk-create-skill/README.md: references=119 unresolved=39 examples=0
FAIL .skilled/skills/sk-git/README.md: references=91 unresolved=27 examples=0
FAIL .skilled/skills/system-deep-loop/README.md: references=41 unresolved=6 examples=0
SUMMARY files=12 pass=0 fail=12

$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py $READMES   # the 12 READMEs named in the output below
FAIL README.md: claims=41 failures=41
SUMMARY files=12 pass=0 fail=12
```
The full per-file output is in `scratch/baseline-refs.txt` and `scratch/baseline-counts.txt`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record both checks' baseline on each of the 12 READMEs.
- Sort every failure into a real defect, a checker false positive or an intentionally unresolvable reference.
- Fix real defects in the README text, changing only what the fix needs.
- Fix each systematic false-positive class once in the checker, with a self-test case.
- Record every failure left standing with its reason and class count.
- Follow-up: a README-level marker both checkers honor for known-good references and counts, and narrow absent-by-design class rules, so the 12 READMEs pass without hiding real breaks.
- Follow-up, done by a sibling worker and recorded here: make `test_rename_tooling_fixture_harness.py` hermetic.

### Out of Scope
- READMEs outside the 12 named files: other agents edit them, and the checker change is measured against them only to prove it adds no new failure.
- `audit_readmes.py` and `validate_document.py`: the predecessor packet `sk-doc/070-repo-doc-debt` owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modify | Stop reading slash commands, home and system paths, placeholders, file types and slashed words as repo paths; resolve bare names, skill-relative paths, `specs/` and runtime folders, and fenced trees |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modify | Count a number only when a count term that agrees with it follows in the same clause; derive a claim from a folder its sentence names |
| `README.md` | Modify | Mark the illustrative phase tree as an example; name the frontmatter value list by its skill path |
| `.skilled/skills/sk-doc/README.md` | Modify | Level 2 adds `acceptance-criteria.md`, not the retired `checklist.md`; write two placeholders as `<...>` |
| `.skilled/skills/sk-git/README.md` | Modify | Follow-up: a `readme-check` marker block naming its git branch namespaces and one symptom count |
| `.skilled/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py` | Modify | Follow-up by a sibling worker: a throwaway git repo per test as the protected root |
| `.skilled/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py` | Modify | Follow-up by a sibling worker: record a tracked file missing from disk as absent instead of raising |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each baseline failure in the 12 READMEs is either fixed in the README, removed by a checker fix for its class, or recorded with its reason. |
| REQ-002 | A checker change adds no failure on a README line that passed before, measured over every tracked README with the old and new checker run on the same tree. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each checker's `--self-test` covers every new rule with a passing case and keeps a real broken path or stale count failing. |
| REQ-004 | Each edited README still passes `validate_document.py` with exit 0. |
| REQ-005 | A known-good reference or count the checkers cannot derive passes only through an explicit, documented marker or a narrow absent-by-design class rule, each proven by a self-test that keeps a broken path beside it failing. |
| REQ-006 | `test_rename_tooling_fixture_harness.py` passes without depending on the live checkout's working-tree state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rerunning both checks on the 12 READMEs leaves only failures named in `implementation-summary.md` with their reason.
- **SC-002**: The repo-wide old-against-new comparison reports 0 lines failing now on a line with no old failure, for both checks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git ls-files` for the tracked-name index | A bare name cannot be confirmed outside a checkout | The index is built once per repository root; outside git the name stays unresolved and fails closed |
| Risk | A relaxed rule hides a real broken path | Medium | Each rule is narrow, keeps a failing self-test case beside it, and the repo-wide line-level diff shows no new pass-to-fail line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The tracked-name index runs one `git ls-files` call per repository root per run, not one per reference.

### Security
- **NFR-S01**: N/A. Both checkers only read files and write to stdout.

### Reliability
- **NFR-R01**: An absolute path under `/Users/` or `/home/` still fails, so a README that leaks one machine's layout is still caught.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README with no references reports `references=0 unresolved=0` and passes, unchanged.
- Maximum input: the root README (276 references after the change) runs with one tracked-name lookup.
- Failure path: a stale tree root such as `old-name/` still fails on its own line while its entries resolve from the README folder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two checker scripts and two READMEs |
| Risk | 10/25 | Checker rules change what every README check reports |
| Research | 12/20 | Triage of 573 reference and 83 count failures |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Whether to give the recorded classes a marker the checker honors is a follow-up, named in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
