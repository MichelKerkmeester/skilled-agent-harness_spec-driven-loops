---
title: "Tasks: Spec Memory Runtime Retention Cleanup"
description: "File-scoped task list for Spec Kit Memory runtime retention cleanup."
trigger_phrases:
  - "spec-memory-runtime-retention-cleanup"
  - "memory leak 9"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup"
    last_updated_at: "2026-05-22T14:12:07Z"
    last_updated_by: "codex"
    recent_action: "planned-file-scoped-runtime-retention-tasks"
    next_safe_action: "implement-bounded-runtime-retention"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0909090909090909090909090909090909090909090909090909090909090909"
      session_id: "009-memory-leak-remediation-009"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Task list follows the operator-supplied T001-T018 execution contract."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Spec Memory Runtime Retention Cleanup

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

- [ ] T001 [P] Add `BoundedMap` and `TtlMap` helpers with max-size LRU and lazy TTL eviction (`.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts`).
- [ ] T002 [P] Add process-wide timer registry helpers (`.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts`).
- [ ] T003 [P] Add bounded shutdown hook registry with per-hook timeout (`.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts`).
- [ ] T004 [P] Add audit rotation helper with max bytes and retained-file cap (`.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts`).
- [ ] T005 Audit existing memory/search/routing/session/queue paths for unbounded `new Map()` and `new Set()` retention; replace with `BoundedMap` or explicit caps where entries outlive a request (`mcp_server/lib/**`).
- [ ] T006 Audit timer usage and route long-lived timers through `timer-registry` (`mcp_server/lib/**`, `mcp_server/context-server.ts`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Extend retry retention with pending count cap, max age, and abort-on-shutdown (`.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`).
- [ ] T008 Harden embedder sidecar spawn/calls with timeout, env allowlist, and parent-death behavior (`.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`).
- [ ] T009 [P] Add bounded-cache Vitest coverage for LRU, TTL, and repeated set safety (`.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/bounded-cache.vitest.ts`).
- [ ] T010 [P] Add timer-registry Vitest coverage for register, clear, and isolation (`.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/timer-registry.vitest.ts`).
- [ ] T011 [P] Add shutdown-hooks Vitest coverage for registration, run order, errors, and per-hook timeout (`.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/shutdown-hooks.vitest.ts`).
- [ ] T012 [P] Add audit-rotation Vitest coverage for threshold rotation and max retained files (`.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/audit-rotation.vitest.ts`).
- [ ] T013 [P] Add embedder sidecar hardening Vitest coverage for timeout, env allowlist, and parent-death detection (`.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`).
- [ ] T014 [P] Add retry retention Vitest coverage for pending cap, max age, and shutdown abort (`.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts`).
- [ ] T015 Add stress-style save/search/index workload fixture proving bounded pending-job retention, lease cleanup, timer shutdown, and audit rotation (`.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run targeted Vitest, typecheck, build, and OpenCode alignment drift verification (`.opencode/skills/system-spec-kit/`).
- [ ] T017 Fill `implementation-summary.md` with Completed date, decisions, verification evidence, limitations, and commit handoff (`.opencode/specs/.../009-spec-memory-runtime-retention-cleanup/implementation-summary.md`).
- [ ] T018 Run strict validation for the phase and parent arc, then update parent phase map 009 to Completed and parent continuity to 90 percent (`.opencode/specs/.../009-memory-leak-remediation/spec.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 and REQ-002 are satisfied, with B5 evidence restoring parent-death and timeout-kill fixture validity.
- [x] SC-001 fixtures exist as real tests, not prose-only handoff notes; B5 adds save/search/index workload call counts plus cap assertions.
- [ ] All new and touched-surface tests pass, or unchanged-surface baseline failures are HEAD-verified and documented.
- [ ] Phase and arc `validate.sh --strict` commands exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Remediation map item #14**: `../001-research-synthesis-and-remediation-map/research/remediation-map.md`
- **Source packet 020**: `../001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/research.md`
- **Phase 004 patterns**: `../004-deep-loop-locks-state-and-recovery/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
