---
title: "Performance-5: Hook latency, turn caps and brief cost on the built state at 84de3d600fa"
description: "Lineage synthesis for the performance lane of the segment-five fan-out: eight iterations over the advisor hook, the phase 033 behaviour arm's turn caps, and the brief's byte and token cost."
trigger_phrases:
  - "performance-5 lineage synthesis"
  - "hook latency turn cap brief cost"
---

# Performance-5: Hook Latency, Turn Caps and Brief Cost

Lineage `performance-5` of the segment-five fan-out in `009-ux-performance-cross-cli-research`, run 2026-11-16 against the built state after phases 016 to 033 (HEAD `84de3d600fa`). Eight iterations, convergence threshold 0.05, executor `cli-opencode` on `opencode-go/deepseek-v4.1-flash`. The phase 033 arena itself was built at `b765c7a14c5`, six documentation-only commits before HEAD.

## 1. Executive Summary

1. **The hook is not slow; the prompt's process chain is.** Live p95 is 311 ms over 1,695 real rows, and the uncached Claude path is p50 172 / p95 618 ms. Three Node starts account for about 111 ms of that 172 ms median, 64 percent. Pi, DSH and Devin, which run in process, land at p50 160-165 ms and p95 237-264 ms.
2. **The behaviour arm's cap, not the runtime, decided which rows could be scored.** All 48 raw cap exits are `fresh-*` rows held to 300 s: OpenCode 26, Devin 20 (one of them a restore failure), Pi 2, Claude 0, DSH 0. No 900 s row was ever cut. Sampled successful turns finish at 291-298 s on three runtimes, so the cap cuts a live tail.
3. **The brief costs about 68 tokens per prompt and nothing in it is removable.** 1,234 briefs, mean 270.6 bytes, median 262, p95 316, max 361. The 219-byte comment-hygiene directive is 81 percent of a mean brief and is a repo hard block; 99 percent of briefs carry it.
4. **The cost that matters is the started command's document, not the brief.** The command-document median is about 1,131 tokens with p95 about 3,143, 16.6 times the brief.
5. **The instrument was wrong, and this lineage nearly repeated it.** 86.6 percent of the health-record rows (15,400 of 17,775) are synthetic 101-300 ms sweeps. An unfiltered read invents a 300 ms latency cliff; the real rows have a smooth tail to 1,538 ms. This synthesis reports only the filtered set.

## 2. Scope and Evidence Lanes

**Scope:** the performance lane only. Hook wall time per prompt, the behaviour runner's turn caps, and the brief's byte and token cost on the built state. Offer wording, decline safety and per-runtime delivery belong to the `ux-5` and `cross-cli-5` lanes.

**Rules held:** no live arm, no hook run, no build, no model unload, no tracked file edited. Every number comes from a committed artifact, the OS health-record folder, or a read-only query. The one write outside the artifact directory is the coverage-graph database, redirected into the lineage with its supported `DEEP_LOOP_COVERAGE_DB_DIR` override.

**Terms:** *cached* = a recommendation-cache hit; *uncached* = the scoring path ran; *live* = `freshness: live`; *real row* = a health row that is not part of a generated timing sweep; *capped* = the runner's timeout ended the turn.

## 3. What Was Measured

| Measure | Value | Population | Source |
|---|---|---|---|
| Health rows in folder | 17,775 (15,400 synthetic, 2,375 real) | 458 duration-bearing files | `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl` |
| Hook, real all rows | p50 12, p95 279, p99 735, max 2,218 ms | 2,375 | same |
| Hook, live | p50 124, p95 311, p99 757, max 1,538 ms | 1,695 | same |
| Hook, Claude uncached | p50 172, p95 618, max 1,538 ms | 529 | same |
| Hook, Claude cached | p50 30, p95 151, max 913 ms | 926 | same |
| Hook, in-process (Pi/DSH/Devin, uncached) | p50 160-165, p95 237-264 ms | 141 | same |
| Budget | 2,500 ms hook child, 3 s host per hook command | — | `hooks/skill-advisor/claude/user-prompt-submit.ts:160`, `.claude/settings.json` |
| Brief | mean 270.6 B, p50 262, p95 316, max 361 (~68 tokens) | 1,234 | same |
| Brief, head-only share | 9 of 1,234 (0.7 percent) | 1,234 | same |
| Started document | ~1,131 tokens median, ~3,143 p95 | 44 documents | `research.md:82` |
| Arm caps | 47 counted, 48 raw; OpenCode 26, Devin 20, Pi 2 | 400 runs (401 fresh) | `033/scratch/summary-arm.json`, `runs/*.jsonl` |
| Sampled turn durations | 15-298 s; four within 10 s of the cap | 20 sessions | `033/scratch/step-reader/sessions/` |

## 4. Findings — Hook Latency

1. **Two modes, not one.** 57.8 percent of live rows are cache hits at p50 30 ms; the uncached path is p50 172 ms on Claude. A single median therefore describes whichever mode dominates the sample, which is why prior segments' 178-205 ms medians and this segment's 124 ms live median are all true.
2. **The committed probe band holds.** Seven 44-prompt probes across phases 003-005 read median 192-251 ms and p95 239-450 ms. The built state's organic live p95 311 ms sits inside that band, so no regression is measured between the probe era and the built state.
3. **The tail belongs to the process chain.** Three Node starts cost about 111 ms at 36.85 ms each, 64 percent of Claude's uncached median, and Claude's uncached p95 is 2.3-2.6x the in-process runtimes'. The three configured `UserPromptSubmit` commands each carry `timeout: 3`, and only one of them is timed by the health record.
4. **No cell exceeds its budget.** Worst live p95 618 ms is 24.7 percent of 2,500 ms; the worst single live row 1,538 ms is 61.5 percent; the 2,218 ms outlier is an `unavailable` row, not a delivered brief.

## 5. Findings — Turn Caps

1. **47 counted caps, all in the 300 s group.** `capForRow` gives 900 s only to the six `g2-*` rows; every `fresh-*` row is a chat turn at 300 s even when it launches `/create:goal` or `/create:command`.
2. **The cap cuts live work.** A capped OpenCode session emitted messages through 293 s of its 300 s and exited 143; an uncapped sibling ran 291 s and exited 0. Four of twenty sampled successes finish at 240-298 s on OpenCode, Devin and DSH.
3. **The cost is lost judgeable rows.** 26 of 80 OpenCode fresh runs (32.5 percent) and 20 of 81 Devin fresh runs (24.7 percent) ended capped, against 0 of 80 on Claude and DSH.
4. **The runner cannot say when or why.** `spawnTurn` passes `timeout: capMs` and records only `exit`; a null exit conflates a timeout kill with a spawn error, and no duration is stored. The OpenCode arena sessions are gone from every local store, so 45 of 47 capped turns have no recoverable duration.

## 6. Findings — Brief Cost

1. **270.6 bytes mean, 262 median, 316 p95, 361 max, about 68 tokens.** The variable head and companion share an 80-token (320-character) cap; the 219-byte directive block is appended after that cap.
2. **The directive is 81 percent of a mean brief and cannot be cut.** It is the repo's comment-hygiene hard block, decided in segment one.
3. **The dedup amortizes almost nothing in this population.** Reduced delivery needs a confirmed session, a valid growing transcript and a stable clock; 99 percent of measured briefs carry the full directive. A long-lived operator session would fall to a 26-90 byte head, but no record measures that share.
4. **The document dwarfs the brief.** ~1,131 tokens median per started command against ~68 per brief.

## 7. Findings — Cold Path and Process Chain

1. **Measured cold work is about 690 ms** (271-277 ms cold embedding + 413 ms cold CLI), 27.6 percent of the 2,500 ms budget.
2. **The probe ceiling, not the model, is the risk.** The cascade probe defaults to 2,500 ms against a 2,500 ms child kill, so a probe that runs to its default leaves nothing for scoring and fails open.
3. **Server-side waits are twice the caller's budget.** `COLD_START_WAIT_MS` and `LOCAL_SCORER_TIMEOUT_MS` are both 5,000 ms.
4. **The record prices the cold failure at zero.** 664 `unavailable` rows read p50 0 ms and p95 2 ms, so the population where a cold start lands carries no elapsed time.
5. **Five Node processes per Claude prompt.** Three `UserPromptSubmit` commands plus the advisor hook and CLI; the advisor record times its own leg only.

## 8. Findings — Instrument Integrity

1. **15,400 of 17,775 duration rows are generated sweeps** (77 files × 200 monotone values from 101 to 300 ms). Any cross-workspace percentile over the raw folder describes the sweep.
2. **The 300 ms cliff reported in iteration 1 was the sweep's ceiling.** Withdrawn after filtering; the real tail is smooth to 1,538 ms (live).
3. **Coverage is Claude-dominated:** 1,794 of 2,375 real rows (75.5 percent); Codex has 12, Cursor none. A "built-state p95" is effectively Claude's.
4. **The product's rolling rate is unaffected**, because it reads one workspace's last 30 records; the distortion is in any aggregate a human or report computes over the folder.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration |
|---|---|---|---|
| Trim the brief to save tokens | 219 of 270.6 bytes is a repo hard block; 99 percent of briefs carry it; no removable byte remains | `render.ts:104-127`; 1,234 briefs | 1, 3, 6 |
| Read the health folder's raw p95 | 86.6 percent of rows are synthetic sweeps | 15,400 of 17,775 rows | 1, 3 |
| Treat p95 290 ms as the hook's working time | It was the sweep's 300 ms ceiling, not a deadline | filtered distribution | 1, 3 |
| Read the 2,218 ms max as a live worst case | It is an `unavailable` row; live max is 1,538 ms | freshness split | 3, 4 |
| A runtime-keyed turn cap | Claude and DSH never capped; the misclassification is by row set | 0 of 80 on each | 2 |
| Treat the 300 s cap as a stuck detector | Four sampled completions land at 240-298 s; one capped run was active at 293 s | step-reader sessions | 2 |
| Compare a probe median to an organic median | 57.8 percent of organic live rows are cache hits | cache split | 4 |
| Measure cold cost from the record | The fail-open branch writes 0 ms | 664 unavailable rows | 5 |
| Price the whole prompt with the advisor record | Two more hook commands run outside it | `.claude/settings.json` | 7 |
| Rank a latency fix above the turn-cap fix | Every latency cell sits inside budget; the cap removed 47 judgeable rows | §3 table | 8 |

## Divergence Map

No divergent pivots were taken. Saturated directions: the brief's bytes, the directive, steady-state latency, and the degraded in-process scorer (declined in segment four). Remaining frontier: the cold first prompt, the amortized brief across a session, the total cost of all three hook commands, and the conversion rate a behaviour-keyed cap would produce.

## 9. Ranked Recommendations

Ranked by judgeable rows recovered or silent failure removed per unit of work. Each names a measured number, the file, and what would confirm it.

| # | Recommendation | Measured basis | File(s) | What would confirm it |
|---|---|---|---|---|
| 1 | Key the turn cap to observed behaviour: give a turn the 900 s cap once it opens a workflow, not only when its row id is in `G2_PROMPTS` | 48 raw cap exits, all `fresh-*`; 0 of six `g2-*` rows cut; four sampled successes at 240-298 s | `runtime/scripts/routing-accuracy/run-command-behaviour.mjs` (`capForRow`, `CAP_MS`) | A fresh-set arm with the behaviour key: `cappedOfferRows` below 6 on OpenCode and judgeable offers above 8 |
| 2 | Record the turn's duration and kill reason on every run line | `spawnTurn` stores `exit` only; 45 of 47 capped turns have no recoverable duration | same file (`spawnTurn`, run-record assembly) | New arm lines carry `durationMs` and `capped: true`; the 47 caps become measurable |
| 3 | Make every cross-workspace health read exclude generated sweeps | 15,400 of 17,775 rows are sweeps; filtered live p95 311 ms vs unfiltered 279 ms; the sweep invents a 300 ms cliff | `runtime/lib/metrics.ts`, any reader that aggregates the folder | A reader that classifies sweeps prints n 2,375 and p95 311 on today's folder |
| 4 | Put the cascade probe's timeout below the hook budget and record a cold marker | Probe default 2,500 ms equals the 2,500 ms child kill; measured cold work 690 ms | `shared/embeddings/auto-select.ts:116-119`, `hooks/claude/user-prompt-submit.ts:160` | A sandbox cold start records probe under 750 ms and `fail_open` 0 on first prompts |
| 5 | Collapse one advisor spawn (CLI or adapter) | Three starts ≈ 111 ms = 64 percent of the uncached p50 172 ms; two removed ≈ 74 ms = 43 percent | `hooks/skill-advisor/claude/user-prompt-submit.ts`, `hooks/lib/skill-advisor-cli-fallback.ts` | The same 44-prompt probe reads median ≤ 135 ms |
| 6 | Record `probeMs` on the `unavailable` path | 664 unavailable rows at p50 0 ms hide the cold cost | `runtime/lib/metrics.ts:402` | An unavailable row carries a non-zero `probeMs`; a cold first prompt shows it |
| 7 | Time all three configured `UserPromptSubmit` hooks, or report their sum | Three commands each `timeout: 3`; only the advisor leg is timed | `.claude/settings.json`, shim | One probe running them in host order prints per-command and total wall time |
| 8 (declined) | Shorten the brief | 270.6 B mean, 219 B hard block, 99 percent full, head already capped | `runtime/lib/render.ts` | Would need a decision to drop the comment-hygiene block |
| 9 (declined) | Lower the 300 s chat cap | Four of twenty sampled successes finish at 240-298 s | runner | Would cut more completions, not save wall time |

## 12. Open Questions

1. How many of the 47 capped turns would complete under a behaviour-keyed cap? Owner: the next arm; needs per-turn durations.
2. What does a cold first prompt cost end to end? Owner: a sandbox cold start with the model unloaded.
3. What is the amortized brief over a long operator session? Owner: five prompts sharing a session id with a growing transcript.
4. What do the two non-advisor hooks add per prompt? Owner: a probe that runs all three in host order.
5. Is Claude's uncached p95 618 ms stable across builds? Owner: one 44-prompt probe rerun on the built state.

## 13. References

- Iterations: `iterations/iteration-001.md` through `iteration-008.md`; deltas `deltas/iter-001.jsonl` to `iter-008.jsonl`
- Phase 033 arm: `033-untuned-arm-arena-run/scratch/{arm-evidence.txt,summary-arm.json,arenas.txt,runs/*.jsonl,step-reader/}`
- Probes: `003-plain-chat-command-reach/scratch/hook-latency-*.json`, `004-command-meaning-matching/scratch/hook-latency-after-3.json`, `005-recommendation-contract-and-brief/scratch/hook-latency-*.json`
- Code: `runtime/scripts/routing-accuracy/run-command-behaviour.mjs`, `runtime/lib/render.ts`, `runtime/lib/metrics.ts`, `runtime/skill-advisor-cli.ts`, `hooks/lib/directive-lifecycle.ts`, `hooks/skill-advisor/claude/user-prompt-submit.ts`, `shared/embeddings/auto-select.ts`, `.claude/settings.json`
- Health records: `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`
- Prior segments: `research.md`, `research-segment-4.md`

## 14. Answered Questions

- Hook cost per prompt and budget: answered — live p95 311 ms; uncached 172/618 on Claude; no live row over 2,500 ms.
- What ended the caps and whether a runtime key helps: answered — the 300 s row-set cap; a behaviour key is the targeted lever.
- Brief bytes, tokens and the removable byte: answered — 270.6 B / ~68 tokens; nothing removable.
- Hook cost as a share of a turn: answered — 0.10-1.9 percent.
- Which instrument reports the truth and what it misses: answered — the folder with sweeps excluded; it misses cold cost, the other two hooks, and 45 capped durations.

## 15. Limitations and Confidence

- Three cells are inferred, not measured: the cold first prompt, the process-chain ceiling, and the amortized brief. Each has a confirming measurement in §9.
- The build-state health folder is not a controlled sample: it mixes runtimes, workspaces and one benchmark sweep, and 75.5 percent of real rows are Claude's.
- The process-chain share uses a 36.85 ms start cost measured in an earlier segment on this machine, not on the built state.
- The phase 033 arm ran at `b765c7a14c5`, six documentation-only commits before the reported HEAD.
- No live arm was run, so every behaviour claim is a re-reading of the committed arm.

## 16. Implementation Decision

Build ranks 1-3 as one phase before the next behaviour arm: rank 1 decides how many rows the arm can score, rank 2 makes the cap measurable, and rank 3 makes any later performance read trustworthy. Ranks 4-6 follow as a small latency-and-instrument phase. Rank 7 is a diagnostic, not a fix. Ranks 8 and 9 stay declined unless an operator reverses the directive decision or accepts fewer completions.

## 17. Convergence Report

- Stop reason: `maxIterationsReached` (8 of 8). The coverage-graph stop was blocked by `sourceDiversity`, because research SOURCE nodes carry no `quality_class` metadata; the max-iterations cap bypasses that guard, so the stop is the cap, not a convergence claim.
- Total iterations: 8
- Questions answered: 5 of 5
- Ratios: 0.83, 0.92, 0.93, 0.75, 0.70, 0.72, 0.75, 0.60; mean 0.775
- Convergence threshold: 0.05, never reached
- Divergence summary: no divergent pivots recorded
