---
title: "Tasks: deep-ai-council README"
description: "Task list for the deep-ai-council README rewrite via deep-context and dual-draft."
trigger_phrases:
  - "deep-ai-council readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-skill-readme-standardization/001-deep-ai-council-readme"
    last_updated_at: "2026-07-08T05:56:44.530Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-006 tasks complete"
    next_safe_action: "Begin phase 007 (deep-context README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deep-ai-council README

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Seed the deep-context packet and seat prompts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Iteration 1 seats: DeepSeek + MiMo gather purpose, council model, invocation
- [x] T003 [P] Iteration 2 seats: verify lenses, critique roles, convergence and artifacts
- [x] T004 Host-verify the reference tree and synthesize context-report.md
- [x] T005 [P] Dual-draft: DeepSeek + MiMo author the README
- [x] T006 Verify reference paths, soften brittle counts, write `deep-ai-council/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_document.py --type readme` passes (0 issues)
- [x] T008 HVR scan clean (no em dash, semicolon, Oxford-comma list)
- [x] T009 `validate.sh --strict` on the phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] README validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
