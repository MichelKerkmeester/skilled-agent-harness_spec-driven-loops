---
title: "Feature Specification: Clone path and messages"
description: "R1, R2, R4 and R5: the README adapting block reaches a green battery from a fresh clone, the guard's stale-manifest line names the commands that clear it, the removal and add steps match what the tree enforces, and an unprovisioned checker names the provision command instead of a stack."
trigger_phrases:
  - "clone path and messages"
  - "phase 1 clone path and messages"
  - "guard stale manifest repair line"
  - "unprovisioned checker named failure"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Clone path and messages

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-13 |
| **Branch** | `worktrees/133-surface-setup-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-doctor-sk-code-setup |
| **Handoff Criteria** | Every criterion in `goal.md` passes and the operator has pushed this phase to origin/main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the surface setup build. It builds research recommendations R1, R2, R4 and R5, phase P1 of `../../028-surface-setup-hardening-research/research/research.md` section 8.

**Scope Boundary**: The "Before you start", removal and add steps of the README block "What Adapting `sk-code` Looks Like"; the stale-manifest branch of `compiled-route-guard.cjs`; the `@spec-kit/shared` load in `root-router-contract.cjs` and, only if the no-stack exit needs it, its require in `ci-skill-root-metadata.cjs`; one test per behavior change plus one edge case, in the existing test files.

**Dependencies**:
- None. 002 depends on this phase for the repair texts it prints.

**Deliverables**:
- Two README "Before you start" items and four README corrections.
- A guard stale line that names the refresh command and both manifest paths, and an unprovisioned checker that names the provision command, each with a test that fails before and passes after.
- No skill release: no skill doc changes, and `.skilled/bin` and the root README belong to no skill changelog.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In a fresh clone, `parent-skill-check.cjs` and `ci-skill-root-metadata.cjs` exit 1 on a missing `@spec-kit/shared` build, the second with a raw `MODULE_NOT_FOUND` stack (`root-router-contract.cjs:65`; research F1). The one command that fixes it, `worktree-naming.sh provision`, is named only for worktrees (F2), and the block leaves out `skilled.trustRepoHooks`, without which the commit-time re-mint never runs in a clone (F3). After a hand add, the guard prints `Re-mint: sk-code` and no command (`compiled-route-guard.cjs:174`; F5). The removal recipe sends the user to `verify-doc-claims` for `graph-metadata.json`, which that tool does not read (F16), skips the feature catalog (F17), and a packet copied from an example collides in `generate-leaf-manifest.cjs` against a `leaf-scopes.json` no doc names (F10). The add steps also miss the surface-count files `verify-doc-claims` checks (F19).

### Purpose
A user who clones the repository and follows only the README block reaches a green battery, and every failure on the way names its fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **R1.** Two "Before you start" items: run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` in a fresh clone, and set `git config --local skilled.trustRepoHooks true` in a clone that should run the hooks.
- **R2.** The guard's stale-manifest branch keeps `Re-mint: <hubs>` and adds one line per stale hub naming `compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>`, the runtime manifest, its authored twin and the copy, or a commit with the hooks installed.
- **R4.** Removal step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` for `graph-metadata.json` and keeps a hand edit only for `causal_summary`; step 6 adds the feature catalog; the add steps name `leaf-scopes.json` for a packet copied from an example and the surface-count files `phase-detection.md`, the hub `README.md` and `SKILL.md`.
- **R5.** When `@spec-kit/shared` cannot be resolved, the contract library throws one line naming the provision command, and `ci-skill-root-metadata.cjs` exits 1 printing that line with no stack.
- One test per behavior change (T1, T3) and one edge case each (T2, T4).

### Out of Scope
- `/doctor:sk-code setup` (phase 002).
- The optional retitle of the `provision` usage line at `worktree-naming.sh:581`: a usage string does not justify a sk-git release.
- Every rejected idea X1 to X11 of research section 7.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | R1 and R4 in the adapting block |
| `.skilled/bin/compiled-route-guard.cjs` | Modify | R2 stale-manifest line |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | T1, T2 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Modify | R5 named failure |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modify, only if needed | R5 stack-free exit |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | Modify | T3, T4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In a fresh unprovisioned clone, `ci-skill-root-metadata.cjs` exits 1 with a line naming `worktree-naming.sh provision` and no stack line |
| REQ-002 | In that clone, the provision command the block names exits 0, then `parent-skill-check.cjs .skilled/skills/sk-code` and `ci-skill-root-metadata.cjs` exit 0 |
| REQ-003 | In a copy with stale sk-code routing, the guard exits 1 and prints the refresh command and both manifest paths |
| REQ-004 | Following that line verbatim brings the guard and sync `--check` to exit 0 |
| REQ-005 | The README block names `skilled.trustRepoHooks`, `regenerate-skill-derived.cjs`, the feature catalog, `leaf-scopes.json` and `phase-detection.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `compiled-route-manifest.test.cjs` and `root-router-contract.test.cjs` pass; T1 and T3 fail against the origin/main source and pass after; the README battery and the drift guards exit 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Acceptance Ledger (6 rows plus 4 tests)

The orchestrator records each row in `implementation-summary.md` as `| L-<n> | Pass | <backticked command and what it printed> |`, and each test as `| T<n> | <test name> | before: exit <n> | after: exit 0 |`, where "before" runs the new test against the origin/main version of the changed source.

| ID | Check |
|----|-------|
| L-1 | Fresh clone of the final commit: `ci-skill-root-metadata.cjs` exits 1 with one named line and no stack |
| L-2 | Same clone: `worktree-naming.sh provision .` exits 0, then the doctor on sk-code and `ci-skill-root-metadata.cjs` exit 0 |
| L-3 | Provisioned copy with a hand edit to sk-code routing: the guard exits 1 and prints the refresh command and both manifest paths |
| L-4 | Same copy: the printed refresh and copy run verbatim; the guard and sync `--check` exit 0 |
| L-5 | Worktree: the README block greps for R1 and R4 match, and `test_readme_manifest.py` exits 0 |
| L-6 | Worktree: the two test files, the README battery and the drift guards exit 0 |
| T1 | Guard stale line names the refresh command and both paths |
| T2 | Guard edge case |
| T3 | Contract library names the provision command when `@spec-kit/shared` is unresolvable |
| T4 | Contract library edge case: another load error is not relabeled |

Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table in the same file.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A user who follows only the README block reaches a green battery from a fresh clone.
- **SC-002**: Each failing line a user meets on the clone, add and remove paths names the command that clears it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The named failure hides a different load error | High | T4 proves another unresolvable module keeps its own error |
| Risk | The guard's new line changes its live verdict | Med | L-6 and criterion 2 run the guard on the live tree at exit 0 |
| Risk | `provision .` misbehaves outside a worktree | Med | L-2 runs it in a real clone |
| Dependency | Phase 002 prints this phase's repair texts | Med | 002 starts from origin/main once this phase is on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The live-tree verdicts of the doctor, the guard, sync and `ci-skill-root-metadata.cjs` do not change.
- **NFR-R02**: Every new line prints repository-relative paths and commands, never a stack trace.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A stale hub other than sk-code gets its own skill root in the refresh command.
- A fresh hub carries no stale fix text.

### Error Scenarios
- A module other than `@spec-kit/shared` fails to resolve: the original error surfaces unchanged.
- The doctor loads the library in an unprovisioned tree: its 12-lib line carries the provision command.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One README block, two scripts, two test files |
| Risk | 8/25 | CI and the doctor read the guard and the library |
| Research | 3/20 | Verified in research runs E1 and E2 |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
