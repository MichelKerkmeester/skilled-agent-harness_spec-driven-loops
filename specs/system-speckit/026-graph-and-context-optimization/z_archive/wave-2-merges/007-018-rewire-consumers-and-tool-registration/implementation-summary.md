---
title: "Implementation Summary: Rewire consumers and runtime imports"
description: "Recalibrated as complete; direct library imports remain, MCP tool routing moves in 007."
trigger_phrases:
  - "code graph extraction 004-rewire-consumers-and-tool-registration summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-018-rewire-consumers-and-tool-registration"
    last_updated_at: "2026-05-14T09:13:21Z"
    last_updated_by: "claude"
    recent_action: "Recalibration backfill post-manual-reorg"
    next_safe_action: "014/007-mcp-topology-pivot executes ADR-002 standalone MCP topology"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tools/index.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tools/index.ts"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Rewire consumers and runtime imports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Recalibrated** | 2026-05-14T09:13:21Z |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Rewired cross-subsystem library consumers to import directly from system-code-graph (e.g., `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.../handlers/session-resume.ts`, `.../handlers/session-bootstrap.ts`, `.../handlers/session-health.ts`, `.../handlers/memory-context.ts`).
- Preserved in-process function-call consumers for startup/session/handler paths (e.g., `mcp_server/hooks/claude/compact-inject.ts`, `mcp_server/hooks/claude/session-prime.ts`, `mcp_server/hooks/memory-surface.ts`, `mcp_server/hooks/codex/lib/freshness-smoke-check.ts`).
- Left stable tool IDs unchanged: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_verify`, `code_graph_apply`, `ccc_status`, `ccc_reindex`, `ccc_feedback`, `detect_changes`.
- 007 now changes only MCP tool registration ownership: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` no longer registers code_graph_*/ccc_*/detect_changes; `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` registers them.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime consumer direction stays as ADR-001 Q5 intended: direct imports for library consumers. ADR-002 changes MCP topology only and does not convert cross-subsystem library calls into MCP round trips.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Current Status |
|----------|----------------|
| Direct sibling imports | Preserved for code-graph library consumers. |
| Stable tool IDs | Preserved. Namespace changes from mcp__mk_spec_memory__* to mcp__system_code_graph__*. |
| spec_kit_memory dispatch | Superseded by 007: code-graph tool dispatch removed from spec_kit_memory. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Direct imports preserved | PASS | system-spec-kit context/session code still imports system-code-graph lib functions directly. |
| Metadata recalibrated | PASS | graph-metadata.json derived.status set to complete. |
| Historical docs preserved | PASS | spec.md, plan.md, tasks.md, checklist.md unchanged. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Historical wording about co-resident MCP registration is superseded by 014/007.
<!-- /ANCHOR:limitations -->
