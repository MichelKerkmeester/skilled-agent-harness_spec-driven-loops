# Iteration 8 - Phase 009 benchmark methodology, arithmetic and reproducibility

## Focus

Correctness of the benchmark as an artifact rather than as a result: are the recorded per-run numbers arithmetically consistent with the summary tables, is the deciding tree the same template surface as the closed tree, is the frozen brief really identical on both sides, and can a reader recover which file holds which experiment without reverse-engineering the directory names.

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/baseline-deepseek/baseline.json` (three runs)
- `.../scratch/amend3/baseline.json` (three runs)
- `.../scratch/amend3/fresh2/baseline.json`, `.../fresh2/runs.jsonl`, `.../fresh2/runs-meta.jsonl`, `.../fresh2/rule-scores.txt`
- `.../scratch/amend3/fresh2/delta.json`, `.../fresh2/delta.md`
- `.../scratch/baseline/baseline.json`, `.../scratch/baseline/delta.json` (first set)
- `.../scratch/amend3/fresh2/briefs/T005-{1,2,3}.txt` versus `.../scratch/amend3/baseline-deepseek/brief-{1,2,3}.txt`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:40-127`
- `git diff --name-only 74a629a7af 31dcbc2740 -- .skilled/skills/system-spec-kit/templates .skilled/skills/system-spec-kit/runtime`

## Findings

### P0 Findings

None.

### P1 Findings

None. The deciding set's arithmetic, brief parity and measured tree all hold up (see Traceability Checks); what remains is naming and machine-readability of the evidence.

### P2 Findings

1. **Two run-set files are named `baseline.json` while neither holds a baseline, and the real baseline lives in a third directory** -- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/baseline.json:1` -- `fresh2/baseline.json` is byte-equal to the deciding final set (`fresh2/runs.jsonl`: 0/1/0 hints, 0 anchors, 189/228/164 seconds), and `amend3/baseline.json` holds the second final set (3/0/0 anchors, 259/198/243 seconds), not a baseline either. The DeepSeek baseline is `amend3/baseline-deepseek/baseline.json` (1/0/0 hints, 0 anchors, 242/217/298 seconds). Only the prose in `fresh2/delta.md:3-4` disambiguates them, where the same word "baseline" is used for both the control side and the file that records the treatment side. A reader who recomputes the delta from `fresh2/baseline.json` and `fresh2/runs.jsonl` gets a zero delta on every metric — a false "no change" for the packet's deciding measurement.
2. **The deciding `delta.json` is machine-readable arithmetic with no experiment identity in it** -- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.json:1` -- The file's only key is `metrics`; the subject model, the two commits, the worktree, the anchor rule version and the source run files all live in `delta.md` prose and in the report. Because the numbers carry no provenance of their own, they can only be checked by a reader who already knows which directory is which — the same ambiguity as finding 1, and the reason AC-004 could point at the wrong experiment without anyone noticing (R2-P2-001).

## Traceability Checks

- **Arithmetic, re-derived**: the deciding delta's means reproduce from the run rows — baseline `seconds` 242/217/298 gives 252.33, final 189/228/164 gives 193.67, delta `-58.7`; `leftover_hints` 1/0/0 and 0/1/0 both give 0.333, delta 0; `missing_anchors` is 0 on both sides; `strict_passed` is 1 everywhere. The rule scored all three deciding runs `counted=0` (`rule-scores.txt`), which is what makes the anchor cell 0.
- **Measured tree equals the closed tree's template surface**: `git diff --name-only 74a629a7af 31dcbc2740 -- .skilled/skills/system-spec-kit/templates .skilled/skills/system-spec-kit/runtime` prints nothing, and the closing commit's stat over `.skilled` is five documentation files. The deciding runs therefore measured the template and runtime surface the packet shipped, which the criterion requires.
- **Brief parity**: `cmp` reports all three deciding briefs (`fresh2/briefs/T005-1..3.txt`) byte-identical to the baseline briefs (`baseline-deepseek/brief-1..3.txt`), so both sides ran one task, not two.
- **Baseline reuse is deliberate and stated**: every final set is scored against the same three DeepSeek baseline runs at the packet start commit, and `delta.md` and the report both say so. Reusing one baseline across four final sets is the correct design here, since the baseline tree never changed.
- **`seconds` is reported, not scored**: the report states the load caveat (`README.md:165`), and the verdict rule names only the three stability metrics, so the timing difference cannot move the verdict.
- Overlay protocols: closed in iterations 6 and 7; not reopened.

## Confirmed-Clean Surfaces

- The first set's `scratch/baseline/` numbers are correctly labelled history everywhere they appear in the report's section 2 table caption and in the `C5-history` lines of `criteria.txt`; the only defect there was the acceptance-row anchoring recorded as R2-P2-001, not the numbers.
- The contaminated deciding-set run (run 2 of the second set) is labelled contaminated in the report and excluded from the clean-pass reading, while run 1 alone decides that set's FAIL. The packet does not use a contaminated run as evidence of success.
- `runs-meta.jsonl` records the per-run rule output and the diff-hash-changed flag per run, so a run that modified the `.skilled` tree would be visible.
- No deleted anchor in any deciding run: `rule-scores.txt` shows `counted=0 excused=[]` three times, and the raw shortfall is 0 as well, so the anchor rule's exemptions were never needed to reach the pass.

## Assessment

Dimensions addressed: correctness

The measurement is sound: one brief on both sides, one baseline reused legitimately, arithmetic that reproduces, and a measured tree identical to the closed tree's template surface. Both findings are about how the evidence is named and what the machine-readable file carries, and both have the same practical consequence — a reader has to know the directory layout to avoid comparing the final set with itself.

## Next Focus

Iteration 9 (maintainability): the v2.3 template contract itself — whether every core template's fill guidance, anchor set and `## L3+:` labelling agree with what the validator and the goldens expect, and whether the four templates a weak model authors are internally consistent about levels, optional sections and the anchor rules the benchmark scored.

Review verdict: PASS
