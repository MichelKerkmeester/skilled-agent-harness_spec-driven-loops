---
title: "Implementation Plan: Phase 1: post-work-review"
description: "Ten angles, one per iteration, each naming a mechanism the program added and asking whether the tree supports what was claimed about it."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: post-work-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL state and status ledgers |
| **Testing** | Vitest |

### Overview
The program's own pattern was that every delegate which checked its brief against the tree found something wrong with it. This review inverts that: the briefs are the program's claims, and the reviewer's job is to find which ones the tree does not support.
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
Angle-driven adversarial review, one angle per iteration

### Key Components
- **Angles**: Ten, each naming a mechanism the program added
- **Reviewed-file list**: The one hundred and fifty changed files
- **Findings registry**: Merged across the ten iterations

### Data Flow
Each iteration reads its angle, measures against the tree, writes findings with file and line, and updates strategy for the next.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Confirm-variant census | Fourteen steps declared omitted with a reason | audit | each reason checked against the interactive flow |
| Ledger stem census | Fifty-six stems declared reserved | audit | each reserved stem checked for a producer |
| Agent crosswalk | Six trees described as authored, generated or symlinked | audit | each claim checked against the tree |
| Leaf-scope generator | Each mode scoped to its own leaves | audit | checked for a leaf a mode needs and no longer gets |
| Containment and severity rewrites | Comments corrected to match the code | audit | checked for overshoot as well as residue |
| Push parity check | Added to a shared gate | audit | checked for a defeat and for wrong blocking |

Required inventories:
- Same-class producers: thirteen phase records, each asserting what it measured and fixed.
- Consumers: the next reader of any of the one hundred and fifty files.
- Residuals: the concurrent session's commits share the branch and are out of scope.
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
| Review | Ten iterations, convergence off | cli-devin SWE-2 max |
| Closure | Every finding bound to a phase or refuted | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin with SWE-2 max | executor | Available | No review runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The review produces no usable findings
- **Procedure**: The phase records the run and closes; nothing in the tree changed
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
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | full suite run |
| **Total** | | **one dispatch plus one suite run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

