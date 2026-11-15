---
title: "Implementation Plan: Phase 15: review-verdict-gate-rule"
description: "Add one typed review ledger event, written at the STOP handoff to synthesis, that records the three required quality gates. Every review verdict site reads it, so a gate still failing at the stop forces FAIL."
trigger_phrases:
  - "review verdict gate rule plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: review-verdict-gate-rule

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ledger schema and reducer, Node.js CommonJS scripts, workflow YAML read by the orchestrating model |
| **Framework** | The deep-loop append gateway (`runtime/scripts/append-mode-event.cjs`) and its typed review ledger |
| **Storage** | Append-only review ledger, projected to `review/deep-review-state.jsonl` |
| **Testing** | Vitest 4.1.12, `npm test` from `.skilled/skills/system-deep-loop/runtime` |

### Overview
The review verdict moves from P0-only to the contract rule. Both workflows write one new typed event, `deep_review.terminal_gates_recorded`, when a review stops for synthesis. It names the required gates (`evidence`, `scope`, `coverage`) that still fail. The reducer, the fan-out merge and both workflow verdict steps read that one record, so a live, resumed or merged run returns the same verdict. Reducer and merge fixtures prove it: a run stopped at max iterations with `coverage` failing returns FAIL, and a blocked stop that later converged returns PASS.

`check-prerequisites.sh --json --paths-only` printed `ERROR: Not on a feature branch. Current: worktrees/384-agent-alignment-follow-ups`. The worktree branch does not use the `NNN-name` form. The error is environmental and does not block this plan.
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
- [ ] `npm test` from `.skilled/skills/system-deep-loop/runtime` shows no failing test that the T001 baseline does not show, and `node scripts/check-ledger-stem-producers.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single typed fact. One ledger record holds the terminal gate outcome, and every verdict site reads it instead of recomputing it.

### Key Components
- **`deep_review.terminal_gates_recorded`**: the new stem. Without it, nothing saved says which required gates failed at the stop. A resumed or merged run cannot apply the contract rule.
- **`terminal_gates` projection row**: the state-log form the reducers read. Without a branch, the projection's generic fallback would name the row `terminal_gates_recorded`.
- **`terminalGates` registry field**: written by `reduce-state.cjs` and read by `fanout-merge.cjs`, because each lineage registry is reducer output (`fanout-run.cjs:1590-1592`).

### Data Flow
`step_handle_convergence` `if_stop` evaluates the three required gates. It writes one event through the append gateway. `deep-review-ledger-schema.ts` validates the event. `deep-review-state-contract.ts` projects it to a `terminal_gates` row. `reduce-state.cjs` reads the latest row into `registry.terminalGates` and the dashboard verdict. `fanout-merge.cjs` unions `terminalGates.failedRequiredGateIds` across lineages. `step_derive_verdict` reads the same failed-gate list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

No `review/review-report.md` Planning Packet exists for this packet, so nothing is imported. Every row below was found by the four step 5 explorers and read.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-review-ledger-types.ts` stem list, producer table, wire map, payload map, scope map | Registers every review stem (`:557-591`, `:604-638`, `:640-674`, `:697`, `:733`) | update | TypeScript `satisfies` at `:638` and `:674` fails a missing entry |
| `deep-review-ledger-schema.ts` field rules, scope fields, `isData` | Validates a stem's data and scope (`:138-508`, `:510-575`, `:896-963`) | update | `deep-review-ledger-schema.vitest.ts` accept and refuse cases |
| `deep-review-state-contract.ts` projection | Turns ledger events into state rows (`:125-276`) | update | `deep-review-state-contract.vitest.ts` row case |
| `deep-review-reducer.ts` routing table and three exhaustive switches | Folds review events (`:102-144`, `:561-703`, `:1269-1410`, `:1565-1627`) | update | `assertNeverStem` fails to compile without an arm |
| `reduce-state.cjs` verdict | P0 FAIL, P1 or search debt CONDITIONAL (`:2078-2082`) | update | New reducer fixture cases |
| `fanout-merge.cjs` `mergedVerdict` and attribution verdict | P0-only (`:935-942`, `:1015-1022`) | update | New `fanout-merge.vitest.ts` case |
| `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Producers at the STOP handoff (`:913`), verdict steps (`:2401-2418`, `:1804-1820`) | update | `check-ledger-stem-producers.cjs` and a grep on both files |
| `check-ledger-stem-producers.vitest.ts` census | Pins `registered 86 / spoken 23 / reserved 63` (`:210-212`) | update | Count becomes 87 / 24 / 63 |
| `synthesis-closeout.cjs` | Copies `--verdict` into the synthesis payload (`:421-446`) | unchanged | Not a deriver; it receives the corrected verdict |
| `verify-iteration.cjs` | Checks the shape of the `Review verdict:` line only (`:400-413`) | not a consumer | Shape only, by design (`:402-405`) |
| `legacy-shadow.ts` | P0-only verdict (`:281-288`) with no production caller | unchanged | Recorded in spec Out of Scope |
| `compiled/deep-review.contract.markdown` | Holds a digest of both YAMLs | update | `check-contract-drift.cjs --command deep/review` prints OK |
| `README.md`, `convergence.md`, `completion-criteria.md` | State the verdict rule | update | Grep for the contract wording |

Required inventories:
- Same-class producers: `rg -n 'p0_count > 0|activeP0 > 0|severity.P0 > 0|severityCounts.P0 > 0' .skilled --glob '*.{cjs,ts,yaml}' --glob '!**/node_modules/**' --glob '!**/dist/**'` lists every P0-only verdict deriver.
- Consumers of changed symbols: `rg -n 'terminal_gates|terminalGates|failedRequiredGateIds' .skilled --glob '*.{ts,cjs,yaml,md}'` must show only the files in this table after the build.
- Matrix axes: the stop kind (converged, max iterations), whether a required gate fails at the stop, whether an earlier blocked stop exists, single executor or fan-out, and whether a legacy log has no terminal row. Each axis has a row in `tasks.md` Phase 3.
- Algorithm invariant: the verdict is FAIL exactly when `activeP0 > 0` or the latest terminal record names at least one failed required gate. An earlier blocked stop never changes it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup baselines `npm test` and the stem census. Implementation registers the stem and projects it. It then makes the reducer and the merge read it, writes it from both workflows and updates the docs. Verification runs the fixture matrix, the census, the parity suites and the drift check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Stem accept and refuse, projection row, reducer verdict, merge verdict | Vitest in `runtime/tests/unit/` |
| Integration | Stem census against the producer YAMLs, contract parity, compiled-contract drift | `check-ledger-stem-producers.cjs`, `deep-review-contract-parity.vitest.ts`, `check-contract-drift.cjs` |
| Manual | None | No browser surface; the workflow YAML is checked by grep and the census |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The append gateway's typed validation | Internal | Green | A stem missing from a table is refused at append time |
| Vitest from `runtime/node_modules` | Internal | Green | No test runs; resolved without an install in phase 010 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a review whose gates all pass at the stop returns FAIL, or the gateway refuses a valid terminal record.
- **Procedure**: revert the 015 commit with `git revert <sha>`. Ledgers that already hold the event fall back to the generic projection, and no reducer reads it.
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
| Setup | None | Implementation, because the baseline must exist first |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
