---
title: "Summary: 016/003 Embedder MCP tools + re-index orchestrator"
description: "Pre-execution stub. Backfilled after phase 3 ships."
trigger_phrases: ["016/003 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/003-embedder-mcp-tools-and-reindex"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold stub"
    next_safe_action: "Phase 3 execution after 016/002"
    blockers: ["016/002"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-003-summary"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/003 Embedder MCP tools + re-index orchestrator

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | Scaffolded |
| Branch | main |
| Wall-clock estimate | 5-8 hours (cli-devin paired dispatch) |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
Pre-execution stub. Expected deliverables:
- 3 handler files (~80-120 LOC each)
- reindex.ts orchestrator (~250-400 LOC including state machine + persistence)
- tool-schemas.js update (~30 LOC of new entries)
- cat-18 vitest update (~5 LOC delta)
- 3 vitest files (~300-450 LOC combined)


<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
Pre-execution. Pickup via cli-devin SWE-1.6 paired-parallel dispatch.


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
Pre-execution. Pre-decided:
- Two-phase commit for swap (embed-all then flip pointer)
- Crash-resume via jobState in settings (no new infra)
- Batched embed (configurable, default 50)
- Cancel respects current batch (graceful, no rollback of partial vec writes)


<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Target |
|-------|--------|
| Handler vitests | All pass |
| Orchestrator state-machine vitest | All pass |
| Integration vitest with fixture corpus | End-to-end swap works |
| cat-18 vitest (42 tools) | Pass |
| npm run build | Clean |
| strict-validate 016/003 | exit 0 |


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
Pre-execution. Anticipated:
- Re-index pauses if ollama is unreachable mid-run (recoverable on next start)
- Cancel doesn't roll back partial writes (those are isolated in vec_<newdim>; safe to overwrite on retry)
- Large corpora (>100k memories) may need pagination tuning (default 50 batch may be too small)

<!-- /ANCHOR:limitations -->
