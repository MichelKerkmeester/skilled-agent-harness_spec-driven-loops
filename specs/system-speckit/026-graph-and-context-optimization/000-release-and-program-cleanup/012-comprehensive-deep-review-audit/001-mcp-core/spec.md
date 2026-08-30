---
title: "Feature Specification: MCP Memory Mutation + Save + Reconcile Review Slice"
description: "Deep-review slice targeting the spec-kit MCP memory mutation, save pipeline, and embedding-reconcile path for correctness, security, and traceability drift."
trigger_phrases:
  - "mcp core review"
  - "memory save audit"
  - "mutation path audit"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: MCP Memory Mutation + Save + Reconcile Review Slice

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `wt/0006-deep-review-audit` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit MCP memory write path (mutation hooks, the save pipeline, CRUD update/delete/bulk-delete, and embedding reconcile) was heavily modified across the 026 program. A calibration pass already surfaced real P1 bugs here (stale entity-density cache after update/delete; reconcile dry-run/apply count drift; operator-doc contract drift). This slice audits the full write path in depth for correctness, security, and traceability or contract drift.

### Purpose
Deeply audit the listed implementation files and report P0/P1/P2 findings with concrete file and line evidence. This is a READ-ONLY review of the implementation; do not modify the reviewed files.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (implementation files to review)
Review these implementation files in depth (the memory mutation, save, and embedding-reconcile write path). Follow call sites into supporting library modules as needed for evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/` (save pipeline sub-handlers)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`

### Out of Scope
- Modifying any reviewed file (read-only review)
- Retrieval/context/causal handlers (covered by sibling slices)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-save.ts` | Review | Audit the save pipeline orchestration for correctness + txn safety |
| `mcp_server/handlers/mutation-hooks.ts` | Review | Audit post-mutation hooks incl. cache invalidation completeness |
| `mcp_server/handlers/memory-crud-*.ts` | Review | Audit update/delete/bulk-delete correctness + hook wiring |
| `mcp_server/handlers/memory-embedding-reconcile.ts` | Review | Audit reconcile handler correctness + option handling |
| `mcp_server/lib/embedders/embedding-reconcile.ts` | Review | Audit reconcile dry-run vs apply predicate parity |
| `mcp_server/lib/search/entity-density.ts` | Review | Audit cache ownership + invalidation contract |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit the listed write-path implementation files | Findings cite file and line with concrete evidence |
| REQ-002 | Review dimensions: correctness, security, traceability | Each dimension addressed or marked clean |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All listed files reviewed across the dimensions with a recorded verdict and deduped findings


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent audit packet**: See `../spec.md`
- **Calibration evidence**: See `probe-report.md`

<!-- /ANCHOR:related-docs -->

---
