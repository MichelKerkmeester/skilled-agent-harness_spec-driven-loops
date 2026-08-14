# Iteration 8: P1 Serving and Hybrid Retrieval

## Focus
Test GraphRAG serving doctrine and when the graph must yield to vector retrieval.

## Actions Taken
Audited query routing, bounded subgraph serialization, baselines, and maintenance-cost tests.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Entity-link the query, retrieve paths or a one-to-two-hop subgraph, serialize compact provenance-bearing triples, and use community summaries for corpus themes. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:51-63]
2. **[TEXT-CLAIMED][ADOPT]** Route per question type among entity lookup, traversal, subgraph extraction, and plain vector; prewrite an evaluation set and compare with a vector-only baseline. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:165-179]
3. **[TEXT-CLAIMED][CONFIRM]** The corpus reports graph advantage for multi-hop/temporal/synthesis questions but vector advantage for simple lookup and cost, and warns against author-only benchmarks. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:161-180]
4. **[INFERENCE: question routing is itself an evaluated classifier]** A production methodology must measure route accuracy, retrieval sufficiency, citation fidelity, latency, cost, and answer quality by question family; “GraphRAG wins” globally is an invalid claim.

## Questions Answered
- Hybrid routing is canonical; graph-only serving is rejected.

## Questions Remaining
- Separate identity fusion from belief and authority.

## Ruled Out
- Whole-graph context dumps; k-hop expansion without reranking; graph-only retrieval.

## Edge Cases
- Simple lookup can regress when redundant graph context is added.

## Sources Consulted
- Fusion/LLM reference, `/kg-rag`, and benchmark cautions.

## Assessment
- New information ratio: 0.54
- Status: complete

## Reflection
Serving quality must earn the graph's ongoing maintenance cost.

## Recommended Next Focus
P2 entity resolution as a truth-maintenance boundary.
