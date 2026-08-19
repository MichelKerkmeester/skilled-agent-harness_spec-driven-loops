---
title: "Tasks: Whole-System Gate"
description: "Task breakdown for freezing the SHAs, running the enumerated check set including a real fan-out, and writing the receipt."
trigger_phrases:
  - "whole system gate tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the gate run"
    next_safe_action: "Freeze the SHAs"
    blockers:
      - "Predecessor 004-legacy-writer-retirement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [B] **T-001** Resolve candidate and baseline SHAs from the environment.
- [ ] **T-002** Confirm the working tree is clean before measuring.
- [ ] **T-003** Capture the baseline runtime suite result at the baseline SHA.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Run the runtime suite at the candidate.
- [ ] **T-005** [P] Run every mode's reader contract at the candidate.
- [ ] **T-006** [P] Read and record the authority state of all seven modes.
- [ ] **T-007** Run a real fan-out to completion.
- [ ] **T-008** Write the receipt naming both SHAs, every check, and the verdict.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-009** Run the gate once against a deliberately broken condition; confirm it fails and still writes a receipt.
- [ ] **T-010** Confirm every check ran at the frozen candidate SHA.
- [ ] **T-011** Confirm the suite result is expressed as a delta against the baseline.
- [ ] **T-012** Confirm the working tree is unchanged, via status and diff.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-013** The receipt is complete and retained.
- [ ] **T-014** `validate.sh` on this folder with `--strict`; Errors: 0.
- [ ] **T-015** `implementation-summary.md` records the verdict and the falsifiability run.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../004-legacy-writer-retirement/` |
| Successor | `../006-enablement-closeout/` |
<!-- /ANCHOR:cross-refs -->
