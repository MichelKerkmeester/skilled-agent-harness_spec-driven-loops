---
title: "Implementation Plan: MCP Memory Mutation + Save + Reconcile Review Slice"
description: "Read-only deep-review plan for the spec-kit MCP memory write path: mutation hooks, the save pipeline, CRUD update and delete, bulk delete and embedding reconcile. Findings carry file and line evidence."
trigger_phrases:
  - "mcp core review plan"
  - "memory write path audit plan"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: MCP Memory Mutation + Save + Reconcile Review Slice

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (system-spec-kit MCP server) |
| **Framework** | Not recorded |
| **Storage** | Not recorded |
| **Testing** | Not recorded |

### Overview

Deeply audit the memory write path end to end, covering mutation hooks, the save pipeline, CRUD update and delete, bulk delete and embedding reconcile. The slice is a read-only review, so no reviewed file is modified. Findings are reported as P0, P1 and P2 with concrete file and line evidence, and each listed file receives a recorded verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done

- [ ] All tasks in `tasks.md` complete
- [ ] Every listed file carries a recorded verdict and deduped findings
- [ ] Findings cite file and line evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only review slice. `spec.md` puts modifying any reviewed file out of scope.

### Key Components

- **`mcp_server/handlers/mutation-hooks.ts`**: post-mutation hooks, including cache-invalidation completeness.
- **`mcp_server/handlers/memory-save.ts`** and **`mcp_server/handlers/save/`**: save-pipeline orchestration and transaction safety.
- **`mcp_server/handlers/memory-crud-*.ts`**: update, delete and bulk-delete correctness and hook wiring.
- **`mcp_server/handlers/memory-embedding-reconcile.ts`** and **`mcp_server/lib/embedders/embedding-reconcile.ts`**: reconcile option handling and dry-run versus apply predicate parity.
- **`mcp_server/lib/search/entity-density.ts`**: cache ownership and the invalidation contract.

### Data Flow

Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Not recorded. Review findings are expected to cite file and line evidence, so verification is the cited evidence itself rather than a test suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Not recorded.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded. The slice is read-only and changes no reviewed file.
<!-- /ANCHOR:rollback -->
