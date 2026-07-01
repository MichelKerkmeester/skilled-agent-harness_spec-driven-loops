# Iteration 17: Orchestrate vs Deep Router Comparison

## Focus
KQ4/KQ7 comparison.

## Findings
- `deep.md` is narrow: it only resolves deep modes and dispatches one loaded deep target [SOURCE: .opencode/agents/deep.md:20-28].
- `orchestrate.md` is broad: it owns decomposition, delegation, quality evaluation, conflict resolution, and synthesis [SOURCE: .opencode/agents/orchestrate.md:20-28].
- Therefore, deep-routing is better delegated to the narrow router than duplicated inside the broad orchestrator.

## Sources Consulted
Deep and orchestrate agents.

## Assessment
newInfoRatio: 0.30. Strengthens the single-source-of-truth recommendation.

## Reflection
Ruled out making orchestrate a second deep router.

## Recommended Next Focus
Check Claude flexibility impacts.
