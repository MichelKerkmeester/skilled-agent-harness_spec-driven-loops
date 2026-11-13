# Review Iteration 003 - hook-confirm-3b

## Dispatcher

- Lineage: `hook-confirm-3b`, session `fanout-hook-confirm-3b-1794595021404-69frey`, iteration 3 of 3.
- Review focus (binding): the confirming round's traceability question — do the packet's criteria and product docs still describe the code, and would the named test files have caught what the previous iterations found? The hook fix remains the deepest subject; the no-edit fix is covered once, as the focus directs.
- How this iteration addressed the focus: it traces both changed surfaces to `017-review-pass-two-remediation` REQ-001 / AC-001 / AC-027 and to the two feature-catalog rows that state the no-edit contract, runs both permitted test suites, and records the two untested directions that let the iteration 1 and 2 findings ship green.

## Dimension

Maintainability (with the traceability protocol replay).

## Files Reviewed

- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:220-262` — wired and not-wired tables.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:28-77` — `NOEDIT4` and the scope-limit table.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/spec.md` REQ-001 (no-edit pattern contract).
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/acceptance-criteria.md` AC-001 and AC-027.
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` — the product-level no-edit promise.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. Active P1 from iteration 2 remains: `HC3B-P1-001` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289`.

### P2 Findings

1. **The no-edit guard table has no genuine object-bearing no-edit row, so the regression ships with a green suite** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:30-34` and `:70-77` -- `NOEDIT4` tests bare `make no changes` only, and the commit's two added rows test the change-request direction only. No row asks the predicate to accept a genuine no-edit request that names what must not change, which is exactly the class the new lookahead silently dropped.
   Finding class: maintainability (test coverage).
   Scope proof: both line ranges are in the declared-scope test file; the gap is on the changed predicate's contract.
   Affected surface hints: `tests/command-attach-guards.vitest.ts`, the attach/scorer/explainer gates that rely on it.
   Case: the prompt `make no changes to any file, just report what you find` returns `false` from `isNoEditRequest` (P1 finding 1) while the guard suite reports 26/26 passed.

   Concrete inputs run:

   ```
   node --experimental-strip-types (predicate):  "make no changes to any file, just report what you find" -> false
   env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts -> Test Files 1 passed, Tests 26 passed
   ```

   Fix direction: add a genuine-no-edit table (`make no changes to any file`, `make no changes to the code, just report`) asserting `attachCommand` returns `undefined`; it fails today, which is the point.

2. **The hook-check table has no case for a `-`-leading word node does not run, so the false `ok` is untested** -- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:249-255` -- the not-wired table lists `--check`, `-e "1"`, `-e1`, `--eval=1`, `--print=1` and the comment case, but not `node - <marker>` or a bad short cluster. The P2 finding `HC3B-P2-001` therefore has no failing test pinning it.
   Finding class: maintainability (test coverage).
   Scope proof: line range is in the declared-scope test file; the case is the same settings-root shape every other row uses.
   Affected surface hints: `tests/hook-wiring-check.test.cjs`, `/doctor` hook-wiring report.
   Case: the settings command `node - .claude/hooks/claude/user-prompt-submit.js` reports `ok claude` while `node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` reports 32 pass, 0 fail.

   Concrete inputs run:

   ```
   hook-wiring-check --root probes/dash-only  -> "ok claude" (exit 0)   while node - <script> runs nothing
   node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs -> tests 32, pass 32, fail 0
   ```

## Traceability Checks

- `spec_code` — **partial**. `017-review-pass-two-remediation` REQ-001 states the mechanism: the pattern is "widened with `make no changes`, `no changes yet` and the `don't` contraction". The commit keeps the phrase for the bare and change-request forms but removes it for every `make no changes to <object>` sentence, so the mechanism statement no longer holds for that class (P1 finding 1). AC-001's literal scope — "an agent request **ending** in each of the four no-edit wordings" — still passes; all four were run:
  `don't change anything yet` -> true, `no changes yet` -> true, curly `don’t touch any files` -> true, `make no changes` -> true.
- `checklist_evidence` — **pass with scope note**. AC-001 and AC-027 are recorded `Met` in `017-review-pass-two-remediation/acceptance-criteria.md`. Both remain Met for the scope they state (the four ending wordings; the seven wrapper launches). Neither row claims the object-bearing no-edit class, which is why the regression does not falsify a `Met` row — it exposes that no row covers it (P2 finding 1).
- `skill_agent` — **pass**. `attachCommand` (`command-attach.ts:335`), `readOnlyRouteAllowed` (`fusion.ts:677`), `commandMeaningEligible` (`fusion.ts:881`) and `isReadOnlyExplainer` (`text.ts:150`) all call the shared predicate; no gate holds a private copy.
- `feature_catalog_code` — **partial**. `feature-catalog/cli-surface/advisor-recommend.md:33` promises "A prompt that matches `NO_EDIT_REQUEST` gets no command from any hub, because a reader who rules out a change is never handed work that writes", and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` repeats it for the meaning gate. The predicate-level sentence stays literally true, but the product promise is contradicted for the object-bearing wording class by P1 finding 1: a reader who rules out a change is handed `/create:agent`.

## Integration Evidence

- Exact surfaces named: `017-review-pass-two-remediation` REQ-001 and AC-001/AC-027 (the owning phase packet for both changed surfaces), `feature-catalog/cli-surface/advisor-recommend.md:33`, `feature-catalog/scorer-fusion/command-meaning-matching.md:36`, `runtime/lib/README.md` (command-attach row).
- Exact surfaces exercised: the hook check CLI against the retained probe roots; `node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` (32 pass); `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts` (26 pass); the predicate and `attachCommand` against the current and pre-commit modules.
- Not verified, and recorded as such: the commit's wider suite claim ("Suite 184 files, 1798 passed... Doctor tests 1215") — the dispatch permits only the two named single test files. No claim in this lineage depends on it.

## Edge Cases

- State-integrity note: the iteration 2 canonical record carries `findingsSummary {"P0":0,"P1":2,"P2":1}` where the run itself raised 1 P1 and 1 P2. The delta finding rows and `deep-review-findings-registry.json` carry the correct split (P1 1, P2 2 cumulative at run 2), so the registry and dashboard are authoritative and no phantom finding was created. The transcription value is named here rather than rewritten, because the state log is append-only and a second run-2 row would break the one-record-per-iteration gate.
- AC-001's literal wording scopes it to requests *ending* in a no-edit phrase; the P1 case does not end in one. This is why the traceability result is `partial`, not `fail`: the criterion is met as written while the product promise at the catalog row is not.
- The retained `probes/` roots (including `command-attach-pre.ts`) are review evidence inside the lineage, not repo artifacts.

## Ruled Out

- "The commit's two fixes leave no regression anywhere": ruled out for the no-edit half by P1 finding 1, and confirmed clean for the hook half by iteration 1's eleven probes.
- "The packet's acceptance rows are falsely marked Met": ruled out — AC-001 and AC-027 are scoped to the literal classes they tested and both still pass; what is missing is a row for the object-bearing class, recorded as P2 finding 1.
- "Doc drift in the feature catalog": ruled out as a separate finding — both catalog rows describe the predicate mechanism correctly; the contradiction is behavioural (P1 finding 1), not stale wording.

## Next Focus

- Dimension: none remaining; maxIterations (3) is reached.
- Focus area: synthesis — reconcile the active P1 and four P2s into the review report and the release-readiness state.
- Reason: hard stop `maxIterationsReached` per the workflow's convergence step 1a.
- Rotation status: correctness, maintainability and traceability covered; security had no surface in this diff (pure parsing predicates, no trust boundary crossed).
- Required evidence: registry counts, verdict recomputation, and both permitted suites green.

## Verdict

Both fixes were checked. The hook check fix holds with one pre-existing P2 false-`ok`; the no-edit fix introduced an active P1 regression and one P2 incomplete-fix case. Two test-table gaps are recorded as P2 advisories. Active P1 with no P0.

Review verdict: CONDITIONAL
