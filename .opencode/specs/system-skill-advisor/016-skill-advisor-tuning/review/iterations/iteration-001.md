# Deep Review Iteration 001

## Dispatcher
- Run: `016-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `scan`
- Focus: Ranked angle 1 — Self-recommendation-guard three-way contradiction
- Dimension: traceability

## Files Reviewed
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **CUT self-recommendation guard remains live behind an environment flag** -- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:50` -- The governing 003 phase says the self-recommendation guard was CUT and should be deleted because it duplicates the generic explainer floor and unflagged audit penalty [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md:67`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md:111`]. `scoring-constants.ts` now documents the explicit opt-in guard as already removed [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:139`]. The implementation still exports `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`, reads it from the environment, and applies guard-only branches in both confidence assembly and audit-routing intent bonuses [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:50`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:106`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:392`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:416`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:609`]. This leaves a documented-deleted, benchmark-CUT feature still activatable in production and makes the calibration comments false for operators reading the scorer surface.
   - Finding class: cross-consumer
   - Scope proof: Charter angle 1 names the same contradiction; Grep found the flag and guard branches only in the scorer target, while 003 docs and constants claim CUT/removed semantics.
   - Affected surface hints: `["advisor scorer env flags", "confidence assembly", "primary intent bonus", "003 RRF fusion verdict docs"]`
   - Recommendation: Either remove the guard flag and all guard-only branches as the CUT verdict and constants claim, or amend the 003 verdict/constants to state the guard remains intentionally dormant and test the flag-on behavior as a supported runtime mode.
   - Claim adjudication: `{"type":"traceability/spec-mismatch","claim":"The self-recommendation guard is documented as CUT/removed but remains live behind SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD.","evidenceRefs":["003-advisor-rrf-fusion/implementation-summary.md:67","003-advisor-rrf-fusion/implementation-summary.md:111","scoring-constants.ts:139","fusion.ts:50","fusion.ts:106","fusion.ts:392","fusion.ts:416","fusion.ts:609"],"counterevidenceSought":"Checked the 003 summary for limitations and the constants for replacement semantics; they say deletion/removal rather than intentional retention. Checked fusion for whether only dead names remain; it still reads the environment flag and branches on it.","alternativeExplanation":"The code may have been intentionally parked as default-off dark code, but the current constants and CUT verdict do not say that; they state removed/delete.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if an owning spec or release note explicitly says the flag remains supported as a dormant compatibility shim and has flag-on regression coverage."}`

### P2 Findings
None.

## Traceability Checks
- Confirmed the charter requires ranked angle 1 first [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md:8`].
- Confirmed 003 says CUT/delete the self-guard [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/implementation-summary.md:67`].
- Confirmed implementation still carries the flag/guard branches [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:50`].

## Integration Evidence
- Exact integration surfaces reviewed: `/deep:review:auto` route proof in initialized config/state, scorer env flag `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`, and `scoreAdvisorPrompt` scorer path in `fusion.ts`.

## Edge Cases
- The user requested a full 10-iteration auto loop, but this LEAF agent contract permits one iteration per dispatch. The owning `/deep:review` loop must dispatch subsequent iterations.
- No structural-impact MCP was used; this was a traceability review over named files from the charter.

## Confirmed-Clean Surfaces
- No P0 was found in angle 1.
- No advisor implementation files were edited.

## Ruled Out
- Not reporting the mere existence of `auditRecsAdvisorPenalty`; constants explicitly say that penalty is the intended remaining defense, so the issue is the contradictory live opt-in guard, not the unflagged penalty.
- Not re-proposing the WS1 arithmetic fix; charter watch-outs mark that as out of scope for this angle.

## Next Focus
- dimension: traceability
- focus area: WS1 "empirically falsified" claim has no evidence trail
- reason: Ranked charter angle 2 follows angle 1.
- rotation status: angle 2 of 10
- blocked/productive carry-forward: Carry P1 about live CUT guard until reducer/orchestrator resolves or confirms intentional dormant retention.
- required evidence: parent `spec.md`, `001-scorer-saturation-root-fix` docs, benchmark/evidence files if present, and relevant calibration commit references.
