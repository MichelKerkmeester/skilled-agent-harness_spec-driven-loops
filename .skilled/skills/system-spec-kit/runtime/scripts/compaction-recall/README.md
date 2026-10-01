---
title: "Compaction recall census"
description: "Zero-call census of what host compactions keep in stock summaries and recorded briefs."
trigger_phrases:
  - "compaction recall census"
  - "score-compaction-recall.mjs"
  - "compaction boundary scoring"
---

# Compaction recall census

---

## 1. OVERVIEW

`compaction-recall/` holds one operator-run script that scores what host compactions keep. It reads only the transcripts named on the command line, makes no model call and leaves hooks, settings and transcripts unchanged. The run prints one row per compaction boundary, a `totals:` line and one `stop:` line, and writes one JSON report.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `score-compaction-recall.mjs` | Parses the named transcripts, scores every compaction boundary and prints the report and the stop line. |

---

## 3. USAGE

Both required switches name the input and the report path, so the bare command refuses with `no transcripts named` and exit 2.

| Switch | Meaning | Default |
|---|---|---|
| `--transcripts <path>` | Names a transcript file, or a directory whose `*.jsonl` files are read recursively. Repeatable. | Required |
| `--out <path>` | Names the JSON report. The path must sit outside every named transcript directory. | Required |
| `--newest-compacted <n>` | Narrows directory inputs to the n newest compacted top-level `*.jsonl` files by modification time, and skips `subagents/` files. | Off |
| `--replay` | Rebuilds a missing brief from the built `compact-inject` hook module before any transcript is read. | Off |
| `--max-file-bytes <n>` | Skips a candidate larger than n bytes without reading it. | 1 GiB |

Exit status is 0 for a clean census, 1 when a session stops or the report voids itself, and 2 for a refused command line.

```bash
node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs \
  --transcripts <transcript-dir> --newest-compacted 15 --out <report.json outside the repo>
```

---

## 4. VALIDATION

Run from the repository root:

```bash
cd .skilled/skills/system-spec-kit/runtime
npx vitest run tests/compaction-recall.vitest.ts
```

Expected result: the suite passes. It covers the malformed-input and refusal exits, `--newest-compacted` selection, brief recall and replay, the free-text report guard and the stop-line verdicts.

---

## 5. RELATED

- [`Scripts`](../README.md)
- [`Spec Kit Runtime Engine`](../../README.md)
