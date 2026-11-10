---
title: "Tasks: MCP Session + Index + Schema/Entrypoint Review Slice"
description: "Task breakdown for the read-only MCP session, index, ingest, embedder and tool-schema review, with schema-to-handler parity as the priority drift target."
trigger_phrases:
  - "mcp session index schema review tasks"
  - "tool schema parity review tasks"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: MCP Session + Index + Schema/Entrypoint Review Slice

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
- [ ] T002 Bound the review target to the listed session, index, schema and entrypoint files and the correctness, security and drift dimensions (`spec.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit session lifecycle (`mcp_server/handlers/session-*.ts`)
- [ ] T004 Audit incremental indexing (`mcp_server/handlers/memory-index*.ts`)
- [ ] T005 Audit ingest and embedder management (`mcp_server/handlers/memory-ingest.ts`, `mcp_server/handlers/embedder-*.ts`)
- [ ] T006 Audit the entrypoint, dispatch and tool registration (`mcp_server/context-server.ts`)
- [ ] T007 Cross-check tool-schema-to-handler parity for advertised options and call shapes (`mcp_server/tool-schemas.ts`, `mcp_server/schemas/`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm every listed file has a recorded verdict and schema parity is assessed (`review/`)
- [ ] T009 Confirm no reviewed file was modified (read-only boundary) (`spec.md`)
- [ ] T010 Confirm findings cite file and line evidence (`review/`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All listed files reviewed with a recorded verdict and deduped findings
- [ ] Schema-to-handler parity assessed with a recorded verdict
- [ ] Read-only boundary held, so no reviewed file was modified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
