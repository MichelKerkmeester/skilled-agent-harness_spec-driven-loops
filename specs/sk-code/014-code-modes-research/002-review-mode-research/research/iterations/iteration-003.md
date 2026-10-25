# Iteration 3

## Focus

Angle 3: Output contract (Q3): which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?

## Actions Taken

- Read the review output contract, shared review doctrine, both output checkers and all four review-output fixtures.
- Re-read the active run config, state, strategy, registry, dashboard and iteration 2 to confirm focus and identity.
- Inspected the contract and fixtures without executing the review checkers as tests.

## Findings

### F-301 — Case line

**DERIVED — The Case line raises strong signal because the output contract says a finding without a case is not reported, and the shared schema defines the case as the situation producing the wrong result. The checker enforces a nonempty Case line for each parsed finding, but it cannot tell whether that situation is actually reproducible. Keep Case required and retain syntactic validation; assess whether the example produces the claimed result through reviewer judgment. Effort S. Risk: a vague nonempty case still passes. Ready now. Touchpoints: sk-code-review/SKILL.md, references/review-core.md, check-review-findings.js and its fixtures. Integration: shared @review and @deep-review doctrine.** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:356] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:99] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:23] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:53] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:75]

### F-302 — Finding class and scope proof

**INFERRED — Finding class and scope proof can clarify whether a recommendation covers one instance or a wider bug class, but requiring both on every finding adds prose that the output checkers do not validate. Keep them as reviewer reasoning fields and do not treat them as a machine schema until consumer use is confirmed. A benchmark comparing review time and same-class misses, plus a consumer audit in Q8, would confirm whether to keep them mandatory. Effort M. Risk: loosening scope proof may miss sibling sites. Needs a decision after Q4/Q8 evidence. Touchpoints: sk-code-review/SKILL.md and references/review-core.md, then checker/fixtures only if these fields become a formal parse contract. Integration: @review and @deep-review; user-authored consumers remain UNKNOWN pending Q8.** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:359] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:360] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:103] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:104] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:50]

### F-303 — riskScore

**INFERRED — riskScore should remain optional and advisory. Severity already determines merge handling, while the score has no documented cross-repository calibration in the inspected output contract; making it mandatory could add false precision without changing a decision. Keep it non-gating and include it only when it changes triage. Confirm through benchmark and consumer evidence before adding a threshold. Effort S. Risk: readers may still treat a displayed number as authoritative. Ready now. Touchpoints: sk-code-review/SKILL.md and references/review-core.md. Integration: both review agents and any parser consuming shared review output; the latter is not yet inventoried.** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:362] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:34] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:42] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:106]

### F-304 — Not checked line

**DERIVED — The Not checked line records material limits beside the verdict, and the final-line checker requires exactly one such line immediately above every full-review status. The checker validates presence and uniqueness, not whether all important unchecked work was disclosed. Keep the one-line format and the explicit `nothing material` option; leave completeness to review judgment rather than a brittle text parser. Effort S. Risk: an incomplete but nonempty disclosure passes. Ready now. Touchpoints: sk-code-review/SKILL.md and check-review-final-line.js. Integration: @review, @deep-review and downstream readers of full reports.** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:373] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:394] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:68] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:82] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:85]

### F-305 — Final status line

**DERIVED — An exact final status line gives automation a stable boundary, but the template also repeats the decision as Overall assessment and the checker never compares the two. A contradictory summary can therefore pass when the final line itself is valid. Keep the exact three normal status strings and add a checker/fixture consistency case; preserve the documented whole-output COMMENTED skip variants as a separate, bounded exception. Effort S. Risk: older inconsistent reports may begin failing. Ready now after confirming legacy output expectations. Touchpoints: sk-code-review/SKILL.md, check-review-final-line.js and review-output-fixture. Integration: review agents and downstream parsers; consumer inventory remains for Q8.** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:347] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:348] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:380] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:409] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:18] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:59] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:68]

### F-306 — Research-state consistency

**DERIVED — Q2 is marked answered in the strategy and iteration 2, yet the strategy's carried-forward-open list and registry still list it as open. Unless those lists are intentionally historical, this is stale state that could reopen a settled question; the reducer owner should clarify that semantic and reconcile the projection. This iteration leaves reducer-owned files untouched. Effort S. Needs reducer-owner clarification. Touchpoints: deep-research-strategy.md, findings-registry.json and reducer behavior. Integration: research state tracking only.** [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md:28] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md:114] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/iterations/iteration-002.md:23] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/findings-registry.json:246]

## Questions Answered

- Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?

## Questions Remaining

- Q4 through Q10 remain open for the scheduled research angles.
- Q2 is separately marked answered and carried forward as open in the reducer state; that status needs clarification.

## Next Focus

Angle 4: Usefulness evidence (Q4): what review catches, costs and misses in the repository's benchmark reports, manual-testing playbook scenarios and changelog.

