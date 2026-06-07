---
title: "Tasks: cli-claude-code README"
description: "Task list for the cli-claude-code README rewrite via deep-context and dual-draft."
trigger_phrases:
  - "cli-claude-code readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/002-cli-claude-code-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-002 tasks complete"
    next_safe_action: "Begin phase 003 (cli-codex README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-claude-code README

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

- [x] T001 Scaffold the phase folder and seed the deep-context packet
- [x] T002 Write the read-only seat-gathering prompt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Iteration 1 seats: DeepSeek + MiMo gather purpose, modes, boundaries
- [x] T004 [P] Iteration 2 seats: verify flags, agent roster and stale facts
- [x] T005 Host-verify against SKILL.md and synthesize context-report.md
- [x] T006 [P] Dual-draft: DeepSeek + MiMo author the README
- [x] T007 Merge best-of into `cli-claude-code/README.md`, fix HVR and the agent roster
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `validate_document.py --type readme` passes (0 issues)
- [x] T009 HVR scan clean (no em dash, semicolon, Oxford-comma list)
- [x] T010 `validate.sh --strict` on the phase
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
