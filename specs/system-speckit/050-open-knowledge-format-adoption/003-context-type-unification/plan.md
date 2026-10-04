---
title: "Implementation Plan: Phase 3: context-type-unification"
description: "One JSON file holds the document and session contextType lists and the importance_tier list; every checker reads it, generators and outlier docs are fixed first, and a warn rule lands silent."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: context-type-unification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (spec-kit shared and CLI), Bash plus Node (validator rule), Python (sk-doc validator), ESM JavaScript (advisor checker) |
| **Framework** | spec-kit validator registry; vitest and `node --test` |
| **Storage** | One JSON data file, `shared/frontmatter-values.json` |
| **Testing** | `shared` tests, CLI vitest, a corpus sweep with the new rule's helper |

### Overview
One JSON file holds the document `contextType` list with its aliases, the session list and the `importance_tier` list with its aliases. `context-types.ts` re-exports it, and every checker reads it. A TypeScript constant alone fails because `validate_document.py` cannot import TypeScript and the advisor's CI checker runs without a build. Generators and outlier docs are fixed first, so the new warn rule starts silent on the existing corpus.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One data file, read by every language that checks frontmatter.

### Key Components
- **`shared/frontmatter-values.json`**: document `contextType` values and aliases, session values, `importance_tier` values and aliases.
- **`shared/context-types.ts`**: keeps its current exports, including the unchanged `LEGACY_CONTEXT_TYPE_ALIASES` that migration uses, and adds `SESSION_CONTEXT_TYPES`, `DOCUMENT_CONTEXT_TYPE_ALIASES`, `IMPORTANCE_TIERS` and `IMPORTANCE_TIER_ALIASES`.
- **`FRONTMATTER_VALUES` rule**: a warn-severity rule that checks every top-level packet doc.
- **Checkers**: `validate_document.py` and `check-skill-doc-frontmatter.mjs` read the JSON.

### Data Flow
The JSON is read by `context-types.ts`, then the CLI lists, the new rule, the Python validator and the advisor checker. Values outside it produce a warning that names the file, the key, the value and the value to use.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/context-types.ts` | Document list, one runtime importer (`frontmatter-migration.ts:15`) | Re-export the JSON, keep existing exports | `shared` tests |
| `input-normalizer.ts:1133,1261` | Session list (10) and tier list | Import shared lists | CLI vitest |
| `session-extractor.ts:154,576` | Tier list and session list (11) | Import shared lists | CLI vitest |
| `frontmatter-migration.ts:98` | Tier list | Import shared list | CLI vitest |
| `check-skill-doc-frontmatter.mjs:36-39` | CI value check, error severity | Read the JSON, aliases legal | `--coverage` run stays at 0 violations |
| `validate_document.py` | Presence checks only | Warn on values outside the list | Python run on fixtures |
| `/create:*` assets, spec-kit templates | Seed values | Emit canonical values or aliases | Sweep of generated docs |
| Advisor `doc-frontmatter.ts` tier weights | Ranking weights, not a check | Unchanged, so ranking cannot move | Advisor suite before and after |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | Shared lists, alias resolution, session values kept | `npm test` in `shared` |
| Integration | CLI behavior on `review`, `planning`, `debugging`, `decision` | CLI vitest |
| Rule | Warn on an outlier fixture, silent on a clean one | Rule fixture run |
| Corpus | Zero new warnings over every packet and skill doc | Sweep with the rule helper |
| Regression | Advisor suite and the advisor `--coverage` check | Before and after counts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Decisions D1 and D4 | Internal | Green: approved 2026-10-04 | None |
| Worktree build of `shared` and `runtime/cli` | Internal | Green | Tests cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A CLI test that passed before fails, the advisor suite result moves, or the sweep shows a new warning.
- **Procedure**: Revert this phase's working-tree changes. Nothing is committed without an operator instruction.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline tests ──► Shared JSON ──► Importers ──► Rule + checkers ──► Generators + cleanup ──► Sweep
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Everything |
| Shared JSON and importers | Baseline | Rule and checkers |
| Generators and cleanup | Rule helper | Sweep |
| Sweep and regression | All above | Phase 007 docs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Baselines |
| Core Implementation | Med | Six code files, one rule, one data file |
| Verification | Med | Corpus sweep and advisor suite |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolates the change
- [ ] Baseline test counts captured before the first edit
- [ ] Corpus sweep clean before the rule is registered

### Rollback Procedure
1. Remove the `FRONTMATTER_VALUES` registry entry.
2. Revert the importers to their literal lists.
3. Restore cleaned docs with `git checkout`.

### Data Reversal
- **Has data migrations?** No. Cleanup edits frontmatter values in tracked files only.
- **Reversal procedure**: `git checkout -- <files>`
<!-- /ANCHOR:enhanced-rollback -->

---
