# Iteration 4: Two latency modes — cache hit versus real scoring

## Focus

Triangulate the built-state latency against every committed hook-latency probe in the packet (phases 003, 004 and 005), and establish whether the organic records and the fixed probe describe the same path. Chosen because KQ1's answer rested on one population, and a lane whose only instrument is a folder of mixed records needs an independent reading before its p95 can be trusted.

## Actions Taken

1. Read the seven committed 44-prompt hook-latency probe files and tabulated n, median, p95 and max for each.
2. Recomputed live-only percentiles per runtime from the real (non-sweep) health rows, and split them by `cacheHit`.
3. Compared the probe band against the organic live band and noted where they measure different paths.

## Findings

1. **Every committed 44-prompt probe reads a median of 192-251 ms and a p95 of 239-450 ms.** 003 before 194.4/281.2, 003 after 251.2/450.5, 004 after 205.1/261.9, 005 before 193.2/295.6, 005 after-1 192.4/239.2, after-2 192.8/278.6, after-3 218.1/250.2. The built state's organic live p95 of 311 ms sits inside that band, so no measured regression appears between the probe era and the built state. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/scratch/hook-latency-before.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/scratch/hook-latency-after-3.json]

2. **The organic record has two modes, and the median describes the cheap one.** Of 1,695 live rows, 980 (57.8 percent) are cache hits; Claude's live median is 30 ms while its live p95 is 308 ms. The fixed probe never observes a cache hit, so a probe median of ~200 ms and an organic median of 30 ms are both true and describe different paths. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

3. **Per-runtime live p95 is 308 ms on Claude, 279 on DSH, 264 on Pi, 237 on Devin and 742 on Vibe.** Codex has six live rows at p95 161 ms, too few to read. Vibe is the only runtime whose p95 exceeds Claude's, and it is also the one with the smallest live sample (49 rows). [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

4. **The built-state brief median is 262 bytes, 44 bytes below segment four's 306-byte median on typed rows.** The populations differ (organic prompts versus 44 typed rows), so this is consistent with, not proof of, the phase 021 head change trimming the head. What would confirm it: the same 44 typed rows re-measured on the built state. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [INFERENCE: based on the 262-byte built-state median and segment four's 306-byte typed-row median] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:167]

## Ruled Out

- Comparing a probe median to an organic median directly: 57.8 percent of organic live rows are cache hits, so the two medians measure different work.
- Reading Vibe's 742 ms p95 as a runtime cost: 49 rows is too small a sample and its rows are not from a controlled arm.

## Dead Ends

- The phase 015 `brief-cost-live.json` is not a rows array in the shape the filename suggests, so it could not be joined to the organic brief set; the 1,234 organic brief rows carry the same quantity.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: probe p95 450 ms (003 after) is higher than every organic p95 except Vibe's; resolved as a small-sample probe on a pre-optimization build, not as a current cost.
- Missing dependencies: no probe has been rerun on the built state, so the probe-to-organic comparison is cross-sectional.
- Partial success: all three actions produced evidence. Status `complete`.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/scratch/hook-latency-{before,after,top-only}.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/scratch/hook-latency-{before-1,after-1,after-2,after-3}.json`
- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:167`

## Assessment

- New information ratio: 0.75
- Questions addressed: KQ1 corroboration, KQ5 (which instrument)
- Questions answered: none new (both were already answered; this iteration hardens them)

## Reflection

- What worked and why: reading the probe history as a band rather than a point showed the built state has not regressed, and splitting by cache hit explained a 10x median difference that would otherwise look like a contradiction.
- What did not work and why: treating the phase 015 brief-cost artifact as joinable wasted a read; its schema is not the one its name implies.
- What I would do differently: check a scratch artifact's schema before planning a join.

## Recommended Next Focus

Iteration 5: bound the cold first prompt on the built state — read the measured cold numbers in phase 008, the cascade probe default, the current CLI cold wait and the shim's child timeout, and state the worst-case first-prompt cost per runtime chain.
