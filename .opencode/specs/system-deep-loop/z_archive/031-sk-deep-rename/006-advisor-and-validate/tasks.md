---
title: "Tasks: Phase 006 Advisor Rebuild and Validation"
description: "Task list for Packet 070 Phase 006 final advisor rebuild, residual grep audit, strict validation, and verdict."
trigger_phrases:
  - "070 phase 006 tasks"
  - "advisor validation tasks"
  - "final grep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/031-sk-deep-rename/006-advisor-and-validate"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Phase 006 task breakdown"
    next_safe_action: "Complete narrative cleanup and verification tasks"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 006 Advisor Rebuild and Validation

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

- [x] T001 Read parent spec, metadata, and resource map (`../spec.md`, `../description.json`, `../graph-metadata.json`, `../resource-map.md`)
- [x] T002 Read Phase 005 artifacts for Level 2 structure (`../005-root-and-config/`)
- [x] T003 Read Level 2 template sources (`.opencode/skills/system-spec-kit/templates/manifest/`)
- [x] T004 Create Phase 006 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Restore source-side old names in parent spec narrative (`../spec.md`)
- [x] T006 Restore parent description and keyword metadata (`../description.json`)
- [x] T007 Restore parent graph trigger phrases and causal summary (`../graph-metadata.json`)
- [x] T008 Restore resource-map source paths, strings, edge cases, and risk wording (`../resource-map.md`)
- [x] T009 Restore Phase 002 description source-side names (`../002-skill-folder-rename/description.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run canonical advisor graph build script (blocked: requested script path missing with `MODULE_NOT_FOUND`; orchestrator fallback required)
- [x] T011 Run deep-review advisor probe and record top-1 (`deep-review`, score `0.883`)
- [x] T012 Run deep-research advisor probe and record top-1 (`deep-research`, score `0.834`)
- [x] T013 Run final active-scope grep audit and count excluded historical hits (FAIL: 42 active file hits, 467 excluded hits)
- [x] T014 Run child strict validation (exit 0)
- [x] T015 Run parent strict validation (exit 0)
- [x] T016 Author implementation summary with six-phase outcome and verdict (`REMEDIATION_NEEDED`)
- [x] T017 Update checklist with command evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] Advisor probes return expected top-1 skills
- [ ] Active old-name grep hits equal zero (blocked: 42 active file hits remain)
- [x] Child and parent strict validation exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Packet**: See `../spec.md`
- **Resource Map**: See `../resource-map.md`
<!-- /ANCHOR:cross-refs -->
