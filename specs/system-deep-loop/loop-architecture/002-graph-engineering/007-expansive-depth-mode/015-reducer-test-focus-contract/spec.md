---
title: "Feature Specification: Phase 15: reducer-test-focus-contract"
description: "Three spec-kit CLI deep-research reducer tests still expect the Next Focus chain from before phase 004, which made the leaf's Recommended Next Focus outrank the carried-forward thread. They fail on main and turn the Spec-Kit Check workflow red. This phase aligns the tests with the shipped contract."
trigger_phrases:
  - "reducer test focus contract"
  - "phase 15 reducer test focus contract"
  - "deep-research reducer test next focus"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: reducer-test-focus-contract

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/486-fix-deep-research-reducer-next-focus` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-docs-playbooks-alignment |
| **Successor** | None |
| **Handoff Criteria** | The spec-kit CLI vitest project passes with no failed test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the expansive-depth-mode build. It follows up phase 004 (`../004-focus-hijack-fix/`), whose leaf-first Next Focus rule left three stale tests in a suite that phase did not run.

**Scope Boundary**: the test file `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts` only. The reducer and the continuity helper do not change.

**Dependencies**:
- Phase 004's Next Focus contract (`../004-focus-hijack-fix/spec.md` REQ-002), already on main

**Deliverables**:
- Three updated test cases that pass against the shipped reducer
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 made the research reducer read the leaf's `## Recommended Next Focus` and return it ahead of the carried-forward thread when it is open and unresolved. Three tests in the spec-kit CLI suite still expect the older chain, so the Spec-Kit Check workflow fails on every push to main.

### Purpose
The CLI suite asserts the shipped Next Focus contract, and each test still reaches the branch its name describes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd .opencode/skills/system-spec-kit/runtime/cli
$ npx vitest run --config ../../vitest.config.ts --project cli tests/deep-research-reducer.vitest.ts
     × writes idempotent registry, strategy, and dashboard outputs from iteration state
     × derives next focus from the latest answer when no carried-forward question is present
     × falls back to the first strategy question when no answer can seed next focus
      Tests  3 failed | 10 passed (13)
```
The same command passes 13 of 13 with the reducer and continuity helper checked out at the parent of the phase 004 commit, and fails the same 3 at that commit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the idempotent-output test to expect the leaf recommendation `Question C` as Next Focus.
- Set the second-iteration leaf recommendation in the answer-seeded and first-question fallback tests to the resolved `Question B`, so the reducer skips it and each test reaches its named branch.

### Out of Scope
- The reducer and `continuity-thread.cjs` - the leaf-first rule is the intended contract, not a regression.
- Renaming or adding tests - the three cases keep their names and their other assertions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts` | Modify | Align three Next Focus cases with the leaf-first contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three named reducer tests pass against the unchanged reducer | The reducer test command in Measured Behavior prints `Tests  13 passed (13)` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The answer-seeded and fallback tests keep their original Next Focus assertions | `git diff -U0` of the test file shows exactly one changed `expect(` line, in the idempotent-output case |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full CLI project, run from the workflow's directory, reports 0 failed tests.
- **SC-002**: The commit changes only the test file outside this packet and its parent's phase map.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 contract on main | If it is reverted, the updated idempotent-output case fails | The case comment names the leaf-first rule, so a revert shows which expectation to restore |
| Risk | An expectation edited to match actual output can hide a real bug | Med | The new expectation is the rule `../004-focus-hijack-fix/spec.md` REQ-002 states; the two branch tests keep their original assertions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
