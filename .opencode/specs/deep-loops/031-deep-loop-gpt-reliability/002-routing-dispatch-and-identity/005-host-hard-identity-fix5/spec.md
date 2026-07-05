---
title: "Feature Specification: Host Hard Identity / FIX-5 (PARKED)"
description: "PARKED follow-up: host-runtime hard per-agent subagent_type identity (architectural dispatch-primitive change) + FIX-5 native-to-CLI subprocess executor (process isolation). Escalated ONLY if phase 004's smoke shows GPT still mis-dispatches after the agent-layer fix."
trigger_phrases:
  - "host hard identity"
  - "fix-5 process isolation"
  - "subagent_type specialization"
  - "deep dispatch ceiling"
importance_tier: "important"
contextType: "implementation"
predecessor_research: "../001-deep-agent-router-and-orchestration/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/005-host-hard-identity-fix5"
    last_updated_at: "2026-07-01T17:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed by phase 013 gate evaluation -- see decision-record.md Final Resolution"
    next_safe_action: "None -- closed"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-005-init"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Host Hard Identity / FIX-5 (PARKED)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (deferred) |
| **Status** | **Closed** (2026-07-01) — agent-layer fix sufficient; see `decision-record.md` Final Resolution |
| **Created** | 2026-06-30 |
| **Parent Packet** | `031-deep-loop-gpt-reliability` |
| **Predecessor** | `../005-gpt-verification-smoke` (gates this phase's activation) |
| **Successor** | None (ceiling) |
| **Handoff Criteria** | N/A — no plan.md/tasks.md until unparked. Activation gated on the trigger in `decision-record.md`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research (§8b) found that hard per-agent `subagent_type` identity requires a **host-runtime dispatch-primitive change** (bind `agent_slug` at the Task boundary, auto-load/enforce, reject unknown, stamp provenance) — NOT a frontmatter-only or config-only change (F33). Host internals are not inspectable from the workspace (F31). The change is **architectural, not PR-sized** (F35): it crosses runtime, CLI, command-owned loops, mirror contracts, and orchestrator assumptions. FIX-5 (native→CLI subprocess executor, process isolation) is the alternative structural-prevention ceiling.

### Purpose

Provide the structural-prevention ceiling as a documented, trigger-gated follow-up. The agent-layer fix (phases 001-003) is attempted first (smaller blast radius); this phase activates ONLY if that proves insufficient.

### ⚠ PARKED — DO NOT IMPLEMENT YET

This phase has **no plan.md or tasks.md**. It exists to record the trigger criterion (`decision-record.md`) and the design spec so escalation is unambiguous. Unpark only when the trigger fires.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE (when unparked)

### In Scope (deferred)

- **R7 — Host-runtime hard identity.** Minimal: teach the YAML `dispatch.agent` field to become hard runtime identity for the 4 deep agents + stamp `{mode,target_agent,agent_definition_loaded}` into state/delta/provenance. Complete: unify all agent kinds under one resolver. (F33-F35)
- **R8 — FIX-5 process isolation.** Native→CLI subprocess executor so the deep leaf runs in a process boundary, not a prompt-injected role. (research §5, §8b)

### Out of Scope (this phase's parking)

- Everything in phases 001-004.

### Findings Covered

F31 (host internals not inspectable), F32 (dispatch identity split), F33 (dispatch-primitive change), F34 (minimal vs complete), F35 (architectural blast radius), F36 (do-not-attempt-now recommendation).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS (gated on unpark)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Trigger criterion documented | `decision-record.md` records the observable escalation trigger from phase 004. |
| REQ-002 | (when unparked) Hard identity OR FIX-5 | The mis-dispatch class that survived the agent-layer fix is structurally prevented. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

- If triggered: attempt minimal 4-agent hard identity first, or go straight to FIX-5 process isolation? (Decide at unpark time.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Trigger criterion**: `decision-record.md` (this phase)
- **Research basis**: `../001-deep-agent-router-and-orchestration/research/research.md` §5 (FIX-5 criterion), §8b (host hard identity spec)
- **Escalation gate**: `../005-gpt-verification-smoke/`
- **New operator evidence / follow-up research**: `../goal-prompt.md`, phase `007` (pending)
