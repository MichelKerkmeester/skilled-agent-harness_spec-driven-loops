---
title: "Decision: Rule delivery debugging"
description: "The pre-registered rule keeps the reply-rule bullet: Gate 6 cut reply-rule misses by 22.6 points, but the Gate 5 guard could not be resolved at about 30 write runs per arm."
trigger_phrases:
  - "reply rule gate decision"
  - "gate 6 guard unresolved"
importance_tier: "normal"
contextType: "implementation"
---
# Decision: Rule delivery debugging

## 1. DECISION

**Keep the bullet.** Rule 2 of `preregistration.md` §4 applies, because only one of rule 1's two conditions holds:

- **Primary, met:** the reply-rule miss rate, Gate 6 minus baseline, is -22.6 points with a 95% Newcombe interval of -29.8 to -15.6. The upper bound is below 0.
- **Gate 5 guard, not met:** no run in either arm missed Gate 5, 0 of 32 baseline and 0 of 30 Gate 6 write runs. At that sample the interval on the difference is -10.7 to +11.4, and its upper bound is above the +10 limit.

The guard failed on resolution, not on an observed harm. The pre-registration did not size the write-task share to resolve it, which was a design gap. `preregistration-2.md` tests Gate 6 again on write tasks sized for the guard, and it decides adoption on its own data.

## 2. DATA

360 scored runs, 180 per arm, two executors, no unscorable run. Each environment carried a project-level copy of the repository `AGENTS.md`. The figures come from `final-scores.txt`, and `scored-runs.jsonl` holds one row per run with no reply text.

- **Reply-rule miss, pooled:** baseline 26.0% of 177 long replies (20.1 to 32.9), Gate 6 3.4% of 179 (1.5 to 7.1).
- **By executor:** DeepSeek through OpenCode Go 51.7% of 87 against 6.7% of 89, a drop of 45.0 points (-55.8 to -32.4). Luna 1.1% of 90 against 0.0% of 90, so Luna already loaded the reply rules once the project `AGENTS.md` was present.
- **Prohibitions:** long replies breaking at least one fell by 23.2 points (-32.5 to -13.2). Em dashes went from 28.2% to 6.7% and semicolons from 71.2% to 49.2%.
- **Tables:** none in a reply that followed a read of `communication.md`, in either arm.

## 3. WHAT IT MEANS

With the project `AGENTS.md` loaded, Luna follows the reply-rule bullet and DeepSeek skips it in half its replies. Written as a numbered gate, the same instruction reaches DeepSeek in 93% of replies. Whether to adopt it waits on `preregistration-2.md`, which `decision-2.md` settles: adopt Gate 6.
