# Iteration 1: Scope and Phase Evidence Baseline

## Focus

Establish the candidate-doc scope and the authoritative 031 changes that later iterations must use as contradiction evidence.

## Findings

1. The audit spec explicitly scopes living skill docs and top-level docs, excluding `z_archive`, and lists the candidate files at `spec.md:67-122`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:67]
2. Phase 009's load-bearing change is registry-backed orchestrate routing: `@deep-context` and `@deep-review` rows were added, `Deep Route:` became a registry lookup, and `@deep` itself must never be Task-dispatched. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing/implementation-summary.md:48-60]
3. Phase 010's load-bearing change is the ai-council mode conversion: `.opencode/agents/ai-council.md:4` changed `mode: all` to `mode: subagent`, direct invocation was rejected, and Task dispatch remained reachable. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60]
4. Phase 011's load-bearing plugin change is the new `mk-deep-loop-guard.js` file and rename from `deep-route-guard.js`, including `MK_DEEP_LOOP_GUARD_REJECT`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:48-58] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:129-139]

## Sources Consulted

- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md`
- `009-orchestrate-universal-routing/implementation-summary.md`
- `010-ai-council-subagent-only/implementation-summary.md`
- `011-deep-route-guard-plugin/implementation-summary.md`
- `012-gpt-claude-benchmark/implementation-summary.md`
- `013-fix5-checkpoint/implementation-summary.md`

## Assessment

- newInfoRatio: 1.0
- Novelty: first pass; all phase-evidence anchors were new to this lineage.
- Confidence: high for phase 009-013 evidence; medium for TOML mirror removal because the dedicated change evidence is the 014 charter plus current filesystem rather than a standalone phase summary.

## Reflection

- Worked: phase summaries provide exact contradiction anchors.
- Failed: no separate phase implementation summary for TOML mirror removal was located.
- Ruled out: archived `z_archive` docs are out of scope per spec.

## Recommended Next Focus

Check `ai-council` direct-invocation and mode claims in live `cli-opencode` docs.
