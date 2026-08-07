---
title: "Tasks: Phase 001 Discovery Impact Map"
description: "Completed task ledger for the read-only active reference inventory for sk-improve-prompt."
trigger_phrases:
  - "082 phase 001 tasks"
  - "sk-improve-prompt inventory tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/001-discovery-impact-map"
    last_updated_at: "2026-05-06T10:45:10Z"
    last_updated_by: "codex"
    recent_action: "Completed active reference inventory and edge-case audit"
    next_safe_action: "Phase 002 skill-folder-rename"
    blockers: []
    key_files:
      - "inventory.tsv"
      - "inventory.md"
      - "edge-cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-06-082-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical active inventory includes hidden runtime mirrors and root AGENTS.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 001 Discovery Impact Map

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

- [x] T001 Read parent and child phase specs before inventory work. Evidence: `../spec.md`, `../resource-map.md`, `spec.md`.
- [x] T002 Run exact active-scope grep inventory with frozen historical packet excludes. Evidence: `inventory.tsv`.
- [x] T003 Run explicit hidden/runtime mirror checks for `.claude`, `.codex`, `.gemini`, root `AGENTS.md`, and root `CLAUDE.md`. Evidence: `inventory.tsv`, `edge-cases.md`.
- [x] T004 Run filename embed discovery for paths containing `sk-improve-prompt`. Evidence: `edge-cases.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create machine-readable `inventory.tsv` with phase, category, path, ref_count, and notes columns. Evidence: `inventory.tsv`.
- [x] T006 Create human-readable phase-grouped inventory under 250 lines. Evidence: `inventory.md`.
- [x] T007 Create edge-case audit under 150 lines covering filename embeds, JSON keys, symlink state, path links, hardcoded IDs, fixtures, observability, memory DB, code graph, and root instruction docs. Evidence: `edge-cases.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Compare canonical inventory row count with the provided final sanity command. Evidence: `inventory.md` count reconciliation.
- [x] T009 Confirm no source files outside the phase folder were intentionally modified. Evidence: authored files are scoped to `001-discovery-impact-map/`.
- [x] T010 Run strict spec validation after authoring. Evidence: `implementation-summary.md` verification table.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed with strict validator evidence recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Inventory**: See `inventory.tsv` and `inventory.md`
- **Edge Cases**: See `edge-cases.md`
<!-- /ANCHOR:cross-refs -->
