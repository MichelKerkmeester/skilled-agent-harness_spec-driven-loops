---
title: "Tasks: Phase 072 sk-code scripts relocation"
description: "Task ledger for relocating five sk-code scripts, inspecting alignment drift scope, updating references in batches, and verifying the packet."
trigger_phrases:
  - "phase 072 tasks"
  - "sk-code script relocation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/072-sk-code-scripts-relocation"
    last_updated_at: "2026-05-05T20:52:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed task ledger"
    next_safe_action: "Review final diff"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000072"
      session_id: "phase-072-sk-code-scripts-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Initial inventory had 41 non-packet files to update."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 072 sk-code scripts relocation

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

- [x] T001 Create Level 2 spec packet (`specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/`)
- [x] T002 Save initial reference inventory (`scratch/initial-inventory.md`)
- [x] T003 Inspect alignment-drift validator (`.opencode/skills/sk-code/scripts/verify_alignment_drift.py`)
- [x] T004 Inspect alignment-drift validator test (`.opencode/skills/sk-code/scripts/test_verify_alignment_drift.py`)
- [x] T005 Document alignment-drift destination verdict (`decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Relocate minify utility (`minify-webflow.mjs`)
- [x] T007 Relocate minified runtime test (`test-minified-runtime.mjs`)
- [x] T008 Relocate minification verifier (`verify-minification.mjs`)
- [x] T009 Relocate alignment-drift validator (`verify_alignment_drift.py`)
- [x] T010 Relocate alignment-drift validator test (`test_verify_alignment_drift.py`)
- [x] T011 Remove old root script directory (`.opencode/skills/sk-code/scripts/`)
- [x] T012 Update reference batch A: sk-code own docs and resource maps
- [x] T013 Update reference batch B: spec-kit / command / agent references
- [x] T014 Update reference batch C: historical spec docs and other inventory hits
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify zero stale old-path references outside this packet
- [x] T016 Verify destination scripts exist
- [x] T017 Verify old root `scripts/` directory is removed
- [x] T018 Verify destination file modes
- [x] T019 Run strict spec validation
- [x] T020 Finalize checklist and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification commands from the prompt recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Inventory**: See `scratch/initial-inventory.md`
<!-- /ANCHOR:cross-refs -->
