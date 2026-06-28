---
title: "Feature Specification: Agent Loops Improved"
description: "Research and phased implementation of loop-system improvements mined from vendored external references (loop-cli-main, kasper)."
trigger_phrases:
  - "agent loops improved"
  - "loop systems improvement"
  - "deep-loop improvements implementation"
  - "156 agent loops"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Backfilled root phase-parent spec for the agent-loops-improved packet"
    next_safe_action: "Scaffold and execute the 002-implementation phase tree"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Agent Loops Improved

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in the skilled-agent-orchestration track) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child phase validates independently under `validate.sh`; the parent validates recursively |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our loop-based systems (deep-loop-runtime, deep-loop-workflows, and the system-spec-kit commands/agents that drive them) carry known gaps in resilience, convergence quality, observability, safety, and interconnection. We need a disciplined way to discover concrete, evidence-backed improvements and then apply them without losing track of dependencies.

### Purpose
This packet first researches two vendored reference codebases for portable patterns (phase `001-reference-research`), then applies the resulting improvements as an independently-executable phase tree (phase `002-implementation`), alongside one new capability — a `/goal` OpenCode plugin mirroring Claude Code's `/goal`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reference research mining loop-cli-main + kasper into a ranked recommendation backlog (`001-reference-research`).
- Phased implementation of the 40 recommendations plus the `/goal` OpenCode plugin, grouped by subsystem (`002-implementation`).

### Out of Scope
- Subsystems unrelated to loop orchestration.
- Implementing improvements at the parent level — all work is delegated to child phases.

### Files to Change
Audit-trail summary only; per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/deep-loop-runtime/**` | Modify | 002-implementation | Resilience, convergence, observability improvements |
| `.opencode/skills/deep-loop-workflows/**` | Modify | 002-implementation | Anti-convergence, injection, interconnection improvements |
| `.opencode/commands/{deep,speckit}/**` | Modify | 002-implementation | Telemetry, run-now, autopilot improvements |
| `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md` | Create | 002-implementation | The `/goal` OpenCode plugin + command |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-reference-research` | 50-iteration mining of loop-cli-main + kasper → 40 recommendations | Complete |
| 002 | `002-implementation` | Apply the 40 recommendations + the `/goal` plugin (subsystem-grouped phases) | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Ranked recommendation backlog synthesized | `001-reference-research/research/research.md` present |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The `/goal` plugin autonomy tier (passive injection vs active continuation vs supervisor) is resolved by the phase-001 deep-research run.
- Cross-subsystem convergence dependencies (the convergence-profile ADR must precede new convergence signals) are tracked via per-phase `Predecessor` fields rather than folder order.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: None (top-level packet)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
