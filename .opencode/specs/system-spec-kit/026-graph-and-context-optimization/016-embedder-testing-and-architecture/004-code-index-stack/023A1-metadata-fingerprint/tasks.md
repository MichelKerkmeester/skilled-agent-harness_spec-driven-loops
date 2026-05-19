---
title: "Tasks: 023A1 Metadata Fingerprint"
description: "Task tracking for metadata persistence, compatibility refusal, prompt-policy enforcement, daemon isolation, tests, and documentation."
trigger_phrases:
  - "023A1 tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023a1-metadata-fingerprint"
    last_updated_at: "2026-05-19T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Tracked completed 023A1 implementation"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:023a1metadatafingerprint000000000000000000000000000000000003"
      session_id: "023a1-metadata-fingerprint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 023A1 Metadata Fingerprint

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Confirm Gate 3 answer E and packet path.
- [x] T002 Load system-spec-kit, sk-code, and mcp-coco-index skills.
- [x] T003 [P] Read 023F cross-packet impact.
- [x] T004 [P] Read 023C implementation summary.
- [x] T005 [P] Read target code surfaces and existing tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add `index_metadata.py`.
- [x] T007 Add atomic metadata write and backfill helper.
- [x] T008 Move prompt policy into embedder registry with upstream-style params.
- [x] T009 Add query/document prompt resolution and context keys.
- [x] T010 Apply document prompt at index time.
- [x] T011 Apply query prompt at search time.
- [x] T012 Add daemon compatibility check and structured hard refusal.
- [x] T013 Add per-project metadata and embedder hash isolation.
- [x] T014 Extend protocol fingerprint and error payloads.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Add metadata compatibility tests.
- [x] T016 Add multi-project daemon tests.
- [x] T017 Add prompt-policy contract tests.
- [x] T018 Run targeted pytest.
- [x] T019 Run full pytest.
- [x] T020 Run ruff.
- [x] T021 Write Level 3 packet docs and ADRs.
- [x] T022 Run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] Required code verification passed.
- [x] Strict validation passed.
- [x] No git commit performed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Implementation summary**: `implementation-summary.md`
- **Decisions**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
