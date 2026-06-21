---
title: "Tasks: Shared Safe-Fix Engine [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared safe-fix engine"
  - "detector registry"
  - "fixClass allow-list"
  - "dq-engine runDetectors"
  - "content_hash idempotency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/026-shared-safe-fix-engine"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown for the engine build"
    next_safe_action: "Author checklist for the engine build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Shared Safe-Fix Engine

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

- [ ] T001 Resolve the dq script directory location alongside the existing validation scripts (.opencode/skills/system-spec-kit/scripts/dq/)
- [ ] T002 Confirm the shipped scorers are importable (quality-loop.ts computeMemoryQualityScore, post-save-review.ts reviewPostSaveQuality)
- [ ] T003 [P] Stand up a dirty scratch fixture with a mixed safe, risky and none defect set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the single-source-of-truth registry with per-detector {id, surface, detect, fixClass, fix}, deny-by-default (.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts)
- [ ] T005 Seed the frozen safe-class allow-list (desc.shape, enum.tier_status_ctype, triggers.propagate, hvr.style, anchor.unclosed) (.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts)
- [ ] T006 Build the pure runDetectors returning {issues, applied, skipped}, report mode writes nothing (.opencode/skills/system-spec-kit/scripts/dq/dq-engine.ts)
- [ ] T007 Add the apply path running fix() only for opts.allowFixClass detectors behind content_hash idempotency and atomic writes (.opencode/skills/system-spec-kit/scripts/dq/dq-engine.ts)
- [ ] T008 Encode INV-1 and INV-2 mechanically and make the allow-list edit a guarded-class change that re-checks them (.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Report run over a dirty fixture returns populated issues, an empty applied set and a clean working tree
- [ ] T010 Apply run with allowFixClass ['safe'] mutates only safe targets and records risky and none in skipped, plus edge cases (unrecognized surface, empty allowFixClass, detect throw, fix throw, scorer signature drift)
- [ ] T011 Update documentation (spec/plan/tasks/checklist)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
