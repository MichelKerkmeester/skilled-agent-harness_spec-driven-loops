# Deep Review Iteration 009

## Dispatcher
- Run: `016-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `verify`
- Focus: Ranked angle 9 — 002 subtree status roll-up honesty
- Dimension: traceability

## Files Reviewed
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/review/deep-review-state.jsonl`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/review/deep-review-strategy.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/review/deep-review-config.json`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/review/deep-review-findings-registry.json`
- `.opencode/skills/sk-code/code-review/references/review_core.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/003-embedding-staleness-signal/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/implementation-summary.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **002 is rolled up as complete while child gates and the surviving fold-tick artifact remain incomplete** -- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:49` -- The 002 parent declares `Status complete` [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:49`], and the 012 parent also marks phase 002 complete [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/spec.md:83`]. But 002's own phase map lists child 003 as `Partial`, child 004 as `Implemented (shadow-only, live NO-GO)`, child 006 as `Partial`, and child 007 as `Implemented (shadow-only, live NO-GO)` [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:106`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:107`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:109`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:110`], while the parent transition rule says parent status changes only after child strict validation passes [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:116`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:124`]. The 007 child correction confirms the current tree still contains `scripts/skill-outcome-fold-tick.mjs` even though its store and rerank dependencies were deleted after a measured NO-GO, leaving the script orphaned and non-functional [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/implementation-summary.md:63`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/implementation-summary.md:70`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/implementation-summary.md:118`], and the script itself exits if the deleted compiled fold core is missing [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs:21`; `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs:23`; `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs:24`]. This makes the aggregate complete status misleading for release/readiness decisions.
   - Finding class: matrix/evidence
   - Scope proof: Reviewed 012 parent phase map, 002 parent status/transition rules, child status rows, 003 partial status, 004 shadow-only/pending status, 007 correction, and the surviving fold-tick script. The contradiction spans parent roll-up, child packet truth, and a live script surface.
   - Affected surface hints: `["012 parent phase map", "002 runtime parent status", "002 child validation roll-up", "skill-outcome-fold-tick.mjs", "release-readiness traceability"]`
   - Recommendation: Change the 002/012 roll-up to `partial` or `complete-with-deferred/no-go children` and either remove/disable the orphan fold-tick script or add an explicit tombstone/NO-GO owner proving it is intentionally retained but non-runnable.

```json
{
  "type": "claim-adjudication",
  "claim": "The 002 subtree is presented as complete even though child statuses and a surviving orphan script show unresolved partial/no-go work that violates the parent roll-up rule.",
  "evidenceRefs": [
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:49",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/spec.md:83",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:106",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:107",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:109",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:110",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:116",
    ".opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/implementation-summary.md:63",
    ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs:21"
  ],
  "counterevidenceSought": "Checked child corrections and adjacent child summaries for explicit operator NO-GO/deletion records. Those records explain why the 007 feature should not be revived, but they do not reconcile the parent complete status or remove/disable the surviving nonfunctional script.",
  "alternativeExplanation": "If the project defines parent 'complete' as 'routing map created, regardless of child delivery', the parent status could be intentional; however the same parent says status changes only after child strict validation passes, so the local contract contradicts that interpretation.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if a governing release-readiness rule explicitly allows phase-parent complete status with partial/no-go children and the orphan script is documented as intentionally retained/dead with no callable path."
}
```

### P2 Findings
None.

## Traceability Checks
- Confirmed ranked charter angle 9 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md:16`].
- Confirmed 002 parent and 012 parent both mark the runtime subtree complete [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:49`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/spec.md:83`].
- Confirmed child-level statuses include partial and live NO-GO entries [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:106`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/spec.md:110`].
- Confirmed the fold-tick script exists and expects the deleted compiled fold core [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs:21`; `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs:23`].

## Integration Evidence
- Exact integration surfaces reviewed: 012 phase map, 002 phase-parent status/rules, 002 child status records, 007 outcome-weighted correction, and `skill-outcome-fold-tick.mjs`.

## Edge Cases
- The 007 correction documents an operator decision not to revive outcome-weighted ranking; this lowers the issue from runtime correctness to traceability/release-readiness.
- Grep surfaced worktree copies of the script, but the active finding cites only the main workspace script and current 012/002 packet evidence.

## Confirmed-Clean Surfaces
- No P0 finding: no prompt-time path to the fold-tick script was proven.
- The 007 child correction itself is transparent about the deleted store/rerank and measured NO-GO.
- No advisor implementation files were edited.

## Ruled Out
- Ruled out a P0/P1 runtime crash on the recommend path; the script header says cron/maintenance only and no prompt-time import was reviewed.
- Ruled out treating the 007 child correction as stale prose; it directly matches the current script dependency evidence.

## Next Focus
- dimension: maintainability
- focus area: Test coverage gaps on always-on hardcoded routing
- reason: Ranked charter angle 10 follows angle 9.
- rotation status: angle 10 of 10
- blocked/productive carry-forward: Carry P1 findings from angles 1–3, 5, 7, and 9; carry P2 advisories from angles 6 and 8; angle 4 remains clean.
- required evidence: `primaryIntentBonus` branches, `readOnlyRouteAllowed` allowlists, low-info/Class-C gates, dead `deep-review` node check, direct tests versus aggregate corpus coverage.
