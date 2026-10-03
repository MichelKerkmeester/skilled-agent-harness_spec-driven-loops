---
title: "Implementation Plan: Phase 47: measure-every-jev-feature"
description: "Runs each of the 15 unmeasured scorers on confirmed labels and records its verdict or stop line. Labels come from the delegated arbiter, thin corpora get fixture sets, and live calls go through the Jev official provider."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 47: measure-every-jev-feature

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js scorers (.cjs, .mjs, .ts) and one Python scorer |
| **Framework** | None. Each scorer is a standalone CLI |
| **Storage** | Label files and run outputs under `~/.skilled/.labels/`, results in `scratch/evidence/` |
| **Testing** | Each scorer's own suite, run only when its code changes |

### Overview
Runs each of the 15 unmeasured scorers on confirmed labels and records its verdict or stop line. Labels come from the delegated arbiter, thin corpora get fixture sets, and live calls go through the Jev official provider.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one measurement pass per scorer

### Key Components
- **Delegated arbiter**: a fresh Opus 5.5 medium labeler that settles each row, per 042's ADR-001
- **Scorer runs**: each feature's own CLI with `--jev --out`, or its zero-call gate

### Data Flow
Source rows or a fixture set, then arbiter labels, then the scorer's gate, then a live Jev run or a zero-call stop, then one row in `results.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Each scorer | Owns its gate and verdict | Unchanged unless a defect stops its run | The scorer's suite |
| The benefit overview | Reads `results.md` | Updated at close | The resent overview |

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
| Unit | A scorer changed to fix a run-stopping defect | Its own suite |
| Integration | Each live run | `--jev --out` under the official provider |
| Manual | Result rows against scorer output | `grep` of the run log |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Jev official provider | External | Green | No live run without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scorer fix breaks its suite
- **Procedure**: `git revert` the fix commit. Label files and run outputs live outside the repository and need no revert
<!-- /ANCHOR:rollback -->

---


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
| Setup | Low | Under 1 hour |
| Labels and runs | High | Several hours |
| Verification | Med | 1 to 2 hours |
| **Total** | | **One working session or more** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop the run in progress
2. `git revert` any scorer fix
3. Rerun the reverted scorer's suite
4. Record the stop in the goal log

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

