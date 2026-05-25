---
title: "Tasks: 120 DR-006 fix"
description: "Single-file numeric sort fix + regression test."
trigger_phrases:
  - "120 tasks"
importance_tier: "important"
contextType: "fix"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix"
    last_updated_at: "2026-05-23T05:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks complete."
    next_safe_action: "Commit + push."
    blockers: []
    session_dedup:
      fingerprint: "sha256:1201201201201201201201201201201201201201201201201201201201200002"
      session_id: "116-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 120 — DR-006 Numeric Sort Fix

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Done |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Locate bug at `.opencode/skills/deep-research/scripts/reduce-state.cjs:874`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Replace `.sort()` with numeric comparator
- [x] T003 Add DR-006 regression test in `deep-research-reducer.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 `vitest -t "DR-006"` PASS (1 passed, 5 skipped via filter)
- [x] T005 strict-validate PASS
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P1 tasks complete
- [x] Test PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- 119 source: `../004-deep-research/003-uplift-recommendations/uplift-roadmap.md`
<!-- /ANCHOR:cross-refs -->
