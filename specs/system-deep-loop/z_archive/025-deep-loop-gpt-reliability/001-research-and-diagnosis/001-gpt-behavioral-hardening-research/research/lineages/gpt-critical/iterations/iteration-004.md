# Iteration 4: NDP-Safe Orchestrate Hardening

## Focus

Re-check the prior recommendation that `@orchestrate` should dispatch `@deep` and stop.

## Findings

1. `@orchestrate` is a primary agent with single-hop delegation: only depth-0 orchestrator may dispatch leaf agents, depth-1 agents must not dispatch sub-agents, and `Orch(0) -> Sub-Orch(1) -> @leaf(2)` is explicitly illegal. [SOURCE: .opencode/agents/orchestrate.md:42-48] [SOURCE: .opencode/agents/orchestrate.md:143-149]
2. `@deep` is also a primary router whose job is to resolve through `mode-registry.json` and dispatch exactly once to the selected target. [SOURCE: .opencode/agents/deep.md:20-28] [SOURCE: .opencode/agents/deep.md:63-79]
3. Therefore, a literal Task dispatch from `@orchestrate` to `@deep` would create a primary-router-at-depth-1 that must dispatch again. That violates orchestrate's NDP if executed as a Task child.
4. Corrected implementation: `@orchestrate` should reuse the same registry resolution and Deep Route header pattern from `deep.md`, then dispatch the resolved leaf directly at depth 1. It should not Task-dispatch `@deep` as a worker. If the intended semantics are a session-level handoff to `@deep`, that must be stated explicitly and not implemented as a Task child.

## Sources Consulted

- `.opencode/agents/orchestrate.md:42-48,143-149,196-225`
- `.opencode/agents/deep.md:20-28,63-79`
- `research/research.md:13,57`
- `research/lineages/sonnet-critical/research.md:21-23,64-67`

## Assessment

- newInfoRatio: 0.66
- Novelty justification: This corrects the highest-risk wording in the prior consolidated recommendation while preserving its intent.
- Confidence: 0.82

## Reflection

- What worked: Reading NDP literally before designing the fix.
- What failed: The phrase "dispatch @deep and STOP" is ambiguous between Task dispatch and session handoff.
- Ruled out: `@orchestrate` -> Task(`@deep`) -> Task(leaf).

## Recommended Next Focus

Ground the plugin proposal in the actual installed hook surface.
