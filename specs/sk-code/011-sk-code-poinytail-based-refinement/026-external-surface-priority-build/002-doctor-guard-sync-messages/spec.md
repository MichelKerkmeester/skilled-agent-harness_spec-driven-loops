---
title: "Feature Specification: Doctor guard and sync messages"
description: "R3 and R7: the doctor's 3c line and compiled-route repair string and the guard's authored-drift line point at the fix, and a missing authored compiled-routing closure becomes a named failure in sync and the guard instead of a raw stack and a false green."
trigger_phrases:
  - "doctor guard sync messages"
  - "phase 2 doctor guard sync messages"
  - "missing authored closure named failure"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doctor guard and sync messages

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-13 |
| **Branch** | Its own worktree from origin/main, created as `goal.md` says |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-scaffold-surface-placement |
| **Successor** | 003-example-tolerant-drift-guards |
| **Handoff Criteria** | Every criterion in `goal.md` passes; 004 branches from this phase's finished branch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the external surface priority build. It builds research recommendations R3 and R7, phase P9 of `../../025-external-surface-priority-research/research/research.md` section 14.1. The verification pass moved R3's removal checklist into the guide (phase 005), so R3 here is three message fixes.

**Scope Boundary**: The 3c message in `parent-skill-check.cjs`, the `compiled_routes` repair string in `doctor-update-apply.yaml`, the authored-drift line and the missing-authored-manifest case in `compiled-route-guard.cjs`, the authored-root check in `compiled-route-sync.cjs`, and one test per behavior change in the existing test files.

**Dependencies**:
- None for the build. Builds in parallel with 001 and 003. Phase 004 branches from this phase's finished branch because both edit `parent-skill-check.cjs` and `parent-skill-check-invariants.test.cjs`.

**Deliverables**:
- Four changed messages or failure classes, each with a test that fails before and passes after.
- No skill release: the changed files are the doctor command and `.skilled/bin` tooling, which no skill changelog owns.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A user who deletes an example packet sees `3c: mode "..." packet "..." is not an existing sub-directory` (`parent-skill-check.cjs:496`) with no pointer to the steps that fix it. A user who follows the doctor's compiled-route repair string (`doctor-update-apply.yaml:160`: refresh, then rerun the guard) ends on the guard line `Runtime differs from its authored source (a rebuild would revert it)` (`compiled-route-guard.cjs:164`), which names no path and no action; only sync `--check` names the copy-back (F88, run V1). A user who pruned `specs/` gets a raw `lstat` ENOENT stack from sync (`compiled-route-sync.cjs:39`) and `All hubs fresh or excused` from the guard, because `authoredDrift` returns `null` when the authored manifest is missing (`compiled-route-guard.cjs:65-70`; F20, F40, F41, run V4).

### Purpose
Every message on the removal path names the next action, and a missing authored closure fails loudly with the folder to restore.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **R3, 3c.** The 3c "is not an existing sub-directory" line adds a pointer: when a surface packet was removed on purpose, follow the README adaptation block, named by its heading "What Adapting `sk-code` Looks Like" in `README.md`, with the literal text `What Adapting` in the line.
- **R3, repair string.** The `compiled_routes` repair adds the copy-back: after the refresh, copy the runtime activation manifest over its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/<hub>/manifest.json`, or commit with the hooks installed so the pre-commit gate does it; then rerun the guard.
- **R3, guard.** The authored-drift line names, per drifted hub, the runtime manifest path and its authored twin, and says to copy the runtime one over the authored one (or commit with hooks).
- **R7, sync.** Before any `lstat` of the authored root, sync checks that `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists and, when it does not, prints one line naming that folder to restore and exits 1, with no stack.
- **R7, guard.** A hub whose authored manifest is missing is a named failure (for example `authored-missing`) that names the missing path, and the guard exits 1, instead of passing.
- One test per change above, added to an existing test file: T1 to T4.

### Out of Scope
- The removal checklist itself (moved to the guide, phase 005).
- `compiled-route-guard --fix` or any automatic copy (X12).
- Moving the authored closure out of `specs/` (X16).
- Naming the stale policy at the front door (R10, rejected as X22).
- A guard leg that stats packet directories (X7).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | 3c pointer |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modify | `compiled_routes` repair string |
| `.skilled/bin/compiled-route-guard.cjs` | Modify | Authored-drift line; missing authored manifest as a named failure |
| `.skilled/bin/compiled-route-sync.cjs` | Modify | Authored-root check before `lstat` |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | T1 |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | T2 to T4, which already load sync and run it in sandboxes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A deleted packet prints a 3c line that names the README adaptation block |
| REQ-002 | After a reorder and refresh, the guard's authored-drift line names the runtime manifest and its authored twin |
| REQ-003 | Applying the doctor's repair string verbatim ends with the guard and sync `--check` at exit 0 |
| REQ-004 | With the authored closure missing, sync `--check` exits 1 with one line naming the 015 folder and no stack, and the guard exits 1 naming the missing authored manifest |
| REQ-005 | With only the 019 folder of `specs/` present, and in the live tree, sync `--check`, the guard and the doctor exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The doctor invariants test, the doctor `run-all.sh` and `compiled-route-manifest.test.cjs` pass, and T1 to T4 each fail before their change and pass after |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Acceptance Ledger (7 rows plus 4 tests)

The builder records each row in `implementation-summary.md` as `| P9-<n> | Pass | <backticked command and what it printed> |`, and each test as `| T<n> | <test name> | before: exit <n> | after: exit 0 |`.

| ID | Check |
|----|-------|
| P9-1 | Copy with `sk-code-webflow/` deleted: the 3c line names the README adaptation block |
| P9-2 | Copy with `tieBreak` reordered and `compiled-route-manifest.cjs refresh` run: the guard line names the runtime manifest and its authored twin |
| P9-3 | Same copy: the repair string applied verbatim; the guard and sync `--check` exit 0 |
| P9-4 | Copy with no `specs/`, and copy with `specs/` but no 019 folder: sync `--check` exits 1 with one line naming `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` and no stack trace |
| P9-5 | The same two copies: the guard exits 1 naming the missing authored manifest |
| P9-6 | The 019-only copy: sync `--check` and the guard exit 0 |
| P9-7 | Worktree: the three suites pass |
| T1 | 3c pointer |
| T2 | Guard authored-drift line names both paths |
| T3 | Sync missing authored root |
| T4 | Guard missing authored manifest |

Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table in the same file.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each failing line a user can reach on the removal path names the action that clears it.
- **SC-002**: No tree state reports green while the authored closure is missing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new guard failure fires for a hub that legitimately has no authored manifest | High | P9-6 and criterion 3 run the 019-only copy and the live tree, both of which must stay at exit 0 |
| Risk | The 3c pointer names an sk-code README block for every hub | Low | The line says the pointer applies when a surface packet was removed on purpose |
| Risk | Phase 005 renames the README heading the 3c line names | Med | 005's goal keeps the heading |
| Dependency | Phase 004 edits the same doctor script and test | Med | 004 branches from this phase's finished branch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every live-tree result is unchanged: the doctor, guard and sync print the same verdict for the pristine tree.
- **NFR-R02**: A named failure prints repository-relative paths and never a stack trace.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `specs/` present but empty, `specs/` absent, and `specs/` holding only the 019 folder: the first two fail with the named line, the third passes.
- A hub the guard already excuses: its verdict does not change.

### Error Scenarios
- `specs/` is a symlink whose target is missing: treated as missing, with the same named line.
- Both the runtime and the authored manifest are missing: the guard reports the existing compile failure, not two failures for one cause.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Four source files and two test files, about 150 lines |
| Risk | 10/25 | CI and the doctor read these verdicts |
| Research | 4/20 | Verified in research runs V1 and V4 |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
