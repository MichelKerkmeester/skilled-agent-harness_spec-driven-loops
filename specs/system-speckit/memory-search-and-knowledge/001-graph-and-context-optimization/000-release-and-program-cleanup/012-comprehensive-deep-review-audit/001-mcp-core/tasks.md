---
title: "Tasks: MCP Memory Mutation + Save + Reconcile Review Slice"
description: "Task breakdown for the read-only MCP memory write-path review: mutation hooks, save pipeline, CRUD update and delete, bulk delete and embedding reconcile."
trigger_phrases:
  - "mcp core review tasks"
  - "memory write path audit tasks"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: MCP Memory Mutation + Save + Reconcile Review Slice

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Create the review packet folder and scope statement (`spec.md`)
- [ ] T002 Bound the review target to the listed write-path files and the correctness, security and traceability dimensions (`spec.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit post-mutation hooks and cache-invalidation completeness (`mcp_server/handlers/mutation-hooks.ts`)
- [ ] T004 Audit save-pipeline orchestration for correctness and transaction safety (`mcp_server/handlers/memory-save.ts`, `mcp_server/handlers/save/`)
- [ ] T005 Audit update, delete and bulk-delete correctness and hook wiring (`mcp_server/handlers/memory-crud-*.ts`)
- [ ] T006 Audit reconcile option handling and dry-run versus apply predicate parity (`mcp_server/handlers/memory-embedding-reconcile.ts`, `mcp_server/lib/embedders/embedding-reconcile.ts`)
- [ ] T007 Audit cache ownership and the invalidation contract (`mcp_server/lib/search/entity-density.ts`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm every listed file and dimension has a recorded verdict (`review/`)
- [ ] T009 Confirm no reviewed file was modified (read-only boundary) (`spec.md`)
- [ ] T010 Confirm findings cite file and line evidence (`review/`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All listed files reviewed with a recorded verdict and deduped findings
- [ ] Findings cite file and line evidence
- [ ] Read-only boundary held, so no reviewed file was modified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
