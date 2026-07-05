---
title: "Tasks: Anchor-Ownership and Injected-Question Conflict Merge ADR"
description: "Completed task ledger for reducer-owned question conflict resolution and event attribution."
trigger_phrases:
  - "anchor ownership conflict"
  - "injected question conflict ADR"
  - "question conflict event"
  - "reduce state sole renderer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_reducer_registry.md"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Anchor-Ownership and Injected-Question Conflict Merge ADR

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

- [x] T001 Read the completed spec and confirm leaf 004 dependency (`spec.md`).
- [x] T002 Identify the reducer, registry, strategy, and YAML surfaces.
- [x] T003 [P] Confirm inbox schema changes are out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement `resolveQuestionConflicts()` (`reduce-state.cjs`).
- [x] T005 Render `key-questions` from canonical registry state (`reduce-state.cjs`).
- [x] T006 Record operator decisions as `accepted`, `rejected`, `superseded`, or `needs_decision`.
- [x] T007 Emit `question_conflict` event records with inbox and registry values.
- [x] T008 Document ownership in the state reducer registry (`state_reducer_registry.md`).
- [x] T009 Mark `key-questions` as generated in the strategy doc (`deep_research_strategy.md`).
- [x] T010 Add conflict-event workflow wiring (`deep_research_auto.yaml`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify disagreement emits `question_conflict` instead of silent overwrite.
- [x] T012 Verify the generated projection is rendered from registry state.
- [x] T013 Verify direct manual edits follow the leaf 004 legacy import path.
- [x] T014 Update plan and task docs to reflect the completed conflict work (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
