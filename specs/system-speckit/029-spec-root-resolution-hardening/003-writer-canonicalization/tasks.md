---
title: "Tasks: Writer Canonicalization"
description: "Tasks to canonicalize the automatic writers, add collision rejection, and ship source+dist as one bundle before unfreeze."
trigger_phrases:
  - "writer canonicalization tasks"
  - "create.sh canonical tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Writer Canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Add shared-resolver calls + collision-guard scaffold to each writer entrypoint

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Stop autosave emits canonical (`mcp_server/hooks/claude/session-stop.ts`)
- [ ] T003 Bare/new saves canonical (`scripts/memory/generate-context.ts`)
- [ ] T004 Phase-pointer refresh consumes the resolved path (`scripts/core/workflow.ts`)
- [ ] T005 Both `create.sh` modes canonical; no legacy `mkdir -p` (`scripts/spec/create.sh`)
- [ ] T006 Per-write same-ID collision rejection
- [ ] T007 Build the source+dist bundle

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Alias-absent writer smoke across all four entrypoints
- [ ] T009 Collision-rejection unit tests; then unfreeze

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All writers canonical; no plain `specs/` produced alias-absent
- [ ] Collision rejection blocks divergent same-ID writes
- [ ] Source+dist shipped together; unfreeze clean

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Research**: See `../research/research.md`

<!-- /ANCHOR:cross-refs -->
