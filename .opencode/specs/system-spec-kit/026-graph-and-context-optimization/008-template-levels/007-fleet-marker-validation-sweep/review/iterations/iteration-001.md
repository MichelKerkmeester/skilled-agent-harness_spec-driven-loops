# Deep Review Iteration 001 - implementation-spec-alignment

## Focus

D1 implementation-spec-alignment traceability review of the 007 target packet against the marker-sweep intent, 010 phase-parent metadata, 003 implementation ledger, and `create.sh` scaffold marker emission.

## Dispatcher

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep

- Iteration: 1 of 5
- Dimension: implementation-spec-alignment
- Session: `2026-05-04T08:16:07.000Z`
- Lineage: `new`, generation `1`
- Scope authority: only the approved 007 review packet was written; implementation and target spec files were read-only.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

### P1 Findings

- **F001**: 007 packet does not document the marker-sweep purpose it is supposed to authorize - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:79` - The target spec, plan, and tasks remain scaffold placeholders while the concrete marker implementation is `create.sh` appending `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS`.
- **F002**: 007 packet metadata is disconnected from the 010 phase-parent graph - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/graph-metadata.json:5` - The target graph metadata has `parent_id: null` and description `parentChain: []`, while the 010 parent graph children omit 007.

### P1-001 [P1] 007 packet does not document the marker-sweep purpose it is supposed to authorize

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:79`
- Evidence: The approved target's spec still contains scaffold placeholder content for the problem statement and purpose (`[What is broken...]`, `[One-sentence outcome statement...]`) instead of explaining the fleet marker validation sweep [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:79-83]. The scope table likewise contains placeholder deliverables and placeholder file paths [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:91-104]. Its plan has placeholder stack, overview, components, phases, test strategy, and dependencies [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md:39-49] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md:86-124], while tasks are generic scaffold tasks rather than marker-validation work [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/tasks.md:50-76].
- Impact: The packet cannot serve as the authoritative planning or release-readiness source for the marker sweep, even though the actual implementation surface is concrete: `create.sh` appends `SCAFFOLD_VALIDATION_COUNTS` to `spec.md` and `SCAFFOLD_AI_PROTOCOL_MARKERS` to Level 3+ `plan.md` [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559].
- Finding class: `matrix/evidence`
- Scope proof: Reviewed the target spec, plan, tasks, checklist, implementation-summary, and decision-record. The only marker-specific target content is the appended scaffold marker comments in `spec.md` and `plan.md`; the authored sections remain placeholder scaffold content.
- Affected surface hints: `["007 spec packet", "marker sweep authorization", "checklist evidence", "review synthesis"]`
- Recommendation: Replace scaffold placeholders with a narrow marker-sweep spec/plan/tasks/checklist that states the purpose, affected marker comments, expected validator behavior, and acceptance evidence for `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS`.

```json
{"claim":"The 007 packet does not document the marker-sweep purpose it is supposed to authorize.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:79-83",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:91-104",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md:39-49",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/tasks.md:50-76",".opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559"],"counterevidenceSought":"Checked target implementation-summary.md, decision-record.md, graph metadata, parent 010 docs, and the 003 implementation ledger for marker-sweep-specific authoring that could override the placeholders.","alternativeExplanation":"The packet may intentionally be a freshly scaffolded fixture, but the review target is the approved authority for this sweep and no separate resource-map exists at the target root.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade to P2 only if the workflow formally treats this 007 packet as a generated fixture rather than a spec packet that gates implementation or release-readiness decisions."}
```

### P1-002 [P1] 007 packet metadata is disconnected from the 010 phase-parent graph

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/graph-metadata.json:5`
- Evidence: The 007 packet lives under `008-template-levels`, but its graph metadata sets `"parent_id": null` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/graph-metadata.json:3-6], and its `description.json` has an empty `parentChain` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/description.json:2-13]. The 010 parent graph lists children `001` through `006` only, omitting `007-fleet-marker-validation-sweep` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json:6-13], while the parent spec's phase map is even older and lists only `001` through `003` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/spec.md:86-90].
- Impact: Resume, graph traversal, and memory discovery cannot reliably relate the approved 007 marker-sweep packet back to the 010 template-levels phase parent, which undermines the target authority and status checks requested for this review dimension.
- Finding class: `cross-consumer`
- Scope proof: Cross-checked the target `graph-metadata.json`, target `description.json`, 010 `graph-metadata.json`, and 010 `spec.md`; all parent-link surfaces are stale or missing for 007.
- Affected surface hints: `["graph metadata", "description metadata", "phase-parent child list", "resume routing"]`
- Recommendation: Refresh 007 metadata with the correct parent chain and update 010 child/status surfaces so 007 is represented consistently as the current marker-sweep child packet.

```json
{"claim":"The 007 packet metadata is disconnected from the 010 phase-parent graph.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/graph-metadata.json:3-6",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/description.json:2-13",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json:6-13",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/spec.md:86-90"],"counterevidenceSought":"Checked the target and parent graph/description/spec metadata for any alternate link naming or archived relationship that would explain the omission.","alternativeExplanation":"The packet may have been scaffolded after the 010 parent metadata was last generated, but the current review target depends on this relationship being discoverable.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Downgrade to P2 if the deep-review workflow intentionally permits orphan child packets and never relies on parent graph traversal for this target."}
```

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | Actual marker emission is implemented in `create.sh` [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559], but the 007 spec/plan/tasks do not describe that implementation contract [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:79-104] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md:39-49]. |
| `checklist_evidence` | fail | Checklist entries are generic scaffold checks with no marker-sweep evidence and remain unchecked [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/checklist.md:47-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/checklist.md:108-118]. |
| `resource-map` | skipped | Target `resource-map.md` is absent by configured review context; implementation scope was derived from 003's ledger and marker comments. |

## Integration Evidence

- `create.sh` idempotently appends `SCAFFOLD_VALIDATION_COUNTS` to `spec.md` only when the marker is absent [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-546].
- `create.sh` appends `SCAFFOLD_AI_PROTOCOL_MARKERS` to `plan.md` only for numeric Level 3+ scaffolds and only when absent [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:548-559].
- The 007 target contains the expected `SCAFFOLD_VALIDATION_COUNTS` block in `spec.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:240-253].
- The 007 target contains the expected `SCAFFOLD_AI_PROTOCOL_MARKERS` block in `plan.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md:279-285].
- The 003 implementation summary confirms the current template system migrated scaffolding and validation onto a Level contract path [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/implementation-summary.md:58-67].

## Edge Cases

- The marker comments themselves are not a defect in this iteration. They match the implementation and appear to be intentional validation-count/protocol-marker sentinels.
- The target `implementation-summary.md` is scaffolded; that is treated as supporting evidence for P1-001, not as a separate finding.
- The parent 010 spec is stale relative to the current child set; this was grouped under P1-002 instead of reported separately.

## Confirmed-Clean Surfaces

- Marker content in 007 `spec.md` and `plan.md` is consistent with the emission blocks in `create.sh`.
- The `create.sh` marker append logic includes duplicate guards for both marker classes.
- No target implementation files were modified during this review iteration.

## Ruled Out

- Ruled out a P0 severity: no security, data-loss, or destructive runtime behavior was found in this alignment pass.
- Ruled out treating historical `006-command-md-yaml-alignment` review artifacts as authority; this iteration used 007-local review state only.
- Ruled out flagging target `resource-map.md` absence as a finding because the prompt explicitly configured the resource-map gate as skipped.

## Assessment

Dimensions addressed: traceability, implementation-spec-alignment

## Next Focus

- Dimension: `code-correctness`
- Focus area: Check marker emission behavior in `create.sh`, including idempotence, Level 3+ gating, path assumptions, and whether validators or generated docs consume the marker comments safely.
- Carry-forward: P1-001 and P1-002 remain active and should inform release-readiness synthesis.
