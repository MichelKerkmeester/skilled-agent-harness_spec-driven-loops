---
title: "Tasks: sk-communication consumes the human-voice mode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "voice routing tasks"
  - "sk-communication reroute tasks"
  - "rubric removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-communication consumes the human-voice mode

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

- [x] T001 Read Wave A's mode in full before assuming its contents (`.opencode/skills/sk-doc/sk-create-with-human-voice/`)
- [x] T002 Read the standard and confirm it is unmoved (`.opencode/skills/sk-doc/shared/references/hvr-rules.md`)
- [x] T003 [P] Capture the command validator baseline for all three `rewrite/` commands (`scratch/baseline-validate-commands.txt`)
- [x] T004 [P] Capture the `package_skill.py --check --strict` baseline (`scratch/baseline-package-skill.txt`)
- [x] T005 Prove the scanner works with its own fixtures before trusting any number it reports (`scratch/baseline-hvr-selftest.txt`)
- [x] T006 Capture the scanner baseline over all five surfaces this stream may touch (`scratch/baseline-hvr-targets.txt`)
- [x] T007 Confirm the working tree is clean under both owned paths before the first edit (`scratch/baseline-git-and-level.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Grep the whole live tree for the four rubric phrases, to enumerate every copy before processing any of them
- [x] T009 Grep the whole skill for tone vocabulary, catching locations the four phrases would miss (`.opencode/skills/sk-communication/`)
- [x] T010 Check the runtime package for a prompt-level voice rubric, and read `COPY_EDITING_INSTRUCTION` rather than assuming its content (`cli-communication-projection/src/`)
- [x] T011 Grep for inbound citations of the command step headings before renaming one
- [x] T012 Confirm the `.claude` command mirrors are symlinks rather than copies, so no mirror edit is needed
- [x] T013 Confirm `leaf-manifest.json` lists paths rather than byte hashes, so an in-place content edit needs no regeneration
- [x] T014 Add `The Wording Standard` to section 3, naming the standard, the mode, the two exclusions and the precedence (`.opencode/skills/sk-communication/SKILL.md`)
- [x] T015 Add the NEVER rule against a second copy of a voice rubric (`.opencode/skills/sk-communication/SKILL.md`)
- [x] T016 Add the route to Related Skills and Related Workflows (`.opencode/skills/sk-communication/SKILL.md`)
- [x] T017 Replace the Step 4 rubric with the route, keeping the three projection constraints (`.opencode/commands/rewrite/response.md`)
- [x] T018 Add the `Standard By Reference` note (`.opencode/commands/rewrite/response.md`)
- [x] T019 Replace the Branch A rubric with the route, keeping the two projection constraints that apply (`.opencode/commands/rewrite/response-by-external-agent.md`)
- [x] T020 Add the note that the standard reaches Branch A only, naming both source files of the constant (`.opencode/commands/rewrite/response-by-external-agent.md`)
- [x] T021 Record the `novice` depth level's deliberate departure from the standard's analogy limits (`.opencode/skills/sk-communication/references/visual-explanation.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Rerun the command validator on all three commands and compare to baseline (`scratch/after-gates.txt`)
- [x] T023 Rerun `package_skill.py --check --strict` and compare to baseline (`scratch/after-gates.txt`)
- [x] T024 Rescan all five surfaces and diff hard-blocker counts against baseline (`scratch/after-hvr-targets.txt`)
- [x] T025 Repair the one em dash the rescan caught in the new Related Skills line, then rescan (`.opencode/skills/sk-communication/SKILL.md`)
- [x] T026 Rescan the live tree for rubric residue and confirm the only hits are `repo-rules/` and frozen spec history (`scratch/final-gates.txt`)
- [x] T027 Confirm every path and heading the new text cites resolves (`scratch/path-resolution.txt`)
- [x] T028 Confirm the `.claude` symlinks still resolve to the edited files (`scratch/final-gates.txt`)
- [x] T029 Capture the scoped diff and confirm it contains only owned files (`scratch/scoped-diff.txt`)
- [x] T030 Dogfood every authored spec document through `hvr_scan.py` and repair what it finds
- [x] T031 Run `validate.sh <folder> --strict` and require an explicit `RESULT: PASSED` (`scratch/final-validate.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Zero live copies of the rerouted guidance remain outside the standard.
- Both edited commands validate at 0 issues and the skill package passes strict.
- No surface's hard-blocker count rose against its baseline.
- Every authored document in this packet scans at 0 hard blockers.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` section 8 for the inventory, the keep-versus-reroute split and the measured residue.
- `spec.md` section 9 for the answer to streams 4 and 5, which is that neither needs a change.
- `plan.md` section 3 for why the new text went into `SKILL.md` rather than a new reference file.
<!-- /ANCHOR:cross-refs -->

---
