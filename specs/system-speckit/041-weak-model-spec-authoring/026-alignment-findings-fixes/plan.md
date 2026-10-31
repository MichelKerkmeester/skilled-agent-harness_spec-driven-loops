---
title: "Implementation Plan: Phase 26: alignment-findings-fixes"
description: "Fix the 18 alignment findings on the phase 25 commit in three parallel Opus medium lanes (code, system-spec-kit docs, sk-doc and the changelog command), then run the conductor gates against the 025 CLI suite baseline."
trigger_phrases:
  - "alignment findings fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 26: alignment-findings-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, YAML workflows, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest in the system-spec-kit CLI, sk-doc `validate_skill_package.py` and `validate_catalog_package.py`, `rg` sweeps |

### Overview
Three Opus medium lanes run in parallel because they own disjoint files: Lane 1 the generator and its tests (F1 to F4), Lane 2 the system-spec-kit docs (F5 to F11), Lane 3 sk-doc and the changelog command (F12 to F16). The conductor then rebuilds the trigger index, syncs the Hermes mirror and runs the hub check, the CLI suite, strict validation and the S1 to S4 battery (F17, F18). The proof is the new refusal test, the two validators passing, and a CLI suite with no new failure against the 025 baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 18 items and their lanes are recorded in `scratch/items.md`, each confirmed by a command in at least one alignment run
- [x] The baseline is the 025 CLI suite in `../025-deprecate-nested-changelogs/scratch/after/cli-suite.txt`: 191 files passed and 3 skipped, 2241 tests passed and 20 skipped; the tree has not changed since `5b9509576a`

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] `npx vitest run --config vitest.config.ts --project cli` from system-spec-kit prints at least 2241 passed and 0 failed
- [ ] `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer: the generator refuses, and the docs follow the code.

### Key Components
- **Generator**: `nested-changelog.ts` gains an existence check before it writes.
- **system-spec-kit docs**: `SKILL.md`, its references, catalog, playbook and unreleased entry describe the refusal.
- **Changelog command**: sk-create-changelog and the create-changelog workflows lose the last nested branch.

### Data Flow
`nested-changelog.js --write` resolves the output path, finds no file, throws, and writes nothing. An existing packet changelog still re-renders.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `writeNestedChangelog` in `nested-changelog.ts` | Creates the file and its folder with no existence check | update | the new vitest refusal case |
| `spec-root-registry.ts` line pointers | Name generator lines for the spec-root audit | update | `rg -n "nested-changelog.ts:"` lines match `rg -n` on the named functions |
| Docs that describe `--write` | Tell a reader what the generator does | update | `rg -n -- "--write"` over the two skills shows only re-render and refuse wording |
| `/speckit:complete` router load | Loads `nested-changelog.md` through the COMPLETE intent | update | RESOURCE_MAP read after the edit |
| The 64 existing packet changelogs | History, re-rendered only on request | unchanged | `git status` on `specs/**/changelog/` prints nothing |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup records the baseline, Implementation runs the three lanes, and Verification runs the conductor gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The `--write` refusal and the seeded write case | vitest `nested-changelog.vitest.ts` |
| Integration | The CLI suite, the phase scaffold assertion | vitest `--project cli` |
| Manual | Package and catalog validators, YAML parse, trigger index check, S1 to S4 battery | `validate_skill_package.py`, `validate_catalog_package.py`, `generate-trigger-index.mjs --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The system-spec-kit CLI build | Internal | Green | The refusal does not reach `dist` and the suite tests stale code |
| The sk-doc validators | Internal | Green | F5 and F8 cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a caller depends on `--write` creating a new packet changelog, or the suite shows a new failure.
- **Procedure**: revert the phase commit. Every change is an edit to a tracked file, so nothing else needs restoring.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation (3 lanes in parallel) ──► Verification (conductor)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | The 025 baseline | Verification |
| Verification | All three lanes and the rebuilt CLI | Close |
<!-- /ANCHOR:phase-deps -->
