---
title: "Tasks: 002 — Semantic Matcher"
description: "T### task list for the semantic matcher sub-phase: pure cosine matcher, cosine precedent reuse, in-memory cache, unit tests."
trigger_phrases:
  - "027 phase 004 semantic matcher tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher"
    last_updated_at: "2026-06-10T10:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed semantic matcher with default-off shadow wiring"
    next_safe_action: "Ready for follow-on shadow evaluation phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 002 — Semantic Matcher

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

**Task Format**: `T### [P?] Description (file path)` • `REQ-NNN` = parent spec requirement
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm cosine + BLOB-to-Float32 precedent (REQ-002b) (`mcp_server/lib/search/memory-summaries.ts`)
  - Evidence: Reused cosine and BLOB-to-Float32 behavior in matcher tests.
- [x] T002 [P] Define `SemanticMatch` shape and gate parameters (`mcp_server/lib/triggers/semantic-trigger-matcher.ts`)
  - Evidence: `SemanticMatch` and threshold/margin/max options compile in `npm run build`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement `matchSemanticTriggers` pure function with threshold/margin/max gates + deterministic ordering (REQ-002a) (`mcp_server/lib/triggers/semantic-trigger-matcher.ts`)
  - Evidence: `tests/semantic-trigger-matcher.vitest.ts` covers gates and ordering.
- [x] T004 Implement in-memory trigger-embedding cache (load-on-first-call, TTL / `--force` invalidation, concurrent-safe) (REQ-002c) (`mcp_server/lib/triggers/semantic-trigger-matcher.ts`)
  - Evidence: Cache load/invalidated refresh test passes; mutation hook clears cache.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Cosine math unit tests against known vectors (REQ-002b) (`mcp_server/tests/semantic-trigger-matcher.vitest.ts`)
  - Evidence: `npx vitest run ...` passed 84 tests across 9 requested files.
- [x] T006 Gate + determinism unit tests (REQ-002a) (`mcp_server/tests/semantic-trigger-matcher.vitest.ts`)
  - Evidence: Threshold, margin, max, and tie-break tests pass.
- [x] T007 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher --strict`
  - Evidence: Strict validation exits 0 after this documentation reconciliation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Cosine + gate + determinism tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
