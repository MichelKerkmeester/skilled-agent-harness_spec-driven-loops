---
title: "Implementation Plan: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-skill-advisor)"
description: "Run the deep-loop packet's DeepSeek loop driver over the skill-advisor runtime in header, sections and readme modes, then land the fact-checked folder merges, the cosine-test move, the search-quality deletion and the double-underscore renames one at a time with tests after each."
trigger_phrases:
  - "skill advisor runtime alignment"
  - "advisor folder merges"
  - "advisor alignment loop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-skill-advisor)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime; bash loop driver and Python checks borrowed from the deep-loop packet |
| **Framework** | Node.js, vitest |
| **Storage** | None; loop state is a plain-text done list in the deep-loop packet's `scratch/loop-state/` |
| **Testing** | `npm run typecheck` per 25 kept edits, the full vitest suite (about two minutes) per mode and after each merge |

### Overview
The prerequisites (checker flags, ARCHITECTURE template, loop driver) were built and proven in the deep-loop packet. This packet reuses the driver unchanged on `.skilled/skills/system-skill-advisor/runtime`, then applies the merges the SWE-2 MAX fact-check confirmed. Loop edits are comment-only by construction; the merges move files and rewrite importers, so each one is followed by the typecheck, the full suite and an `rg` for the old path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (census counts and the 963 passed / 8 failed baseline)
- [x] Dependencies identified (the deep-loop packet's driver and checker flags)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] vitest at the baseline, plus the moved cosine test running
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator plus cheap leaf workers, as in the deep-loop packet. DeepSeek V4.1 Flash at `high` through cli-pi does the per-file comment edits and the two READMEs; Opus does the merges, renames and the ARCHITECTURE refresh.

### Key Components
- **Loop driver**: `align-loop.sh system-skill-advisor <header|sections|readme>` in the deep-loop packet's `scratch/`.
- **Comment-only proof**: `align_loop_checks.py comment-only` compares the file with comments and whitespace stripped, and rejects added tool directives.
- **Merge table**: `scratch/investigation/devin-swe2max-merge-factcheck.md`, with CONFIRMED and REJECTED rows.

### Data Flow
1. The driver lists targets from the checker, dispatches one brief per target, and keeps an edit only when it is comment-only, touches nothing outside the target, and the checker no longer flags the target.
2. A rejected edit is restored from the pre-dispatch snapshot, so an earlier mode's uncommitted edit survives.
3. After the loops, each merge runs alone: `git mv`, importer rewrite, README fold-in, typecheck, full suite, `rg` for the old path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime source files | Executed code | Comment-only edits | Comment-only proof per file, typecheck per batch |
| `lib/context/`, `lib/corpus/`, `lib/routing/`, `tests/utils/` | Import paths | Merge up one level, rewrite importers | `rg` for the old path returns nothing; suite at baseline |
| `lib/routing/` config lookup | `CONFIG_DIR_CANDIDATES` resolves relative to the module | Rewrite for the new depth | A test that the route denylist still loads |
| `tests/__fixtures__/`, `tests/__shared__/` | Test fixtures | Rename into `tests/fixtures/` | Referencing files repointed; suite at baseline |
| `lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` | Test outside the vitest include | Move to `tests/scorer/` | vitest now collects and passes it |

Required inventories:
- Consumers of each moved folder: `rg -n '<folder-name>' .skilled/skills/system-skill-advisor` over code, configs and `.md` links, recorded in the merge fact-check.
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
| Unit | Whole advisor runtime | `npx vitest run` from `runtime/` |
| Static | Types | `npm run typecheck` |
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

- **Trigger**: a merge leaves the suite below baseline and the cause is not a known flake.
- **Procedure**: `git checkout` or `git mv` back the merge's paths; loop edits revert per file from their snapshots in the deep-loop packet's `scratch/loop-state/runs/`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Deep-loop prerequisites ──► Loops (header, sections, readme) ──► Merges ──► ARCHITECTURE refresh ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Loops | Deep-loop packet driver | Merges |
| Merges | Loops, fact-check | ARCHITECTURE refresh |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Loops | Low per target | 77 DeepSeek briefs (33 header, 42 sections, 2 README) |
| Merges | Med | Seven Opus steps, one suite run each |
| Verification | Low | Checker, typecheck, suite |
| **Total** | | **Dominated by the merges** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] vitest baseline recorded before the first edit (963 passed / 8 failed)
- [x] Checker default-mode output captured before the flag change

### Rollback Procedure
1. Stop the driver.
2. `git checkout -- .skilled/skills/system-skill-advisor/runtime` for uncommitted work, or `git revert` the commit.
3. Rerun vitest and confirm the baseline count.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
