---
title: "Tasks: ai-council Subagent-Only Conversion"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "ai-council subagent only"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/008-ai-council-subagent-only"
    last_updated_at: "2026-07-01T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 9 tasks complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-010-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: ai-council Subagent-Only Conversion

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

- [x] T001 Confirm phase 009 is complete.
- [x] T002 Re-read `decision-record.md`; rationale still accurate.
- [x] T003 Grep found 2 real callers depending on direct reachability: `cli-opencode/references/agent_delegation.md` (routing-matrix row + prose) and `sk-doc/assets/agent_template.md` (production-agents table listing `mode: all`). Both redirected (see T005).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Changed `.opencode/agents/ai-council.md:4` from `mode: all` to `mode: subagent`.
- [x] T005 Redirected both callers found in T003: `cli-opencode/agent_delegation.md`'s ai-council row and prose now say "Command-only" and point to `/deep:ai-council` or `general`/orchestrate Task-dispatch; `sk-doc/agent_template.md`'s table updated from `mode: all` to `mode: subagent`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Live-tested Task-tool dispatch to `@ai-council` (via `opencode run --agent general "...use the task tool to dispatch to ai-council..."`): real `task` tool call with `subagent_type: 'ai-council'` fired, agent replied "OK". Full `/deep:ai-council` multi-round session not run end-to-end (would require a real, expensive multi-topic council session) -- the Task-dispatch mechanism it depends on is what this test confirms.
- [x] T007 Live-tested via `opencode run --agent orchestrate "...multi-strategy architecture planning..."`: orchestrate correctly resolved "Agent: @ai-council per §2 Priority 4" (matching phase 009's exact renumbering), loaded `ai-council.md` and `mode-registry.json` per its Agent Loading Protocol, and began Task dispatch.
- [x] T008 Confirmed via `opencode run --agent ai-council ...`: CLI printed `agent "ai-council" is a subagent, not a primary agent. Falling back to default agent` and did not load `ai-council.md` (27,975 input tokens vs. 36,004 before the change -- the smaller default agent loaded instead).
- [x] T009 Ran `validate.sh --strict`: see `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Both smoke tests pass (T006, T007).
- [x] Direct-invoke reachability confirmed removed (T008).
- [x] Strict spec validation passes (T009).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision record**: See `decision-record.md`.
- **Predecessor**: `../009-orchestrate-universal-routing/`
<!-- /ANCHOR:cross-refs -->

---
