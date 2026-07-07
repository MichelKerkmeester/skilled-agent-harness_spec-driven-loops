---
title: "Implementation Summary: codegraph why_included breadcrumbs"
description: "Phase 008 added opt-in why_included edge-chain breadcrumbs to code graph blast_radius and context output while preserving compact defaults."
trigger_phrases:
  - "implementation"
  - "summary"
  - "codegraph why_included"
  - "blast radius trace"
  - "code_graph_context includeTrace"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/009-advisor-codegraph-shared-features/003-codegraph-why-included"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed includeTrace-gated why_included breadcrumbs for code graph query/context output"
    next_safe_action: "No phase 008 implementation follow-up required"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/bfs-traversal.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-codegraph-why-included"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Breadcrumbs use the shortest retained chain per file and stay gated behind includeTrace."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-codegraph-why-included |
| **Completed** | 2026-06-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now opt into concrete edge-chain breadcrumbs that explain why a file was included in `blast_radius` and `code_graph_context`. The trace is debug-only: default payloads do not include `why_included`, preserving the existing compact response shape and token budget.

### Blast-Radius Breadcrumbs

`computeBlastRadius` now builds `why_included` from the shared BFS path data when `includeTrace` is true. Each seed and affected file can carry depth, an import `edgeChain`, minimum confidence across the chain, ambiguity state, and a truncation reason for max-depth or result-limit boundaries.

### Context Breadcrumbs

`buildContext` now adds `graphContext[].why_included` only for trace requests. Context breadcrumbs describe the anchor and one-hop call/import/export edges with confidence, provenance, evidence class, reason, step, and deadline or budget truncation when applicable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts` | Modified | Retains BFS path and truncated frontier data for trace consumers |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Modified | Emits `why_included` for `blast_radius` only when `includeTrace` is true |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Emits context section breadcrumbs only when `includeTrace` is true |
| `.opencode/skills/system-code-graph/mcp_server/tests/bfs-traversal.vitest.ts` | Modified | Covers BFS path and truncated frontier behavior |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Modified | Covers blast-radius trace-on and default-off behavior |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified | Covers context trace-on and default-off behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused phase 007 BFS traversal path data, added trace-only response fields at the two read surfaces, and verified that default payloads omit `why_included` unless `includeTrace` is true.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep breadcrumbs behind `includeTrace` | Default code graph responses must remain compact and unchanged for normal callers. |
| Keep one retained chain per file | The shortest retained chain explains inclusion while avoiding unbounded all-path payload growth. |
| Use traversal path data for blast radius | It ties breadcrumbs to the actual BFS edge chain instead of reconstructing or fabricating paths later. |
| Cap context trace breadcrumbs per section | Trace requests can be larger, but they still need bounded payload behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm test -- tests/bfs-traversal.vitest.ts tests/code-graph-query-handler.vitest.ts tests/code-graph-context-handler.vitest.ts` | PASS, 3 files and 47 tests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Public query schema follow-up is out of scope.** The approved write list did not include `tool-schemas.ts`, so `code_graph_query` handler/runtime support accepts `includeTrace`, but public schema exposure needs a separately approved schema edit.
2. **Parent changelog update is out of scope.** The phase scaffold mentions a parent changelog, but the approved write list only allowed the 008 phase docs.
<!-- /ANCHOR:limitations -->
