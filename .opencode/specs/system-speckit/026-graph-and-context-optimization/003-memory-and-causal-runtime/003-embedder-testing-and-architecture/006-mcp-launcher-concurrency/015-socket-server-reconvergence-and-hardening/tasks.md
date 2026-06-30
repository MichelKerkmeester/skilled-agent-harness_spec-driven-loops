---
title: "Tasks: socket-server reconvergence + hardening"
description: "Task list for the spec-memory hardening + 3-copy consolidation + tests (Opus implement + review)."
trigger_phrases:
  - "socket-server reconvergence tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening"
    last_updated_at: "2026-06-04T22:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete + reviewed (GO)"
    next_safe_action: "Activates on daemon restart"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts"
---
# Tasks: socket-server reconvergence + hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` pending. Implemented by an Opus implementation sub-agent; independently verified by an Opus review sub-agent + the orchestrator's first-hand re-run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load sk-code; read the race-safe reference copies (code-index/advisor), the spec-memory target, and research.md (027 §7/§8/§12).
- [x] T002 Confirm consolidation feasibility per package (advisor has `@spec-kit/shared`; code-index does not).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create canonical `@spec-kit/shared/ipc/socket-server.ts` (race-safe fence + dir-ownership hardening + TCP retry + inlined containment + `McpServerLike` type).
- [x] T004 [REQ-001] spec-memory `socket-server.ts` → re-export the shared module (levels it UP).
- [x] T005 [REQ-002] advisor `socket-server.ts` → re-export the shared module.
- [x] T006 [REQ-002] code-index `socket-server.ts` → byte-identical local copy (fallback; no `@spec-kit/shared` dep).
- [x] T007 [REQ-002] Add `ipc-socket-drift.vitest.ts` (fails on code-index divergence).
- [x] T008 [REQ-004] Add `ipc-socket-toctou.vitest.ts` (real EADDRINUSE→reclaim + ENOENT survivor).
- [x] T009 [REQ-004] Add `model-server-demand-probe.vitest.ts` (probe-no-spawn + no-marker-spawns).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [REQ-004] Build shared + code-index + advisor + spec-kit mcp_server — all exit 0.
- [x] T011 [REQ-004] New tests pass (toctou 2, drift 1, probe 3); orchestrator re-ran first-hand (5 + 3 passed).
- [x] T012 [REQ-003] Independent Opus review: security fence preserved (net hardening for spec-memory), GO, zero P0/P1.
- [x] T013 Comment hygiene zero violations (7 .ts); scope clean (no deletions; allowed paths only); pre-existing macOS EINVAL + advisor-embeddings failures confirmed unrelated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] spec-memory levelled up to the hardened race-safe contract.
- [x] Drift stopped (shared import for 2; byte-identical + drift-check for code-index).
- [x] Builds + new tests green; independent review GO.
- [ ] Live activation confirmed (pending daemon restart — outside this session's control).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor fix: `014-launcher-overlap-spawn-and-bridge-fix`.
- Research + design: `003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation/research/research.md`.
- Original bridge: `012-daemon-bridge-socket-for-skill-advisor-and-code-index` (deferred D-001 consolidation, addressed here).
<!-- /ANCHOR:cross-refs -->
