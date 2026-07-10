# Deep Review Iteration 007

## Dispatcher
- Run: `012-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `verify`
- Focus: Ranked angle 7 — RRF sort comparator soundness
- Dimension: correctness

## Files Reviewed
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-state.jsonl`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-strategy.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-config.json`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-findings-registry.json`
- `.opencode/skills/sk-code/code-review/references/review_core.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/spec.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/**` grep for RRF/exact-semantic comparator coverage

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **RRF exact-semantic rerank is implemented as a pairwise `sort` comparator instead of a transitive rank key** -- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:765` -- The RRF path sorts candidates with a comparator that first computes pair-specific adjusted scores, then only uses exact-semantic scores when both candidates have exact-semantic entries and their pairwise adjusted-score delta falls within `ADVISOR_EXACT_SEMANTIC_RERANK_WINDOW` [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:765`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:772`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:777`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:779`]. Because that decision is made per pair, a candidate set can compare A/B by exact semantics, B/C by exact semantics, but A/C by adjusted score when the A/C gap is outside the window; that is not a stable total ordering contract for `Array.sort`. The same comparator-only adjusted score also includes command penalties, primary-intent bonuses, and graph-conflict demotions [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:766`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:768`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:770`], while the emitted recommendation still exposes the pre-adjustment `score`, `confidence`, lane attribution, and `passes_threshold` fields [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:736`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:739`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:743`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:794`]. This is gate-relevant because the 003 packet recommends graduating RRF with the conflict seam after benchmark lift [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md:67`], so the opt-in path is not merely dead code.
   - Finding class: algorithmic
   - Scope proof: Reviewed `scoreAdvisorPrompt` recommendation construction, RRF comparator, exact-semantic window, conflict adjustment, primary intent bonus path, and 003 GRADUATE evidence. A test grep found RRF determinism and corpus parity tests but no direct comparator-transitivity or emitted-score/adjusted-rank contract test for the exact-semantic window.
   - Affected surface hints: `["SPECKIT_ADVISOR_RRF_FUSION", "scoreAdvisorPrompt ranking", "exact semantic rerank", "graph conflict demotion", "advisor result attribution"]`
   - Recommendation: Precompute a deterministic ranking tuple per recommendation before sorting, including adjusted score, exact-semantic eligibility/grouping, conflict/intent/command adjustments, RRF rank, and lexical tie-breaker; expose or trace the final adjusted-rank components so returned score/attribution cannot contradict ranking.

```json
{
  "type": "claim-adjudication",
  "claim": "The RRF exact-semantic rerank comparator is pairwise-windowed and can violate transitive total ordering while hiding the final adjusted ranking basis from emitted recommendation metadata.",
  "evidenceRefs": [
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:765",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:772",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:777",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:779",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:794",
    ".opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md:67"
  ],
  "counterevidenceSought": "Checked the RRF scorer tests by grep for RRF, exact semantic, conflict, and scoreAdvisorPrompt coverage. Existing tests cover determinism/corpus paths, but no transitivity fixture or emitted-adjusted-score contract for the windowed exact-semantic comparator surfaced.",
  "alternativeExplanation": "If exact-semantic entries are rare and the window is small, current benchmarks may not expose a bad triple; that lowers severity from P0 but does not make the comparator contract safe for a graduated path.",
  "finalSeverity": "P1",
  "confidence": "medium-high",
  "downgradeTrigger": "Downgrade to P2 if a committed property test or proof shows the exact-semantic window cannot create non-transitive triples for any reachable recommendation set, and if result traces expose the adjusted ranking basis."
}
```

### P2 Findings
None.

## Traceability Checks
- Confirmed ranked charter angle 7 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_review-charter.md:14`].
- Confirmed 003 recommends GRADUATE for RRF core plus conflict seam [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md:67`].
- Confirmed 003 treats the benchmark as production-path evidence but explicitly says the flag flip is a separate decision [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/spec.md:79`].

## Integration Evidence
- Exact integration surfaces reviewed: `scoreAdvisorPrompt`, `SPECKIT_ADVISOR_RRF_FUSION`, exact-semantic rerank index use, graph conflict adjustment, primary intent bonus, and RRF-related scorer tests by grep.

## Edge Cases
- The issue is default-off today, but it remains active because the owning packet recommends graduation of the same path.
- The finding is about comparator contract and result attribution, not about disproving the reported 42-prompt benchmark lift.

## Confirmed-Clean Surfaces
- No P0 finding: no active default-on production break was proven.
- No advisor implementation files were edited.

## Ruled Out
- Ruled out re-reporting the self-recommendation guard contradiction; that remains carried from iteration 1.
- Ruled out claiming a benchmark-result regression; the reviewed evidence supports a comparator safety defect, not a reproduced top-1 failure in the 42-prompt set.

## Next Focus
- dimension: traceability
- focus area: 003 GRADUATE verdict execution
- reason: Ranked charter angle 8 follows angle 7.
- rotation status: angle 8 of 10
- blocked/productive carry-forward: Carry P1 findings from angles 1–3, 5, and 7; carry P2 metadata-coverage advisory from angle 6; angle 4 remains clean.
- required evidence: RRF flag default state, live `conflicts_with` edge presence, 003 verdict ownership, benchmark currency after WS2/WS4/WS5, and self-guard CUT ownership.
