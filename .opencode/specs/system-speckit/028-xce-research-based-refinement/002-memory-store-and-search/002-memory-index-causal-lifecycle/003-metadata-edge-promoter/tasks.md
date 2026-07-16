---
title: "Tasks: 027/005 Metadata Edge Promoter"
description: "Task list for deterministic metadata-derived causal edge promotion."
trigger_phrases:
  - "027 phase 005 tasks"
  - "metadata edge promoter tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter"
    last_updated_at: "2026-06-10T08:20:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed promoter tasks and evidence updates"
    next_safe_action: "Use test evidence for phase handoff"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-005-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/005 Metadata Edge Promoter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm current parser behavior for `manual.depends_on`, `manual.supersedes`, and `manual.related_to`. Evidence: `packetReferencesToCausalLinks()` remains the only manual-link path.
- [x] T002 Confirm missing promotion for `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain`. Evidence: new promoter covers these fields only.
- [x] T003 Define relation direction mapping for every supported metadata field. Evidence: `FRONTMATTER_RELATION_MAPPINGS` tested in `frontmatter-promoter.vitest.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create metadata relationship extractor helper. Evidence: `extractFrontmatterEdgeIntents()` parses graph and description metadata.
- [x] T005 Create generated edge-intent type and mapping table. Evidence: `FrontmatterEdgeIntent` plus tested mappings.
- [x] T006 Create deterministic promoter for parent, child, and parent-chain fields. Evidence: manual fields intentionally skipped to avoid duplicate existing wiring.
- [x] T007 Add generated-edge provenance/confidence storage support where absent. Evidence: schema v33 adds `confidence` and `extraction_method`.
- [x] T008 Integrate promoter into `memory-index.ts` after source and target memory ids are resolvable. Evidence: scan results include `metadataPromoter` summary.
- [x] T009 Preserve manual edges when generated edges conflict. Evidence: manual-preservation test keeps curated evidence and strength.
- [x] T010 Route stale generated-edge cleanup through Phase 004 tombstone lifecycle or leave cleanup report-only until Phase 004 lands. Evidence: stale generated edges use `sweepCausalEdges()`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Test each supported metadata field creates the expected relation direction. Evidence: `frontmatter-promoter.vitest.ts` parent, child, and parentChain cases.
- [x] T012 Test unresolved targets warn and create no partial edge. Evidence: unresolved-target test returns warning and zero edges.
- [x] T013 Test re-indexing is idempotent and creates no duplicates. Evidence: parentChain rerun keeps two rows only.
- [x] T014 Test manual edges are not weakened by generated metadata edges. Evidence: manual edge remains `created_by='manual'` with curated evidence.
- [x] T015 Test stale generated-edge cleanup is tombstone-backed or report-only when tombstones are unavailable. Evidence: stale cleanup creates a tombstone row.
- [x] T016 Run focused causal metadata tests. Evidence: `npx vitest run ...` passed 16 files, 330 tests.
- [x] T017 Run strict phase validation. Evidence: strict validation passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Parent/child/parent-chain metadata promotions are implemented and tested.
- [x] Existing manual relationship promotion is deduplicated rather than duplicated.
- [x] Generated-edge stale cleanup does not bypass tombstone lifecycle.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 047 and 060
<!-- /ANCHOR:cross-refs -->
