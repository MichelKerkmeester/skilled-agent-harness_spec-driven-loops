---
title: "Implementation Plan: Mobile PWA and Reconciliation"
description: "Execution plan for builds the installable foreground mobile experience for sessions, streaming work, reconnect reconciliation, explicit controls, and offline read-only state."
trigger_phrases:
  - "pi remote mobile pwa and reconciliation"
  - "pi mobile phase 5"
  - "mobile pwa and reconciliation"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the plan with the implemented PWA"
    next_safe_action: "Use phase 009 for physical-device and accessibility evidence"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
---

# Implementation Plan: Mobile PWA and Reconciliation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Mobile PWA and Reconciliation boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | Reducer table tests; Recorded replay and snapshot tests; Browser foreground E2E; Reconnect and retention-miss tests; Keyboard, focus, render-cadence, and live-region checks |

### Overview

Builds the installable foreground mobile experience for sessions, typed streaming work, reconnect reconciliation, explicit controls, and offline read-only state. The implementation is built and component-tested.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor inputs and phase-001 version pins are current.
- [ ] Safe negative controls reproduce the exact forbidden or missing behavior.
- [ ] Owned paths, consumers, dependencies, rollback, and authoritative command are confirmed.

### Definition of Done
- [ ] Every P0 requirement and selected P1 item has objective evidence.
- [ ] Focused checks and the authoritative phase gate pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] Successor inputs, documentation phase inputs, parent status, and rollback state agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keep connection, mutation, run, message, tool, approval, and queue state separate and reconcile them through epoch-sequenced relay envelopes.

### Key Components
- **apps/pi-remote-web/src/session/**: Opaque session list and navigation state
- **apps/pi-remote-web/src/thread/**: Transcript, message, tool, queue, and approval reducers
- **apps/pi-remote-web/src/connection/**: Authentication, replay, snapshot, and reconnect flow
- **apps/pi-remote-web/src/composer/**: Prompt, steer, follow-up, abort, retry, and uncertain-state UI
- **apps/pi-remote-web/public/**: Installable manifest and offline read-only shell

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `apps/pi-remote-web/src/session/` | Opaque session list and navigation state | Create during this phase | Reducer table tests |
| `apps/pi-remote-web/src/thread/` | Transcript, message, tool, queue, and approval reducers | Create during this phase | Reducer table tests |
| `apps/pi-remote-web/src/connection/` | Authentication, replay, snapshot, and reconnect flow | Create during this phase | Reducer table tests |
| `apps/pi-remote-web/src/composer/` | Prompt, steer, follow-up, abort, retry, and uncertain-state UI | Create during this phase | Reducer table tests |
| `apps/pi-remote-web/public/` | Installable manifest and offline read-only shell | Create during this phase | Reducer table tests |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Set up the repository-approved PWA shell, manifest, routing, and authenticated bootstrap.
- [ ] Implement opaque session cards, navigation, connection banner, and stale-state labels.
- [ ] Implement orthogonal reducers and recorded-fixture playback.
- [ ] Implement transcript hydration, streamed drafts, authoritative terminals, and tool cards.
- [ ] Implement replay, snapshot, entry reconciliation, retention-miss, and epoch-change flows.
- [ ] Implement prompt, steer, follow-up, abort, retry, queue, rejected, and indeterminate UI states.
- [ ] Implement timestamped redacted offline cache and local drafts with all offline actions disabled.
- [ ] Pass reducer, browser E2E, reconnect, stale-state, accessibility-foundation, and real-child foreground gates.

### Phase 3: Verification
- [ ] Run focused unit/contract/security checks during implementation.
- [ ] Run the authoritative phase gate from final state.
- [ ] Reconcile tasks, checklist, current state, parent map, and successor handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | Reducer table tests | Repository-selected runner and exact recorded command |
| Integration | Recorded replay and snapshot tests | Repository-selected runner and exact recorded command |
| Evidence | Browser foreground E2E | Repository-selected runner and exact recorded command |
| Evidence | Reconnect and retention-miss tests | Repository-selected runner and exact recorded command |
| Evidence | Keyboard, focus, render-cadence, and live-region checks | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Relay core from phase 003 | Internal | Pending phase preflight | Phase remains blocked |
| Read-only auth boundary from phase 004 | Internal | Pending phase preflight | Phase remains blocked |
| Harness/browser lane from phase 002 | Internal | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Unpublish or disable the PWA route and revoke its application sessions; local Pi and relay operation remain intact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Confirm inputs --> reproduce negative controls --> implement owned boundary
       --> focused checks --> authoritative phase gate --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 004-auth-and-tailnet-boundary | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 006-approval-and-remote-mutation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and negative controls | Medium | 0.5-2 engineer-days |
| Core implementation | High | 2-6 engineer-days |
| Verification and handoff | High | 1-3 engineer-days |
| **Total** | | **3.5-11 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Last compatible state or backup is identified.
- [ ] Capability disablement and revocation are independently available.
- [ ] Native Pi sessions remain outside destructive rollback scope.

### Rollback Procedure
1. Stop or disable the affected capability.
2. Unpublish or disable the PWA route and revoke its application sessions; local Pi and relay operation remain intact.
3. Run the prior-state smoke and integrity checks.
4. Record unresolved mutation uncertainty and operator impact.

### Data Reversal
- **Has data migrations?** No phase-owned migration is planned unless preflight changes the scope.
- **Reversal procedure**: Restore the compatible phase-owned state; never rewrite or delete Pi native session history.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
004-auth-and-tailnet-boundary --> 005-mobile-pwa-and-reconciliation --> 006-approval-and-remote-mutation
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Relay core from phase 003, Read-only auth boundary from phase 004, Harness/browser lane from phase 002 | Versioned implementation inputs | This phase |
| Mobile PWA and Reconciliation | Phase inputs | Accepted deliverables and evidence | 006-approval-and-remote-mutation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Confirm dependencies and negative controls.
2. Implement the smallest complete in-scope boundary.
3. Run focused gates, then the authoritative phase gate.
4. Reconcile evidence and hand off without enabling failed capabilities.

**Parallel Opportunities**: documentation and evidence preparation may proceed once contracts stabilize; shared-file edits require one owner.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Ready | Dependencies and negative controls confirmed | Phase start |
| M2 | Integrated | In-scope behavior works against pinned contracts | Before handoff |
| M3 | Verified | P0/P1 disposition and rollback evidence reconciled | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Model mobile state as orthogonal reducers over authoritative envelopes

**Status**: Accepted for implementation planning

**Context**: Builds the installable foreground mobile experience for sessions, streaming work, reconnect reconciliation, explicit controls, and offline read-only state.

**Decision**: Keep connection, mutation, run, message, tool, approval, and queue state separate and reconcile them through epoch-sequenced relay envelopes.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- Single conversation state machine: Conflates independent failure and progress axes
- Render raw RPC events: Leaks protocol details and cannot safely reconcile reconnects

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read active instructions, confirm the implementation workspace, and pin dependencies.
- [ ] Reproduce the safe negative control and freeze owned files, consumers, rollback, and final gate.

### Execution Rules

| Rule | Required behavior |
|------|-------------------|
| Scope | Change only phase-owned files and declared consumers. |
| Proof | Read outputs and exits, then rerun the authoritative phase gate. |
| Safety | Keep dependent capability disabled on missing or failing evidence. |

### Status Reporting Format
Report status, files changed, exact checks and exits, unresolved gates, rollback state, and next safe action.

### Blocked Task Protocol
Stop dependent work, record the exact failure, repair within the bounded loop, and escalate when new authority or scope is required.
