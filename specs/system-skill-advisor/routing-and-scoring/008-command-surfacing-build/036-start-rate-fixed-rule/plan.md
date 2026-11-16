---
title: "Implementation Plan: Phase 36: start-rate-fixed-rule"
description: "Make startState's started follow the fixed arm start rule, count reads alone as lookups beside the rate, state it in the README, and restate the 007 and 033 start rates from a rescore."
trigger_phrases:
  - "start rate fixed rule plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 36: start-rate-fixed-rule

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules and TypeScript tests in the advisor runtime, Vitest |
| **Framework** | `startState`, `startShape` and the start tally in `score-command-transcripts.mjs` |
| **Storage** | Before and after summaries in this phase's `scratch/` |
| **Testing** | `tests/command-transcript-score.vitest.ts`, the full suite, `FLOOR` and `EVAL` |

### Overview
`startState` already computes the shape of a start. With this change `started` is true only for `skill`, `reported`, `expanded` and `readWrite`, and a read alone returns `started` false with shape `readOnly`. The tally counts shapes for every judged start row that started or looked up, so `startShapes.readOnly` holds the lookups and the old rate stays recoverable as `started + readOnly`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 035 is committed and its gate review has returned
- [ ] `scratch/start-007-before.json` and 035's `summary-shapes.json` hold the before state

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The 22-line check reads `numerator moved by readOnly, denominator equal`
- [ ] The goal log holds both restated rows
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One rule in one function, read by every printed start count.

### Key Components
- **`startState(events, row, checkoutDir)`**: `shape` is computed for any touched start, `started` is true when the shape is not `readOnly`
- **Start tally**: counts `startShapes[shape]` for every judged row with a shape, and `started` for the four starting shapes
- **README scorer row**: states that `startRate` follows the same rule as `declineStarts`, and lists `startShapes`

No new file, module, option or dependency.

### Data Flow
`scoreLine` passes the line's `projectDir`, `startState` returns `started` and `shape`, the tally fills `started`, `startShapes`, `byPolicy.started` and `startedOfOffered`, and `tallyBlock` prints them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `startState` | Counts a read alone as a start | Follows the fixed rule | Unit cases |
| Tally `started`, `byPolicy.started`, `startedOfOffered` | Read `result.started` | None, they follow it | The 22-line check |
| `startShapes` | Sums to `started` | `readOnly` now holds lookups | The 22-line check |
| `startedCommand` (decline, skill-only) | Already follows the rule | None | Decline and skill-only counts equal 034's |
| Routing-accuracy README | Lists per-arm fields | States the rule and `startShapes` | `rg` |

Required inventories:
- Same-class producers: `startedCommand` already applies the rule. No third start judge exists (`rg -n 'readDocument\(' $S`).
- Consumers of changed symbols: `scoreLine`, the tally and `tallyBlock`, and the stored-set filters `ARMS` that print `startRate`.
- Matrix axes: five shapes, a row with no expected command, a write outside the checkout.
- Algorithm invariant: new numerator plus `readOnly` equals the old numerator, and every denominator holds.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the suite, `FLOOR`, `EVAL` and the two before summaries. Implementation changes `startState` and the tally, updates the tests and the README row. Verification reruns the gates, rescores both sets, checks the 22 lines and logs the restated rates. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | A read alone is a lookup, a read with a checkout write starts, the other shapes still start | Vitest |
| Integration | Full suite, `FLOOR` and `EVAL` | Vitest, the capture scripts |
| Manual | None. The restatement is a committed `jq` check | `jq` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Session stores of the 007 and 033 sessions | Internal | Green, both sets scored today | The restatement cannot run |
| Phase 035 committed | Internal | Green, `267c27fc5df` | The shape field this phase reads is missing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite failure the change causes, or a denominator that moves
- **Procedure**: revert the phase's code commit. Goal rows get a correction row when wrong
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (before summaries, gates) | Phase 035 committed and reviewed | Implementation |
| Implementation (scorer, tests, README) | The before state on file | Verification |
| Verification (gates, rescore, goal rows) | A green suite | Close-out |
<!-- /ANCHOR:phase-deps -->

---
