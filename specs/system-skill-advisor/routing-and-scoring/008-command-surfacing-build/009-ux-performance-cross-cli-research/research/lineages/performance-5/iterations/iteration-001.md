# Iteration 1: Built-state hook latency and what the arena capped

## Focus

Re-measure the advisor hook's per-prompt cost on the built state after phases 016 to 033, establish whether any measured path exceeds a runtime's hook budget, and separate that cost from the behaviour-runner turn wall clock that phase 033's untuned arm recorded as 41 capped turns. Chosen because strategy.md names it as the first focus and because KQ1 and KQ3 can be answered from committed artifacts without a live run.

## Actions Taken

1. Read `033-untuned-arm-arena-run/scratch/arm-evidence.txt` and `summary-arm.json` in full, then re-counted the per-run `exit` values in the five `scratch/runs/*.jsonl` files to test the capped-turn total.
2. Read the runner's cap contract in `run-command-behaviour.mjs` (`CAP_MS`, `capForRow`, `spawnTurn`, the run-record assembly) to see what a capped turn records.
3. Tested whether the OpenCode arena sessions survive in any local store: five SQLite databases under `~/.local/share/opencode/`, read-only, one count query each.
4. Aggregated every persisted advisor health record in the OS temp metrics folder (694 files) into per-prompt duration, status and emitted-byte columns, then computed percentiles overall and per day.
5. Read the brief renderer's cap constants and the point where the constant directive block is appended, to split a brief's fixed bytes from its variable bytes.
6. Read the Claude hook's timing instrumentation and the shim's 300 ms start margin to test what the duration distribution's cliff is.

## Findings

1. **The built state's hook cost is p50 189 ms, p95 290 ms, p99 300 ms, max 2,218 ms over 17,775 persisted records.** Records run 2026-11-13 to 2026-11-16 and include the phase 033 arena's own prompts. Seven rows exceed 1,000 ms and three exceed 2,000 ms. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:402]

2. **Per-day medians move little; the tail moved.** 2026-11-13: n 6,438, p50 193, p95 290, p99 298, max 922. 2026-11-14: n 5,501, p50 196, p95 291, p99 299, max 1,205. 2026-11-15: n 5,256, p50 185, p95 291, p99 344, max 2,218. 2026-11-16 (partial): n 580, p50 136, p95 212, p99 308, max 2,208. The p95 is flat across three days while the max tripled. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

3. **No measured hook path exceeded the Claude 2,500 ms budget, but the worst row used 88.7 percent of it.** The maximum 2,218 ms leaves 282 ms of headroom against the Claude hook budget; three rows sit above 2,000 ms. The Codex adapter's 2,800 ms budget and Devin/Cursor's 10 s budgets are farther away. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:21]

4. **The duration distribution has a hard cliff at 300 ms, so p95 290 ms measures a deadline, not the work.** 4,674 of 17,775 rows (26.3 percent) are spread almost uniformly across 240-299 ms, about 778 per 10 ms bin, while only 87 rows (0.49 percent) land beyond 300 ms (81 in 300-309 ms, 6 at 310 ms or more). A uniform plateau followed by a cliff is a wait being cut, not a workload distribution. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [INFERENCE: based on the 240-299 ms plateau and the 300 ms start-margin constant beside the hook's child timeout]

5. **The 300 ms boundary is instrumented on the shim side, and the mechanism is unconfirmed.** The Claude shim reserves `CHILD_START_MARGIN_MS = 300` "after advisor CLI", and the hook stamps `durationMs` from its own start to the brief result. Which component stops at 300 ms is not proven by the record alone; a trace of one prompt whose duration crosses the boundary is what would confirm it. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:21-22] [SOURCE: .skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:383]

6. **One brief costs 270.7 bytes on average and 361 bytes at most over 1,138 emitting rows on the built state.** That is about 68 tokens at the renderer's own four-characters-per-token estimate. The variable part is capped at 80 tokens (320 characters) by default, and the constant directive block is appended after that cap, so the 219-byte hygiene directive is about 81 percent of a mean brief. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:104] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:620-624]

7. **No byte remains removable from a brief without reversing a swept decision.** The head and companion already share one 320-character budget; the constant block is the comment-hygiene hard block that segment one and the repo's own directive decided to keep. Any further cut would remove offer content or the hard block, not slack. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:127]

8. **The committed arm's capped-turn count is 47, not the 41 in the dispatch brief.** `summary-arm.json` counts opencode 26 (15 off, 11 on), devin 19 (10 off, 9 on), pi 2 (off), claude 0 and dsh 0 across 400 runs. The raw exit census agrees except for one row: 28 runs exited 143 (opencode 26, pi 2) and 20 exited null (devin), of which one null is the documented `fresh-skill-04` rebase row rather than a cap. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl]

9. **The cap is keyed to the prompt, not the runtime, and the runner records no turn duration.** `CAP_MS` is 300,000 ms for a chat turn and 900,000 ms for a started one, chosen by `G2_PROMPTS.has(rowId)`. `spawnTurn` passes `timeout: capMs` and settles only `{exit}`, and the run line stores `exit` alone, so a null exit conflates a cap kill with a spawn error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:78-81] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:965] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1063-1095]

10. **The capped turns' wall time cannot be recovered from the OpenCode store today.** None of the five local OpenCode databases holds a phase 033 arena session id, and the active store holds zero sessions for the arena directory, so no message timestamp survives to measure how long a capped turn actually ran. [SOURCE: read-only count queries against ~/.local/share/opencode/{opencode.db,opencode-v1.db,opencode-v2.db,opencode-rerun.db,opencode-shots.db}] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl]

11. **The arena arm ran at an earlier commit than the dispatch brief's HEAD.** The five arenas were built at `b765c7a14c5`; HEAD is `84de3d600fa`, six commits later, all documentation and review commits. The arm's behaviour numbers are therefore evidence about `b765c7a14c5`, and no code that affects hook time changed between the two commits. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arenas.txt:1] [SOURCE: `git log --format='%h %ad %s'` at HEAD sequence 84de3d600fa, b765c7a14c5]

## Ruled Out

- Reading turn duration from the run lines: the record has no duration field and the arena sessions are gone from the store, so the cap's cost per turn is not recoverable. Replaced by the exit census and the cap constants.
- Treating the p95 290 ms as the hook's work time: the 240-299 ms plateau with a 300 ms cliff shows a deadline shapes the distribution. Reporting 290 ms as "typical cost" would misstate it.
- Counting `null` exits as caps without qualification: one of the 20 null exits is the `fresh-skill-04` rebase row with a failed restore, so the cap count is 19 nulls plus 28 exit-143s.

## Dead Ends

- OpenCode SQLite store as a turn-duration source for phase 033: the sessions do not exist in any of the five databases. Candidate for "Exhausted Approaches" only for this arm; a future run must record durations itself.
- Reconstructing the brief's token count from a tokenizer: no tokenizer is committed for this brief and the renderer's own 4-characters-per-token estimate is the contract, so a second estimate would add noise, not evidence.

## Edge Cases

- Ambiguous input: the dispatch brief's "41 capped turns" and the committed summary's 47 disagree. Selected the committed count as the evidence-bearing number and recorded the brief's number as a stale snapshot rather than a second truth.
- Contradictory evidence: none beyond the capped count. The segment-four p99 (396 ms) and this segment's p99 (300 ms) measure different windows (2026-11-13 only vs four days), so both stand.
- Missing dependencies: the OpenCode arena sessions are absent from the store; used the exit census and the cap constants instead, and recorded what a re-run must persist.
- Partial success: all six actions produced evidence; the turn-duration question remains open. Status is `complete`, not `insight`, because the new measurements answer two key questions and the gap is named rather than smoothed.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arenas.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/{claude,opencode,pi,devin,dsh}.jsonl`
- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl` (694 files, 17,775 duration rows)
- `~/.local/share/opencode/{opencode.db,opencode-v1.db,opencode-v2.db,opencode-rerun.db,opencode-shots.db}` (read-only)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:78-81, 965, 1063-1095`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:104-127, 150-157, 585-624`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:384-402`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:21-22`
- `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:260-290, 355-424`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:127`

## Assessment

- New information ratio: 0.83
- Questions addressed: KQ1 (hook cost and budget), KQ2 (what ended the capped turns), KQ3 (brief bytes and removable byte)
- Questions answered: KQ1, KQ3

## Reflection

- What worked and why: aggregating the raw health records instead of trusting a prior segment's snapshot produced a four-day sample ten times larger than segment four's and exposed the 300 ms cliff, which no earlier segment reported. Counting exits in the run files instead of trusting the summary caught the 47-versus-41 discrepancy.
- What did not work and why: the OpenCode store read assumed sessions persist per project; the arena's projects were gone, so the cap's duration side is unmeasurable from the arm as it stands.
- What I would do differently: check the arena session survival before planning a duration measurement, and treat a brief's prose number as a claim to re-derive from the committed file.

## Recommended Next Focus

Iteration 2: measure what the 300 ms boundary actually is — read the CLI's own deadline and the shim's child timeout end to end, and determine whether the 240-299 ms plateau is a queue wait, a daemon probe, or a deliberate cut, and what a cold first prompt does on that boundary.
