# r2-15 cross-phase-citations

**Angle summary**: Audited the cross-phase dependency citations (026 before A1/B1/B2, 015 before Tier-C, the build-order in 028) for id resolution, children_ids vs phase-map consistency, and dangling or circular references. Every folder id and every cited research line resolves, but three phrasing-level wiring drifts exist between the parent build-order and the canonical child specs. All findings are SPEC-PREMISE because the packet is research-only with no live code wired.

## What checked clean (with evidence)

- All 28 `children_ids` in `graph-metadata.json:6-35` match 1:1 the 28 phase-map rows at `spec.md:157-206` and the 28 real folders on disk. No orphan, no dangling, no extra.
- Every build-order folder citation resolves to a real folder: 001-a1, 011-b1, 012-b2, 026-shared-safe-fix-engine, 015-c2-prodmode-recall-gate, 027-retrieval-floor-experiment (confirmed by `ls`).
- The 028 research line-citations land in the correct sections: `research.md:55-66` is the Tier-D NO-GO table (10 rows), `research.md:78-85` is the novel non-GO table, `research.md:104-118` is section 5 the governance layer. Cited from `028-governance-rollout/spec.md:66,83`.
- Reciprocal edges are bidirectionally consistent on the core: 026 names 001-a1, 011-b1, 012-b2 as front doors at `026-shared-safe-fix-engine/spec.md:82-84` and `:215`, and 015 gates the Tier-C retrieval candidates at `015-c2-prodmode-recall-gate/spec.md:65`.
- The non-resolving slugs surfaced by a broad grep (`031-stage-0-init`, `005-release-cleanup`, `031-spec-data-quality`) are benign: a frontmatter session_id and historical reorg records at `handover.md:36`, not live dependency citations.

## FINDINGS

### Finding 1 (P2 advisory): Self-referential build-order edge, 015 cited as shipping "before every Tier-C item" but 015 is itself a Tier-C item
- **Evidence**: parent `spec.md:183` calls 015 "the unblocker for every Tier-C item" and `spec.md:211` says it "ships before every Tier-C item", restated at `implementation-summary.md:70`. Tier-C is defined as 014-018 at `spec.md:180-186`, which includes 015. The canonical child scopes it correctly: `015-c2-prodmode-recall-gate/spec.md:65` reads "every Tier-C retrieval candidate (C1, C3, C4, C5)", that is the four OTHER items, excluding C2 itself. The parent phrasing is literally self-including. Under the topological-sort contract the 028 child asserts at `028-governance-rollout/spec.md:113` (REQ-001, "no stage precedes a stage it depends on"), a self-edge is unsatisfiable, so a builder taking the parent wording at face value hits a self-cycle. Fix is "every other Tier-C item" or "every Tier-C retrieval candidate".
- **Type**: SPEC-PREMISE.

### Finding 2 (P2 advisory): Edge-count drift, parent says the build order is "fixed by two dependencies" while the canonical governance child says five inviolable edges
- **Evidence**: parent `spec.md:208-211` heads "Build-Order Dependencies" with exactly two bullets, and `implementation-summary.md:70` states "The build order is fixed by two dependencies." The canonical sequencer says otherwise: `028-governance-rollout/spec.md:66,78,113` and `research.md:108` name "five inviolable dependency edges" (census before gate, engine before front doors, backfill before error, coverage guard before retrieval trust, C2 before retrieval promotion). The parent never signals the other three edges exist or that 028 owns the full sequence, so a reader reconciling parent against 028 sees 2 vs 5 with no bridge. The two the parent lists are the only two folder-to-folder edges, the other three are intra-migration beats, but the parent does not say so.
- **Type**: SPEC-PREMISE.

### Finding 3 (P2 advisory): Incomplete dependent set on the 026 edge, parent names only A1/B1/B2 but the canonical child adds B3 and the C-class detectors
- **Evidence**: parent `spec.md:204,210` says "A1, B1 and B2 all reuse it". The child claims more: `026-shared-safe-fix-engine/spec.md:62` "five keystone front doors converge on one shared core", `:85` "013-b3 is a detector that emits queue rows", and `:215` "Depended on by A1, B1, B2 (and B3, C-class detectors)". If 013-b3 and the Tier-C detectors register in 026's frozen registry they depend on 026 shipping first, yet the parent build-order edge omits them, so a reader could sequence 013 or 014-018 ahead of 026. Blast radius stays low because 026 already ships before 001 which precedes all of them. There is also a within-child count wobble: `026/spec.md:62` "five keystone front doors" vs `026/spec.md:128` SC-001 "three write-time front doors (A1, B1, B2)".
- **Type**: SPEC-PREMISE.
