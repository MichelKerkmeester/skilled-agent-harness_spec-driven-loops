# Iteration 10: semantic_shadow mcp-* Near-Neighbor Hygiene

## Focus
Angle 10. Research the cheap alternative to lane-weight work for semantic_shadow abstain false-fires.

## Findings
1. The semantic lane computes cosine matches against skill embeddings and filters by `COSINE_THRESHOLD = 0.2`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:11]
2. It embeds skill text from skill name, description, domains, intent signals, and derived triggers. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:256]
3. Packet 008 measured the live-weight semantic lane as net-negative on the full corpus: full 149/193 vs semantic-disabled 150/193, with 3 hurt flips from gold `none` abstains to `mcp-chrome-devtools`. [SOURCE: file:.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79]
4. Packet 008 therefore freezes the weight at 0.05 and explicitly argues against raising it. [SOURCE: file:.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:91]

## Proposal
Do not tune the lane weight. Instead:
- Add an mcp-neighbor hygiene audit over mcp skill descriptions/domains/triggers, looking for generic website/browser/live-site attractors that should be phrased as tool-specific capabilities.
- Add a gold-none abstain fixture slice for the 3 harmful IDs plus nearest-neighbor prompts.
- Track semantic-only false-fire count separately from full top-1 so hygiene can improve without changing weights.
- Keep provider-pinned opt-in ablation as the only gate for weight changes.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md`

## Assessment
newInfoRatio: 0.27. Novelty: final proposal is incremental because 008 already resolved the weight question. Confidence: high against weight increases; medium on exact hygiene edits until descriptions are audited.

## Reflection
What worked: anchoring to 008 avoids re-litigating a measured freeze.
What failed: semantic tuning without new fixture labels would be speculative.
Ruled out: raising `semantic_shadow` weight.

## Recommended Next Focus
Synthesize the full read-only proposal set and rank it by parent-hub compatibility impact.
