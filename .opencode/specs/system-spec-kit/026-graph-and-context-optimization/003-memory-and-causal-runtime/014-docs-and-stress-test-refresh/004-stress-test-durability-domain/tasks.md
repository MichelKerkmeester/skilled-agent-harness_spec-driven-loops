---
title: "Tasks: Durability Stress Domain"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "durability stress tasks"
  - "checkpoint contention stress tasks"
  - "index scan coalescing stress tasks"
  - "stress durability script tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored durability stress domain (4 cases) + stress:durability script"
    next_safe_action: "None binding; durability domain green (12/12)"
    blockers: []
    key_files:
      - "mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts"
      - "mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - "mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "durability-stress-domain-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Durability Stress Domain

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

**Phase 1 - Scaffold + checkpoint/enrichment cases**.

- [x] T001 Create the `mcp_server/stress_test/durability/` directory (mcp_server/stress_test/durability/)
- [x] T002 Author the domain README (overview, scope table, run recipe, isolation boundary) (mcp_server/stress_test/durability/README.md)
- [x] T003 [P] Author the checkpoint-v2 contention case: interleaved create+restore round-trips against a `mkdtemp` DB via an in-process `reopen` (mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts)
- [x] T004 Assert lossless round-trips, bounded on-disk snapshot set, and no orphaned snapshot/`.tmp-` dirs in the contention case (mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts)
- [x] T005 Assert the `E_RESTORE_IN_PROGRESS` barrier is observable during the swap window and clears after (mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts)
- [x] T006 [P] Author the enrichment-marker backfill case: a save flood of `pending` markers drained via `repairIncompleteMarkers` against a `:memory:` DB (mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts)
- [x] T007 Assert markers converge to `complete`, the incomplete set drains to zero, each row repaired once, and bounded per-pass work (mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2 - index-scan + recycle cases**.

- [x] T008 [P] Author the index-scan coalescing case: inject a throwaway DB into `db-state` and fire a concurrent `acquireIndexScanLease` burst (mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts)
- [x] T009 Assert exactly one writer admitted and the rest back off with a structured `lease_active`/`cooldown` reason (mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts)
- [x] T010 Assert cooldown coalescing of immediate re-acquisitions and stale-lease reclaim (mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts)
- [x] T011 [P] Author the daemon-recycle transparency case via the front-proxy `__testing` helpers (mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts)
- [x] T012 Assert replayable reads survive the recycle, unsafe mutations are refused with `-32001`, and the pending set drains with no leak (mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts)
- [x] T013 Assert `-32001` stays the LIVE retryable recycle signal and `-32002` is the terminal protocol-mismatch code (mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase 3 - Script + run**.

- [x] T014 Add the `stress:durability` script mirroring `stress:substrate`/`stress:matrix`/`stress:harness` (mcp_server/package.json)
- [x] T015 Run `npm run stress:durability` and capture pass/fail (mcp_server/)
- [x] T016 Run the durability domain alongside an existing pure-logic domain through the shared config to prove no config breakage (mcp_server/)
- [x] T017 Record the real stress command + result in implementation-summary.md (implementation-summary.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `npm run stress:durability` green (12/12)
- [x] Durability + an existing domain green together (no config breakage)
- [x] `validate.sh --strict` on this packet passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
