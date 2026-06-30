---
title: "Tasks: GPT Routing Fixes"
description: "Implementation task list for validator-first GPT deep-agent routing hardening."
trigger_phrases:
  - "gpt routing fixes tasks"
  - "validator hardening tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/011-gpt-routing-fixes"
    last_updated_at: "2026-06-30T10:05:30Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Created implementation task plan"
    next_safe_action: "Start T001 with baseline test inventory"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-gpt-routing-fixes-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Implement research/review status enum first; defer context/council."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: GPT Routing Fixes

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Locate current status fixtures and validator callers (`post-dispatch-validate.vitest.ts`, `review-depth-validator.vitest.ts`, deep YAML assets)
- [ ] T002 Capture baseline targeted test results before changing behavior
- [ ] T003 [P] Confirm deep-context and deep-ai-council status shapes remain outside first-patch scope
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add allowed research/review iteration status set (`post-dispatch-validate.ts`)
- [ ] T005 Add `jsonl_invalid_status` failure reason or equivalent diagnostic (`post-dispatch-validate.ts`)
- [ ] T006 Enforce status membership after missing-field validation and before delta validation (`post-dispatch-validate.ts`)
- [ ] T007 Update stale `continue` fixtures to canonical statuses or explicitly isolate them if non-iteration records (`post-dispatch-validate.vitest.ts`, `review-depth-validator.vitest.ts`)
- [ ] T008 [P] Update research/review YAML failure-reason references if needed (`deep_research_auto.yaml`, `deep_review_auto.yaml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run targeted unit tests for post-dispatch validation
- [ ] T010 Run relevant integration test for review-depth validation if touched
- [ ] T011 Run spec validation for `011-gpt-routing-fixes`
- [ ] T012 Update checklist and implementation summary with exact evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks completed or implementation halted with a documented blocker
- [ ] No `[B]` blocked tasks remaining
- [ ] Tests and spec validation evidence recorded in `checklist.md` and `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: See `../010-gpt-deep-agent-routing/research/research.md`
<!-- /ANCHOR:cross-refs -->
