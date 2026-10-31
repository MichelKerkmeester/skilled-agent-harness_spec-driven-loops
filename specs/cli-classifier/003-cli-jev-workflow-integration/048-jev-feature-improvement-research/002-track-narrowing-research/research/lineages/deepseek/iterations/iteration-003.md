---
title: "Iteration 3: Make The Measurement More Trustworthy"
trigger_phrases: []
---
# Iteration 3: Make The Measurement More Trustworthy

## Focus

Separate trust gaps in the measurement into reproducibility, statistical validity, baseline fairness and label quality, each with file:line evidence, and rank cheap upgrades. The per-track numbers below were recomputed offline from the recorded `calls.jsonl`.

## Findings

1. The 256 rows are 16 strongly heterogeneous clusters, not exchangeable draws. Per-track Jev modal accuracy from the recorded calls spans sk-design 3/20 (0.15) and sk-communication 4/20 (0.20) up to sk-git 12/15 (0.80), mcp-tooling 5/6 (0.83) and cli-orca 1/1. Per-track abstention spans 0.00 to 0.80: sk-design abstained on 16 of its 20 questions, sk-doc and sk-communication on 8 each — 32 of the 57 total abstentions sit in three tracks. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl] The sign test is an exact one-sided tail over row counts and treats rows as independent. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:813] Rows inside one track share a track description, a shared option text and often near-identical vocabulary, so the effective independent unit count is closer to 16 than 256 and the reported p is optimistic as usually read.

2. The verdict sits 3.4 rows above its own failure line and the report does not surface that slack. The margin condition fails below A-B = 25.6; the recorded A-B is 29. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:883] The report columns carry K, M, A, B, W, L, F, p, unstable, abstained and latency, but no distance-to-threshold for any condition. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1498] A single rerun or a few re-worded descriptions flips `keep` to `stop (margin)` with no visible warning.

3. The row set is not pinned anywhere. `report.json` stores only `testSet: { K, counts }` — no row ids, no question texts, no gold list. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1474] `calls.jsonl` stores row ids and picks but not the question text. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1305] Questions are re-derived from live `description.json` files at every run. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1589] Two runs can both report K=256 while the underlying rows have changed, and nothing in the report can prove otherwise. The probe fixture pins its own `promptSetHash` (`ae62945484...`), but the scorer never reads or checks it; the trigger-index manifest's `promptSetHash` stays `null` until a parity consumer pins a prompt set there. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:79]

4. Reusing an `--out` directory silently destroys earlier evidence. The call log is created with `fs.writeFileSync(filePath, '')` on first append, truncating any prior `calls.jsonl`, and the report is overwritten with `fs.writeFileSync` at the end of every run. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1113] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1672] The 017 session already recorded this as an unchased P2: "a reused `--out` dir truncates earlier records". [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/scratch/w3-session/session-evidence.md:181]

5. Model-change detection is print-only and one-directional. `requalify: model changed` prints when the stored report's provider or model differs from the current one; a same-model rerun is a silent overwrite, and nothing requires a re-run on a changed model. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1394] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1396] The verdict's validity window (jev 0.6.2, official, jev-1.13.0) is embedded in the line but enforced nowhere. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1132]

6. Baseline fairness is a mixed picture worth stating precisely. The measurement compares against the stronger of the two lexical methods by construction (method is `ripgrep` because 68 > 17), which is fair. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:628] But only the path-only recipe of the documented set is used; `structuredRecipe`, `structuredCappedRecipe` and `countRecipe` exist and are unused here. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:28] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:96] A gain that survives a structured-recipe baseline is a stronger claim than one measured against token plurality alone.

7. Label quality is unaudited. Gold is the track segment of the row's own folder path, so it is structural — but no wrong pick is ever adjudicated, and a packet description that legitimately spans two tracks is scored wrong with no appeal path. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:946] The sibling measurement in this family shows why this matters: feature 022's fixture was built "from real spec folders" and "the fixture's target was the wrong folder on every row", so its result could only compare Jev with the top alternative. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md]

8. Probe trust is bounded and declared: probe gold is recomputed from the current index rather than the fixture's captured paths, probes never decide the verdict, and gold-less probes leave the denominator — 6 of 20 left it in the recorded run. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:700] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:791]

9. What is already trustworthy: the run was mechanically clean — 811 of 811 calls measured on attempt 1 with exit 0, so p50 330 ms and p95 391 ms carry no retry contamination — and the p-value is computed exactly in BigInt with no float comparison at the threshold (`20n * num < den`). [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:832] The exactness of the tail is not the issue; the independence assumption and the unpinned row set are.

## Trust Upgrades, Ranked

1. **Pin the row set** (cheap, reporting-only): write row ids, question SHA-256s and gold tracks into `report.json` or a companion `rows.jsonl`, and record the fixture/`promptSetHash` used. Makes two runs diffable at constant K. Evidence: finding 3.
2. **Freeze or version output directories** (cheap): refuse a non-empty `--out` dir or write run-scoped files, so history survives. Evidence: finding 4.
3. **Report threshold slack and cluster-aware uncertainty** (cheap, offline): add distance-to-threshold per condition and a bootstrap over 16 track clusters alongside the exact row-level p. Evidence: findings 1 and 2.
4. **Require n≥2 runs for a verdict** (medium, ~22 min and ~0.9M input tokens per run): a repeatability check bounds run-to-run variance and would catch the near-threshold case honestly. Evidence: finding 2.
5. **Audit a wrong-pick sample** (cheap-medium, 20-30 rows): bound label error before treating sub-50 percent accuracy as ground truth. Evidence: finding 7.
6. **Add a stronger baseline variant** (medium): structured recipe with the documented rank tuple, reported beside the current baseline. Evidence: finding 6.
7. **Promote a second question family** (amendment): score the latin paraphrase probes (and the prompt-set fixture cases) under a fidelity rule, per family, rather than report-only. Evidence: iteration 2 findings; finding 8.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl` (offline recompute)
- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json`
- `specs/cli-jev/003-cli-jev-workflow-integration/scratch/w3-session/session-evidence.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/lineages/deepseek/steer.md` (absent)

## Assessment

- newInfoRatio: 0.62
- Novelty justification: the per-track recompute exposed a 0.15-to-1.00 accuracy spread and a 16-of-20 abstention concentration in one track, which reframes the p-value as a clustered, not row-level, claim; the row-pinning and out-dir gaps were then confirmed line by line.
- Confidence: high; all claims recomputed from recorded files or read directly. The cluster-aware p estimate is qualitative (no bootstrap run in this iteration).
- Code graph note: none used.

## Reflection

- Worked: per-track decomposition made the abstract "trustworthiness" question concrete — the measurement's biggest trust problem is not arithmetic but exchangeability and missing row identity.
- Failed: question texts are absent from `calls.jsonl`, so the sk-design abstention cluster could not be attributed to specific phrasings; that absence is itself finding 3.
- Ruled out: distrusting the exact p-math (it is BigInt-exact); distrusting the latency numbers (clean run, attempt 1 throughout).

## Recommended Next Focus

Iteration 4: where else in `.skilled` the same judgment pays off. Inventory same-shape judgments (spec-folder suggestion, clarify default, skill routing, fetch screening, completion claims) and the scorer-pattern reuse, with evidence.
