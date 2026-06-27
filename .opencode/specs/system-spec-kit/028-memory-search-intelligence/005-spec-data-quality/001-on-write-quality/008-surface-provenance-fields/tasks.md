---
title: "Tasks: A8 Surface Provenance Fields [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "surface provenance fields tasks"
  - "source kind json tasks"
  - "content type freshness tasks"
  - "causal summary source docs tasks"
  - "metadata json governance tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/008-surface-provenance-fields"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Broke the A8 plan into tasks"
    next_safe_action: "Start the setup baseline tasks"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "a8-tasks-authoring"
      parent_session_id: "a8-spec-authoring"
    completion_pct: 0
    open_questions:
      - "Whether content_type and document_weight have a compute site to reuse or must be derived fresh"
    answered_questions:
      - "source_kind is already computed and persisted on the memory side"
---
# Tasks: A8 Surface Provenance Fields

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Capture a Stage-0 baseline of the current JSON shape on a sample packet
- [ ] T002 Confirm the persisted source_kind read path (.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts)
- [ ] T003 Answer the content_type and document_weight compute-site question by grep across lib
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add source_kind and a provenance block as optional fields (.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts)
- [ ] T005 Add content_type, document_weight and a freshness block, reusing a compute site when found and deriving on-write when not (.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts)
- [ ] T006 Bind causal_summary freshness to source_docs (.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts)
- [ ] T007 Populate the new fields at the atomicWriteJson write seam (.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts)
- [ ] T008 Add a default-off warn-tier provenance coherence check (.opencode/skills/system-spec-kit/scripts/validation/content-quality.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify a freshly generated description.json and graph-metadata.json carry the surfaced fields
- [ ] T010 Verify a stale causal_summary is flagged and a fresh one is current, and that the legacy census of newly-failing files is 0
- [ ] T011 Run validate.sh strict on this phase folder and update the docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
