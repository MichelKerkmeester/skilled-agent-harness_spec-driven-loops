---
title: "Tasks: Lineage and Metadata Repair Runner"
description: "Completed task list for the graph metadata and lineage repair runner."
trigger_phrases:
  - "lineage metadata repair tasks"
  - "repair graph metadata tasks"
  - "memory index scan repair tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner"
    last_updated_at: "2026-05-19T20:08:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "Commit handoff from implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs"
      - "/tmp/scan-post-final4.json"
    session_dedup:
      fingerprint: "sha256:0aa108eb300f64d05f33fd6f46e9f9f9214ba145c2fe1f82034816c9709ec796"
      session_id: "codex-019-lineage-and-metadata-repair-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Lineage and Metadata Repair Runner

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read packet 016 investigation report.
- [x] T002 Parse `/tmp/scan-stdout.log` and classify failure modes.
- [x] T003 Confirm graph metadata v1 required fields.
- [x] T004 Confirm accepted importance tier enum.
- [x] T005 Confirm `E_LINEAGE` stale logical-key recipe.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs`.
- [x] T007 Add `--dry-run`, structured reporting, and `/tmp` backup behavior.
- [x] T008 Add graph metadata v1 upgrade and `high` to `important` tier normalization.
- [x] T009 Add scan-log-driven V8 graph metadata compaction.
- [x] T010 Add guarded SQLite lineage-key repair for stale predecessor rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `node --check` on the runner.
- [x] T012 Run initial dry-run and verify expected repair scale.
- [x] T013 Run real migration with backups.
- [x] T014 Re-run scan and iterate graph-only V8 compaction until targeted classes are clear.
- [x] T015 Run strict packet validation.
- [x] T016 Add commit handoff with exact staging paths.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
