# Study 3 · graph-arch — research folder

> **Graph layer (governance).** Study 3 of the [037 graph-engineering program](../../context-index.md). 20-iteration deep-research run (gpt-5.6-sol high/fast, `stopReason: maxIterationsReached`).

**Takeaway:** **Admission ≠ authorization.** A compiled organization-policy layer, durable context-sensitive gates, hierarchical budgets, authority-zero refusals, governance mutants, and staged promotion. A node may be structurally admitted into the graph and still be refused authority. Includes an explicit threat model and an "unexamined assumptions / missing coverage" section (issuer security, 036-capability audit, owner-disagreement, zero measurements, concurrency).

**Verdict:** DeepSeek V4 Pro **REWORK** — its findings were substantive and were applied before closeout (dropped the admission-as-authorization strawman, added the threat model, reconciled the stop-reason, dropped the false "28 mutants" precision, defined "trust-separated"/"reference-closed", softened "exact insertion point" → "proposed"). See the verification doc for the full list.

## Read these (in order)
1. [`findings-plain-language.md`](findings-plain-language.md) — the recommendations in plain terms.
2. [`research.md`](research.md) — the full synthesis with cited evidence.
3. [`verification-deepseek-v4-pro.md`](verification-deepseek-v4-pro.md) — the independent second-model verdict + applied fixes.
4. [`resource-map.md`](resource-map.md) — the sources this study drew on.

## Provenance (machine-generated — evidence, not reading material)
`deep-research-state.jsonl` (per-iteration + route-proof records), `deep-research-config.json`, `deep-research-dashboard.md`, `findings-registry.json`, `observability-events.jsonl`, `orchestration-*.json/log`, `fanout-attribution.md`, and `lineages/<label>/` (raw fan-out: `iterations/`, `prompts/`, `deltas/`, logs).

← Back to the [program index](../../context-index.md) · [handover](../../handover.md)
