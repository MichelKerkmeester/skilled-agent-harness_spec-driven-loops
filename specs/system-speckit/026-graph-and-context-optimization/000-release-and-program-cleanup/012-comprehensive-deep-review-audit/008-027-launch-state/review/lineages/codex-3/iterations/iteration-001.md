# Iteration 001 - Correctness

Focus: parent launch-state metadata consistency.

## Files Reviewed

| Path | Purpose |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md` | Slice scope and review contract |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md` | 027 phase-parent control surface |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json` | Parent metadata child list |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json` | Parent graph child list |

## Findings

### F001 - P1 - 027 parent metadata advertises placeholder `000-release-cleanup` as an executable child

The audit slice says the child scaffolding under review is `001-peck-teachings-adoption/` through `005-learning-feedback-reducers/` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md:57]. The 027 parent phase map nevertheless lists `000-release-cleanup/` as phase 000 with status `Placeholder` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130], and the same parent spec leaves open whether that placeholder should remain at all [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:180].

That would be harmless as a prose placeholder, but it is also serialized into machine-facing child metadata: `description.json.children` includes `000-release-cleanup` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:28], and `graph-metadata.json.children_ids` includes `system-spec-kit/027-xce-research-based-refinement/000-release-cleanup` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:7].

Impact: resume and graph traversal can treat a known placeholder as a real child phase even though the launch-state scope is 001-008. This is a required metadata fix before the 027 phase parent is release-clean.

## Claim Adjudication

| Field | Value |
|---|---|
| findingId | F001 |
| claim | Parent metadata exposes a placeholder phase as a child, conflicting with the launch-state slice's 001-008 child scope. |
| evidenceRefs | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md:57`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6` |
| counterevidenceSought | Checked parent spec open questions, phase map, description metadata, graph metadata, and the audit slice's declared scope. |
| alternativeExplanation | `000-release-cleanup` might intentionally be a non-executable placeholder. That does not explain why it is included in machine child arrays. |
| finalSeverity | P1 |
| confidence | 0.90 |
| downgradeTrigger | Downgrade if the runtime has an explicit documented rule that placeholder children without child spec metadata are legal in `children` and `children_ids`. |

Review verdict: CONDITIONAL
