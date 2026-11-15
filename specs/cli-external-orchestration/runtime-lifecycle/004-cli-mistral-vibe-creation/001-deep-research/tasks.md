---
title: "Tasks: Phase 1: deep-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mistral vibe deep research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: deep-research

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

`R` is this phase's `research/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the research brief (`research-angles.md`). Verify: `rg -c '^## Angle' research-angles.md` prints 8.
- [x] T002 Install Vibe after the operator's yes (`uv tool install mistral-vibe`). Verify: `vibe --version` prints a version.
- [x] T003 Capture the live help text (`R/evidence/vibe-help.txt`). Verify: the file holds the `vibe --help` output.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the research loop over the eight angles (`R/lineages/`). Verify: each lineage's `iterations/` holds 8 files; two lineages, 16 iterations.
- [x] T005 Write the synthesis with the parity table (`R/research.md`). Verify: `rg -n 'Angle 4' R/research.md` prints the parity section.
- [x] T006 Write the ranked phase plan (`R/phase-plan.md`). Verify: every phase in it has a handoff check.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Re-read the load-bearing claims in the Vibe source (`R/research.md`). Verify: the four [merge-verified] rulings cite the lines read.
- [x] T008 Validate this phase (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `R/phase-plan.md` names children 004 to 012
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Brief**: See `research-angles.md`
<!-- /ANCHOR:cross-refs -->

---
