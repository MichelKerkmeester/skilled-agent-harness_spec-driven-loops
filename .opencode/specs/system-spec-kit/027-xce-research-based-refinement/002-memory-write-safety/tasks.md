---
title: "Tasks: 027/002 Memory Write Safety"
description: "Task list for the three P0 fixes split from 027/005: auto provenance cap broadening, manual-edge overwrite guard, and retention-sweep tier basement."
trigger_phrases:
  - "027 phase 002"
  - "feedback P0 correctness"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "retention-sweep tier basement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Execute T001-T015 against current storage/governance paths"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-012-feedback-p0-correctness-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 027/002 Memory Write Safety

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

- [ ] T001 Read `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/storage/consolidation.ts`, and `mcp_server/lib/governance/memory-retention-sweep.ts`.
- [ ] T002 Locate existing causal-edge and retention-sweep tests; identify the smallest fixture surface for each P0.
- [ ] T003 Confirm whether auto provenance is already represented by a helper or must be introduced locally.
- [ ] T004 Confirm `memory_index` exposes tier, pin, decay, access-count, and last-access fields needed for retention protection.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement P0-1: broaden automatic provenance classification to `createdBy === "auto" || createdBy.startsWith("auto-")` in causal insert cap paths.
- [ ] T006 Apply the same automatic provenance classification to consolidation strengthening caps.
- [ ] T007 Implement P0-2: query existing edge provenance before upsert and skip automatic overwrite when existing `created_by` is non-auto.
- [ ] T008 Implement P0-3: extend `RetentionExpiredRow` and expired-row select query with tier, decay, pin, access count, and last accessed fields.
- [ ] T009 Implement the tier-aware retention deletion decision so constitutional, critical, pinned, or recently accessed rows are not deleted solely on TTL expiry.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add focused tests for `auto-session` cap behavior in insert and consolidation paths.
- [ ] T011 Add focused tests for manual-edge preservation when automatic/reducer upsert conflicts.
- [ ] T012 Add focused tests for protected retention rows and unprotected expired rows.
- [ ] T013 Run the focused causal tests.
- [ ] T014 Run the focused retention tests.
- [ ] T015 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are implemented.
- [ ] Tests prove all three bug classes are closed.
- [ ] No files outside the three production surfaces and focused tests changed.
- [ ] 005-learning-feedback-reducers can record this packet as its completed hard dependency.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Audit**: `../research/027-xce-research-pt-04/research.md`
- **Downstream Dependency**: `../005-learning-feedback-reducers/spec.md`
<!-- /ANCHOR:cross-refs -->
