---
title: "Review Iteration 005 — Generator input boundary"
trigger_phrases: []
---
# Review Iteration 005 — Generator input boundary

## Route

Resolved route: mode=review target_agent=deep-review

## Files reviewed

- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:497-545`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:572-627`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:201-226`

## Finding

### F006 — P2 — Feature-name substitution is fragile for replacement metacharacters

The `create.sh` substitution block interpolates feature-derived values into Perl replacement expressions without escaping replacement metacharacters. Names containing `/`, `\`, or replacement sigils can corrupt the generated document or cause a substitution failure. The normal slug path reduces exposure, but the generator boundary should either constrain the accepted input or escape replacement values before rendering.

Disposition: active. Finding class: `generator-input-handling`. Scope proof: direct read of the substitution block and its caller path.

## Claim adjudication

Claim F006: accepted P2. Counterevidence sought: slug normalization and template-utils lookup. Alternative explanation: upstream validation may reject all metacharacters, but the substitution site does not document or enforce that assumption locally. Validator fingerprint: `read-only-input-boundary-v1`.

## Search coverage

`reviewDepthSchemaVersion: 2`; `graphCoverageMode: graphless_fallback`. Search ledger rows: `feature-name substitution -> finding:F006`; `replacement construction -> finding:F006`; `safe-input boundary -> finding:F006`.

Review verdict: CONDITIONAL
