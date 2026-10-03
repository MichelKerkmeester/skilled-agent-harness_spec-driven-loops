---
title: "Iteration 1: What Drove The Measured Result"
trigger_phrases: []
---
# Iteration 1: What Drove The Measured Result

## Focus

Decompose the recorded result `verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330, p50 330 ms, p95 391 ms` into the verdict arithmetic, the test-set construction, both baselines, and the column semantics, with file:line evidence.

## Findings

1. The verdict is four conditions checked in order: coverage, margin, sign test, flips. `decideVerdict` returns `stop` at the first failed condition and `keep` only when all four pass. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:880] The fixed rule line is `coverage 10*M >= 9*K, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M` with `margin: 0.10`. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:59] For the recorded numbers: coverage 2560 >= 2304 passes; margin 290 >= 256 passes with only 34 units (3.4 rows) of slack; p 0.006330 < 0.05 passes; flips 470 <= 768 passes. The keep rests on the margin condition, and a four-row swing would flip the verdict to `stop (margin)`.

2. Margin and sign test are not independent evidence: A minus B is identically W minus L, because each discordant row contributes +1 to both (backend right, baseline wrong) or -1 to both (baseline right, backend wrong). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:948] With A-B = 29 and W-L = 29 the rule scores the same difference twice, once against a magnitude floor (25.6 rows) and once for its sign-test tail. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:882] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:883]

3. The 256 questions are a hash-ordered stratified sample of packet `description.json` texts, capped at 20 per track. `buildTestSet` walks each track for directories holding `description.json`, skips `z_archive`, `scratch`, `research`, `context`, classifies each description, sorts survivors by SHA-256 of the folder path, and slices to `MAX_ROWS_PER_TRACK = 20`. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:51] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:42] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:330] The recorded census kept 256 rows out of 1727 usable: `system-speckit` had 1009 usable and contributed 20, `system-deep-loop` 261 to 20, `hooks` 103 to 20, while `cli-orca` contributed its single usable row. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt] So per-track accuracy at the low end rests on one or a dozen author-written descriptions, and 85 percent of usable candidate text is discarded by the cap.

4. The questions are descriptions, not the prompts Gate 1 actually sees. Rows carry the packet description text verbatim as the question. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:340] The paraphrase probe line in the same recorded run reads `paraphrase probes: total=20 gold-less=6 lookup=0/14 ripgrep=8/14 jev=2/14` — on the 14 gold-bearing Latin paraphrase probes, ripgrep beats Jev 8 to 2. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt] The scorer loads only `locale=latin`, `variant=paraphrase` probes from the 120-row fixture and only latin exact rows as gold donors; the CJK and distractor rows are unused. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:731] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:725] The accuracy ranking between Jev and ripgrep flips by input family, which is the first-order explanation of both the keep and the "under half" reading.

5. The lookup baseline is structurally blind at this task. `scorePhrase` requires a single normalized phrase key to cover at least 80 percent of the query tokens, where keys are `trigger_phrases` frontmatter, and the candidate gate drops query tokens shorter than 3 characters and keeps only the first 8. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:146] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:19] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:22] Worse for this measurement, `lookupPick` skips every index row inside the question's own packet folder and takes the first positive-score row outside it, removing the strongest self-signal by design. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:456] Result: 17/256 right (0.0664), below a coin toss per track. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt]

6. The ripgrep baseline counts token presence, it does not rank relevance. `ripgrepPick` runs the path-only recipe per token — `rg --no-config --hidden --fixed-strings --ignore-case --files-with-matches --max-count 1` over `specs` — then scores every matched file by how many question tokens it contains, keeps files at the top score, and picks the track with the most such files, ties by code-unit track name. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:516] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:119] Tokens like `spec`, `doc` or `the` clear the 3-character floor and match whole trees, so the winner is a plurality over noisy file lists; 68/256 right. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:475]

7. The Jev column counts abstention and instability as error, by construction. A row is measured only with one string answer per order; the pick is the modal key and needs at least two of three orders agreeing, else it is unstable and wrong; an abstained `none` pick is wrong; every missing vote also adds to flips. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:937] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:857] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:946] The recorded column reads `measured=256 unmeasured=0 unstable=3 abstained=57 flip_rate=0.0612`, so of the 159 wrong rows 57 are explicit `None of these tracks` votes and 3 are 1-1-1 splits — both counted against A. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt]

8. Cost structure is per-CLI-invocation. The plan is 3 orders x (256 rows + 14 gold-bearing probes) + 1 auth test = 811 calls, estimated 905,891 input tokens, wall time 1339.6 s; latency is captured per `spawnCall` wall clock, including the auth test and any retry attempt, and reported at nearest-rank p50/p95. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1247] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1332] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:986] The p50 330 ms and p95 391 ms are therefore single-call subprocess+provider wall times, roughly 1.7x to 2x the cold lookup's own 200 ms p95 budget. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:43]

9. The verdict's own record line is the only durable artifact of the row set: `report.json` stores counts (K, per-track counts, baselines, columns) but not the 256 row ids or question texts; `calls.jsonl` stores row ids and picks but not question text. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1472] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1305] That matters for Q3 and is carried forward.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` (read in full)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/` (stdout.txt, out/report.json)
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/lineages/deepseek/steer.md` (absent)

## Assessment

- newInfoRatio: 0.90
- Novelty justification: first pass established the full causal chain from test-set construction and baseline mechanics to the exact verdict arithmetic, including the A-B = W-L identity the rule scores twice.
- Confidence: high, every claim is a direct read of the scorer, its libraries, or the recorded run output.
- Code graph note: no code graph query used; all claims are direct file reads.

## Reflection

- Worked: reading the scorer end to end before interpreting the verdict line; the `report.json` and stdout of the recorded run gave exact counts to anchor every claim.
- Failed: nothing material; the only unavailable input was a steer file, which does not exist yet.
- Ruled out: treating the result as "Jev vs a fair retrieval baseline" — both baselines have structural handicaps specific to this task (lookup self-exclusion, ripgrep token plurality), so the keep says more about the row set than about Gate 1 production retrieval.

## Recommended Next Focus

Iteration 2: raise accuracy or lower cost. Enumerate amendment-class options (sampling, question families, two-stage shortlist, probability and flip data reuse, call-shape cost knobs) with evidence and expected effect.
