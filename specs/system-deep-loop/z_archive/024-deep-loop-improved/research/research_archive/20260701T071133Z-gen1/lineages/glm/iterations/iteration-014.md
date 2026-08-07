# Iteration 014: Codex Review stopPolicy=max-iterations + Zero-Finding Registry Bug

## Focus
- Scope: Codex review lineage config anomaly and zero-finding registry root cause
- Question: Why did the codex lineage produce 0 registry findings despite 50 iterations?

## Findings

### F-014: Codex review was stopPolicy=max-iterations (by design); zero-finding registry indicates a reducer/save-path bug

**Severity: High (50 iterations of review work produced zero traceable findings)**

**The config (corrected analysis):**
```json
{
  "convergenceThreshold": 0.01,
  "maxIterations": 50,
  "stopPolicy": "max-iterations",
  "lineageMode": "new"
}
```
[SOURCE: `review/lineages/codex/deep-review-config.json`]

The codex review was intentionally configured with `stopPolicy: "max-iterations"`, NOT `"convergence"`. This means the lineage was designed to run all 50 iterations, broadening review angles rather than converging early. The `maxIterationsReached` stop is correct behavior for this policy.

This corrects the anomaly noted in iteration 013: the non-convergence is BY DESIGN, not a convergence-math failure.

**However, the zero-finding registry remains a critical bug:**

The codex findings registry contains **0 findings** despite:
- 50 iterations completed (all with `status: "complete"` in the state log)
- The codex lineage has 50 real iteration markdown files with actual review content
- The GLM lineage (same review target, fewer iterations) produced 9 findings

[SOURCE: `review/lineages/codex/deep-review-findings-registry.json` (total: 0)]
[SOURCE: `review/lineages/codex/deep-review-state.jsonl` (50 complete iterations)]
[SOURCE: `review/lineages/codex/iterations/iteration-001.md` through `iteration-050.md` (real content)]

**Root cause hypothesis:**

The codex CLI executor likely does not produce findings in the JSONL delta format that the reducer (`reduce-state.cjs`) expects. Two possibilities:
1. **Format mismatch:** The codex executor writes findings in a different JSON structure than the reducer's `findingDetails` schema, so the reducer skips them silently
2. **Salvage interference:** The 50 salvage-failure placeholder files (iteration-1.md through iteration-50.md, per F-012) may have confused the reducer's iteration glob, causing it to process placeholders instead of real files and finding no content

The second hypothesis is strengthened by the F-012 finding: the reducer may glob `iteration-*.md` and get 100 matches, then process the non-padded `iteration-N.md` placeholders (which contain only HTML comments, no findings) and skip the real `iteration-NNN.md` files due to deduplication on the iteration number.

**Impact:**
1. 50 iterations of review work are untraceable — no findings in the registry means no disposition tracking
2. The `review-report.md` in the codex lineage may be the only artifact with findings, but it's not machine-readable for triage
3. Any merge/salvage step that reads the registry will see 0 codex findings and undercount the review coverage

**Recommendation:**
1. **Investigate:** Read the codex `reduce-state.cjs` invocation logs or the codex `deep-review-dashboard.md` to determine whether findings were detected but not saved, or not detected at all
2. **Bug fix:** Ensure the reducer's iteration glob uses zero-padded `iteration-NNN.md` exclusively, or deduplicates by parsing the iteration number from both naming schemes
3. **Backfill:** If the findings exist in the iteration markdown files, re-run the reducer to populate the registry
4. **Validation:** Add a post-loop check that flags lineages with >0 iterations but 0 registry findings

## Novelty Justification
Corrected the codex non-convergence analysis (it's by design, not a bug). New finding: the zero-finding registry is likely caused by the same naming-collision bug as F-012 (placeholder files confusing the reducer glob). This connects two previously separate findings into a causal chain.

## What Was Tried and Failed
- (Unable to read the codex dashboard in this iteration — would need another read)

## Ruled-Out Directions
- The stopPolicy=max-iterations is NOT a misconfiguration (it's a valid intentional choice for comprehensive review)
