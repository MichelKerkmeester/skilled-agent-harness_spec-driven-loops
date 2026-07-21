---
title: "Tasks: Write-Set Conflict Graph"
description: "Tasks for the phase-012 write-set conflict graph leaf: implement the executable dependency, conflict, and phase-013 scheduling contract."
trigger_phrases:
  - "write-set conflict graph tasks"
  - "phase-013 scheduling tasks"
  - "deep-loop write ownership tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and locally verified the graph derivation and fail-closed scheduler"
    next_safe_action: "Run the independent verifier against the sealed graph inputs"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Write-Set Conflict Graph

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

- [x] T001 Pin the frozen graph sources and bind every schedule to their content digests [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:43]
- [x] T002 Enforce the exact eight-entry phase-013 node list and reject missing, duplicate, renamed, or extra entries [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:145]
- [x] T003 Census shipped mode imports and writes for files, state, shared packets, backends, locks, fixtures, and outputs [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:119]
- [x] T004 Retain this child's empty manifest dependency list and keep the sibling adjacency navigation-only [File: spec.md:59]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the versioned graph envelope, node/resource records, edge types, assertions, policy, and receipts [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:5]
- [x] T006 Normalize path and service aliases into explicit canonical resource IDs with evidence [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/canonicalize.ts:107]
- [x] T007 Derive stable write-write, write-read, shared-backend, fence, and hard-order edges [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:414]
- [x] T008 Encode common-before-variant relationships as dedicated hard-order edges [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:59]
- [x] T009 Fence the review-loop pair and independently validate the research/council assertion against resources [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:280]
- [x] T010 Fail closed on unknown resources, stale digests, missing declarations, contradictory ownership, aliases, and cycles [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts:93]
- [x] T011 Implement graph reuse preflight, ready-node selection, stable tie breaking, refusal evidence, and refresh refusal [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:809]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify exact node-set equality and all four invalid-set cases [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:93]
- [x] T013 Verify every node has canonical reads, writes, ownership, mutability, scope, and source evidence [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:93]
- [x] T014 Verify symmetric write-write/write-read overlap, including canonical collisions and directory descendants [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:153]
- [x] T015 Verify hard predecessor edges remain separate and review/alignment cannot share a lane [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:260]
- [x] T016 Verify research/council independence succeeds only while actual mutable resources are disjoint [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:340]
- [x] T017 Verify unknown, ambiguous, and stale evidence returns serial-single-writer without widening [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:128]
- [x] T018 Verify equivalent reordered input produces identical graph digest and schedule evidence [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:390]
- [x] T019 Verify stale digests and changed declarations refuse old schedules until refresh [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:311]
- [x] T020 Verify every node decision carries predecessor, conflict, fence, source, class, and reason evidence [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:430]
- [x] T021 Close adversarial trailing-slash, shared-access, case-alias, and mutability gaps while preserving honest parallelism [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:263]
- [x] T022 Canonicalize NFC/NFD and namespace-root path variants while preserving distinct Unicode filenames [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:435]
- [x] T023 Consolidate comparison-time path identity into `normalizeComparablePath` and verify composed case, slash, Unicode, dot-segment, and root spellings [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/canonicalize.ts:56]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and local verification tasks complete [File: implementation-summary.md:44]
- [x] All frozen requirements have executable local evidence [File: checklist.md:42]
- [ ] Independent phase gate sign-off is green; the graph deliberately cannot grant this gate itself
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
