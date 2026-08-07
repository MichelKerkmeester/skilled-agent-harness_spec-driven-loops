# Iteration 1: Layer-1b Parent-Hub Metadata Ownership

## Focus

Investigate charter angle 1: Layer-1b is half-landed and `deep-loop-workflows` still projects code-audit vocabulary that should move to `sk-code` or to narrower deep-review loop intent.

## Findings

1. `deep-loop-workflows` still exports review aliases that look like single-pass code-review vocabulary: `iterative code audit`, `severity weighted findings`, and `code audit` in `derived.trigger_phrases` [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:70].
2. The same deep-loop hub also advertises broad review-loop concepts in `intent_signals`, including `code review loop`, which is valid only when the prompt has loop/iteration/convergence intent [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:58].
3. `sk-code` already owns code-review, findings, security review, PR review, and audit vocabulary in its graph metadata [SOURCE: .opencode/skills/sk-code/graph-metadata.json:127].
4. The scorer has a hardcoded workaround: on `code audit`, it bonuses `sk-code` and penalizes `deep-review` / `deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593].
5. The penalty value is currently `-0.2`, while the `sk-code` code-audit bonus is `0.2` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:218].

## Sources Consulted

- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`

## Assessment

- newInfoRatio: 0.92
- Novelty: first concrete mapping of the top-priority mismatch.
- Confidence: high. The source files directly show both the metadata projection and the scorer workaround.

## Reflection

- Worked: comparing metadata and post-fusion code together.
- Failed: none.
- Ruled out: deleting `codeAuditDeepReviewPenalty` before metadata correction.

## Recommended Next Focus

Define the vocabulary authority split between code constants and metadata.
