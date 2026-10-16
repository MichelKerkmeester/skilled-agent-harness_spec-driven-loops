---
title: "Tasks: Phase 7: review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture baselines for every gate before any edit (scratch `fix007/baseline/`) [EVIDENCE: Baselines in scratch: doctor runner 7/7 suites (node 329/329, vitest 18/18), setup-check tests 44/44, drift guards 1 failing guard with 16 errors all in the 035 review evidence copy, package check FAIL at 5,038 words]
- [x] T002 Re-read every cited line and confirm or reject each finding (review-report.md section 3) [EVIDENCE: Every cited line re-read. 25 of 25 confirmed. F-08 checked against both sk-create-command rules, see implementation-summary.md]
- [x] T003 Write the child preamble and back up each target before its dispatch (scratch `fix007/`) [EVIDENCE: Child preamble at scratch pre.txt, a backup before each of 37 dispatches]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 F-01 Trim sk-git SKILL.md under 5,000 words, starting with the Repository Settings section (.skilled/skills/sk-git/SKILL.md:259) [EVIDENCE: Section cut by dispatch 1, Feature Catalog paragraph cut by dispatch 4. package_skill.py prints Result: PASS at 4,990 words]
- [x] T005 F-10 State the real playbook census (.skilled/skills/sk-git/SKILL.md:573) [EVIDENCE: Census replaced by a pointer to the index, which the playbook names as the only inventory (dispatch 2)]
- [x] T006 F-11 Replace the playbook validation command with one that runs (.skilled/skills/sk-git/SKILL.md:573) [EVIDENCE: validate-playbook-package.cjs --package sk-git, run as written from the repo root: PASS scenarios=46 categories=9]
- [x] T007 F-12 Clear the HVR hard blockers (.skilled/skills/sk-git/SKILL.md:220) [EVIDENCE: Dispatch 3, 61 hard blockers to 0, code spans unchanged (scripted check)]
- [x] T008 F-13 Add `doctor-commands/` to the canonical artifact list (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:18) [EVIDENCE: Dispatch 5 adds doctor-commands/]
- [x] T009 F-14 Fix the section ranges and scenario counts, sections 8 and 13 (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:603) [EVIDENCE: Dispatches 6 and 33. Section 13 is GIT-023..GIT-034, GIT-043 with 13 scenarios. Section 8 range adds GIT-044..GIT-046, count stays 7]
- [x] T010 F-15 Schedule GIT-042 once and GIT-044 to GIT-046 in the wave plan (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161) [EVIDENCE: Dispatch 7. Wave 1 adds GIT-044..GIT-046, wave 5 drops GIT-042]
- [x] T011 F-16 Clear the HVR hard blockers (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:14) [EVIDENCE: Dispatch 8, 53 hard blockers to 0, playbook validator PASS]
- [x] T012 F-17 Fix the repeated worktree reaper outcome (.skilled/skills/sk-git/README.md:57) [EVIDENCE: Dispatch 20]
- [x] T013 F-18 Name the DEGRADED verdict (.skilled/skills/sk-git/feature-catalog/feature-catalog.md:163) [EVIDENCE: Dispatches 10 and 35]
- [x] T014 F-19 Restore the section 3 heading (.skilled/skills/sk-git/feature-catalog/feature-catalog.md:105) [EVIDENCE: Dispatch 9 inserts ## 3. SESSION LIFECYCLE. validate_document --type feature_catalog: 0 issues]
- [x] T015 F-20 Clear the HVR hard blockers (.skilled/skills/sk-git/feature-catalog/feature-catalog.md:31) [EVIDENCE: Dispatch 11, 12 hard blockers to 0. Dispatch 12 was misdirected at this file by a template error and wrote nothing]
- [x] T016 F-21 Clear the HVR hard blockers (.skilled/skills/sk-git/scripts/hooks/README.md:31) [EVIDENCE: Dispatch 13, 32 hard blockers to 0, table cell counts unchanged per line]
- [x] T017 F-22 Clear the two semicolons (.skilled/commands/README.txt:54) [EVIDENCE: Dispatch 14]
- [x] T018 F-06 Clear the four semicolons (.skilled/commands/doctor/assets/doctor-git-presentation.txt:262) [EVIDENCE: Dispatch 15]
- [x] T019 F-05 Cut the description to 110 characters or fewer (.skilled/commands/doctor/git.md:2) [EVIDENCE: Dispatch 16, 109 characters. validate_document --type command: 0 issues]
- [x] T020 F-07 Bind `--target=<name>` in the input gate (.skilled/commands/doctor/git.md:16) [EVIDENCE: Dispatch 17 binds --target=<name> and --target <name>]
- [x] T021 F-08 Move the input gate to the first content after the frontmatter (.skilled/commands/doctor/git.md:6) [EVIDENCE: Dispatch 18, gate first after the frontmatter, wording unchanged]
- [x] T022 F-09 Make the test coverage claim accurate (.skilled/commands/doctor/scripts/README.md:21) [EVIDENCE: Dispatch 19. Script-to-test map: doctor-phrase-reach.cjs has no test]
- [x] T023 F-23 Name `/doctor:sk-code` in the doctor category overview (.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17) [EVIDENCE: Dispatch 21, after a git diff showed no pending edit from the 035 build]
- [x] T024 F-24 Give the setup bullet the full verdict set (README.md:1262) [EVIDENCE: Dispatches 22 and 34]
- [x] T025 F-25 Show the status-line counters (README.md:1507, .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:29) [EVIDENCE: Dispatches 23, 24 and 34]
- [x] T026 F-02 Report UNKNOWN when an allowlist probe could not run, test first (.skilled/commands/doctor/scripts/git-setup-check.cjs:504) [EVIDENCE: Test first (dispatch 25, failed with actual PASS), fix in dispatch 26]
- [x] T027 F-03 Fail a hook target that is not executable, test first (.skilled/commands/doctor/scripts/git-setup-check.cjs:351) [EVIDENCE: Test first (dispatch 27, failed with actual PASS), fix in dispatch 28]
- [x] T028 F-04 Require a real registration for the OpenCode and Pi adapters, test first (.skilled/commands/doctor/scripts/git-setup-check.cjs:891) [EVIDENCE: Test first (dispatch 29, failed with actual PASS), fix in dispatch 30, strengthened by dispatches 31, 36 and 37]
- [x] T029 Refresh the Hermes mirror (.hermes/skills/sk-git/SKILL.md) [EVIDENCE: sync-skills-hermes.cjs wrote 1 of 68. --check: PASS 68 in sync]
- [x] T034 Pass --tool only for the six runtimes the battery accepts, from the coordinator's request (.skilled/commands/doctor/assets/doctor-git-setup.yaml:48) [EVIDENCE: --tool hermes exited 2 before. Dispatch 32. YAML parses, hvr 0, route-validate OK]
- [x] T035 Fix the three review findings: section 8 count back to 7, repair wording per check row, literal handler values rejected (manual-testing-playbook.md:224, README.md:1262, README.md:1507, feature-catalog.md:167, git-setup-check.cjs:913) [EVIDENCE: dispatches 33 to 37, test 47/47, literal mutant killed]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Mutation check for each code fix: revert the fix alone and confirm its test fails [EVIDENCE: F-02 guard removed: test fails. F-03 probe removed: test fails. F-04 five mutants (no comment stripping, bare import, bare OpenCode event, bare Pi event, literal exclusion reverted) each fail the test]
- [x] T031 Rerun every gate from the final state and compare it with the baseline [EVIDENCE: Final gates in implementation-summary.md Verification. Doctor runner 332/332 node and 18/18 vitest]
- [x] T032 Read-only review of the final diff by a second model family [EVIDENCE: gpt-6-luna max, read-only. Three findings, all confirmed and fixed in T035]
- [x] T033 Update `implementation-summary.md` and save continuity [EVIDENCE: implementation-summary.md written, continuity saved]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../006-release-conformance-review/review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
