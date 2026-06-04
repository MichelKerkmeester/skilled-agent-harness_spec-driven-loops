# Iteration 004 - Maintainability

## Focus

Derived status and resume/search truth.

## Finding

### F003 - P1 - Graph derived status marks draft children complete

`003-incremental-index-foundation/spec.md` says the child is only `10` percent complete in continuity [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:28] and has human-authored status `Draft` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48]. Its `graph-metadata.json` says derived status is `complete` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42].

The same contradiction appears in `006-write-path-reconciliation`: continuity says `completion_pct: 10` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:29], the spec status is `Draft` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:49], and graph metadata says `complete` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/graph-metadata.json:42].

Impact: graph and memory consumers can route these children as completed work even though their own specs say they are draft scaffolds. This undermines the 027 launch-state claim that the parent is ready for safe resume and wayfinding. Fix by regenerating derived graph status from canonical spec status and completion evidence.

Claim adjudication packet:

```json
{
  "findingId": "F003",
  "claim": "At least two 027 child graph metadata files mark draft children complete, contradicting their own spec status and completion percentages.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:28",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:49",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/graph-metadata.json:42"
  ],
  "counterevidenceSought": "Checked child specs, continuity percentages, and graph metadata derived status fields.",
  "alternativeExplanation": "The graph status may have been generated from implementation-summary presence, but the specs themselves remain draft with low completion percentages.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade to P2 if graph consumers never use derived status for search, resume, or release readiness."
}
```

## Verdict Rationale

One P1 was found. No P0 was found.

Review verdict: CONDITIONAL
