---
title: "Tasks: Phase 007 - P2 doc drift"
description: "Sweep remaining P2 documentation drift, stale skill inventory, dead Copilot guard branch, and nested-backtick playbook prompts."
trigger_phrases:
  - "p2 doc drift"
  - "098 phase 007"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/install_guides/SET-UP - Opencode Agents.md"
      - ".opencode/install_guides/SET-UP - AGENTS.md"
      - ".opencode/install_guides/SET-UP - Code Graph.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 007 - P2 doc drift

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

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read affected surfaces and capture current drift [pending]
- [ ] T002 Confirm phase allowlist and out-of-scope boundaries [pending]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Apply targeted remediation edits [pending]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Run phase-specific verification commands [pending]
- [ ] T005 Update checklist with evidence [pending]
- [ ] T006 Update implementation summary and metadata [pending]
- [ ] T007 Run parent `validate.sh --strict` [pending]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Phase-specific verification passed
- [ ] Checklist evidence complete

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
