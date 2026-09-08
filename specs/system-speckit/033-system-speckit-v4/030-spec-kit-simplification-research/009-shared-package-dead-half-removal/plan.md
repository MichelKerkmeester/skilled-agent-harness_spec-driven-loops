---
title: "Implementation Plan: Shared package dead half removal"
description: "Census every synthesis row against the real tree, remove what the census confirms dead, replace the sentinel derivation with a directory export, and rebuild all three packages before any commit."
trigger_phrases:
  - "shared removal plan"
  - "real tree census"
  - "telemetry directory export"
  - "three package rebuild"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Shared package dead half removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript across three npm workspaces, ESM output |
| **Framework** | None |
| **Storage** | The telemetry JSON store under `runtime/database/` |
| **Testing** | Node's test runner for shared, vitest for runtime and CLI, the CLI check gate |

### Overview
A Python walk over the real tree replaced the lane's worktree-bound census; each of the ten rows was confirmed, corrected or dropped against it. The edits ran as one literal-replacement script, the removals through `git rm`, and the three packages were rebuilt in dependency order so the dist-alignment check saw a consistent tree. Two corrections surfaced during the build and the residue sweep and were folded back before the commit.
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
Removal and seam repair; one new test; no new module.

### Key Components
- **`shared/config.ts`**: the one place the telemetry directory is derived, honouring the same override the skill advisor uses
- **`shared/embeddings/`**: the live provider stack, now the only embedding surface
- **`model-server-constants.test.ts`**: the parity assertion that replaced two "must stay byte-identical" comments

### Data Flow
Override env → `shared/config.ts` → telemetry directory → the Gate 3 classifier and the telemetry store. Ranked lists → `algorithms/rrf-fusion.ts` → the advisor's scorer. Provider env → `embeddings/factory.ts` → the advisor's provider.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Removed modules | No importer outside barrel and tests | delete | residue sweep returns nothing outside excluded trees |
| `shared/config.ts` readers | Took the sentinel's directory | update | `config.test.ts`, the runtime tests that exercise the classifier and the store |
| `runtime/core/config.ts` | Carried the database block | update | runtime build; the CLI config barrel never re-exported it |
| `shared/package.json` exports | Root and `./embeddings` entries | update | no importer of either remained; the CLI check gate passes |
| Documents naming removed members | READMEs, env template, reference, architecture | update | residue sweep; sk-doc validator on each README |

Required inventories:
- Same-class producers: the file walk over the real tree, per module name.
- Consumers of changed symbols: `DB_UPDATED_FILE` had two readers, both repointed; `WeightedDocumentSections` had one, now local; `HfLocalDtype` had two, both repointed.
- Matrix axes: consumer package (engine, CLI, hooks, advisor) by import mechanism (specifier, relative source, relative dist); every cell was searched.
- Algorithm invariant: the telemetry directory equals the directory the sentinel path used to sit in, under every override.
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
| Unit | Shared test lane including the new parity test; six runtime suites that touch the classifier, the store and discovery; the CLI regressions suite | node --test, vitest |
| Integration | Shared, runtime and CLI builds; `npm run check`; dist freshness; the env-reference drift guard; the full CLI vitest project | npm, node |
| Manual | Residue sweep; sk-doc validator on five READMEs | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Censused ledger from 003 | Internal | Green | Nothing to remove without it |
| `tsx` resolvable from the skill root | Internal | Green | The shared test lane cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer of a removed module surfaces, or the telemetry store lands in a different directory
- **Procedure**: `git revert` the single commit and rebuild the three packages in order
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
| Setup | High | 1.5 hours of census |
| Core Implementation | Med | 1.5 hours |
| Verification | Med | 30 minutes, dominated by the full CLI run |
| **Total** | | **About 3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; history holds every removed file
- [x] Feature flag configured - none exists for removals
- [x] Monitoring alerts set - the parity test and the drift guard are the alerts

### Rollback Procedure
1. `git revert` the removal commit
2. Rebuild shared, runtime and CLI in that order
3. Rerun the shared tests and the CLI check gate
4. No stakeholders to notify; the surfaces are internal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
