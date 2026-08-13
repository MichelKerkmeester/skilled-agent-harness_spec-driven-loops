# Iteration 10: Loops as Typed Subgraphs

## Focus

The orientation asks for loops that remain first-class while participating in a larger graph. This pass separates subgraph boundaries from opaque prompt repetition.

## Findings

1. AgentSwarms' loop node repeatedly calls one agent with prior output and exits on a textual done signal or iteration cap; it exposes iteration events but hides the inner topology. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:1348-1387]
2. AgentSwarms also supports nested saved swarms with a depth limit, demonstrating reusable subgraphs, but returns only a final output/failure and therefore loses typed inner exit semantics. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:1765-1806]
3. Decision: `LoopSubgraphSpecV1` references an immutable child graph version plus typed input/output ports, local state namespace, reducer versions, budget partition, convergence policy, max rounds, exit-verdict schema, and parent continuation mapping. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:209-239]
4. Each round is an attempt-scoped child run. Its events remain in the 036 ledger under parent/child causation ids; the parent receives only a certified terminal verdict (`converged|exhausted|blocked|failed|cancelled`) and declared outputs. [INFERENCE: preserves independent convergence while retaining one authoritative event history]
5. Convergence must operate on a declared observation key and cumulative seen set; rejected discoveries remain seen so the loop cannot pay repeatedly to rediscover the same dead end. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:209-231]
6. When not to use: keep a simple bounded retry as a node policy when it has no independent topology, state, evidence set, or exit decision; a subgraph is justified only when the loop needs internal roles, gates, fan-out, or separately observable convergence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:4-90]

## Ruled Out

- Textual “DONE” as authoritative convergence; unbounded nesting; flattening child state into parent context.

## Assessment

- New information ratio: 0.81
- Novelty: defines the child-run boundary and terminal-verdict contract.
- Questions addressed/answered: q-loop-subgraphs core schema.

## Recommended Next Focus

Map the existing research, review, and improvement modes into distinct typed subgraph profiles.
