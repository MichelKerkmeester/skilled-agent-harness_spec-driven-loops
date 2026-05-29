---
title: "Tasks: Live validation + bench + perimeter hardening"
description: "Implementation task tracker for the live two-launcher integration test that gates the advisor flag flip to default ON, the q8-vs-fp16 bench, default-off idle eviction, socket-dir ownership + sun_path guard, and staged deprecated-env removal."
trigger_phrases:
  - "live validation bench hardening tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 task tracker for live validation + bench + perimeter hardening"
    next_safe_action: "Implement phase 005"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003153"
      session_id: "031-005-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Live validation + bench + perimeter hardening

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
- [ ] T001 Confirm predecessor handoff criteria from 004-perf-instrumentation-batching
- [ ] T002 Determine whether this environment can run a live daemon + model download (else ship runnable scripts + gated code) [REQ-007]
- [ ] T003 [P] Inventory `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, `DEFAULT_DTYPE`, `sun_path`, `RERANKER_CANONICAL`, EADDRINUSE reclaim
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Add the live two-launcher integration test (spawn→bind, EADDRINUSE/wx races, SIGKILL reclaim, 404 contract) (mcp_server/tests/embedders/*live-two-launcher*.vitest.ts) [REQ-001]
- [ ] T005 Harden the socket perimeter (fstat uid-owned, reject symlinks, assert ownership before reclaim, sun_path > 104 fail-fast) (.opencode/bin/lib/model-server-supervision.cjs) [REQ-003]
- [ ] T006 Add default-off idle eviction gated on `lastSuccessfulEmbedAt`; keep demand re-arm lazy (.opencode/bin/hf-model-server.cjs) [REQ-004]
- [ ] T007 Stage deprecated-env removal (`SPECKIT_EMBEDDER_SIDECAR_*` now, `_EXECUTION` warn-once one release, dead `RERANKER_CANONICAL`) (ENV_REFERENCE.md, shared/embeddings/registry.ts) [REQ-005]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T008 Run the q8-vs-fp16 + MPS/CPU bench; make dtype device-aware only if fp16/MPS wins (bench scripts, .opencode/bin/hf-model-server.cjs) [REQ-006]
- [ ] T009 Flip `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` to default ON once the live test is green (.opencode/bin/mk-skill-advisor-launcher.cjs) [REQ-002]
- [ ] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P0 tasks complete
- [ ] No `[B]` blocked tasks remaining
- [ ] The live test passes (or ships as a runnable script with status reported); the flag flip is gated on green; no successor (final phase)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
