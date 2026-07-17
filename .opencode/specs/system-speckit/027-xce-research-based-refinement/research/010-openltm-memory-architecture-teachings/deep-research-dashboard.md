# Deep-Research Dashboard — 010 OpenLTM memory-architecture teachings

**Lineage:** 2026-06-08-010-openltm-teachings · generation 1 · executor cli-opencode openai/gpt-5.5-fast variant=xhigh read-only

## Summary

- Iterations completed: **15** (001-015) · status: 13 insight, 2 complete
- Total teachings: **81** · total tokens: **1,522,895** · cost: 0 (OpenAI oauth subscription)
- Headline verdict tallies (one per teaching): ADOPT 20, ADAPT 41, REJECT 15, DEFER 5

## Novelty by round (convergence signal)

| Round | Iters | avg newInfoRatio | teachings |
|---|---|---:|---:|
| R1 breadth | 001-005 | 0.67 | 26 |
| R2 breadth | 006-010 | 0.61 | 28 |
| R3 doc-fit | 011-015 | 0.64 | 27 |

## Iterations

| Iter | Round | Focus | Status | Teachings | newInfoRatio | tokens |
|---|---|---|---|---:|---:|---:|
| 001 | R1 breadth | Hybrid recall + blended scoring + explainability           | insight | 5 | 0.70 | 93,394 |
| 002 | R1 breadth | Importance-weighted decay (half-life tiers + materialized  | insight | 5 | 0.62 | 91,909 |
| 003 | R1 breadth | Janitor background-maintenance pipeline (promotion + dedup | insight | 6 | 0.72 | 102,477 |
| 004 | R1 breadth | Lifecycle hooks + context-injection envelope               | insight | 5 | 0.66 | 95,251 |
| 005 | R1 breadth | Typed knowledge graph + BFS conflict detection             | insight | 5 | 0.64 | 102,963 |
| 006 | R2 breadth | Secret redaction before write                              | insight | 5 | 0.68 | 107,290 |
| 007 | R2 breadth | Provenance + audit chain                                   | insight | 6 | 0.66 | 95,248 |
| 008 | R2 breadth | Embedding provider abstraction + graceful degradation      | insight | 6 | 0.58 | 105,685 |
| 009 | R2 breadth | Schema/DB design + migration discipline                    | insight | 6 | 0.55 | 142,818 |
| 010 | R2 breadth | learn() idempotency + cross-plugin write contract          | complete | 5 | 0.60 | 94,338 |
| 011 | R3 doc-fit | Unit-of-memory & storage-model contrast (transfer filter)  | insight | 5 | 0.72 | 134,288 |
| 012 | R3 doc-fit | OpenLTM document/continuity surface vs our continuity ladd | insight | 6 | 0.64 | 82,292 |
| 013 | R3 doc-fit | Re-test row-write teachings under the doc lens             | insight | 5 | 0.58 | 80,881 |
| 014 | R3 doc-fit | Indexing & freshness for an authored-doc corpus            | insight | 6 | 0.66 | 115,255 |
| 015 | R3 doc-fit | Hooks & automation philosophy — auto-mine vs deliberate sa | complete | 5 | 0.60 | 78,806 |

## Method note

Orchestrator-driven parallel fan-out (width 5, two batches): each iteration dispatched a fresh READ-ONLY `cli-opencode openai/gpt-5.5-fast --variant xhigh` analyst scoped to one OpenLTM subsystem; the orchestrator wrote every iteration/delta/state artifact (Gate-3-safe). Synthesis + adversarial verification produced `research.md` and `sub-packet-proposals.md`.
