---
title: "Implementation Plan: Phase 11: frontmatter-values-to-sk-doc"
description: "Move the document values and tiers into sk-create-frontmatter/assets, keep the session list as a literal in spec-kit, and repoint the four readers with a runtime read that works from source and from dist."
trigger_phrases:
  - "frontmatter values to sk doc plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: frontmatter-values-to-sk-doc

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node (CJS and ESM), Python, Bash |
| **Framework** | spec-kit shared module, spec-kit validator rule, sk-doc validator, advisor checker |
| **Storage** | One JSON file |
| **Testing** | node test runner, vitest, pytest-style Python tests |

### Overview
Record the baseline of every check. Create the new JSON without the session list. Repoint each reader in turn, one change per SWE 2 max brief, and rerun its tests before the next brief goes out. Delete the old file last, then update the docs that name its path.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One owner, many readers. `sk-create-frontmatter` owns the file, and each reader resolves it relative to its own location.

### Key Components
- **The value file**: `{ contextType: {canonical, aliases}, importanceTier: {canonical, aliases} }`.
- **`context-types.ts`**: reads the file at run time with `readFileSync`, walking up from its own folder to `.skilled/skills`, so the same code works from `shared/` and from `shared/dist/`. A static JSON import cannot cross the `rootDir` of the shared build.
- **The session list**: an 11-value literal beside the other session code, since it drives the save runtime's project phase and memory type.
- **The other three readers**: a path change each, plus their messages.

### Data Flow
`frontmatter-values.json` → `context-types.ts` → `input-normalizer.ts`, `session-extractor.ts`, `frontmatter-migration.ts`. The same file → the `FRONTMATTER_VALUES` helper, `validate_document.py` and the advisor checker.

### Executors
- **SWE 2 max** through cli-devin (`--model swe-2-max`): code changes, one change per brief that names the file, the edit and the check.
- The orchestrator writes the docs and reruns every check before recording it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `context-types.ts` | Exports the sets and maps | Runtime read, session literal | Shared tests, `dist` export check |
| Rule helper `.cjs` and `.sh` | `FRONTMATTER_VALUES` warning | New path | CLI vitest |
| `validate_document.py` | sk-doc warning | New path | sk-doc Python tests |
| `check-skill-doc-frontmatter.mjs` | Advisor tier check | New path | Advisor checker run |
| Docs naming the path | Point readers at the list | New path, new owner | `rg` for the old path |

Required inventories:
- Same-class producers: the four readers above are every file outside `specs/` that opens the list (`rg -l "frontmatter-values\.json"`).
- Consumers of changed symbols: `input-normalizer.ts`, `session-extractor.ts`, `frontmatter-migration.ts` through `@spec-kit/shared/context-types`.
- Algorithm invariant: every export holds the same values before and after.
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
| Unit | `context-types.ts` exports | `node --import tsx --test` on the shared tests |
| Unit | Rule helper | CLI vitest, `--project cli` |
| Unit | sk-doc validator | `test_frontmatter_values.py` |
| Build | `@spec-kit/shared` | `tsc --build`, then load `dist/context-types.js` |
| Corpus | Every tracked doc | Phase 008's sweep, expecting 0 warnings |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Devin auth | External | Checked before dispatch | The orchestrator asks the operator to log in |
| Phase 008's sweep script | Internal | Present in `008/scratch/corpus.py` | The corpus check is recorded as not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any check that passed before fails after.
- **Procedure**: Nothing is committed. `git restore` the tracked readers and recreate the old JSON from the new file plus the session list.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline ──► New file ──► Readers ──► Delete old ──► Docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Everything |
| New file and readers | Baseline | Delete old |
| Delete old and docs | Readers pass | Verify |
| Verify | Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readers | Medium | 1 hour |
| Docs | Low | 30 minutes |
| Verify | Low | 30 minutes |
| **Total** | | **2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): the old file's content is in phase 003's docs and this plan
- [x] Feature flag configured: not applicable, warn-only rules
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. `git restore` the tracked readers.
2. Recreate the old JSON.
3. Rerun the shared tests and the CLI vitest suite.
4. Nothing is user-facing until the operator commits.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
