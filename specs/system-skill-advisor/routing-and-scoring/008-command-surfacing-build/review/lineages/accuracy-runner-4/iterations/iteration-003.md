# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-4`, pass four)
- Session: `fanout-accuracy-runner-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Dimension: D3 Traceability, with the docs-vs-code and ratchet checks the brief names
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (11 review actions)
- Operator review focus bound as `review_focus`: pass-four review of command surfacing in the `accuracy-runner` area; check whether the docs agree with the code and whether the new counts are held to the committed baseline.
- How this iteration addressed the focus: it compared the slice file's only live comparisons with the new `attachedMetrics.plain_stages` and `attachedMetrics.fit` blocks, and compared the README's `--pair` sentence with `project`'s shared-row gate. It found that the new stage/fit counts are reported and tested by invariants but never compared to the committed baseline, so the ratchet claim does not cover them, and that the README promises a `paired` block for any runtime that scored both arms while the code requires the arms to share at least one owned row. The `offeredAs` doc contradiction was already recorded as the iteration-1 P1 and was not re-reported.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:149-168,199-282`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:726-776`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1940-1985` (counts only)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1742-1815,1856-1900,1902-1957`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:91-123,187`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1610-1770`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (ids, splits and row types only; no holdout prompt text)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The two iteration-1 and iteration-2 P1s remain active and are carried forward.

### P2 Findings

1. **The new stage and fit counts are not held to the committed baseline** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:268` -- `matches the captured baseline row by row` compares `live.rows` with `baseline.rows` (`:149-168`), and `matches the captured totals` compares only `metrics` and `unreachable` (`:268-282`). The pass-four `attachedMetrics.plain_stages` and `attachedMetrics.fit` blocks are never compared to the committed values; the new tests read `live` only and assert partitions (`own + ownerLed + neither = total`), nesting (`attached <= withCommand <= ...`) and fixed totals (`24`/`24`, `6` per kind). The capture module's own header says the result is the ratchet baseline and "holds every count to it", and the README repeats the claim, but a stage or fit miscount that preserves those invariants passes.
Finding class: traceability / ratchet
Scope proof: the slice file's only baseline comparisons are `rows` (`:149-168`), `metrics` and `unreachable` (`:268-282`); `CommandRoutingBaseline.attachedMetrics` is typed `Readonly<Record<string, unknown>>`, so the new blocks have no typed baseline comparison. The new live tests at `:217-267` never read `baseline`.
Affected surface hints: `command-routing-slice.vitest.ts` baseline tests; `capture-command-routing-baseline.mjs` attachedMetrics output; `command-routing-baseline.json` stage/fit blocks; README capture row.
Case: change `headCarriesCommand` to `landed[0] != null || landed.length > 0`, so a command in the second or third top recommendation counts; `fit.skillOnly.carried` and `fit.decline.carried` rise, the fixed totals stay 24/24, the `carried <= total` check passes, and no baseline comparison fails; the committed `8 of 24` drifts silently.

2. **The README promises a `paired` block for any runtime that scored both arms, but the code requires a shared row** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:122` -- The README says `--pair <from>,<to>` "adds a `paired` block ... to a runtime that scored both arms". `project` adds the block only when `shared.length > 0` (`score-command-transcripts.mjs:1880-1894`), and `pairRows` only holds rows with a workflow path, so a row with no owner is excluded too (`:1749`). Two arms that score disjoint row sets, or share only unowned rows, report no `paired` block. The one-arm test covers only the missing-arm case (`command-transcript-score.vitest.ts:1740-1765`).
Finding class: traceability / documentation
Scope proof: the README sentence is the only doc claim; `project` is the only writer of `block.paired`; `pairRows` is populated only for `workflowPath !== 'noOwner'`; no test covers two arms with a disjoint owned-row set.
Affected surface hints: `score-command-transcripts.mjs` `project`/`pairRows`; `command-transcript-score.vitest.ts` pair tests; README `score-command-transcripts.mjs` row.
Case: a `pre` arm scores row A and a `post` arm scores row B, both `scored: 1`, with `--pair pre,post`; the JSON has no `paired` key, while the README says a block is added because both arms scored.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The new counts are the packet's measurement surface; no spec threshold is tied to them. |
| `checklist_evidence` | core | partial | The parent packet holds no checklist. |
| `skill_agent` | overlay | notApplicable | No agent definition owns the area. |
| `agent_cross_runtime` | overlay | partial | The pair and stage counts are runtime-independent; live proof stays phase 007's. |
| `feature_catalog_code` | overlay | partial | The README's capture/scorer rows were checked against the code; the `paired` sentence is finding 2. |
| `playbook_capability` | overlay | notApplicable | No playbook scenario names this area's new counts. |

## Integration Evidence

- Baseline comparison points: `command-routing-slice.vitest.ts:149-168,268-282`.
- New metric tests: `command-routing-slice.vitest.ts:199-267`.
- Capture output: `capture-command-routing-baseline.mjs:755-776`; committed counts at `command-routing-baseline.json:1940-1985`.
- Pair implementation: `score-command-transcripts.mjs:1742-1815,1856-1900`; text output at `:1902-1957`.
- Pair tests: `command-transcript-score.vitest.ts:1610-1770`.
- Shared doc: `README.md:91-123,187`.

## Edge Cases

- A stage invariant (`own + ownerLed + neither = total`) holds by construction even when `ownerLed` is wrong; the test cannot tell a correct owner lookup from a constant false one.
- A fit `carried` of 0 would satisfy `carried <= total`; the test does not pin the baseline's 8.
- The `plain_stages` holdout block is all counts, so it cannot leak a row; the missing comparison is a ratchet gap, not a publication leak.
- The pair block's `rows` is the count of shared **owned** rows, not every row both arms scored; the README's word "rows" does not say owned.

## Confirmed-Clean Surfaces

- The new stage partition and nesting assertions hold for the live capture: `own + ownerLed + neither = total`, and `attached <= withCommand <= routed <= ownerLed`.
- The fit totals and kind keys match the corpus: 24 skill-only, 24 decline, 6 per kind.
- The `--pair` usage validation rejects a missing summary, one arm name, and a one-arm runtime; the text line prints the same counts as the JSON block when a shared row exists.
- The README's `offeredAs` contradiction is already the iteration-1 P1, not re-reported here.

## Ruled Out

- **A README claim that the new stage/fit blocks publish a row.** They carry counts and kinds only; the fit test verifies no `fit-` id reaches the live row maps.
- **A Wilson interval computed from the wrong denominator.** `followedRange` and `loadRange` use the same six path counts as the printed rates; the unit cases at the middle and both ends hold.
- **A pair block that includes a row only one arm scored.** `shared` is the intersection of the two arms' `pairRows`; the disjoint test gap is finding 2's converse, not a counting defect.
- **A holdout id in the baseline's stage/fit blocks.** Counts only; no row id appears.
- **A `spec_code` contradiction with a normative threshold.** The packet sets no numeric floor for these new counts; the defect is the missing ratchet, not a breached number.

## Next Focus

- Dimension: maintainability
- Focus area: the summary's key space and the pair/arm handling
- Reason: iteration 3 leaves one key-collision candidate in the same summary object and the iteration-4 adjudication needs to re-read the active P1/P2 evidence before the terminal record
- Rotation status: correctness, security and traceability complete; maintainability next
- Required evidence: `score-command-transcripts.mjs:1345-1405,1856-1957`; `command-transcript-score.vitest.ts:1610-1770`

Review verdict: CONDITIONAL
