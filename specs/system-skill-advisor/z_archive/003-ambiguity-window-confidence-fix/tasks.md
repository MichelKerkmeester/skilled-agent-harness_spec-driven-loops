---
title: "Tasks: Ambiguity Window Confidence Fix"
description: "Single-issue tasks to widen scorer ambiguity to dual-margin (score OR confidence within 0.05)."
trigger_phrases:
  - "ambiguity tasks"
  - "SAD-002 fix tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/003-ambiguity-window-confidence-fix"
    last_updated_at: "2026-05-06T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Begin T002 (patch ambiguity.ts)"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-084"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Ambiguity Window Confidence Fix

<!-- SPECKIT_LEVEL: 1 -->
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

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold spec folder

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Patch `lib/scorer/ambiguity.ts` (add `AMBIGUITY_CONFIDENCE_MARGIN`, OR predicate)
- [x] T003 [P] Update `tests/scorer/native-scorer.vitest.ts` outside-margin fixture
- [x] T004 [P] Update `tests/scorer/advisor-quality-049-003.vitest.ts` F-012-C2-04 fixtures + add new SAD-002 test
- [x] T005 [P] Update `feature_catalog/04--scorer-fusion/03-ambiguity.md` to dual-margin language

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Build MCP server
- [x] T007 Run vitest on `native-scorer.vitest.ts` and `advisor-quality-049-003.vitest.ts`
- [x] T008 Run vitest on broader scorer directory for regression catch
- [x] T009 advisor_rebuild --force, then advisor_recommend with SAD-002 prompt — confirm `ambiguous: true`
- [x] T010 advisor_recommend with SAD-001 prompt — confirm `ambiguous: false` (single-winner case)
- [x] T011 Run `validate.sh --strict` on the spec folder
- [x] T012 Write implementation-summary.md and save via generate-context.js

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] vitest pass on both focused suites
- [x] SAD-002 re-run reports `ambiguous: true`

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
