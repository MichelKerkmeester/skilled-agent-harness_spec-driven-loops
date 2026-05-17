---
title: "Summary: 022/001 pluggable architecture"
description: "Pending — populated after implementation"
trigger_phrases: ["022/001 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-embedder-parity/001-pluggable-architecture"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Backfill after implementation"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022001"
      session_id: "022-001-pluggable-architecture-impl"
      parent_session_id: "022-001-pluggable-architecture"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 022/001 pluggable architecture

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Pending |
| Artifact | TBD: `mcp_server/lib/embedders/**`, `tests/embedders/**`, skill-graph-db migration |
| Owner | main agent or cli-codex dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Pending. Will land at `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/{adapter,registry,schema,types}.ts` + `adapters/{ollama,llama-cpp-baseline}.ts` + tests + skill-graph-db.ts migration.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Copy-adapt 016 mk-spec-memory code (duplicate) rather than extract shared package now — accelerates ship; defer extraction
- skill-graph.sqlite gets vec_metadata table additively via idempotent migration
- semantic-shadow.ts wired to registry directly; legacy factory.ts cascade preserved as fallback via env var
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Pending:
- Run: `npm test` in skill-advisor mcp_server — expect existing + new tests PASS
- Verify: `sqlite3 skill-graph.sqlite ".tables"` shows `vec_metadata`
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict`
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Pending.
<!-- /ANCHOR:limitations -->
