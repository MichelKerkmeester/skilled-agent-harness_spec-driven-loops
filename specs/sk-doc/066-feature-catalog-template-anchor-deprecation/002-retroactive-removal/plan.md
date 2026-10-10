---
title: "Implementation Plan: Phase 2: retroactive-removal"
description: "Remove every copy of the template-name comment from the feature catalogs with one deterministic script, then patch-bump each owning skill and regenerate derived artifacts."
trigger_phrases:
  - "retroactive removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: retroactive-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 script, Markdown |
| **Framework** | sk-doc feature catalogs |
| **Storage** | None |
| **Testing** | `validate_catalog_package.py`, `validate_document.py`, `validate_skill_package.py`, compiled-route guard, Hermes and trigger index checks |

### Overview
Take a census and a validator baseline, run `scratch/remove_template_anchor.py` once over every tracked feature catalog file, then compare the validator output with the baseline. Patch-bump each owning unit with a changelog entry and regenerate the derived artifacts with the repository's own generators.
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
Other: one-shot documentation migration.

### Key Components
- **Sweep script**: lists catalog files with `git ls-files`, drops each marker line and the blank line after it, refuses files where a copy remains, writes a JSON report.
- **Version carriers**: `SKILL.md` for every unit, plus `ROUTER.md` and three JSON files for hubs.

### Data Flow
Census, then baseline, then the single script run, then validator comparison, then version bumps, then derived regeneration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Feature catalog files | Hold the copies | Update | Repository grep returns no match |
| Catalog and document validators | Check catalogs | Unchanged, not a consumer | Output identical to baseline modulo line numbers |
| Hub activation manifests | Fingerprint routing inputs including versions | Re-mint | Guard reports all hubs fresh |
| Hermes copies, trigger index | Derived from skill docs | Regenerate | Both `--check` modes pass |

Required inventories:
- Same-class producers: phase 1 removed the only producer.
- Consumers of changed symbols: none read the comment.
- Matrix axes: two spellings across 27 units.
- Algorithm invariant: a heading keeps exactly one blank line before its next section.
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
| Unit | Script syntax | `python3 -I -m py_compile` |
| Integration | All catalog packages and documents | `validate_catalog_package.py`, `validate_document.py` |
| Manual | Heading spacing and sample diffs | Scan of the 548 files, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 template change | Internal | Green | New catalogs would still get the comment |
| Manifest, Hermes and trigger index generators | Internal | Green | Derived artifacts would drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator result changes or a reader of the comment turns up.
- **Procedure**: `git revert` the phase commit, then rerun the manifest, Hermes and trigger index generators.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (census, baseline) ──► Core (sweep, bumps, regeneration) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Med | 1 hour |
| Verification | Med | 45 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, tracked files only
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. `git revert <phase commit>` in the worktree.
2. Rerun `compiled-route-manifest.cjs refresh` for the six hubs and copy each manifest to the authored root.
3. Rerun `sync-skills-hermes.cjs` and `generate-trigger-index.mjs`.
4. No stakeholder notice needed; nothing is published.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
