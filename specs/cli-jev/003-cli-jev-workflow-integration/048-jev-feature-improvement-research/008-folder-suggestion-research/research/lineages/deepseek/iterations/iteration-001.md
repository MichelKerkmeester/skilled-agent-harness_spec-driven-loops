# Iteration 001 -- What drove the measured result

- **Focus:** Q1. Explain the recorded verdict `verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top` from the scorer's own mechanics, the corpus it ran on and the recorded call log.
- **Status:** complete. **newInfoRatio:** 0.85.
- **Sources read:** `score-alignment-suggestion.ts` (full), `alignment-validator.ts` (full), `022-rows.jsonl` (repo copy and scored copy, 40 rows each), `~/.skilled/.labels/runs/047-022-jev.stdout.txt`, `~/.skilled/.labels/runs/047-022-jev-20261002/calls.jsonl`, `report.json`, `022-arbiter.jsonl`, `047/scratch/evidence/results.md`, `042/scratch/evidence/card-022.md`, `042/scratch/evidence/label-inventory-1.md`, `022/{goal.md,plan.md}`, `047/goal.md`.

## Findings

**F1-01 [OBSERVED] The verdict is produced by four ordered rules over per-row modal picks.**
Rows are called three times each with the option order rotated (`PASSES = 3`, `callArgs`), reduced with a majority pick (`modalPick`, 622-632), counted as A (column right), B (baseline right), W (column-only right), L (baseline-only right), F (flips) in `countVerdict` (653-673), and judged in order coverage / kill / margin / sign test / flips / keep by `decideVerdict` (679-690).
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:59, :622-632, :653-673, :679-690, :1081-1088]

**F1-02 [DERIVED] The winning branch was the sign test; the other gates passed or did not trigger.**
Coverage `10*M >= 9*K` -> 400 >= 360 passes (679-680). Kill `P(X>=L)` with W+L=11, L=1 is binomTail(11,1) = 2047/2048 ~ 0.9995 > 0.05, so no kill (682-683). Margin `10*(A-B) >= M` -> 90 >= 40 passes (686). Sign test `binomTail(11,10)` = 12/2048 = 0.005859 < 0.05 passes (685, 687). Flips `10*F <= 3*M` -> 0 <= 120 passes (688). Verdict line prints p=0.0059 via `toFixed(4)` (696-704). The recorded p in `report.json` is 0.005859375, exactly 12/2048.
[SOURCE: score-alignment-suggestion.ts:603-609, :679-690, :696-704; ~/.skilled/.labels/runs/047-022-jev-20261002/report.json]

**F1-03 [OBSERVED] baseline=top is forced by the corpus: the target is right on 0 of 40 rows and the top alternative on 30 of 40.**
`chooseBaseline` counts `row.target === label` (target) and `row.alternatives[0] === label` (top) and picks top when top > target (583-593). In the scored corpus target==label on 0 of 40 rows and alternatives[0]==label on 30 of 40; the scorer printed `baseline: target=0 top=30 chosen=top`. The headroom gate `10*right > 9*callable` (30*10=300 < 360) did not stop the run (1269-1276).
[SOURCE: ~/.skilled/.labels/022-rows.jsonl (all 40 rows); ~/.skilled/.labels/runs/047-022-jev.stdout.txt; score-alignment-suggestion.ts:583-593, :1269-1276]

**F1-04 [OBSERVED] The corpus is a built fixture whose shape explains the counts.**
Each row pairs a session summary with a target folder that is not the row's own folder, lists exactly 3 alternatives, and carries the arbiter's label. Label position: alternatives[0] on 30 rows, alternatives[1] on 8, alternatives[2] on 2; label equals the row's own plan folder in 40 of 40 rows. The target cycles through sibling folders (for example f022-001 target=002-advisor-jev-tiebreak-arm while its label is 001-deep-research). The labeled draft holds only `{id,label}` pairs (40 rows). The repo copy of the same 40 rows differs from the scored copy in exactly one field per row: `label` is null in the repo and a string in the scored file, so the scored file cannot be reconstructed from the repo copy alone.
[SOURCE: ~/.skilled/.labels/022-rows.jsonl; ~/.skilled/.labels/drafts/022-arbiter.jsonl; specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/022-rows.jsonl; derived by field-wise diff of the two files]

**F1-05 [OBSERVED] Provenance recorded by the measurement phase itself matches the corpus shape.**
`results.md` names the corpus "fixture: 40 rows built by Luna 6 from real spec folders. The fixture's target was the wrong folder on every row, so the result compares Jev with the top alternative only", labeled by "delegated arbiter, blind, 40 rows", run with `--score ~/.skilled/.labels/022-rows.jsonl --jev --accept-payload --out`. 042's label inventory had recorded 022 as blocked for lack of real transcript rows ("0 rows exist... committed tree yields 0 alternative-listing events", `scratch/evidence/label-inventory-1.md:254`), and 047 D4 permitted a fixture set where real rows fall short (047 goal, D4).
[SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md (row 022); .../042-label-drafting-and-confirmation/scratch/evidence/label-inventory-1.md:254; .../047-measure-every-jev-feature/goal.md D4]

**F1-06 [OBSERVED] The run executed fully and stably: 121 calls, all exit 0, no flips.**
`calls.jsonl` holds 121 records: 1 `auth` call plus 120 measured row calls (3 per row), every one exit 0 and status measured; the scorer planned `3 * rows.length + 1 = 121` calls and `est_input_tokens=32927`. Wall time per measured call: p50 ~324 ms, min 287 ms, max 448 ms, sum ~39.8 s (sequential). Every row's three picks agreed (F=0), so option rotation did not change any pick. Header line: `rows: total=40 labeled=40 callable=40 state_null=0`.
[SOURCE: ~/.skilled/.labels/runs/047-022-jev-20261002/calls.jsonl (derived counts, p50 from sorted wall_ms); ~/.skilled/.labels/runs/047-022-jev.stdout.txt]

**F1-07 [OBSERVED] The single loss is one semantically near-tie row, picked consistently.**
f022-001 (label `001-deep-research`, state about "Research Phase: Jev Typed Judgments Across .skilled Skills and Workflows. Three-lineage deep research...") got `007-classifier-deep-research` on all three passes with pick_prob 0.52 / 0.58 / 0.48 -- the only row with mixed pick_prob below 0.9. Its label is the row's own folder. So of the 11 rows where Jev and the baseline disagree, Jev won 10 and lost 1, and the loss is a plausible semantic sibling rather than an unstable pick.
[SOURCE: ~/.skilled/.labels/022-rows.jsonl row f022-001; calls.jsonl rows with row_id=f022-001 (orders 0-2)]

**F1-08 [OBSERVED] The row's state text is a paraphrase of the label folder's own phase material.**
Spot checks: f022-001's state phrase "Jev Typed Judgments Across" also appears in `001-deep-research/research.md` and its packet docs; f022-002's state mirrors the objective in `002-advisor-jev-tiebreak-arm/goal.md:51`; f022-004's state mirrors `004-deep-research-expansion/plan.md`'s description. The option text the model sees is each folder's `description.json` description or, on fallback, the bare folder name (`buildDescriber` 836-878; `buildOptionLines` 980-989). The state and the correct option's description are both derived from the same phase's materials.
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:836-878, :980-989; grep phrase match in specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/; 002/goal.md:51; 004/plan.md frontmatter]

## Interpretation (marked)

- [DERIVED] The measured claim is "Jev's pick beats always-taking-the-top-listed-alternative on this fixture". It is not "Jev beats the validator's own target", because the target had zero headroom by construction.
- [DERIVED] All of the discrimination came from 11 discordant rows (10 W + 1 L); on the other 29 rows both answers were right, so they contributed to M, A and B but not to the sign test.
- [INFERRED] The keep is not fragile for this corpus: the margin rule passed by 90 vs a 40 requirement and flips were 0; a rerun under the same corpus would produce the same counts unless a pick changed. What would confirm a rerun claim is an actual rerun; none was run here.

## Ruled out (for this question)

- Order instability as the driver: rotation x3 produced identical picks on every row (F=0). [SOURCE: calls.jsonl]
- The target baseline as the driver: target right 0 of 40; the scorer switched to top. [SOURCE: stdout line + corpus]
- Gate trips as the driver: coverage, kill, margin and flips all passed; the sign test was the binding (and passing) gate. [DERIVED from decideVerdict + counts]

## Questions advanced

- Q1: answered at the mechanism level in this iteration (first pass). Remaining depth is corpus realism (F1-04, F1-08) and its effect on what "right" means, which feeds Q3.

## Next focus

Q2 -- where accuracy can move (the F1-07 loss, option text, passes) and where cost can move (121 calls, 3 passes, auth call, per-call wall time).
