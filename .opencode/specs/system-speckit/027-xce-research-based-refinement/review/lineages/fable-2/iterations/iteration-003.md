# Iteration 003 — Traceability (incl. mandatory Resource Map Coverage pass)

Session: `fanout-fable-2-1781112180955-4japyt` | Dimension: traceability | Status: insight

## Scope Reviewed

`resource-map.md` (parent), `context-index.md`, `graph-metadata.json`, checklist inventory across all children, `010-mcp-to-cli-tool-transition/004-release-and-program-cleanup/` checklist evidence sample, on-disk verification of `003-memory-index-causal-lifecycle` nested children. `applied/T-*.md` cross-check: N/A — no `applied/` directory exists in this packet.

## Findings

### F005 — P1 — Resource map scope-frozen at 2026-06-04; omits all implementation surfaces for phases 002–011 and carries a stale graph-metadata claim

The parent `resource-map.md` declares itself a parent-aggregate map "focused on renumbered metadata and the peck-derived feature under `001-peck-teachings-adoption/`" with 27 references, generated 2026-06-04 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:30-34]. Since then, 002/008/009 went Complete and 006/007 gained Implemented leaves (iteration 1 evidence), yet none of their implementation surfaces are mapped — e.g. 002's shipped scrubber module named in its own tasks [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/tasks.md:78] has no resource-map entry. The map also asserts "last active child is `002-memory-write-safety`" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:74], contradicted by the live metadata `"last_active_child_id": null` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:236].

Coverage-gate classification:
- **Entries touched**: the 11 Specs entries (parent metadata + 001 children) — though their notes are stale relative to later phases.
- **Entries not touched, expected-by-scope**: the 16 Skills entries (declared read-only evidence/candidates [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:43]).
- **Implementation paths absent from the map (gap)**: all phase 002–011 work surfaces (memory write-safety scrubber, OpenLTM observability/continuity surfaces, dual-stack CLI bins, command-presentation workstream).
`finding_class: resource-map-gap` | category: resource-map-coverage

### F006 — P2 — context-index.md "Current 027 child folder" column stale and self-inconsistent after the 003 consolidation

The migration bridge lists `003-incremental-index-foundation/`, `004-causal-edge-tombstones/`, `005-metadata-edge-promoter/`, `006-write-path-reconciliation/` as current top-level 027 children [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:35-38] while simultaneously assigning `004-semantic-trigger-fallback/` and `005-learning-feedback-reducers/` to the same slots [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:39-40]. On disk, the index/causal phases live nested under `003-memory-index-causal-lifecycle/{001-incremental-index-foundation,002-causal-edge-tombstones,003-metadata-edge-promoter,004-write-path-reconciliation}` (verified by directory listing). A reader following the bridge lands on non-existent top-level folders.
`finding_class: stale-migration-bridge`

### F001 refinement (observation, not a new finding)

During this iteration, four NEW phase children `012-causal-traversal-bfs/`, `013-vector-read-path-resilience/`, `014-packed-bm25-field-weights/`, `015-storage-adapter-ports/` appeared on disk (directory mtimes 2026-06-10 19:48:32–34 local — created mid-review by a concurrent session; absent from this lineage's 17:42 UTC inventory). Each is a fully-formed packet (spec/plan/tasks/implementation-summary/metadata). They are absent from all three parent inventory surfaces, but because they are in-flight concurrent work, this is recorded as volatile churn under F001's umbrella, to be re-checked at stabilization (iteration 5) rather than adjudicated now.

## Traceability Protocol Results

| Protocol | Class | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core/hard | **partial** | Parent map vs on-disk children and graph metadata disagree (F001, F002) |
| `checklist_evidence` | core/hard | **pass** | 002 CHK-030/CHK-065 independently re-verified (iteration 2); 010/004 sample fully checked with evidence, 0 unchecked items, spec Complete [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/004-release-and-program-cleanup/checklist.md:46-48]; parent checklist absent by lean-trio design |
| `feature_catalog_code` | overlay/advisory | **partial** | Resource map omits phase 002–011 surfaces (F005) |
| `playbook_capability` | overlay/advisory | **n/a** | Spec-folder target owns no playbook surface |

## Adversarial Self-Check

F005 P1 challenged: "the map declares its own narrow scope, so omission is by design." Rejected as full defense — the deep-review coverage gate treats the parent resource map as the packet inventory baseline, and the map's own Specs section claims to track parent metadata whose statements (line 74) are now factually wrong; scope declaration mitigates to P1 (not P0), it does not excuse the stale claim. 012–015 deliberately NOT adjudicated (mid-flight concurrent churn; timestamps prove creation during this review).

## Next Focus

Iteration 4 — maintainability: changelog index coherence, timeline/before-vs-after, continuity frontmatter, phase-parent content discipline.

Review verdict: CONDITIONAL
