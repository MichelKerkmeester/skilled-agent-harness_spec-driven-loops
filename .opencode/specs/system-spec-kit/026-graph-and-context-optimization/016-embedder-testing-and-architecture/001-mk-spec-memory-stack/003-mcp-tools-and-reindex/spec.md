---
title: "016/003: Embedder MCP tools + re-index orchestrator"
description: "Phase 3 of 016. Expose embedder_list / embedder_set / embedder_status MCP tools + background re-index orchestrator. User-facing surface."
trigger_phrases:
  - "016/003 embedder mcp tools"
  - "embedder_set mcp tool"
  - "reindex orchestrator"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-mk-spec-memory-stack/003-mcp-tools-and-reindex"
    last_updated_at: "2026-05-17T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented embedder MCP tools and re-index orchestrator"
    next_safe_action: "Proceed to 016/004 mxbai swap using embedder_set"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-003-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/003: Embedder MCP tools + re-index orchestrator

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P1 |
| Status | Shipped |
| Branch | main |
| Runtime | Codex CLI |
| Blocked by | None |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
Make the swap mechanism (built in 002) usable via MCP. Three tools + one background orchestrator:
- `embedder_list` — show available embedders + active one + readiness state
- `embedder_set` — pick a new embedder, kick off re-index, return jobId
- `embedder_status` — poll re-index progress + last result

Plus the **re-index orchestrator** that runs in background, embeds all memories with new model, writes to `vec_<new-dim>`, swaps active pointer on completion, supports resume after crash.


<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/handlers/embedder-list.ts`
- `mcp_server/handlers/embedder-set.ts`
- `mcp_server/handlers/embedder-status.ts`
- `mcp_server/lib/embedders/reindex.ts` — orchestrator with progress + resume + cancel
- Tool registration in `dist/tool-schemas.js` (3 new tools, brings count 39 → 42)
- Update cat-18 vitest expectations (51 → 39 was codex B's fix; this phase brings 39 → 42)
- Re-index job-state persistence in settings table (or new `embedder_jobs` table)
- vitest: handler invocations + orchestrator state machine

### Out of Scope
- Actual model swap (phase 004 picks mxbai)
- Documentation (lives in phase 004's impl-summary)
- New adapters beyond ollama (defer to follow-on)


<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | `embedder_list` returns array of manifest + active flag + ready bool | vitest covers |
| REQ-002 | `embedder_set({name})` validates manifest + kicks off re-index + returns jobId | vitest covers |
| REQ-003 | `embedder_status({jobId})` returns {progress, eta, status, error?} | vitest covers |
| REQ-004 | Re-index orchestrator embeds in batches (configurable, default 50), persists progress every batch | vitest covers progress + crash-resume |
| REQ-005 | Swap-over atomic: old vec_<dim> retained, active pointer flips only on full completion | vitest covers |
| REQ-006 | cat-18 vitest tool count assertion updated 39 → 42 (NOT 51) | vitest pass |

### P1
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-007 | Re-index resumable after crash (jobState in settings) | vitest covers fake-crash mid-run |
| REQ-008 | strict-validate 016/003 packet | exit 0 |
| REQ-009 | npm run build clean | exit 0 |


<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- A user can call `embedder_set({name: "mxbai-embed-large-v1"})` and the system handles everything
- Re-index doesn't block the MCP server (background)
- Crash mid-re-index resumes cleanly on next MCP start
- Old vec table stays queryable until swap-over


<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Risk: long-running re-index blocks event loop → mitigate by chunking + setImmediate yields
- Risk: crash mid-swap leaves inconsistent active pointer → mitigate via two-phase commit (write all → flip pointer last)
- Dep: 016/001 + 016/002 must ship first

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Defer to phase parent (`016-embedder-testing-and-architecture/spec.md`) for orchestration-level open questions.
<!-- /ANCHOR:questions -->
