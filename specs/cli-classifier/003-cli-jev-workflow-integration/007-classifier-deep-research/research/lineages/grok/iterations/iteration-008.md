# Iteration 8: grok-08: Tare's flip gate and R1's flip rate

## Focus

Questions G and H. Tare's conditioned permutation-flip gate is a different statistic from R1's aggregate rerun flip and from this repo's stability coefficient. A calibration workflow here has no labels and no client-visible calibration file.

## Sibling check

- `research/lineages/deepseek/iterations/iteration-003.md` (iteration 3, newest). Read the title, the three verdicts, and the hand-off. It keeps a deterministic validator check and holds a classifier advisory until labels exist. Agree, from their text: a Tare metric is not a gate. I did not reopen `validate.sh`.
- `research/lineages/swe/iterations/iteration-001.md` (iteration 1, still newest). No Tare content. No contest.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file.

`steer.md` was read. This angle does not re-derive the compact fail-open or the length cap.

Prefix `T` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-main/eval/tare`. Prefix `B2` = `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md`.

## Findings

### Three statistics that share a word

| Statistic | What flips | Gate | Where |
|---|---|---|---|
| R1 aggregate flip | The modal pick across 3 reruns of the same question | at most 0.10, and it is one of four keep conditions | `B2:233` |
| Tare permutation flip | The argmax when option order changes | `flip_rate <= expected_flip_rate(accuracy, N) + margin` | `T/probes.py:139-161`, `T/metrics.py:454-468` |
| Improvement-harness coefficient | `1 - (stddev / mean)` across replay scores. Mean 0 returns 1.0 | warning below 0.95 | `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:22-28`, `:102-108` |

Tare's own comment says a raw flip under 2% is miscalibrated at low accuracy, because a uniform guesser flips at `1 - 1/N` (`T/metrics.py:462-464`). The conditioned gate passes that guesser and fails a model that flips more than honest uncertainty explains (`:465-468`). That is a check for position shortcuts on a multiple-choice probe.

R1's 0.10 is rerun stability of a routing pick, not option-order stability, and it is not conditioned on accuracy. Copying the conditioned gate onto R1 would pass a near-chance router that flips often, which is the opposite of a keep. It would change the keep rule. It should not.

The coefficient at `benchmark-stability.cjs:102-108` returns 1.0 when the mean is 0. That is a perfect score on a zero vector. It is not R1's flip rate. BASE2 already replaced that coefficient for R1 (`B2` REQ-008 note in the 002 amendments, quoted from the phase table at `:927` area as the flip-rate replacement; the keep line itself is `:233`). Do not import either Tare number into that file.

### What a held-out calibration check would change

`ece` and `brier` in `T/metrics.py:212` and `:237` need ground-truth labels (`T/metrics.py:15`). This repo has no Deem labels (`P/context/deem-local.md:52`). A calibration file for the served commit was not found (iteration 1). A client cannot see which file is loaded (iteration 7). So a held-out ECE cannot change R1's keep, R2's heuristic kill, or R19's fit kill. Those rules do not read a probability calibration. Adding ECE as an extra column would not fire until labels exist. It changes no current keep rule.

`split.py:76` is a hash of the item text, default 80/10/10, stable across runs (`split.py:1-5`). That is a useful splitter for a future label file. It is not a measurement.

Negation paired accuracy (`T/probes.py:55-74`) needs a proposition, its negation, and a ground-truth boolean. Nothing in R1's corpus is that pair. Do not copy it. `automation_rate_at_accuracy` (`T/metrics.py:335`) needs a target accuracy this repo has not set. The leaderboard's `v6_calibration` adapter (`T/leaderboard.py:43-44`) reads Deem training JSON. Do not copy it.

### Idea N-grok-08-1

- **Idea:** `N-grok-08-1`. Do not replace R1's aggregate rerun-flip cap of 0.10 with Tare's conditioned permutation gate. Type: none.
- **Question:** H
- **Builds on:** `B2:233`. The Tare functions above.
- **Value:** keeps the keep rule pointed at rerun stability.
- **Seam:** none.
- **Metric, baseline, harness:** R1's existing four-part keep. Baseline is the rule text, not a run. Harness: R1's arm, not built.
- **Savings:** unmeasured. The saving is not changing a rule that has not run.
- **Cost, latency, privacy:** a permutation probe would multiply calls by the number of orders. Not proposed.
- **Two-backend gate:** no switch.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed that the two functions count different events.
- **Kill criterion:** not kept. A later arm that reruns with shuffled options and prints both rates can add the permutation rate as a column that cannot by itself print `keep`.

### Idea N-grok-08-2

- **Idea:** `N-grok-08-2`. Before any Deem threshold, print the aggregate flip of 3 reruns of one fixed `choice` on a stub-or-live server, with the `deem-ctl status` commit pair on the line. No ECE. Type: `choice`.
- **Question:** H, G
- **Builds on:** `B2:233` for the statistic. Iteration 7 for the commit pair. LOCAL has no flip number.
- **Value:** the first local stability number, at the size of one question, which is the size LOCAL actually measured.
- **Seam:** the client from N-grok-07-1, which does not exist yet. Until then the measurement is not runnable.
- **Metric, baseline, harness:** flip rate over 3 reruns, one question, fixed options. Baseline: UNKNOWN. Harness: not run. Recorded unmeasured.
- **Savings:** unmeasured.
- **Cost, latency, privacy:** three local calls if Deem's health check passes. No bearer token if route (c) is the client. A long state is out of scope for this one question.
- **Two-backend gate:** the measurement runs only when N-deepseek-02-2 passes, including `backend` not `stub` (ALL-4). If it fails, the line is `deem arm skipped` and no number is printed. It does not fall back to Jev, because a Jev flip is a different model.
- **Rough LOC:** not sized. It waits on the client.
- **Verdict:** later.
- **Confidence:** confirmed that LOCAL does not report a flip. Inferred that three reruns are enough to notice a broken sampler. A real run would confirm the number.
- **Kill criterion:** the printed flip is above 0.10 on that one question, or the commit pair changes between the three calls. Either result means the served process is not stable enough to threshold, and N-grok-01-2 stays in force.

## Sources Consulted

- `T/metrics.py:1-15`, `:393-506`
- `T/probes.py:1-20`, `:55-74`, `:139-161`
- `T/split.py:1-15`, `:69-76`
- `T/leaderboard.py:36-44`
- `B2:233`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:20-28`, `:95-108`
- `research/lineages/deepseek/iterations/iteration-003.md` verdicts and hand-off
- `P/context/deem-local.md:52`
- `steer.md`

## Assessment

newInfoRatio: 0.80

Novelty: the three statistics are not the same event. The conditioned gate would loosen R1 at low accuracy. No current keep rule reads ECE.

Confidence: confirmed from the function bodies. The effect on a future R1 run is inferred.

Convergence telemetry: last three ratios 0.75, 0.80, 0.80. Mean 0.78, above 0.05. Mode is off. Continue to wave 4.

## Reflection

What worked: reading `conditioned_flip_gate`'s docstring against R1's keep line instead of matching the word flip.

What failed: no Deem labels, so the calibration half of the angle stays "cannot change a keep rule yet."

Ruled out: replacing R1's 0.10 with the conditioned gate. Ruled out: copying negation paired accuracy, automation rate, or the v6 calibration adapter. Ruled out: treating `benchmark-stability.cjs`'s coefficient as R1's flip rate.

## Recommended Next Focus

grok-09. Read iterations 1–8 and the newest sibling file of each lineage. Build the claim-to-local-number table. Include the compact fail-open, the missing length cap, and the calibration gap. Do not re-derive them.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Tare permutation flip is option-order, not rerun stability | new | `probes.py:139-151`, `B2:233` |
| The conditioned gate passes a uniform guesser | new | `metrics.py:462-468` |
| Copying it onto R1 would loosen the keep at low accuracy | new, inferred from those two | same |
| ECE cannot change a current keep rule | new | `metrics.py:15`, `deem-local.md:52` |
| The stability coefficient returns 1.0 at mean 0 | new against R1's flip | `benchmark-stability.cjs:102-108` |

## Hand-off

- grok-09: R1 still leans on an unmeasured flip. LOCAL's speed does not replace it.
- A permutation column may be printed later. It must not be able to print `keep` alone.
- deepseek-03's "advisory is not a gate" agrees with this. Their files were not reopened.
