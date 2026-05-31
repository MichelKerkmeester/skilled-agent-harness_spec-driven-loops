---
title: "Resource Map: 011 Coco Memory Context Extras"
description: "Preserved packet resource map, retained with child 001 as audit context after phase-parent split."
trigger_phrases:
  - "027 phase 011 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/001-exemplars-schema"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Preserved resource map"
    next_safe_action: "Use as audit context"
    blockers: []
    key_files: ["resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-resource-map"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this file as audit context for the original Phase 008 packet and as a pointer to the five executable child packets.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Parent packet**: `../`
- **Track A**: Coco exemplar schema, retrieval, and maintenance.
- **Track B**: Memory context curator prompt and integration.
- **Current owner**: Child 001 retains the original packet-level audit resources so the parent can stay a lean phase-parent trio.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:specs -->
## Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `../spec.md` | Updated | OK | Lean phase-parent control file |
| `../description.json` | Updated | OK | Parent metadata with children |
| `../graph-metadata.json` | Updated | OK | Parent graph metadata with children |
| `../001-exemplars-schema/` | Created | OK | Track A bootstrap |
| `../002-exemplars-retriever/` | Created | OK | Track A retrieval |
| `../003-exemplars-maintenance/` | Created | OK | Track A maintenance |
| `../004-curator-prompt/` | Created | OK | Track B bootstrap |
| `../005-curator-integration/` | Created | OK | Track B integration |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/examples_schema.py` | Planned create | Child 001 | Coco schema and migration |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/exemplar_retriever.py` | Planned create | Child 002 | Query-time exemplar retrieval |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/exemplar_maintenance.py` | Planned create | Child 003 | TTL, cap, reconciliation, clear |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context_curator.ts` | Planned create | Child 004 | Curator prompt, parser, schema |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-search.ts` | Planned modify | Child 005 | Budget split and curator hook |
<!-- /ANCHOR:scripts -->
