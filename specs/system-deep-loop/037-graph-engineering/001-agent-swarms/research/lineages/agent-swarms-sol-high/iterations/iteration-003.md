# Iteration 3: Deterministic Reducers and Fail-Closed Branches

## Focus

This pass tested AgentSwarms' concrete fan-in and branch-pruning mechanics against the proposed IR and 036 evidence requirements.

## Findings

1. AgentSwarms stages a level's writes, combines same-key values with `last|first|concat|sum`, and commits in graph level order rather than response order. That prevents wall-clock races from changing outputs. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:103-174]
2. Decision: reducer specs must declare input/output schema, algebraic properties (`associative`, `commutative`, `idempotent`), empty-input behavior, partial-input policy, and ordering basis. `first`/`last` are legal only with a canonical graph order; numeric `sum` must consume typed numbers, not extract digits from arbitrary strings as AgentSwarms does. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:111-132] [INFERENCE: typed ports make string-scraping reducers unnecessary and safer]
3. AgentSwarms kills untaken edges and cascades skips only when every incoming route to a node is dead, preserving a reconvergent diamond when one branch survives. This should become a deterministic `edge.deactivated` plus derived `node.skipped` event sequence, not mutable-only executor state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:234-284]
4. Condition/router failures cannot `continueOnError`, because an unmade decision leaves mutually exclusive branches live. This is the correct default for graph control edges. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:85-101] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:1949-1967]
5. AgentSwarms improved its binary condition parser from substring matching to a fail-closed `YES|NO|null` decision, and router output must map to a declared route. The new IR should go further: classifiers emit a schema-validated enum or `GateVerdict`; routing code never parses prose. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:472-497] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:1320-1345]
6. Every reducer/branch decision should append its inputs' event IDs, adapter version, policy digest, selected edge(s), rejected edge(s), and output digest through the 036 authorized ledger, enabling exact replay and parity comparison. [INFERENCE: derived from deterministic AgentSwarms semantics plus 036 immutable correlation/causation fields]

## Ruled Out

- Commit-by-completion-order.
- Prose substring routing.
- Silent partial fan-in that does not name missing branches.
- `continueOnError` for control nodes.

## Dead Ends

Generic string reducers are insufficient once typed ports exist; they preserve backward compatibility but should remain legacy adapters only.

## Edge Cases

- Ambiguous input: ordered reducers can be deterministic without being commutative; the schema records the distinction.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: exact event names are provisional.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:85-174]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:234-284]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:472-497]

## Assessment

- New information ratio: 0.76
- Novelty: makes reducer algebra, branch failure, and skip evidence explicit IR/control contracts.
- Questions addressed: q-ir, q-scheduler, q-verdicts.
- Questions answered: deterministic merge order and fail-closed route semantics.

## Reflection

- What worked and why: AgentSwarms exposes concrete failure modes and their repairs.
- What did not work and why: generic string-based reduction conflicts with typed ports.
- What I would do differently: keep legacy reducers behind named compatibility adapters.

## Recommended Next Focus

Separate barrier readiness from pipelined readiness and define completeness/partial-failure contracts.
