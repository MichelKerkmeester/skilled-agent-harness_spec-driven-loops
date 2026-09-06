---
title: "Tasks: Phase 2: metadata-drift-and-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "graph metadata child identity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: metadata-drift-and-rules

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Read the child-drift and disk-consistency rules, the registry format, and the writer's merge; census the drift (127 of 2,707 packets; 14 track roots)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Prune foreign-identity children in the merge; keep prediction and apply in parity (`runtime/lib/graph/graph-metadata-parser.ts`, `runtime/cli/graph/backfill-graph-metadata.ts`)
- [x] T003 Add and register the child-identity rule (`runtime/cli/rules/check-graph-metadata-child-identity.sh`, `runtime/cli/lib/validator-registry.json`)
- [x] T004 [P] Add the track-root sweep and document it (`runtime/cli/spec/sweep-track-roots.mjs`, `runtime/cli/spec/README.md`)
- [x] T005 Reshape the prune-gate fixture to the new contract and add a foreign-identity prune test (`runtime/cli/tests/backfill-prune-report-gate.vitest.ts`, `runtime/cli/tests/graph-metadata-refresh.vitest.ts`)
- [x] T006 Regenerate the proof packet (`specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json`): twelve foreign entries gone
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Typecheck exit 0; runtime and CLI rebuilt; dist fresh
- [x] T008 Writer and registry suites 12 files green (16 and 115 tests); shell rule tests 12 and 2 passed; strict validate on 054 lists the rule and reports PASSED; sweep prints 14 drifted roots and exits 1
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
