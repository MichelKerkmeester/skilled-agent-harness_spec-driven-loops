---
title: "Tasks: MCP Retrieval + Causal Review Slice"
description: "Task breakdown for the read-only MCP retrieval and causal read-path review: semantic search, unified context, trigger matching and causal link processing."
trigger_phrases:
  - "mcp retrieval review tasks"
  - "causal read path audit tasks"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: MCP Retrieval + Causal Review Slice

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
- [ ] T002 Bound the review target to the listed retrieval and causal files and the correctness, security and traceability dimensions (`spec.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit semantic search and ranking (`mcp_server/handlers/memory-search.ts`)
- [ ] T004 Audit unified context assembly and graph-channel routing (`mcp_server/handlers/memory-context.ts`)
- [ ] T005 Audit trigger matching (`mcp_server/handlers/memory-triggers.ts`)
- [ ] T006 Audit causal graph query correctness and safety (`mcp_server/handlers/causal-graph.ts`)
- [ ] T007 Audit causal link processing and edge integrity (`mcp_server/handlers/causal-links-processor.ts`)

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
