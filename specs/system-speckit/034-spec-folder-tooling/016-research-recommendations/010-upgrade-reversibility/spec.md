---
title: "Feature Specification: Phase 10: upgrade-reversibility"
description: "Give upgrade-legacy --apply a reversibility record and make its dry run list every finding a baseline would downgrade."
trigger_phrases:
  - "upgrade reversibility"
  - "phase 10 upgrade reversibility"
  - "upgrade-legacy reversibility record"
  - "before-image manifest"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: upgrade-reversibility

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 16 |
| **Predecessor** | 009-doctor-update-compatibility |
| **Successor** | 011-anchor-repair-mode |
| **Handoff Criteria** | The tool requires a committed tree or manifest, dry run lists downgrades, second run is no-op, and tests cover all paths |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Research recommendations specification.

**Scope Boundary**: `upgrade-legacy.mjs`, its tests, and its README.

**Dependencies**:
- None upstream. The era report (folder 008, SH-09) is context but not a blocker.
- Phase 009 (doctor-update-compatibility) depends on this phase: its approved action runs `upgrade-legacy --apply`, which must have an undo record first.

**Deliverables**:
- A before-image manifest written by `upgrade-legacy --apply` when the tree is dirty, at `<git-dir>/upgrade-legacy.manifest.json`, where `<git-dir>` is the output of `git -C <REPO> rev-parse --absolute-git-dir`.
- A refusal of `--apply` when REPO is not a git repository.
- Dry run output that lists each finding a committed baseline would downgrade to a warning.
- Tests covering committed tree, dirty tree, and before-image manifest paths.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-legacy --apply` transforms a legacy spec tree into v4 format with no reversibility record. An external user running it cannot tell whether the tool has already run, whether it was interrupted, or how to undo it. The dry run shows what will change but never shows what a baseline would downgrade from errors to warnings, so the user cannot see the planned footprint before and after.

### Purpose
Make `upgrade-legacy --apply` reversible and its dry run fully transparent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write a before-image manifest when the tree is dirty and `--apply` runs. One manifest per worktree, resolved from REPO with `git -C <REPO> rev-parse --absolute-git-dir`, never from the current directory.
- Store real before-image content for every dirty file the run will touch: a blob id from `git hash-object -w`, or the file bytes.
- Refuse `--apply` when REPO is not a git repository.
- List every finding a baseline will downgrade in the dry run output.
- Make a second run on the same baseline report no changes (idempotence).
- All paths: committed tree, dirty tree with manifest, and manifest recovery.

### Out of Scope
- Spec-wide corpus repair. Each packet is validated independently.
- Operator decisions about which findings to baseline. That stays policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Write the before-image manifest on a dirty tree, refuse without git, list baseline downgrades in dry run, check committed tree |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Test all three reversibility paths and baseline idempotence |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Document reversibility semantics and manifest format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `upgrade-legacy --apply` requires a committed tree or writes a before-image manifest before any change. It refuses when REPO is not a git repository or the manifest cannot be written |
| REQ-002 | The manifest lives at `<git-dir>/upgrade-legacy.manifest.json`, with `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir`. It records HEAD SHA, the time it was written, the baseline map, and for every dirty file the run will touch, its path and its before-image: a blob id from `git hash-object -w`, or the file bytes |
| REQ-003 | Dry run lists every finding that a committed baseline will downgrade to a warning, with the packet path, rule, and the transition |
| REQ-004 | A second run on the same baseline and tree state reports no new planned changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The tool restores the baseline from the manifest when the manifest exists, even across sessions |
| REQ-006 | The test suite covers committed tree, dirty tree, and manifest recovery paths |
| REQ-007 | README documents the reversibility guarantee and the manifest structure |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Dry run on a legacy tree shows the exact findings that will move from error to warning under the baseline.
- **SC-002**: A second run on the same baseline reports zero plan changes.
- **SC-003**: The manifest survives across sessions and `--apply` restores it correctly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A manifest on the wrong tree can mask new failures | Med | Manifest records the tree state and the tool validates it before use |
| Risk | Manifest location across git worktrees | Low | Resolve with `git -C <REPO> rev-parse --absolute-git-dir`: one manifest per worktree, and never the git dir of whatever directory the user ran from |
| Risk | REPO is not a git repository | Low | Refuse `--apply` with a clear message, since neither a committed tree nor a manifest home exists |
| Dependency | Phase 009 waits on this phase | Med | The doctor action must not ship an apply with no undo record |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. Decided 2026-10-08 by the operator:

- **One manifest per worktree, resolved from REPO.** The path is `<git-dir>/upgrade-legacy.manifest.json`, where `<git-dir>` is `git -C <REPO> rev-parse --absolute-git-dir`. REPO is the repository the script edits, taken from the script's own location, so a run from another directory cannot write the manifest beside the wrong tree. `--git-common-dir` was rejected because worktrees would share one file, and a path inside `specs/` was rejected because the manifest would dirty the tree it describes.
- **No git, no apply.** `--apply` refuses when REPO is not a git repository.
- **Real before-image content.** For each dirty file the run will touch, the manifest stores a blob id from `git hash-object -w` or the file bytes. HEAD plus a list of dirty paths cannot restore uncommitted edits.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Manifest survives git operations that do not rebase.
- **NFR-R02**: Tool detects a stale manifest (tree has moved or rebase happened) and reports that clearly.

### Reversibility
- **NFR-Rev01**: Delete the packet's `upgrade-baseline.json` to restore its error status for findings the upgrade recorded. Git restores committed documents, and the manifest's before-image content restores dirty files the run touched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- First run on a tree with no `upgrade-baseline.json` files: treat as baseline-free.
- Manifest on a rebased tree: report the tree mismatch and refuse.
- Concurrent runs on the same tree: manifest protects against double-apply, second run is a no-op.

### Error Scenarios
- Tree is dirty and manifest location is not writable: refuse with the location, before any change.
- REPO is not a git repository: refuse `--apply` with a clear message.
- Script run from a directory inside another checkout: the manifest still goes to REPO's git dir.
- Dry run is asked while manifest exists: use the manifest baseline.
- Manifest was written by a different user or on a different machine: tool trusts it if the tree SHA matches.

### State Transitions
- Move from dirty to committed: new run with the same baseline is still idempotent.
- Move from committed to dirty: tool writes a new manifest.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One tool, one test suite, one README section |
| Risk | 8/25 | Manifest state machine, user data on disk, but all read-only discovery |
| Research | 3/20 | Phase 14 research defined the requirement fully |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

