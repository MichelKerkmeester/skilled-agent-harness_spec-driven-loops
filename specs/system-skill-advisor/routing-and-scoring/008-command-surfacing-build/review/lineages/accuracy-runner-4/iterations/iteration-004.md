# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-4`, pass four)
- Session: `fanout-accuracy-runner-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Dimension: D4 Maintainability, plus the terminal adjudication replay
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: adjudicate (10 review actions)
- Operator review focus bound as `review_focus`: pass-four review of command surfacing in the `accuracy-runner` area; close the coverage map, re-read every active finding's evidence, and keep the terminal record honest about the loop stopping at the configured cap.
- How this iteration addressed the focus: it read the summary's key space around `unscored` and `paired`, then re-read the two active P1s and the four earlier P2s at their cited lines. It found the `paired` key collision and the dead `workflow.unscoredOnly` field, confirmed the active findings still describe the code on disk, and recorded that the loop's fourth iteration is also its last configured iteration. Holdout rows were counted only.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1345-1405,1600-1705,1742-1815,1856-1957`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1610-1770`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:486-499` (active P1 re-read)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:595-607,666-677` (active P1 re-read)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:149-282` (active P2 re-read)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:122-123` (active P2/P1 doc lines)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (ids, splits and row types only; no holdout prompt text)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The iteration-1 offered-field P1 and the iteration-2 fit-gate P1 remain active; both were re-read at their cited lines and still describe the code on disk.

### P2 Findings

1. **An arm named `paired` is silently hidden or overwritten by the summary's pair block** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1911` -- The summary reserves the `unscored` key for its own count (`RESERVED_ARM` at `:1347-1352`), but `paired` is not reserved. `project` writes every arm into `block[arm]` (`:1869-1871`), then writes the comparison into `block.paired` (`:1892`). `writeSummary` skips any arm named `paired` (`:1911`). A run-log line whose `arm` is `paired` is therefore absent from the text summary, and with `--pair` its counts are replaced by the comparison object.
Finding class: maintainability / reserved-key collision
Scope proof: `RESERVED_ARM` is the only reserved arm label; `rg -n "paired"` shows `project` and `writeSummary` use the key without a guard; the documented arm names are `pre`, `post` and `g2`, but `--arm` accepts an operator string and the code already defends the other reserved word.
Affected surface hints: `score-command-transcripts.mjs` `armOf`, `project`, `writeSummary`; `command-transcript-score.vitest.ts` pair cases.
Case: a run log line `{"runtime":"claude","rowId":"cmd-create-agent-plain-tune-01","arm":"paired","exit":0,"locator":{...}}` is read; `armOf` returns `paired`; the text summary prints no `paired:` arm line, and `--pair pre,post` replaces the arm's block with `{from,to,rows,gained,lost,...}` so its counts disappear.

2. **The workflow block's `unscoredOnly` count is never incremented** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1629` -- `newTally` initializes `workflow.unscoredOnly` to 0 and `tallyBlock` adds it to `tally.unscored` (`:1698`), but no code writes it. Every `workflow.unscored` is therefore the arm's `tally.unscored` alone, and the field reads as a separate category that never exists.
Finding class: maintainability / dead field
Scope proof: `grep -n "unscoredOnly"` finds only the declaration and the read; no increment appears in `addScored` or `summarize`.
Affected surface hints: `score-command-transcripts.mjs` `newTally`/`tallyBlock`; README workflow block.
Case: an arm with one unscored run reports `workflow.unscored: 1`; the `unscoredOnly` term contributes 0, so a maintainer who wires a separate count or reads the field as "unscored only for the workflow" gets the arm total, not a distinct value.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The area is a measurement harness; no normative spec threshold names these keys. |
| `checklist_evidence` | core | partial | The parent packet holds no checklist. |
| `skill_agent` | overlay | notApplicable | No agent definition owns the area. |
| `agent_cross_runtime` | overlay | partial | The summary key space is runtime-independent; live per-runtime proof stays phase 007's. |
| `feature_catalog_code` | overlay | partial | README rows checked through iteration 3; the `paired` key claim is finding 1's doc side. |
| `playbook_capability` | overlay | notApplicable | No playbook scenario names these keys. |

## Integration Evidence

- Reserved arm handling: `score-command-transcripts.mjs:1345-1352`.
- Summary projection: `score-command-transcripts.mjs:1856-1900`.
- Text writer: `score-command-transcripts.mjs:1902-1957`.
- Workflow tally: `score-command-transcripts.mjs:1600-1640,1688-1735`.
- Pair tests: `command-transcript-score.vitest.ts:1610-1770`.
- Active P1/P2 evidence re-read: `command-offer.mjs:486-499`; `capture-command-routing-baseline.mjs:595-607,666-677`; `command-routing-slice.vitest.ts:149-282`; `README.md:122-123`.

## Edge Cases

- The `paired` collision needs an operator-supplied arm label; the runner's documented sets are `pre`, `post` and `g2`, so the reach is a mistyped or deliberately named arm, not a default run.
- The `paired` block is only written when the two arms share at least one owned row; the reserved-key bug exists with or without a pair because `writeSummary` skips the arm name unconditionally.
- The `unscoredOnly` term is zero in every block; it never changes a rate, so the defect is clarity rather than a wrong count.
- The active P1s were not downgraded: `offeredAs` is still absent from both writers, and the fit `carried` is still only checked against `total`.

## Confirmed-Clean Surfaces

- `armOf` files `unscored` under `unknown`, so the one reserved word the code does defend cannot overwrite the runtime's `unscored` count.
- `project` computes `largestRuns` from run counts, and `armIncomplete` is correct for a runtime that ran fewer turns.
- The pair comparison counts only the intersection of the two arms' `pairRows`, and the one-arm case produces no block.
- The active P1 evidence is unchanged: both writers still omit `offeredAs`, and the capture still continues before the false-offer tally.

## Ruled Out

- **A new correctness or security finding in the summary key space.** The `paired` collision is a naming/reservation gap; the counts themselves are correct when the arm name is not reserved.
- **The iteration-1 P1 is stale.** Re-read `command-offer.mjs:486-499`; both writers still omit `offeredAs`.
- **The iteration-2 P1 is stale.** Re-read `capture-command-routing-baseline.mjs:595-607,666-677` and the baseline's `fit.decline.carried: 8`; the rows still leave the false-offer tally.
- **The `noOwner` pair exclusion is a counting bug.** It is the documented `pairRows` rule; the README's wording is the iteration-3 finding, not a second defect.
- **A holdout leak in this iteration.** The summary keys and the new findings name no holdout prompt; the fit and stage blocks stay counts-only.

## Next Focus

- Dimension: none (maintainability is the last configured dimension)
- Focus area: terminal synthesis and the active-finding replay
- Reason: the loop reaches `maxIterations=4` after this iteration; the next step is the synthesis report and the closeout event, not another dispatch. The two active P1s keep the verdict CONDITIONAL; the seven P2s are advisories.
- Rotation status: all four dimensions covered; no new dimension remains
- Required evidence: the findings registry, all four iteration files and deltas, and the reducer's final state
- Recovery note: the run did not reach a legal graph-backed convergence; the stop reason is `maxIterationsReached`, and the report must say so.

Review verdict: CONDITIONAL
