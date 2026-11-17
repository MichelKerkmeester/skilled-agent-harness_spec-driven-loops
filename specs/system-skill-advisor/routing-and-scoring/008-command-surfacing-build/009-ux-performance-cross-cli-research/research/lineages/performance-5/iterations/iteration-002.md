# Iteration 2: What the 300 s cap actually cut, and whether hook cost shares the turn clock

## Focus

Answer the first unchecked key question: what ended the capped turns in the phase 033 untuned arm, and does a runtime-keyed wall-clock cap address it. The strategy's reducer-written next focus was a truncated follow-up on the arena's earlier commit, which is not an investigative target, so the first unchecked key question took precedence. The same pass also settles whether the pre-model hook cost is a measurable share of a behaviour turn's wall clock (KQ4), because both questions need the same per-turn durations.

## Actions Taken

1. Read the phase 033 step-reader's 20 captured sessions and extracted each session's first and last message timestamps, then converted them to seconds (the DSH records store epoch milliseconds, the others ISO strings).
2. Joined each captured session to its run line's `exit` to separate capped from completed turns.
3. Counted capped and uncapped rows by runtime and by row-id family across the five run files, to test whether any 900 s row was ever cut.
4. Read `G2_ROWS` and `capForRow` to establish what selects the 900 s cap.
5. Recomputed the hook-cost share of a turn: built-state hook p50/p95 against the sampled turn durations.

## Findings

1. **Every capped turn sits in the 300 s group; not one 900 s row was cut.** All 48 raw cap exits are `fresh-*` rows: opencode 26, devin 20 (19 counted plus the restore-failed `fresh-skill-04` null), pi 2, claude 0, dsh 0. The six `g2-*` rows, which get 900 s, were never capped. The 47-count in the committed summary and the 48 raw exits differ only by that restore-failed row. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/devin.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json]

2. **The cap is keyed to row-set membership, not to what the turn did.** `capForRow` returns 900,000 ms only when the row id is in `G2_PROMPTS`; every other row gets 300,000 ms. The `fresh-*` rows include prompts that launch a writing workflow (`/create:goal`, `/create:command`), yet they are capped as chat turns. So the runner's own comment that "a started workflow legitimately needs the longer one" is true only for the six rows it already knows are started. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:78-81] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:965] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:846-884]

3. **Successful turns stack against the 300 s boundary, so the cap slices a live tail rather than a hang.** The 20 sampled sessions run 15, 24, 25, 41, 44, 61, 63, 72, 79, 90, 104, 167, 291, 293, 293, 298 s (DSH 64, 240, 262, 298 s). Four sampled successes finish within 10 s of the cap, on three runtimes. A cap that were 2.5x a typical turn would not have four of twenty completions inside its last 10 seconds. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/sessions/] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/pick.txt]

4. **A capped OpenCode turn was still producing messages 7 seconds before it was killed.** The sampled `opencode fresh-fit-02` session runs 02:07:12 to 02:12:05 (293 s) across 142 records and its run line exits 143; `opencode fresh-fit-03`, uncapped, runs 291 s and exits 0. The cut lands on active work, not on an idle process, for at least that row. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/sessions/opencode-fresh-fit-02.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl]

5. **A runtime-keyed cap is the wrong lever; a behaviour-keyed cap is the targeted one.** Claude and DSH capped 0 of 80 fresh runs each, so a runtime key would give them nothing. OpenCode and Devin carried all 48 caps. What would remove them is giving a turn the 900 s cap once it opens a workflow, not because of which runtime carried it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl]

6. **Hook cost is not a measurable share of a turn's wall clock.** The built-state hook p95 of 290 ms is 1.9 percent of the shortest sampled turn (15 s) and 0.10 percent of a 298 s turn; at the p50 of 189 ms the share is 0.06-1.3 percent. Even the 2,218 ms worst row is 0.7 percent of a 300 s turn. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [INFERENCE: based on hook percentiles from iteration 1 and the sampled turn durations in this iteration]

7. **The cap's cost is measurable in lost judgeable rows, not in wall time saved.** 26 of 80 OpenCode fresh runs (32.5 percent) and 20 of 81 Devin fresh runs (24.7 percent) ended capped, against 0 of 80 on Claude and DSH. Those are the rows the summary already excludes from "judgeable offers", so the cap decides how much of the arm can be scored at all. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json]

## Ruled Out

- A runtime-keyed cap as the fix: it leaves the misclassification in place and gives zero help to the two runtimes that never capped.
- Treating the 300 s cap as a stuck detector: four sampled completions land within 10 s of it, and one capped session was still emitting messages at 293 s.
- Estimating the number of capped turns a longer cap would convert: the arm stores no duration for them, and the two sampled capped sessions disagree in shape (293 s active versus 61 s then waiting). That needs a re-run, not arithmetic.

## Dead Ends

- Recovering the durations of the 45 unsampled capped turns from the OpenCode store: iteration 1 already established the sessions are gone; only the step-reader's 20 sampled sessions survive.
- Using `summary-arm.json`'s `cappedOfferRows` as the cap's cost: it counts only the five offer rows, so it understates the 26 OpenCode caps by an order of magnitude.

## Edge Cases

- Ambiguous input: the strategy's next focus was truncated mid-sentence and named a commit-ordering follow-up, not an investigation. Treated as vague and followed the first unchecked key question, as the protocol allows.
- Contradictory evidence: none. The 47-versus-48 cap count is a definition difference (the restore-failed row), now stated.
- Missing dependencies: 45 of 47 capped turns have no surviving session; the two sampled ones bound the shape but not the distribution.
- Partial success: KQ2 is answered on cause and lever, not on the conversion count a longer cap would produce. Status is `complete` because the answer names that limit.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/sessions/*.json` (20 sessions)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/pick.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/{claude,opencode,pi,devin,dsh}.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:78-81, 846-884, 965, 1063-1095`
- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`

## Assessment

- New information ratio: 0.92
- Questions addressed: KQ2 (what ended the capped turns and which cap key helps), KQ4 (hook cost as a share of turn wall clock)
- Questions answered: KQ2, KQ4

## Reflection

- What worked and why: the step-reader's stored message timestamps turned an assumed-unmeasurable question into a bounded measurement. Reading the 20 sampled sessions end to end was worth more than any amount of aggregation over the exit codes.
- What did not work and why: the first pass assumed the capped rows' sessions were gone because iteration 1 found the OpenCode store empty; the step-reader had already captured 20 sessions with timestamps. Checking the packet's own derived artifacts before concluding a measurement gap would have saved a pass.
- What I would do differently: enumerate the packet's scratch derivatives first, then decide what is unmeasurable.

## Recommended Next Focus

Iteration 3: answer KQ5 — which latency instrument reports the built state's true p95, and what it misses. Specifically, test whether the health record's `durationMs` is the hook's full wall time or just the pre-render phase, and whether the 300 ms cliff is a deadline inside the CLI. Also test whether the cold first prompt is still absent from the record.
