# Iteration 1: Layer-1b Half-Landed Parent-Hub Review Vocabulary

## Focus
Angle 1. Determine whether deep-loop-workflows still projects single-pass code-audit vocabulary after sk-code became the parent hub for code review/audit work.

## Findings
1. `deep-loop-workflows` still projects review vocabulary that belongs to sk-code for single-pass audit/review prompts: `iterative code audit`, `severity weighted findings`, and `code audit` are in derived trigger phrases. [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:78]
2. The deep-loop review mode registry repeats the same class of aliases: `iterative code audit`, `severity weighted findings`, `code-audit`, and `release-readiness`. [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:70]
3. sk-code already declares single-pass review and audit ownership through intent signals such as `code review`, `pr review`, `security review`, `quality gate`, `findings`, `audit packet docs`, and `p0 p1 p2 review`. [SOURCE: file:.opencode/skills/sk-code/graph-metadata.json:127]
4. The explicit scorer lane also anchors `code review`, `review the packet docs`, `audit packet docs`, `audit whether`, and `audit the` to `sk-code`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:159]
5. The scorer still carries a special `codeAuditDeepReviewPenalty` calibration field, which should remain until metadata and benchmarks prove the deep-loop single-pass terms are removed safely. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:130]

## Sources Consulted
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`

## Assessment
newInfoRatio: 1.00. Novelty: first evidence pass for the top-priority half-landed Layer-1b issue. Confidence: high for the vocabulary mismatch; implementation details require measurement before deletion.

## Reflection
What worked: comparing parent hub metadata with explicit scorer anchors gave a concrete cleanup target.
What failed: deleting every review-loop phrase would overcorrect; deep-loop still owns iterative review-loop invocation terms.
Ruled out: full deletion of deep-loop review vocabulary.

## Recommended Next Focus
Define the metadata-vs-code vocabulary authority contract so deletion does not just move the collision to another source.
