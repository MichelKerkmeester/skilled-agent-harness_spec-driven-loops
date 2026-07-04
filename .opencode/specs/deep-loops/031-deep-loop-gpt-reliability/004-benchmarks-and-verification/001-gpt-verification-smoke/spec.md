---
title: "Feature Specification: GPT First-Dispatch Verification Smoke"
description: "Acceptance-gate smoke for GPT-backed first dispatch with route-proof assertions and a FIX-5 escalation decision."
trigger_phrases:
  - "gpt verification smoke"
  - "first-dispatch test"
  - "fix-5 escalation decision"
  - "deep dispatch probe"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../001-deep-agent-router-and-orchestration/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/001-gpt-verification-smoke"
    last_updated_at: "2026-06-30T21:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Command-owned GPT smokes attempted; gate failed"
    next_safe_action: "See ../007-.../research-prompt.md for the follow-up"
    blockers:
      - "Nested command-owned cli-opencode dispatch is blocked by command/executor self-invocation guards"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-004-spec"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Should phase 004 close as blocked/fail-closed, or should an external shell rerun the full smoke for a clean PASS?"
    answered_questions:
      - question: "May cli-opencode be used from this OpenCode session?"
        answer: "User granted a one-off exception for bounded probes."
      - question: "May nested/self-invocation be attempted from this session?"
        answer: "User selected option 3; command-owned nested smokes were attempted."
---
# Feature Specification: GPT First-Dispatch Verification Smoke

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Failed/blocked after command-owned GPT smoke attempts |
| **Created** | 2026-06-30 |
| **Parent Packet** | `031-deep-loop-issues-with-gpt-opencode` |
| **Predecessor** | `../004-command-pre-route-headers` |
| **Successor** | `../006-host-hard-identity-fix5` only if the full smoke trigger fires |
| **Handoff Criteria** | GPT first-dispatch passes route-proof validation per mode; FIX-5 escalation decision recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Existing provenance can verify GPT first-dispatch correctness without new benchmark tooling, but the smoke must include route-proof assertions. Schema-valid artifacts alone can hide wrong-mode dispatch.

### Purpose

Prove whether the agent-layer fixes from phases 001-003 make GPT first-dispatch route-compliant, then record whether phase 005 must be unparked.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Document the command-owned smoke procedure in `verification-smoke.md`.
- Run bounded GPT route probes when safely possible from this session.
- Attempt command-owned nested smokes after explicit user approval.
- Record whether the full route-proof acceptance gate is satisfied, blocked, or failed.
- Record the interim or final phase 005 decision.

### Out of Scope

- New benchmark or telemetry tooling.
- Host-runtime hard identity implementation.
- Forcing direct `--agent deep-*` invocation for command-owned loop executors.
- Implementing a permanent bypass for command-owned `cli-opencode` self-invocation guards.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `verification-smoke.md` | Create | Procedure, bounded probe evidence, blocker, and interim FIX-5 decision |
| `spec.md` | Modify | Record blocked status and acceptance criteria |
| `plan.md` | Modify | Record approach and verification path |
| `tasks.md` | Modify | Record partial task completion and blockers |
| `implementation-summary.md` | Modify | Record probe results and limitations |
| `context/**` | Create | Command-owned context smoke artifacts showing blocked GPT seat |
| `ai-council/**` | Create | Command-owned council smoke artifacts showing pre-dispatch self-invocation failure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Smoke procedure documented | `verification-smoke.md` defines per-mode steps using existing provenance and route-proof assertions |
| REQ-002 | GPT-backed evidence gathered | Bounded GPT probes and command-owned attempts record route preservation, failure, or a concrete blocker |
| REQ-003 | Full smoke status recorded | Full command-owned smoke is marked passed, failed, or blocked with evidence |
| REQ-004 | FIX-5 decision recorded | Do not unpark, unpark, or defer phase 005 based on the available evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full success requires each deep mode GPT first-dispatch to produce a route-compliant record with `agent_definition_loaded:true`.
- **SC-002**: Native/Claude baseline remains pending unless a clean GPT first-dispatch reaches comparable execution.
- **SC-003**: FIX-5 escalation decision must be evidence-backed.
- **SC-004**: Bounded route echo probes are labeled as supporting evidence only when `agent_definition_loaded:false`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External non-OpenCode execution surface | Full command-owned smoke cannot produce a clean pass from the active OpenCode session | Document blocker and require external shell or fresh worktree harness for clean PASS evidence |
| Risk | False-positive route echo | Direct GPT probe can preserve route text without loading the leaf agent | Treat `agent_definition_loaded:false` as not satisfying full acceptance |
| Risk | Nested self-invocation | Command-owned `cli-opencode` branch can recursively spawn OpenCode | Do not run nested branch from current session |
| Risk | Premature FIX-5 escalation | Bounded probes are insufficient to prove or disprove full dispatch correctness | Keep phase 005 parked until full smoke evidence exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should phase 004 close as blocked/fail-closed, or should an external shell rerun the full smoke for clean PASS evidence?
- **(2026-07-01, new)** Operator reports real-world GPT-backed OpenCode symptoms (slow `@orchestrate`, wrong sub-agent invocation, stuck flows, over-literal misreads) that corroborate rather than contradict this phase's inconclusive result. See `../goal-prompt.md` and phase `007` (deep-research) for the follow-up investigation before any final FIX-5 unpark decision.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Implementation Summary**: See `implementation-summary.md`.
- **Smoke Procedure**: See `verification-smoke.md`.
- **Research Basis**: See `../001-deep-agent-router-and-orchestration/research/research.md`.
<!-- /ANCHOR:related-docs -->
