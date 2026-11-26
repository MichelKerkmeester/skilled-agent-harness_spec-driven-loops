# Review Iteration 3

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Run: `fanout-deepseek-max-3-1795552859377-13gxwk`, lineage `deepseek-max-3`, generation 1
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Dimension: maintainability
- Steer file: absent at dispatch time
- Operator review focus addressed: the maintainability pass the focus asks for inside iterations 1 to 4. It read the drift guard the focus's `REQ-051` and `REQ-031` rest on, plus the closure-doc citation tails; it records two P2 guard holes and hands the REQ-by-REQ trace to iterations 4 to 7.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:110-180, 480-540, 560-777`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-10`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854-2880`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:205-330, 380-560, 1150-1781`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4471-4485, 5063, 5230-5440`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:108-180`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56-118`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:16-120, 249-352`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py:1-60`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. Iteration 1's active P1 keeps the verdict at CONDITIONAL.

### P2 Findings

3. **The drift guard's coverage test only recognizes Python pattern names ending in `_RE`, and never checks that an excused name still exists** -- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:691` -- `compiled` is collected with `^(_[A-Z0-9_]+_RE) = re\.compile\(`, so a gate pattern compiled under any other name is invisible to the accounting, and the `PATTERNS_NOT_COMPARED` rows are only asserted to carry a non-empty reason (`:675`), not that their Python name exists.
Case: adding `_LOOP_SOMETHING = re.compile(...)` inside the gate slice leaves every drift test green, although the pattern is neither compared nor listed, which is the exact failure `REQ-051` says the guard prevents.
- Finding class: class-of-bug
- Scope proof: `rg -n "_RE\\) = re\\\\.compile"` finds this one coverage test and no other reader; the 43 names it admits today all end in `_RE`, so the gap is latent rather than active. `PATTERNS_NOT_COMPARED` holds 14 names without `_RE` (`_MODE_CUE_PATTERNS` at `:596`, `_LOOP_MULTI_PASS` at `:597`, `_CMD_DECLINE_LEADS` at `:606`, among them) that no test ever resolves.
- Affected surface hints: ["deep-loop-offer-cases.vitest.ts coverage test", "PATTERNS_NOT_COMPARED table", "skill_advisor.py gate compile names"]

4. **Both suites read the same fixture rows, so a misreading shared by the two copies passes the parity test** -- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` -- the TypeScript and Python suites both drive `asksForLoopRun` from the same 359 rows (`test_deep_loop_offer_gate_parity` at `tests/python/test_skill_advisor.py:2854`, the vitest reader at `tests/deep-loop-offer-cases.vitest.ts:111`), so the parity oracle cannot distinguish "both copies agree" from "both copies are wrong".
Case: `how do I run a deep review on this? it took 5 iterations last time` is a how-to question with a trailing fact; both copies answer `true` and no fixture row covers the interaction, so both suites stay green while the offer contradicts `REQ-036`.
- Finding class: matrix/evidence
- Scope proof: `rg -n "deep-loop-offer-cases.json|test_deep_loop_offer_gate_parity"` shows the two suites are the only fixture readers; the differential sweeps the tasks cite (227 prompts, 3,729 grammar prompts) are recorded as prose in `tasks.md` and no kept script reproduces them.
- Affected surface hints: ["shared fixture", "python parity test", "vitest fixture reader", "scratch probe sweeps"]

## Traceability Checks

- `checklist_evidence` (partial, maintainability slice): the verification summary counts agree with the boxes it counts. `tasks.md` holds 12 P0 checks with 11 ticked (CHK-020 open), 13 P1 ticked, and 1 P2 ticked, which is exactly the `Verification Summary` table at `tasks.md:343-347`. `T084` is the only open task, and it matches AC-040's `Unmet`.
- `checklist_evidence` evidence tails: `PYTHONDONTWRITEBYTECODE=1 python3 scratch/citations/evidence-tails.py acceptance-criteria.md tasks.md` printed `problems=0`, so every `Evidence: path:N (anchor)` tail resolves to the line that carries its anchor and no backticked `path:line` citation survives outside a tail.
- `spec_code` (partial, scope slice): every tracked change-set path named in `spec.md` section 3 is a line of `review/fanout-review-scope.txt`; the only declared entry absent from the scope is the gitignored `runtime/dist/` directory that `T111` excludes and `npm run build` regenerates.

These are partial results for the two core protocols. Their full pass/fail status is recorded in iterations 4 to 7.

## Integration Evidence

- Checked `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` against the drift contract it implements, and `tests/python/test_skill_advisor.py` against the same fixture. Both name the shared fixture by absolute path resolved from the test file, so a moved fixture fails rather than silently reading nothing.
- Checked `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py` against `acceptance-criteria.md` and `tasks.md`; it resolves each path through the packet, the advisor runtime, the deep-loop runtime, the deep command assets and the changelog, then falls back to `git ls-files`.

## Edge Cases

- The `VOCABULARY_PAIRS`/`PATTERN_PAIRS` tables are generated from the native exports, so a renamed Python tuple fails through `pythonTupleEntries` returning `undefined` rather than comparing empty (`deep-loop-offer-cases.vitest.ts:730-760`). That mechanism is sound; the two findings above are about the edges around it.
- `PATTERNS_NOT_COMPARED` mixes names that exist outside the gate slice (`_MODE_CUE_PATTERNS`, built as a dict) with names that are grammar fragments (`_LOOP_COUNT_WORDS`). Neither kind can be resolved by the current test, which is why the existence check is the missing half.
- The maintainability pass read closure-doc citations but did not re-derive their observed dates or counts; those claims are traceability work and are checked in iterations 4 to 7.

## Confirmed-Clean Surfaces

- Every exported word list the gate builds a pattern from has a `VOCABULARY_PAIRS` row except the three the packet names as outside the guard (`SMALL_EDIT_WORDING`, `COMMAND_DECLINE_LEADS`, `COMMAND_ASK_LEADS`), and the two built leads are compared through the lists they are built from (`deep-loop-offer-cases.vitest.ts:120-147`).
- `_LOOP_DIGIT_COUNT_RE` is compared with `ITERATION_COUNT` in `PATTERN_PAIRS` (`:506`), so the count pattern itself is covered even though its interaction is not (finding 4).
- `LEAD_WINDOW` and `ADVISOR_PROMPT_MAX_CHARS` are read back from the Python source and compared with the native numbers (`NUMERIC_PAIRS`, `:150-156`), matching `REQ-030`'s parity clause.
- The mode vocabulary is read against four surfaces (command table, `MODE_CUES`, `MODE_CUE_WORDS`, `hub-router.json`) and every loop name is served through the real gate (`:760-777`).
- No changed code comment carries an `ADR-`, `REQ-`, `CHK-` or task id, and no spec path appears in a comment; the only match for those tokens is the hygiene directive string that states the rule (`render.ts:131`).

## Ruled Out

- A stale `evidence-tails.py` checker: it validates the anchor on the cited line, reports a stray `path:line` citation outside a tail, and exits non-zero on any problem; it printed `problems=0` on both docs (iteration 3).
- A closure-doc count drift in the Verification Summary: the P0/P1/P2 totals and verified counts match the boxes exactly (iteration 3).
- A missing declared change-set path in the review scope: only the gitignored `runtime/dist/` is absent, which `T111` excludes by design (iteration 3).

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` over `REQ-001` to `REQ-019` against the code and the decisions that record them, plus `checklist_evidence` over the first half of the acceptance rows
- Reason: iterations 4 to 7 are the traceability span the operator focus leads with; the first batch is the older REQ range whose evidence has been re-cited most often
- Rotation status: correctness, security and maintainability recorded; traceability takes the remaining four iterations
- Blocked/productive carry-forward: the citation checker and the fixture parity replay are productive; reuse both
- Required evidence: file:line for every REQ claim, and the decision record for each ADR-backed requirement

Review verdict: CONDITIONAL
