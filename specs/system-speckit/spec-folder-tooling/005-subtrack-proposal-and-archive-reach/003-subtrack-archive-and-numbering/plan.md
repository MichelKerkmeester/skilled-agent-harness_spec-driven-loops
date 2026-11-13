---
title: "Implementation Plan: Phase 3: subtrack-archive-and-numbering"
description: "Extend refresh-track-roots.mjs to seed z_archive/.gitkeep in every declared subtrack and sweep-track-roots.mjs to report one that lacks it. Extend the highest-number loop in create.sh to read the archive beside the target folder. Prove it with a count of 40 folders and one new numbering test case."
trigger_phrases:
  - "subtrack archive and numbering plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: subtrack-archive-and-numbering

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), bash and markdown |
| **Framework** | None |
| **Storage** | Empty `.gitkeep` files under `specs/<track>/<sub-track>/z_archive/` |
| **Testing** | vitest, run with `npm test` in `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase changes three existing scripts in `.skilled/skills/system-spec-kit/runtime/cli/spec/` and adds no new one. `refresh-track-roots.mjs --apply` seeds the archive folder, `sweep-track-roots.mjs` reports a missing one, and `create.sh` counts archived numbers. Proof is 40 tracked `.gitkeep` files and a new case in `create-root-numbering.vitest.ts`.
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
- [x] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place script extension

### Key Components
- **`refresh-track-roots.mjs`** (extended in place): a new function, `ensureArchive`, runs for every declared subtrack the script visits. Under `--apply` it creates `z_archive/.gitkeep` when the subtrack has no `z_archive/` at all. A dry run prints the pending creation and counts it toward exit 1. A `z_archive` that is a symlink is refused and counts toward exit 2. An existing `z_archive/` is left alone, with or without a `.gitkeep`. No new file is needed, because this script already visits every declared subtrack with write intent.
- **`sweep-track-roots.mjs`** (extended in place): prints one advisory line per declared subtrack without the folder. The check runs in the working tree only, not with `--rev`, and never changes the exit code.
- **`create.sh` `resolve_branch_name`** (extended in place): the loop over `"$SPECS_DIR"/*` gains a second glob over `"$SPECS_DIR"/z_archive/*`.

### Data Flow
`readWorkingTreeTracks` yields each declared subtrack. Refresh creates the missing `.gitkeep` and sweep reports what is still missing. In `create.sh`, the highest numeric prefix among the live folders and the archived folders, plus one, becomes the new packet number.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a script that the pre-push gate reads, so the surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/refresh-track-roots.mjs` | Producer: writes track and subtrack `children_ids` | update | `create-track-refresh.vitest.ts` and `track-roots.vitest.ts` pass. The second pins the refresh stdout and failed 3 tests on the first version of the seeding |
| `runtime/cli/spec/sweep-track-roots.mjs` | Policy: read-only drift report | update | `track-roots.vitest.ts` passes |
| `.skilled/scripts/git-hooks/pre-push` `gate:track-roots` | Consumer: blocks a push on sweep drift | unchanged | `bash .skilled/scripts/git-hooks/tests/pre-push.test.sh` exits 0 |
| `runtime/cli/spec/create.sh` `resolve_branch_name` | Producer: allocates the packet number | update | `create-root-numbering.vitest.ts` passes |
| `runtime/cli/spec/archive.sh` `resolve_archive_root` | Consumer: resolves `<home>/z_archive` on archive | unchanged | `archive-track.vitest.ts` passes |

Required inventories:
- Same-class producers: `rg -n "z_archive" .skilled/skills/system-spec-kit/runtime/cli/spec --glob '*.sh' --glob '*.mjs' --glob '*.cjs'`.
- Consumers of changed symbols: `rg -n "sweep-track-roots|refresh-track-roots" .skilled --glob '*.sh' --glob '*.mjs' --glob '*.cjs' --glob '*.md' --glob 'pre-push'`.
- Matrix axes: folder kind (specs root, track, subtrack), archive state (absent, empty, holds a higher number, holds a lower number).
- Algorithm invariant: the allocated number is above every numeric prefix in the target folder and in its `z_archive/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup counts the declared subtracks and their archive folders, saves the sweep output and reuses the phase 001 test baseline. Implementation edits `refresh-track-roots.mjs`, `sweep-track-roots.mjs` and `create.sh`, seeds the 40 folders and adds the test case. Verification counts 40 `.gitkeep` files, staged until the operator's commit, and runs the full suite, which holds the new case of `create-root-numbering.vitest.ts`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The archive case in `create-root-numbering.vitest.ts` | vitest |
| Integration | `track-roots.vitest.ts`, `create-track-refresh.vitest.ts` and `archive-track.vitest.ts` stay green | vitest |
| Manual | `sweep-track-roots.mjs` before and after seeding, the refresh dry run, `--apply`, second `--apply` and symlink case in a scratch tree, the two `create.sh` cases in a throwaway clone, and `git ls-files 'specs/*/*/z_archive/.gitkeep'` | `node`, `bash`, `git` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/cli/lib/track-roots.mjs` `readWorkingTreeTracks` | Internal | Green | No list of declared subtracks |
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` `buildSubtrackTree` | Internal | Green | The test case would need its own tree builder |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The pre-push `gate:track-roots` blocks a push on a tree that passed before, or `create.sh` allocates a number that already exists.
- **Procedure**: Revert the commit that carries this phase. The 40 `.gitkeep` files are empty and are removed by the same revert.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002-subtrack-proposal | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 004-archive-search-and-json |
<!-- /ANCHOR:phase-deps -->

---
