# Hand judgment of the plan sample, 2026-09-11

Plan built from `skilled/v4.0.0.0` at 9,123 commits with the refined cascade. Sample: 100 rows,
seed 28, in `plan-sample-seed28.jsonl`. Judged by the conductor from subject and touched paths.

## Counts

| Rule | Rows in sample | Judged wrong |
|---|---|---|
| refs | 6 | 0 |
| scope-dir | 14 | 0 |
| unique-touch | 17 | 0 |
| dominant-touch | 18 | 2 |
| none | 45 | 0 wrong, 2 debatable |

Error rate over mapped rows: 2 of 55, about 3.6 percent, under the 5 percent bar in ADR-004.

## The two wrong rows

- `111 W3.B: renumber 000-release-cleanup/...` and `111 W3.E: renumber 008-skill-advisor/...`
  went to `system-spec-kit/026-graph-and-context-optimization/...` by dominance because the
  renumber touched dozens of 026 files. The subject names packet 111. These subjects have no
  conventional prefix, so the numeric-scope rule cannot see the number. A bare leading number in
  a non-conventional subject is a signal the cascade could use, and it is the only shape found.

## The two debatable rows

- `fix(routing): stop one hub swallowing another hub's core vocabulary` got no packet: its only
  spec touch sat under `activation/`, which is excluded on purpose.
- `docs(deep-loop): goal prompt for the 036 open backlog` got no packet: its only spec touch was
  under `scratch/`, excluded on purpose. The commit is about packet 036, and a reader would
  still find it by the subject.

## Verdict

The cascade holds under the bar. The two misses share one shape, a subject that begins with a
bare packet number and no type prefix, which is legacy history the hook now refuses. Not worth a
sixth rule for 2 of 55.
