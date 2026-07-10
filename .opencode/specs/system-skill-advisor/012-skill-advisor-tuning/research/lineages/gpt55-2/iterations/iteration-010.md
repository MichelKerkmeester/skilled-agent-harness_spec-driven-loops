# Iteration 10: Semantic-Shadow Hygiene and Final Ordering

## Focus

Investigate charter angle 10 and synthesize proposals across all angles.

## Findings

1. The semantic-shadow lane has a cosine threshold of 0.2 and can run either with real prompt embeddings or fixture vectors in test mode [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:11] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:224].
2. 008 measured the lane as marginally net-negative: full 149/193 vs semantic-disabled 150/193 [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46].
3. The harmful flips were gold-`none` abstains false-firing to `mcp-chrome-devtools`, so description/embedding hygiene around mcp near-neighbor attractors is a cheaper next step than lane-weight work [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79].
4. The final implementation order should start with metadata authority correction, then guards, then reindex/rebaseline, then only remove scorer workarounds once measured parity is stable.

## Sources Consulted

- `lib/scorer/lanes/semantic-shadow.ts`
- `008-semantic-shadow-prove-or-freeze/implementation-summary.md`
- Prior iteration notes in this lineage

## Assessment

- newInfoRatio: 0.09
- Novelty: low; mostly synthesis and prioritization.
- Confidence: high on ordering.

## Reflection

- Worked: respecting 008's frozen conclusion prevented scope drift.
- Failed: no live embedding experiment was run by design.
- Ruled out: semantic-shadow weight churn in this research branch.

## Recommended Next Focus

Move to implementation planning in a write-authorized lineage, starting with metadata correction and guard additions.
