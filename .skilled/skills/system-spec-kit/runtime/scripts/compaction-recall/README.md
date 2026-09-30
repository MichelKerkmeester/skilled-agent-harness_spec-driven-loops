---
title: "Compaction Recall Census"
description: "Zero-call census of what host compactions keep, scored from the transcripts an operator names."
trigger_phrases:
  - "compaction recall census"
  - "score compaction recall"
  - "compaction boundary report"
---

# Compaction Recall Census

---

## 1. OVERVIEW

`compaction-recall/` holds one operator-run script. `score-compaction-recall.mjs` reads Claude Code transcript files the operator names, finds every compaction boundary, and scores what the stock summary and the session-prime brief kept from the segment before that boundary. It makes no model call.

Current state:

- One ESM module with a CLI entry point and exported functions the sibling test suite calls directly.
- Every run writes one JSON report to a path outside the named transcript directories, and prints row lines, totals and one `stop:` line to stdout.
- The fit is a port of the compaction procedure vendored in `jevctl` 0.2.3, so the `fit` column names the stage that procedure would reach on the same segment.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `score-compaction-recall.mjs` | Argument parsing, transcript parsing, the compaction fit port, the must-survive rules and the report. |

The module is laid out in named zones: imports, constants, estimator port, messages and reduction, must-survive rules, transcript parser, session selection, report and main.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Model calls | None. Token counts come from the local estimator in this file. |
| Reads | Only the paths given to `--transcripts`, plus the built hook module when `--replay` is set. |
| Writes | Only the `--out` report file. A report path inside a named transcript directory is refused. |
| Report content | Counts, scores, labels, file basenames, boundary uuids and line numbers. A report carrying any other string voids the run before anything is printed or written. |
| Exit codes | `0` clean, `1` stopped or void, `2` refused command line. |

Main flow:

```text
named transcripts (*.jsonl)
              │
              ▼
splitLines -> parseTranscript      boundary rows, recall windows, uuids
              │
              ▼
collectToolCalls -> fitState       fit stage and fit token count
              │
              ▼
must-survive rules 1 to 5          kept counts for summary and brief
              │
              ▼
stopLine -> formatRow              stdout rows, totals, stop line
              │
              ▼
hasFreeText -> --out report        one JSON report
```

Each boundary opens a recall window over the next 30 parsed records, long enough for the stock summary and the hook brief to arrive. With `--replay`, the raw text of the last 50 non-empty lines read before the boundary rides on the window, so a brief that never arrived is rebuilt from the built hook module and marked `replayed`.

---

## 4. MUST-SURVIVE RULES

| Rule | Items found in the segment before the boundary | Counted as kept |
|---|---|---|
| r1 | Identifiers that also appear after the boundary | Whole identifier in the keeper text |
| r2 | Basenames of files written by Write, Edit, MultiEdit or NotebookEdit | Substring match |
| r3 | The most frequent project path reference, reduced to its last segment | Substring match |
| r4 | Identifiers of the last user instruction | Whole identifier, or `uncheckable` when the segment offers no instruction |
| r5 | The preserved segment uuids against every uuid in the file | `ok`, `fail` or `absent` |

Two keepers answer each of rules 1 to 4: the stock compact summary and the session-prime brief. `summary_recall` and `brief_recall` are kept over found across rules 1 to 4, and `violations` counts the items the summary lost plus one for a broken r5.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node score-compaction-recall.mjs --transcripts <path...> --out <path>` | CLI | Runs the census over the named files or directories. |
| `--newest-compacted <n>` | CLI flag | Selects the n newest compacted main-session files by modification time instead of walking every named path. |
| `--replay` | CLI flag | Answers a missing brief from the raw lines before the boundary, and stamps each such row with the build time of `../../dist/hooks/claude/compact-inject.js`. A missing build refuses the run. |
| `--max-file-bytes <n>` | CLI flag | Ceiling above which a candidate file is skipped unread. Defaults to 1 GiB. |
| `main(argv, hooks)` | Function | Runs the census end to end and returns the exit code. A `beforeGuard` hook receives the complete report just before the free-text guard. |
| `parseTranscript`, `splitLines` | Function | Parse one transcript, or stream its lines split on newline bytes only. |
| `collectToolCalls`, `fitState`, `estimateTokens` | Function | Tool call pairing, the fit port and its token estimator. |
| `formatRow`, `stopLine`, `hasFreeText` | Function | Row rendering, the stop verdict and the free-text guard. |

Rows report an `n/a` value wherever a field has no answer, and the stop line is one of `census void`, `no boundaries`, `arm not built` or `arm may be specified`.

---

## 6. VALIDATION

Run from `.skilled/skills/system-spec-kit/runtime`:

```bash
npm test -- --run tests/compaction-recall.vitest.ts
```

Expected result: the suite passes. Its fixtures are synthetic and live in `tests/compaction-recall-fixtures/`, so the run needs no real transcript.

---

## 7. RELATED

- [`Scripts`](../README.md)
- [`Runtime`](../../README.md)
- [`Compaction recall tests`](../../tests/compaction-recall.vitest.ts)
