# Iteration 3: Which instrument reports the built state's p95, and what it hides

## Focus

Answer the last unchecked key question: which latency instrument reports the built state's true p95, and which path it still misses. Chosen because iteration 1's 300 ms cliff and its 2,218 ms maximum both came from one aggregate read of the health-record folder, and neither survived a check of what that folder holds.

## Actions Taken

1. Split every duration-bearing health file into synthetic and real by shape: a file whose durations are monotone and span exactly `n-1` is a generated sweep, not prompt traffic.
2. Recomputed percentiles on the real rows only, overall, by day, by runtime and by freshness.
3. Recomputed the brief-byte figures on the real rows.
4. Read the metrics writer's rolling-window reader to see which population its rate uses, and the Claude hook's timeout constants to place the budget.
5. Tested the cold-path question by looking at what an unavailable record stores.

## Findings

1. **The health folder is mostly synthetic: 15,400 of 17,775 duration rows (86.6 percent) sit in 77 generated sweeps.** Each sweep file holds 200 rows whose durations rise by exactly one from 101 to 300 ms inside a single minute, the shape of a timing harness, not of prompts. Filtering the 77 sweep files leaves 2,375 real rows across 381 files. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

2. **Real built-state hook cost is p50 12 ms, p95 279 ms, p99 735 ms, max 2,218 ms over all 2,375 real rows; live-only it is p50 124, p95 311, p99 757, max 1,538 ms.** The all-row median is depressed by 664 `unavailable` rows and 693 `skipped` rows that record almost no work. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:402]

3. **Correction to iteration 1: the 300 ms cliff was the sweep's ceiling, not a deadline.** The 4,674 rows spread across 240-299 ms are the top of each 101-300 ms synthetic sweep (60 rows per file across 77 files), and no real row set shows a cut at 300 ms. Iteration 1's findings 4 and 5 are withdrawn as an instrument artifact; the real distribution has a smooth tail to 1,538 ms. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

4. **The 2,218 ms maximum is an `unavailable` row, not a delivered brief.** `freshness: unavailable` rows (664) have p50 0 ms and p95 2 ms, and the single 2,218 ms row is one of them; every live row is at or below 1,538 ms. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

5. **The instrument cannot show a cold-start cost, because the fail-open path is recorded as zero work.** An unavailable prompt stores 0 ms rather than the time spent probing a cold daemon, so the one population where a cold start would appear is the population that reports no elapsed time. What would confirm a cold cost: a record that stamps the probe's own elapsed time before writing `unavailable`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:402] [INFERENCE: based on the 664 unavailable rows at p50 0 ms and the writer's rounded durationMs]

6. **Coverage is Claude-dominated, so a "built-state p95" is effectively Claude's p95.** Real rows by runtime: claude 1,794 (75.5 percent), pi 272, dsh 131, devin 117, vibe 49, codex 12, cursor 0. The per-runtime p95s differ (claude 292, dsh 243, devin 230, pi 179, vibe 742), and only Claude and Vibe have enough rows to read a tail. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

7. **Live p95 uses 12.4 percent of the Claude budget and p99 uses 30.3 percent.** Live p95 311 ms against the 2,500 ms hook timeout is 12.4 percent; live p99 757 ms is 30.3 percent; the worst live row 1,538 ms is 61.5 percent. No live row in 1,695 exceeded the budget. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl] [SOURCE: .skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:160]

8. **Brief cost is unchanged on the real rows: 1,234 briefs, mean 270.6 bytes, p50 262, p95 316, max 361.** Briefs carry `emittedBytes` only on real prompts, which is why the filtered and unfiltered brief figures agree to a tenth of a byte. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

9. **A repo-wide read of the folder reports the sweep, while the product's own rate does not.** The rolling rate reads only a workspace's last 30 records, so a real workspace is unaffected; but any cross-workspace aggregate — a doctor report, a research read, an operator's `jq` — reports the synthetic shape unless it filters by file or runtime. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:482-492]

## Ruled Out

- Reading the folder's raw percentiles as hook cost: 86.6 percent of the rows are generated. Any future measurement must filter sweeps or read a single workspace.
- Treating the 2,218 ms maximum as a live-path worst case: it is an unavailable row, and the live maximum is 1,538 ms.
- Measuring cold-start cost from the current record: the unavailable path records 0 ms by construction, so the record cannot carry it.

## Dead Ends

- Separating sweeps from real rows by timestamp: both land in the same minutes, so shape (monotone, exact span, 200 rows) is the only reliable discriminator.
- Using `freshness: stale` (13 rows) as a cold indicator: stale rows have p50 374 ms, but the population is too small and marks a stale brief, not a cold daemon.

## Edge Cases

- Ambiguous input: none; KQ5 was the only unchecked question.
- Contradictory evidence: iteration 1's cliff and this iteration's flat tail directly conflict. The conflict is resolved in favour of the filtered set because the sweep shape is verifiable (monotone 101-300, 200 rows per file) and the plateau decomposes into exactly the top 60 rows of each sweep.
- Missing dependencies: no cold-start marker exists in the record; recorded as an instrument gap rather than an unmeasured value.
- Partial success: all five actions produced evidence. Status is `insight` rather than `complete` because the iteration's main result is the withdrawal of a prior finding and a re-reading of the same evidence, not new external data.

## Sources Consulted

- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl` (458 duration-bearing files; 77 sweep files and 381 real files)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:384-402, 482-492`
- `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:160, 222-223`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/performance-5/iterations/iteration-001.md`

## Assessment

- New information ratio: 0.93
- Questions addressed: KQ5 (which instrument, and what it misses)
- Questions answered: KQ5

## Reflection

- What worked and why: testing the shape of the evidence before aggregating it caught a defect that two prior segments and iteration 1 all missed. The monotone 101-300 sweep is not a plausible prompt distribution, and one shape test separated it.
- What did not work and why: iteration 1 trusted a folder-wide percentile. The failure was not arithmetic but provenance — it never asked which rows produced the number.
- What I would do differently: for any metric read from a shared folder, first classify rows by source shape, then compute.

## Recommended Next Focus

Iteration 4: no key question remains unchecked. Spend the pass on the one action that would make the perf lane's numbers durable — specify a sweep-excluding health read and a cold-path elapsed field, each with the file and the one measurement that would confirm it, then converge.
