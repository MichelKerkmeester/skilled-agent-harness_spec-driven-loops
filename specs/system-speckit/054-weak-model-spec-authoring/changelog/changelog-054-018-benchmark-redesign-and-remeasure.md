---
title: "Changelog: Phase 18: benchmark-redesign-and-remeasure [054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure]"
description: "Chronological changelog for the Phase 18: benchmark-redesign-and-remeasure phase."
trigger_phrases:
  - "weak model spec authoring benchmark redesign and remeasure changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 018 measured packet 054 again on fair terms. The old benchmark task was the templates' own worked example, the brief forced Level 3, and no per-packet grade was kept. This phase rescored the 23 uncontaminated old packets with deterministic checks, then reran the speed loop on a task no template names, at the helper's level, with a leak gate, a paired output-token verdict and one blind Opus medium grade per packet. Over 8 rounds and 29 valid packets, now054 beat pre054 on the blind total in all 8 rounds. The tree after phases 015 to 017 scored highest, 25.5 of 30, but its leads are INCONCLUSIVE. The only REAL speed result is upkeep output tokens, refined against main-no054, fewer in 5 of 5 pairs, and every seconds verdict is INCONCLUSIVE.

### Changed

- `scratch/rescore/rescore.py` scores each packet's `Verify:` ratio, template residue, stated line counts and dangling `decision-record.md` pointers; it ran on the 23 old packets and on the 29 new ones.
- The speed loop takes `--task quiet|minpct`. The `minpct` task is "Add a `--min-percent <N>` option to `calculate-completeness.sh`", with frozen author and upkeep briefs.
- `prepare.sh` writes `task_term_refs` per sandbox, and `loop.sh` refuses to dispatch unless every sandbox reads `0`; a failed scan prints `NA` and is refused too.
- `summarize.py` prints a paired `tok_out` verdict beside the seconds verdict, REAL only with at least 4 valid pairs of one sign.
- `step.sh` keeps `SPECKIT_DIST_AUTO_REBUILD=0` on the dispatch line, and the loop `README.md` documents the switch, the scan, the verdict and the decision rule.
- A 5-round run on pre054, main-no054, now054 and refined, plus a 3-round top-up after the loop refused main-no054 rounds 3 to 5 when its sandbox was dirtied, gave 29 valid author runs.
- `scratch/report.md` gives one REAL or INCONCLUSIVE verdict per comparison, with the rescore and grade figures behind each.

### Verification

- `rescore.tsv`: 23 rows; the known-answer rows read `1.000` (now054) and `0.000` (pre054)
- Leak terms in the final tree's templates, template guides and card: `0`; every new `prep-times.tsv` row reads `task_term_refs=0`
- 29 valid author rows, 29 grade files, 29 unblinded rows
- `bash -n` on the four loop scripts and `py_compile` on `summarize.py` and `rescore.py`: rc=0
- Loop review and report review: each `Verdict: PASS` after a fix check
- `validate.sh --strict` on the phase folder: `RESULT: PASSED`

### Files Changed

| File | Action | What changed |
|---|---|---|
| `018-benchmark-redesign-and-remeasure/scratch/rescore/` | Created | Rescore script, inputs and tables for the old and new packets |
| `018-benchmark-redesign-and-remeasure/scratch/briefs/` | Created | The `minpct` author and upkeep briefs and the leak terms |
| `011-authoring-speed-research/scratch/speed-loop/lib.sh`, `loop.sh`, `step.sh`, `prepare.sh`, `summarize.py`, `README.md` | Modified | Task switch, leak gate, `tok_out` verdict, rebuild switch, docs |
| `018-benchmark-redesign-and-remeasure/scratch/remeasure/` | Created | Both runs' results and their merge |
| `018-benchmark-redesign-and-remeasure/scratch/grading/` | Created | Rubric, 29 blind grades, label map, unblinded table, verdicts |
| `018-benchmark-redesign-and-remeasure/scratch/report.md`, `review-loop.md`, `review-report.md` | Created | Operator summary and both reviews |
