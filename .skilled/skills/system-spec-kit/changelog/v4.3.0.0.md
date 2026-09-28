---
title: "system-spec-kit v4.3.0.0, Measure What Compaction Keeps"
description: "A new census scores what host compactions keep in the stock summary and the recovered-context brief, and whether a deletion pass could fit these sessions at all, with zero model calls."
trigger_phrases:
  - "system-spec-kit v4.3.0.0"
  - "system-spec-kit 4.3.0.0"
  - "compaction recall census"
importance_tier: "normal"
contextType: "general"
version: 4.3.0.0
---
# v4.3.0.0, Measure What Compaction Keeps

Before anyone builds a model pass that deletes tool results from a compacting session, there is now a way to measure whether it could work. `score-compaction-recall.mjs` reads the transcripts an operator names and scores every compaction: what the host's summary kept, what the recovered-context brief kept and whether the vendored fit could hold the history at all. It calls no model and changes no hook, setting or transcript.

> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness` (Level 1)

## What's New at a Glance

- **One stop line decides the next step.** The census ends with `arm not built`, `arm may be specified`, `no boundaries` or a void line, worked out from how often the fit fails, how much a head cut could save and how many tokens stay against the host's own.
- **Both keepers are scored the same way.** Five must-survive rules count what the stock summary and the recorded brief each kept: identifiers used after the compaction, files written before it, the bound spec folder, the last instruction and the preserved segment.
- **The report holds no transcript text.** It carries counts, scores, labels, file basenames, boundary ids and line numbers, and a guard voids the run before any other text could be printed or written.
- **`--newest-compacted <n>` picks the sessions.** It takes the newest main-session files that hold a compaction, and `--replay` rebuilds a brief only where none was recorded.

## Upgrade

No migration required. Nothing runs the census on its own. An operator starts it by hand.
