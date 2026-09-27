---
title: "Tasks: Fixing the Phase 10 Observations"
description: "Task Format: T### [P?] Description (file path). One task per observation, each closed by its own check from the final state."
trigger_phrases:
  - "phase 10 observations tasks"
  - "appended phase numbering tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fixing the Phase 10 Observations

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

- [x] T001 Confirm each observation O1 to O7 in code or data, with file and line (`spec.md` §3)
- [x] T002 Record the baselines: advisor 129 files, 971 passed and 6 skipped at `eaa02a56f5`, `create-root-numbering.vitest.ts` 5 passed and strict validation of the 13 other folders, 10 PASSED and 3 scratch FAILED (`evidence/validate-other-folders.txt`)
- [x] T003 Scaffold this phase with the committed `create.sh`. It came out as `Phase 1: observation-fixes`, which reproduced O4
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the appended-phase test to `create-root-numbering.vitest.ts` and watch it fail: `expected 'Phase 1: third-step' to be 'Phase 3: third-step'`
- [x] T005 Name an appended child by its phase number in `create.sh`. The test passes, and the nine create test files pass 68 with 1 skipped
- [x] T006 Regenerate the descriptions of phases 005 and 007 to 011 from their `spec.md`
- [x] T007 Regenerate the 13 other placeholder descriptions, and give the three whose `spec.md` was never written the numbered label the fixed `create.sh` writes. Each keeps its `specFolder`, `parentChain` and `specId`
- [x] T008 Correct the drift-guard text in the wrapper header, `SKILL.md`, both READMEs, the playbook scenario and the alignment reference (O1)
- [x] T009 Regenerate the sk-code-opencode Hermes mirror into scratch and copy back only that file
- [x] T010 Drop the unused import and the two comment em dashes, then rebuild the advisor so its CLI accepts the dist (O2, O3)
- [x] T011 Rewrite the three advisor doc paragraphs without an em dash, semicolon or serial comma (O3)
- [x] T012 Set the 46 older metrics logs to mode 0600, after recording each old mode (O7, `evidence/metrics-log-modes.txt`)
- [x] T013 Dismiss the six Dependabot alerts as `not_used` after the operator's yes (O5, `evidence/dependabot-dismissals.txt`)
- [x] T014 Record O6 as no defect: `advisor-tool-schemas.ts:293` bounds the scan, and `advisor-status.ts:34` defaults it to 5,000
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the advisor typecheck and full suite against the T002 baseline. The typecheck exits 0, and the suite matches it: 129 files, 971 passed and 6 skipped
- [x] T016 Run the sk-doc validator on every edited doc, plus a residue grep for three-guard claims and wrong phase labels. Each of the eight docs has 0 issues, every router-sync mention left is a retirement note and none of 4,429 descriptions outside the containment copies names a wrong number
- [x] T017 Strict validation of the 13 other folders matches the T002 baseline: 10 PASSED and 3 scratch FAILED before and after, with one warning fewer in each quarantine folder (`evidence/validate-other-folders.txt`)
- [x] T018 `validate.sh --strict --recursive` prints `RESULT: PASSED` for packet 030, all 12 folders
- [x] T019 Add the five more wrong labels the final-state check found to `spec.md`, rebuild them and match their own baseline: 016 PASSED and the four quarantine folders FAILED before and after, one warning fewer each (`evidence/validate-five-more-folders.txt`)
- [x] T020 GPT-6 Luna max fast through cli-codex verifies the five code files with a reverse check. It returns PASS with high confidence, and the base `create.sh` fails the new test with `Phase 1: third-step`
- [x] T021 Adopt the operator's D1 amendment in the parent goal, write this phase's goal from `spec.md` and bind it in the parent. The parent packet command reports `packet_budget=ok`
- [x] T022 Prove the parent goal's six criteria again from the final state, since phases 10 and 11 changed advisor code after phase 9's scenario reruns. The four suites, the live plugin load, a sandboxed daemon, 45 scenario runs across the five CLIs and the installer check all pass (`evidence/goal-reverify/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The one behavior change has a test that fails against `eaa02a56f5`, seen by the orchestrator and again by the Luna reverse check
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
