---
title: "Tasks: Runtime backend promotions"
description: "Tasks for phase 002 of the deep-loop-workflows merge: Runtime backend promotions."
trigger_phrases:
  - "deep-loop-workflows phase 002"
  - "runtime-backend-promotions"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/002-runtime-backend-promotions"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 002 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-002-runtime-backend-promotions-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime backend promotions

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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read predecessor continuity and `../research/research.md` for this phase's scope
- [ ] T002 Load the phase-001 parity baseline for the affected modes/surfaces

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Gate on phase-001 baseline manifest and runtime-ownership ADR before any Phase 002 edit. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/**`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/002-runtime-backend-promotions/**`)
- [ ] T002 Freeze exact promoted API and output contracts from current source files. (`.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`, `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs`)
- [ ] T003 Promote parameterized runtime-capabilities resolver and keep old scripts as byte-compatible shims. (`.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs`, `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`)
- [ ] T004 Promote resolveArtifactRoot contract into runtime and rewire graph-backed reducers. (`.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`, `.opencode/skills/deep-research/scripts/reduce-state.cjs`)
- [ ] T005 Move emitResourceMap to workflow shared synthesis, not runtime, and rewire research/review reducers. (`.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs`, `.opencode/skills/deep-research/scripts/reduce-state.cjs`)
- [ ] T006 Add loop-lock CLI adapter over existing loop-lock.ts library. (`.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`)
- [ ] T007 Promote terminal lifecycle taxonomy and preserve improvement journal validation. (`.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs`, `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs`)
- [ ] T008 Add focused unit and cross-skill contract tests for all promotions. (`.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts`, `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts`)
- [ ] T009 Assert improvement remains host-driven and absent from runtime convergence loop types. (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs`)
- [ ] T010 Verify no MCP or advisor-discovery surface was introduced. (`.opencode/skills/deep-loop-runtime/**`, `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs`)
- [ ] T011 Refresh runtime documentation for promoted backend contracts only. (`.opencode/skills/deep-loop-runtime/README.md`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md`)
- [ ] T012 Record phase evidence and run strict phase validation. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/002-runtime-backend-promotions/plan.md`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/002-runtime-backend-promotions/tasks.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the parity check: Use the actual phase-001 baseline manifest as the only baseline source. Compare old research/review runtime-capability script stdout/stderr/exit bytes, artifact-root golden JSON for root/child/pt allocation cases, resource-map markdown bytes for frozen research/review deltas, and reducer-generated artifact trees after import rewires. Loop-lock CLI is additive, so prove CLI-vs-library behavior equivalence; also assert convergence.cjs still rejects improvement and no MCP or discoverable deep-loop-workflows metadata was added.
- [ ] T016 `validate.sh --strict` on this phase folder
- [ ] T017 Confirm the phase success criteria in `spec.md` are met

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Parity check passed against the phase-001 baseline.
- [ ] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: `../research/research.md`, `../context/context-report.md`

<!-- /ANCHOR:cross-refs -->
