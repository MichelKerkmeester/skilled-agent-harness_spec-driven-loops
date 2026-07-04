---
title: "Tasks: Route-Proof Validation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "route-proof validation"
  - "deep dispatch validator"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/002-route-proof-validation"
    last_updated_at: "2026-06-30T19:40:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Completed phase implementation and validation tasks"
    next_safe_action: "Proceed to phase 002-agent-dispatch-hardening"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-001-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Route-Proof Validation

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

- [x] T001 Identify route-proof validator surface (`.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`).
- [x] T002 Identify workflow contracts for research, review, context, and council (`.opencode/commands/deep/assets/deep_*_auto.yaml`).
- [x] T003 Record prior-research citation boundary (`decision-record.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add route-proof validator fields to `deep_research_auto.yaml:940-968` and the research prompt pack.
- [x] T005 Mirror route-proof fields in review/context/council validators and writers.
- [x] T006 Add route-proof enforcement and failure reasons to `validateIterationOutputs`.
- [x] T007 Add wrong-mode state-log and delta rejection tests.
- [x] T008 Correct `ai-council.md` mode claim in `research-prompt.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run targeted validator tests: `npm test -- post-dispatch-validate.vitest.ts` passed 30 tests.
- [x] T010 Run runtime typecheck: `npm run typecheck` passed.
- [x] T011 Run static checks: alignment drift passed and comment hygiene passed with `python3` invocation.
- [x] T012 Run `validate.sh --strict` successfully for this phase; evidence: strict validation passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Wrong-mode validator test passed.
- [x] Strict spec validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision Record**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->

---
