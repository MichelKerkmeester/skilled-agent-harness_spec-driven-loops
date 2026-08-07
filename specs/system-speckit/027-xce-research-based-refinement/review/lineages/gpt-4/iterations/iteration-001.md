# Iteration 001: Correctness

## Focus

Reviewed parent control-plane correctness: child membership, phase-map status claims, and consistency between parent `spec.md`, `description.json`, `graph-metadata.json`, and current child packets.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 7
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Parent child registry omits live phase 011 from authored child surfaces. The parent phase map lists only phases `000` through `010` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140], and `description.json.children` also stops at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-39]. The same parent `graph-metadata.json` includes `011-command-presentation-workflow-separation` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18], and child `011` exists as a planned phase parent [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56]. This can misroute parent-driven resume, search, and phase traversal.

```json
{
  "findingId": "F001",
  "claim": "The parent authored child surfaces omit phase 011 even though graph metadata and the child packet show 011 is a live child phase.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-39",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56"
  ],
  "counterevidenceSought": "Checked parent spec, parent description, parent graph metadata, child 011 spec, and the live folder listing for an explicit exclusion or archived status.",
  "alternativeExplanation": "The authored spec and description might lag graph-only metadata generation, but phase-parent docs are operator-facing child registries, so lag still creates a required wayfinding defect.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade to resolved once parent spec and description include 011 or explicitly document why graph metadata intentionally leads authored surfaces.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Parent phase map status column is stale for shipped child tracks. The parent map still says `002-memory-write-safety` is `Spec-scaffolded` and `008`/`009` are `Spec-scaffolded` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:129-139], while the parent rule says aggregate progress is tracked via this map [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:160]. Child 002 reports `Complete (2026-06-10)` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:56-64], and child 008 and 009 both report `Complete` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/spec.md:41-46] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-openltm-continuity-resilience/spec.md:41-46]. This can direct operators toward already-shipped work.

```json
{
  "findingId": "F002",
  "claim": "The parent phase map represents shipped child phases as scaffolded even though child specs report them complete and the parent map is the documented aggregate-progress surface.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:129-139",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:160",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:56-64",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/spec.md:41-46",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-openltm-continuity-resilience/spec.md:41-46"
  ],
  "counterevidenceSought": "Checked whether the parent map might be historical rather than live; the Phase Transition Rules say parent aggregate progress is tracked via the map.",
  "alternativeExplanation": "The status labels could have been left as original scaffold status, but the map mixes `Complete` for 010 with stale labels for shipped siblings, so it is not consistently historical.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to resolved once parent status rows are reconciled with child specs or a distinct status vocabulary is documented.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18` | F001 and F002 remain active. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: first iteration; both P1s are independent parent-control defects.

## Ruled Out

- P0 escalation for F001: child 011 exists and graph metadata preserves it, so there is no data loss.

## Dead Ends

- No source-code review was useful for this pass because the defect is in spec-folder control-plane metadata.

## Recommended Next Focus

Security pass over the docs-only scaffold and shipped-default-off posture.
Review verdict: CONDITIONAL
