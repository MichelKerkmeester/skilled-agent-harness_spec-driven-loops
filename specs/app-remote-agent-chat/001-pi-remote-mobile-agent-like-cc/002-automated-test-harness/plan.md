---
title: "Implementation Plan: Automated Test Harness"
description: "Execution plan for builds the recorded, live, integration, security, browser, and crash harness that proves the remote control plane fails closed."
trigger_phrases:
  - "pi remote automated test harness"
  - "pi mobile phase 2"
  - "automated test harness"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/002-automated-test-harness"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented harness with passing machine evidence"
    next_safe_action: "Retain machine evidence while phase 009 collects operator-only gates"
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

# Implementation Plan: Automated Test Harness

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Automated Test Harness boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | Harness self-tests and negative controls; Fixture drift checks; Isolation and leaked-process checks; Deterministic rerun comparison |

### Overview

Builds the recorded, integration, security, browser, rollback, rollout, and crash harness that proves machine-verifiable boundaries fail closed. The implementation and stored machine gate are green.
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
Build the acceptance and failure harness before the relay and keep it as a cross-cutting workstream.

### Key Components
- **tests/pi-remote/contract/**: Recorded and live Pi RPC contract suites
- **tests/pi-remote/integration/**: Isolated relay-to-Pi lifecycle fixtures
- **tests/pi-remote/chaos/**: Deterministic WebSocket, relay, and Pi kill-point harness
- **tests/pi-remote/security/**: Auth, approval, containment, and canary matrices
- **tests/pi-remote/browser/**: PWA reducer and browser end-to-end fixtures

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `tests/pi-remote/contract/` | Recorded and live Pi RPC contract suites | Create during this phase | Harness self-tests and negative controls |
| `tests/pi-remote/integration/` | Isolated relay-to-Pi lifecycle fixtures | Create during this phase | Harness self-tests and negative controls |
| `tests/pi-remote/chaos/` | Deterministic WebSocket, relay, and Pi kill-point harness | Create during this phase | Harness self-tests and negative controls |
| `tests/pi-remote/security/` | Auth, approval, containment, and canary matrices | Create during this phase | Harness self-tests and negative controls |
| `tests/pi-remote/browser/` | PWA reducer and browser end-to-end fixtures | Create during this phase | Harness self-tests and negative controls |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Import the sanitized baseline fixtures and define fixture version metadata.
- [ ] Implement strict-LF parser, response/event, reducer, authorization, digest, and redaction unit/property tests.
- [ ] Implement temporary database migration, transaction, replay, mutation, and approval state tests.
- [ ] Implement isolated real-child integration fixtures with health and teardown assertions.
- [ ] Implement the WebSocket/relay/Pi kill-point controller and mutation ambiguity oracle.
- [ ] Implement Origin, ticket, revocation, cross-workspace, approval race, containment, and canary suites.
- [ ] Implement browser reducer and foreground PWA journeys with recorded streams.
- [ ] Publish one authoritative command matrix and evidence schema for phases 003 through 009.

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
| Primary | Harness self-tests and negative controls | Repository-selected runner and exact recorded command |
| Integration | Fixture drift checks | Repository-selected runner and exact recorded command |
| Evidence | Isolation and leaked-process checks | Repository-selected runner and exact recorded command |
| Evidence | Deterministic rerun comparison | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 contracts and threat model | Internal | Pending phase preflight | Phase remains blocked |
| Repository-selected test runner | Internal | Pending phase preflight | Phase remains blocked |
| Isolated Pi test workspace | External/version-coupled | Pending phase preflight | Phase remains blocked |
| Browser automation runtime | Internal | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Remove the harness additions and keep implementation phases blocked; never weaken a failing negative control to unblock production code.
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
| Setup | 001-contract-and-threat-baseline | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 003-relay-protocol-and-state |
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
2. Remove the harness additions and keep implementation phases blocked; never weaken a failing negative control to unblock production code.
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
001-contract-and-threat-baseline --> 002-automated-test-harness --> 003-relay-protocol-and-state
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Phase 001 contracts and threat model, Repository-selected test runner, Isolated Pi test workspace, Browser automation runtime | Versioned implementation inputs | This phase |
| Automated Test Harness | Phase inputs | Accepted deliverables and evidence | 003-relay-protocol-and-state |
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

### ADR-001: Make the evidence harness a product dependency

**Status**: Accepted for implementation planning

**Context**: Builds the recorded, live, integration, security, browser, and crash harness that proves the remote control plane fails closed.

**Decision**: Build the acceptance and failure harness before the relay and keep it as a cross-cutting workstream.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- Test after implementation: Cannot provide a safe negative control and encourages implementation-shaped tests
- Manual testing only: Not repeatable across crash and race matrices

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
