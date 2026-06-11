# Iteration 3: Traceability

## Focus
Compared the root phase-parent status and phase map against direct child family parent specs and command-asset evidence.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: Root phase parent still reports planned/future-only state after all family children completed, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:10`. The root frontmatter says `status: "planned"`, the root phase map still marks all four family phases as `Planned`, and root graph metadata derives `status` as `planned`; meanwhile all four direct child family parent specs report `status: "completed"`. This can mislead resume/search/release-readiness consumers about whether the presentation split is still future work. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:10`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:116-121`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/graph-metadata.json:37-40`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/001-memory-commands/spec.md:10`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/002-speckit-commands/spec.md:10`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/003-create-commands/spec.md:10`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/004-doctor-commands/spec.md:10`]

Typed claim adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "The root phase parent still marks the command-presentation separation packet as planned/future-only even though every direct child family parent is completed.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:10",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:116-121",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/001-memory-commands/spec.md:10",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/002-speckit-commands/spec.md:10",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/003-create-commands/spec.md:10",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/004-doctor-commands/spec.md:10"
  ],
  "counterevidenceSought": "Read root spec, root graph metadata, and all four child family parent specs; checked command assets exist before classifying this as metadata/traceability drift rather than missing implementation.",
  "alternativeExplanation": "The root could intentionally preserve original scaffold status, but its purpose is aggregate phase-parent tracking and its phase map is the operator-facing status surface, so leaving it planned misroutes resume/release readiness.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if the parent is explicitly documented as immutable scaffold history and a separate aggregate status surface is generated elsewhere.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | root spec and child specs | Root aggregate status contradicts completed children. |
| checklist_evidence | partial | hard | root phase map | Parent has no checklist; phase map is stale completion evidence. |

## Assessment
This is a release-readiness traceability issue, not a command runtime failure. No P0 was assigned because the command assets can still be used directly.

## Ruled Out
- Missing command presentation assets.
- Missing workflow assets for speckit/create/doctor families.

## Dead Ends
The root `graph-metadata.json` has `last_active_child_id: null`, so it did not provide a competing current-state pointer.

## Recommended Next Focus
Maintainability pass over presentation assets and apparent field-name reuse.

Review verdict: CONDITIONAL
