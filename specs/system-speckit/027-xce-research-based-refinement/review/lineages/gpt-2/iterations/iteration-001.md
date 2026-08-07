# Iteration 001: Correctness

## Focus

Reviewed parent phase inventory consistency across the parent spec, parent metadata, graph metadata, and the live phase 011 child spec.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: Parent inventory omits live phase 011 from authoritative child lists. The parent phase map enumerates phases `000` through `010` only [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140], and `description.json.children` also stops at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-38]. The same parent `graph-metadata.json` includes `011-command-presentation-workflow-separation` as a child [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18], and that child exists as a planned phase parent [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56]. This can misroute parent-driven resume, search, and phase traversal.

```json
{
  "findingId": "F001",
  "claim": "The parent packet has a live phase 011 child, but its primary phase map and description children list omit that child while graph metadata includes it.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-38",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56"
  ],
  "counterevidenceSought": "Checked parent spec phase map, parent description children, graph metadata children, and the 011 child spec metadata for an explicit exclusion or non-live status.",
  "alternativeExplanation": "The phase may have been scaffolded after the parent phase map was last edited; this explains the drift but does not remove the routing risk.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if parent resume/search code ignores spec.md and description.json child lists entirely and only consumes graph-metadata children.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

### P2, Suggestion

None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18` | Parent child inventory is inconsistent. |

## Assessment

- New findings ratio: 0.55
- Dimensions addressed: correctness
- Novelty justification: first pass found a P1 parent-level metadata contradiction.

## Ruled Out

- Missing child on disk: ruled out by live 011 `spec.md` and metadata.

## Dead Ends

- Treating 011 as out of scope: contradicted by parent graph metadata.

## Recommended Next Focus

Review security-sensitive surfaces and confirm no parent-scope vulnerability claims are hidden in the newly scaffolded 011 docs.
Review verdict: CONDITIONAL
