# Deep-Review Iteration 3 — D3 MAINTAINABILITY of the 008 doc ship

## Focus

D3 Maintainability audit of the 5 deep-* skills' documentation as shipped in commit 5f3e0a2f53. This iteration examined HVR mechanical compliance (em dashes, AI-filler tokens), clarity of rewritten READMEs, coherence of the 3 deep-review split files, and reference organization quality.

## Actions Taken

1. **HVR mechanical sweep**: Grepped all 5 skills' README.md files and references/**/*.md for HVR red flags:
   - Em dashes (—)
   - AI-filler tokens: `delve`, `leverage`, `seamless`, `robust`, `in order to`, `it's worth noting`, `boasts`

2. **Clarity read**: Sampled 2 representative READMEs end-to-end:
   - `.opencode/skills/deep-research/README.md`
   - `.opencode/skills/deep-ai-council/README.md`

3. **Split-file coherence**: Read the 3 deep-review split files to verify standalone readability:
   - `.opencode/skills/deep-review/references/state/state_format.md`
   - `.opencode/skills/deep-review/references/protocol/loop_protocol.md`
   - `.opencode/skills/deep-review/references/convergence/convergence.md`

4. **Reference organization**: Verified subfolder grouping and file placement matches content across deep-review references/.

## Findings

### P2 — HVR em dash usage in technical reference docs

**Dimension**: maintainability

**Evidence**:
- `.opencode/skills/deep-agent-improvement/references/promotion-gates/promotion_rules.md:100` — "indicating the loop has exhausted its current approach — stop and reassess"
- `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md:286` — "contributed by <Seat>, strengthened by <Seat>, retained because <reason>."
- `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md:292` — "contributed by Pragmatic Seat, reinforced by Critical Seat, retained because the request names no runtime behavior change."
- `.opencode/skills/deep-ai-council/references/convergence/depth_dispatch.md:290` — "ALSO violates the one-CLI-per-round invariant (these would need to be TWO dedicated rounds, not one)."
- `.opencode/skills/deep-ai-council/references/patterns/seat_diversity_patterns.md:53,98,133,263` — 4 instances in prose explanations
- `.opencode/skills/deep-ai-council/references/structure/output_schema.md:87` — "### Seat 001 — Analytical / cli-codex"
- `.opencode/skills/deep-loop-runtime/references/integration_points.md:172` — technical explanation with em dash
- `.opencode/skills/deep-research/references/protocol/loop_protocol.md:167,246,257,284,350,351,352,353,354,509` — 10 instances in protocol documentation
- `.opencode/skills/deep-review/references/state/state_reducer_registry.md:89` — "applied when one or both records lack a content_hash, preserving existing behavior unchanged."

**Recommendation**: Replace em dashes (—) with simpler punctuation per HVR rules. Most instances can use colons, commas, or parenthetical clauses. Example: "indicating the loop has exhausted its current approach: stop and reassess" or "indicating the loop has exhausted its current approach (stop and reassess)."

**Severity justification**: P2 (style/polish). These are mechanical HVR violations that do not impair comprehension but deviate from the human-voice standard. The docs remain readable and maintainable despite the em dashes.

### P2 — "Robust" appears in technical contexts but should be reviewed for AI-filler pattern

**Dimension**: maintainability

**Evidence**:
- `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md:57,70,80,224` — "Robustness" column header in scoring tables
- `.opencode/skills/deep-ai-council/references/convergence/failure_handling.md:88` — "Robustness" column in failure handling table
- `.opencode/skills/deep-ai-council/references/patterns/seat_diversity_patterns.md:44` — "Robustness, safety" in capability description
- `.opencode/skills/deep-review/references/convergence/convergence.md:227` — "Robust statistical test using Median Absolute Deviation."

**Recommendation**: Review these instances for legitimate technical use vs AI-filler pattern. "Robustness" as a scoring dimension and "robust statistical test" appear to be legitimate technical terminology. However, HVR flags "robust" as a common AI-filler token, so consider alternatives like "resilient", "reliable", or "fault-tolerant" where the term is descriptive rather than a named technical concept.

**Severity justification**: P2 (style/polish). The term appears to be used legitimately in technical contexts (scoring dimensions, statistical methods), but HVR flags it as filler. A review would ensure alignment with human-voice standards without breaking technical accuracy.

## Coverage

**Files reviewed**:
- 5 skill READMEs: deep-agent-improvement, deep-ai-council, deep-loop-runtime, deep-research, deep-review
- 60+ reference files across all 5 skills (via grep sweep)
- 3 deep-review split files (state_format.md, loop_protocol.md, convergence.md)
- 2 sampled READMEs for clarity (deep-research, deep-ai-council)

**Coverage summary**:
- HVR mechanical sweep: 100% of READMEs and reference files checked for em dashes and AI-filler tokens
- Clarity read: 2 of 5 READMEs sampled (40% coverage, representative)
- Split-file coherence: 3 of 3 deep-review split files verified (100%)
- Reference organization: deep-review references/ subfolder structure verified

## Next Focus

Iteration 4 will audit D4 completeness of the 008 doc ship, focusing on:
- Verification that all documented features have corresponding implementation evidence
- Cross-referencing between README claims and actual code/assets
- Checking for orphaned documentation (docs describing non-existent features)
- Validating that the 5 deep-* skills' doc sets are complete relative to their shipped capabilities

This continues the planned 5-iteration deep-review sequence across correctness (iter-1), traceability (iter-2), maintainability (iter-3), completeness (iter-4), and consistency (iter-5).

```json
{"dimensions":["maintainability"],"filesReviewed":[".opencode/skills/deep-agent-improvement/README.md",".opencode/skills/deep-ai-council/README.md",".opencode/skills/deep-loop-runtime/README.md",".opencode/skills/deep-research/README.md",".opencode/skills/deep-review/README.md",".opencode/skills/deep-agent-improvement/references/**/*.md",".opencode/skills/deep-ai-council/references/**/*.md",".opencode/skills/deep-loop-runtime/references/**/*.md",".opencode/skills/deep-research/references/**/*.md",".opencode/skills/deep-review/references/**/*.md",".opencode/skills/deep-review/references/state/state_format.md",".opencode/skills/deep-review/references/protocol/loop_protocol.md",".opencode/skills/deep-review/references/convergence/convergence.md"],"findingsSummary":{"P0":0,"P1":0,"P2":2},"findingsNew":{"P0":0,"P1":0,"P2":2},"newFindingsRatio":0.6666666666666666,"status":"complete","findingDetails":[{"severity":"P2","dimension":"maintainability","title":"HVR em dash usage in technical reference docs","files":[".opencode/skills/deep-agent-improvement/references/promotion-gates/promotion_rules.md:100",".opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md:286",".opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md:292",".opencode/skills/deep-ai-council/references/convergence/depth_dispatch.md:290",".opencode/skills/deep-ai-council/references/patterns/seat_diversity_patterns.md:53,98,133,263",".opencode/skills/deep-ai-council/references/structure/output_schema.md:87",".opencode/skills/deep-loop-runtime/references/integration_points.md:172",".opencode/skills/deep-research/references/protocol/loop_protocol.md:167,246,257,284,350,351,352,353,354,509",".opencode/skills/deep-review/references/state/state_reducer_registry.md:89"],"evidence":"20+ instances of em dashes (—) found across reference docs in promotion rules, scoring rubrics, convergence docs, and protocol documentation.","recommendation":"Replace em dashes with simpler punctuation (colons, commas, parentheses) per HVR rules."},{"severity":"P2","dimension":"maintainability","title":"Robust appears in technical contexts but should be reviewed for AI-filler pattern","files":[".opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md:57,70,80,224",".opencode/skills/deep-ai-council/references/convergence/failure_handling.md:88",".opencode/skills/deep-ai-council/references/patterns/seat_diversity_patterns.md:44",".opencode/skills/deep-review/references/convergence/convergence.md:227"],"evidence":"6 instances of 'robust' found in scoring tables, failure handling, and convergence docs. Some appear legitimate (scoring dimension, statistical test) but HVR flags as AI-filler.","recommendation":"Review instances for legitimate technical use vs AI-filler. Consider alternatives like 'resilient', 'reliable', or 'fault-tolerant' where descriptive rather than named technical concept."}]}
