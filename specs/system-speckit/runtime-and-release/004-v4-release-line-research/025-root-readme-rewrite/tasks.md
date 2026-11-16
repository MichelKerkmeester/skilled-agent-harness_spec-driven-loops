---
title: "Tasks: Research the current repository reality for a root README rewrite"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "root readme rewrite tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Research the current repository reality for a root README rewrite

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

`V` is `python3 .skilled/skills/sk-doc/scripts/validate_document.py`. `H` is `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the deep-research loop on cli-devin with `deepseek-v4-1-flash-max` (`research/`). Verify: `research/research.md` exists and the run stopped on `maxIterationsReached` after 20 iterations.
- [x] T002 Spot-check the load-bearing README claims against the file. Verify: `sed -n 16p README.md` names six runtimes.
- [x] T003 Take the baselines (`README.md`). Verify: `V README.md` printed one warning and `H README.md` printed 2 hard blockers and ceiling 81/100.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite `README.md` in the approved order. Verify: `wc -l README.md` prints fewer than 1773 lines.
- [x] T005 Add this child to the parent `spec.md` and `graph-metadata.json`. Verify: `rg -c '025-root-readme-rewrite' ../spec.md` prints 2.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the validator. Verify: `V README.md` prints valid with no warning.
- [x] T007 Rerun the voice scanner. Verify: `H README.md` prints 0 hard blockers.
- [x] T008 Check every relative link and the absence of the old term. Verify: the link check reports no missing target and `rg -ci relaunch README.md` prints nothing.
- [x] T010 Rewrite the five root guides and widen the validator's divider exemption to them. Verify: `V` prints `VALID` for each and the sk-doc suite prints 444 passed.
- [x] T011 Add the guide templates to sk-create-readme and move the skill README template there. Verify: `parent-skill-check.cjs .skilled/skills/sk-doc` prints `all hard invariants passed` and the old template path has no live reference.
- [x] T009 Run strict packet validation. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
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
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
