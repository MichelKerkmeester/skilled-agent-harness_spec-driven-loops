# Iteration 001 - Correctness

## Dispatcher
- Focus dimension: correctness
- Review target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`
- State packet: `review/lineages/codex-2`

## Files Reviewed
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/graph-metadata.json`

## Findings - New
### P1
- **F001**: Phases 003-006 are graph-complete while their specs and implementation summaries still read draft/placeholder - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42` - The child graph status says `complete`, but the same child's spec metadata still says `Draft` and the implementation summary description says no implementation changes are claimed until the file is completed. The same pattern repeats across 004-006. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:3`]

### P2
- None.

## Claim Adjudication
```json
[
  {
    "findingId": "F001",
    "claim": "Graph metadata marks top-level phases 003-006 complete even though their own specs and implementation summaries still describe draft or placeholder state.",
    "evidenceRefs": [
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:3"
    ],
    "counterevidenceSought": "Checked sibling phase graph metadata, specs, and implementation summaries for 004-006; the same graph-complete versus draft/placeholder pattern repeats.",
    "alternativeExplanation": "The graph status may have been generated from a stale completion heuristic rather than current human-authored evidence.",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "Downgrade if populated implementation summaries or completion checklists are added and the draft spec statuses are intentionally retained as historical labels."
  }
]
```

## Confirmed-Clean Surfaces
- The parent phase map itself labels 003-006 as `Draft`, so the stale truth source appears concentrated in derived graph metadata rather than the parent prose. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:133`]

## Next Focus
Security/safety pass on dependency gates and reducer sequencing.

Review verdict: CONDITIONAL
