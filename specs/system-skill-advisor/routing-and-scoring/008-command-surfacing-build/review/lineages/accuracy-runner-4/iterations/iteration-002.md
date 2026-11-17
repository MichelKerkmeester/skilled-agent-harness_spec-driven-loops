# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-4`, pass four)
- Session: `fanout-accuracy-runner-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Dimension: D2 Security, with the holdout-integrity and mutating-command checks the brief names
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (11 review actions)
- Operator review focus bound as `review_focus`: pass-four review of command surfacing in the `accuracy-runner` area; the safety question is whether a refusal, a question or a mention of a command can still attach or start a mutating command, and whether a tune/fix/report path reads or leaks a holdout row.
- How this iteration addressed the focus: it read the new fit/decline branch against the `false_offer` silence metric and the committed baseline, then read the slice test's holdout publication guard against the live capture rather than only the committed file. It found that the 24 refusal/question/small-edit/app-problem rows are removed before the false-offer tally and their carried count (8 of 24 in the baseline) is checked only against itself, and that the holdout publication guard reads the baseline maps, not the live ones. Holdout rows were handled as ids, splits and aggregate counts only; no holdout prompt text was printed.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:560-700,726-776`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:40-47,1955-1985` (counts only)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:149-197,237-267`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:118-123`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1225-1236,1500-1514`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:238-302,346-363`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (ids, splits, row types and aggregate counts only; no holdout prompt text)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The refusal and question rows can still carry a command, and no gate consumes the count** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:595` -- The capture counts `skill-only` and `decline` rows as fit rows and `continue`s before the `wantsSilence` false-offer block (`:666-677`). The only record of a decline row that carries a command is `attachedMetrics.fit.decline.carried`. The committed baseline records `8` of `24` (3 of 6 refusals, 3 of 6 questions, 2 of 6 small-edits, 0 of 6 app-problems; `command-routing-baseline.json:1961-1984`), and the slice test's only assertion on it is `carried <= total` (`command-routing-slice.vitest.ts:249-258`). The `false_offer` ratchet remains `0 of 35` because those rows never reach it, and no test compares `carried` to the baseline. The brief asks whether a refusal or a question can still attach a mutating command; the answer is yes on 8 of 24 rows, and nothing fails.
Finding class: security / measurement-gate (cross-consumer)
Scope proof: the fit `continue` is the only branch that removes the rows from the silence tally; `false_offer` is the only silence metric; the bridge table marks 26 of 63 commands `mutates` and the fit tally never reads that field, so the 8 are not filtered by mutating status. `rg -n "fit"` in the slice test finds only the totals and the `carried <= total` check.
Affected surface hints: `capture-command-routing-baseline.mjs` fit branch; `command-routing-slice.vitest.ts` sealed-fit test; `command-routing-baseline.json` fit block; README fit-row paragraph.
Case: a holdout `fit-decline-refusal-*` row's prompt is a refusal, but its top recommendation is a command bridge; `headCarriesCommand` returns true, `fit.decline.carried` rises, the `false_offer` count does not move, and every test in the slice file stays green, so the pass's own safety check cannot distinguish 8 from 9 or from 24.

```json
{
  "type": "claim",
  "claim": "The 24 decline rows are removed before the false-offer tally and their carried count is only checked against itself, so a refusal or question that carries a command cannot fail any test or gate; the committed baseline records 8 of 24.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:595-607",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:666-677",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1961-1984",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:249-258",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:121"
  ],
  "counterevidenceSought": "Checked whether the fit rows are included in false_offer (they are not); checked whether the slice test compares carried to the baseline (it does not; only carried <= total); checked whether the handler's commandOnlyMentioned guard should keep carried at 0 (the baseline was captured after the withhold fix and still records 8); checked whether the 8 are read-only (the tally never reads the bridge's mutating field; 26 of 63 entries are mutates).",
  "alternativeExplanation": "The fit block may be an advisory measurement of handler quality rather than a release gate, and the 8 may be commands the handler intentionally offers on those row kinds; in that case the defect is the missing gate/README wording, not the handler.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the packet's decision record says the fit block is advisory-only and the 8 are accepted, downgrade to P2 and record it as an accepted risk; if a test or gate is added that fails on carried > baseline, the finding resolves."
}
```

### P2 Findings

1. **The holdout publication guard reads the baseline, not the live capture** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:181` -- `publishes no holdout row` builds its published set from `baseline.attachedMetrics` and `baseline.rows`, not from `live`; `matches the captured baseline row by row` removes every holdout id from both sides before comparing (`:154-157`); and the new fit test filters only ids that start with `fit-` (`:262-266`). A capture regression that published a plain or typed holdout row would therefore leave every live assertion green until the baseline was re-captured.
Finding class: security / evaluation-integrity
Scope proof: `publishRow` is the only publication gate in `scoreCommandCorpus` (`capture...:579,651,663`); the slice file's live maps are `live.rows`, `live.attachedMetrics.attachedRows` and `typedRows`; the only live holdout check is the `fit-` prefix filter.
Affected surface hints: `command-routing-slice.vitest.ts` holdout tests; `capture-command-routing-baseline.mjs` `publishRow` and row maps.
Case: set `publishRow = true` for every row; a non-fit holdout id enters `live.rows`; `matches the captured baseline row by row` filters it out as a holdout id, `publishes no holdout row` still reads the old baseline, and the `fit-` filter ignores it, so the slice suite passes with a holdout row now published.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The fit/decline rows measure the packet's command-surfacing safety rule; the gate is not tied to a spec threshold. |
| `checklist_evidence` | core | partial | The parent packet holds no checklist. |
| `skill_agent` | overlay | notApplicable | No agent definition owns the area. |
| `agent_cross_runtime` | overlay | partial | The fit rows are runtime-independent; live per-runtime proof stays phase 007's. |
| `feature_catalog_code` | overlay | pending | Scheduled for iteration 3. |
| `playbook_capability` | overlay | pending | Scheduled for iteration 3 if reached. |

## Integration Evidence

- Fit branch and silence tally: `capture-command-routing-baseline.mjs:592-607,666-677`.
- Fit output: `capture-command-routing-baseline.mjs:755-776`; committed counts at `command-routing-baseline.json:1961-1984`.
- Slice assertions: `command-routing-slice.vitest.ts:149-197,237-267`.
- Holdout refusal before the reader: `score-command-transcripts.mjs:1225-1236,1500-1506`.
- Backfill trust boundary: `command-offer.mjs:346-363,448-475`.
- Shared doc: `README.md:118-123`.

## Edge Cases

- Holdout rows: handled as ids, splits and aggregate counts only; no holdout prompt text was printed. The fit block is entirely holdout by construction (`split: holdout` for all 48 fit rows), so its publication is counts-only by design.
- The `8 of 24` is a count of rows whose top recommendation maps to a command; it is not a count of commands that were started. A head that carries a command is the misfire the fit row exists to detect, not a start.
- The bridge's `mutating` field is present on 27 entries and absent on 36; the fit tally does not read it, so a read-only command (`/speckit:search`) and a mutating creation command count the same.
- An app-problem row with 0 carried is the one kind whose head stayed silent in the baseline; the other three kinds carry at least two rows each.

## Confirmed-Clean Surfaces

- `scoreRun` marks a holdout row and returns `holdout_row` before `loadSession`; the holdout prompt text never reaches a reader.
- `loadRowLabels` stores only `{holdout: true}` for a holdout row, so the scorer's label object carries no prompt.
- `publishRow` guards `rows`, `attachedRows`, `typedRows` and `needsModeRows`; the committed baseline's 132 published rows equal the 132 non-holdout rows.
- `backfillRunLog` refuses an untrusted checkout and writes only after every prompt resolves; the pass-two trust boundary holds.
- `briefDelivered` reads a transcript path from a run line but returns only a boolean or `unknown`; no transcript content is printed.

## Ruled Out

- **A holdout row reaching the scorer through `--summary`.** `scoreRun` returns before `loadSession`; the label map marks it. Re-checked after the pass-four changes.
- **A holdout prompt leak in the new fit/stage blocks.** The blocks carry counts and `byKind` totals only; the new slice test checks the `fit-` prefix against the live maps.
- **A backfill executing code from an untrusted checkout.** `trustedCheckout` admits only the project root or an arena with the builder's marker; a run line without a checkout is refused with `no_checkout`.
- **A fit row's prompt leaking through the duplicate error.** `assertFitRowsUnique` names the two row ids, never the prompt text.
- **A `--pair` comparison using a holdout row.** The comparison reads `pairRows`, which only holds scored non-holdout rows.

## Next Focus

- Dimension: traceability
- Focus area: whether the new fit/stage counts are held to the committed baseline, and whether the README's new claims match the code
- Reason: the safety counts are now reported but not ratcheted; the README's `offeredAs` claim already disagrees with both writers (iteration 1), so the remaining docs and the attached-metrics block need a baseline check
- Rotation status: correctness and security complete; traceability next
- Required evidence: `command-routing-slice.vitest.ts:149-282`, `capture-command-routing-baseline.mjs:726-776`, `README.md:118-123,187`

Review verdict: CONDITIONAL
