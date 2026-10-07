---
title: "Tasks: Fix SQLite Transaction Nesting Issue"
description: "Reconstructed task breakdown for converting the memory index writer to the composable transaction wrapper so nested transactions no longer fail."
trigger_phrases:
  - "sqlite transaction nesting task list"
  - "memory index scan bug fix tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Fix SQLite Transaction Nesting Issue

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

- [ ] T001 Capture the failing `memory_index_scan` error and confirm it reproduces after an embedding provider switch (`spec.md`)
- [ ] T002 Trace the nested transaction to the inconsistent wrappers in `indexMemoryFile()` and `indexMemory()` (`spec.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Convert `indexMemory()` from explicit `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` to the composable `database.transaction()` wrapper (`mcp_server/lib/vector-index.js`)
- [ ] T004 Update the transaction pattern tests to verify the new wrapper (`scripts/test-bug-fixes.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Restart OpenCode and run `memory_index_scan({ force: true })` (`spec.md`)
- [ ] T006 Confirm no transaction errors are raised (`spec.md`)
- [ ] T007 Confirm all memory files index successfully (`spec.md`)
- [ ] T008 Test semantic search after the scan completes (`spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] `memory_index_scan` completes without a transaction error
- [ ] All memory files are indexed
- [ ] Semantic search returns results after the scan
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
