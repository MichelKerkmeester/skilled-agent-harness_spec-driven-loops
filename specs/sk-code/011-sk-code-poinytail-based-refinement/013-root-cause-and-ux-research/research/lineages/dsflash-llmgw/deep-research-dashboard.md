---
title: "Deep Research Dashboard — Root causes and external-user experience (dsflash-llmgw lineage)"
trigger_phrases: []
---
# Deep Research Dashboard — Root causes and external-user experience (dsflash-llmgw lineage)

## Lifecycle

- Status: complete
- Session: `fanout-dsflash-llmgw-1791657639979-xxbomr`
- Executor: `cli-pi` / `deepseek-v4.1-flash` / `max`
- Iterations: 10 / 10
- Stop policy: `max-iterations`
- Convergence threshold: `0.05` (telemetry only; never approached — mean newInfoRatio 0.82)
- Terminal reason: `maxIterationsReached`

## Iterations

| Iteration | Focus | Status | newInfoRatio | Findings |
|---:|---|---|---:|---:|
| 1 | Packet map, process error (a) `$'` replacement pattern, link-scan class (b) | complete | 0.90 | 6 |
| 2 | Process errors (c)-(e), generated-artifact drift (f), version collision (g) | complete | 0.85 | 6 |
| 3 | Test and canary cluster: jev deferral, LIVE_CORPUS_SIZE, manifest failures | complete | 0.90 | 5 |
| 4 | Advisor battery, path-owner pull, unpassed `--surface-hint` | complete | 0.85 | 5 |
| 5 | 36 HVR hard blockers; 500 ms hook deadline without a late-write test | complete | 0.88 | 4 |
| 6 | Reducer dedup: 146 of 499 review folders, none raised | complete | 0.90 | 4 |
| 7 | External-user lens: setup, artifacts, half-applied recovery | complete | 0.82 | 5 |
| 8 | External-user lens: versions, slow hosts, routing, error messages | complete | 0.80 | 5 |
| 9 | Known-Limitations sweep: resolved exclusions vs residuals | complete | 0.70 | 5 |
| 10 | Consolidation: eight ranked phases with the restraint check | complete | 0.60 | 8 |

## Questions

- Answered: 10 of 10 (Q1-Q10)
- Open: none
- UNKNOWN incidents with settling artifacts named: 3 ((b) validator run, (c) rm session, (d) introducing commit)

## Outputs

- Synthesis: `research.md` (executive summary, three parts, ranked findings, rejected ideas, eight phases, convergence report)
- Findings registry: `findings-registry.json` (10 resolved questions, 15 key findings, 3 unknowns)
- Resource map: `resource-map.md`
- Iteration records: `iterations/iteration-001.md` to `iteration-010.md`; `iteration-0NN-record.json`; `deltas/iter-0NN.jsonl`
- State: `deep-research-state.jsonl` (config row + 10 iteration rows + synthesis event), all iteration rows written through the append gateway

## Phase candidates (ranked)

1. Pass `--surface-hint` at the advisor call site
2. De-pin the hub count in the compiled-route manifest test
3. Re-pin `LIVE_CORPUS_SIZE` to 86 and rerun the baseline report
4. Remove the stale `jev-transport-single` case
5. Give the pi ambiguous-branch denial a next step
6. Surface the git-hooks trust state
7. Pin the late-write loss with one test
8. Align the Node floor
