# Graph Engineering — Reference Guides

Curated reference documents derived from the 20-iteration deep-research run on this packet (synthesis: [`research/research.md`](../research/research.md)). Each guide is grounded in the cited sources (corpus, runtime code, iteration evidence) and ends with its own Sources section.

| Guide | What it gives you |
|---|---|
| [`01-graph-engineering-primer.md`](01-graph-engineering-primer.md) | What graph engineering IS: typed state, node contracts, governed edges, subgraphs, checkpointing, control-vs-work graphs, knowledge-graph vs task-graph, glossary. |
| [`02-loops-vs-graphs-decision-guide.md`](02-loops-vs-graphs-decision-guide.md) | When to use graphs and when not to: the complexity × concurrency decision matrix, cost arguments, and validation against our seven workflow modes. |
| [`03-graph-primitives-and-snippets.md`](03-graph-primitives-and-snippets.md) | Concrete primitives with real snippets: typed state schemas, node/edge vocabulary (graphEvents), admission routing, budgets, fan-out/fan-in, checkpointing. |
| [`04-reference-implementations.md`](04-reference-implementations.md) | Deep dives: GraphARC (executable governance wrapper), LangGraph (primitives), graph-engineering-master (documentary skill package), comparison table, lessons. |
| [`05-deep-loop-to-graph-mapping.md`](05-deep-loop-to-graph-mapping.md) | Mapping OUR system-deep-loop onto graph engineering: concept map, authority boundaries, hybrid architecture, four-phase migration, parity gates, current blockers. |

Suggested reading order: 01 → 03 → 04 → 02 → 05. For the full evidence trail (all 20 iterations, deltas, registry), see [`research/`](../research/).
