---
title: "Tasks: deep-review README"
description: "Task list for the deep-review README rewrite via deep-context and dual-draft."
trigger_phrases:
  - "deep-review readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/042-skill-readme-standardization/006-deep-review-readme"
    last_updated_at: "2026-07-08T05:56:45.773Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-011 tasks complete"
    next_safe_action: "Begin phase 012 (mcp-chrome-devtools README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deep-review README

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

- [x] T002 [P] Iteration 1 seats: DeepSeek + MiMo gather purpose, modes, invocation
- [x] T003 [P] Iteration 2 seats: verify flags, severity model, convergence math, outputs and stale facts
- [x] T004 Synthesize context-report.md (host cross-checked counts where the models disagreed)
- [x] T005 [P] Dual-draft: DeepSeek + MiMo author the README
- [x] T006 Verify the 21 paths resolve and no deep-research-only path is cited; write `deep-review/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_document.py --type readme` passes (0 issues)
- [x] T008 HVR prose scan clean (code-block syntax exempt)
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
