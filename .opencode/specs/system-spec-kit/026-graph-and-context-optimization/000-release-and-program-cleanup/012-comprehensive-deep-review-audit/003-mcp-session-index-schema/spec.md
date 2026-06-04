---
title: "Feature Specification: MCP Session + Index + Schema/Entrypoint Review Slice"
description: "Deep-review slice targeting MCP session lifecycle, indexing, ingest, embedders, the context-server entrypoint, and tool-schema-to-handler parity."
trigger_phrases:
  - "mcp session review"
  - "tool schema parity audit"
  - "context-server audit"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: MCP Session + Index + Schema/Entrypoint Review Slice

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
The MCP session lifecycle, incremental indexing, ingest, embedder management, the context-server entrypoint/dispatch, and the tool-schema layer all changed across 026. A calibration pass already found tool-schema-to-handler drift (an advertised option ignored; install-guide call shape stale), so schema-to-handler parity is a priority drift target here.

### Purpose
Deeply audit the listed files for correctness, security, and schema/contract drift, with special attention to tool-schema-to-handler parity. READ-ONLY review; do not modify the reviewed files.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (implementation files to review)
Review these implementation files in depth; follow call sites into supporting lib modules (`lib/session`, `lib/embedders`, `lib/storage`, `lib/ipc`, `lib/index` equivalents) as needed:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/` (tool-input schemas)

### Priority Drift Target
Cross-check every tool advertised in `tool-schemas.ts` / `schemas/` against its handler: options accepted but ignored, schema-to-handler shape mismatches, and docs/install-guide call shapes that disagree with the live schema.

### Out of Scope
- Modifying any reviewed file (read-only review)
- Mutation/save path (slice 001) and retrieval/causal path (slice 002)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/context-server.ts` | Review | Audit entrypoint/dispatch + tool registration correctness |
| `mcp_server/tool-schemas.ts` | Review | Audit schema-to-handler parity (advertised vs implemented) |
| `mcp_server/handlers/session-*.ts` | Review | Audit session lifecycle correctness |
| `mcp_server/handlers/memory-index*.ts` | Review | Audit incremental index correctness |
| `mcp_server/handlers/embedder-*.ts` | Review | Audit embedder management correctness |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit the listed session/index/schema files | Findings cite file and line with concrete evidence |
| REQ-002 | Verify tool-schema-to-handler parity | Each advertised option traced to handler usage or flagged as drift |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All listed files reviewed; schema-to-handler parity assessed with a recorded verdict


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent audit packet**: See `../spec.md`

<!-- /ANCHOR:related-docs -->

---
