---
title: "Tasks: Live validation + bench + perimeter hardening"
description: "Implementation task tracker for the live two-launcher integration test that gates the advisor flag flip to default ON, the q8-vs-fp16 bench, default-off idle eviction, socket-dir ownership + sun_path guard, and staged deprecated-env removal."
trigger_phrases:
  - "live validation bench hardening tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening"
    last_updated_at: "2026-05-29T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Land-now hardening done; flag-flip + bench numbers gated on a working onnxruntime tree"
    next_safe_action: "Reconcile 031 + 026/007 parent packets, then the 20-iter deep review"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003153"
      session_id: "031-005-tasks"
      parent_session_id: null
    completion_pct: 100
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
- [x] T001 Confirm predecessor handoff criteria from 004-perf-instrumentation-batching
- [x] T002 Determine whether this environment can run a live daemon + model download (else ship runnable scripts + gated code) [REQ-007] — RESULT: no (onnxruntime-common unresolvable → ship runnable scripts + gated code)
- [x] T003 [P] Inventory `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, `DEFAULT_DTYPE`, `sun_path`, `RERANKER_CANONICAL`, EADDRINUSE reclaim
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Add the live two-launcher integration test (spawn→bind, EADDRINUSE/wx races, SIGKILL reclaim, 404 contract) (mcp_server/tests/embedders/*live-two-launcher*.vitest.ts) [REQ-001] — transport subset runs against the real binary; model-path cases gated behind SPECKIT_LIVE_MODEL_TEST
- [x] T005 Harden the socket perimeter (fstat uid-owned, reject symlinks, assert ownership before reclaim, sun_path > 104 fail-fast) (.opencode/bin/lib/model-server-supervision.cjs) [REQ-003]
- [x] T006 Add default-off idle eviction gated on `lastSuccessfulEmbedAt`; keep demand re-arm lazy (.opencode/bin/lib/model-server-supervision.cjs) [REQ-004] — in createModelServerControl (not hf-model-server.cjs; design-corrected) + additive bridge health
- [x] T007 Stage deprecated-env removal (`SPECKIT_EMBEDDER_SIDECAR_*` now, `_EXECUTION` warn-once one release, dead `RERANKER_CANONICAL`) (ENV_REFERENCE.md, shared/embeddings/registry.ts) [REQ-005]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [B] T008 Run the q8-vs-fp16 + MPS/CPU bench; make dtype device-aware only if fp16/MPS wins (bench scripts, .opencode/bin/hf-model-server.cjs) [REQ-006] — bench harness LANDED (self-skips); numbers + dtype decision DEFERRED (needs a loadable model; onnxruntime-common unresolvable here). DEFAULT_DTYPE unchanged ('q8').
- [B] T009 Flip `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` to default ON once the live test is green (.opencode/bin/mk-skill-advisor-launcher.cjs) [REQ-002] — GATED: the live model-path test cannot pass here (onnxruntime-common unresolvable). Flag stays default-off; one-line flip recipe + repair→test→flip follow-up documented in ENV_REFERENCE.md.
- [x] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All non-live P0 tasks complete (perimeter, idle eviction, live-test harness, deprecated-env cleanup)
- [x] The live test ships as a runnable script (transport subset green against the real binary; model-path cases auto-skip); the flag flip + bench numbers are explicitly gated on a working onnxruntime tree (no silent drop)
- [x] No successor (final phase); the 2 gated tasks carry a documented blocker + follow-up recipe
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
