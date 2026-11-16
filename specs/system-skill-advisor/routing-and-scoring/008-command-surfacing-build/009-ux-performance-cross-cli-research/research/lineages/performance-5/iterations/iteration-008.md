# Iteration 8: The lane's per-prompt cost ledger

## Focus

Assemble the performance lane's deliverable: one per-prompt cost ledger per runtime, with each cell's source and a named confirmation for every inferred cell. This is the last pass under the 8-iteration cap, so it consolidates rather than opens a new question.

## Actions Taken

1. Recomputed the cached/uncached split per runtime from the real (non-sweep) live rows.
2. Placed the hook cost beside the brief cost and the started-command document cost from the committed measurements.
3. Named the three inferred cells and the single measurement that would confirm each.

## Findings

1. **The hook ledger, per runtime, uncached:** Claude p50 172, p95 618 ms (n 529); Devin 160/237 (n 44); DSH 165/243 (n 49); Pi 161/264 (n 48); Vibe 140/742 (n 41); Codex four rows at 0 ms, unusable. Cached: Claude 30/151 (n 926), Pi 140/327 (n 20), DSH 139/323 (n 20), Vibe 142/220 (n 8), Devin 200/230 (n 4). [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

2. **The three in-process runtimes share one profile and Claude is the outlier at the tail.** Pi, DSH and Devin land at uncached p50 160-165 ms and p95 237-264 ms; Claude's uncached p95 is 618 ms, 2.3-2.6x theirs. The difference tracks the process chain: three Node starts on Claude against an in-process plugin elsewhere. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [INFERENCE: based on the runtime split and the Claude-only three-command hook configuration]

3. **The brief costs about 68 tokens per prompt in a fresh-session population.** 270.6 bytes mean, 262 median, 316 p95 at the renderer's four-characters-per-token estimate; 99 percent of briefs carry the full 219-byte directive. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:104-127]

4. **The started command's document read is 16.6 times the brief, so prompt-level overhead is not where a prompt's cost lives.** The command-document median is about 1,131 tokens and p95 about 3,143, against the brief's ~68 tokens; the hook's own 172 ms is 0.10 percent of a 172-second uncached turn. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82] [INFERENCE: based on the brief token estimate and the committed document measurement]

5. **Three cells remain inferred, each with one confirming measurement.** The cold first prompt: unload the model and run one real prompt, recording hook wall time, probe duration and fail-open reason. The process-chain ceiling: run the three configured hooks in host order and record per-command time. The amortized brief: five prompts sharing one session id with a growing transcript, recording `emittedBytes` each time. [INFERENCE: based on iterations 5, 6 and 7]

6. **No measured cell in this ledger exceeds a runtime's budget.** The worst live p95 is Claude's uncached 618 ms against 2,500 ms (24.7 percent); the worst single live row is 1,538 ms (61.5 percent); the cold chain's measured work is 690 ms and its risk is the 2,500 ms probe ceiling, not the model. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:160]

## Ruled Out

- Ranking any performance fix above the turn-cap fix: the cap removed 47 judgeable rows, while every latency cell sits inside its budget.
- Treating the ledger's hook column as a prompt's total hook latency: two non-advisor hooks run outside it.

## Dead Ends

- Per-runtime cached medians on Devin and Codex: four and two rows respectively, too few to read.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the ledger reconciles the cached and uncached medians that looked contradictory in iteration 4.
- Missing dependencies: the three inferred cells need runs this lane may not perform.
- Partial success: six findings, three cells inferred and named. Status `complete`.

## Sources Consulted

- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:104-127`
- `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:160`
- `.claude/settings.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82`

## Assessment

- New information ratio: 0.60
- Questions addressed: all five, as a consolidated ledger
- Questions answered: none new

## Reflection

- What worked and why: splitting by runtime and cache state turned eight iterations of scattered numbers into one comparison where the outlier and the cause line up.
- What did not work and why: early passes aggregated the folder and then aggregated real rows; both hid the per-runtime shape until it was split.
- What I would do differently: build the ledger's dimensions (runtime × cache × freshness) before the first aggregate.

## Recommended Next Focus

None: the iteration cap is reached. The lineage proceeds to synthesis with three inferred cells named and their confirming measurements stated.
