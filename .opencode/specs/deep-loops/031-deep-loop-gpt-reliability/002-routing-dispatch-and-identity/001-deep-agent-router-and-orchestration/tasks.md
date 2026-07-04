---
title: "Tasks: Deep Agent Router & Orchestration Hardening"
description: "Task list for the DEEP primary agent, orchestrate hardening, and command/skill refinement."
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/001-deep-agent-router-and-orchestration"
    last_updated_at: "2026-06-30T13:45:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Created task list"
    next_safe_action: "Begin T001 design resolution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-003-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep Agent Router & Orchestration Hardening

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Resolve DEEP agent form factor (standalone file vs skill enhancement vs both)
- [ ] T002 Determine orchestrate rewrite safety boundary (no Claude regression)
- [ ] T003 [B] Confirm OpenCode can specialize subagent_type per deep agent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Create `.opencode/agents/deep.md`
- [ ] T005 [P] Mirror to `.claude/agents/deep.md` and `.codex/agents/deep.toml`
- [ ] T006 Implement mode routing (research/review/context/council)
- [ ] T007 Modify `.opencode/agents/orchestrate.md` for deep-loop dispatch clarity
- [ ] T008 [P] Mirror orchestrate changes to Claude/Codex agents
- [ ] T009 Tighten dispatch prose in deep command YAMLs for GPT adherence
- [ ] T010 Reduce role-negotiation ambiguity in deep skill SKILL.md files
- [ ] T011 Optimize prompt structure to avoid GPT slowness (pre-route not negotiate)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T012 Test GPT-backed invocation across research/review/context/council
- [ ] T013 Verify no Claude flexibility regression
- [ ] T014 Measure GPT latency vs baseline
- [ ] T015 Run strict spec validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All P0 tasks completed or implementation halted with a documented blocker
- [ ] No `[B]` blocked tasks remaining
- [ ] GPT invocation + Claude regression + latency evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: See `../../031-deep-loop-issues-with-gpt-opencode/001-gpt-deep-agent-routing/research/research.md`
<!-- /ANCHOR:cross-refs -->
