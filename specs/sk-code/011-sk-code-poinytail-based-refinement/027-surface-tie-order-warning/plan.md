---
title: "Implementation Plan: Surface tie order warning"
description: "Add doctor check 5l, scoped to the sk-code hub, that reports a user-added surface placed after sk-code-opencode in tieBreak, with three tests and one README sentence."
trigger_phrases:
  - "surface tie order warning plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Surface tie order warning

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` on `parent-skill-check-invariants.test.cjs`; the doctor `run-all.sh`; seven hub doctor runs |

### Overview
One function joins the hub-router checks after 5i. It reads two constants that name the native surface and the two examples (ADR-001) and reports a misplaced user surface with `softFail` (ADR-002). Three tests pin the behavior, and one README sentence covers the hand-edit path.
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
One more ordering invariant beside 5e and 5i, scoped by hub name like the existing hub-scoped constants

### Key Components
- **`checkNativeSurfaceLast`** in `parent-skill-check.cjs`: on sk-code, lists the surface modes after `sk-code-opencode` in `tieBreak` that are not examples
- **`checkHubRouter`**: calls it after `checkTieBreakOrder`

### Data Flow
`checkHubRouter` reads `routerPolicy.tieBreak` from `hub-router.json` and each mode's `packetKind` from `mode-registry.json`, then passes both to the new check, which prints one PASS or one soft-fail line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `checkHubRouter` hub-router checks | 5a to 5k | Update: adds 5l | The three tests; the seven hub doctors |
| `/create:skill-parent update --surfaces` | Places a new surface ahead of the existing surfaces | Unchanged | Its placement already satisfies 5l |
| Root README sk-code guide | Tells users how to add a surface | Update: one sentence for a hand edit | `grep -n "check 5l" README.md` |

Required inventories:
- Same-class checks: `grep -n "tieBreak" .skilled/commands/doctor/scripts/parent-skill-check.cjs` lists 5e and 5i as the only other `tieBreak` checks.
- Rule-id lists: `grep -rn "5i" .skilled --include=*.md` finds no doc that lists the doctor's check ids, so only the code's section heading names the range.
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
| Unit | The three 5l tests, run against the old and the new checker | `node --test` |
| Integration | The doctor suites and the seven hubs | `run-all.sh`, `parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 026 on origin/main | Internal | Green | The README guide block this phase extends |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hub doctor fails on a tree it passed before.
- **Procedure**: Revert this phase's build commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

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
| Setup | Low | Worktree, baseline, packet |
| Core Implementation | Low | One function, three tests, one sentence |
| Verification | Low | Suites, seven hubs, a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The seven hub doctor results and the invariants suite count recorded before the change

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the seven hub doctors.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
