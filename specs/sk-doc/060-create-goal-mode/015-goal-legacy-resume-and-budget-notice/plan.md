---
title: "Implementation Plan: Phase 15: goal-legacy-resume-and-budget-notice"
description: "Let resume clear a suppression an older version set, print one line when a budget is recorded, correct the limitation text that named the wrong cleanup, and run the OpenCode autonomy claim live."
trigger_phrases:
  - "goal legacy resume budget notice plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: goal-legacy-resume-and-budget-notice

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) |
| **Framework** | The OpenCode goal plugin and its `node --test` suites |
| **Storage** | Per-session goal records under `.skilled/skills/.state/goal/` |
| **Testing** | `node --test .opencode/plugins/tests/opencode-goal-*.test.cjs` and one live OpenCode run |

### Overview
Build a record the way the old plugin left it in a failing test first, make resume clear it, add the budget notice with its own test, correct the limitation text, then run the live autonomy proof.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The retired suppression reasons are named from the plugin code

### Definition of Done
- [ ] All acceptance criteria met (AC-002, the live run, is a SKIP)
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [x] The goal suites and the shared hook suites pass at their baselines
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A small in-place change to one plugin, with tests.

### Key Components
- **opencode-goal.js resume path**: Clears a suppression set by a retired reason.
- **opencode-goal.js budget path**: Prints the notice.

### Data Flow
The operator runs resume or sets a budget. The plugin reads the record, clears a retired suppression or prints the notice, and writes the record back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| opencode-goal.js resume | Handles paused, usage-limited and budget-limited records | Also clears a retired-reason suppression | Lifecycle test with a legacy-shaped record |
| opencode-goal.js budget option | Records the figure | Prints one line | Capabilities test |
| goal-plugin.md and goal-opencode.md | Operator contract | Update | `rg` for the notice and the resume wording |
| 014 implementation summary | Limitation 2 | Correct | Reread after the edit |

Required inventories:
- Same-class producers: `rg -n "continuationSuppressed|suppressionReason" .opencode/plugins/opencode-goal.js` lists every place a suppression is set or read.
- Consumers of `--budget`: `rg -n -e "--budget" .skilled .opencode specs --glob "!**/changelog/**"`.
- Matrix axes: record state (paused, usage-limited, budget-limited, legacy-suppressed, active), autonomy (off, on).
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
| Unit | Resume over each record state and the budget notice | `node --test` |
| Live | Autonomy off and on past turn 8 | OpenCode with a cheap model |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 014 plugin state | Internal | Green | Nothing to resume |
| OpenCode and a model for the live run | External | Yellow | The live run is a SKIP and REQ-002 stays Unmet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A goal suite drops below baseline or resume clears a suppression that was not retired.
- **Procedure**: Revert the phase diff and the one line in the phase 14 summary. No stored record is rewritten except by an operator resume.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Failing test ──► Resume change ──► Budget notice ──► Docs ──► Live run
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tests and plugin change | None | Docs and live run |
| Live run | Plugin change | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Low | 2 to 3 hours |
| Verification and live run | Med | 2 to 3 hours |
| **Total** |  | **5 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines for the OpenCode goal suites and the shared hook suites recorded
- [x] Retired suppression reasons named

### Rollback Procedure
1. Revert the diff.
2. Rerun the goal suites.
3. Confirm a paused goal still resumes as before.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
