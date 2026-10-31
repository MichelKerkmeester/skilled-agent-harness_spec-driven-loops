---
title: "Implementation Plan: Phase 12: goal-send-and-dedupe"
description: "Write the send rule and the cut order once in sk-create-goal, remove the author instructions from the goal templates at the source, then turn every system-spec-kit, speckit and runtime restatement into a pointer. The 060 parent goal is cut and resent last."
trigger_phrases:
  - "goal send rule plan"
  - "goal template instruction removal"
  - "goal nesting pointers"
  - "canonical cut order"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: goal-send-and-dedupe

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, Bash echo text, one CommonJS string |
| **Framework** | system-spec-kit templates and validators, sk-create-goal references, speckit command YAML, goal hooks |
| **Storage** | None |
| **Testing** | `node --test` for sk-create-goal and `goal-slice`, the scaffold golden snapshot in `vitest`, `check-goal.cjs`, `goal.cjs packet`, `validate.sh --strict` |

### Overview
Write the send rule and the cut order once, in sk-create-goal's `budget-and-handoff.md`. Remove the author instructions from `goal.md.tmpl` and its three asset copies at the source, so every new goal sends only its directive. Then replace each restatement in system-spec-kit, speckit, the `/create:goal` workflows and `AGENTS.md` with a pointer, correct the four factual divergences, and cut and resend 060's parent goal last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable, each with a baseline
- [x] Dependencies identified
- [x] The operator approved this scope, and open question 1 took the recommended default

### Definition of Done
- [x] All acceptance criteria met
- [x] sk-create-goal tests, `goal-slice` tests and the golden snapshot pass
- [x] Docs updated (spec/plan/tasks). The parent chat slice was not pasted, at the operator's request
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One owner per rule, pointers everywhere else. sk-create-goal owns how a goal is written, cut and sent. system-spec-kit owns the template file, the validator and the scaffolder. The goal hooks own binding, injection and the resend reminder.

### Key Components
- **Send rule**: `budget-and-handoff.md` section 4. What the chat slice removes and keeps, which text the limit measures, the `packet_budget=ok` precondition and older goals.
- **Cut order**: `budget-and-handoff.md` section 3, with a new first cut for legacy author instructions.
- **Precedence and amendment rules**: `parent-and-nested-goals.md` section 6.
- **Criteria rules**: `authoring-standards.md` section 4.
- **Authoring entry point**: `/create:goal` and its `phase-parent`, `phase-add`, `child`, `amend` and `retrofit` operations.

### Data Flow
`goal.md` → `goal.cjs packet` → durable slice, measured against 4,000 → chat slice, which only deletes from the durable slice → sent in chat when the report shows `packet_budget=ok`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `budget-and-handoff.md` sections 3, 4 and 6 | Partial send rule, cut order deferred to the playbook, stale figure | Make canonical | V1, V2, V8, V23 |
| `goal.md.tmpl` and three asset templates | Carry author instructions in the durable slice | Remove, add pointer comment | V3, V4, V7 |
| Golden snapshot | Pins the rendered instructions | Regenerate | V5, V6 |
| Set-string playbook, `validation-rules.md`, system-spec-kit `SKILL.md` | Restate cut order, send rule, retrofit recipe | Pointer | V8, V9, V20, V21, V22 |
| Speckit plan, implement, complete, resume YAMLs | Restate precedence, budget, payload, child rule | Pointer, plus `/create:goal` steps | V10, V11 |
| `AGENTS.md`, resend reminder | Session posture, runtime reminder | Shorten and point, key on `packet_budget=ok` | V13, V14, V24 |
| `create.sh` help and next steps | Imply a parent goal from `--phase --with-goal` | Correct the text, name `/create:goal` | V12, V18 |

Required inventories:
- Same-class restatements: `rg -n "playbook order|order the goal set-string playbook|set-string playbook's order|chat slice is over 4,000|when the slice is longer" .skilled AGENTS.md`.
- Pointer consumers: `rg -l "sk-create-goal|create:goal" .skilled/skills/system-spec-kit .skilled/commands/speckit/assets`.
- Matrix axes: goal kind (top-level, phase parent, phase child) times surface (template, asset, snapshot). All nine cells change together.
- Invariant: the chat slice is a deletion-only projection of the durable slice, so a parent at `packet_budget=ok` never sends more than 4,000 characters.
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
| Unit | Template parity, the goal checker, the reminder string | `node --test` on sk-create-goal (baseline 15 of 15) and `goal-slice.test.cjs` (baseline 21 of 21) |
| Integration | The rendered goal template | Scaffold golden snapshot in `vitest` |
| Measurement | Durable and chat sizes of the templates and the 060 parent | `goal.cjs packet`, the V7 one-liner |
| Search | Restatements gone, pointers present | The `rg` and `grep -c` counts in `acceptance-criteria.md`, each with a baseline |
| Manual | `AGENTS.md` diff and the resent chat slice | Line-by-line read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval of this scope | Internal | Green | Nothing starts |
| Operator answer to open question 1 | Internal | Green | Took the recommended default |
| `sync-skills-hermes.cjs`, `generate-trigger-index.mjs` | Internal | Green | Mirrors and index stay stale |
| Other sessions in the main checkout | Internal | Yellow | Stage only this phase's files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A parity, snapshot or hook test fails after commit, or a runtime sends a goal the operator did not expect.
- **Procedure**: `git revert` the phase commit, then rerun the sk-create-goal tests, the `goal-slice` tests and the golden snapshot.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines, open question) ──► Core (canonical text, templates, pointers) ──► Verify (tests, counts, resend)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator approval | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Medium | Three to four hours |
| Verification | Medium | About an hour |
| **Total** | | **About half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Nothing staged, and the diff holds only this phase's files
- [x] No feature flag needed
- [x] The parent measures 2,944

### Rollback Procedure
1. `git revert` the phase commit.
2. Rerun the three test suites and `check-goal.cjs` on the parent.
3. Resend the parent chat slice if the revert changed it.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. No goal file outside this packet is rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---
