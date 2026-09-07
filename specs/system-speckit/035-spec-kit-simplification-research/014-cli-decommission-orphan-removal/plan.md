---
title: "Implementation Plan: CLI decommission orphan removal"
description: "Re-check every removal row with relative imports included, remove what nothing reaches, correct the leftover lines, then run the three test lanes, repair what had rotted, and wire the two missing lanes into CI."
trigger_phrases:
  - "orphan removal plan"
  - "relative import census"
  - "test lane repair plan"
  - "ci lanes wired"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI decommission orphan removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript CLI package, bash and Node legacy test suites, GitHub Actions |
| **Framework** | None |
| **Testing** | Rebuild and check gate; the CLI vitest project; the legacy and validation lanes |

### Overview
The lane's no-importer claims were re-run with relative imports included, which turned two removal rows into kept rows before any file moved. The removals went in one pass with their README and catalog rows; the first rebuild confirmed the import census. The three test lanes were then run as the gate, and the two that CI never ran failed for four separate reasons that were each traced and repaired; the workflow gained the lanes so they cannot rot again.
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
A file stays when a reader, relative or workspace, or a document naming it as a tool exists; otherwise it goes with every row that named it.

### Key Components
- **The CLI barrel and READMEs**: the rows that mirror the file set
- **`test-scripts-modules.js`**: the legacy lane that loads modules by path
- **`spec-kit-check.yml`**: the workflow that now runs every lane `npm test` runs

### Data Flow
Census → removal → rebuild → three lanes → CI.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Eight orphan files | Dead code and a dead test | delete | rebuild exit 0; residue search over code, workflows and documents |
| `utils/index.ts` | Barrel | update | rebuild; the two barrel consumers import unrelated names |
| Legacy module lane | `npm test` lane | update | exit 0 with 262 passes |
| Validation lane | `npm test` lane | update | three suites exit 0; the frozen fixture passes with its documented warning |
| Workflow | CI | update | YAML parse; the next push |

Required inventories:
- Same-class producers: `grep` for every removed basename across `.opencode`, `.github` and the skill's documents, changelogs excluded.
- Consumers of changed symbols: the barrel's two consumers; the legacy test's two removed blocks; the suites that copy the compliant fixture.
- Matrix axes: lane (vitest, legacy, validation) by environment (local, CI).
- Algorithm invariant: a fixture's derived fingerprint equals the runtime's re-derive over its documents.
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
| Unit | The CLI vitest project | vitest |
| Integration | Rebuild, check gate, dist freshness, the legacy and validation lanes, the suites that pin the compliant fixture | npm, bash |
| Manual | Residue search; sk-doc validator on touched READMEs | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lane 002's round-two census | Internal | Green | Nothing to remove without it |
| The runtime's fingerprint function in the built dist | Internal | Green | The fixture could not be restamped without touching its documents |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer of a removed file surfaces
- **Procedure**: `git revert` the single commit and rebuild
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
| Setup | Med | 45 minutes of census |
| Core Implementation | Med | 1 hour |
| Verification | Med | 45 minutes, most of it the lane repairs |
| **Total** | | **About 2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; history holds the removed files
- [x] Feature flag configured - none
- [x] Monitoring alerts set - the CI lanes are the alert

### Rollback Procedure
1. `git revert` the commit
2. Rebuild the CLI
3. No stakeholders to notify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
