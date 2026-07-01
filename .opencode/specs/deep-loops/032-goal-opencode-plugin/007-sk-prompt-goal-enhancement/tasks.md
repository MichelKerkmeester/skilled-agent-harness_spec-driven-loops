---
title: "Tasks: Phase 7: sk-prompt-goal-enhancement [template:level_1/tasks.md]"
description: "Task list for adding deterministic sk-prompt goal prompt generation to the mk-goal plugin."
trigger_phrases:
  - "goal prompt tasks"
  - "sk-prompt goal enhancement"
  - "mk-goal tests"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement"
    last_updated_at: "2026-06-30T16:45:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Implemented and tested deterministic goal prompt enhancement"
    next_safe_action: "Phase complete; restart OpenCode before relying on the updated plugin in a new session"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
      - ".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:eee15f192aeed0c608ec0c761a43da475043a7855e08c2e1a88f0a2263295916"
      session_id: "goal-sk-prompt-enhancement-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: sk-prompt-goal-enhancement

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

- [x] T001 Create phase folder from Spec Kit templates (`007-sk-prompt-goal-enhancement/`)
- [x] T002 Read `mk-goal.js`, `/goal` command, current phase specs and sk-prompt references (`mk-goal.js`, `goal.md`, `sk-prompt/references/`)
- [x] T003 Fill phase spec, plan and task docs (`spec.md`, `plan.md`, `tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add deterministic prompt generation helpers (`.opencode/plugins/mk-goal.js`) — evidence: `node .opencode/plugins/__tests__/mk-goal-state.test.cjs` PASS
- [x] T005 Store `goalPrompt` and `promptEnhancement` with backward-compatible normalization (`.opencode/plugins/mk-goal.js`) — evidence: `node .opencode/plugins/__tests__/mk-goal-state.test.cjs` PASS
- [x] T006 Render injection from `goalPrompt` and expose prompt metadata in status (`.opencode/plugins/mk-goal.js`) — evidence: `node .opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` PASS
- [x] T007 Update parent phase map and phase implementation summary (`../spec.md`, `implementation-summary.md`) — evidence: phase docs updated
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Update mk-goal state and tool-path tests (`.opencode/plugins/__tests__/mk-goal-state.test.cjs`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs`) — evidence: both tests PASS
- [x] T009 Run all mk-goal plugin tests (`node .opencode/plugins/__tests__/mk-goal-*.test.cjs` individually) — evidence: state, tool-path, export-contract, lifecycle, supervisor and continuation tests PASS
- [x] T010 Run OpenCode alignment and comment-hygiene checks for modified code (`verify_alignment_drift.py`, `check-comment-hygiene.sh`) — evidence: alignment drift PASS; comment hygiene PASS with `python3` entrypoint
- [x] T011 Restamp generated metadata and run strict spec validation (`validate.sh --strict`) — evidence: `validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin --strict` PASS
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence in `implementation-summary.md`.
- [x] No `[B]` blocked tasks remaining.
- [x] mk-goal tests and strict parent validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
