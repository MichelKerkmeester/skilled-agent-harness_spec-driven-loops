---
title: "Tasks: Phase 28: changelog-release-extension"
description: "Tasks for the open-release rule in /create:changelog and the last runnable /doc:quality mentions, each with a verify command."
trigger_phrases:
  - "changelog release extension tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 28: changelog-release-extension

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`C` is `.skilled/skills/sk-doc/sk-create-changelog`. `Y` is `.skilled/commands/create/assets`. `Q` is `.skilled/skills/sk-doc/sk-create-quality-control`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the tag check on an open and a tagged release (origin). Verify: `git ls-remote --exit-code --tags origin refs/tags/v4.0.0.16` exits 2 and the same for `v4.0.0.15` exits 0.
- [x] T002 List every line that forbids reusing a version (`C`, `Y`). Verify: `rg -n 'no file exists|strictly greater|never overwrite|already exists'` over both trees lists SKILL.md, README, `references/version-bump-rules.md` and both YAMLs.
- [x] T003 [P] List the runnable `/doc:quality` lines (`Q`). Verify: `grep -n "doc:quality" Q/SKILL.md Q/references/workflows.md` prints 8 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the open-release rule to section 7 steps 3 to 6, section 9 checks 1 and 2 and NEVER rule 2, and set version 1.3.7.0 (`C/SKILL.md`). Verify: `rg -n 'open release|ls-remote' C/SKILL.md` prints the step 3 rule.
- [x] T005 Add the tag check, the extend branch, mode-aware version checks and the in-place write to the auto workflow (`Y/create-changelog-auto.yaml`). Verify: `python3 -c "import yaml;yaml.safe_load(open('Y/create-changelog-auto.yaml'))"` exits 0 and `rg -c entry_mode` counts it in steps 3 to 6.
- [x] T006 Carry the same rule into the confirm workflow, with the extend wording at the step 3 checkpoint (`Y/create-changelog-confirm.yaml`). Verify: the same YAML parse exits 0.
- [x] T007 [P] Name the entry mode in the result report (`Y/create-changelog-presentation.txt`). Verify: `rg -n '^Entry:' Y/create-changelog-presentation.txt` prints one line.
- [x] T008 [P] Align the README, `references/version-bump-rules.md`, the playbook index, CHG-008 and new CHG-013 (`C`). Verify: `validate-playbook-package.cjs --package C/manual-testing-playbook` prints `PASS` with `scenarios=13 violations=0`.
- [x] T009 [P] Replace the runnable `/doc:quality` wording (`Q/SKILL.md`, `Q/references/workflows.md`). Verify: the T003 grep prints only SKILL.md lines 12, 30 and 65.
- [x] T010 Write `C/changelog/v1.3.7.0.md` and `Q/changelog/v1.0.4.0.md` with version 1.0.4.0, then sync the Hermes copies. Verify: `validate_document.py` prints `Total issues: 0` for both and `sync-skills-hermes.cjs --check` prints `PASS`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the command asset tests and the sk-doc script tests. Verify: pytest prints `13 passed` and the script runner prints `all sk-doc script tests passed`.
- [x] T012 Get a fresh review of the diff and fix every finding. Verify: the review's findings are each fixed or recorded with a reason in `implementation-summary.md`.
- [ ] T013 Commit and push to main per sk-git. Verify: `git log -1 origin/main` shows the phase commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the tag check exit codes were measured on the live origin
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: section 3 data flow
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T001 exit codes from the live origin
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both YAMLs parse. Evidence: `yaml.safe_load` on both prints ok
- [x] CHK-011 [P0] Every edited doc validates. Evidence: `validate_document.py` prints `Total issues: 0` for SKILL.md, README, both changelog entries and both playbook files
- [x] CHK-012 [P1] The failed-check path is handled. Evidence: step 3 keeps `create` and reports the failure on any exit other than 0 or 2 in both YAMLs
- [x] CHK-013 [P1] The change follows the workflow's own pattern. Evidence: the rule sits in step 3 beside the upstream listing, with a `Why:` line like its neighbors
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` every row Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: T001
- [x] CHK-022 [P1] Edge cases covered. Evidence: spec edge cases, the generation-folder reader and the fallback path
- [x] CHK-023 [P1] Error scenarios validated. Evidence: CHG-013 fails a second untagged entry, an edited tagged release and deleted sections
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change adds only `git ls-remote` and `git tag --list`, which read refs
- [x] CHK-031 [P0] Input validation implemented. Evidence: N/A, no new input is parsed beyond a git exit code
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Comments adequate. Evidence: each new YAML block carries a `Why:` line
- [x] CHK-042 [P2] README updated. Evidence: How It Works and the troubleshooting table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the audit JSON and test logs sit in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the phase `scratch/` holds no file
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
