# Iteration 002: Workflow and Presentation Contract Traceability

## Focus

- Dimension: traceability.
- Checked the root claim that command Markdown becomes a thin router to an existing workflow file and a dedicated presentation file.

## Scorecard

- Dimensions covered: traceability.
- Files reviewed: 6.
- New findings: P0=0 P1=1 P2=0.
- Refined findings: P0=0 P1=0 P2=0.
- New findings ratio: 1.00.

## Findings

### P0, Blocker

- None.

### P1, Required

- **F002**: Root contract promises workflow-asset separation, but the memory family has no workflow YAML. The root purpose says each command Markdown becomes a thin router to the existing owned workflow file plus a presentation file. The memory routers explicitly state that no memory workflow YAML exists and keep local routing in the command files, and the memory router-rewire summary records this as a known gap. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md:75] [SOURCE: .opencode/commands/memory/save.md:15] [SOURCE: .opencode/commands/memory/search.md:15] [SOURCE: .opencode/commands/memory/manage.md:15] [SOURCE: .opencode/commands/memory/learn.md:15] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire/implementation-summary.md:56-63] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire/implementation-summary.md:101-104]

### P2, Suggestion

- None.

## Claim Adjudication Packets

```json
{
  "findingId": "F002",
  "claim": "The root two-asset separation contract is not true for the memory command family because no memory workflow YAML exists and routing remains in command Markdown.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md:75",
    ".opencode/commands/memory/save.md:15",
    ".opencode/commands/memory/search.md:15",
    ".opencode/commands/memory/manage.md:15",
    ".opencode/commands/memory/learn.md:15",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire/implementation-summary.md:56-63",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire/implementation-summary.md:101-104"
  ],
  "counterevidenceSought": "Checked memory command routers, memory assets glob for YAML files, and the memory router-rewire implementation summary.",
  "alternativeExplanation": "The implementation intentionally avoided dangling YAML references, but the root spec still presents the two-asset model without the known exception.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if the root spec is updated to document memory as an explicit exception or workflow YAML assets are added and routers point to them.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | fail | hard | `spec.md:75`, `memory/search.md:15` | Parent workflow-asset claim is false for memory. |

## Assessment

- New findings ratio: 1.00.
- Dimensions addressed: traceability.
- Novelty justification: separate root claim-vs-implementation gap, not a duplicate of F001.

## Ruled Out

- Presentation-asset extraction itself is not disputed; memory routers do reference presentation Markdown.

## Dead Ends

- No memory workflow YAML exists under `.opencode/commands/memory/assets/`.

## Recommended Next Focus

Maintainability pass on transition instructions and operator-facing references.
Review verdict: CONDITIONAL
