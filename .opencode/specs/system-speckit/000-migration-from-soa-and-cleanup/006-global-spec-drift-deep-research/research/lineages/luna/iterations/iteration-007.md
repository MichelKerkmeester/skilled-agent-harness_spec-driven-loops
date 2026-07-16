# Iteration 7: False positives and correction quality

## Focus
Test whether prior drift efforts record ruled-out findings and correction limits.

## Findings
1. The code-graph audit explicitly records current surfaces and zero inferred findings, showing a disciplined negative-knowledge practice. [SOURCE: `.opencode/specs/system-code-graph/029-code-graph-doc-audit/spec.md:133,157-165`; `.opencode/specs/system-code-graph/029-code-graph-doc-audit/review-report.md:90-111`]
2. The validation-hardening packet records false-positive checks, including the distinction between genuine evidence failures and changes caused by concurrent edits. This is stronger than a pass/fail summary because it preserves why findings were retained or removed. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes/implementation-summary.md:116,135`]

## Ruled Out
All prior drift findings as equally reliable; negative evidence and re-verification quality differ by packet.

## Dead Ends
No single shared confidence rubric was found across the sampled packets.

## Edge Cases
- Ambiguous input: assessed audit quality, not the truth of every underlying defect.
- Contradictory evidence: current-surface exclusions and historical findings coexist by design.
- Missing dependencies: no independent rerun of every audit.
- Partial success: negative-knowledge controls identified.

## Sources Consulted
- `.opencode/specs/system-code-graph/029-code-graph-doc-audit/spec.md:133-165`
- `.opencode/specs/system-code-graph/029-code-graph-doc-audit/review-report.md:90-111`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes/implementation-summary.md:116-135`

## Assessment
- New information ratio: 0.18
- Questions addressed: evidence gaps and false-positive handling
- Questions answered: negative-knowledge practice is uneven but observable

## Reflection
- What worked and why: audit packets expose ruled-out/current surfaces.
- What did not work and why: no shared confidence scale.
- What I would do differently: retain source-level evidence and explicit ruled-out records in synthesis.

## Recommended Next Focus
Consolidate systemic findings and identify the minimum evidence required for a safe cleanup plan.
