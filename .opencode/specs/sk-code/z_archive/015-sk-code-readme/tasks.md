---
title: "Tasks: sk-code README"
description: "Task list for the sk-code README rewrite via deep-context and dual-draft."
trigger_phrases:
  - "sk-code readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-readme"
    last_updated_at: "2026-06-07T14:07:55Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-016 tasks complete"
    next_safe_action: "Begin phase 017 (sk-doc README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code README

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

- [x] T002 [P] Iteration 1 seats: DeepSeek + MiMo gather purpose, routing model, phases
- [x] T003 [P] Iteration 2 seats: verify surface detection, the Iron Law, verification commands and stale facts
- [x] T004 Synthesize context-report.md (host pinned the two-surface model and the MOTION_DEV correction)
- [x] T005 [P] Dual-draft: DeepSeek + MiMo author the README
- [x] T006 Scan for the MOTION_DEV-as-surface error; verify the cited paths; write `sk-code/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_document.py --type readme` passes (0 issues)
- [x] T008 HVR prose scan clean; no "third surface"; no version leak
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
