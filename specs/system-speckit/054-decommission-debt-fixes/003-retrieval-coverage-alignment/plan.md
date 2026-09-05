---
title: "Implementation Plan: Phase 3: retrieval-coverage-alignment"
description: "Compare the trigger-index walker's roots and exclusions against the documented ripgrep recipes, converge or document every divergence, add a parity test, and prove two index regenerations hash identically."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: retrieval-coverage-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), Markdown documentation, `rg` |
| **Framework** | None - a corpus-walker module and a documentation file |
| **Storage** | `runtime/data/trigger-index.json` (generated), `scripts/retrieval/fixtures/corpus-manifest.json` (checked-in fixture) |
| **Testing** | Vitest for the new parity test; manual two-run hash comparison for determinism |

### Overview
Build the divergence table between `corpus.mjs` and `retrieval-conventions.md`, decide the install-guides/root-README/mirror coverage question, converge or document the exclusion policy, add a parity test, and regenerate the trigger index twice to prove determinism.
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
- [ ] Parity test passing
- [ ] Docs updated (spec/plan/tasks, `retrieval-conventions.md` if the recipe changes)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Compare-then-converge: read both lanes' current policy from source, tabulate every divergence, apply the decided fix to whichever side (or both) the decision names, then add a regression test that keeps them aligned.

### Key Components
- **`corpus.mjs`**: exports `CORPUS_ROOTS`, `EXCLUSIONS`, `IGNORED_PATHS`, `isExcludedDirectory`. This phase may widen `CORPUS_ROOTS` (if the coverage decision adds `.opencode/install-guides` or similar) or leave it unchanged and instead narrow the ripgrep documentation.
- **`retrieval-conventions.md`**: documents the ripgrep recipe's roots (`specs .opencode`) and exclusion globs (section 2, lines 92-115). This phase updates its glob list to match the decided exclusion policy, or narrows its root example if the decision keeps the trigger index authoritative for exclusions and root scope.
- **Parity test**: a new vitest file (or an addition to an existing retrieval suite) that imports `corpus.mjs`'s `EXCLUSIONS`/`CORPUS_ROOTS` and parses `retrieval-conventions.md`'s documented glob list, then asserts equivalence modulo the recorded divergence table.

### Data Flow
`corpus.mjs` source → divergence table (manual comparison, written into `spec.md`) → decision on coverage and convergence direction → applied to `corpus.mjs` and/or `retrieval-conventions.md` → `generate-trigger-index.mjs` regenerated twice → `corpus-manifest.json` fixture refreshed → parity test asserts the two lanes agree going forward.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `corpus.mjs` `CORPUS_ROOTS`/`EXCLUSIONS` | Defines the trigger index's walk scope | update if the coverage decision widens it; otherwise unchanged | `node generate-trigger-index.mjs` run twice, diff `corpusHash` |
| `retrieval-conventions.md` section 2 (lines 92-115) | Documents the ripgrep recipe's roots and exclusion globs | update to match the decided policy | Manual review of the updated recipe against the divergence table |
| `scripts/retrieval/fixtures/corpus-manifest.json` | Checked-in snapshot of the last trigger-index regeneration (28,116 paths, current exclusions) | regenerate after the policy change | `rg -n "corpus-manifest.json" scripts/tests` to find and re-run its consumers |
| New parity test | Does not exist yet | create | The test itself is the verification: it must fail on an injected divergence and pass on the converged state |

Required inventories:
- Same-class producers: `rg -n "CORPUS_ROOTS|EXCLUSIONS|isExcludedDirectory" .opencode/skills/system-spec-kit/scripts/retrieval` - confirms `corpus.mjs` is the only source of these constants (no duplicate definition elsewhere).
- Consumers of changed symbols: `rg -n "from './lib/corpus.mjs'|from '../lib/corpus.mjs'|require.*corpus.mjs" .opencode/skills/system-spec-kit/scripts` - every importer of the walker must still resolve after any root/exclusion change.
- Matrix axes: lane (trigger-index / ripgrep) × surface (root README.md / mirrors `.claude .codex .cursor .devin .pi` / `.opencode/install-guides` / `scratch` / `research/lineages` / `tests/fixtures`) - a 2×7 table naming each cell's current and decided coverage.
- Algorithm invariant: not applicable - this is a coverage-policy alignment, not a parser or resolver change; the invariant is that the two lanes' effective candidate sets over any unchanged input tree are either identical or the difference is named in the divergence table.
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
| Unit | The new parity test comparing `corpus.mjs` constants against the parsed `retrieval-conventions.md` glob list | Vitest |
| Integration | `generate-trigger-index.mjs` two-run determinism; existing retrieval suites that consume `corpus-manifest.json` | Node, Vitest |
| Manual | Diff the before/after `includedPathCount` and confirm it matches the coverage decision's expected delta | `generate-trigger-index.mjs` CLI output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs` (`compareCodeUnits`) | Internal | Green - already imported by `corpus.mjs` | Deterministic sort would need reimplementing if this changed |
| `scripts/retrieval/fixtures/corpus-manifest.json` consumers | Internal | Needs inventory (T-level task) before regeneration | Regenerating without checking consumers could silently break an unrelated fixture assertion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The parity test or the two-run hash check fails after the coverage/exclusion change lands.
- **Procedure**: Revert the `corpus.mjs` and/or `retrieval-conventions.md` diff and the regenerated `corpus-manifest.json` in one commit; the parity test itself is safe to keep since it does not assert a specific policy, only that the two lanes agree.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read both lanes, build divergence table) ──► Core (decide coverage, converge policy) ──► Verify (parity test + two-run hash)
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
| Setup | Low | Divergence table is already drafted in `spec.md`; confirming fixture consumers is the remaining step |
| Core Implementation | Med | Coverage decision plus applying it to one or both lanes and regenerating the manifest |
| Verification | Low | Parity test plus a two-run hash comparison |
| **Total** | | **Half a session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `corpus-manifest.json` (`includedPathCount: 28116`, current exclusion list) preserved for diffing
- [ ] Baseline two consecutive `generate-trigger-index.mjs` runs captured before this phase's change, to isolate any pre-existing nondeterminism
- [ ] Consumers of `corpus-manifest.json` inventoried before regeneration

### Rollback Procedure
1. Revert the `corpus.mjs`/`retrieval-conventions.md`/`corpus-manifest.json` commit.
2. Re-run `generate-trigger-index.mjs` twice and confirm the hash matches the pre-change baseline.
3. Re-run any fixture consumer suites identified in Setup and confirm their pass count is unchanged.
4. No stakeholder notification needed - internal retrieval-tooling change with no external contract.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - `runtime/data/trigger-index.json` is a fully regenerable artifact, not a migrated data store
<!-- /ANCHOR:enhanced-rollback -->

---
