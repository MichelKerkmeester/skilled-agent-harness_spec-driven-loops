---
title: "Decision 2: Rule delivery debugging"
description: "The write-task replication adopts Gate 6: no Gate 5 miss in 81 writing runs, and reply-rule misses down 37.8 points."
trigger_phrases:
  - "gate 6 replication decision"
  - "gate 6 adopted"
importance_tier: "normal"
contextType: "implementation"
---
# Decision 2: Rule delivery debugging

## 1. DECISION

**Adopt Gate 6.** Rule 1 of `preregistration-2.md` §4 applies, because both of its conditions hold on the pooled data:

- **Gate 5 guard, met:** no writing run in either arm missed Gate 5, 0 of 38 baseline and 0 of 43 Gate 6. The difference is +0.0 points with a 95% Newcombe interval of -9.2 to +8.2, so its upper bound is below +10.
- **Primary, met:** the reply-rule miss rate, Gate 6 minus baseline, is -37.8 points, -51.0 to -22.0. Its upper bound is below 0.

This replaces the first decision's "keep the bullet", which failed on guard resolution, not on an observed harm. The first run's data does not enter this decision.

Live adoption waits its turn under parent D2, after the 008 cards have had their own window. The change edits the repository `AGENTS.md`, so it lands only with operator approval and after `check-rule-copies.js` passes on the edited file. The adopted Gate 6 misses the reply rules in 21.1% of long replies, under the 30% that would open a hook arm, so no hook is built (parent D3).

## 2. DATA

148 scored runs, 74 per arm, two executor lanes, no unscorable run. `results/deviations.md` §1 and §2 record why Cline replaced Luna and why the OpenCode Go lane stopped at 58 of 90 runs. The figures come from `final-scores-2.txt`. `scored-runs-2.jsonl` holds one row per run with no reply text, and `runs-2/` holds the run records.

- **Reply-rule miss, pooled:** baseline 58.9% of 73 long replies (47.4 to 69.5), Gate 6 21.1% of 71 (13.2 to 32.0).
- **By executor, reply-rule miss:** DeepSeek through Cline 86.7% of 45 against 34.9% of 43, a drop of 51.8 points (-66.1 to -32.1). DeepSeek through OpenCode Go 14.3% of 28 against 0.0% of 28, a drop of 14.3 points (-31.5 to +0.5).
- **By executor, Gate 5 miss:** Cline 0 of 24 and 0 of 25, OpenCode Go 0 of 14 and 0 of 18.
- **Prohibitions:** long replies breaking at least one fell by 26.2 points (-40.6 to -10.0). Em dashes went from 50.7% to 14.1% and semicolons from 61.6% to 39.4%. No tables, empty openers or label first lines in either arm.

## 3. WHAT IT MEANS

Two runs now agree. Written as a numbered gate, the reply-rule mandate reaches DeepSeek far more often than as a §4 bullet, and moving it costs nothing measurable at Gate 5. Cline's DeepSeek still misses the reply rules in about a third of replies under Gate 6, which the live measurement after adoption should track.

## 4. LIMITS

- Both lanes ran DeepSeek V4.1 Flash, so the replication has one model through two providers. Luna's effect comes from the first run only, where it already loaded the reply rules with the bullet (1.1% against 0.0%).
- The OpenCode Go lane is short, 29 runs per arm, and its own interval on the primary reaches +0.5. The decision rests on the pooled data, as `preregistration-2.md` §2 sets.
