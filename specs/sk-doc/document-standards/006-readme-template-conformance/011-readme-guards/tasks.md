---
title: "Tasks: Phase 11: readme-guards"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "readme guards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: readme-guards

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`K` is `.skilled/skills/sk-doc/sk-create-skill/assets/`. `D` is `.skilled/skills/sk-doc/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the review's findings. Verify: each prints what the review said. Evidence: `rg -n -i mermaid $K` printed five lines in two templates, `hvr_scan.py` printed `118:55 hard phrase-blocker when it comes to`, and the checkers printed `files=19 pass=6 fail=13` and `pass=11 fail=8`.
- [x] T002 Widen the Mermaid search to every authoring surface (`.skilled/agents`, `.skilled/commands/create`, `$D`). Verify: no other file asks for Mermaid. Evidence: only the two `$K` templates, and no `SKILL.md` uses Mermaid.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the Mermaid wording and example (`$K/parent-skill/parent-skill-readme-template.md`, `$K/skill/skill-md-template.md`). Verify: `rg -n -i mermaid $K` prints only lines that rule it out. Evidence: three lines, each saying never Mermaid. Both files `VALID`.
- [x] T004 Put the three quoted phrases in code spans (`$D/sk-create-readme/references/readme/quality-and-checklist.md`). Verify: `hard blockers: 0`. Evidence: 0, down from 1 at HEAD.
- [x] T005 Add the two tests and run them first (`$D/scripts/tests/test_structure_validation.py`). Verify: the block test fails. Evidence: `1 failed, 1 passed`.
- [x] T006 Add `validate_readme_diagrams` (`$D/shared/scripts/validate_document.py`). Verify: the tests pass and no tracked README is flagged. Evidence: `14 passed`, `readmes 1303 hits 0`, `PARITY PASS`.
- [x] T007 Run the canary writer (`cli-external-orchestration/cli-cursor/README.md`). Verify: both checkers pass. Evidence: one marker block with three entries, `fail=0` from both, `VALID`.
- [x] T008 [P] Run the other 18 writers four at a time. Verify: each exits 0 and changes only its listed lines. Evidence: 19 exits of `0`, both checkers `files=19 pass=19 fail=0`, every diff line matches its change list.
- [x] T009 [P] Run 19 reviewers four at a time. Verify: each returns a verdict. Evidence: 18 `VERDICT: PASS`, 1 `VERDICT: FAIL`.
- [x] T010 Confirm and apply the finding (`sk-design/sk-design-md-generator/README.md`). Verify: the marker reason is true. Evidence: a `.opencode/specs/` folder exists inside an archived research run, but `ls -d .opencode/specs` at the root fails, so the reason now says "absent at this repository's root". The checker still passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the repository gates. Verify: each passes. Evidence: `all sk-doc script tests passed` exit 0, `PARITY PASS`, `0 broken markdown links`, the 184 program files `VALID` with `hard blockers: 0`.
- [x] T012 Validate the program. Verify: `validate.sh --recursive --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED` on the parent and every phase.
- [x] T013 Commit, merge origin/main and push under sk-git. Verify: the phase commit is an ancestor of origin/main. Evidence: commit `09279f9490a`, pushed to main as a fast-forward.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every changed README line was read against its change list
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision**: Q014 in `../decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
