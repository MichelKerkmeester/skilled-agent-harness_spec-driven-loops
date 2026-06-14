# Iteration 4: Maintainability

## Focus
Maintainability dimension. Check documentation quality, continuity metadata freshness, cross-surface consistency, and handover accuracy.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.30

## Findings

### P0, Blocker

(none)

### P1, Required

(none)

### P2, Suggestion

- **F010**: Parent spec.md _memory.continuity.next_safe_action stale, `spec.md:27`, Says "Validate recursively and commit the regroup" but the regroup already happened (2026-06-14). Action already completed.
- **F011**: 000-release-cleanup _memory.continuity.next_safe_action stale, `000-release-cleanup/spec.md:17`, Says "Implement child phase 001-public-root-readme last" but _memory.completion_pct is 100 and recent_action says "All 9 children shipped". Contradictory: work is complete but next_safe_action points to remaining work.
- **F012**: handover.md _memory.continuity stale on all progress fields, `handover.md:14-27`, completion_pct 55, next_safe_action references phases 011-015 and packet 145 which have been regrouped into the six-track structure. last_updated_at 2026-06-10 predates the regrouping.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | n/a | No normative maintainability claims |
| checklist_evidence | skipped | hard | n/a | Phase parent: no checklist |

## Assessment
- New findings ratio: 0.30
- Dimensions addressed: maintainability
- Novelty justification: All three findings are stale _memory.continuity fields — a pattern across the packet where regrouping invalidated prior next_safe_action values

## Ruled Out
- graph-metadata.json derived.last_save_at (2026-06-12): close enough to the regrouping date; not flagged separately

## Dead Ends
- (none)

## Recommended Next Focus
Iteration 5: Stabilization pass. Replay all findings, verify none have been resolved, check for new issues in areas not yet covered.

## Claim Adjudication Packets

```json
{
  "findingId": "F010",
  "claim": "Parent spec.md _memory.continuity.next_safe_action references an action that has already been completed.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:27"
  ],
  "counterevidenceSought": "Checked if the regroup is actually complete — context-index.md and the six-track structure confirm it is. Checked if 'validate recursively' is still pending — validate.sh --recursive would be the next step but the regroup itself is done.",
  "alternativeExplanation": "Could mean 'validate the regroup' is still pending, but the wording 'commit the regroup' implies the regroup hasn't been committed yet, which is false.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "Already P2. Resolved if next_safe_action is updated.",
  "transitions": []
}
```

```json
{
  "findingId": "F011",
  "claim": "000-release-cleanup _memory.continuity.next_safe_action contradicts completion_pct: 100 and recent_action: 'All 9 children shipped'.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:17",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:27",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:16"
  ],
  "counterevidenceSought": "Checked if 001-public-root-readme is actually incomplete — it exists on disk with a spec.md. Checked if the 'last' in next_safe_action means 'do this last among all tracks' rather than 'this is still pending'.",
  "alternativeExplanation": "Could be a sequencing note ('do this last') rather than a pending action. But the phrasing 'Implement child phase 001-public-root-readme last' reads as an action to take, not a completed note.",
  "finalSeverity": "P2",
  "confidence": 0.82,
  "downgradeTrigger": "Already P2. Resolved if next_safe_action is updated to reflect completion.",
  "transitions": []
}
```

```json
{
  "findingId": "F012",
  "claim": "handover.md _memory.continuity fields are stale: completion_pct, next_safe_action, and last_updated_at all predate the six-track regrouping.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/handover.md:14-27"
  ],
  "counterevidenceSought": "Checked if handover.md is still actively used for resume — it references phases 011-015 and packet 145 which no longer exist in their original form. The handover is stale but not harmful since the regrouping superseded it.",
  "alternativeExplanation": "The handover may be intentionally preserved as historical context. But _memory.continuity fields should reflect current state.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "Already P2. Resolved if handover.md is updated or archived.",
  "transitions": []
}
```

Review verdict: PASS
