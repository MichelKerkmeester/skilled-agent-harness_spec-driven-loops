---
title: "Tasks: 016/003 Embedder MCP tools + re-index orchestrator"
description: "Numbered checklist for the MCP-surface + orchestrator phase."
trigger_phrases: ["016/003 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex"
    last_updated_at: "2026-05-17T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "Commit and push phase 016/003"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/003 Embedder MCP tools + re-index orchestrator

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` = completed | `[ ]` = pending | `[~]` = partial


<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] T0.1: Confirm 016/001 + 016/002 shipped on main
- [x] T0.2: Inspect existing `mcp_server/handlers/` patterns for handler structure
- [x] T0.3: Confirm tool-schemas.js registration pattern


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### Handlers
- [x] T1.1: `handlers/embedder-list.ts` (returns array of manifests + active + ready)
- [x] T1.2: `handlers/embedder-set.ts` (validates, ensures vec table, starts reindex, returns jobId)
- [x] T1.3: `handlers/embedder-status.ts` (polls jobState)

### Tool registration
- [x] T1.4: Register 3 new tools in tool-schemas.js (count 39 → 42)
- [x] T1.5: Update cat-18 vitest tool count expectation 39 → 42 (codex B's prior fix carries forward)

### Orchestrator
- [x] T2.1: `lib/embedders/reindex.ts` — ReindexJob state + storage
- [x] T2.2: Implement batched embed loop (default batch=50, configurable)
- [x] T2.3: Implement progress persistence (every batch flush to settings/jobs)
- [x] T2.4: Implement crash-resume (read jobState on MCP start, resume if status='running')
- [x] T2.5: Implement cancel (sets status='cancelled', halts after current batch)
- [x] T2.6: Implement two-phase commit (flip active pointer only on full success)

### Tests
- [x] T3.1: Handler-level vitest (mocked orchestrator)
- [x] T3.2: Orchestrator state-machine vitest (happy path, crash-resume, cancel, error)
- [x] T3.3: Integration vitest with 10-memory fixture + mocked OllamaAdapter


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] T4.1: All new vitests pass
- [x] T4.2: cat-18 context-server.vitest passes with new 42 tool count
- [x] T4.3: `npm run build` clean
- [x] T4.4: strict-validate 016/003 exit 0
- [x] T4.5: Commit + push: `feat(spec-kit/mcp_server): embedder MCP tools + reindex orchestrator (016/003)`


<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- 3 MCP tools live + schema-validated
- Reindex orchestrator handles full lifecycle (start → progress → completion → crash-resume → cancel)
- Phase 004 can call `embedder_set({name: "mxbai-embed-large-v1"})` end-to-end


<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Blocked by: 016/001, 016/002
- Unblocks: 016/004 mxbai swap

<!-- /ANCHOR:cross-refs -->
