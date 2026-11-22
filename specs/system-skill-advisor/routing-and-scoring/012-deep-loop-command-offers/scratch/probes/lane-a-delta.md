# Lane A probe delta

Before: `base1.json` to `base4.json`. After: `after1.json` to `after4.json`, run on the rebuilt dist.
The comparison covers the top skill, the command and policy, and the second row. Every probe not listed here came out the same.

| Id | Before | After | Intended under D2 |
|---|---|---|---|
| V6 | system-deep-loop, no command | system-deep-loop /deep:review (ask) | Yes. The prompt says "iterative review loop" |
| H1a | system-deep-loop, no command | system-deep-loop /deep:review (ask) | Yes. The prompt says "iterative review loop" |
| H1b | system-deep-loop, no command | system-deep-loop /deep:research (ask) | Yes. The prompt says "research loop" |
| E1 | system-deep-loop defer, no command | system-deep-loop /deep:research (ask) | Yes. The deferred route plus "5 iterations" and one research cue |
| E3 | system-deep-loop defer, no command | system-deep-loop /deep:review (ask) | Yes. The deferred route plus "review iterations" |
| F2 | system-deep-loop defer, no command | system-deep-loop /deep:research (ask) | Yes. "5 more iterations" on a research run asks to extend it |
| H7 | no recommendation | system-deep-loop /deep:research (ask), floored | Yes. The new scorer rule reads "investigate iteratively" |
| H10 | sk-code single-pass review | system-deep-loop /deep:review (ask), floored | Yes. "multi-pass ... audit" |
| R7 | system-deep-loop /deep:research (ask) | system-deep-loop, no command | Yes. "everything you can" is depth wording only |
| H3b | system-deep-loop, floored | no recommendation | Yes. The council words left the hub. /speckit:ai-council does not win this prompt |
| R2 | system-spec-kit, no second row | system-spec-kit; second row system-deep-loop /deep:research | Yes, partial. "multiple passes" plus "investigate" now ranks the hub, tied at 0.82, so it does not top |
| V2 | sk-code; second row sk-git | sk-code; second row system-deep-loop /deep:review | Yes, partial. sk-code 0.95 still leads the hub at 0.88 |
| V4 | sk-code, no second row | sk-code; second row system-deep-loop /deep:review | Yes, partial. Tied at 0.82, so sk-code keeps the top |

N1 to N15, H3a, H4 and H5 are all unchanged.

## Predictions that do not hold under D2

- **V3 and V8 do not flip.** Each one reached the gate only through "thorough" or "in depth", and D2 removes both words. They still read `needs a mode` with no command, which is correct under D2.
- **N9 keeps /deep:research.** D2 keeps "deep research" as loop wording, and D6 rules out a new guard. N9 is added as a near-miss corpus row instead.

## A loop name needs a use verb

On the first build every D2 phrase opened the gate without a use verb. The recapture then showed two corpus rows newly offered `/deep:research`: `nm-system-deep-loop-01` ("how does the research loop decide when it has enough") and `cmd-doctor-deep-loop-plain-tune-01` ("my research loop stopped converging…"). Both are questions about the loop. "deep loop", "research loop" and "review loop" now count only behind a use verb, as P1 designed. Both rows went quiet again, and the probe delta above did not change. H1b ("start a research loop") still flips.

## Corpus, command-routing-baseline

- The capture counts `false_offer` 0 of 35 before and 2 of 41 after, and `false_offer_attached` 0 of 35 before and 3 of 41 after. The six new rows are the only ones adding to either count: N7, D1 (offered); N9, D1, V7 (attached).
- `cmd-deep-research-plain-tune-01` ("find out everything you can…") lost `/deep:research`, which is intended under D2. Plain tune attached went from 14 to 13.
- The bridge counts went from 36 to 35 doctor routes and from 63 to 62 generated. This lane did not touch the bridges, so another lane's edit in this worktree moved them.
