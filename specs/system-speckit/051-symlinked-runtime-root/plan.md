---
title: "Implementation Plan: Symlinked runtime: entry guard, project root and empty saves"
description: "Canonicalize the module side of the entry guard so it survives the symlink flag, derive the project root from the caller's repository instead of the script's location, and stop an empty save from exiting 0."
trigger_phrases:
  - "symlinked runtime root plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Symlinked runtime: entry guard, project root and empty saves

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript compiled to ESM, plus one plain `.mjs` copy |
| **Framework** | None |
| **Storage** | Spec folders on disk |
| **Testing** | Vitest, `npx vitest run` in `.skilled/skills/system-spec-kit/runtime` and `runtime/cli` |

### Overview
The entry guard is half fixed. The earlier packet canonicalized the launch path and left the module URL alone, which holds only while Node also canonicalizes the module URL. The flag that keeps a linked path turns that off. Canonicalizing both sides closes it. The project root is a separate defect with the same trigger, and fixing it means deciding which paths belong to the runtime and which to the caller's repository.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, each case having failed against the pre-change code
- [ ] Runtime build, CLI build and both typechecks pass
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the source of each value. The guard compares two canonical paths. The root comes from the caller, the runtime's own assets from the script.

### Key Components
- **Entry guard** (`runtime/cli/lib/esm-entry.ts:26-41`, `runtime/lib/esm-entry.ts:29-43`, `runtime/cli/lib/esm-entry.mjs:29-43`): three copies forced apart by build boundaries, kept equal by `runtime/tests/esm-entry-symlink.vitest.ts:167`.
- **Config** (`runtime/cli/core/config.ts:15`, `:299`): derives `PROJECT_ROOT` and `TEMPLATE_DIR` from the module directory. Only `PROJECT_ROOT` moves to the caller.
- **Save entry** (`runtime/cli/continuity/generate-context.ts:1130-1139`): `main` already takes a `projectRoot` argument and binds `CONFIG.PROJECT_ROOT` from it. The CLI path passes nothing today.
- **Workflow** (`runtime/cli/core/workflow.ts:1517-1520`): logs the content-quality score and warns below threshold, never failing.

### Data Flow
The launcher runs the built script. The guard decides whether `main` runs. `main` binds the root, parses arguments, checks the write guard against that root, and runs the workflow, which scores the input and writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Three `isMainModule` copies | Entry guard for every script that gates on it | update | `esm-entry-symlink.vitest.ts` with the flag |
| `CONFIG.PROJECT_ROOT` | Root for every spec-folder read and write | update | reader inventory, then a save from a linked temp repository |
| `CONFIG.TEMPLATE_DIR` and other script-relative paths | Runtime-owned assets | unchanged | the same save finds its templates |
| `assertSpecWriteAllowed` | Refuses a write when the packet is absent or divergent | unchanged, it receives the right root | the linked-repository save passes it |
| Content-quality warning | Advisory only | update | an empty-exchanges save exits non-zero |

Required inventories:
- Same-class producers: `rg -n "realpathSync|pathToFileURL" .skilled/skills/system-spec-kit/runtime --glob '*.ts' --glob '*.mjs'` to find any other guard that compares one canonical side.
- Consumers of the root: `rg -n "PROJECT_ROOT" .skilled/skills/system-spec-kit/runtime --glob '*.ts' --glob '!**/dist/**'`, each classified as project-owned or runtime-owned.
- Matrix axes: launch path (direct, through a symlink), flag (absent, present), invocation (executed, imported), working directory (runtime repository, linked repository, subfolder, outside any repository).
- Algorithm invariant: the guard is true exactly when the canonical launch path and the canonical module path name the same file.
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
| Unit | The guard, in process and through a spawned child with the flag | Vitest |
| Integration | A save from a temp repository whose `.skilled` links to this runtime | Vitest with a temp directory and a real symlink |
| Manual | The two probes from the problem statement, run from `AI Systems` | `node --preserve-symlinks-main` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` on the path | External | Green | The root falls back to the working directory |
| The committed `dist` output beside the sources | Internal | Green | A rebuild is part of the change, as it was for the earlier packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Saves from the runtime repository itself start writing to a different root, or a script that should stay dormant on import starts running
- **Procedure**: Revert the commit and rebuild. No data moves, so the revert is the whole rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: failing cases) ──► Phase 2 (Guard, root, empty save) ──► Phase 3 (Verify)
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
| Setup | Low | 1 hour |
| Core Implementation | Med | 3 to 4 hours |
| Verification | Low | 1 hour |
| **Total** | | **5 to 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each new case recorded failing against the pre-change code
- [ ] No feature flag. The guard and the root have one correct answer.
- [ ] A save from the runtime repository itself still writes where it did

### Rollback Procedure
1. Revert the commit
2. Rebuild the runtime and CLI workspaces
3. Rerun the entry-guard cases and confirm the pre-change result

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
