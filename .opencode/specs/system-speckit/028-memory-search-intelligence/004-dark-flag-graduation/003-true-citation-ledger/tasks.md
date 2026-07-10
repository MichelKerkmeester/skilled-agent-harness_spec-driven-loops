---
title: "Tasks: True-Citation Ledger Density Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger feasibility tasks"
  - "session scoped firing trigger ceiling"
  - "bare integer reference hit rate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-dark-flag-graduation/003-true-citation-ledger"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and documentation tasks, run complete"
    next_safe_action: "Author the results docs"
    blockers: []
    key_files:
      - "scripts/citation-ledger-feasibility.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: True-Citation Ledger Density Benchmark

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Resolve the live database path from the server config and confirm it exists (`scripts/citation-ledger-feasibility.mjs`)
- [x] T002 [P] Read the emitter, the feedback ledger, and the search handler to confirm how `search_shown` carries queryId and sessionId (`handlers/memory-search.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Build the read-only ledger-structure measurement over the live `search_shown` corpus (`scripts/citation-ledger-feasibility.mjs`)
- [x] T004 Build the firing-trigger reachability measurement as the session-scoped shown count (`scripts/citation-ledger-feasibility.mjs`)
- [x] T005 Build the scratch replay that seeds a session-scoped shown set and reads back the used-versus-unused split (`scripts/citation-ledger-feasibility.mjs`)
- [x] T006 Build the reference-realism scan over recent transcripts with the digit-length collision buckets (`scripts/citation-ledger-feasibility.mjs`)
- [x] T007 Run the harness and write `results/metrics.json` (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the flag-off emit is a no-op that returns zeros and does not create the shadow table (`scripts/citation-ledger-feasibility.mjs`)
- [x] T009 Confirm the live `true_citation_events` table is absent after the run (`results/metrics.json`)
- [x] T010 Author the data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T011 Author the REFINE verdict and the firing-trigger refinement design (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
