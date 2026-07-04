# Iteration 9: Propagation File Map

## Focus
KQ8 files needing the same hardening.

## Findings
- Deep command surfaces are `research.md`, `review.md`, `context.md`, and `ai-council.md`, with YAML assets under `.opencode/commands/deep/assets/` [SOURCE: .opencode/commands/deep/research.md:97-104].
- Context mode already has explicit per-seat resolved route contracts [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:379-387].
- Council route fields are script-owned and passed through session/topic orchestration [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:116-137].

## Sources Consulted
Deep commands and YAML assets.

## Assessment
newInfoRatio: 0.62. Propagation scope is finite and path-specific.

## Reflection
Ruled out repo-wide command hardening in this phase.

## Recommended Next Focus
Set FIX-5 unpark decision criterion.
