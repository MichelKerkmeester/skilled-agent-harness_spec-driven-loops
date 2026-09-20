# Tasks: Pi Remote Experience Parity Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## P0 Tasks

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T001 | Validate fan-out config against the executor schema | [x] | parse + expand + preflight OK |
| T002 | Run lineage 1 (codex gpt-5.6-luna max) to 20 iterations | [x] | 20 iterations, synthesis_complete, research.md 794 lines |
| T003 | Run lineage 2 (pi deepseek-v4-flash) to 20 iterations | [x] | 20 iterations, synthesis_complete, research.md 177 lines |
| T004 | Synthesize both lineages (SOL high) into research/research.md | [x] | research/research.md 1079 lines, all 8 axes |

## P1 Tasks

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T005 | Generate packet metadata and pass strict validation | [x] | description.json + graph-metadata.json present; validate.sh --strict |
| T006 | Record the containment false-positive on the pi lineage | [x] | implementation-summary.md current-state note |

## Notes

- The pi lineage was flagged `failed` by the runtime containment guard (paths: null) due to concurrent daemon/other-session churn; its 20-iteration output survived on disk and is included in the synthesis.
