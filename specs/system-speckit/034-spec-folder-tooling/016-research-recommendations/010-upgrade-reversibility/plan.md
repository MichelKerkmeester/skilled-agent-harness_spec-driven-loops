---
title: "Implementation Plan: Phase 10: upgrade-reversibility"
description: "The build plan for Phase 10: upgrade-reversibility: the approach, the files it touches, the tests and the rollback."
trigger_phrases:
  - "upgrade reversibility plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: upgrade-reversibility

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and shell |
| **Framework** | system-spec-kit CLI runtime |
| **Storage** | `<git-dir>/upgrade-legacy.manifest.json` for the manifest (one per worktree, `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir`), `upgrade-baseline.json` per packet |
| **Testing** | Vitest cases that run the real script against throwaway git repositories the test file creates |

### Overview
The tool gains a state machine for reversibility: check tree state at start, write manifest if dirty, list baseline downgrades in dry run, and validate manifest on recovery. Dry run already validates and plans changes; we add the manifest path and the downgrade listing. Tests cover three paths: committed tree (no manifest), dirty tree (writes manifest), and manifest recovery (reads and applies manifest), plus the refusals for a missing git, an unwritable location and a stale manifest.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec and research document the requirement fully
- [x] Success criteria are measurable (dry run output, second run no-op, manifest state)
- [x] Dependencies identified (the era report in 008-legacy-era-report is context, not a blocker; phase 009 waits on this phase)

### Definition of Done
- [x] Acceptance criteria reviewed with evidence (nine of nine Met, each with a test or a README line)
- [x] Test suite covers committed, dirty, and manifest recovery paths (`dirty-tree-writes-manifest` covers committed and dirty, `manifest-recovery` the third)
- [x] Docs updated: spec, plan, tasks, acceptance criteria, README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Tree-state validation before mutation. The tool already validates in dry run; we add state checks and manifest writes.

### Key Components
- **Tree state check**: `readRepositoryState()` runs `git -C <REPO> rev-parse --absolute-git-dir`, `rev-parse --verify HEAD` and `status --porcelain=v1 -z --untracked-files=all`, and returns the git dir, HEAD SHA and dirty paths. When the first call fails, `--apply` refuses with exit 2. There is no function named `isCommittedTree()`.
- **Manifest write**: `prepareManifest()` writes the manifest as `in-progress` before any repair, and `completeManifest()` marks it `complete` afterwards. It records `schema`, `repoRoot`, `headSha`, `recordedAt`, `status`, `baselineMap`, `recordedBaselineMap`, `scopeHashes` (one tree hash per in-scope packet) and `beforeImages`: for each dirty file inside a failing packet, its path and the file bytes as base64 with the mode, `absent`, or a symlink target. The built manifest never holds a blob id.
- **Dry run listing**: `printDowngrades()` prints the "Downgrades" section. `predictDowngradeFindings()` repairs a temporary copy of the failing packets, so the list is what `--apply` would record, and `materializeSymlinks()` keeps that copy from writing through links into the real tree.
- **Manifest recovery**: `readManifestIfExists()` loads the manifest and checks it against HEAD and the packet-tree hashes. A valid manifest supplies its `recordedBaselineMap` to the Downgrades list. A different HEAD, a changed packet tree or an `in-progress` status makes `--apply` refuse and the dry run report and continue. Copying before-images back is the README recovery script, not a command.

### Data Flow
User runs `--apply` on dirty tree -> tree state check (refuse if no git) -> resolve `<git-dir>` with `git -C <REPO> rev-parse --absolute-git-dir` -> read any existing manifest (refuse if its HEAD or packet trees no longer match, or it is in progress) -> write manifest with before-images -> proceed with repairs -> mark the manifest complete. Git restores committed documents, the before-images restore dirty files, and deleting a packet's `upgrade-baseline.json` restores its error status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `upgrade-legacy.mjs` entry | Validates tree and runs repair | Add tree state check before any write | Tree is committed or manifest is written |
| Dry run output | Lists plan changes | Add "Downgrades" section naming each finding | Matches baseline findings exactly |
| Manifest location | N/A | New: `<git-dir>/upgrade-legacy.manifest.json` | File is readable JSON after `--apply` |
| Baseline recovery | Only packet-based today | Load from manifest if present | Second run uses same baseline |
| Test suite | Covers upgrade-legacy behavior | Add committed, dirty, and manifest paths | All three paths pass independently |

Required inventories:
- Same-class producers: `upgrade-legacy` is the only tool that writes `upgrade-baseline.json` per packet.
- Consumers of baseline: The validator reads `upgrade-baseline.json` from each packet and downgrades recorded findings.
- Matrix axes: committed tree, dirty tree, manifest present, manifest missing, manifest stale (tree moved).
- Algorithm invariant: Manifest tree state must match current tree, or the tool refuses (error, never silently overwrites).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Manifest format, before-image bytes, baseline recovery | Vitest cases that read the manifest the real script wrote; no mocked git or file system |
| Integration | Full dry run and apply flow with fixture trees in each state | Vitest with a throwaway git repository; a `git` shim on `PATH` for the unwritable location and `GIT_DIR` for the missing git |
| Manual | Real tree transitions: committed -> dirty -> apply, rerun on same baseline, moved checkout | Done by the Vitest cases above instead of by hand; not run on this checkout's real tree |
| Regression | Existing upgrade-legacy test suite | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` command on PATH | External | Green | Tree state check and manifest path resolution both require git |
| Writable git directory | External | Green | Manifest location resolved with `git -C <REPO> rev-parse --absolute-git-dir`; `--apply` refuses if it is not writable |
| Phase 009 (doctor update) | Downstream | Waits on this phase | 009's approved action runs `--apply`, so it ships after this |
| Phase 13 corpus repairs | External | Assumed | Assumes baseline files exist from phase 13 cleanup; not a blocking dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tool breaks manifest recording, or manifest location becomes unwritable, or corruption detected on reread.
- **Procedure**: Restore dirty files from the manifest's before-images (the README's "Recover an Interrupted Apply" script), delete the packet's `upgrade-baseline.json` files (restores error status for findings the upgrade recorded) and revert code changes with `git revert`. Then rerun `--apply`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
upgrade-legacy manifest (state machine)
     |
     +--> Tree state check (committed or dirty)
     |
     +--> Manifest write (if dirty)
     |
     +--> Dry run with downgrades list
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Tree state check | Nothing | Manifest write, dry run |
| Manifest write | Tree state check | Repairs |
| Dry run listing | Tree state check | Apply |
| Manifest recovery | Nothing | Repairs on second run |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Tree state and manifest I/O | Med | 4-6 hours (state machine, file format, recovery) |
| Dry run listing | Low | 2-3 hours (iterate existing output, add downgrades) |
| Tests (committed, dirty, manifest) | Med | 4-6 hours (three fixture scenarios, edge cases) |
| Docs and README | Low | 1-2 hours |
| **Total** | | **11-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Research defines manifest semantics
- [x] Manifest location is the worktree's own git directory (`<git-dir>/upgrade-legacy.manifest.json`)
- [x] Tree state check is validated on throwaway git repositories (the tests create them; not run on this checkout's real tree)

### Rollback Procedure
1. Delete `<git-dir>/upgrade-legacy.manifest.json`
2. `git revert` the code commit
3. Rerun `upgrade-legacy --apply` on the clean tree

### Data Reversal
- **Has data migrations?** No, only baseline files per packet.
- **Reversal procedure**: Restore dirty files from the before-images, restore committed files with git, and delete the `upgrade-baseline.json` files the run wrote.
<!-- /ANCHOR:enhanced-rollback -->

---

