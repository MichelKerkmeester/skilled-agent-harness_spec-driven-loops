---
title: "Implementation Plan: Phase 3: runtime-council-removal"
description: "Delete the council libraries the pivot does not read, remove the `council` loop type from the scripts, remove the council member from each shared library and delete the tests of removed code. Prove it with a caller check per removal, the divergent pivot tests and the full runtime suite and typecheck against the start baseline."
trigger_phrases:
  - "runtime council removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: runtime-council-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and TypeScript in the deep-loop runtime, Markdown catalogs and one YAML doctor workflow |
| **Framework** | None. `sk-code` governs the code edits. |
| **Storage** | None changed. |
| **Testing** | Vitest 4 through `npm test` and `tsc` through `npm run typecheck` in `.skilled/skills/system-deep-loop/runtime/` |

### Overview
Delete the council libraries the pivot does not read, remove the `council` loop type from the scripts, remove the council member from each shared library and delete the tests of removed code. Prove it with a caller check per removal, the divergent pivot tests and the full runtime suite and typecheck against the start baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -l -F '| **Status** | Complete' ../002-hub-two-mode-wiring/spec.md | wc -l` prints 1.
- [ ] `ls ../scratch/gate-baseline.md` prints the path, and the file holds the runtime suite counts at the start commit.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test && npm run typecheck` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/003-runtime-council-removal --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keep the closure. Only the council code inside the import closure of the divergent pivot survives.

### Key Components
- **Runtime council code (D4)**: the import closure of `divergent-pivot.ts`, `deep-research/scripts/divergent-research-pivot.ts`, `deep-review/scripts/divergent-review-pivot.ts` and both `reduce-state.cjs` files reaches one council file, `runtime/lib/council/multi-seat-dispatch.cjs` (`divergent-pivot.ts:273`). That file has no `require`. The closure was walked on 2026-11-14 with a regex resolver over `require`, `import` and `from` and holds 15 files. The keep and remove lists are the same under both D3 options, because the rewritten agent calls no script.

| Code | Decision | Reason or caller check |
|------|----------|------------------------|
| `runtime/lib/council/multi-seat-dispatch.cjs`, `runtime/tests/council/multi-seat-dispatch.vitest.ts` | Keep | `divergent-pivot.ts:273` reads it |
| `pathContainsAiCouncil` in `divergent-pivot.ts:448` and its throw at `:814` | Keep | It keeps pivot output out of the `ai-council/**` trees D5 protects |
| The pivot's own `council/` subfolder, seat prompts and `councilSeatOutputs` fields, plus the pivot comments in `scripts/fanout-pool.cjs:428` and `:509` and `deep-research-ledger-schema/deep-research-ledger-types.ts:591` to `:741` | Keep | Pivot artifact layout and pivot vocabulary, not the mode |
| `runtime/lib/council/README.md` | Keep, rewritten | Describes the one kept file |
| `runtime/lib/council/{adjudicator-verdict-scoring,convergence,cost-guards,round-state-jsonl,session-state-hierarchy}.cjs`, `council-graph-db.ts`, `council-graph-query.ts` | Remove | `rg -l "council/(adjudicator-verdict-scoring\|convergence\|cost-guards\|round-state-jsonl\|session-state-hierarchy\|council-graph-db\|council-graph-query)" .skilled .opencode -g '!**/node_modules/**' -g '!**/changelog/**' -g '!**/benchmark/**'` prints nothing after the removal |
| `runtime/lib/deep-ai-council-ledger-schema/`, `deep-ai-council-reducers/`, `deep-ai-council-sealed-artifacts/`, `legacy-projections/deep-ai-council-config-state-contract.ts` | Remove | `rg -l 'deep-ai-council-(ledger-schema\|reducers\|sealed-artifacts\|config-state-contract)' .skilled -g '!**/node_modules/**' -g '!**/changelog/**'` prints nothing |
| The `council` branch in `runtime/scripts/convergence.cjs:703` to `:733` and the council paths in `upsert.cjs`, `query.cjs` and `status.cjs` | Remove | `rg -n "loopType === 'council'\|isCouncil" .skilled/skills/system-deep-loop/runtime/scripts` prints nothing |
| The council cases in `runtime/scripts/append-mode-event.cjs:113` and `:138` and `lib/mode-append-gateway/append-mode-event.ts:201` | Remove | `rg -n 'ai-council\|deep-council' .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway` prints nothing |
| Council members of shared libraries: `blinded-adjudication/mode-adapters.ts`, `write-set-conflict-graph/shipped-census.ts` and `graph.ts`, `locks-and-fencing/protected-resource-registry.ts`, `path-coverage-termination/{types,profiles,shadow}.ts`, `stopping-clocks/stopping-clock-profiles.ts`, `per-mode-authority-flip/types.ts`, `authorized-ledger/dark-ledger-adapter.ts`, `legacy-projections/{index,legacy-projection-manifest}.ts` | Remove the member, keep the library | `npm run typecheck` in the runtime exits 0, and each file's research and review entries still pass their tests |
| Council tests: `tests/council/` except multi-seat dispatch, `tests/unit/deep-ai-council-*.vitest.ts`, `council-graph-query.vitest.ts`, `tests/integration/council-graph-*.vitest.ts`, `tests/fixtures/council-value/` | Remove | They test removed code. `npm test` exits 0 without them |
| `runtime/feature-catalog/council/`, `runtime/manual-testing-playbook/council/` and their index rows | Remove | `rg -n 'council/' .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` prints only multi-seat dispatch rows |

### Data Flow
After this child research and review still call `runDivergentPivot`, which calls `dispatchCouncilSeats` from `runtime/lib/council/multi-seat-dispatch.cjs`. No script accepts the `council` loop type, and no library exports a council ledger, reducer, sealed artifact or graph.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Owner of the shared contract: `system-deep-loop/mode-registry.json`. The contract that must not break is the research and review route through both stages and the divergent pivot's call into `multi-seat-dispatch.cjs`. Real callers this child changes, read on 2026-11-14:

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:273` the one runtime reader that stays.
- `.skilled/commands/doctor/assets/doctor-deep-loop.yaml:62` and `:74` the `--scope=council` input.

Surfaces this child owns, from the inventory of 451 files saved to `../scratch/council-inventory-2026-11-14.txt`:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hub `runtime/` (73 files naming the mode, 143 naming `council`) | Council loop type, libraries, scripts, tests, catalogs | delete or update per the D4 table | Caller checks above, `npm test`, `npm run typecheck` |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms child 002 is Complete. Implementation deletes the council libraries, edits the scripts and shared libraries, then removes the tests, catalogs and the doctor scope. Verification runs the pivot tests, the full runtime suite and typecheck and validates this folder. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Divergent pivot and multi-seat dispatch, then the whole deep-loop runtime suite | `npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts`, `npm test` and `npm run typecheck` in the runtime |
| Integration | The rejected loop type and the caller checks | `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --loop-type council`, the `rg` caller checks in T039 to T045 |
| Manual | Read the rewritten `runtime/lib/council/README.md` and confirm it describes only the kept file | Read the file |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 002 | Internal | Yellow: must be Complete first | Hub surfaces still name the loop type this child removes. |
| `../scratch/gate-baseline.md` from child 001 | Internal | Yellow: written by child 001 | No start numbers to compare the suite against. |
| `sk-code` skill | Internal | Green | Code edits lose the quality floor. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the divergent pivot tests fail, or the runtime suite ends worse than its baseline and cannot be repaired in this child.
- **Procedure**: Every deleted file is tracked, so `git revert <sha>` for each commit of this child restores the runtime libraries, the script branches and the tests. The revert does not touch untracked council graph databases, because this child leaves them in place and never deletes them.
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
| Setup | Child 002 at Status Complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Child 004 |
<!-- /ANCHOR:phase-deps -->

---
