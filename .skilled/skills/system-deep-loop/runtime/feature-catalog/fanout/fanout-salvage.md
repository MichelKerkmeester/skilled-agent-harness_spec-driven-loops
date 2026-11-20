---
title: "Fan-out write-failure salvage"
description: "Post-subprocess salvage that recovers missing or empty iteration `.md` files from captured subprocess stdout (opencode `--format json` text parts or raw fallback)."
trigger_phrases:
  - "fan-out write-failure salvage"
  - "fanout-salvage.cjs"
  - "salvage fanout lineage"
  - "recover iteration from stdout"
  - "salvaged_from_stdout event"
version: 1.4.3.0
---

# Fan-out write-failure salvage

---

## 1. OVERVIEW

After a CLI lineage subprocess exits, some executors (weak CLIs, sandboxed write
restrictions) may not have written their iteration `.md` files. `runSalvageSweep` reads the
lineage state log to discover which iterations completed (`type == 'iteration'` records),
checks each expected `iteration-N.md`, and for missing or empty files: calls
`extractTextFromOpencodeJson` on the saved stdout (concatenates opencode
`{type:"text",part:{text:...}}` JSONL lines; falls back to raw stdout ≥50 chars), writes the
recovered text and appends a `salvaged_from_stdout` JSONL event to the state log. When no
content is recoverable, writes a `fanout_salvage_failed` HTML comment placeholder.

### Why This Matters

Proven mandatory from the packet-122 prototype: weak CLI executors intermittently fail to
write output files. Without salvage, those lineages contribute nothing to the final merge.

---

## 2. HOW IT WORKS

Fully shipped in `fanout-salvage.cjs`. Exports only, no CLI entry point —
`runSalvageSweep`, `extractTextFromOpencodeJson`, the provider cost readers
`sumProviderCostFromLog`, `readLineageProviderCostUsd` and `summarizeProviderCost`, and the pass
readers `passEvidence`, `readLineageCommits` and `readLineagePassSummary` — making it fully
testable via `require()`. `STATE_LOG_BY_LOOP_TYPE` maps `research` → `deep-research-state.jsonl`
and `review` → `deep-review-state.jsonl`.

### Claude stream-json Logs

A `cli-claude-code` lineage runs with `--output-format stream-json --verbose`, so its log is one
JSON event per line. `extractTextFromOpencodeJson` reads such a log's final answer: the last
`result` event's text, or, when the stream ended before any result, the top-level assistant
text written so far. It returns that answer when it is longer than 50 characters and never the
raw event stream. Opencode text parts still come first, and a log that is neither keeps the raw
fallback.

### Provider Cost

The cost readers cover both log shapes. An opencode log's cost is the sum of its `step_finish`
costs. A claude log's cost is the last `result` event's `total_cost_usd`, because that total is
cumulative over the session and one attempt is one session, so summing every result would count
it twice. A lineage's cost adds up its live and rotated logs. A log with no cost record reads as
null, and the run total stays null while any lineage is null.

### Pass Evidence

`passEvidence(log, commits)` judges each committed pass from the runner's own log instead of the
row the model wrote. A pass is the tool calls between the previous gateway commit and its own;
the run-start commit only opens the first window. Calls are timed from opencode events
(epoch ms, placed by the call's start time) or claude assistant events (ISO stamps). A shell
call counts as a source read when one of its commands prints or searches files. Each pass row
carries `toolCalls`, `sourceReads`, `commitGapMs`, `skewMs` (the row's stamp minus commit time),
`findings`, `unexamined` and `reasons`. A pass is `unexamined: true` for any of these reasons:

| Reason | Condition |
|---|---|
| `future_stamp` | The row's stamp is later than the gateway commit |
| `no_reads_no_findings` | No source read and zero findings |
| `batched_commit` | Committed under 15 s after the previous commit with no tool call between |

A log with no timed event, such as a plain-text log, cannot place a call in a pass, so its
counts are null rather than zero, and a pass no rule flags reads as `unexamined: null`, not
clean, while a count it needs is unknown.

`readLineageCommits(lineageDir)` reads the lineage's gateway frames from
`deep-research-ledger/frames` or `deep-review-ledger/frames`: the run start, and each iteration
row with its commit time, its stamp and its findings count. The stamp is the model's claim: the
row's `claimedTimestamp`, else its own `timestamp`, else the event's `occurred_at`. The gateway
keeps a research row's stamp as `claimedTimestamp`, and a review frame keeps the model's record
whole, so both are judged by the stamp the model wrote. A frame with neither falls back to the
event time. A torn frame is skipped.
`readLineagePassSummary` feeds the fan-out progress row. It judges every lineage log on disk
plus the running attempt's stdout, and returns `iterations` (distinct committed iterations),
`lastCommitAt` and `flaggedPasses`. `flaggedPasses` is null while any pass cannot be judged, and
one untimed attempt log, such as a plain-text log from an older run, leaves every pass's call
counts unknown.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-salvage.cjs` | `extractTextFromOpencodeJson`, `runSalvageSweep`, `STATE_LOG_BY_LOOP_TYPE`, `sumProviderCostFromLog`, `readLineageProviderCostUsd`, `summarizeProviderCost`, `passEvidence`, `readLineageCommits`, `readLineagePassSummary` |
| `scripts/lib/cli-guards.cjs` | `readClaudeStreamFinalText`, the final-answer reader the salvage shares with the pending-question and quota checks |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-salvage.vitest.ts` | 11 tests: `extractTextFromOpencodeJson` (5: null input, opencode JSON parts, raw fallback, too-short fallback, non-text JSON skipped); `runSalvageSweep` unit (5: no state log, all files present, salvage from opencode stdout, failed marker when no content, mixed present/missing); coverage-graph per-sessionId isolation (1) |
| `tests/unit/fanout-claude-stream-json.vitest.ts` | Claude stream-json argv, last-result provider cost, final-answer salvage, and the pending-question and quota checks reading the final answer |
| `tests/unit/fanout-pass-evidence.vitest.ts` | `passEvidence` windows and the three `unexamined` reasons, claude event timing, unknown counts for an untimed log, and `readLineageCommits` / `readLineagePassSummary` on research and review frames |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Catalog source: `feature-catalog/fanout/fanout-salvage.md`
- Primary source files: `scripts/fanout-salvage.cjs`
Related references:
- [fanout-run.md](../../feature-catalog/fanout/fanout-run.md) — Fan-out CLI lineage driver
- [fanout-merge.md](../../feature-catalog/fanout/fanout-merge.md) — Fan-out cross-lineage merge
