# Iteration 6: What "capped" means per runtime, and the row the scorer cannot see at all

## Focus

The strategy's recommended focus was an audit of the six inherited `limit:` lines. One of them names the property this lane exists to check — that a row which moves HEAD cannot be measured — and iteration 5's start audit showed that `capped` decides which start rows are judgeable. So this iteration traced `capped` from the runner's own records through the scorer, and checked whether a restore failure reaches the score at all.

## Actions Taken

1. Read the scoring contract that decides whether a run is scored at all.
2. Read the `capped` definition.
3. Counted exit codes and restore flags per runtime over the deduplicated run lines.
4. Read the start-row exclusion rule that consumes `capped`.

## Findings

1. The scorer never reads `restored` or `headMoved`; a run is scored whenever its session loads, "whatever exit the turn ended with", and the exit code itself never decides a score. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1998-1999]

2. `capped` is true for two different events: an exit code of 143, or an exit code of `null`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2035-2038]

3. The two causes split cleanly by runtime in the 033 arm. OpenCode's 26 capped lines are all exit 143 (15 off, 11 on). Devin's 19 capped lines are all exit `null` (10 off, 9 on). Claude has none. Pi has 2 off and 0 on, both 143. DSH has none. [INFERENCE: counted over the deduplicated lines of `scratch/runs/{claude,opencode,pi,devin,dsh}.jsonl`] So the same printed word describes a wall-clock cap on OpenCode and something else entirely on Devin, and a reader comparing the two runtimes' `capped` columns is comparing unlike events.

4. Devin's exit-null lines are mostly not restore faults either. All 19 carry `restored: true`, none carries `headMoved`, and the sampled ones have no changed paths; only 2 of the 19 are the `fresh-skill-04` restore-failed lines the runner's rerun log describes. [INFERENCE: counted over the deduplicated devin lines, joined against `scratch/reruns.txt`] The missing exit code alone is enough to label a turn capped.

5. A capped start row is dropped from the start rate's denominator and counted apart instead. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2376-2383] Devin's printed start rate therefore rests on 11 and 12 judgeable rows out of 15, not because the turns were slow but because their exit code was never recorded — the wall-clock rule applied to a different fault.

6. The row the runner calls unmeasurable is scored as an ordinary row. DSH's restore-failed `fresh-skill-04` line carries exit 0, so it passes every filter and is counted in the DSH block; `reruns.txt` records the same row as "the row is not rerun because the same row moved head on devin twice" and calls it unmeasurable there. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/reruns.txt] Nothing in the scorer distinguishes a turn that ran from a turn that rebased the arena.

## Ruled Out

- Reading the `capped` column as a wall-clock count on every runtime. On devin it is a missing-exit-code count.
- Treating the runner's `restore_failed` verdict as reaching the score. It does not: only `exit` is consulted.

## Dead Ends

- Searching for a scored-row field that records the restore fault. `restored` and `headMoved` exist on the run line and are never read by the scorer.

## Edge Cases

- Ambiguous input: the audit's scope. The strategy asked for all six limit lines; this iteration traced the two it could test from records (the head-move line and the capped-turn line) and left the Claude `CLAUDE.md` line and the off-arm replay line to the next pass rather than assert them unverified.
- Contradictory evidence: the runner's rerun log and the summary's `unscored: 0` disagree about whether a restore-failed row is measurable. Both are recorded; the scorer's behaviour is the one that decides printed numbers.
- Missing dependencies: the devin CLI's exit-code capture was not traced to its source, so the cause of the 19 null exits is stated as unknown rather than attributed.
- Partial success: the exit-code and restore counts are complete for the five logs; the dsh line's contribution to DSH's followed rate was not recomputed.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1998-2040`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2376-2383`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1905-1916`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/reruns.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/devin.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl`

## Assessment

- New information ratio: 0.85
- Questions addressed: (e) follow-on, measurement integrity of the capped column
- Questions answered: none as tracked; this supplies the audit the rank needs

## Reflection

- What worked and why: joining the scorer's field rule to the per-runtime exit-code census produced a split no summary prints. The word "capped" looked like one quantity in eleven printed blocks; the census shows it is a wall-clock cap on one runtime and a missing exit code on another.
- What did not work and why: the first hypothesis was that every devin exit-null line was a restore fault. Checking `restored` on all 19 refuted it, since 17 of them are restored normally; the finding had to narrow to the missing exit code, which is the actual predicate.
- What I would do differently: read the scoring contract's treatment of `exit` before reading any `capped` column. The definition is four lines of code and it changes every cross-runtime comparison built on that column.

## Recommended Next Focus

Close the two limit lines this pass left unverified — the off-arm replay line and Claude's `CLAUDE.md` read — then check whether the paired-row churn per runtime (devin 3 gained and 3 lost, pi 8 and 7) sits in one row type, which is the last follow-through question the lane has not touched.
