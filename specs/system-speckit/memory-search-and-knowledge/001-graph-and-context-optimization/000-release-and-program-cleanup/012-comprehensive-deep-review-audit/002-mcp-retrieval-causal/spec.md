---
title: "Feature Specification: MCP Retrieval + Causal Review Slice"
description: "Deep-review slice targeting the spec-kit MCP retrieval (search/context/triggers) and causal-graph read path for correctness, security, and traceability drift."
trigger_phrases:
  - "mcp retrieval review"
  - "causal graph audit"
  - "memory search audit"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: MCP Retrieval + Causal Review Slice

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
The MCP retrieval and causal-graph read path (semantic search, unified context, trigger matching, causal links) was heavily reworked across 026 (graph-channel routing, query intelligence, scoring/calibration). This slice audits it for correctness, security, and contract/traceability drift.

### Purpose
Deeply audit the listed retrieval and causal implementation files and report P0/P1/P2 findings with concrete file and line evidence. READ-ONLY review; do not modify the reviewed files.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (implementation files to review)
Review these implementation files in depth; follow call sites into supporting lib modules (`lib/search`, `lib/causal`, `lib/context`, `lib/scoring`, `lib/routing`, `lib/query`, `lib/rag`) as needed for evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`

### Out of Scope
- Modifying any reviewed file (read-only review)
- Mutation/save path (slice 001) and session/index path (slice 003)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-search.ts` | Review | Audit semantic search + ranking correctness |
| `mcp_server/handlers/memory-context.ts` | Review | Audit unified context assembly + graph-channel routing |
| `mcp_server/handlers/memory-triggers.ts` | Review | Audit trigger matching correctness |
| `mcp_server/handlers/causal-graph.ts` | Review | Audit causal graph query correctness + safety |
| `mcp_server/handlers/causal-links-processor.ts` | Review | Audit causal link processing + edge integrity |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit the listed retrieval/causal files | Findings cite file and line with concrete evidence |
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

<!-- /ANCHOR:related-docs -->

---
