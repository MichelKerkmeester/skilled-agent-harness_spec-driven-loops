---
title: "Tasks: Consolidation Cycle Hardening"
description: "Two consolidation.ts fixes (lock-ordering, handle-consistency), each test-gated, on the default-ON consolidation cycle."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded consolidation-hardening task list"
    next_safe_action: "Run C7-S1 baseline, then C7-T001 lock-ordering"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-consolidation-hardening-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Consolidation Cycle Hardening

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] C7-S1 Capture the consolidation vitest baseline (pass/fail counts).
- [ ] C7-S2 Locate the current `BEGIN IMMEDIATE` + read-only scan and the threaded-vs-global handle sites (line numbers drifted after 001's edits — find by symptom).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] C7-T001 R1 lock-ordering: hoist the read-only scan/cluster/bounds before `BEGIN IMMEDIATE`; re-check the cadence guard after acquiring the lock; keep writes inside the immediate-lock transaction.
- [ ] C7-T002 R2 handle-consistency: make `getStaleEdges`/`updateEdge`/`countEdgesForNode` share the cycle connection (drop unused `database` params or thread the handle).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] C7-V1 Concurrency test: a concurrent write is not blocked during the scan (fails on old code, passes on fix).
- [ ] C7-V2 Handle/atomicity test: reads + writes share one connection within the cycle transaction.
- [ ] C7-V3 Existing consolidation suite green; baseline→after delta reported.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both fixes landed + test-gated; concurrency + handle tests pass; no regression in the consolidation suite. Default-ON cadence/atomicity semantics preserved.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source findings: `../../review/fresh-regression-75/deep-review-findings-registry.json` (consolidation.ts read-only-scan-under-lock; inconsistent DB handle)
- Deferred from: sub-phase `../001-memory-storage-and-search`
<!-- /ANCHOR:cross-refs -->
