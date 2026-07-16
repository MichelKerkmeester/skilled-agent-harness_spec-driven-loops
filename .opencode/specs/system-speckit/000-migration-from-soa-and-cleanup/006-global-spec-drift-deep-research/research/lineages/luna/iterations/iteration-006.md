# Iteration 6: Metadata authority and derivation boundaries

## Focus
Trace which packet surfaces are authored authority and which are generated projections.

## Findings
1. The graph/context and memory-search parents both make authority boundaries explicit: parent specs own navigation/aggregate status, while child packets own evidence; migration manifests own aliases and generated metadata supports traversal. [SOURCE: `.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md:55-60,83-111`; `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md:50-64,80-109`]
2. The prior metadata drift finding occurred because graph metadata updated while continuity and description surfaces remained stale, proving that generated surfaces can disagree even when one traversal surface is correct. [SOURCE: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/007-sk-ai-small-model-rename/review/iterations/iteration-005.md:13-21,64-70`]

## Ruled Out
Treating any single generated metadata file as canonical is ruled out.

## Dead Ends
No clean corpus-wide authority map exists in the scanned packet set; authority is documented per parent family.

## Edge Cases
- Ambiguous input: focused on metadata authority, not implementation correctness.
- Contradictory evidence: graph current versus continuity stale is retained as a real cross-surface mismatch.
- Missing dependencies: no graph index.
- Partial success: authority pattern established, corpus map open.

## Sources Consulted
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md:55-111`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md:50-109`
- `.opencode/specs/sk-prompt/004-sk-small-model-optimization/007-sk-ai-small-model-rename/review/iterations/iteration-005.md:13-70`

## Assessment
- New information ratio: 0.29
- Questions addressed: current authority boundaries and generated metadata disagreement
- Questions answered: none newly; prior systemic conclusion strengthened

## Reflection
- What worked and why: parent governance sections explicitly state ownership.
- What did not work and why: no shared cross-family metadata authority table was found.
- What I would do differently: use packet manifests as the denominator in a future cleanup pass.

## Recommended Next Focus
Audit contradictions and false-positive risks in prior drift findings themselves.
