---
title: "Implementation Plan: Rule headers, registry coverage and playbook paths"
description: "Census every round-three row of the lane in the main checkout, apply the code fixes behind their tests, correct the documents in one literal pass, and run the lanes."
trigger_phrases:
  - "registry coverage test plan"
  - "remediation plan"
  - "round three plan"
  - "census then fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rule headers, registry coverage and playbook paths

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash scripts, TypeScript, CommonJS, YAML workflows, Markdown |
| **Framework** | None |
| **Testing** | The runtime and CLI vitest projects, the legacy and validation lanes, the shared package tests, strict validation |

### Overview
Every row was re-read in the main checkout first; the placeholder-convention row did not reproduce and is recorded. The coverage test was written before the headers changed, so its first failure was a real finding and not an artifact of the edits.
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
One authority per fact; a document says what the code does, never the reverse.

### Key Components
- The files under Files to Change in `spec.md`

### Data Flow
Census row → main-checkout read → fix or recorded reason → test → document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The files in `spec.md` | as named there | update, remove or document | the lanes named in Testing Strategy |

Required inventories:
- Same-class producers: searched by the census before each change.
- Consumers of changed symbols: searched across the skill, its neighbours and the bin scripts before each removal.
- Matrix axes: one row per census finding.
- Algorithm invariant: no rule became less strict and no document claims what the code does not do.
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
| Unit | The suites named in `implementation-summary.md` | vitest, node --test |
| Integration | The four lanes; strict validation over the program | npm, bash |
| Manual | Residue searches; the sk-doc validator on touched documents | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The lane's round-three census | Internal | Green | Nothing to fix without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lane goes red on the commit
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
| Setup | Med | 30 minutes of census |
| Core Implementation | Med | 1 hour |
| Verification | Med | 30 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed
- [x] Feature flag configured - none
- [x] Monitoring alerts set - the CI lanes are the alert

### Rollback Procedure
1. `git revert` the commit
2. Rebuild the runtime and the CLI
3. No stakeholders to notify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
