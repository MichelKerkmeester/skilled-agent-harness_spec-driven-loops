---
title: "Tasks: 027/002 Feedback P0 Correctness"
description: "Task list for the three P0 fixes split from 027/009: auto provenance cap broadening, manual-edge overwrite guard, and retention-sweep tier basement."
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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-feedback-p0-correctness"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Execute T001-T008"
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
# Tasks: 027/002 Feedback P0 Correctness

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

- [ ] T001 Read `mcp_server/lib/causal/causal-edges.ts`, `mcp_server/lib/causal/consolidation.ts`, and `mcp_server/lib/memory/memory-retention-sweep.ts`.
- [ ] T002 Locate existing causal-edge and retention-sweep tests; identify the smallest fixture surface for each P0.
- [ ] T003 Confirm whether auto provenance is already represented by a helper or must be introduced locally.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement P0-1: broaden automatic provenance classification to `createdBy === "auto" || createdBy.startsWith("auto-")` in causal cap paths.
- [ ] T005 Implement P0-2: query existing edge before upsert and skip automatic overwrite when existing `created_by` is non-auto.
- [ ] T006 Implement P0-3: extend `RetentionExpiredRow` and expired-row select query with tier, decay, pin, access count, and last accessed fields.
- [ ] T007 Implement the tier-aware retention deletion decision so constitutional and critical rows are not deleted solely on TTL expiry.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add focused tests for `auto-session` cap behavior, manual-edge preservation, and protected retention rows.
- [ ] T009 Run the focused causal tests.
- [ ] T010 Run the focused retention tests.
- [ ] T011 Run the repo-level OpenCode verification command selected from current package scripts.
- [ ] T012 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-feedback-p0-correctness --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are implemented.
- [ ] Tests prove all three bug classes are closed.
- [ ] No files outside the three production surfaces and focused tests changed.
- [ ] 027/009 can record this packet as its completed hard dependency.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Audit**: `../research/027-xce-research-pt-04/research.md`
- **Original Scope**: `../009-feedback-reducers/spec.md`
<!-- /ANCHOR:cross-refs -->
