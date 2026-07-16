# Iteration 8: Minimum evidence bundle

## Focus
Define the smallest evidence bundle that prior work supports for a safe cleanup plan.

## Findings
1. The sampled packets support four required evidence classes: authoritative packet scope/status, implementation or source verification, generated-metadata freshness, and explicit negative/ruled-out evidence. [INFERENCE: synthesized from iterations 2–7 and their cited packet evidence]
2. Alias manifests and packet-local phase maps are required whenever topology has moved; arithmetic path assumptions are explicitly unsafe. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md:106-148`]

## Ruled Out
Cleanup planning from status labels or filename counts alone.

## Dead Ends
No additional independent control surfaced beyond the four evidence classes.

## Edge Cases
- Ambiguous input: “safe” means evidence-backed and reversible planning, not implementation authorization.
- Contradictory evidence: unresolved metadata disagreements remain open.
- Missing dependencies: code graph unavailable.
- Partial success: minimum bundle derived, not validated against every packet.

## Sources Consulted
- `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md:106-148`
- Prior lineage iterations 2–7 and their cited sources.

## Assessment
- New information ratio: 0.10
- Questions addressed: evidence needed before cleanup
- Questions answered: minimum bundle established as an inference

## Reflection
- What worked and why: repeated patterns converged into stable evidence classes.
- What did not work and why: corpus-wide denominator remains unavailable.
- What I would do differently: validate the bundle on a manifest-selected packet sample.

## Recommended Next Focus
Check for unresolved contradictions that would block synthesis.
