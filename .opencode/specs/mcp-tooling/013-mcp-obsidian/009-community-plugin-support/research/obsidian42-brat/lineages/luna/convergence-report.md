---
title: "BRAT detached research convergence report"
description: "Terminal report for the luna fan-out lineage."
---

# Convergence Report

- Loop: `research`
- Session: `fanout-luna-1785675410437-3ctuwx`
- Executor requested: `cli-codex model=gpt-5.6-luna`
- Artifact root: this lineage directory
- Stop policy: `max-iterations`
- Configured maximum: 5 iterations
- Completed iterations: 5
- Stop reason: `maxIterationsReached`
- Early convergence: telemetry only; no early synthesis

## Question coverage

The reducer tracked five core questions. All five were answered by the fifth iteration:

1. Exact persisted `data.json` schema and defaults.
2. Complete BRAT command surface and side effects.
3. Release/root asset selection, validation, vault paths, and enablement.
4. Safe file-layer AI workflows, including frozen release pins.
5. Error catalog, private repositories, troubleshooting, and recipes.

## Novelty telemetry

`newInfoRatio` by iteration: `1.00`, `0.88`, `0.93`, `0.94`, `0.78`.

The final pass intentionally closed command and install-mechanics gaps after earlier passes appeared convergent. The resulting knowledge base covers the core file-layer contract; residual uncertainty is limited to modal-only UI microcopy and source branches unavailable through the cached source fetch.

## Evidence and execution notes

Evidence is recorded in `iterations/`, `deltas/`, `findings-registry.json`, and `resource-map.md`. Sources include BRAT repository source, TfTHacker's BRAT documentation, Obsidian manifest/release documentation, and bounded troubleshooting references.

The requested nested `cli-codex` executor failed before session initialization with an OS `Operation not permitted` error. The manager recorded the dispatch failure and used the workflow's native deep-research leaf-dispatch path for each iteration, preserving the same iteration artifact, route-proof, delta, reducer, and synthesis contracts. No output was written outside this lineage artifact root.

## Gate results

- Iteration verification: passed for iterations 1 through 5.
- Reducer: completed with 5 iterations and 5 resolved core questions.
- Resource map: emitted.
- Canonical synthesis: `research.md` emitted.
- Completion state: ready for lineage lock release.
