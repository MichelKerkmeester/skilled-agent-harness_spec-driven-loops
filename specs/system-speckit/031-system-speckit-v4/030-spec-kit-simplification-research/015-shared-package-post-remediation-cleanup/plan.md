---
title: "Implementation Plan: Shared package post-remediation cleanup"
description: "Re-check every round-two row against the main checkout, remove what has no consumer, compute the README's reader table from the code, add the assertions the lane found missing, and prove it across the shared, CLI and runtime gates."
trigger_phrases:
  - "shared cleanup plan"
  - "reader table computed"
  - "socket name assertion"
  - "utility tests added"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Shared package post-remediation cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript shared package with script-style tests, vitest suites in the runtime and CLI, one JSON baseline |
| **Framework** | None |
| **Testing** | Shared `npm test`; CLI and runtime builds; the two suites that imported the moved symbols |

### Overview
Every round-two row was re-run in the main checkout: consumer counts for the cluster, the type and the scoring module; file existence for the manifest's `main`; the parity test for the baseline rows. The removals went first so the builds would confirm them; the README's reader table was then generated from the files that read each variable rather than typed by hand; the new tests and the socket assertion followed in the package's own script style.
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
A manifest names only what exists; a module stays only with a consumer; a document's table is derived from the code it describes.

### Key Components
- **`shared/package.json`**: exports without a bare entry
- **`shared/ipc/socket-server.ts`**: the one home of the socket file name
- **`shared/README.md` §5**: reader columns computed from variable reads

### Data Flow
Variable name → files that read it → README cell. Socket name → server constant → test over the bin scripts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `main` field | Package entry | delete | shared build from clean |
| Profile cluster, extended type | Dead code | delete | shared, CLI and runtime builds; residue search |
| Scoring module and tests | Test-only code | delete | runtime build; index-scope suite |
| Reader table | Documentation | regenerate | sk-doc validator; the cells list every reading file |
| Socket name | Three literals | export and assert | shared test lane |

Required inventories:
- Same-class producers: `grep` for each removed symbol across the skill, the bin scripts and the advisor.
- Consumers of changed symbols: the tree-thinning test, the index-scope comment, the advisor's adapter re-exports.
- Matrix axes: package (shared, CLI, runtime) by gate (build, test).
- Algorithm invariant: every file that reads a group's variable appears in that group's cell.
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
| Unit | The shared lane with its two new tests; tree-thinning; index-scope | node --test, vitest |
| Integration | Shared build from clean; CLI rebuild and check; runtime build; dist freshness | tsc, npm |
| Manual | Residue search; sk-doc validator; the parity test's output | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lane 003's round-two census | Internal | Green | Nothing to clean without it |
| Child 009's removal | Internal | Green | These are its edges |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer of a removed symbol surfaces outside the trees searched
- **Procedure**: `git revert` the single commit and rebuild the three packages
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
| Setup | Med | 40 minutes of census |
| Core Implementation | Med | 45 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **Under 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed
- [x] Feature flag configured - none
- [x] Monitoring alerts set - the shared lane is the alert

### Rollback Procedure
1. `git revert` the commit
2. Rebuild shared, CLI and runtime
3. No stakeholders to notify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
