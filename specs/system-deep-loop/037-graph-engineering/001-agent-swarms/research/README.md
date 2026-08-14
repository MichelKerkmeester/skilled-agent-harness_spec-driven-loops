# Study 1 · agent-swarms — research folder

> **Graph layer (product runtime).** Study 1 of the [037 graph-engineering program](../../context-index.md). 20-iteration deep-research run (gpt-5.6-sol high/fast, `stopReason: maxIterationsReached`).

**Takeaway:** Evolve `system-deep-loop` into a graph runtime by adding a **versioned, compiled execution graph as a projection over the 036 authority plane** — the graph decides what is ready and proposes transitions; 036 stays the only authority. Extract AgentSwarms' typed node/edge core, deterministic graph-order reducers, fail-closed branches, checkpoints, evaluator nodes, and hybrid retrieval; its limits (level-wide barriers, textual loop completion, best-effort checkpoints, mutable shared state) mark where the 036 contracts must stay stronger.

**Verdict:** SOL synthesis only. This is the first study; the independent DeepSeek V4 Pro verification pass was added from study 2 onward, so there is **no `verification-deepseek-v4-pro.md` here**.

## Read these (in order)
1. [`findings-plain-language.md`](findings-plain-language.md) — the recommendations in plain terms.
2. [`research.md`](research.md) — the full synthesis with cited evidence.
3. [`resource-map.md`](resource-map.md) — the sources this study drew on.

## Provenance (machine-generated — evidence, not reading material)
`deep-research-state.jsonl` (per-iteration + route-proof records), `deep-research-config.json`, `deep-research-dashboard.md`, `findings-registry.json` / `deep-research-findings-registry.json`, `observability-events.jsonl`, `orchestration-*.json/log`, `fanout-attribution.md`, and `lineages/<label>/` (raw fan-out: `iterations/`, `prompts/`, `deltas/`, logs).

← Back to the [program index](../../context-index.md) · [handover](../../handover.md)
