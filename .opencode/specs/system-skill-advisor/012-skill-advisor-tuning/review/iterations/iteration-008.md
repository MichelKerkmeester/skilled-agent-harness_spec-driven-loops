# Deep Review Iteration 008

## Dispatcher
- Run: `012-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `verify`
- Focus: Ranked angle 8 — 003 GRADUATE verdict execution
- Dimension: traceability

## Files Reviewed
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-state.jsonl`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-strategy.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-config.json`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-findings-registry.json`
- `.opencode/skills/sk-code/code-review/references/review_core.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/spec.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/004-advisor-penalty-contract/spec.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **RRF graduation remains parked as a recommendation without a parent-tracked execution owner** -- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:97` -- The 003 benchmark result recommends graduating `SPECKIT_ADVISOR_RRF_FUSION` plus the conflict seam [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:97`], while the production scorer still returns false unless the env flag is explicitly set [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:101`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:103`]. The same benchmark records that live conflict value is absent because the corpus has zero `conflicts_with` edges and seeding those edges is a separate corpus-authoring decision [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:20`; `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:102`]. The parent phase map marks 003 complete [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/spec.md:84`], and the open questions only list Layer-1b projection vocab plus the 001 umbrella close-out [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/spec.md:101`; `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/spec.md:103`; `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/spec.md:104`]. The separate research charter still names `conflicts_with` authoring as a research angle and warns that 003's GRADUATE/CUT verdicts are unexecuted [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md:16`; `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md:23`]. This is P2 rather than P1 because 003 explicitly scoped flag flipping and live corpus seeding out of the benchmark, and 004 provides an owner for the self-guard replacement contract, but release/readiness tracking should still distinguish "benchmark complete" from "graduation executed or consciously deferred."
   - Finding class: matrix/evidence
   - Scope proof: Checked the live flag default, 003 benchmark verdict/caveat, parent phase map/open questions, 004 follow-up scope, and research charter. The self-guard CUT has a follow-up packet, but RRF graduation/conflict-edge authoring remains visible only as recommendation/research rather than a parent-tracked execution decision.
   - Affected surface hints: `["003 RRF benchmark verdict", "SPECKIT_ADVISOR_RRF_FUSION rollout", "conflicts_with corpus authoring", "012 parent readiness map"]`
   - Recommendation: Add an explicit parent-level follow-up row/open question or decision record that names the owner and state for RRF graduation: execute flag/default flip, defer with rationale, or require a post-WS2/WS4/WS5 rerun plus conflict-edge authoring criteria before promotion.

## Traceability Checks
- Confirmed ranked charter angle 8 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_review-charter.md:15`].
- Confirmed RRF remains default-off unless `SPECKIT_ADVISOR_RRF_FUSION` is truthy [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:101`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:103`].
- Confirmed self-guard CUT has at least one follow-up owner in 004's penalty-contract packet [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/004-advisor-penalty-contract/spec.md:67`; `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/004-advisor-penalty-contract/spec.md:89`; `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/004-advisor-penalty-contract/spec.md:92`].
- Confirmed the benchmark itself records the conflict seam as inert on the live corpus until `conflicts_with` edges are authored [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:102`].

## Integration Evidence
- Exact integration surfaces reviewed: `SPECKIT_ADVISOR_RRF_FUSION`, `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`, 003 benchmark verdicts, 004 penalty-contract follow-up, 012 parent phase/open-question map, and the research charter's conflict-edge authoring angle.

## Edge Cases
- This iteration did not rerun the 42-prompt benchmark; it reviewed execution ownership and current documented state.
- The RRF path being default-off lowers severity because no default-on runtime regression was proven.
- The self-guard CUT is not re-reported as a new finding; iteration 1 already carries the live code contradiction, and 004 provides a documented follow-up path.

## Confirmed-Clean Surfaces
- No P0/P1 findings were found in angle 8.
- 003 accurately records that flag flipping and live conflict-edge seeding were outside the benchmark scope.
- No advisor implementation files were edited.

## Ruled Out
- Ruled out a new P1 for self-guard CUT ownership because 004 explicitly owns the production-default penalty contract and excludes reintroducing the cut guard.
- Ruled out a P1 for RRF default-off alone because 003 describes graduation as a recommendation and scopes the live flip as a separate decision.

## Next Focus
- dimension: traceability
- focus area: 002 subtree status roll-up honesty
- reason: Ranked charter angle 9 follows angle 8.
- rotation status: angle 9 of 10
- blocked/productive carry-forward: Carry P1 findings from angles 1–3, 5, and 7; carry P2 advisories from angles 6 and 8; angle 4 remains clean.
- required evidence: 002 parent/child status records, 007 deleted artifact/orphan script status, parent roll-up semantics, and release-readiness impact.
