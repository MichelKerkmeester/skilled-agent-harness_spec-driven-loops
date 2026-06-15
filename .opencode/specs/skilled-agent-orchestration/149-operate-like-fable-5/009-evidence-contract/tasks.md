---
title: "Tasks: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/009-evidence-contract"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-evidence-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Define the five fields and allowed values (`.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts`). Verify: `grep -n "claim_class\|would_confirm\|gate_delta\|scope_state\|child_result_verified"` returns all five.
- [ ] T002 Implement and export `validateEvidenceContract` returning present / absent / malformed plus field detail (`.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts`). Verify: TypeScript type-check passes.
- [ ] T003 [P] Write present / absent / malformed unit cases (`.opencode/skills/deep-loop-runtime/tests/unit/evidence-contract.vitest.ts`). Verify: `vitest` green.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Import and call `validateEvidenceContract` in the iteration/agent validation path (`.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`). Verify: malformed metadata produces a `PostDispatchAdvisory`.
- [ ] T005 Map a `malformed` result to advisory `warnings`, introducing no new `PostDispatchFailureReason` (`.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`). Verify: `grep` confirms no new failure reason added.
- [ ] T006 Add a warn-not-fail case for malformed evidence (`.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts`). Verify: `result.ok === true` with a populated `warnings` array.
- [ ] T007 Add an absent-stays-green regression case (`.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts`). Verify: `result.ok === true` with no evidence warning.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add the `AGENT_IO_EVIDENCE v1` optional group with the five fields and the absence-never-blocks rule (`.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`). Verify: doc grep shows the new group.
- [ ] T009 Run the full `vitest` suite for `evidence-contract` and `post-dispatch-validate`. Verify: all suites green.
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`. Verify: exit 0.
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

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

