---
title: "Tasks: Injection Inbox and Question Provenance Attribution"
description: "Completed task ledger for the research inbox schema and question-origin propagation work."
trigger_phrases:
  - "injection inbox provenance"
  - "research inbox jsonl"
  - "question attribution badges"
  - "origin tracking open questions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/004-injection-inbox-provenance"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Injection Inbox and Question Provenance Attribution

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

- [x] T001 Read the completed spec and capture the six inbox provenance fields (`spec.md`).
- [x] T002 Identify reducer and strategy-doc surfaces (`reduce-state.cjs`, `deep_research_strategy.md`).
- [x] T003 [P] Leave question-conflict resolution to leaf 005 (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define `research/inbox.jsonl` schema with `id`, `text`, `source`, `origin`, `injectedAtIteration`, and `promotedQuestionId`.
- [x] T005 Add inbox reading on each reducer step (`reduce-state.cjs`).
- [x] T006 Propagate origin metadata into `openQuestions` and `resolvedQuestions` (`reduce-state.cjs`).
- [x] T007 Render attribution badges per open question from origin.
- [x] T008 Document inbox as the canonical injection surface (`deep_research_strategy.md`).
- [x] T009 Preserve direct markdown edits as `origin:"legacy-import"` with a warning.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify an `angle-bank` inbox record appears in `openQuestions` with matching origin.
- [x] T011 Verify a direct markdown edit imports as `legacy-import` without throwing.
- [x] T012 Verify dashboard output includes attribution badges.
- [x] T013 Update plan and task docs to reflect the completed inbox work (`plan.md`, `tasks.md`).
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
