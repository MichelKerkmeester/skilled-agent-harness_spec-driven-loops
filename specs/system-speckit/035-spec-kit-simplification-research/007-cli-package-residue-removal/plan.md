---
title: "Implementation Plan: CLI package residue removal"
description: "Census every synthesis row against the whole repository, then remove the confirmed dead set, correct the records, unify the regex, and wire the gates into CI in one scripted pass staged by object id."
trigger_phrases:
  - "cli residue removal plan"
  - "reference census before deletion"
  - "stage by object id"
  - "spec kit check workflow plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI package residue removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, ESM and CommonJS JavaScript, shell, Markdown, YAML |
| **Framework** | None; plain Node scripts and vitest |
| **Storage** | None |
| **Testing** | vitest `--project cli`, the legacy module suite, `npm run check`, shared node tests |

### Overview
Every removal claim was re-derived with a repository-wide reference census before anything moved. The edits then ran as one literal-replacement script that aborts on any site it cannot find exactly once, the dead files went through `git rm`, the package was rebuilt so the dist-alignment check would see the orphans gone, and the same script was re-applied onto HEAD copies so the index carried only this phase's hunks while another session's uncommitted README sweep stayed in the working tree.
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
Surgical removal and record correction; one new CI workflow; no new module.

### Key Components
- **The reference census**: `rg` over `.opencode`, `.github` and the root with `specs/`, changelogs, benchmark reports, `dist/` and `node_modules/` excluded, run once per candidate name before removal and once more after
- **`lib/validator-registry.json`**: the one live registry the corrected documents now point at
- **`.github/workflows/spec-kit-check.yml`**: builds the three packages, then runs `npm run check`, `typecheck`, the shared tests, the CLI vitest project and the five mirror checks

### Data Flow
Synthesis row → census → confirmed-findings disposition → scripted edit or `git rm` → rebuild → gates → HEAD-based re-application → index → commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Removed modules | No production importer | delete | residue census returns nothing outside excluded trees |
| `core/workflow.ts` | Imports the live scorer | unchanged | targeted vitest files pass |
| `lib/validator-registry.json` and the orchestrator | The live dispatch | unchanged | strict validation of this packet prints RESULT: PASSED |
| Folder-naming rule, child manifest check, resume ladder | Used the looser regex | update | `find specs -name '[0-9][0-9][0-9]--*'` returns nothing; validation of this program's packets passes |
| Deep-research playbook scenario | Named the removed copy as canonical | update | the scenario's commands resolve to files that exist |
| sk-doc code-folder fixtures | Listed the removed folders | update | JSON parses; entries gone |

Required inventories:
- Same-class producers: `rg -n 'coverage-graph-(core|session|signals|contradictions|convergence)'` found only the cluster, its tests and one playbook.
- Consumers of changed symbols: the census pattern in `implementation-summary.md` Verification, run before and after.
- Matrix axes: file class (module, test, fixture, document) by consumer class (import, spawn, doc pointer); every cell was swept.
- Algorithm invariant: a folder is a phase child only when its name matches `^[0-9]{3}-[a-z0-9][a-z0-9-]*$`, in every detector and every document.
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
| Unit | The six vitest files that touched removed modules, then the whole CLI project | vitest |
| Integration | `npm run rebuild`, `npm run check`, dist freshness, the legacy module suite, the shared tests | npm, node |
| Manual | Residue census; staged-diff review for foreign hunks | rg, git diff --cached |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Confirmed findings from 002 | Internal | Green | Nothing to remove without it |
| A rebuilt runtime dist | Internal | Green | The dist-alignment check would report false orphans |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer of a removed module surfaces, or a workflow run shows a gate this phase misread
- **Procedure**: `git revert` the single commit and rebuild the CLI package
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 1 hour of census |
| Core Implementation | Med | 1.5 hours |
| Verification | Med | 30 minutes, dominated by the full vitest run |
| **Total** | | **About 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; git history holds every removed file
- [x] Feature flag configured - none exists for removals
- [x] Monitoring alerts set - the new workflow is the alert

### Rollback Procedure
1. `git revert` the removal commit
2. `npm run rebuild` in the CLI package
3. Rerun `npm run check` and the CLI vitest project
4. No stakeholders to notify; the surfaces are internal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
