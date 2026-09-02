---
title: "Tasks: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them

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

- [ ] T001 Capture the failing baseline: the five `dispatch_failure` records and the reverted operator edit, so the fix has a negative control (lineage artifact directory)
- [ ] T002 Confirm the runtime toolchain is live before any stream edits code: `npm run typecheck` and `npm test` both run green (`.opencode/skills/system-deep-loop/runtime`)
- [ ] T003 [P] Assign the four streams their disjoint file sets and record the boundary, so two streams never open the same file (this packet)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Stream 1: add an in-process execution directive to `buildLoopPrompt` covering every CLI lineage kind (`runtime/scripts/fanout-run.cjs`)
- [ ] T005 [P] Stream 1: write the directive guard test that iterates the supported lineage kinds (`runtime/tests/fanout-loop-prompt-in-process.test.ts`)
- [ ] T006 [P] Stream 2: add the pre-dispatch in-process rule to the cli-codex executor step (`.opencode/commands/deep/assets/deep-research-auto.yaml`)
- [ ] T007 [P] Stream 2: mirror that rule in the review workflow, keeping both steps identical (`.opencode/commands/deep/assets/deep-review-auto.yaml`)
- [ ] T008 [P] Stream 2: add the pre-spawn refusal inside the embedded node script of both codex steps (both auto YAMLs)
- [ ] T009 [P] Stream 2: make the recursion guard refuse a nested cli-codex dispatch before spawn, deciding from the dispatch stack rather than the session id alone (`runtime/lib/deep-loop/executor-audit.ts`)
- [ ] T010 [P] Stream 2: cover refuse, top-level allow and stale-session rows (`runtime/tests/unit/executor-audit.vitest.ts`)
- [ ] T011 [P] Stream 3: write the reverted diff to `<artifactDir>/containment-reverted/<iteration>-<timestamp>.patch` before any revert (`runtime/lib/deep-loop/write-containment.ts`)
- [ ] T012 [P] Stream 3: add `revertedPatchPath` to the `containment_violation` event and `recoveryHint` to the returned result (`runtime/lib/deep-loop/write-containment.ts`)
- [ ] T013 [P] Stream 4: add the executor rule and the containment rule to the three documents that a lineage author reads (`cli-codex/SKILL.md`, `deep-research/references/protocol/loop-protocol.md`, `system-deep-loop/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Stream 3: prove recovery with a `git apply` round trip in a temporary repository, not a string assertion (`runtime/tests/unit/write-containment.vitest.ts`)
- [ ] T015 Parse both auto YAMLs and confirm the codex step still fails closed when the binary is absent (both auto YAMLs)
- [ ] T016 Run the authoritative gate once, after all four streams land: full `npm test` plus `npm run typecheck` (`.opencode/skills/system-deep-loop/runtime`)
- [ ] T017 Re-run a short cli-codex lineage and confirm zero nested `codex exec` processes and zero `dispatch_failure` records (lineage artifact directory)
- [ ] T018 Run `validate.sh` on this packet with `--strict` and require `RESULT: PASSED` with Errors: 0 (this packet)

### Stream verification map

| Stream | Owns | Targeted check | Requirements |
|--------|------|----------------|--------------|
| 1 Prompt directive | `fanout-run.cjs` | `vitest run tests/fanout-loop-prompt-in-process.test.ts` | REQ-001 |
| 2 YAML rule and guard | both auto YAMLs, `executor-audit.ts` | `vitest run tests/unit/executor-audit.vitest.ts` plus a YAML parse | REQ-002, REQ-003 |
| 3 Containment patch | `write-containment.ts` | `vitest run tests/unit/write-containment.vitest.ts` | REQ-004, REQ-005, REQ-008 |
| 4 Docs | three markdown documents | Read each file and confirm both rules appear | REQ-007 |
| All | runtime package | Full `npm test` plus `npm run typecheck`, run once by the orchestrator | REQ-006 |
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
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---
