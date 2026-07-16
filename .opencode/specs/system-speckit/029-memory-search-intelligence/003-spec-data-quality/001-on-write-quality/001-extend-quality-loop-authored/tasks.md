---
title: "Tasks: A1 Extend the Live Quality Machinery to Authored Specs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "a1 extend quality loop authored tasks"
  - "computeMemoryQualityScore seam tasks"
  - "content quality validate rule tasks"
  - "reviewPostSaveQuality workflow tasks"
  - "authored write surface quality tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored"
    last_updated_at: "2026-07-04T17:11:59.952Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored PLANNED task breakdown for H1 H2 H3"
    next_safe_action: "Start T004 H1a score graph-metadata.json at the atomicWriteJson seam"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-005-001-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A1 Extend the Live Quality Machinery to Authored Specs

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

- [ ] T001 Confirm the pure scorer and reviewer exports are importable (`quality-loop.ts`, `post-save-review.ts`)
- [ ] T002 Confirm BOTH metadata-JSON write seams line up with the spec: `graph-metadata.json` at the atomicWriteJson seam (`generate-context.ts`) and `description.json` at the savePerFolderDescription seam (`workflow.ts`), plus the reviewer call site (`workflow.ts`)
- [ ] T003 [P] Confirm the warn-rule registry contract next to the shape rules (`validator-registry.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 H1a score `graph-metadata.json` at the atomicWriteJson seam (`:587`) report-only (`scripts/memory/generate-context.ts`)
- [ ] T005 H1b score the post-merge `description.json` payload that savePerFolderDescription writes (merged by getDescriptionWritePayload), not the call-site argument, at the seam (`:1683`, `:1720`, via runWorkflow) report-only (`scripts/core/workflow.ts`)
- [ ] T006 H1 adapt the markdown-body-shaped scorer input per seam and assert byte-identity of each written JSON body against the exact bytes scored (post-merge payload for description.json, call-site payload plus newline for graph-metadata.json) (`scripts/memory/generate-context.ts`, `scripts/core/workflow.ts`)
- [ ] T007 H2 extend the reviewPostSaveQuality call to the authored spec-doc artifacts (`scripts/core/workflow.ts`)
- [ ] T008 H3 add the CONTENT_QUALITY rule body default-off and warn (`scripts/validation/content-quality.ts`)
- [ ] T009 H3 register the rule next to the shape rules at severity warn (`scripts/lib/validator-registry.json`)
- [ ] T010 Add a grep guard that no new path reaches runQualityLoop or attemptAutoFix (`scripts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the byte-identity check on BOTH metadata JSONs at both write seams
- [ ] T012 Run CONTENT_QUALITY against the legacy corpus and confirm a warning with exit 0
- [ ] T013 Update spec, plan, and this task list to reflect the shipped state
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
