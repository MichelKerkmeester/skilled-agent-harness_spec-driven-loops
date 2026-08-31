---
title: "Implementation Plan: Phase 5: Integration and Lifecycle Contract"
description: "Contract the three wiring points a rule needs to be reachable, derived from the eight rules phase 1 wired by hand, then derive retire as the create path inverted and dry-run it against a shipped rule to confirm the router stays self-consistent."
trigger_phrases:
  - "wiring contract plan"
  - "retire path derivation"
  - "scope statement check"
  - "interruptible ordering"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: Integration and Lifecycle Contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference document |
| **Framework** | Phase 1's hand-wiring of eight rules is the only worked example |
| **Storage** | `.opencode/skills/sk-doc/sk-create-repo-rule/references/` |
| **Testing** | Dry-run create against a shipped rule; dry-run retire and check router self-consistency |

### Overview
Read what phase 1 actually did eight times, write it as a create path, then derive retire by inverting it and ordering the steps so an interruption never leaves a row pointing at a missing file. Retire has no precedent anywhere, so it is dry-run rather than reasoned about.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1's wiring inspectable across eight rules and two scope widenings
- [ ] The router's current row and file counts recorded, as the self-consistency baseline

### Definition of Done
- [ ] All three wiring points contracted with what is lost by skipping each
- [ ] Retire dry-run leaves the router self-consistent
- [ ] No path can touch `AGENTS.md` beyond a pointer
- [ ] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One document teaching both directions: retire is create inverted, in reverse order. Two separately-written procedures would drift.

### Key Components
- **Create path**: file first, then rows, then pointer - so an interruption leaves an unreferenced file rather than a dangling row.
- **Scope-statement check**: runs before the trigger row, because phase 1 hit that contradiction twice.
- **Retire path**: pointer, then rows, then file - the inverse order, for the same reason.
- **`AGENTS.md` boundary**: pointer is mechanical, everything else escalates.

### Data Flow
A wiring request arrives with an accepted rule; the contract decides which path, checks the scope statement, and orders the edits so every intermediate state is safe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `REPO RULES.md` | Trigger and index tables the contract describes | read-only this phase | Unchanged; the contract is written, not executed |
| `AGENTS.md` | Carries the governed-section pointers | read-only this phase | Unchanged |
| Phase 1's eight wirings | The worked example | read-only | Create path reproduces them |
| `references/agents-md-integration.md` | The contract | create | Three wiring points, three paths |
| `SKILL.md` | Carries deferral notes for revise and retire | modify | Deferrals replaced by pointers to this contract |

Required inventories:
- Same-class producers: all eight rules' router rows and pointers, to derive the create path from what happened rather than what was intended.
- Matrix axes: 3 paths x 3 wiring points x interrupted/complete.
- Algorithm invariant: after any path, row count equals file count and every link resolves.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns task state (T001-T013).

### Phase 1: Derive create
- [ ] Read the wiring of all eight shipped rules; record the three points and the order used

### Phase 2: Derive revise and retire
- [ ] Revise: what changes when the firing condition changes, and what happens to `version`
- [ ] Retire: create inverted, ordered so every interruption is safe

### Phase 3: Dry-run and wire
- [ ] Dry-run retire against a shipped rule on paper; confirm the router stays self-consistent
- [ ] Replace the `SKILL.md` deferral notes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reproduction | Create path reproduces a shipped rule's actual wiring | Compare against the live router rows |
| Inversion | Retire dry-run leaves row count equal to file count | Counted on paper, no edit |
| Interruption | Each path stopped at every step boundary leaves a safe state | Enumerate the intermediate states |
| Scope check | The check would have caught both phase-1 widenings | Replay both against it |
| Boundary | No path edits `AGENTS.md` beyond a pointer | Read the contract back |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1's eight wirings | Internal | Green | The create path would be invented |
| The router's current counts | Internal | Green | No self-consistency baseline |
| Phase 3's `SKILL.md` deferral notes | Internal | Green | Nowhere to land the contract |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the retire dry-run leaves the router inconsistent, meaning the ordering is wrong.
- **Procedure**: the phase writes one document and edits two hooks; `git checkout` reverts all three. Nothing has been executed against a real router, which is why the dry-run comes before any path ships.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 wirings --> Create path --> Retire path (inverted) --> Dry-run --> Wire into SKILL.md
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Derive create | Phase 1 | Derive retire |
| Derive retire | Create path | Dry-run |
| Dry-run | Retire path | Wire |
| Wire | Dry-run | Phase 6 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Derive create | Medium | 1-2 hours reading eight wirings |
| Derive revise and retire | Medium | retire has no precedent |
| Dry-run and wire | Low | under an hour |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Router row and file counts recorded as the baseline
- [ ] Confirmed nothing in this phase executes against a real router

### Rollback Procedure
1. `git checkout` the contract and the two hooks
2. Confirm `REPO RULES.md` and `AGENTS.md` are untouched

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->

---

