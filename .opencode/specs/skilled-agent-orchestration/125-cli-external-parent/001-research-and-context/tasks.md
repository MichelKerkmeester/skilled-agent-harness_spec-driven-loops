---
title: "Tasks: Phase 1: research-and-context"
description: "Task list for the read-only phase 001 research gate before cli-external parent-hub architecture decisions."
trigger_phrases:
  - "cli-external parent tasks"
  - "research gate tasks"
  - "cli dispatch referrer inventory tasks"
  - "cli fold-in tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/001-research-and-context"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted pending tasks for the read-only research gate"
    next_safe_action: "Human review before executing the scoped research passes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research-and-context

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

- [ ] T001 Confirm phase scope, parent handoff criteria, and the no-write boundary outside `001-research-and-context/`
- [ ] T002 List the exact live skill descriptor files to read for `.opencode/skills/cli-opencode/` and `.opencode/skills/cli-claude-code/`
- [ ] T003 [P] Define the referrer grep terms, the three breakage-class buckets, and the required file:line evidence format
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Execute the skill-state research pass and capture versions, descriptors, hard-rules, graph metadata, README posture, tool permissions, and script-tree presence
- [ ] T005 Execute the referrer inventory pass (grep sweep + a relative cross-skill path scan inside both trees) and record every live file reference with file:line evidence
- [ ] T006 Tag every referrer functional / constitutional / internal-outbound-path / logical-name; confirm the functional set (PreToolUse hook, `executor-delegation.ts`, `skill_advisor.py`, the 11-case parity fixtures, card-sync script + `.github/workflows/prompt-card-sync.yml`, `outsourced-agent-handback-docs.vitest.ts`, reciprocal edges) and count the internal outbound relative paths per tree (~54 cli-opencode, ~13 cli-claude-code)
- [ ] T007 Review `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/` and summarize the fold-in, identity-dissolution, and validation lessons for phases 002-006
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Reconcile research artifacts so the skill-state snapshot, referrer inventory, and prior-art summary do not contradict each other
- [ ] T009 Verify zero files outside this phase folder were modified during phase execution
- [ ] T010 Run phase-folder validation and stop for human review before phase 002 begins
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Research gate reviewed and the referrer taxonomy confirmed against a fresh grep
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
