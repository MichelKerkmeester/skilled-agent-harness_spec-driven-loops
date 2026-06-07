---
title: "Tasks: system-code-graph README"
description: "Task list for the system-code-graph README rewrite via deep-context and dual-draft."
trigger_phrases:
  - "system-code-graph readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/021-system-code-graph-readme"
    last_updated_at: "2026-06-07T15:16:11Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-021 tasks complete"
    next_safe_action: "Begin phase 022 (system-skill-advisor README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: system-code-graph README

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

- [x] T002 [P] Iteration 1 seats: DeepSeek + MiMo gather purpose, the structural model, the tools
- [x] T003 [P] Iteration 2 seats: verify the eight tool schemas, the readiness model and stale facts
- [x] T004 Synthesize context-report.md (verification found no stale facts)
- [x] T005 [P] Dual-draft: DeepSeek + MiMo author the README
- [x] T006 Fix one prose semicolon, verify all cited paths; write `system-code-graph/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_document.py --type readme` passes (0 issues)
- [x] T008 HVR prose scan clean; freshness model correct (blocked is a refusal payload)
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
