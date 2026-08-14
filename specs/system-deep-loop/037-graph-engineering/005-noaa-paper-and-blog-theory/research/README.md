# Study 5 · noaa-paper-and-blog-theory — research folder

> **Loop / harness layer.** Study 5 of the [037 graph-engineering program](../../context-index.md) — the counterpart to the four graph-layer studies. 20-iteration deep-research run (gpt-5.6-sol high/fast, `stopReason: maxIterationsReached`). Subject: NVIDIA's Object-Oriented Agents (NOOA) paper + the 12 blogs' loop/harness first principles.

**Takeaway:** How one iteration of the loop should work. **Typed self-checking iteration returns** (a bad result becomes precise feedback, not a silent failure), **agent-curated non-authoritative memory** ("forget" = suppress, never delete), **model-callable read-only context APIs** instead of prompt-stuffing, **programmable-but-bounded LEAF tactics** (no model-side spawning), a **three-layer evaluation** architecture, and a **harness mutant corpus** shipped first. All subordinate to 036, which runs dark.

**Verdict:** DeepSeek V4 Pro **PASS-WITH-FIXES** — its program-level catch mattered most: the synthesis (inheriting from studies 1–4) framed 036 as an *existing* authority when 036 actually runs **dark** (returns the legacy result unchanged; cutover planned). That correction was applied here and propagated to the capstone.

## Read these (in order)
1. [`findings-plain-language.md`](findings-plain-language.md) — the recommendations in plain terms.
2. [`research.md`](research.md) — the full synthesis with cited evidence.
3. [`verification-deepseek-v4-pro.md`](verification-deepseek-v4-pro.md) — the independent second-model verdict + applied fixes.
4. [`resource-map.md`](resource-map.md) — the sources this study drew on.

## Provenance (machine-generated — evidence, not reading material)
`deep-research-state.jsonl` (per-iteration + route-proof records), `deep-research-config.json`, `deep-research-dashboard.md`, `findings-registry.json`, `observability-events.jsonl`, `orchestration-*.json/log`, `fanout-attribution.md`, and `lineages/<label>/` (raw fan-out: `iterations/`, `prompts/`, `deltas/`, logs).

← Back to the [program index](../../context-index.md) · [handover](../../handover.md)
