---
title: "Tasks: Selector fix + shared socket + client resilience"
description: "Implementation task tracker for swapping the hf-local selector probe to /api/health, deleting the Python import probe and docs, pinning a shared HF_EMBED_SERVER_URL, retrying ECONNRESET/EPIPE, and an actionable readiness-timeout."
trigger_phrases:
  - "selector shared socket tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/001-selector-and-shared-socket"
    last_updated_at: "2026-05-29T15:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete; selector + socket + resilience shipped; review fixes applied; 38 tests green"
    next_safe_action: "Phase 002: server-liveness & supervision hardening"
    blockers: []
    key_files:
      - "shared/embeddings/auto-select.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003113"
      session_id: "031-001-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Selector fix + shared socket + client resilience

<!-- SPECKIT_LEVEL: 1 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirm this is the foundation phase (Predecessor: None)
- [x] T002 Inventory `probeHfLocal`, `defaultPythonImportProbe`, `runPythonImportProbe`, `HF_EMBED_SERVER_URL`, `isRetryableReadinessError`
- [x] T003 [P] Identify focused auto-select + hf-local tests to add or migrate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Rewrite `probeHfLocal` to call `HfLocalProvider.canLoad` (`/api/health`) (shared/embeddings/auto-select.ts) [REQ-001]
- [x] T005 Delete `defaultPythonImportProbe`, the `runPythonImportProbe` option, and the `ProbeContext` field; update cascade comment (shared/embeddings/auto-select.ts) [REQ-002]
- [x] T006 Pin `HF_EMBED_SERVER_URL` in both env blocks of all 5 runtime configs (.claude/mcp.json, opencode.json, .gemini/settings.json, .codex/config.toml, .vscode/mcp.json) [REQ-003]
- [x] T007 Add `ECONNRESET`/`EPIPE` to `isRetryableReadinessError` (shared/embeddings/providers/hf-local.ts) [REQ-004]
- [x] T008 Branch the `waitForReady` final throw on the last observed state (shared/embeddings/providers/hf-local.ts) [REQ-005]
- [x] T011 Bounded embed-POST retry on transient resets so a mid-request reap retries instead of tripping the breaker (review fix, hf-local.ts) [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Fix stale Python/sentence-transformers selector docs (INSTALL_GUIDE.md, embedder_architecture.md, both config notes) [REQ-006]
- [x] T010 Confirm the pinned socket path stays under the macOS `sun_path` limit and resolves first [REQ-007]
- [x] T012 Add regression tests: reset retry (readiness + embed-POST), sawLoading + unreachable timeout messages (review fix) [REQ-004/005]
- [x] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P0 tasks complete
- [x] No `[B]` blocked tasks remaining
- [x] Focused phase tests/static checks are green and successor handoff (002) is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
