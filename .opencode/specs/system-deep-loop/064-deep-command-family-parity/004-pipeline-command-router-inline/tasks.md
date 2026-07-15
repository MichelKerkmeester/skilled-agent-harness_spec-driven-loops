---
title: "Tasks: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands"
description: "Task list for promoting research/review/ai-council/alignment stubs to inline router bodies, folding the autonomous directive, dropping the bang, recompiling contracts, and verifying the maintained pipeline."
trigger_phrases:
  - "deep command router inline"
  - "promote deep command body drop bang"
  - "recompile deep command contracts"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/004-pipeline-command-router-inline"
    last_updated_at: "2026-07-13T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase 004 task breakdown (all tasks pending)"
    next_safe_action: "Execute T001-T003 setup reads"
---
# Tasks: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands

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

- [ ] T001 Read the 4 stubs + their legacy bodies + their compiled `autonomousExecutionDirective` blocks (`deep/{research,review,ai-council,alignment}.md`, `assets/legacy/*`, `assets/compiled/*`) [20m]
- [ ] T002 Read the render/compile/drift scripts + the spec-gate hook `classificationOptions` path to confirm the bang is not load-bearing for Gate-3 (`render-command-contract.cjs`, `check-contract-drift.cjs`) [15m]
- [ ] T003 Locate the 3 create-command citing docs at their example lines (`create-command/SKILL.md` ~318, `command_router_template.md` ~102, `command_template.md` ~843) [5m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Documents
- [ ] T004 Promote 4 command bodies: lift legacy `## 1..## 6` under frontmatter + H1, fold the `autonomousExecutionDirective`, drop the bang (`deep/{research,review,ai-council,alignment}.md`) [45m]
- [ ] T005 Preserve frontmatter `allowed-tools` byte-for-byte on all 4 during promotion (`deep/{research,review,ai-council,alignment}.md`) [5m]

### Integration
- [ ] T006 [P] Recompile the 4 compiled contracts (`compile-command-contracts.cjs --command deep/<name> --write`) [5m]
- [ ] T007 [P] Correct the 3 create-command standard docs that cite these commands as compiled-stub examples (`create-command/SKILL.md`, `command_router_template.md`, `command_template.md`) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [ ] T008 Run the 4 vitest suites (`render-command-contract`, `check-contract-drift`, `compile-command-contracts`, `resolve-injection-mode`) [Evidence: pending]

### Integration Tests
- [ ] T009 Drift sweep across registered commands (`check-contract-drift.cjs` → OK) [Evidence: pending]
- [ ] T010 Render smoke for the 4 in `mode=fix` (`render-command-contract.cjs --command deep/<name> --compare` → COMPARE OK) + `mode=fix` freshness (`writeManifest:false`) [Evidence: pending]

### Manual Verification
- [ ] T011 Live `:auto` smoke test of `research` + `review` before any merge (setup-resolved, no Gate-3 halt, route-proof) [Evidence: pending]

### Documentation
- [ ] T012 Command conformance across all 7 deep commands (`validate_document.py --type command` → exit 0 each) [Evidence: pending]
- [ ] T013 `validate.sh --strict` on this child + roll up the 064 parent Phase Documentation Map [Evidence: pending]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. [Evidence: pending]
- [ ] No `[B]` blocked tasks remaining. [Evidence: pending]
- [ ] Drift clean for all registered commands after recompile. [Evidence: pending]
- [ ] Checklist.md fully verified with evidence. [Evidence: pending]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
