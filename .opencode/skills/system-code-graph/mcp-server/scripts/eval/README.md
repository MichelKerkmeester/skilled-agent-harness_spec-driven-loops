---
title: "Eval Scripts: Seeded-PPR Retrieval"
description: "Standalone driver that measures what the seeded Personalized-PageRank ranking flag changes for an impact query."
---

# Eval Scripts

---

## 1. OVERVIEW

`scripts/eval/` holds an ad hoc evaluation driver for the code graph, not an automated test. It answers one question before a ranking flag promotion: does turning on seeded Personalized-PageRank actually move a known target caller closer to the top of a `code_graph_context` impact result. It runs against a scratch copy of the live database and never mutates the real graph.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `score-seeded-ppr-retrieval.mjs` | Seeds a `fan_in` and a `chain` call topology into a scratch DB copy, runs `buildContext()` once with `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` off and once with it on and reports whether the known target's rank improved |

## 3. VALIDATION

```bash
node .opencode/skills/system-code-graph/mcp-server/scripts/eval/score-seeded-ppr-retrieval.mjs
```

Requires a built `dist/` (`npm run build` in `mcp-server/`) and a populated `database/code-graph.sqlite`, since the driver copies that live database into a temp directory rather than building a fixture from scratch. Output is a JSON report per topology with `target_rank`, `target_surfaced` and `ranking_changed`. The report is explicitly marked preliminary and expects a re-run before any flag promotion decision.

## 4. RELATED

- [`mcp-server/README.md`](../../README.md)
- [`system-code-graph/README.md`](../../../README.md)
