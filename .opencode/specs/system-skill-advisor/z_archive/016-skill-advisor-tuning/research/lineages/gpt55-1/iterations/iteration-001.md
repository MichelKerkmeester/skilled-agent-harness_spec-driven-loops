# Iteration 1: Angle 1 - Layer-1b Half-Landed Vocabulary

## Focus

Determine whether parent-hub metadata still projects single-pass code-audit vocabulary into `deep-loop-workflows`, and which scorer penalties currently compensate for that projection.

## Findings

1. `deep-loop-workflows` still projects single-pass and severity terms in `derived.trigger_phrases`: `iterative code audit`, `severity weighted findings`, and `code audit`. These are live advisor-derived lane inputs after projection. [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:80]
2. The live scorer still has a post-fusion primary intent rule for `code audit`, boosting `sk-code` and demoting `deep-review` or `deep-loop-workflows`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593]
3. The numeric demotion is centralized as `codeAuditDeepReviewPenalty: -0.2`, not just an inline regex. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:218]
4. The explicit lane also gives broad `audit`, `findings`, and `review` tokens to `sk-code`, so the penalty is compensating a near-tie, not carrying all signal alone. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18]
5. `sk-code` metadata already owns `code review`, `security review`, `quality gate`, `findings`, and `audit packet docs` intent signals. [SOURCE: .opencode/skills/sk-code/graph-metadata.json:127]

## Sources Consulted

- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`

## Assessment

`newInfoRatio: 1.00`

Novelty justification: first pass established the concrete metadata and scorer coupling for the top-priority Layer-1b issue.

Confidence: high for the coupling; medium for the exact deletion list until measured by the ratchet.

## Reflection

Worked: pairing metadata inspection with scorer compensation logic.

Failed: assuming the half-landed state is only metadata; scorer constants still encode the workaround.

Ruled out: removing `codeAuditDeepReviewPenalty` before metadata cleanup.

## Recommended Next Focus

Define the vocabulary authority split so metadata cleanup does not just move hardcoded phrases elsewhere.
