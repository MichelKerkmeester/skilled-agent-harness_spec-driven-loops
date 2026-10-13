---
title: "Implementation Plan: Phase 8: lineage-proof-enforcement"
description: "Gate each CLI lineage on the iteration verifier before it counts as fulfilled, close the missing-dashboard gap, stop the projection from dropping route proof so leaves stop writing duplicates, and bound lineage citations by file length."
trigger_phrases:
  - "lineage proof enforcement plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: lineage-proof-enforcement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, TypeScript projection library |
| **Framework** | None |
| **Storage** | JSONL state logs and markdown projections inside each lineage folder |
| **Testing** | Vitest, `npm test` in `.skilled/skills/system-deep-loop/runtime` |

### Overview
Every gate this phase needs exists in some form already. The verifier checks route proof per iteration, the merge checks the reducer stamp, and spec-kit's `SOURCE_TAGS` rule bounds `[SOURCE:]` citations. The work is wiring them to the point where a lineage is declared fulfilled, and fixing the one producer, the lossy projection, that teaches leaves to write their records twice.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, each fixture having failed against the pre-change code
- [ ] The deep-loop unit suite passes from the final state, with the delta accounted for
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate at the producer boundary. Each check runs where the runner decides a lineage is done, before the merge reads it.

### Key Components
- **Runner worker** (`fanout-run.cjs:3369-3984`): already throws on missing artifacts, stop-policy violation and salvage failure. The verifier gate and the duplicate-row gate join that sequence before `return output` at `:3984`.
- **Iteration verifier** (`verify-iteration.cjs:385`, exported at `:578`): checks narrative, state row, delta and route proof per iteration. Called in process.
- **Merge provenance** (`fanout-merge.cjs:711-725`, `:1469-1495`): maps a missing dashboard to `unverified` and merges it. This changes to a refusal, or the runner guarantees the dashboard.
- **State projection** (`deep-research-contract.ts:214-224`): emits 7 keys per iteration row. It gains the four route-proof fields.

### Data Flow
Leaf writes iteration, delta and gateway event. The gateway projects the state log. The runner worker reads the lineage folder, runs its gates, and returns or throws. The pool marks the lineage fulfilled or rejected. The merge reads only fulfilled lineages and applies provenance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` worker gates | Decides fulfilled or rejected | update: add verifier and duplicate-row gates | `fanout-run.vitest.ts` fixtures |
| `fanout-run.cjs:754-766` `retainIterationRecords` | Collapses duplicate rows, preferring the route-proof copy | update or remove once duplicates are rejected | grep for callers, then the forced-depth tests |
| `fanout-merge.cjs` provenance | Refuses unstamped, warns on missing | update: missing becomes refused, or unchanged if the runner reduces | `fanout-merge-reducer-provenance.vitest.ts` |
| `deep-research-contract.ts` projection | Rebuilds the state log from the ledger | update: keep route-proof fields | projection unit tests plus a reader inventory |
| `verify-iteration.cjs` | Per-iteration leaf check | update: citation bounds, if placed here | `verify-iteration.vitest.ts` |
| `check-source-tags-helper.mjs` in system-spec-kit | Bounds `[SOURCE:]` tags at spec validation, warn only | unchanged: reuse its resolver if it can be imported, else not a consumer | read its exports before choosing |

Required inventories:
- Same-class producers: `rg -n "type: 'iteration'" .skilled/skills/system-deep-loop/runtime/lib/legacy-projections` to find every projection that rebuilds an iteration row, review included.
- Consumers of the projected row: `rg -n "deep-research-state.jsonl|deep-review-state.jsonl" .skilled/skills/system-deep-loop/runtime --glob '*.cjs' --glob '*.ts'`.
- Matrix axes: loop type (research, review), dashboard (present stamped, present unstamped, missing), state rows per iteration (one, two), citation (in bounds, past end, range past end, missing file).
- Algorithm invariant: a lineage is fulfilled only if every gate passes, and a gate that cannot read its input fails that lineage alone.
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
| Unit | Runner gates, merge provenance, projection row, citation bounds | Vitest |
| Integration | A fixture lineage folder copied from the `deepseek-4` shape run through the worker path | Vitest with a temp directory |
| Manual | Re-run the merge over the saved 2026-10-12 run and read which lineages it refuses | `node fanout-merge.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `verify-iteration.cjs` export of `verify` | Internal | Green | The runner gate would need a child process instead |
| The saved 2026-10-12 run in the consuming repository | Internal | Green | Fixtures would have to be hand-built from this spec's description |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live fan-out runs start rejecting lineages whose artifacts are complete
- **Procedure**: Revert the commit that added the gates. No data is migrated, so the revert is the whole rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: fixtures) ──► Phase 2 (Gates and projection) ──► Phase 3 (Verify)
```

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
| Setup | Low | 1 hour |
| Core Implementation | Med | 3 to 5 hours |
| Verification | Low | 1 hour |
| **Total** | | **5 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixtures recorded failing against the pre-change code
- [ ] No feature flag. The gates are always on, matching the existing artifact gates.
- [ ] The saved run re-merged and its refusals read

### Rollback Procedure
1. Revert the gate commit
2. Re-run the deep-loop unit suite and confirm the pre-change count

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
