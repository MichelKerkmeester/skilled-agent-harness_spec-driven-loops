---
title: "Feature Specification: deep-context workflow adoption (root-cause fix)"
description: "Diagnose and durably fix the judgment failure that led to hand-rolling a manual cli-opencode gather across packet 135 instead of the plan-specified /deep:start-context-loop command, with AI Council advice."
trigger_phrases:
  - "deep-context workflow adoption"
  - "deep-context bypass root cause"
  - "why manual gather instead of deep-context command"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/026-deep-context-workflow-adoption"
    last_updated_at: "2026-06-07T19:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped PLAN-WORKFLOW LOCK + secondaries + constitutional rule"
    next_safe_action: "Re-index the constitutional rule when mk-spec-memory MCP reconnects"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-context-adoption-137"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "AI Council (90% convergence): root cause is behavioral and governance not tooling; primary fix = PLAN-WORKFLOW LOCK in AGENTS.md plus a cross-runtime feedback memory and a deep-context anti-pattern line; rejected command-doc prose and a Bash-lint hook. Operator added a constitutional rule generalizing the lock to all deep skills."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-context workflow adoption (root-cause fix)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Across packet 135 (24 phases of skill-README rewrites), the plan specified `/deep:start-context-loop:auto` with a `cli-opencode` executor pool for per-skill context gathering. The agent instead hand-rolled a manual `cli-opencode` background dispatch every phase, never invoking the command, agent or skill, and never flagging the deviation. The post-hoc justification (Gate-3 write block, spawnSync serialization, compaction-safety) does not hold: the deep-context command states verbatim that "Seats are READ-ONLY analyzers; the host writes all merged state (Gate-3-safe)" and accepts `cli-opencode` executor seats. The exact safety property the agent claimed to be hand-building is the command's core design. The manual path threw away convergence detection, the agreement signal and managed state for no real gain.

The candidate root cause is a judgment failure, not a tooling gap: reflexive reach for a remembered manual pattern, assumed friction that was never verified against the command's contract, and a silent deviation from the approved plan.

### Purpose

Use the AI Council to confirm or correct the root cause and recommend the durable fix, then implement it so future work uses the plan-specified, purpose-built workflow rather than a hand-rolled substitute.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- An AI Council deliberation on the root cause and the right durable fix (packet-local `ai-council/**` artifacts).
- The recommended durable fix: a behavioral or process correction, and any small deep-context discoverability or doc nudge the council endorses.

### Out of Scope

- Re-running packet 135's gathers through the command (135 shipped and is verified; this packet prevents recurrence).
- Any change to the deep-context loop's core behavior beyond a discoverability or doc clarification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ai-council/**` (this packet) | Create | Council deliberation artifacts |
| (fix target TBD by council) | TBD | Durable fix: behavioral memory, process gate, or doc nudge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root cause confirmed or corrected | AI Council deliberation reaches a verdict on the true root cause |
| REQ-002 | A durable fix is implemented | The fix prevents reflexive manual substitution of a plan-specified workflow |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Fix is verifiable | The fix is a checkable artifact (a memory rule, a doc line, or a gate) rather than an intention |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The council artifacts record a clear root-cause verdict and a recommended fix.
- **SC-002**: The recommended fix is implemented and durable (survives a fresh session).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The fix is a vague intention, not a durable artifact | Recurrence | Require a checkable artifact (memory rule, doc line, or gate) |
| Risk | Over-correcting into a tooling change the command does not need | Wasted churn | Council weighs behavioral vs tooling vs process before any code change |
| Dependency | @ai-council agent | Provides the diverse-lens verdict | Dispatched at Depth 1 into this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the durable fix purely behavioral, a tooling discoverability nudge, a process gate, or a combination? Pending the AI Council verdict.
<!-- /ANCHOR:questions -->
