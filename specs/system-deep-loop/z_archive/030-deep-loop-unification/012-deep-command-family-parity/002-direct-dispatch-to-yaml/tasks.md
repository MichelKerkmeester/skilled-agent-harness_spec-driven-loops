---
title: "Tasks: convert the direct-dispatch deep command to yaml-backed"
description: "Task list for converting skill-benchmark to the yaml-backed family shape."
trigger_phrases:
  - "deep direct dispatch to yaml"
  - "skill-benchmark yaml-backed"
  - "deep command workflow yaml conversion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/002-direct-dispatch-to-yaml"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; verification gates green"
    next_safe_action: "Proceed to child 003"
---
# Tasks: convert the two direct-dispatch deep commands to yaml-backed

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

- [x] T001 Read both direct-dispatch commands + the model-benchmark YAML template (`model-benchmark.md`) [20m]
- [x] T002 Read the loop-host flag-forwarding sets + shared dialect (`loop-host.cjs`, `parse-args.cjs`) [15m]
- [x] T003 Capture the skill-benchmark baseline via a real direct run [15m] [Evidence: `loop-host.cjs --mode=skill-benchmark` baseline `verdict=FAIL scenarios=38`]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Documents
- [x] T004 Author the skill-benchmark auto + confirm YAML (`deep_skill-benchmark_auto.yaml`) [25m]
- [x] T005 Author the skill-benchmark 4-section presentation (`deep_skill-benchmark_presentation.txt`) [20m]

### Integration
- [x] T008 Rewire skill-benchmark to yaml-backed (`skill-benchmark.md`) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T010 Prove skill-benchmark converted report equals baseline [5m] [Evidence: converted `loop-host.cjs` report `BYTE-IDENTICAL` to baseline, timestamps normalized]

### Integration Tests
- [x] T011 Prove adapter argv byte-identical across flag combos, both commands [8m] [Evidence: `planInvocation` harness `ALL_ADAPTER_ARGV_IDENTICAL=true` over 8 combos]

### Manual Verification
- [x] T013 Confirm both HARD-BLOCK gates preserved [5m] [Evidence: Phase 0 + input gate present verbatim]

### Documentation
- [x] T014 Command conformance across all 7 deep commands [3m] [Evidence: `validate_document.py --type command` reported `7 pass / 0 fail`]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [Evidence: `tasks.md` phase sections contain the completed task set]
- [x] No `[B]` blocked tasks remaining. [Evidence: `tasks.md` contains 0 blocked task markers]
- [x] Dispatch proven byte-identical for both commands. [Evidence: `ALL_ADAPTER_ARGV_IDENTICAL=true` plus the skill-benchmark report match]
- [x] Checklist.md fully verified. [Evidence: `checklist.md` Verification Summary records all P0/P1/P2 verified]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
