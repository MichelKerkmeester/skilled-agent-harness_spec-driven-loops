---
title: "Implementation Plan: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-spec-kit)"
description: "Run the deep-loop packet's DeepSeek loop driver over the spec-kit runtime with a test gate scoped to spec-kit's own vitest projects, then land the double-underscore renames, the three test-folder merges, the snapshot move and the lib/hooks merge one at a time with tests after each."
trigger_phrases:
  - "spec-kit runtime alignment"
  - "spec-kit folder merges"
  - "scoped test gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-spec-kit)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript workspaces (`shared/`, `runtime/`, `runtime/cli/`); bash loop driver and Python checks borrowed from the deep-loop packet |
| **Framework** | Node.js, vitest |
| **Storage** | None; loop state is a plain-text done list in the deep-loop packet's `scratch/loop-state/` |
| **Testing** | `npm run typecheck` per 25 kept edits; the `root` and `cli` projects of the skill-root `vitest.config.ts` per mode and after each merge, after rebuilding the three workspaces |

### Overview
The driver and checker flags come from the deep-loop packet. What changes here is the test gate: `test:runtime` also runs deep-loop's suites and overran its own 600-second bound, so the gate runs only spec-kit's two vitest projects, after a build, because several suites read compiled `dist/` output. Loop edits are comment-only by construction; the renames and merges move files and rewrite importers, so each one is followed by the typecheck, the scoped suites and an `rg` for the old path. The `lib/hooks/` merge runs last because it reaches the most consumers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (census counts)
- [ ] Scoped test baseline recorded (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Scoped suites at or above their baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator plus cheap leaf workers, as in the deep-loop packet. DeepSeek V4.1 Flash at `high` through cli-pi does the per-file comment edits and the three READMEs; Opus does the renames, merges, the snapshot move and the ARCHITECTURE refresh.

### Key Components
- **Loop driver**: `align-loop.sh system-spec-kit <header|sections|readme>` in the deep-loop packet's `scratch/`.
- **Scoped gate**: build `shared/`, `runtime/` and `runtime/cli/`, then `npx vitest run --config vitest.config.ts` for the `root` and `cli` projects.
- **Merge table**: `scratch/investigation/`, with CONFIRMED and REJECTED rows from the SWE-2 MAX fact-check.

### Data Flow
1. The driver lists targets from the checker, dispatches one brief per target, and keeps an edit only when it is comment-only, touches nothing outside the target, and the checker no longer flags the target.
2. A rejected edit is restored from the pre-dispatch snapshot.
3. The README loop runs after `cli/hermes/tests/` has merged, so no README is written for a folder about to disappear.
4. Each rename or merge runs alone: `git mv`, importer rewrite, README fold-in, typecheck, scoped suites, `rg` for the old path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime source files | Executed code | Comment-only edits | Comment-only proof per file, typecheck per batch |
| `tests/__helpers__/`, `tests/embedders/__fixtures__/` | Test helpers and fixtures | Rename without underscores | Referencing files repointed; scoped suites at baseline |
| `cli/hermes/tests/`, `tests/deep-loop/`, `tests/graph/` | Test locations | Merge into the parent `tests/` | Import depths and the test's own `SCRIPT` path fixed; suites at baseline |
| `cli/tests/__snapshots__/` | Golden snapshot store | Move to `cli/tests/snapshots/` through `resolveSnapshotPath` | Break one snapshot line, see the golden test fail, restore |
| `lib/hooks/` | Hook library for 5 adapters, 1 test and the completion-sentinel plugin | Merge into `hooks/lib/` last | Hook tests pass; `rg` for the old path is empty |

Required inventories:
- Consumers of each moved folder: `rg -n '<folder-name>' .skilled` over code, configs, plugins and `.md` links.
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
| Unit and integration | `tests/`, `runtime/tests/` | vitest project `root` |
| CLI | `runtime/cli/tests/` | vitest project `cli` |
| Static | Types across the three workspaces | `npm run typecheck` |
| Style | Headers, sections, folders | `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-loop packet driver and checker flags | Internal | Green | Loop cannot run |
| `pi` with the `opencode-go` credential | External | Green | Fall back to the cline provider |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a merge leaves a scoped suite below baseline and the cause is not a known flake.
- **Procedure**: move the merge's paths back with `git mv` and restore the importers; loop edits revert per file from their snapshots in the deep-loop packet's `scratch/loop-state/runs/`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scoped baseline ──► Loops (header, sections) ──► Renames and merges ──► README loop ──► lib/hooks merge ──► ARCHITECTURE refresh ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Loops | Scoped baseline | Merges |
| Merges | Loops, fact-check | README loop, ARCHITECTURE refresh |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Loops | Low per target | 321 DeepSeek briefs (254 header, 64 sections, 3 README) |
| Merges | Med to High | Six Opus steps; `lib/hooks/` reaches the most consumers |
| Verification | Low | Checker, typecheck, scoped suites |
| **Total** | | **Dominated by the header loop and the hooks merge** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Scoped vitest baseline recorded before the first edit
- [x] Checker default-mode output captured before the flag change

### Rollback Procedure
1. Stop the driver.
2. `git checkout -- .skilled/skills/system-spec-kit` for uncommitted work, or `git revert` the commit.
3. Rerun the scoped suites and confirm the baseline counts.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
