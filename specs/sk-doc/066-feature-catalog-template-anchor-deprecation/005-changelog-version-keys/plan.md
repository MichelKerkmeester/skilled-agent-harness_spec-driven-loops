---
title: "Implementation Plan: Phase 5: changelog-version-keys"
description: "A DeepSeek V4.1 Flash builder writes one script that inserts the missing version key and runs it once over the 28 touched units. The orchestrator verifies every added line against its file name, reruns the package validator and bumps each n"
trigger_phrases:
  - "changelog version keys plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: changelog-version-keys

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 script, Markdown frontmatter |
| **Framework** | sk-doc skill packages |
| **Storage** | None |
| **Testing** | `package_skill.py --check --strict`, `validate_document.py`, `check-frontmatter-versions.sh` |

### Overview
A DeepSeek V4.1 Flash builder writes one script that inserts the missing version key and runs it once over the 28 touched units. The orchestrator verifies every added line against its file name, reruns the package validator and bumps each non-hub unit.
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
Other: documentation remediation through a deterministic script and a DeepSeek V4.1 Flash builder.

### Key Components
- **Builder**: DeepSeek V4.1 Flash at max effort through cli-pi, one change per brief.
- **Verifier**: the orchestrator reruns every check the builder reports.

### Data Flow
Baseline, then a builder writes and runs the script once, then the orchestrator verifies, bumps versions and regenerates derived artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Changelog entries | Carry release frontmatter | Update | Every added line equals its file-name version |
| Package validator | Reports the missing key | Unchanged | Zero missing-version findings after |

Required inventories:
- Same-class producers: `/create:changelog` already writes the key on new entries, so only older entries lacked it.
- Consumers of changed symbols: no code parses the key; the validator and frontmatter gate check its presence.
- Matrix axes: 14 units, top-level and generation-folder entries.
- Algorithm invariant: the inserted value always equals the file name's version.
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
| Integration | Changed files | `package_skill.py --check --strict`, `validate_document.py`, `check-frontmatter-versions.sh` |
| Manual | Diff review | `git diff --numstat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek V4.1 Flash route | Internal | Green | The cline route or a DevPass reset wait |
| Hermes, manifest and trigger index generators | Internal | Green | Derived artifacts would drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator result regresses.
- **Procedure**: `git revert` the phase commit, then rerun the Hermes and trigger index generators.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline) ──► Core (builder run, bumps) ──► Verify
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
| Setup | Low | 15 minutes |
| Core Implementation | Low | 20 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **About 1 hour** |
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
2. Rerun `sync-skills-hermes.cjs` and `generate-trigger-index.mjs`.
3. Rerun the phase's validators.
4. No stakeholder notice needed; nothing is published.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
