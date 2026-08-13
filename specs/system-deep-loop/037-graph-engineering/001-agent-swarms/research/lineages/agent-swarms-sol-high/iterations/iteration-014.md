# Iteration 14: Dynamic Per-Run Work Graphs

## Focus

Dynamic topology is useful only if generation and change are compiled, bounded, and authorized before execution.

## Findings

1. The corpus describes work graphs that split, merge, reorder, disappear, or add nodes as evidence changes. It also names work-graph generators as a distinct production component. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:144-170]
2. AgentSwarms' published graph is pinned separately from the editable draft, providing a concrete precedent for immutable executable topology. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmPublish.ts:1-121]
3. Decision: a generator emits `WorkGraphProposalV1` against a pinned org-graph version and task/evidence digest. A deterministic compiler validates schema, acyclicity or declared loop edges, capability authorization, port compatibility, write-set safety, fan-out/depth/budget caps, gate placement, and adapter availability before sealing `GraphDefinitionV1`. [INFERENCE: generation proposes topology; compilation and 036 authorization make it executable]
4. Mid-run topology changes are append-only `GraphPatchProposalV1` operations (`add_node|add_edge|cancel_branch|replace_adapter|reorder_priority`) with precondition digest and affected frontier. Accepted patches create a new topology version; already-authorized events remain attributed to the old version. [INFERENCE: preserves replay instead of mutating the graph beneath completed nodes]
5. A work-graph generator may choose among organization-authorized roles but cannot mint capabilities, expand tool/data access, weaken gates, or raise budgets. Unknown write sets or unavailable isolation force sequential execution or rejection. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-gateway-policy-scale-and-owner-recovery/004-write-set-conflict-graphs-and-wave-safety/spec.md:124-156]
6. When not to use: prefer a static graph for repeated, well-known workflows; prefer a single loop for exploratory tasks whose decomposition cannot yet be validated. Dynamic generation is justified when task shape truly varies and constraints can still be checked mechanically. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:250-330]

## Ruled Out

- Executing generated code/topology before compilation; in-place topology mutation; generator-created authority.

## Assessment

- New information ratio: 0.82
- Novelty: separates proposal, compile, authorization, seal, and versioned patch phases.
- Questions addressed/answered: q-org-work dynamic layer.

## Recommended Next Focus

Define evidence and knowledge graph roles plus honest query routing.
