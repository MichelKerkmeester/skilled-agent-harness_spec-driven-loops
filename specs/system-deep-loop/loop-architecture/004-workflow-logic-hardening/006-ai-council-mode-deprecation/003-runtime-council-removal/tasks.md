---
title: "Tasks: Phase 3: runtime-council-removal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "runtime council removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: runtime-council-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below. `S` is `.skilled/skills/system-deep-loop`. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/skills/system-skill-advisor/runtime`. `K` is `.skilled/skills/system-spec-kit/runtime/cli`. `C` is `.skilled/commands`. `P` is the phase parent `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation`, which holds the shared `scratch/` files and the parent `goal.md`. `H` is this child folder. `Q` is the council prompt "convene an ai council to compare three migration plans". Run every command from the repository root. Task ids come from the task list this phase had before it was split, so a task keeps its id in the child that owns it. Ids from T090 up were added at the split.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T096 Confirm child 002 is Complete (`$P/002-hub-two-mode-wiring/spec.md`). Verify: `rg -l -F '| **Status** | Complete' $P/002-hub-two-mode-wiring/spec.md | wc -l` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Runtime (D4)
- [x] T039 Delete the seven council files the pivot does not read and rewrite the folder readme (`$R/lib/council/`). Verify: `ls $R/lib/council` prints `README.md` and `multi-seat-dispatch.cjs` only, and `rg -l "council/(adjudicator-verdict-scoring|convergence|cost-guards|round-state-jsonl|session-state-hierarchy|council-graph-db|council-graph-query)" .skilled .opencode -g '!**/node_modules/**' -g '!**/changelog/**' -g '!**/benchmark/**'` prints nothing. Evidence: Observed: `ls` prints `multi-seat-dispatch.cjs` and `README.md`. The `rg -l` prints two retrieval fixtures, `generation-diagnostics.json` and `corpus-manifest.json`, which index historical spec documents by path and are on the sweep allowlist. No code, test or live doc names a removed file.
- [x] T040 Delete the three council ledger, reducer and sealed-artifact libraries and the legacy contract (`$R/lib/`). Verify: `rg -l 'deep-ai-council-(ledger-schema|reducers|sealed-artifacts|config-state-contract)' .skilled -g '!**/node_modules/**' -g '!**/changelog/**'` prints nothing. Evidence: Observed: the `rg -l` prints two files under `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/`, a frozen copy of an archived spec that is on the sweep allowlist. No code, test or live doc names a removed library.
- [x] T041 Remove the council branch and the `council` loop type (`$R/scripts/convergence.cjs`). Verify: `node $R/scripts/convergence.cjs --spec-folder $P --session-id probe --loop-type council` prints an `INPUT_VALIDATION` error that starts `loopType must be` and does not name `council`. Evidence: Observed: prints `{"status":"error","error":"loopType must be \"research\", \"review\", or \"context\"","code":"INPUT_VALIDATION"}`, exit 3. The message does not name `council`.
- [x] T042 [P] Remove the council paths (`$R/scripts/upsert.cjs`). Verify: `rg -n -i 'council' $R/scripts/upsert.cjs` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T043 [P] Remove the council paths (`$R/scripts/query.cjs`). Verify: `rg -n -i 'council' $R/scripts/query.cjs` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T044 [P] Remove the council paths (`$R/scripts/status.cjs`). Verify: `rg -n -i 'council' $R/scripts/status.cjs` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T045 Remove the council mode cases from the append gateway (`$R/scripts/append-mode-event.cjs`). Verify: `rg -n 'ai-council|deep-council' $R/scripts/append-mode-event.cjs $R/lib/mode-append-gateway` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T046 [P] Remove the council member (`$R/lib/blinded-adjudication/mode-adapters.ts`). Verify: `rg -n -i 'council' $R/lib/blinded-adjudication` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T047 [P] Remove the council node and the research-council edge (`$R/lib/write-set-conflict-graph/`). Verify: `rg -n -i 'council' $R/lib/write-set-conflict-graph` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T048 [P] Remove the council resources (`$R/lib/locks-and-fencing/protected-resource-registry.ts`). Verify: `rg -n -i 'council' $R/lib/locks-and-fencing` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T049 [P] Remove the council profile (`$R/lib/path-coverage-termination/`). Verify: `rg -n -i 'council' $R/lib/path-coverage-termination` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T050 [P] Remove the council clock profile (`$R/lib/stopping-clocks/stopping-clock-profiles.ts`). Verify: `rg -n -i 'council' $R/lib/stopping-clocks` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T051 [P] Remove the council member (`$R/lib/per-mode-authority-flip/types.ts`). Verify: `rg -n -i 'council' $R/lib/per-mode-authority-flip` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T052 [P] Remove the council member (`$R/lib/authorized-ledger/dark-ledger-adapter.ts`). Verify: `rg -n -i 'council' $R/lib/authorized-ledger` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T053 [P] Remove the council entries (`$R/lib/legacy-projections/legacy-projection-manifest.ts`). Verify: `rg -n -i 'council' $R/lib/legacy-projections` prints nothing. Evidence: Observed: prints 3 lines, all pivot vocabulary that stays: the pivot's `council/` artifact path in `legacy-projection-manifest.ts:162` and the fields `priorCouncilSeatOutputs` and `councilSeatOutputs` in `deep-research-contract.ts`. No council mode contract is left, and `deep-ai-council-config-state-contract.ts` is deleted.
- [x] T054 Delete the tests of removed code and drop council cases from shared tests (`$R/tests/`). Verify: `ls $R/tests/council` prints `multi-seat-dispatch.vitest.ts` only, and `rg -l 'deep-ai-council|council-graph|loopType.*council' $R/tests` prints nothing. Evidence: Observed: `ls` prints `multi-seat-dispatch.vitest.ts` and `README.md`, and the `rg -l` prints nothing after a stale fixture row was removed from `tests/README.md` at close.
- [x] T055 [P] Remove the council catalog and playbook folders and their index rows (`$R/feature-catalog/`). Verify: `ls $R/feature-catalog/council $R/manual-testing-playbook/council` lists only multi-seat dispatch entries. Evidence: Observed: each folder lists `multi-seat-dispatch.md` only.
- [x] T056 Remove the council scope from the doctor workflow and its presentation (`$C/doctor/assets/doctor-deep-loop.yaml`). Verify: `rg -n -i 'council' $C/doctor/assets/doctor-deep-loop.yaml $C/doctor/assets/doctor-deep-loop-presentation.txt` prints nothing. Evidence: Observed: prints nothing, exit 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T082 Run the divergent pivot tests (`$R/tests/integration/divergent-pivot.vitest.ts`). Verify: `cd $R && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0. Evidence: Observed: prints 5 lines ending `Duration  214ms (transform 54ms, setup 33ms, import 45ms, tests 155ms, environment 0ms)`, exit 0.
- [x] T083 Run the runtime suite and typecheck (`$R/package.json`). Verify: `cd $R && npm test && npm run typecheck` exits 0, or matches `scratch/gate-baseline.md` with the delta logged. Evidence: Observed: exit 0. The suite ran 172 test files, 2904 passed and 8 skipped, and the typecheck printed no error. The start baseline was 183 files and 3028 passed, and the difference is the deleted council tests.
- [x] T092 Validate this child folder (`$H/spec.md`). Verify: `bash $K/spec/validate.sh $H --strict` prints `RESULT: PASSED`. Evidence: Observed: prints 52 lines ending `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every focused check this child names was rerun from its final tree, with output and exit status read
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task stays `[B]` while the child before this one is not Complete. A `[B]` task blocks close. CHK ids below 060 come from the checklist this phase had before it was split. Ids from 060 up were added at the split.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-062 [P0] `rg -c '^\| REQ-' spec.md` prints 4. Evidence: Observed: prints `4`, exit 0.
- [x] CHK-063 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` and `node --check .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` exit 0. Evidence: Observed: command 1 prints nothing, exit 0; command 2 prints nothing, exit 0.
- [x] CHK-011 [P0] `cd .skilled/skills/system-deep-loop/runtime && npm run typecheck` exits 0. Evidence: Observed: prints 2 lines ending `> ../../system-spec-kit/node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json`, exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-022 [P0] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0. Evidence: Observed: prints 5 lines ending `Duration  233ms (transform 64ms, setup 38ms, import 54ms, tests 160ms, environment 0ms)`, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-003 [P0] Every removed runtime file has its caller check in T039 to T045, and each prints nothing. Evidence: T042 to T052 each print nothing. T039 and T040 print only allowlisted history fixtures, as their evidence states.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction logic changes. The `pathContainsAiCouncil` guard stays as it is. Evidence: N/A as stated.
- [x] CHK-FIX-006 [P1] The T041 convergence probe is run again with `DEEP_LOOP_COUNCIL_DB_DIR` set, and still prints the same input error. Evidence: Observed: with `DEEP_LOOP_COUNCIL_DB_DIR=/tmp/none` set the probe prints the same `INPUT_VALIDATION` error and exits 3.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-034 [P1] N/A: no auth surface changes. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-044 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids. Evidence: The requirement rows match: both files list REQ-006, REQ-011, REQ-012 and REQ-013. The command as written also prints REQ-018 for `spec.md`, from the notation sentence that says where new ids start.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-054 [P1] `git status --porcelain` lists no new file outside the files this spec names, this folder and `../scratch/`. Evidence: The work is committed in 5a9e04f242, whose file list holds runtime files, the doctor command and their docs. At close `git status --porcelain` lists only the five child folders being closed and `runtime/tests/README.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 4 | 4/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
