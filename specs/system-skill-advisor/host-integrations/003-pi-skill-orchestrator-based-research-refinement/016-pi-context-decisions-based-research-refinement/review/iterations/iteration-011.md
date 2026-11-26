# Review Iteration 011 - Traceability

## Dispatcher

- Route: `mode=review`, `target_agent=@deep-review`, execution `single_review_iteration`, state source externalized files.
- Run `2026-11-23T21:41:17.101Z`, generation 5, lineage `completed-continue` from run 10.
- Iteration 11 of `maxIterations=11` (config `review/deep-review-config.json:9`); ten iteration records precede this one in the delta stream, so the JSONL-derived number is 11 and matches the dispatch.
- Focus: traceability, final iteration of a max-iterations run. The prior pass recorded `spec_code` as `partial` for one reason: it had re-verified four findings' code, but had not itself run the commands behind AC-006, AC-007, AC-008 and AC-013. This pass runs all four command families at HEAD `5c5b9fe3e5b`, reads each output and exit status, and sets `spec_code` from what the commands did.

## Files Reviewed

The declared review target is `.skilled/skills/system-skill-advisor`. The suites below are executed as **evidence**, not reviewed as code targets (config `reviewFocus`; strategy section 4 NON-GOALS).

| Path | What was done |
|------|---------------|
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:59` | AC-006 row read: predicate parity plus the sweep-vocabulary case must be green |
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:60` | AC-007 row read: constant parity must fail on a one-sided edit |
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:61` | AC-008 row read: stage order must fail when a stage moves |
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:66` | AC-013 row read: full gate suite against baseline |
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:67` | AC-014 row read: remains `Unmet`; it is a process criterion, not a code claim |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/scorer-predicate-cases.vitest.ts:54` | AC-006 vitest half executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts:1` | AC-006 sweep half executed at its real path |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:1` | AC-006 Python half executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-constant-parity.vitest.ts:43` | AC-007 executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/score-stage-order.vitest.ts:82` | AC-008 executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:175` | AC-013 ratchet set executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:288` | AC-013 ratchet set executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:1` | AC-013 ratchet set executed |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:1` | AC-013 ratchet set executed |

No source file under the target was modified; the working tree is the committed HEAD `5c5b9fe3e5b`.

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. This iteration found no defect in the reviewed code. The two new observations it did produce are classified under Edge Cases with the reason each is not a code finding.

## Traceability Checks

| AC | Command (cwd `.skilled/skills/system-skill-advisor/runtime`) | Observed | Exit |
|----|---------|----------|------|
| AC-006 | `npx --no-install vitest run tests/scorer-predicate-cases.vitest.ts tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts` | 2 files, 32 tests passed | 0 |
| AC-006 | `PYTHONDONTWRITEBYTECODE=1 python3 tests/python/test_skill_advisor.py` | `pass=132, fail=0`, incl. `SCORER-PREDICATES cases=24` | 0 |
| AC-007 | `npx --no-install vitest run tests/parity/python-ts-constant-parity.vitest.ts` | 3 tests passed | 0 |
| AC-008 | `npx --no-install vitest run tests/scorer/score-stage-order.vitest.ts` | 4 tests passed | 0 |
| AC-013 | `npm test` | 186 files, 2819 passed, 4 skipped | 0 |
| AC-013 | `npx --no-install vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts tests/command-routing-slice.vitest.ts` | 4 files, 34 tests passed | 0 |

Exit statuses were read under `set -o pipefail`, so a failing suite cannot hide behind the `tail` that prints its summary. This is the pitfall iteration 2 recorded as "only the summary line is evidence", now closed by construction.

- `spec_code` (**pass**): AC-006, AC-007, AC-008 and AC-013 each name a verification command, and each command exits 0 at HEAD `5c5b9fe3e5b` with the counts the row claims. The earlier `partial` was an evidence gap in the review pass, not a code drift: nothing in the target contradicts the `Met` rows, and every command the rows name reproduces. The rows are at `[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:59]`, `[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:60]`, `[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:61]` and `[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:66]`; the suites that back them are `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts:1]` and `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:175]`.
- `checklist_evidence` (**pass**): every `Met` row this pass touched carries evidence that was actually observed, and the one non-`Met` row is recorded honestly as `Unmet` rather than claimed. AC-014 asks for two further review passes with no `FAIL` from `review-verdict.cjs`; it is a process criterion owned by the packet and stays `Unmet` until this pass and the next each report PASS, which is not a code claim and not a defect in the target. Row at `[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:67]`.
- Overlay protocols were not re-run this iteration and are omitted from the record rather than restated as `pending`: `playbook_capability` was recorded `pass` at iteration 5, `feature_catalog_code` `partial` at iteration 3, and `skill_agent` / `agent_cross_runtime` `notApplicable`.

## Integration Evidence

- `runtime/package.json`'s `test` script is the surface AC-013 runs; it dispatches vitest over `tests/**`, so the 186-file run covers the `tests/scorer/` and `tests/parity/` directories the narrower AC commands address directly.
- The Python half of AC-006 is `runtime/tests/python/test_skill_advisor.py`, which exercises `runtime/scripts/skill_advisor.py` through `skill_advisor_runtime.py`; it printed `pass=132 fail=0` and named the shared predicate fixture (`cases=24`) and the deep-loop gate cases (`cases=118`).

## Edge Cases

1. **Dispatch iteration count.** The auto-generated state summary reads `Iteration: 11 of 9` while the same block reads `Review Iteration: 11 of 11`. Config says `maxIterations=11` (`[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/review/deep-review-config.json:9]`) and the delta stream holds ten iteration records, so 11 is correct and the "of 9" figure is a stale summary field inherited from the pre-extension run. No correction to state was needed.
2. **`review/iterations/iteration-011.out` without `iteration-011.md`.** A prior attempt captured stdout only. The write-once target did not exist, so this pass created it; nothing was overwritten.
3. **AC-006's sweep-vocabulary path is stale in the packet, and vitest hides it.** The test lives at `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts`; the dispatch command and the AC row name a bare basename. Passing the short path to `vitest run` does not fail: vitest treats an unmatched argument as a filter, so the command ran one file (26 tests), exited 0, and would have reported AC-006's sweep half green while executing nothing. I re-ran it at the real path and it passes (32 tests with the predicate suite). This is not filed as a code finding: no file inside the review target names the short path, so the drift belongs to the packet's verification command, and AC-006's substance holds once the test is run where it is. **Amendment proposal for the packet owner:** change the AC-006 Verification cell at `[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:59]` to `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts`, and have any gate that shells individual test paths assert the file exists first, because a moved path degrades to a silent green.
4. **AC-013's evidence cell is not reproducible from the repo.** It cites a scratchpad directory under `/private/tmp/claude-501/...`. Under this packet's scope, prose docs are out of scope unless code contradicts them, and the code does not; the gate was re-run here and exits 0, which is the durable replacement evidence.
5. **Four skipped tests in `npm test`.** Three are the explicit `it.skip` cases in `tests/migration-lineage-identity.vitest.ts` (spec-folder lineage identity, not advisor routing); the fourth is a conditional guard. A probe over the skip-bearing suites (`migration-lineage-identity`, `owned-private-dir`, `shadow-sink`, `local-native-divergence-ratchet`) reported 26 passed and 3 skipped, and the divergence ratchet runs here because Python is present, which is what AC-013's fourth command exercised. No AC-006..AC-013 verification path is behind a skip.
5. **Carry-forward search debt.** `SL-004` (`state_transition`, deferred at iteration 8) remains the only open row; it is recorded as deferred again rather than dropped.

## Confirmed-Clean Surfaces

- Predicate parity: the shared fixture agrees in vitest and Python (`cases=24`), and `sk-git-worktree-sweep-vocabulary.vitest.ts` is green at its real path.
- Constant parity and stage order: both mutation-proof suites pass unmodified.
- Baseline and divergence ratchets: the accuracy floor, fixture-hash pin, holdout independence and the local-versus-native divergence ledger all hold (34/34).
- Whole suite: 186 files, 2819 tests, 0 failures at the committed HEAD.

## Ruled Out

- **`spec_code` staying `partial`:** rejected by observation. The four command families ran and exited 0; keeping `partial` after running them would report an evidence gap that no longer exists.
- **A `P2` for the stale AC-006 path:** rejected as a code finding. The defect is in the packet's evidence command, AC-006's claim survives a run at the correct path, and no reviewed file carries the wrong path.
- **Skipped tests masking an acceptance gate:** ruled out by the skip probe; the four skips are named spec-folder lineage cases and one conditional guard, none of them on an AC-006..AC-013 path.
- **An AC-014 regression:** ruled out. `Unmet` is the criterion's authored state, not a drift the code introduced; this pass supplies one of the two PASS verdicts it asks for.

## SCOPE VIOLATIONS

None. Every write landed in the review packet; the review target, config, findings registry and reducer outputs were read-only throughout.

## Next Focus

- Dimension: none. Final iteration of a `max-iterations` run; all four dimensions are complete (4/4).
- Focus area: synthesis.
- Reason: the last outstanding traceability gap is closed. `spec_code` moves `partial` to `pass` on six observed command runs at HEAD `5c5b9fe3e5b`, `checklist_evidence` re-confirmed, and the registry holds no active P0, P1 or P2.
- Rotation status: complete (4/4).
- Blocked/productive carry-forward: `SL-004` (`state_transition`) remains the single deferred search row. Nothing is blocked.
- Required evidence: synthesis should recompute the registry from the deltas and confirm the merged verdict is PASS with `hasAdvisories=false`, and the packet owner should apply the AC-006 path amendment named in Edge Case 3.
- Recovery note: not applicable.

Review verdict: PASS
