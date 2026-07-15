---
title: "Tasks: Search Append-Exempt Serializer + True-Citation Density Probe"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "append-exempt tasks"
  - "density probe tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/007-graduation-follow-ups/001-search-append-citation-probe"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored tasks"
    next_safe_action: "Run cli test pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Search Append-Exempt Serializer + True-Citation Density Probe

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

- [x] T001 Locate the response-serialization token-budget trim (context-server.ts after-tool callback)
- [x] T002 Confirm the append markers `source`/`sources` reach the formatter unmodified
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `appendExempt` to FormattedSearchResult + `isTailAppendedRow` detection (formatters/search-results.ts)
- [x] T004 Stamp `appendExempt: true` only on tail-appended rows; absent otherwise (formatters/search-results.ts)
- [x] T005 Add `selectBudgetTrimIndex` pure helper (context-server.ts)
- [x] T006 Rewire the trim loop to drop non-exempt rows first via `selectBudgetTrimIndex` (context-server.ts)
- [x] T007 Add `RERANKER_TRAINING_MIN_PAIRS` + `probeTrueCitationDensity` (lib/feedback/true-citation-emitter.ts)
- [x] T008 Surface the probe in `memory_health`, gated behind the emitter flag + non-null DB (handlers/memory-crud-health.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Author append-exempt tests: marking, trim selection, survival (tests/append-exempt-serializer.vitest.ts)
- [x] T010 Author density-probe tests: zero density + above threshold + null-session exclusion (tests/true-citation-emitter.vitest.ts)
- [x] T011 tsc clean over the pre-existing tsconfig baseline (no new errors)
- [ ] T012 cli executor runs the vitest pass over both suites
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [ ] cli executor test pass green (T012)
- [x] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
