---
title: "Tasks: Fix DeepSeek Long-Retention Advice Consistency [specs/hooks/008-pi-caching-like-reasonix/014-fix-deepseek-compat-snippet-consistency]"
description: "Ordered task list for splitting supportsLongCacheRetention into a verify-first optional in the DeepSeek compat path, with test and provenance updates."
trigger_phrases:
  - "deepseek compat consistency tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/014-fix-deepseek-compat-snippet-consistency"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "All tasks complete and verified (53/53)"
    next_safe_action: "None; work complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-13-pi-caching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fix DeepSeek Long-Retention Advice Consistency

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- **P0** blocker · **P1** required · **P2** optional
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **P0** Map all DeepSeek compat consumers (warning adapter, doctor, compat, fix)
- [x] **P0** Capture green baseline: `tsc --noEmit` clean, `npm test` 51/51
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **P0** Remove `supportsLongCacheRetention` from `describeMissingDeepSeekCompat`
- [x] **P0** Remove it from `buildDeepSeekCompatSuggestion` (snippet + fix write-set)
- [x] **P0** Remove the long-retention line from `appendDeepSeekCompatAdviceLines`
- [x] **P0** Add `describeOptionalDeepSeekCompat` + `appendOptionalDeepSeekCompatAdviceLines`
- [x] **P0** Wire optional into the `doctor` renderer and `buildCompatDiagnosis`
- [x] **P1** Export `describeOptionalDeepSeekCompat` for tests
- [x] **P1** Record the change in `CHANGES-FROM-UPSTREAM.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **P0** Correct the `/cache-optimizer fix` test: pre-existing `false` override survives
- [x] **P0** Add 2 tests locking the required-vs-optional split
- [x] **P0** `tsc --noEmit` clean; `npm test` 53/53
- [x] **P1** Functional check: warning "lacks sendSessionAffinityHeaders", snippet omits long retention, optional reports it
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Long retention is verify-first optional across warning, snippet, fix, doctor, and compat; suite green; provenance recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Summary: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
