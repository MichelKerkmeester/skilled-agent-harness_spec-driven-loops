---
title: "Iteration 3: How to make the measurement more trustworthy"
trigger_phrases: []
---
# Iteration 3: How to make the measurement more trustworthy

## Focus

The trustworthiness gap between what the verdict asserts and what the run proves: statistical power,
recorded-vs-fresh asymmetry, unreproducible figures, input drift, identity pinning, repeat variance,
ground truth and metric artifacts.

## Actions Taken

- Read the scorer's `main`, the CLI arm's `jevGate`, and the both-sides `--pi --cli` path.
- Computed exact Clopper-Pearson 95 percent confidence intervals for the observed agreement counts.
- Cross-checked every asserted figure against what `calls.jsonl` and `report.json` actually store.
- Compared the identities each side verifies: the CLI gate pins a version, the Pi gate resolves one.

## Findings

1. The keep rule is a point-estimate gate at n = 111, and the verdict it produced is statistically
   indistinguishable from its own opposite. The exact 95 percent confidence interval for 106/111 is
   [89.8, 98.5] and for 105/111 it is [88.6, 98.0]; adopt and keep-cli differ by one row and their
   intervals overlap almost entirely. The rule as written cannot be robust at this corpus size; to make
   the outcome trustworthy the operator needs either a pre-committed stability margin (for example adopt
   requires agreement that stays adopted when the two nearest counts flip) or an explicit
   "indistinguishable at this sample" outcome [SOURCE: recomputation over the recorded calls;
   keep rule at .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:70-73,
   judge at :1075-1081].

2. The judge compares rounded percentages, not counts. `agreement` is `round1` of the row ratio and the
   bound is 95, so a hypothetical 94.96 percent would pass as 95.0; at K = 111 no achievable k/111 lands
   in that gap, but a larger replay can [SOURCE:
   .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:992-993]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1054-1055]
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/verify/review-mimo-r1.txt P2-2].

3. The latency comparison is recorded-vs-fresh and the report does not say so. Pi's column is
   2026-09-30; the CLI column is the 2026-09-29 019 recording; `report.json` carries no field naming
   the asymmetry. The scorer's own fix exists — `--pi --cli` reruns both sides fresh under one clock,
   and records `replay: 'fresh'` — but it has never been run
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1304-1340]
   [SOURCE: specs/.../037-pi-native-classifier-transport/implementation-summary.md Known Limitations 2].

4. The cost figure cannot be verified from the run's records. `cost_per_100` reads each call's
   in-process `result.usage.cost.total`, and the recorded call rows store no usage; the number survives
   only in `report.json` [SOURCE:
   .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:616-618]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:756-758]
   [SOURCE: iteration 1 finding 7].

5. Input drift between the recording and the replay is undetectable. The replay plan verifies only the
   option key set (`keySetText`), then sends the current census prompt to Pi; the CLI answers were
   recorded 2026-09-29 against whatever prompt the census held then. Neither side stores a prompt
   digest: Pi's `state_sha12` proves Pi's own input but has nothing to compare against on the CLI side,
   and the CLI records carry no input digest at all. A prompt edited between the two dates would
   silently compare two different questions [SOURCE:
   .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-602]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:776]
   [SOURCE: specs/.../019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl record keys].

6. Identity pinning is one-sided. The CLI arm's gate pins `jev 0.6.2` exactly and skips the arm on any
   other version, while the Pi gate resolves whatever package `pi` points at with no version check; the
   037 verdict holds for Pi 0.99.1 and nothing in the gate enforces it
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:25]
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:1119-1124]
   [SOURCE: specs/.../038-pi-classifier-transport-integration/implementation-summary.md Known Limitations 2].

7. There is no repeat-run evidence. Every number comes from one run, `classify()` exposes no seed or
   temperature (iteration 2 finding 9), and nothing estimates run-to-run drift; a second and third
   replay of the same 111 rows would bound it cheaply (~$0.0075 and 90 s each)
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:716-726]
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md:113-136].

8. Agreement is not accuracy. No row in the 019 corpus carries a gold label ("nothing is served and no
   row waits on operator labels"), so the five flips prove only that the two sides differ; either side
   could be the better answer. A labeled subset on the 12-row sub-0.10-margin pool would be the
   highest-value labeling budget, because all five disagreements and every position-split row live
   there [SOURCE:
   specs/.../019-advisor-suggested-order/implementation-summary.md §The Jev run]
   [SOURCE: iteration 1 findings 3 and 6].

9. Two of the five disagreements are metric artifacts under defensible alternative rules, and the
   reported agreement moves with the rule: strict mean-top gives 95.5, a per-order majority gives 95.5,
   per-order agreement gives 95.2, and counting position-settled ties as agreements would move the
   count again. The report stores none of the artifacts (no per-row margins, no tie flags, no
   order-level picks), so a reader cannot tell which kind of row a flip is
   [SOURCE: iteration 1 findings 4 and 5]
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run/report.json].

10. Several small record-completeness gaps each remove one ambiguity class when fixed: a timeout records
    its status but prints no skip line; a jev exit outside {0, 2, 3, 130} records `unmeasured` without a
    line; `report.json` has an `excluded` count but no excluded ids; and instrumented callers name
    `backend: "jev"` even when Pi answered, so caller-side records cannot separate the transports
    [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/verify/review-mimo-r1.txt P2-3, P2-4]
    [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:802-805]
    [SOURCE: specs/.../038-pi-classifier-transport-integration/implementation-summary.md Known Limitations 1].

11. The coverage denominator is sound and total here: K = plan.size + excluded.length keeps a
    rebuild-excluded row in the denominator as unmeasured, `excluded=0` on this run, and the coverage
    check can only fire when the census drifts. What is missing is only auditability of the excluded set
    [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1341-1344]
    [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run/report.json].

## Ruled Out

- "The verdict line is enough evidence on its own": every asserted figure beside it was either
  recomputed (agreement, median dp, latencies) or is unverifiable from the record (cost); the line is a
  summary, not the evidence.
- "Re-recording the baseline again next month is equivalent to a paired run": only a same-clock,
  same-day `--pi --cli` run removes the recorded-vs-fresh asymmetry; a later recording just moves the
  asymmetry.
- "More rotations increase trust": rotations reduce per-row positional noise but every added call
  doubles cost; the single-run gap is run-to-run variance, which rotations inside one run do not bound.

## Next Focus

Iteration 4 — Q4: where else in `.skilled` the same judgment would pay off (the 13 runtime-tree callers
by question type, the two opted-in callers' gains, and the non-Jev judgment surfaces the same Pi
classify route could serve).

## Sources

- `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/{implementation-summary.md,scratch/verify/review-mimo-r1.txt,scratch/live-run/*}`
- `specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/implementation-summary.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/{implementation-summary.md,scratch/w4-session/jev-run/calls.jsonl}`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md`
