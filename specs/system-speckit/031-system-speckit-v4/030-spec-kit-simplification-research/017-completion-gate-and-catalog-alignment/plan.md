---
title: "Implementation Plan: Completion gate and catalog alignment"
description: "Census the fifteen rows, extend the completion checker and the sentinel first, add the freshness class, strip the links scan, then correct the documents in one literal pass and re-point the catalog."
trigger_phrases:
  - "completion gate plan"
  - "acceptance closure in checker"
  - "freshness malformed class plan"
  - "catalog re-pointing"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Completion gate and catalog alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash checker, CommonJS sentinel, TypeScript freshness rule, Markdown |
| **Framework** | None |
| **Testing** | Runtime and CLI vitest projects, legacy and validation lanes, strict validation |

### Overview
The rows were censused first, which showed child 016 had already moved the sentinel's gate and left the closure half open. The checker gained the acceptance read and a status the sentinel advises on; the freshness rule gained its class; the links scan lost its dead rule path. The documents changed in one literal-replacement script that aborts on any site it cannot find exactly once, and a path scan over the catalog decided which references to re-point and which to mark removed.
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
The checker owns the reading; the sentinel owns the advice. A new status is one branch in each.

### Key Components
- **`check-completion.sh`**: counts acceptance rows beside checklist items
- **`completion-evidence-sentinel.cjs`**: maps `AC_UNMET` to an advisory detail
- **`continuity-freshness.ts`**: classifies a present non-hex stamp

### Data Flow
Stop hook → sentinel → `check-completion.sh --json` → `status` and `acceptance` → advisory.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Completion checker | Checklist gate | extend | JSON smoke on a real packet and a temporary one; sentinel suite |
| Sentinel | Advisory | extend | Two new cases |
| Freshness rule | Strict-only attestation | extend | One new case; the hex and zero cases unchanged |
| Links scan | Orphan rule path | strip | `bash -n`; standalone run over the skill |
| Catalog | Feature inventory | re-point | Path scan returns only rows marked removed |

Required inventories:
- Same-class producers: every reader of `checklist.md`, `soft guidance`, `Enforcement is manual` and `context-index.md` under the skill was listed before the pass.
- Consumers of changed symbols: the sentinel is the checker's one JSON consumer; the freshness rule's code union has two test files.
- Matrix axes: status by acceptance state (present/absent × met/unmet/unbacked waiver).
- Algorithm invariant: `AC_UNMET` is reported only when the checklist itself would pass, and the counts are reported on every status.
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
| Unit | Sentinel and freshness suites | vitest |
| Integration | The four lanes; strict validation over the program | npm, bash |
| Manual | Checker smoke; catalog path scan; sk-doc validator | bash, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lane 005's round-two census | Internal | Green | Nothing to fix without it |
| Child 016's sentinel gate | Internal | Landed | The closure read would never run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the sentinel advises on closed packets, or the freshness warning fires on hex stamps
- **Procedure**: `git revert` the single commit and rebuild the CLI
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
| Verification | Med | 30 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed
- [x] Feature flag configured - the freshness rule stays behind its opt-in flag
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
