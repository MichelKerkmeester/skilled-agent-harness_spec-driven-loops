# Iteration 1: Cold and warm in-process handler cost, and today's fallback baseline

## Focus

Segment three rank 6: score a degraded prompt with the TypeScript handler in process (`runLocalScorer` calling `handleAdvisorRecommend`), then apply the Q026 filter. This iteration measures the cold and warm cost of one handler call on ten fixed non-holdout prompts, times today's Python fallback scorer on the same prompts, and records the floors at the built HEAD.

## Actions Taken

1. Read the built state: `P/goal.md`, `research-segment-3.md` sections 3 and 4, the 014 and 015 implementation summaries, and the code they name.
2. Copied the advisor database and its generation file into the lineage scratch folder (never the tracked copies) and pointed `SYSTEM_SKILL_ADVISOR_DB_DIR` at the copy:
   `sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite ".backup '<lineage>/scratch/db/skill-graph.sqlite'"` and `cp .skilled/skills/.state/advisor/skill-graph-generation.json <lineage>/scratch/db/skill-graph-generation.json`.
3. Wrote `<lineage>/scratch/timing-handler.mjs`, which imports the built handler `dist/runtime/handlers/advisor-recommend.js` with the hook's own options (`topK 3`, `includeCompiledRoute true`, `compiledRouteTopOnly true`, `confidenceThreshold 0.8`, `uncertaintyThreshold 0.35`), refuses any holdout row, and prints one JSON line per call.
4. Ran ten cold runs, each a fresh `node` process scoring one prompt; one warm process scoring all ten; one process scoring the same ten through `runAdvisorSubprocess` (the Python scorer today's `runLocalScorer` spawns) with `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`.
5. Ran the committed floor capture.

## Findings

1. A cold in-process path costs a median of 224.7 ms and a worst of 337.7 ms for import plus one handler call, and the whole fresh process finishes at a median of 239.4 ms and a worst of 443.0 ms. That worst case is 17.7 percent of the hook's 2,500 ms budget. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/iteration-001-summary.json]
2. A warm handler call in a process that already loaded the modules costs a median of 76.5 ms and a worst of 93.6 ms across the ten prompts. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/warm.jsonl]
3. The handler module import is the largest fixed cost of the cold path: median 78.4 ms, worst 146.4 ms, which is 35 percent of the 224.7 ms cold median. The remaining 140.5 ms median is the first scoring call, including the prompt embedding. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/iteration-001-summary.json]
4. Today's Python fallback scorer costs a median of 238.5 ms and a worst of 377.7 ms for the same ten prompts, measured as one spawn per prompt inside a warm node process. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/fallback.jsonl]
5. The cold in-process added cost is at parity with today's fallback, 224.7 ms against 238.5 ms, a difference of minus 13.8 ms at the median. The warm in-process call is 3.1 times cheaper than the Python spawn. A CLI process that already loaded its own modules pays the import only on its first degraded call, so the comparable number is the cold one. [INFERENCE: based on the cold, warm and fallback rows in the same summary file and the dynamic-import shape of the proposed call site]
6. The floors are unchanged at the built HEAD: typed recall 24 of 44, false offers 0 of 35, plain tune 23 of 45 and attached false offers 0 of 35. The capture took 8.96 s. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/floor-capture.json]

## Ruled Out

- Measuring the in-process handler against the tracked database: the copy plus the copied generation file is what makes `readAdvisorStatus` report `live`, and it keeps every scratch write inside the lineage. Without the generation file the status read `absent` and the handler returned zero recommendations. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47]
- Timing the warm set on the same prompts used for warm-up: the prompt cache is keyed on prompt text and source signature, so a warm-up call would have filled the measured cache entry. Warm-up used two rows outside the measured set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:602]

## Dead Ends

- None this iteration. The first scratch run returned zero recommendations because the generation file was missing; copying it fixed the status read and is recorded under Ruled Out rather than treated as a dead end.

## Edge Cases

- Ambiguous input: the lane says "the way rank 6 describes". Selected interpretation: one dynamic import of the built handler inside the CLI, then one `handleAdvisorRecommend` call with the hook's options and `degradedRecommendations`. Deferred: a static import at CLI module load, which would move the 78 ms import onto every live prompt.
- Contradictory evidence: none.
- Missing dependencies: none. Ollama was already running and served the prompt embedding; the first cold call waited on it within the measured 140.5 ms median.
- Partial success: none.

## Commands and Output

```text
$ for i in 0..9; do SYSTEM_SKILL_ADVISOR_DB_DIR=<lineage>/scratch/db node <lineage>/scratch/timing-handler.mjs cold $i; done
{"mode":"cold","index":0,"id":"cmd-create-readme-plain-tune-01","importMs":146.41412499999998,"handlerMs":178.087708,"totalMs":343.384875,"top":"sk-doc",...}
{"mode":"cold","index":3,"id":"cmd-speckit-save-plain-tune-01","importMs":90.892792,"handlerMs":337.66616600000003,"totalMs":442.994125,...}
... 10 lines in scratch/cold.jsonl

$ node <lineage>/scratch/timing-handler.mjs warm
{"mode":"warm-summary","n":10,"median":76.53029099999992,"worst":93.63550000000004,"best":26.30037500000003}

$ SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 node <lineage>/scratch/timing-handler.mjs fallback
{"mode":"fallback-summary","n":10,"median":238.53575,"worst":377.6906250000002,"best":194.695917}

$ node $RA/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.tune, .attachedMetrics.false_offer_attached'
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":8,"attached":15,"combined":23,"total":45}
{"count":0,"total":35}
real 8.96
```

## Sources Consulted

- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation/implementation-summary.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/implementation-summary.md
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1455
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1481
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:716
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:305
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:303
- .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:144
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:228
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/cold.jsonl
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/warm.jsonl
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/fallback.jsonl
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/floor-capture.json

## Assessment

- New information ratio: 1.0
- Questions addressed: cold cost; warm cost and the cold split; comparison with today's fallback; floors
- Questions answered: all three timing questions, plus the floor half of the answer-change question

## Reflection

- What worked and why: copying both the database and the generation file made the handler score against a live scratch graph, so the numbers reflect the real lane rather than an absent-graph early return. Measuring import and call separately showed that module load, not scoring, is the fixed cost.
- What did not work and why: the first run read `ADVISOR_FRESHNESS_ABSENT` and returned zero rows, because the copied database had no generation counter beside it. The code at `lib/freshness/generation.ts:47` shows the counter is a separate file.
- What I would do differently: start the iteration clock before the harness write and record mtimes, so `durationMs` is a measured span rather than reconstructed from the run-open row.

## Recommended Next Focus

Measure the answer-change half of the question: run the in-process handler plus the Q026 filter and today's Python fallback on the same ten prompts, and compare the degraded top, the kept typed command and the `needsMode` label. That answers whether the build buys an answer as well as time.
