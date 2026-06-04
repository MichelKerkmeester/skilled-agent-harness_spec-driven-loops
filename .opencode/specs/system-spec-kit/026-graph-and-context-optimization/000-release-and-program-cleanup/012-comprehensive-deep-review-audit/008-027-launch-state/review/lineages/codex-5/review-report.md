# Review Report - 027 Launch-State Review Slice

## Executive Summary

Verdict: **CONDITIONAL**.

The review converged after 6 iterations. No P0 findings were found. Three active P1 findings block a clean launch-state verdict, and two P2 advisories should be folded into the same cleanup pass.

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

`hasAdvisories`: true.

## Planning Trigger

Plan remediation before treating 027 as launch-clean. The work is metadata/spec-structure cleanup, not runtime code repair:

- Decide whether `000-release-cleanup/` is a real child phase or a placeholder outside the active child set.
- Regenerate renumbered child metadata so folder names, titles, trigger phrases, `specId`, `specFolder`, and parent ids agree.
- Recompute graph derived status from current spec truth and completion evidence.
- Refresh the 027 resource map after the metadata cleanup.
- Pin the 026 handoff to the exact completed 026 surface.

## Active Finding Registry

### F001 - P1 - Parent declares `000-release-cleanup/` as a phase child, but it is only a placeholder shell

Evidence:

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:28`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:7`

The parent and machine metadata list `000-release-cleanup/` as a child phase, but filesystem inspection found the subtree contains only `.gitkeep` placeholders. This conflicts with the parent claim that phases are independently executable child spec folders.

### F002 - P1 - Renumbered child metadata still exposes old phase ids and titles

Evidence:

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:29`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:2`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-semantic-trigger-fallback/description.json:2`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json:2`

The context index records the current 001-008 sequence, but child metadata still exposes stale ids such as `001` carrying `specId: 008`, `002` titled Phase 012, `007` titled Phase 008, and `008` titled Phase 009.

### F003 - P1 - Graph derived status marks draft children complete

Evidence:

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:28`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:29`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:49`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/graph-metadata.json:42`

At least two child specs say `Draft` with low completion percentages, while their graph metadata says `complete`. This can mislead graph/search/resume consumers.

### F004 - P2 - 027 resource map overstates renumbered metadata readiness

Evidence:

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:32`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:72`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:78`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33`

The map says renumbered metadata is updated and missing-on-disk is zero, but stale `specId` and phase labels remain.

### F005 - P2 - 027 launch review does not pin which 026 completion surface it builds on

Evidence:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md:37`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md:62`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:43`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md:39`

The slice asks for alignment with 026 completion, but the 026 root is still `In Progress` while the release cleanup child is `Complete`. 027 should name the exact handoff surface.

## Remediation Workstreams

| Workstream | Findings | Action |
|---|---|---|
| Child scaffold truth | F001 | Remove placeholder `000` from active children or scaffold it as a real phase parent. |
| Renumbered metadata regeneration | F002, F004 | Regenerate child descriptions/resource map from current folder names and inspect stale title/trigger fields. |
| Graph status correction | F003 | Recompute derived status from canonical spec status, continuity, and checklist evidence. |
| 026 handoff precision | F005 | Explicitly cite the completed 026 release-gate surface or explain why the in-progress 026 root is acceptable. |

## Spec Seed

Add a remediation packet that states:

- 027 launch-state metadata must be internally consistent across parent spec, description, graph metadata, context index, child specs, child descriptions, child graph metadata, and resource map.
- Placeholder-only folders cannot be listed as active children unless the validator and graph model explicitly support placeholders.
- Renumbered child metadata must not leak old phase ids in machine-facing fields.
- Derived status must not claim `complete` without matching spec/checklist/summary evidence.
- The 026 handoff must identify the specific completed 026 surface.

## Plan Seed

1. Inspect 027 parent child lists and decide whether `000-release-cleanup/` stays active.
2. Regenerate `description.json` and `graph-metadata.json` for 001-008 children.
3. Search 027 for stale phase ids (`Phase 012`, `027 phase 009`, `specId` mismatches, old parent ids).
4. Regenerate or patch 027 `resource-map.md`.
5. Re-run strict recursive validation for 027 and record output.
6. Update the launch-state review slice with the exact 026 completion surface.

## Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Parent and child metadata do not fully match declared launch structure. |
| checklist_evidence | pass | Level 1 slice has no checked checklist rows. |
| feature_catalog_code | partial | Graph-derived status conflicts with child specs. |
| playbook_capability | partial | Resource map is useful but overstates readiness. |

## Deferred Items

- Validate script diagnostics were sparse in this lineage; remediation should capture full strict-recursive output after cleanup.
- Code Graph was unavailable; graph-aware review used direct metadata files as fallback evidence.

## Audit Appendix

### Coverage

| Dimension | Covered |
|---|---|
| Correctness | yes |
| Security | yes |
| Traceability | yes |
| Maintainability | yes |

### Replay Validation

Replay over persisted JSONL matched the synthesized verdict:

- Iterations: 6.
- Last two new-findings ratios: `0.0588`, `0.0000`.
- Rolling stop average: `0.0294`.
- Active P0: 0.
- Active P1: 3.
- Active P2: 2.
- Verdict: CONDITIONAL.

### Convergence Evidence

The loop stopped after all dimensions and core traceability protocols had coverage, no new findings appeared in the stabilization pass, and the active finding set remained stable. Active P1 findings route the outcome to conditional remediation rather than PASS.
