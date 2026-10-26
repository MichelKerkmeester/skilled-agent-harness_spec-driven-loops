# Validator rounds in the 24 author runs

Measured 2026-10-26 to check the insight review's claim (`../015-template-example-neutralization/scratch/insight-review.md:45`) that the validator never failed on content and every round was `GENERATED_METADATA_*` repair.

## Method

`author.validate` holds only the final validator run of each author step, so it cannot show the rounds before it. Each `validate.sh` call the author made is in `author.calls` (its command, keyed by `toolCallId`), and its output is in `author.updates` under the same `toolCallId`. `count-metadata-rounds.py` in this folder joins the two. A round counts as failed when its output holds `RESULT: FAILED` or an `x RULE:` line (also with an `rg -n` line prefix). A failed round is derived-only when every `x` rule is one `repair-derived.cjs` lists in `DERIVABLE` (`runtime/cli/spec/repair-derived.cjs:76`).

Command, from the repository root:

```bash
python3 specs/system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata/scratch/count-metadata-rounds.py \
  specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/results \
  20261026T050500Z-67716 20261026T140632Z-79914
```

Last line of its output:

```
TOTAL runs=24 rounds=122 failed=36 derived_only=33 content=0 unknown=3 final_passed=24 runs_with_derived_round=19
```

## Result

| Measure | Count |
|---------|-------|
| Author runs | 24 (run 1 and run 2, four variants, three rounds each) |
| `validate.sh` calls | 122 |
| Failed rounds | 36 |
| Failed only on derived-metadata rules | 33 |
| Failed on any content rule | 0 |
| Failed, rule lines cut off by the author's `head` or `tail` | 3 |
| Runs with at least one derived-only round | 19 of 24 |
| Final run `RESULT: PASSED` | 24 of 24 |

The 33 derived-only rounds failed on two rule sets: `GENERATED_METADATA_DRIFT` with `GENERATED_METADATA_INTEGRITY` 26 times, and `GENERATED_METADATA_INTEGRITY` alone 7 times. All 3 cut-off rounds printed the `repair-derived.cjs` hint, which `writeRepairHint` prints only when a recomputable rule fails or warns (`runtime/lib/validation/orchestrator.ts:1485`), so they are probably derived-only too; that is inferred, not shown. The only other non-pass lines were the warnings `PLACEHOLDER_FILLED` and `AI_PROTOCOLS`, which never fail a run.

## What it means for the change

The claim holds: no content rule failed in any of the 122 calls, and 33 to 36 of the 36 failed rounds were metadata repair, about 1.4 to 1.5 rounds per run. The auto-repair is sized to exactly that case: it fires only when every error is a derived-metadata rule, so it would have settled each of those rounds without a model turn and would have touched none of the content.
