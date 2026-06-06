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
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/003-metadata-edge-promoter"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Replaced scaffold defaults with metadata promoter tasks from continuation research."
    next_safe_action: "Confirm existing manual relationship parsing before creating new promoter code."
    blockers: ["004-causal-edge-tombstones should land before active stale generated-edge cleanup."]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-005-research-planning"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Confirm current parser behavior for `manual.depends_on`, `manual.supersedes`, and `manual.related_to`.
- [ ] T002 Confirm missing promotion for `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain`.
- [ ] T003 Define relation direction mapping for every supported metadata field.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create metadata relationship extractor helper.
- [ ] T005 Create generated edge-intent type and mapping table.
- [ ] T006 Create deterministic promoter for parent, child, parent-chain, and already-authored manual relationship fields.
- [ ] T007 Add generated-edge provenance/confidence storage support where absent.
- [ ] T008 Integrate promoter into `memory-index.ts` after source and target memory ids are resolvable.
- [ ] T009 Preserve manual edges when generated edges conflict.
- [ ] T010 Route stale generated-edge cleanup through Phase 004 tombstone lifecycle or leave cleanup report-only until Phase 004 lands.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Test each supported metadata field creates the expected relation direction.
- [ ] T012 Test unresolved targets warn and create no partial edge.
- [ ] T013 Test re-indexing is idempotent and creates no duplicates.
- [ ] T014 Test manual edges are not weakened by generated metadata edges.
- [ ] T015 Test stale generated-edge cleanup is tombstone-backed or report-only when tombstones are unavailable.
- [ ] T016 Run focused causal metadata tests.
- [ ] T017 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/003-metadata-edge-promoter --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Parent/child/parent-chain metadata promotions are implemented and tested.
- [ ] Existing manual relationship promotion is deduplicated rather than duplicated.
- [ ] Generated-edge stale cleanup does not bypass tombstone lifecycle.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 047 and 060
<!-- /ANCHOR:cross-refs -->
