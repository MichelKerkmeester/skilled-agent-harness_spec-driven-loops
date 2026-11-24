# Iteration 5 - Maintainability: the reducer's strategy contract

## Dimension

Maintainability, judged on the maintenance surface the packet added or touched: the deep-loop reducer that keeps the review's own state coherent, the comment truth of the changed code, the two-copy parity cost, and the fixture's growth. The operator focus is carried as the closeout question: does the packet's own evidence chain survive another run?

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2355-2465`, `:2480-2600` (strategy update, anchor replacement, exhausted-approach rendering)
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:1-120` (refinement closeout)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:24-1519` (comment truth and export reach)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440-500`
- `.skilled/hooks/injection-contract.md:50-60` (the brief's offer sentence)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-strategy.md` (this lineage's state, observed as the reducer's output)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The strategy updater duplicates a machine-owned heading it was meant to normalize** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2396` -- `replaceAnchorSection` writes `## <heading>` inside the replacement block, and it takes that branch whenever the anchor markers already exist. A strategy authored in the shape the shipped template uses - heading first, machine marker under it - therefore ends with the heading twice: the author's own heading above the anchor and the reducer's copy inside it. The heading fallback below (`:2407`) exists to stop exactly this, but it is unreachable once the anchor branch has matched, so the duplication is permanent: a second reducer pass leaves both headings in place.
Finding class: state-format
Scope proof: the reducer is the only writer of that block, the duplicate is visible in the strategy this lineage produced, and a second identical pass did not remove it.
Affected surface hints: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2390-2416`, `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md` (heading-first template shape), every `deep-review-strategy.md` rendered from that template
Case: a run that starts from the shipped strategy template and then reduces once shows "## 3. REVIEW DIMENSIONS (remaining)" twice, and the same for the completed-dimensions and next-focus sections; here 3 sections carry 6 headings after two passes.

```json
{"type":"claim-adjudication","claim":"The anchor branch of the strategy updater inserts its own heading and never removes the author's, so a heading-first strategy ends up with each machine heading duplicated and stays that way.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2396",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2407"],"counterevidenceSought":"Read both branches of replaceAnchorSection and the heading fallback; re-ran the reducer on the same input and counted the heading, which stayed at two.","alternativeExplanation":"The duplicate may be read as a second, authored section rather than a defect, and a later read may take the authored heading as the live one.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Withdraw if the strategy template is changed to place the heading inside the anchor markers, or if the updater learns to drop a heading immediately above the anchor."}
```

2. **A direction ruled out once is rendered as a blocked approach that must not be retried** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2363` -- `buildExhaustedApproaches` folds `iteration.ruledOut` into the exhausted-approach section and renders each entry as `BLOCKED (iteration N, 1 attempts)` with "Why blocked: Repeated iteration evidence ruled this direction out" and "Do NOT retry". A direction ruled out in a single pass with direct evidence was never attempted-and-blocked, and the review prompt tells later iterations not to re-enter anything listed there, so one pass of evidence freezes the direction for the rest of the run.
Finding class: state-semantics
Scope proof: the renderer is the only producer of that section; its three fixed lines are visible in this lineage's strategy for four one-pass directions.
Affected surface hints: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2359-2387`, `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md:74-87` (the template's exhausted-approach section), the iteration prompt's "swept or saturated" guard
Case: iteration 2 ruled out a waiver with a missing ADR by reading the decision record once; iteration 5's strategy now reads "A waiver whose ADR is missing: ... -- BLOCKED (iteration 2, 1 attempts) ... Do NOT retry", so a later iteration is told not to re-check a direction that was only settled by evidence.

```json
{"type":"claim-adjudication","claim":"buildExhaustedApproaches treats a single-pass ruled-out direction as an exhausted, blocked approach and instructs later iterations not to retry it.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2363",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2380"],"counterevidenceSought":"Read the renderer and the template's section contract; checked the rendered output in this lineage's strategy, which shows four such entries with '1 attempts'.","alternativeExplanation":"Folding ruled-out directions into one 'do not repeat' list may be deliberate economy: the loop should not spend depth re-proving what one pass settled, and the wording 'Do NOT retry' then means 'do not re-open without new evidence'.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"Withdraw if the template or the state-format doc states that ruled-out directions are intentionally frozen after one pass."}
```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Held from iteration 2; the maintainability pass added no requirement drift |
| `checklist_evidence` | pass | Held from iteration 4; the two findings above are not claimed by any ticked task |

- REQ-032's refinement fold was read again for maintenance: `refinesSameLocation` and the storage-key split are commented with the reason each branch exists, and the unit suite that pins them is `reduce-state-refinement-other-file.vitest.ts` (12 `refines` references).
- REQ-031's parity guard is a behavioural comparison, not just a list comparison: `test_skill_advisor.py:2854` reads the shared fixture and compares `asks_for_loop_run`, `is_stuck_run_complaint`, `is_writing_about_topic`, the served column and the typed columns on every case, so grammar drift fails the same test as vocabulary drift.
- Evidence: `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2363]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854]`

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` writes the strategy file the review prompt reads on the next iteration, and `/deep:review`'s workflow calls it after every iteration; both findings sit on that one hand-off.
- `.skilled/hooks/injection-contract.md:56` carries a second literal copy of the brief's offer sentence; it agrees with `render.ts:251` word for word today, so no finding is raised, but the pair is unguarded.

## Edge Cases

- A strategy authored with the heading already inside the anchor markers is unaffected by finding 1; this lineage's file was authored heading-first, which is what the shipped template models.
- Two reducer passes were run to test whether the duplicate self-heals; it does not, so the finding is not an artifact of one pass.
- The second finding's severity is held at P2 and its confidence at medium: the wording can be read as deliberate economy, and nothing in the packet states which reading is intended.
- Comment truth: no reviewed code comment embeds an ADR, REQ, CHK, task id or spec path, so the repository's comment-hygiene prohibition holds across every changed source file.

## Confirmed-Clean Surfaces

- Comment hygiene: a scan of every changed source file for `REQ-`, `ADR-`, `CHK-`, `specs/`, `AC-0NN` and `T0NN` inside comment lines returns nothing.
- Dead exports: every export of `command-attach.ts` that the packet added has a reader in the runtime or its tests (`namesDeepRun` 3, `LOOP_REQUEST` 2, `RUN_REFUSED` 2, `SMALL_EDIT_WORDING` 2, the rest higher).
- Comment truth in the gate: the `LOOP_WORDING` comment's claim that each phrase is listed in both spellings is true of the list (`deep research`/`deep researches`/`deep-research`/`deep-researches`, `deep review`/`deep reviews`/`deep-review`/`deep-reviews`).
- The offer sentence in the hook contract and the one in `render.ts` agree exactly, so the brief cannot teach a different option set than its contract.

## Ruled Out

- A comment that contradicts its pattern in the changed gate code: every changed block's comment states the grammar beside it.
- A dead export left behind by the packet: every added export has at least one reader.
- A duplicated offer literal that has already drifted: the two copies agree word for word.
- A fixture that only the TypeScript suite reads: the Python suite reads the same 285 cases and compares the served and typed columns.

## Next Focus

- Dimension: correctness
- Focus area: second pass over the served-head composition (`attachCommand` -> `attachTypedCommand`) and the two degraded paths, where iteration 1 sampled predicates but did not follow the row from the handler to the rendered label end to end
- Reason: maintainability found the reducer weak spots; the served-head path is the one place where correctness and traceability meet and it has not been followed end to end
- Rotation status: all four canonical dimensions covered; this is a second pass for depth
- Blocked/productive carry-forward: the reducer's exhausted-approach list now freezes four directions; none of them is the served-head path, so this focus is clear
- Required evidence: a file:line per branch from handler to label, with one built-copy behaviour sample
- Recovery note: none

Review verdict: PASS
