# Deep Review Report - 027 Launch-State

## Executive Summary
Verdict: CONDITIONAL

The 027 launch-state packet is structurally close enough to navigate, but it is not clean to ship as-is. The run found no P0 findings, three active P1 findings, and two P2 advisories. The blocking risk is traceability: current folder paths and parent phase maps mostly say 001-008, while child description IDs, derived graph statuses, and one active dependency line still preserve stale pre-renumbering or false-completion state.

Active counts:
- P0: 0
- P1: 3
- P2: 2
- hasAdvisories: true

Scope reviewed:
- 027 parent `spec.md`, `description.json`, `graph-metadata.json`, `context-index.md`, and `resource-map.md`
- Top-level child metadata and representative child specs
- 001 and 008 phase-parent scaffolding samples
- 002 safety dependency and 003-006 status/completion evidence

## Planning Trigger
Route to remediation planning before treating 027 launch state as clean. The active P1s are small metadata/doc fixes, but they affect resume/search/graph truth:
- Refresh top-level child `description.json` identity fields after the 001 insertion.
- Reconcile 003-006 completion truth across graph metadata, child specs, and implementation summaries.
- Replace stale `027/009-feedback-reducers` dependency text with the current 008 reducer packet path.

## Active Finding Registry
| ID | Severity | Category | Finding | Evidence |
|----|----------|----------|---------|----------|
| F001 | P1 | status-truth | Phases 003-006 are graph-complete while their specs and implementation summaries still read draft/placeholder. | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:3` |
| F002 | P1 | dependency-safety | Memory-write-safety still gates a nonexistent 027/009 reducer packet instead of current 008 reducers. | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:64`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:164`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:37` |
| F003 | P1 | metadata-identity | Top-level child description specIds are stale after renumbering. | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:14`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:27`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json:40`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json:53` |
| F004 | P2 | phase-map | The 000 placeholder is advertised as a child phase even though it has no spec or metadata. | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6` |
| F005 | P2 | phase-parent-docs | The parent says spec.md is the only authored parent document while parent-level context/resource maps also exist. | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:88`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:22` |

## Remediation Workstreams
1. Metadata identity refresh: regenerate or patch top-level child `description.json` files so `specId` matches the actual `NNN-` folder number, or explicitly document/spec a historical-identity contract and prove consumers do not use `specId` for routing.
2. Status truth reconciliation: decide whether 003-006 are complete or draft. If complete, populate implementation summaries and child spec statuses with evidence. If draft, downgrade graph `derived.status` from `complete`.
3. Dependency path cleanup: update 002's active dependency/handoff metadata from `027/009-feedback-reducers` to `027/008-learning-feedback-reducers`.
4. Placeholder policy cleanup: either remove `000-release-cleanup` from child metadata or add a minimal spec/description/graph trio if it is meant to be an actual child.
5. Lean-parent wording: change the parent note from "ONLY authored document" to a narrower statement that heavy implementation docs live in children while parent support docs such as `context-index.md` and `resource-map.md` may exist.

## Spec Seed
Add a small follow-up spec or amendment with this scope:
- Refresh 027 top-level metadata after peck insertion.
- Reconcile graph status truth for 003-006.
- Normalize active dependency references from stale 009 reducer wording to current 008 reducer packet.
- Preserve context-index as the migration-history bridge; keep parent spec free of migration narration.

Acceptance criteria:
- Every top-level child `description.json.specId` matches its folder prefix, or the contract explains why not and all consumers are verified safe.
- Parent graph `children_ids`, parent description `children`, and folder contents agree on whether `000-release-cleanup` is a real child or placeholder.
- 003-006 graph statuses match child spec and implementation-summary evidence.
- 002 and 008 dependency wording agree.

## Plan Seed
1. Inventory current 027 top-level child metadata.
2. Apply identity/status/path fixes in the smallest possible set of metadata/doc files.
3. Run direct JSON parse checks for all changed JSON metadata.
4. Run strict/recursive spec validation when the local validator orchestrator dependency is available.
5. Re-run this launch-state review slice or a focused traceability pass.

## Traceability Status
| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Parent phase map and child paths mostly align, but F001-F004 leave active traceability drift. |
| `checklist_evidence` | pass | The Level 1 audit slice has no checklist.md, so checked-item evidence is vacuous. |
| `feature_catalog_code` | not applicable | The target is a planning/spec launch-state packet, not a feature catalog surface. |
| `playbook_capability` | not applicable | No executable playbook surface is in scope. |

## Deferred Items
- F004 is advisory because recursive validation skips placeholder child folders that lack both `spec.md` and `description.json`.
- F005 is advisory because context-index is an allowed migration bridge; the issue is wording clarity, not the existence of the file itself.
- The local strict validator was not used as final evidence because it exits before rule execution when neither compiled orchestrator nor local TSX loader is available in this worktree.

## Audit Appendix
Iterations:
- 001 correctness: F001
- 002 security: F002
- 003 traceability: F003, F004
- 004 maintainability: F005
- 005 stabilization: no new findings

Convergence:
- All four dimensions covered.
- Stabilization pass found no new P0/P1 findings.
- Claim adjudication packets recorded for F001, F002, and F003.
- Final verdict is CONDITIONAL because active P1 findings remain.

Lineage constraints:
- Artifact root was bound directly to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/lineages/codex-2`.
- `resolveArtifactRoot` was not invoked.
- No reviewed files were modified.
