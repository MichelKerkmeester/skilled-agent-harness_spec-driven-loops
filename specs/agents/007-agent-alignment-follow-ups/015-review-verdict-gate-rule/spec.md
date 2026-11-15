---
title: "Feature Specification: Phase 15: review-verdict-gate-rule"
description: "The review contract fails a session when a required quality gate fails, but the workflow, the dashboard reducer and the fan-out merge fail it only on an open P0. No saved record says which required gates were still failing when a review stopped, so nothing downstream can apply the contract rule."
trigger_phrases:
  - "review verdict gate rule"
  - "phase 15 review verdict gate rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: review-verdict-gate-rule

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-prompt-improver-model-eligibility |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row in `acceptance-criteria.md` is Met, and the deep-loop vitest suite shows no new failure against the T001 baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of packet `007-agent-alignment-follow-ups`. It builds the answer the operator gave on 2026-11-15 to phase 010's second open question: the review verdict follows `review-mode-contract.yaml`.

**Scope Boundary**: the deep-review verdict and the one typed record it needs. Research and ai-council verdicts are untouched.

**Dependencies**:
- Phase 010, which made the deep-review agent defer to the session verdict.

**Deliverables**:
- A typed `deep_review.terminal_gates_recorded` event written at every terminal stop.
- One verdict rule in the workflow, the dashboard reducer and the fan-out merge.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`review-mode-contract.yaml:105` sets FAIL when `activeP0 > 0 OR any required quality gate fails`, and the contract's binary quality gates are `evidence`, `scope` and `coverage`. The two workflow verdict steps, `reduce-state.cjs` and `fanout-merge.cjs` all return FAIL on P0 alone. A review that stops at max iterations with a gate still failing reports PASS or CONDITIONAL. Only `deep_review.blocked_stop_recorded` carries gate results, and it is written only for a BLOCKED decision. So no reader can tell which required gates were still failing when the loop stopped.

### Purpose
Every deep-review verdict, live, resumed or merged, returns FAIL when a required quality gate is still failing at the terminal stop, and all of them read that fact from one typed record.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the worktree root at `1c0557f90a`.

```text
$ sed -n 103,106p .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml
    - id: FAIL
      label: Fail
      condition: "activeP0 > 0 OR any required quality gate fails"
      nextCommand: /speckit:plan
exit=0
$ rg -n '^    - id: (evidence|scope|coverage)$' .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml
119:    - id: evidence
126:    - id: scope
132:    - id: coverage
exit=0
$ sed -n 2404,2409p .skilled/commands/deep/assets/deep-review-auto.yaml
          if p0_count > 0:
            verdict = "FAIL"
          elif p1_count > 0:
            verdict = "CONDITIONAL"
          else:
            verdict = "PASS"
exit=0
$ sed -n 1807,1812p .skilled/commands/deep/assets/deep-review-confirm.yaml
          if p0_count > 0:
            verdict = "FAIL"
          elif p1_count > 0:
            verdict = "CONDITIONAL"
          else:
            verdict = "PASS"
exit=0
$ sed -n 2077,2081p .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
  const hasSearchDebt = Array.isArray(registry.searchDebt) && registry.searchDebt.length > 0;
  const verdict = severity.P0 > 0
    ? 'FAIL'
    : severity.P1 > 0 || hasSearchDebt
      ? 'CONDITIONAL'
exit=0
$ sed -n 935,941p .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
  let mergedVerdict;
  if (activeP0 > 0) {
    mergedVerdict = 'FAIL';
  } else if (activeP1 > 0) {
    mergedVerdict = 'CONDITIONAL';
  } else {
    mergedVerdict = 'PASS';
exit=0
$ sed -n 781p .skilled/commands/deep/assets/deep-review-auto.yaml
             a) if iteration_count >= max_iterations: set decision = "STOP", stopReason = "maxIterationsReached", hard_stop_reason = "max_iterations_reached", preserve any failed legal-stop gates as terminal evidence, and proceed to synthesis without legal-stop veto
exit=0
$ rg -c 'gateResults' .skilled/commands/deep/assets/deep-review-auto.yaml
1
exit=0
$ rg -n -o '"stem":"deep_review\.blocked_stop_recorded"' .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml
.skilled/commands/deep/assets/deep-review-confirm.yaml:922:"stem":"deep_review.blocked_stop_recorded"
.skilled/commands/deep/assets/deep-review-auto.yaml:906:"stem":"deep_review.blocked_stop_recorded"
exit=0
$ rg -n -o 'decision == BLOCKED' .skilled/commands/deep/assets/deep-review-auto.yaml
869:decision == BLOCKED
870:decision == BLOCKED
898:decision == BLOCKED
900:decision == BLOCKED
exit=0
$ rg -n "event === 'blocked_stop'" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
1496:    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
exit=0
$ rg -c 'gateResults|blockedStop|blocked_stop' .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
exit=1
$ rg -n 'run_completed.: \{ status: .reserved' -o .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts
630:run_completed': { status: 'reserved
exit=0
```

The terminal-stop line at `:781` keeps failed gates only as prose evidence. The sole `gateResults` writer is the BLOCKED-only event at `:906`, the reducer reads only the legacy `blocked_stop` row and `fanout-merge.cjs` reads no gate data at all.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Register a typed stem `deep_review.terminal_gates_recorded` in the review ledger. Nothing records the required gates at a terminal stop today, so without it a resumed run or a merge cannot apply the contract rule.
- Emit that event once at the STOP handoff to synthesis (`step_handle_convergence` `if_stop`), from both review workflows. The converged legal stop and `maxIterationsReached` both pass through it. It carries the three required gate results and the ids of those that failed.
- Project the event to a `terminal_gates` state-log row. Have `reduce-state.cjs` return FAIL when that row names a failed gate.
- Have `fanout-merge.cjs` return FAIL when any lineage's terminal record names a failed gate. Have both workflow verdict steps read the same fact.
- Restate the rule in `README.md` and recompile the deep-review contract.

### Out of Scope
- The deep-review agent's FAIL row - it defers to the session verdict, which stays correct after this phase.
- `userPaused`, `error` and `manualStop` - the first two halt without synthesis (`deep-review-auto.yaml:1138`, `:2186`) and `manualStop` has no emitter, so none derives a verdict.
- The dashboard's blocked-stop rendering reads `gateResults` as an object while the schema stores an array (`reduce-state.cjs:2186-2190`), and the fan-out CLI emits no `active_p2` for the `p2_count` binding (`fanout-merge.cjs:1541-1542`) - both predate this phase; reported, not fixed.
- The reserved `deep_review.run_completed` stem - speaking it needs four other reserved stems' event ids.
- Research and ai-council verdicts - neither has a required-gate rule in its contract.
- `runtime/lib/result-envelopes/legacy-shadow.ts` - its P0-only verdict at `:281-288` has no production caller; only `result-envelopes.vitest.ts` reads it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | The stem, its data type, scope and producer row |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Modify | Field rules, scope fields and the semantic check |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts` | Modify | Project the event to a `terminal_gates` row |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Modify | Reduce the event in the typed reducer |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Read the latest `terminal_gates` row into the registry and the verdict |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Carry failed required gates into the merged verdict |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modify | Emit the event at terminal stops; read it in `step_derive_verdict` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/review --write` |
| `README.md` | Modify | Lines 592, 634 and 654 restate the verdict rule |
| `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md`, `references/protocol/completion-criteria.md` | Modify | `convergence.md:110` and `completion-criteria.md:75` define FAIL by P0 alone, and `convergence.md:543` counts every legal-stop gate rather than the three required ones |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/*` | Modify or Create | Schema, projection, reducer and merge cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The deep-loop vitest suite and `check-ledger-stem-producers` show no failure that the T001 baseline does not show. |
| REQ-002 | `deep_review.terminal_gates_recorded` is a registered stem: the gateway accepts a record with `stopReason`, `gateResults` for `evidence`, `scope` and `coverage`, and `failedRequiredGateIds`. It refuses one whose failed ids disagree with the failing results. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Both review workflows append the event exactly once in the `step_handle_convergence` `if_stop` branch, before the route to `phase_synthesis`, so the converged stop and `maxIterationsReached` each write one record. |
| REQ-004 | `reduce-state.cjs` returns FAIL when the latest `terminal_gates` row names a failed gate. It returns PASS when an earlier blocked stop was cleared and the terminal row names none. |
| REQ-005 | `fanout-merge.cjs` returns FAIL when only one lineage's terminal row names a failed gate, and its attribution table shows that lineage's verdict as FAIL. |
| REQ-006 | Both workflow `step_derive_verdict` steps set FAIL on `p0_count > 0` or a non-empty failed-gate list from the terminal record, and keep CONDITIONAL and PASS as they are. |
| REQ-007 | `README.md` states the contract rule, and the compiled deep-review contract shows no drift. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reducer fixture that stops at max iterations with `coverage` failing prints verdict FAIL with no active P0.
- **SC-002**: A fixture blocked at one iteration and converged later prints PASS, so a cleared gate never fails the run.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The append gateway's typed validation | A stem missing from any of the four tables is refused at append time | Add the stem to the types, schema, scope and producer tables in one task, and let `check-ledger-stem-producers` prove it |
| Risk | More runs end in FAIL | High: a run that hits max iterations without coverage now fails where it passed | This is the contract the operator chose. The terminal row names the failed gate, so the report says why |
| Risk | A legacy state log has no `terminal_gates` row | Med: an old run would read as if no gate failed | Treat a missing row as no failed gate, and say so in the reducer's verdict note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: this packet runs no service. It changes a reducer, a merge script, a ledger schema and two workflows.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state log with no `terminal_gates` row keeps today's P0-only verdict.
- Maximum input: two terminal rows from a resumed run use the latest by append position.
- Failure path: a record whose `failedRequiredGateIds` names a gate whose result is `pass` is refused by the gateway's semantic check.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 14 files and 300 lines across the ledger, two scripts, two workflows and tests |
| Risk | 15/25 | A ledger schema change and a verdict that fails more runs |
| Research | 8/20 | The terminal stop points in both workflows still need mapping |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the `scope` gate evaluated anywhere today? Decision: no legal-stop gate carries it, so the terminal step evaluates it there: every active finding's file sits inside the declared review target.
- Does a stuck run reach synthesis? Decision: stuck recovery continues the loop, so it is not a terminal stop. Its later terminal stop writes the record.
- Which stops write the record? Decision: only the STOP handoff to synthesis, because the verdict is derived only in synthesis. A halt on `error` or `userPaused` writes none and derives no verdict.
<!-- /ANCHOR:questions -->

