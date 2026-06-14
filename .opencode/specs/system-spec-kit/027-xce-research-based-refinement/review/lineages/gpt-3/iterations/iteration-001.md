# Iteration 1: Correctness

## Focus
Reviewed parent/child inventory consistency for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0000

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Parent inventory omits existing phase 011 from authoritative surfaces. The parent phase map enumerates `000` through `010` only [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140], and `description.json.children` also stops at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-38]. The same parent graph metadata includes `011-command-presentation-workflow-separation` as a child [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18], and that child has a live phase-parent spec marked Planned [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56]. This can misroute resume/search/phase traversal through parent control surfaces.

```json
{
  "findingId": "F001",
  "claim": "The parent packet's authored child inventory omits an existing 011 child that graph metadata and disk-backed child docs expose.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-38",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56"
  ],
  "counterevidenceSought": "Checked the parent phase map, description children, graph children, and 011 child spec for an intentional exclusion marker; none was found.",
  "alternativeExplanation": "The 011 phase may have been added after the parent spec was last refreshed, but that still leaves parent control surfaces stale.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if the runtime demonstrably ignores parent spec and description child inventories for resume/search/phase traversal and graph metadata is the only authoritative source.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pending | hard | - | Deferred to traceability pass. |

## Assessment
- New findings ratio: 1.0000
- Dimensions addressed: correctness
- Novelty justification: First pass found a parent control-plane contradiction.

## Ruled Out
- Runtime-code defect claims were not made in this metadata-only pass.

## Dead Ends
- None.

## Recommended Next Focus
Security and safety-sensitive status claims.
Review verdict: CONDITIONAL
