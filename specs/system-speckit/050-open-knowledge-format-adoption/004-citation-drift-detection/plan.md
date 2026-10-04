---
title: "Implementation Plan: Phase 4: citation-drift-detection"
description: "Extend cite-drift-scan.mjs in place with a corpus option, a moved class from a checked-in redirect table and a basename-only class; keep the default run zero-model and write-free; add a doctor summary."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: citation-drift-detection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM JavaScript (`cite-drift-scan.mjs`), one JSON redirect table |
| **Framework** | `node --test` fixture repositories |
| **Storage** | `cite-drift-redirects.json` beside the scanner |
| **Testing** | `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` |

### Overview
The scanner gains a `--corpus` option (`skills`, the default, `specs` or `all`), a `moved` class resolved through a checked-in redirect table of path prefixes derived from the git rename record, and a `basename_only` class that replaces today's silent success on a unique basename. The default run stays zero-model, credential-free and write-free. `/doctor:speckit` then shows a read-only summary.
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
Extend the existing scanner in place. A separate module fails no requirement today, so it is not added.

### Key Components
- **`resolveCitation`**: gains `moved` and `basename_only` results. Phase 005 imports it.
- **`cite-drift-redirects.json`**: prefix rules such as `.opencode/skill/` to `.skilled/skills/`, each checked against the git rename record.
- **`buildCensus`**: reads the chosen corpus and splits counts by doc family.

### Data Flow
Tracked files at HEAD and the redirect table go in. Per-family counts of in range, past end, moved, basename only, ambiguous and gone come out, with the commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveCitation` (`cite-drift-scan.mjs:230-257`) | Accepts a unique basename as resolved | Report `basename_only` and `moved` | Fixture tests |
| `drawRows` and the labeled arm | Draw from in-range pools | Unchanged pools; basename-only rows leave the in-range pool | Existing tests stay green |
| `/doctor:speckit` `speckit-retrieval` route | Retrieval checks | One read-only scanner call added | Route tests |

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
| Unit | Resolver classes, redirect rules, corpus filter | `node --test` fixtures |
| Regression | Default run makes no call, reads no credential, writes nothing | Existing guard tests |
| Census | `--corpus all` on the repo, rerun on the same commit | Compare outputs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Decisions D3 and D4 | Internal | Green: approved, D3 condition 3 deferred | None |
| Phase 002 labeled sample | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scanner test that passed before fails, or the default run writes a file.
- **Procedure**: Revert the scanner, its tests and the redirect table. Nothing is committed without an operator instruction.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline tests ──► Resolver classes ──► Corpus option ──► Census ──► Doctor summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Resolver classes | Baseline | Census, phase 005 |
| Census | Corpus option | Phases 009 and 010, which measure and harden it |
| Doctor summary | Census | Phase 007 docs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Baseline test run |
| Core Implementation | Med | One script, one table, tests |
| Verification | Low | Census rerun |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolates the change
- [ ] Baseline scanner test count captured
- [ ] Default run proven write-free after the change

### Rollback Procedure
1. `git checkout` the scanner and its tests.
2. Delete `cite-drift-redirects.json`.
3. Rerun the scanner tests.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
