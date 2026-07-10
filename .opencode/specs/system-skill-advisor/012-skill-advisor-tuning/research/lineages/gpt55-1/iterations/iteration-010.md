# Iteration 10: Angle 10 - semantic_shadow Embedding Hygiene

## Focus

Find a lower-blast path for known `semantic_shadow` abstain false-fires, especially mcp-* near-neighbor attraction.

## Findings

1. 008 measured `semantic_shadow` as a marginal net-negative: full 149/193, disabled 150/193, with six flips. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46]
2. The harmful flips included three gold-`none` abstain false-fires to `mcp-chrome-devtools`. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79]
3. The lane remains frozen at weight 0.05; raising or dropping it would force broader rebaseline and structural changes. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:91]
4. Semantic fixture vectors are built from skill name, description, domains, intentSignals, and derivedTriggers, not derivedKeywords. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:256]
5. Proposed hygiene: add a description/trigger lint for mcp-* skills that flags generic browser/tooling attractors without task specificity, then re-run the 008 opt-in ablation before any weight change.

## Sources Consulted

- `008-semantic-shadow-prove-or-freeze/implementation-summary.md`
- `semantic-shadow.ts`
- `semantic-shadow-cosine.vitest.ts`

## Assessment

`newInfoRatio: 0.26`

Novelty justification: added a metadata/content hygiene path that respects the frozen lane decision.

Confidence: medium-high.

## Reflection

Worked: aligning with 008 rather than reopening lane-weight debate.

Failed: semantic false-fires cannot be solved confidently without rerunning the opt-in real-provider ablation.

Ruled out: immediate lane weight change.

## Recommended Next Focus

Synthesize all findings into an implementation-safe proposal sequence.
