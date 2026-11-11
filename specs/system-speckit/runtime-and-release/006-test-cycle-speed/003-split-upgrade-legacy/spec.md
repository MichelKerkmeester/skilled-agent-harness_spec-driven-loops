---
title: "Phase 3: Split upgrade-legacy"
description: "One test file, upgrade-legacy, sets the cli lane's time of about 400 s. Splitting it along its describe blocks lets its pieces run at the same time."
trigger_phrases:
  - "split upgrade legacy"
  - "phase 3 split upgrade legacy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Split upgrade-legacy

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/340-local-test-scope` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-fresh-timing-profile |
| **Successor** | 004-split-fanout-run |
| **Handoff Criteria** | Three passing runs, the same test count and a faster lane |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the test-cycle speed series.

**Scope Boundary**: the `upgrade-legacy` test file, a shared harness for it, and the two places that name it.

**Dependencies**:
- Phase 2 says go, with `upgrade-legacy` still the slowest cli file.

**Deliverables**:
- Four test files in place of one, a shared harness module, and the updated runner and CI step.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-legacy.vitest.ts` holds 65 tests. Three of its five describe blocks reset a git sandbox after every test, restamping every `dist` file. The file runs in its own process beside the rest of the cli project, and that process sets the lane's time.

### Purpose
The cli lane gets shorter without losing a test or an assertion.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
describe block                        tests  resets after each test
upgrade-legacy                          42    yes
planLayoutMove                           6    no
upgrade-legacy link containment         12    yes
upgrade-legacy release apply lock        4    yes
upgrade-legacy layout links              1    no
```

The cli lane took 397 to 430 s in the last runs. `run-cli-tests.sh` lines 7 and 9 and `spec-kit-check.yml` lines 153 and 155 name the file.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the sandbox setup and helpers into `S/cli/tests/helpers/upgrade-legacy-harness.ts`.
- Split the 65 tests into four files: the 42-test block in two halves of 21, link containment with apply lock (16), and planLayoutMove with layout links (7). Each file builds its own sandbox.
- Run the whole cli project as one command in `run-cli-tests.sh` and in the CI step, since no file dominates any more.

### Out of Scope
- Changing any test body or assertion - the tests move unchanged.
- Shrinking the sandbox or dropping the second validation pass - the research ruled both out.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `S/cli/tests/upgrade-legacy.vitest.ts` | Delete | Replaced by four files |
| `S/cli/tests/upgrade-legacy-*.vitest.ts` | Create | Four files, one sandbox each |
| `S/cli/tests/helpers/upgrade-legacy-harness.ts` | Create | Shared sandbox setup and helpers |
| `S/scripts/run-cli-tests.sh` | Modify | One command for the whole cli project |
| `.github/workflows/spec-kit-check.yml` | Modify | The same change in the CI step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No test is lost | `vitest list` on the cli project counts the same tests before and after |
| REQ-002 | No assertion changes | `git diff` shows every `it` body moved, not edited |
| REQ-003 | The split is stable | `npm run test:cli` passes three runs in a row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The lane is faster | The cli lane's median falls by at least 10%, or the split is reverted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three passing runs with the test count unchanged.
- **SC-002**: The cli lane's median time is at least 10% lower than 397 to 430 s.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Two sandboxes copying the same fixture at once | Disk contention, slower than planned | Measure, and keep the split only if the lane is faster |
| Risk | A test in a no-reset block depends on order | A failure after the split | Keep each describe block whole inside one file |
| Dependency | The CI step changes too | CI runs a different command | Change the workflow in the same commit, and read its next run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


