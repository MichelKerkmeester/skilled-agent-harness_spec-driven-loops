---
title: "Tasks: Phase 1: deep research on skill routing shape and clarity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skill routing deep research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: deep research on skill routing shape and clarity

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

`R` is `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Preflight both executors. Verify: `command -v pi` and `command -v devin` print paths, and `devin auth status` prints "Logged in (via Devin)".
- [x] T002 Write the config with a two-lineage fan-out block (`R/deep-research-config.json`). Verify: it names `cli-pi` model `deepseek-v4.1-flash-1017` at `reasoningEffort: max` and `cli-devin` model `deepseek-v4-1-flash-max`, five iterations each.
- [x] T003 [P] Write one steer file per lineage that splits the fleet (`R/lineages/pi/steer.md`, `R/lineages/devin/steer.md`). Verify: `ls R/lineages/*/steer.md` lists two files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the fan-out (`fanout-run.cjs --stop-policy max-iterations`). Verify: `R/orchestration-summary.json` reports both lineages `fulfilled` and the runner exits 0.
- [x] T005 Merge the lineages (`fanout-merge.cjs`). Verify: its output prints `"merged_lineages":2`.
- [x] T006 Emit the parent resource map (`reduce-state.cjs --emit-resource-map --fanout-resource-map-only`). Verify: `deltaSourceCount` prints 10.
- [x] T007 Write the merged synthesis and run the closeout (`R/research.md`, `synthesis-closeout.cjs`). Verify: the append gateway prints `"ok":true`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-read every cited line used in a verdict or the phase plan, and mark each finding confirmed or unconfirmed (`R/research.md`). Verify: `rg -c 'Confirmed' R/research.md` prints a non-zero count.
- [x] T009 Remove the out-of-lineage write the devin lineage left at `R/resource-map.md`, then regenerate it with the reducer. Verify: the reducer prints `"resourceMapSkipped": false`.
- [x] T010 Update the phase docs and plan phases 002 to 011 (`../spec.md`). Verify: `validate.sh --recursive --strict` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the citation check in `R/research.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
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

A blocked task is marked `[B]` with the reason on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: both CLIs resolve and Devin is logged in
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] N/A: this phase changes no code. `git status` shows changes only under `specs/`.
- [x] CHK-011 [P0] Both lineage runs exited 0 and their output names `FANOUT_LINEAGE_COMPLETE`
- [x] CHK-012 [P1] The one containment advisory is recorded and repaired (T009)
- [x] CHK-013 [P1] The run followed the `/deep:research` auto workflow's fan-out path
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: see `acceptance-criteria.md`
- [x] CHK-021 [P0] Citation check complete (T008)
- [x] CHK-022 [P1] Lineage counts checked: 5 iterations in each state log
- [x] CHK-023 [P1] A finding a lineage got wrong was corrected: the `.opencode` mirror claim
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in prompts or artifacts
- [x] CHK-031 [P0] N/A: no input handling changes
- [x] CHK-032 [P1] N/A: no auth changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on ten iterations over two lineages
- [x] CHK-041 [P1] N/A: no code comments
- [x] CHK-042 [P2] N/A: no README change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the advisor report and the fan-out config
- [x] CHK-051 [P1] scratch/ holds only inputs the research cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
