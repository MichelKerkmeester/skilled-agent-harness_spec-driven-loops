---
title: "Feature Specification: Phase 17: overlay alignment follow-ups"
description: "Two flaws the overlay alignment work found are fixed in Skilled: the router-sync guard read a folder README as an orphan, and the overlay engine shipped Python bytecode caches from a directory entry. A final review covers everything phases 014 to 017 put on main."
trigger_phrases:
  - "overlay alignment follow ups"
  - "router sync readme orphan"
  - "overlay engine pycache"
  - "phase 17 overlay alignment follow ups"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: overlay alignment follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/500-overlay-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-upstream-code-alignment |
| **Successor** | None |
| **Handoff Criteria** | Both fixes are merged on local Skilled main with a test that failed before each, and a final `@review` pass over phases 014 to 017 approves with no P0 or P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the overlay framework/root layout packet. It runs in Skilled on its own worktree branch and merges into local main without a push.

**Scope Boundary**: the router-sync guard's orphan walk, the overlay engine's directory-entry readers, and a review of what phases 014 to 017 put on main. Barter's copies are read only.

**Dependencies**:
- Barter's overlay copy of `verify-router-sync.cjs`, read only, for the exact text of the README skip.
- The ai-speckit session's upstream handoff note, which reported both flaws.

**Deliverables**:
- The README skip in the router-sync guard, byte-identical to Barter's copy, with a test.
- A Python cache skip in every directory-entry reader of the overlay engine, with a test.
- A recorded `@review` verdict that approves with no P0 or P1.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Leg 1b of the router-sync guard walks every markdown file under a mode's `references/` and `assets/` folders, so a folder README that no router names fails the guard as an orphan. Barter overlays the guard to carry a fix, which means a re-pin would keep a difference that belongs upstream. Separately, `apply` copied a git-ignored `__pycache__/*.pyc` out of a directory entry's source into the live tree and recorded it in `sync-state.json`.

### Purpose
The guard treats a folder README as navigation, with the same text Barter carries, and the engine never ships, deletes, captures or reports a Python bytecode cache.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test --test-name-pattern="folder README" .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs
✖ leg 1b treats a folder README as navigation, not as an orphan (45.299417ms)
    - orphan (routable doc no router names): shared/references/nested/README.md
    - orphan (routable doc no router names): sk-code-demo/references/README.md
ℹ tests 1
ℹ pass 0
ℹ fail 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skip a file named `README.md`, in any case, in the router-sync guard's orphan walk, using Barter's exact lines.
- Skip `__pycache__` folders and `*.pyc` and `*.pyo` files on both sides of every directory-entry and skill-root reader in the overlay engine.
- Run `@review` over the first-parent merge diff `bf6806ad4b3..7153a45a8b9` and this branch, and fix until it approves with no P0 or P1.

### Out of Scope
- `canary-router.cjs` - it has an authored twin under `specs/`, and phase 016 already recorded the skip.
- Other files git ignores, such as `.DS_Store` - nothing has reported one shipping, and the cache rule covers the reported case.
- Barter's copies under `barter/ai-speckit/` - the parallel ai-speckit session owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | The orphan walk skips folder READMEs |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify | A test that unrouted READMEs pass leg 1b |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | One cache predicate applied to every directory-entry reader |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-cache-skip.test.cjs` | Create | Tests for apply, status, a stale state record and adopt or capture |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | A repin rollback restores a pruned cache |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | States the cache rule and the docs walk's `__pycache__` skip |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Leg 1b passes with an unrouted folder README in a packet and in the shared tier, and still reports an unrouted non-README doc | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` exits 0, and the new test failed on the unfixed guard |
| REQ-002 | The guard's changed lines match Barter's overlay copy byte for byte | `diff` of the two files exits 0 |
| REQ-003 | `apply` neither writes nor records a `.pyc` from a directory entry's source, and a live `__pycache__` in the destination survives `apply` with `status` still passing | the new engine test file exits 0 and failed on the unfixed engine |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The engine, guard, contract, lsa and ldoc suites keep their baseline counts, plus the new tests | each suite exits 0 on merged main |
| REQ-005 | A final `@review` pass over phases 014 to 017 approves with no P0 or P1 | the verdict line is recorded in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On merged main, the engine suite passes 354 tests plus the new ones, and the router-sync suite passes 55 plus one.
- **SC-002**: `validate.sh` on the 007 parent with `--recursive --strict` prints `RESULT: PASSED` for every folder, 17 lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Barter's overlay copy of the guard | If it changes, the upstream text no longer matches | Diff the two files before the commit and again on merged main |
| Risk | A cache skip on only the source side makes apply delete every live `__pycache__` a running script creates | High | One predicate applied to both sides of every reader, with a test that a live cache survives apply |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The operator decided that a flaw in code identical to upstream is fixed in Skilled too.
<!-- /ANCHOR:questions -->

---
