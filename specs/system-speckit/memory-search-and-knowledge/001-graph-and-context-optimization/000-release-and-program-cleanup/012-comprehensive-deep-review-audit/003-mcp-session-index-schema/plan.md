---
title: "Implementation Plan: MCP Session + Index + Schema/Entrypoint Review Slice"
description: "Read-only deep-review plan for the spec-kit MCP session lifecycle, incremental indexing and ingest, embedder management, the context-server entrypoint and tool-schema-to-handler parity."
trigger_phrases:
  - "mcp session index schema review plan"
  - "tool schema parity review plan"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: MCP Session + Index + Schema/Entrypoint Review Slice

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

Deeply audit the MCP session lifecycle, incremental indexing and ingest, embedder management, the context-server entrypoint and the tool-schema layer. Tool-schema-to-handler parity is the priority drift target, so every advertised option is traced to handler usage or flagged as drift. The slice is a read-only review, so no reviewed file is modified. Findings are reported as P0, P1 and P2 with concrete file and line evidence.
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
- [ ] Schema-to-handler parity is assessed with a recorded verdict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only review slice. `spec.md` puts modifying any reviewed file out of scope.

### Key Components

- **`mcp_server/context-server.ts`**: entrypoint, dispatch and tool registration correctness.
- **`mcp_server/tool-schemas.ts`** and **`mcp_server/schemas/`**: tool-schema-to-handler parity for advertised options and call shapes.
- **`mcp_server/handlers/session-*.ts`**: session lifecycle correctness.
- **`mcp_server/handlers/memory-index*.ts`**: incremental index correctness.
- **`mcp_server/handlers/memory-ingest.ts`** and **`mcp_server/handlers/embedder-*.ts`**: ingest and embedder management correctness.

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
