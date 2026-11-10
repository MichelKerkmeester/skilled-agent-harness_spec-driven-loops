---
title: "Implementation Plan: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it"
description: "A shared module reads track roots from the working tree or a commit and compares their lists as sets. A dry-by-default writer sets each list from disk, create.sh --track calls it after scaffolding, and the pre-push hook sweeps each pushed commit and blocks on drift."
trigger_phrases:
  - "track root children_ids"
  - "refresh-track-roots"
  - "track-root pre-push gate"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`, no build step) and Bash 3.2 |
| **Framework** | None |
| **Storage** | `graph-metadata.json` files under `specs/` |
| **Testing** | Vitest (`cli` project) and the shell harness `pre-push.test.sh` |

### Overview
A shared module reads track roots from the working tree or from a commit, and compares a track's `children_ids` with its numbered child folders as sets. The sweep reports and the writer repairs, both on that module. `create.sh --track` runs the writer for its own track after scaffolding, and the pre-push hook runs the sweep against each pushed commit and blocks on drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A shared library with two thin command-line entry points, called from `create.sh` and from the pre-push hook.

### Key Components
- **`lib/track-roots.mjs`**: finds track roots, lists their packets from the working tree or a commit, and compares a list with the packets as sets
- **`spec/sweep-track-roots.mjs`**: read-only report, exit 1 on drift; `--rev <commit>` reads a commit
- **`spec/refresh-track-roots.mjs`**: sets `children_ids` from disk; dry unless `--apply`, one track with `--track`
- **`create.sh`**: `refresh_track_root` runs the writer for `--track` after a normal or phase scaffold
- **`pre-push`**: the track-root gate, one sweep per pushed commit

### Data Flow
`create.sh --track` scaffolds a packet, then the writer adds it to the track's list. At push time the hook hands each pushed sha to the sweep, which reads that commit's `specs/` with `git ls-tree` and `git cat-file`. The sweep exits 1 when any list differs from the commit's packets, and the hook blocks with the sweep's report and the fix.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec/sweep-track-roots.mjs` | The only reader of a track's list, comparing counts | Update: sets, `--rev` | `track-roots.vitest.ts`; a count-only mutation fails it |
| `graph/backfill-graph-metadata.ts` | Derives packet lists, refuses track roots | Unchanged | Its child rule, numbered real folders, is the rule the new module uses |
| `spec/create.sh` | Places packets in a track | Update: refresh after scaffolding | `create-track-refresh.vitest.ts` |
| `scripts/git-hooks/pre-push` | Push gates | Update: track-root gate | `pre-push.test.sh`, 43 passing |
| Track roots under `specs/` | Hold the lists | Update: 13 in this repository, 2 linked | The sweep exits 0 |
| Validation orchestrator | Exempts tracks from packet rules | Unchanged | Not a consumer of track lists |

Required inventories:
- Same-class producers: one other writer reaches a track root. After a context save, `updatePhaseParentPointersAfterSave` in `continuity/generate-context.ts` appends the saved packet to its parent's list, and `isPhaseParent` is true for a track root. It only appends a packet that exists and never reorders, so the list still matches as a set. Every other `children_ids` writer is packet-level.
- Consumers of changed symbols: `sweep-track-roots.mjs` had no callers. Its per-track lines are unchanged; the closing drift line now names the writer, and `--rev` adds a line naming skipped symlinked tracks.
- Matrix axes: view (working tree, commit), track kind (plain, symlinked, unreadable, without metadata), entry kind (packet folder, packet-named file, unnumbered folder, foreign identity).
- Algorithm invariant: a track matches exactly when its listed packets under its own identity equal its numbered real folders and nothing is listed under another identity.
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
| Unit | Sweep and writer, in a throwaway git repository | Vitest, `track-roots.vitest.ts` |
| Integration | `create.sh --track` in a throwaway repository; the gate against real fixture commits | Vitest, `create-track-refresh.vitest.ts`; `pre-push.test.sh` |
| Mutation | Each guarded rule removed on purpose, one at a time | Scratch scripts that restore the file after each run |
| Manual | Sweep of the real `specs/` before and after the refresh | `sweep-track-roots.mjs`, with and without `--rev HEAD` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` in the hook environment | Internal | Green | The gate could not read commits |
| `node` in the hook environment | Internal | Green | Already required by the routing and skill gates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the gate blocks pushes it should not, or the writer damages a track file
- **Procedure**: `git revert` the tooling commit and the track data commit. For a single push, `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1` skips the gate
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Med | 2 to 3 hours |
| Verification | Med | 1 to 2 hours |
| **Total** | | **4 to 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): the previous track files are in git history
- [x] Feature flag configured: `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1`
- [x] Monitoring alerts set: not applicable, the gate prints to the pushing terminal

### Rollback Procedure
1. Skip the gate for the blocked push with `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1`
2. `git revert` the tooling commit, and the data commit if a track file is wrong
3. Run `pre-push.test.sh` and the sweep to confirm the state
4. No one outside this repository is affected

### Data Reversal
- **Has data migrations?** Yes, 13 track files in this repository and 2 untracked linked files
- **Reversal procedure**: `git revert` the data commit. The two linked files are untracked, so their previous content is not in git: `ai-systems` listed 11 entries and `anobel.com`'s file was empty
<!-- /ANCHOR:enhanced-rollback -->

---
