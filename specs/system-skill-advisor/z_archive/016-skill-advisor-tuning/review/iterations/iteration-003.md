# Deep Review Iteration 003

## Dispatcher
- Run: `016-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `scan`
- Focus: Ranked angle 3 — The saturation defect is still live (WS1 reverted)
- Dimension: correctness

## Files Reviewed
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix/spec.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Surviving explicit-lane disambiguation penalties are still absorbed before fusion** -- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:345` -- Ranked angle 3 asks whether the reverted WS1 saturation defect is still live. It is: the same explicit lane still sums positive boosts and negative disambiguation offsets into one `value.score`, then emits `score: Math.min(value.score, 1)` [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:241`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:345`]. Fusion then indexes lane matches with a zero-initialized `rawScore` and `Math.max(existing.rawScore, match.score)`, erasing any net-negative explicit match before contribution assembly [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:267`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:271`]. Surviving penalties include colon review loop `sk-code` demotions [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:115`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:313`], webflow CMS `sk-code` demotion [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:119`], benchmark `deep-loop-workflows` demotions [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:138`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:146`], and `/speckit:resume` command demotion [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:293`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:295`]. The original 001 spec describes exactly this class as a root defect: pre-clamp additive offsets plus the fusion `Math.max` floor mean ordinary positive support can erase a demotion [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix/spec.md:45`]. The current code has not replaced the arithmetic with post-cap demotion or a first-class disambiguation channel, so verbose prompts that also trigger positive surface tokens can still silently neutralize these intended disambiguators.
   - Finding class: algorithmic
   - Scope proof: Audited all angle-named penalty families in `explicit.ts`: review/colon-review, webflow CMS, benchmark/model-benchmark, and resume. Each still feeds the same summed `value.score` path and the same fusion `Math.max(..., match.score)` floor.
   - Affected surface hints: `["explicit_author lane", "fusion lane index", "review-loop routing", "webflow CMS routing", "benchmark routing", "resume command routing"]`
   - Recommendation: Do not add more pre-clamp offsets. Either record these surviving penalties as intentionally best-effort suppressors with fixture evidence, or reintroduce a scoped post-cap/first-class demotion mechanism for the still-supported disambiguators and add verbose-saturation fixtures for each family.
   - Claim adjudication: `{"type":"correctness/algorithmic","claim":"Surviving explicit-lane negative disambiguators still use the pre-clamp/fusion-floor arithmetic described as the saturation defect.","evidenceRefs":["explicit.ts:115","explicit.ts:119","explicit.ts:138","explicit.ts:146","explicit.ts:293","explicit.ts:295","explicit.ts:313","explicit.ts:345","fusion.ts:267","fusion.ts:271","001-scorer-saturation-root-fix/spec.md:45"],"counterevidenceSought":"Checked whether explicit.ts now separates support from demotion or fusion preserves net-negative lane evidence; it still emits one clamped score and fusion still floors negative matches through Math.max from zero.","alternativeExplanation":"The WS1 experiment may have shown the broad post-cap fix hurt the corpus, but that does not prove each surviving penalty now functions under verbose saturation; the specific penalty mechanism remains the same best-effort pre-clamp offset.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if each surviving penalty has a passing verbose-saturation fixture showing topSkill and effective contribution remain correct under saturating positive support."}`

### P2 Findings
None.

## Traceability Checks
- Confirmed ranked charter angle 3 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md:10`].
- Confirmed 001 describes the same arithmetic class as the root defect [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix/spec.md:45`].
- Confirmed current code still uses summed explicit scores, `Math.min(value.score, 1)`, and fusion `Math.max(existing.rawScore, match.score)` [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:249`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:345`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:271`].

## Integration Evidence
- Exact integration surfaces reviewed: `/deep:review:auto` route proof in config/state, `explicit_author` lane, `buildLaneMatchIndex` fusion path, and review-core severity doctrine.

## Edge Cases
- The charter says not to re-propose the known-falsified WS1 arithmetic fix. This finding does not recommend the broad reverted fix; it reports that supported surviving penalties still lack fixture-backed semantics under the same absorption path.
- No runtime corpus run was performed; evidence is structural and line-based. Severity remains P1 because the code path matches the documented defect and affects routing correctness.

## Confirmed-Clean Surfaces
- No P0 was found in angle 3.
- No advisor implementation files were edited.

## Ruled Out
- Not claiming every affected prompt currently misroutes; the finding is that the penalty mechanism remains vulnerable under verbose saturation and lacks per-family proof.
- Not expanding into corpus-number reconciliation; that is ranked angle 4.

## Next Focus
- dimension: traceability
- focus area: Corpus-number reconciliation
- reason: Ranked charter angle 4 follows angle 3.
- rotation status: angle 4 of 10
- blocked/productive carry-forward: Carry P1 findings from angles 1–3 until code/docs/fixtures are reconciled.
- required evidence: WS4/WS5/WS6 docs, parity gate outputs, and definitive corpus regime table.
