# Iteration 3: Traceability

## Focus
Reviewed parent `resource-map.md`, core traceability protocols, and child 011 coverage.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.8333

## Findings

### P0, Blocker
- None.

### P1, Required
- **F002**: Parent resource map excludes existing phase 011 and its child scope. The map reports 27 references and says its scope is the parent aggregate focused on renumbered metadata and peck-derived work [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:30-33]. Its spec entries list parent and peck paths only, not `011-command-presentation-workflow-separation` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:70-82]. The omitted 011 phase has four planned child families [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:116-121]. Because resource-map coverage is a first-class audit input, this is a real coverage gap.

```json
{
  "findingId": "F002",
  "claim": "The parent resource map does not cover the existing 011 phase or its child-family scope.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:30-33",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:70-82",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:116-121"
  ],
  "counterevidenceSought": "Searched parent map sections and compared against the 011 phase spec and graph metadata child inventory.",
  "alternativeExplanation": "The map may intentionally focus on older renumbering and peck provenance, but its title and summary describe a parent-level path ledger, so the missing live child is still a gap.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to P2 if a separate current resource map is designated as authoritative for phase 011 and linked from the parent.",
  "transitions": [{ "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2, Suggestion
- F003 carried forward from iteration 2.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18` | Parent spec and graph metadata disagree on child set. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:18-31` | Parent has no checklist; status evidence is distributed. |
| feature_catalog_code | partial | advisory | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:70-82`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:116-121` | Resource-map catalog misses 011. |
| playbook_capability | partial | advisory | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:157-162` | Resume/transition instructions are undermined by child-inventory drift. |

## Assessment
- New findings ratio: 0.8333
- Dimensions addressed: traceability
- Novelty justification: Resource-map coverage is separate from the phase-map metadata defect.

## Ruled Out
- No separate 011 resource-map link was found in the reviewed parent map.

## Dead Ends
- Checklist evidence cannot be fully evaluated at the parent because the parent has no checklist file.

## Recommended Next Focus
Maintainability drift in shipped-state and current-state prose.
Review verdict: CONDITIONAL
