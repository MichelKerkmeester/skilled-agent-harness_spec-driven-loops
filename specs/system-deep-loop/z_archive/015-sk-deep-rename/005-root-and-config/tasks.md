---
title: "Tasks: Phase 005 Root Docs and Configs"
description: "Task list for Packet 070 Phase 005 root documentation and config reference updates."
trigger_phrases:
  - "070 phase 005 tasks"
  - "root docs config tasks"
  - "phase 005 verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/005-root-and-config"
    last_updated_at: "2026-05-05T19:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Phase 005 task breakdown"
    next_safe_action: "Complete README replacement and validation tasks"
    blockers: []
    key_files:
      - "tasks.md"
      - "README.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 005 Root Docs and Configs

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

- [x] T001 Read parent spec (`../spec.md`)
- [x] T002 Read parent resource map (`../resource-map.md`)
- [x] T003 Filter Phase 001 inventory for Phase 005 root-doc/config rows (`../001-discovery-impact-map/inventory.tsv`)
- [x] T004 Check existence of listed root docs/configs
- [x] T005 Grep listed root docs/configs for old skill names
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Render Level 2 template files into the Phase 005 folder
- [x] T007 Replace the old deep research skill ID with `deep-research` in `README.md`
- [x] T008 Replace the old deep review skill ID with `deep-review` in `README.md`
- [x] T009 Leave no-op listed files untouched when grep shows no old refs
- [x] T010 Create/update `graph-metadata.json` for Phase 005
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Validate listed JSON files parse successfully
- [x] T012 Run residual grep over listed root files
- [x] T013 Run child strict validation
- [x] T014 Run parent strict validation
- [x] T015 Update checklist and implementation summary with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Residual grep returns zero listed root files
- [x] JSON validity passes for all listed JSON files
- [x] Child and parent strict validation exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Packet**: See `../spec.md`
- **Inventory**: See `../001-discovery-impact-map/inventory.tsv`
<!-- /ANCHOR:cross-refs -->
