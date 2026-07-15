---
title: "Tasks: alignment render-pipeline parity + ai-council fix flip"
description: "Task list for registering /deep:alignment into the render pipeline and flipping alignment + ai-council to fix."
trigger_phrases:
  - "deep alignment render pipeline parity"
  - "ai-council fix rollout flip"
  - "deep alignment presentation asset"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/001-pipeline-command-parity"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; verification gates green"
    next_safe_action: "Proceed to child 002"
---
# Tasks: alignment render-pipeline parity + ai-council fix flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the compile/drift/render scripts (`compile-command-contracts.cjs`) [20m]
- [x] T002 Read the alignment YAMLs + command frontmatter (`deep_alignment_auto.yaml`) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Documents
- [x] T003 Author the 4-section presentation (`deep_alignment_presentation.txt`) [30m]
- [x] T004 Register `deep/alignment` in the compiler (`compile-command-contracts.cjs`) [15m]
- [x] T005 Generate the real contract (`deep_alignment.contract.md`) [2m]

### Integration
- [x] T006 Refresh the stale peer contracts (`deep_ai-council.contract.md`) [5m]
- [x] T007 Flip the rollout (`command-injection-rollout.json`) [2m]
- [x] T008 Update the legacy body owned-assets (`deep_alignment.body.md`) [5m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T009 Confirm both lifted slices are placeholder-free [3m] [Evidence: `PLACEHOLDER_PATTERN` pre-check returned `CLEAN` for both slices]

### Integration Tests
- [x] T010 Full drift sweep across registered commands [2m] [Evidence: `check-contract-drift.cjs` reported `OK commands=4`]
- [x] T011 Render smoke in `fix` mode for alignment + ai-council [3m] [Evidence: `renderCommandContract` `mode=fix`, contract injected, `manifest clean`]

### Manual Verification
- [x] T012 Prove the peer-contract refresh is body-identical [3m] [Evidence: `BODY UNCHANGED` sha256 match for `ai-council`, `review`, `research`]

### Documentation
- [x] T013 Command conformance across all 7 deep commands [3m] [Evidence: `validate_document.py --type command` reported `7 pass / 0 fail`]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [Evidence: `tasks.md` phase sections contain the completed task set]
- [x] No `[B]` blocked tasks remaining. [Evidence: `tasks.md` contains 0 blocked task markers]
- [x] Drift clean for all registered commands. [Evidence: `check-contract-drift.cjs` `OK commands=4`]
- [x] Checklist.md fully verified. [Evidence: `checklist.md` Verification Summary records all P0/P1/P2 verified]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
