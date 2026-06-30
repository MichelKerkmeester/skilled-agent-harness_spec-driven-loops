---
title: "Feature Specification: GPT First-Dispatch Verification Smoke"
description: "The acceptance gate: run a GPT-backed before/after first-dispatch smoke per deep mode using existing provenance + route-proof assertions, producing the FIX-5 escalation decision. No new benchmark tooling."
trigger_phrases:
  - "gpt verification smoke"
  - "first-dispatch test"
  - "fix-5 escalation decision"
  - "deep dispatch probe"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../../research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/004-gpt-verification-smoke"
    last_updated_at: "2026-06-30T15:20:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase scaffolded from research decomposition (R6)"
    next_safe_action: "Wait for 001+002+003, then /speckit:plan"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-004-init"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: GPT First-Dispatch Verification Smoke

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-30 |
| **Parent Packet** | `001-deep-agent-router-and-orchestration` (phase parent) |
| **Predecessor** | `../003-command-pre-route-headers` |
| **Successor** | `../005-host-hard-identity-fix5` (only if this phase's trigger fires) |
| **Handoff Criteria** | GPT first-dispatch passes route-proof validation per mode; FIX-5 escalation decision recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research (§7) established that existing provenance suffices for verification — no new benchmark tooling. The workflow emits: `deep-research-state.jsonl` canonical records (`deep_research_auto.yaml:940-953`), iteration/delta artifacts + `post_dispatch_validate`, `observability-events.jsonl` envelopes, executor provenance/audit. The minimal test is one-dispatch before/after per mode. **Crucially**, after phase 001 lands route-proof fields, the smoke must also assert route compliance (else the F27 false-negative hides wrong-mode dispatch).

### Purpose

Prove the agent-layer fix (phases 001-003) achieves correct GPT first-dispatch, and produce the decision: if GPT still mis-dispatches after the fix, escalate to phase 005 (FIX-5 / host identity).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R6 — GPT before/after smoke per mode** with route-proof assertions. Per deep mode: snapshot pre-run state-log count; execute one GPT-backed first dispatch on a tiny packet; inspect only existing outputs (one new canonical `type:"iteration"` record of the *requested* mode, expected artifact/delta paths, no `dispatch_failure`, executor provenance, route-proof fields matching the requested mode). Baseline identical packet under native/Claude.
- Produce the **FIX-5 escalation decision**: if GPT mis-dispatches (route-mismatched artifacts, even schema-valid) after 001-003 → recommend unparking 005.

### Out of Scope

- New benchmark/telemetry tooling (research NON-GOAL).
- FIX-5 / host identity implementation — phase 005.

### Findings Covered

F16 (FIX-5 trigger), F20 (existing provenance suffices), F21 (minimal test shape), F27 (false-negative — now caught by 001's route-proof fields).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `verification-smoke.md` (this phase) | Create | Procedure + result template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Smoke procedure documented | `verification-smoke.md` defines the per-mode before/after steps using existing provenance + route-proof assertions. |
| REQ-002 | Smoke run executed | One GPT-backed first dispatch per mode completed; native/Claude baseline recorded. |
| REQ-003 | FIX-5 escalation decision recorded | Outcome of the smoke: GPT first-dispatch correct (close the effort) OR mis-dispatch persists (unpark 005). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each deep mode's GPT first-dispatch produces a route-compliant iteration record (passes route-proof validation from phase 001).
- **SC-002**: Native/Claude baseline recorded for differential comparison.
- **SC-003**: FIX-5 escalation decision is evidence-backed and recorded.
<!-- /ANCHOR:success-criteria -->
