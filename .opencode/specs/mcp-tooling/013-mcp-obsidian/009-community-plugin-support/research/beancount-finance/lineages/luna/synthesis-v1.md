# Synthesis receipt — lineage `luna`

## Inputs consumed

- Five complete iteration records and five delta streams.
- Plugin source at ref `2.3.1`.
- Official Beancount v3 packaging plus language/inventory/validation documentation.
- Current beanquery grammar/source/function/test files and beanprice CLI/README.

## Synthesis decisions

1. Treat vault text and include reachability as the accounting source of truth.
2. Treat `data.json` as plugin settings/runtime state only.
3. Separate plugin-confirmed behavior from operational AI workflows marked `[INFERENCE: ...]`.
4. Report the unavailable compiled `main.js` as an evidence gap instead of reconstructing it as fact.
5. Keep convergence telemetry non-terminating: all five iterations ran because the configured stop policy is `max-iterations`.

## Canonical output

`research.md` is the handoff artifact. It contains the exact settings/defaults, commands, structured file graph, Beancount directive semantics, bean-query/bean-price invocation contracts, BQL recipes, dashboard mapping, UI/file workflows, error catalog, CSV import/reconciliation workflow, AI recipes, sources, and limitations.
