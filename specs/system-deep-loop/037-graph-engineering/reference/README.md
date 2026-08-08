# Graph Engineering Reference Guides — Curated Knowledge for Governed Graph-Backed Work

Index over the five graph-engineering reference guides derived from the 20-iteration deep-research run on this packet. The depth lives in the numbered guides; this file maps each concern to its focused guide.

---

## 1. OVERVIEW

**Core Principle**: Graph structure is a governed execution aid, not an authority or audit ledger.

The guides translate the research synthesis (`research/research.md` — 20 iterations, 125 consolidated findings) into practical, self-contained references: what graph engineering is, when it pays off, the concrete primitives with real snippets, how the reference implementations actually work, and how our `system-deep-loop` maps onto all of it. Every guide preserves the underlying citations and ends with its own Sources section.

---

## 2. GUIDE MAP

Load the guide that matches the current task:

| Concern | Guide | Load When |
| --- | --- | --- |
| **What graph engineering is** — typed state, node contracts, governed edges, subgraphs, checkpointing, control-vs-work graphs, knowledge-graph vs task-graph, glossary | [01-graph-engineering-primer.md](01-graph-engineering-primer.md) | Orienting on the discipline, its terminology, and how it differs from prompt and loop engineering |
| **When to use graphs and when not to** — complexity × concurrency decision matrix, cost arguments, validation against our seven workflow modes | [02-loops-vs-graphs-decision-guide.md](02-loops-vs-graphs-decision-guide.md) | Choosing loop vs graph structure for a task, or defending a non-graph choice |
| **Concrete primitives with snippets** — typed state schemas, `graphEvents` node/edge vocabulary, admission routing, budgets, fan-out/fan-in, checkpointing | [03-graph-primitives-and-snippets.md](03-graph-primitives-and-snippets.md) | Building or reviewing graph-shaped code; mapping our runtime artifacts onto graph constructs |
| **Reference implementations** — GraphARC (executable governance wrapper), LangGraph (primitives), graph-engineering-master (documentary skill package), comparison table, lessons | [04-reference-implementations.md](04-reference-implementations.md) | Comparing real graph workflow systems, or borrowing proven patterns |
| **Mapping OUR system** — concept map, authority boundaries, hybrid architecture, four-phase migration, parity gates, current blockers | [05-deep-loop-to-graph-mapping.md](05-deep-loop-to-graph-mapping.md) | Planning graph adoption inside `system-deep-loop`; reading the 036/014 cutover context |

---

## 3. READING PATHS

- **Quick orientation**: 01 → 05 (the discipline, then our system) — the two big-picture guides.
- **Hands-on building**: 03 → 04 (primitives with snippets, then reference systems).
- **Decision making**: 02 (loops vs graphs matrix) whenever a new workflow shape is proposed.
- **Full evidence trail**: `research/research.md` (17-section synthesis), `research/iterations/iteration-001..020.md`, and `research/deep-research-state.jsonl` under [`../research/`](../research/).

---

## 4. RELATIONSHIP TO RESEARCH

The guides are derived artifacts: every substantive claim traces to the research synthesis or its sources (corpus files, runtime code, iteration evidence). The research packet itself remains the authoritative evidence trail; the guides are the readable entry points. Generated from the same packet, committed together, and versioned with it.

## 5. SOURCES

- `research/research.md` — authoritative 20-iteration synthesis (sections 1–17, Eliminated Alternatives, Divergence Map, Convergence Report)
- `research/iterations/iteration-001..020.md` — per-iteration evidence with `[SOURCE:]`/`[INFERENCE:]` markers
- `research/findings-registry.json` — consolidated findings registry (125 key findings, 5 open questions)
- `context/` — the reference corpus (GraphARC-main, graph-engineering-master, article set)
