# 016/004 Evidence Index

> Navigation aid. Read this first to find specific data without scanning all 17 evidence files.

## Embedder comparison + leaderboard

| File | What | Source |
|---|---|---|
| `embedder-comparison.csv` | Per-embedder baseline scores (cat-24/402, /408, /409 raw recall) — 6 embedders, no rescue layer | 016/004 swap sweep |
| `embedder-comparison-with-rescue.jsonl` | Final 3 rows with rescue layer ON (jina-v3 9/10, gemma 7/10, nomic 8/10) — basis for ADR-012 | codex job `boa26jubw` |
| `cat-24-rerun.jsonl` | Per-pair top-3 data across the 6 embedders + fixture revisions | swap sweep + post-surgery reruns |
| `cat-24-409-audit.md` | Fixture audit (broken-ground-truth investigation, surgery recommendations) | audit dispatch |
| `swap-benchmark.csv` | Wall-clock for each embedder swap job | per-swap ADR rows |

## Rescue layer cost/benefit

| File | What | Source |
|---|---|---|
| `d-sample-30.json` | 30-scenario stratified sample composition for the ON/OFF sweep | D-sweep dispatch |
| `d-rescue-on-vs-off.jsonl` | Per-scenario rows: rescue ON vs OFF, top-3 hits + latency | D-RETRY commit `e964ba505` |
| `d-rescue-layer-cost-benefit.md` | Aggregate verdict: ON closes 24/409 (4/10 → 8/10) + +2.16× latency | ADR-011 source |
| `008-pass-sample-rerun.jsonl` | 50-scenario 008 regression check with rescue default-on (50/50 PASS) | commit `a01b3be01` |

## Runtime measurements

| File | What | Source |
|---|---|---|
| `jina-runtime-measurements.md` | Live RAM / Metal / latency for jina-v3 / nomic / gemma | this-session ollama probes |
| `ollama-direct-embed-probe.txt` | Earlier per-model probe outputs | initial swap exploration |
| `baseline-disk.txt` + `post-failure-disk.txt` | Disk-usage snapshots before/after the mxbai failure | mxbai swap (ADR-001) |
| `baseline-process.txt` + `post-failure-process.txt` | Process-tree snapshots same | mxbai swap (ADR-001) |

## Closure of 008 cat-24/409

| File | What | Source |
|---|---|---|
| `corpus-hygiene-cleanup.md` | Orphan-row prune + fixture-version notes | post-surgery commit `ef8a00b6e` |
| `mxbai-swap-status.json` | First-swap snapshot (mxbai 2/10 FAIL, ADR-001 ROLLBACK) | early swap |
| `mcp-notes-drift-audit.md` | MCP-config JSON sweep (tool count 39 → 42 + embedder layer) | commit `19bd78000` |

## How to read

- **Question: "which embedder won?"** → `embedder-comparison-with-rescue.jsonl` + `decision-record.md` ADR-012
- **Question: "is rescue layer worth the latency?"** → `d-rescue-layer-cost-benefit.md` + ADR-011
- **Question: "what does jina cost at runtime?"** → `jina-runtime-measurements.md`
- **Question: "why was the fixture broken?"** → `cat-24-409-audit.md` + ADR-009
- **Question: "did 008 regress?"** → `008-pass-sample-rerun.jsonl` (50/50 preserved)

## Related evidence elsewhere

- `../../../020-deep-review-016-019-stack/review/review-report.md` — adversarial review of the 016-019 stack (pending; in-flight as of 2026-05-17 evening)
- `../../../018-code-embedder-coderank/001-cocoindex-swap/evidence/reindex-execution-results.md` — CocoIndex side activation evidence
- `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` — canonical narrative covering both MCPs

## Last updated

2026-05-17. Add new rows when evidence files are added or fundamentally revised.
