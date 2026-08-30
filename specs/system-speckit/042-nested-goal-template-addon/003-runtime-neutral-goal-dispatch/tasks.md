---
title: "Tasks: Runtime-Neutral Goal Dispatch"
description: "Make the speckit goal offer dispatch by runtime instead of calling one runtime's tool, and make the stale-filename assertion path-specific so a spec document named goal.md stops colliding with it."
trigger_phrases:
  - "runtime neutral goal"
  - "goal offer dispatch"
  - "stale filename assertion"
  - "goal_prompt_choice"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/003-runtime-neutral-goal-dispatch"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the dispatch table and tighten the assertion"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/"
    session_dedup:
      fingerprint: "sha256:d2aa2ddf48e227fedcc7cc3116dd7d1b26bd9fd5726110ade536b1984bda287a"
      session_id: "2026-08-29-042-003-runtime-neutral-goal-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The offer stays tool-free; only the set action dispatches, and it dispatches per runtime"
---

# Tasks: Runtime-Neutral Goal Dispatch

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

- [x] T001 Read the current goal contract across the command assets and its test - `.opencode/commands/speckit/assets/speckit-{plan,implement,complete}-{auto,confirm}.yaml` and `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`
- [x] T002 Establish which runtimes have a goal surface and which document its absence - the core is runtime-neutral (`.opencode/hooks/goal/lib/goal-core.cjs:50`), so the surfaces are enumerated in `dispatch_by_runtime`
- [x] T003 Capture the current contract test result as a baseline - contract test baseline captured at 4 passing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the runtime dispatch table for the set action - `dispatch_by_runtime` in six workflow assets
- [x] T005 Keep the offer path tool-free and confirm it stays that way - offer and skip name no tool in `speckit-plan-auto.yaml` `set_mutation`
- [x] T006 Narrow the stale-filename assertion to the command path it guards - `staleCommandRef` regex in `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`
- [x] T007 Keep the carried objective pointer-sized in the contract wording - `objective_shape` in `.opencode/commands/speckit/assets/speckit-complete-auto.yaml`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the contract test with a command file that names the goal document - `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` 4/4, control A exits 0
- [x] T009 Confirm a real stale command reference still fails the narrowed assertion - control B against `staleCommandRef` exits 1 (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`)
- [x] T010 Confirm no runtime gained a fabricated adapter - `status_tool_by_runtime` in the six `.opencode/commands/speckit/assets/*.yaml` names only existing surfaces
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
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 0 | 0/0 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet
<!-- /ANCHOR:summary -->

---



