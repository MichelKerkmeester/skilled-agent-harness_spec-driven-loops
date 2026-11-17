# Iteration 2: Live brief size and hook latency at HEAD

## Focus

KQ2. What the live brief costs per prompt and what the hook costs per prompt after phase 015, and whether any byte or millisecond can be removed without losing the command, the policy or the skill. Phase 015 left this open: its cost script exited 2 with `degraded_brief` and reported only 44 rows and 0 live rows. This iteration measures both directly: the TypeScript source hook over all 44 typed corpus rows in one process, and the hook's own default health records for 2026-11-13.

## Actions Taken

- Wrote `scratch/measure-live-brief.mts` and ran it from the repo root with `node --import ./.skilled/skills/system-deep-loop/runtime/node_modules/tsx/dist/loader.mjs <script>`. It calls `handleClaudeUserPromptSubmit` for each `row_type === "typed" && split === "none"` corpus row with the hook's own diagnostic writer replaced by a no-op, and stores `scratch/live-brief-ts.json`.
- Wrote `scratch/health-latency.mjs` and ran `node <script> | tee scratch/health-latency.json`. It reads every `*-diagnostics.jsonl` in the OS temp metrics folder and keeps records whose timestamp starts `2026-11-13`.
- Read the phase 015 render probe and the phase 015 summary for the composition and the prior open limitation.

Measured output, first command:

```
{"rows":44,"liveRows":44,"totalBytes":13581,"medianBytes":306,"p95Bytes":337,"maxBytes":350,"medianHeadBytes":88,"p95HeadBytes":119,"maxHeadBytes":132,"firstCallDurationMs":221.8,"medianDurationMs":145.3,"p95DurationMs":233.5,"maxDurationMs":274,"medianLiveDurationMs":145.3,"p95LiveDurationMs":233.5,"maxLiveDurationMs":274,"nonLiveRows":[]}
```

Measured output, second command:

```
{"files":58,"records":1826,"byRuntime":{"claude":1816,"pi":7,"codex":3},"statuses":{"ok":1762,"skipped":39,"fail_open":19,"degraded":6},"freshness":{"live":1726,"unavailable":50,"absent":3,"stale":47},"cacheHitRate":0.876,"durationMs":{"n":1826,"median":178,"p95":294,"p99":396,"max":893,"min":0},...,"overBudget2500":0,"over1000ms":0,"zeroDuration":234}
```

## Findings

1. The live brief over all 44 typed rows is 306 bytes at the median, 337 at p95 and 350 at the maximum, with a first-line (head) median of 88 bytes, p95 119 and max 132; all 44 rows rendered a live head (`nonLiveRows: []`). This closes the phase 015 open limitation with a number: the earlier estimate of 296 bytes was 10 bytes low, and the 78-byte repeat estimate was 10 bytes low. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json]

2. Roughly 72 percent of every brief is the fixed comment-hygiene directive, not the recommendation. The no-match brief is 244 bytes, of which 25 are the head `Advisor: no skill matched.` and 219 are the directive block; at the 306-byte median the recommendation is about 87 bytes and the directive about 219. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json]

3. Hook latency has wide headroom against the 2.5 s budget. Across 1,826 real health records from 2026-11-13 the median is 178 ms, p95 294 ms, p99 396 ms and the maximum 893 ms; zero records exceed 1,000 ms and zero exceed 2,500 ms. The in-process source handler over 44 live calls is 145.3 ms median, 233.5 ms p95 and 274 ms max, with a first call of 221.8 ms on a warm daemon. The p99 uses 15.8 percent of the budget and the worst record 35.7 percent. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/health-latency.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:144]

4. The brief is selective, so its cost lands on a minority of prompts. Of 1,826 records, 325 emitted a non-zero brief (17.8 percent), the mean emission is 265.6 bytes and the mean over all records is 47.3 bytes; 47 records are stale, 19 fail open and 6 are degraded. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/health-latency.json]

5. No byte cut is worth building on this evidence. The only removable head decoration left is the status word plus the two scores and `pass`, at most about 30 bytes of a 306-byte brief (9.8 percent), and removing it loses freshness and the pass mark, which segment three already showed fails the head-cut test. The other 219 bytes are the directive block, and trimming that was decided in segment one. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md]

## Ruled Out

- Piping rows through the committed `measure-brief-cost.mjs` with the compiled dist hook: it reads `degraded_brief` on this machine, which is the exact failure phase 015 recorded, so the source handler is the only path that yields live heads without a build.
- Rebuilding the stale `@spec-kit/cli` dist to make that script pass: a build writes outside this lineage, and the lane forbids it.
- Measuring a new cold-daemon first prompt: that needs a fresh socket and a live arm-like start. The phase 010 figure of 742 ms (30 percent of budget) already covers it and is cited, not rerun.

## Dead Ends

- Using `emittedBytes` from health records as the brief size: 82 percent of records are zero because the advisor emitted nothing, so the positive subset is the only size signal and the typed corpus is the only clean population.
- Treating the cache-hit median as the repeat cost: the repeat head is 88 bytes in the corpus, not zero, because the reduced head still carries the first line.

## Edge Cases

- Ambiguous input: none. The lane names brief size and hook latency.
- Contradictory evidence: the health record's `emittedBytes` p95 of 287 is below the corpus median of 306 because the record population includes short prompts and zero emissions; both are reported with their own denominator.
- Missing dependencies: the compiled dist hook is stale, so the committed cost script cannot run; the source handler is the fallback and is named as such.
- Partial success: none. Every intended measurement ran.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/health-latency.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs`

## Assessment

- New information ratio: 0.90
- Questions addressed: KQ2
- Questions answered: KQ2

## Reflection

- What worked and why: importing the source handler instead of spawning the stale compiled hook produced 44 live heads where the committed script produced zero, and it exposed the `emittedBytes` field the health record already writes.
- What did not work and why: the committed cost script's live-head rule cannot be satisfied on a stale dist, so the honest fallback was a source-level harness rather than a build.
- What I would do differently: capture per-row bytes and the directive length in the scratch JSON next time, so the composition share is read from one artifact instead of two.

## Recommended Next Focus

KQ3: use the per-runtime offer and start evidence from iteration 1 plus these cost numbers to name the residual usefulness limits and the one change worth building, with its files, measured gain and proof check.
