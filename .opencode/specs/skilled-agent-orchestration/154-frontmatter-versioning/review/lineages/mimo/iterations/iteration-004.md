# Iteration 4: Maintainability

## Focus
Dimension: D4 Maintainability
Files: frontmatter-version.mjs, test_frontmatter_version.mjs, frontmatter_versioning.md, all implementation-summary.md, spec.md
Scope: Code patterns, documentation quality, naming conventions, ease of follow-on changes

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.14

## Findings

### P0, Blocker
_(none)_

### P1, Required
_(none)_

### P2, Suggestion

- **F010**: Unused variable `trailing` in applyVersion function, `frontmatter-version.mjs:292`. The line `const trailing = content.endsWith('\n') ? '' : '';` assigns an empty string regardless of the condition and the result is never used. This is dead code — likely a leftover from a refactor that simplified the trailing-newline logic.

```json
{
  "findingId": "F010",
  "claim": "The trailing variable in applyVersion is dead code: it always evaluates to empty string and is never referenced.",
  "evidenceRefs": [
    "frontmatter-version.mjs:292"
  ],
  "counterevidenceSought": "Checked if trailing is used anywhere in the function or exported. It is not. The next line (293) uses fm.lines.join(fm.eol) directly.",
  "alternativeExplanation": "Could be a placeholder for future use, but the ternary is degenerate (both branches return '').",
  "finalSeverity": "P2",
  "confidence": 0.95,
  "downgradeTrigger": "If the variable is removed or given a meaningful purpose, this resolves.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery — dead code" }
  ]
}
```

- **F011**: Anchor cache grows unbounded during a corpus-wide run, `frontmatter-version.mjs:144`. The `anchorCache` Map is populated per skill directory but never evicted. For a 2,222-file corpus across ~30 skills, this is negligible. However, if the tool were adapted for a larger corpus or long-running service, this would become a memory concern. Low practical risk for current usage.

```json
{
  "findingId": "F011",
  "claim": "anchorCache grows unbounded during a run — entries are added but never evicted.",
  "evidenceRefs": [
    "frontmatter-version.mjs:144"
  ],
  "counterevidenceSought": "Checked if the cache is cleared between skills or modes. It is not — it persists for the entire process lifetime. For the current ~30-skill corpus this is fine.",
  "alternativeExplanation": "Intentional design — caching avoids re-reading SKILL.md and changelog/ for every child file in the same skill. The cache size is bounded by the number of skills (~30), not files (~2,222).",
  "finalSeverity": "P2",
  "confidence": 0.70,
  "downgradeTrigger": "This is already acceptable for current usage. Only relevant if the tool scales to a significantly larger corpus.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery — minor scalability observation" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | frontmatter_versioning.md matches engine behavior | Standard and engine agree |

## Assessment
- New findings ratio: 0.14 (2 P2 at weight 1.0 each = 2.0 new / 14.0 total weighted)
- Dimensions addressed: [maintainability]
- Novelty justification: Both findings are minor code quality observations, not functional issues

## Ruled Out
- Code quality overall: The engine is well-structured with clear function decomposition, good error handling, and thorough tests (20 assertions)
- Documentation quality: implementation-summary.md files are excellent; frontmatter_versioning.md is comprehensive and well-organized

## Dead Ends
- Checked for naming inconsistencies: function and variable names are consistent
- Checked for missing error handling: try/catch blocks cover git failures, file read errors

## Recommended Next Focus
All 4 dimensions covered. Proceed to convergence evaluation and synthesis.
