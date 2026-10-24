---
title: "Implementation Plan: Phase 27: goal-rebind-claude-and-codex"
description: "Build the Claude and Codex receiver paths from the phase 24 verdicts: render the chat slice from goal.md, send it only at packet_budget ok, and fall back to the fenced copy block when automation is not proven."
trigger_phrases:
  - "goal rebind claude codex plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 27: goal-rebind-claude-and-codex

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM hooks, CommonJS core) |
| **Framework** | Claude Code hooks and the Codex hook seed |
| **Storage** | None, the slice is read from `goal.md` each time |
| **Testing** | `node --test` over the relaunch suites plus one stub-runtime test per path |

### Overview
Render the slice, check its budget, and hand it over on the path the probes proved. Claude gets the command or the fenced block, and Codex gets a seed instruction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 024 verdicts read
- [ ] Phase 025 export exists

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] The gate passes in all three environments against the baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A shared helper with thin per-runtime hooks.

### Key Components
- **Slice helper**: Renders the `chat_slice` and applies the budget check.
- **Claude receiver hook**: Sends or requests the goal on the proven path.
- **Codex seed**: Asks the model to create the goal.

### Data Flow
The wrapper starts the receiver with the packet. The hook or seed calls the helper, which prints the slice only when the budget is ok. The receiver sets or requests the goal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| claude/ hooks and the hook registry | Claude receiver start | Add one hook or change the seed | Stub-runtime test per path |
| codex/prompt-seed.mjs | Codex receiver seed | Add one instruction | Seed text test |
| goal.cjs packet | Prints the chat slice and the budget | Unchanged, called | Its own test still passes |
| compact-pointer.mjs and the claim seed | Existing receiver text | Unchanged | Conformance suite still passes |

Required inventories:
- Same-class producers: `rg -n "prompt-seed|additionalContext" .skilled/hooks/session-relaunch` lists every place a receiver text is built.
- Consumers of the slice: the GOAL POSTURE RULE in `AGENTS.md` and `sk-create-goal` `budget-and-handoff.md` section 4.
- Matrix axes: runtime (two), path (up to three), budget ok or over, switch on or off.
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
| Unit | The helper and the seed text | `node --test` |
| Integration | A stub receiver per path | `node --test` |
| Manual | Live proof | Phase 028 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 024 verdicts | Internal | Yellow | Seed path only |
| Phase 025 export | Internal | Yellow | Tests set the variable by hand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A receiver sets a wrong or over-limit goal, or the relaunch gate drops below baseline.
- **Procedure**: Revert the phase diff and the hook registry rows, then regenerate the Claude settings rows.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Slice helper ──► Claude hook
       └────────► Codex seed
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Slice helper | None | Claude hook and Codex seed |
| Hook and seed | Helper, phase 024 | Phase 28 live proof |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 5 to 8 hours |
| Verification | Med | 2 hours |
| **Total** |  | **8 to 11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline gate recorded
- [ ] Phase 024 verdicts read
- [ ] Hook registry and generated settings rows identified

### Rollback Procedure
1. Revert the diff and the registry rows.
2. Regenerate the Claude settings rows.
3. Rerun the relaunch gate and a no-goal hop test.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
