---
title: "Implementation Plan: Relay Protocol and Durable State"
description: "Execution plan for implements the host-local pi rpc supervisor, durable replay, session catalog, mutation ledger, and crash-safe reconciliation core."
trigger_phrases:
  - "pi remote relay protocol and state"
  - "pi mobile phase 3"
  - "relay protocol and state"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state"
    last_updated_at: "2026-08-10T18:43:21Z"
    last_updated_by: "codex"
    recent_action: "Authored the approved phase planning packet"
    next_safe_action: "Run this phase's definition-of-ready checks before implementation"
    blockers:
      - "Product implementation for this phase has not started"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
---

# Implementation Plan: Relay Protocol and Durable State

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Relay Protocol and Durable State boundary within the Pi relay/PWA system |
| **Storage** | Relay-owned SQLite plus Pi native sessions |
| **Testing** | Protocol unit/property suite; Recorded and live Pi contract suite; Storage migration and restart suite; Session isolation and kill-point suite; Slow-client and queue-bound load suite |

### Overview

Implements the host-local Pi RPC supervisor, durable replay, session catalog, mutation ledger, and crash-safe reconciliation core. Work remains planning-only until the definition of ready passes.
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
Use one persistent Pi RPC child per active session plus a relay-owned transactional replay and mutation store.

### Key Components
- **packages/pi-rpc-protocol/**: Version-pinned RPC adapter and shared transport types
- **apps/pi-remote-relay/src/rpc/**: Strict framing, demultiplexing, child supervision, and health
- **apps/pi-remote-relay/src/store/**: SQLite migrations and durable state transitions
- **apps/pi-remote-relay/src/replay/**: Epoch, sequence, replay, snapshot, and reconciliation logic
- **apps/pi-remote-relay/src/sessions/**: Workspace-scoped opaque session catalog

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/pi-rpc-protocol/` | Version-pinned RPC adapter and shared transport types | Create during this phase | Protocol unit/property suite |
| `apps/pi-remote-relay/src/rpc/` | Strict framing, demultiplexing, child supervision, and health | Create during this phase | Protocol unit/property suite |
| `apps/pi-remote-relay/src/store/` | SQLite migrations and durable state transitions | Create during this phase | Protocol unit/property suite |
| `apps/pi-remote-relay/src/replay/` | Epoch, sequence, replay, snapshot, and reconciliation logic | Create during this phase | Protocol unit/property suite |
| `apps/pi-remote-relay/src/sessions/` | Workspace-scoped opaque session catalog | Create during this phase | Protocol unit/property suite |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Finalize protocol types against phase-001 evidence and phase-002 fixtures.
- [ ] Implement strict-LF framing, serialized stdin writes, response correlation, event demultiplexing, and stderr isolation.
- [ ] Implement per-session child supervision, epochs, health, verified-idle locking, and bounded restart.
- [ ] Implement versioned SQLite migrations and transaction invariants.
- [ ] Implement redacted persist-before-broadcast replay, gap handling, floors, cursors, and snapshot barriers.
- [ ] Implement mutation digest, outcome, conflict, and indeterminate recovery semantics.
- [ ] Implement version-matched session discovery with workspace policy and opaque identifiers.
- [ ] Pass recorded/live contract, storage, isolation, chaos, and bounded-backpressure gates.

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
| Primary | Protocol unit/property suite | Repository-selected runner and exact recorded command |
| Integration | Recorded and live Pi contract suite | Repository-selected runner and exact recorded command |
| Evidence | Storage migration and restart suite | Repository-selected runner and exact recorded command |
| Evidence | Session isolation and kill-point suite | Repository-selected runner and exact recorded command |
| Evidence | Slow-client and queue-bound load suite | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 and 002 | Internal | Pending phase preflight | Phase remains blocked |
| SQLite driver selected during preflight | Internal | Pending phase preflight | Phase remains blocked |
| Installed Pi runtime | External/version-coupled | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Stop the relay, archive or restore the compatible relay database, and continue using Pi locally; never delete Pi native sessions.
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
| Setup | 002-automated-test-harness | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 004-auth-and-tailnet-boundary |
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
2. Stop the relay, archive or restore the compatible relay database, and continue using Pi locally; never delete Pi native sessions.
3. Run the prior-state smoke and integrity checks.
4. Record unresolved mutation uncertainty and operator impact.

### Data Reversal
- **Has data migrations?** Possibly; relay migrations must be versioned and reversible.
- **Reversal procedure**: Restore the compatible phase-owned state; never rewrite or delete Pi native session history.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
002-automated-test-harness --> 003-relay-protocol-and-state --> 004-auth-and-tailnet-boundary
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Phases 001 and 002, SQLite driver selected during preflight, Installed Pi runtime | Versioned implementation inputs | This phase |
| Relay Protocol and Durable State | Phase inputs | Accepted deliverables and evidence | 004-auth-and-tailnet-boundary |
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

### ADR-001: Let the relay own process lifetime and durable state

**Status**: Accepted for implementation planning

**Context**: Implements the host-local Pi RPC supervisor, durable replay, session catalog, mutation ledger, and crash-safe reconciliation core.

**Decision**: Use one persistent Pi RPC child per active session plus a relay-owned transactional replay and mutation store.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- One child per prompt: Breaks streaming, queueing, settlement, and session continuity
- One shared child for all sessions: Session switches can abort or cross-contaminate active work


<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
Read the active instructions, select the implementation workspace when required, reproduce safe negative controls, and freeze the owned file list before changes.

### Tier 2: Bounded Workstreams
Implementation and evidence lanes may proceed independently only with exclusive file ownership and explicit sync points.

### Tier 3: Integration
The primary owner integrates, reruns cross-boundary tests, and keeps dependent capabilities disabled on any failing P0 gate.

### Pre-Task Checklist
- [ ] Read active instructions and confirm the implementation workspace.
- [ ] Reproduce the safe negative control and pin external contracts.
- [ ] Freeze owned files, consumers, rollback, and the authoritative command.

### Execution Rules

| Rule | Required behavior |
|------|-------------------|
| Scope | Change only the phase-owned boundary and declared consumers. |
| Proof | Read outputs and exits; rerun the whole phase gate from final state. |
| Security | Keep dependent capability disabled on missing or failing evidence. |
| Handoff | Reconcile parent, successor, docs, limitations, and rollback state. |

### Status Reporting Format
Report status, scope completed, files changed, checks and exits, unresolved gates, rollback state, and next safe action.

### Blocked Task Protocol
Stop dependent work, record the exact failure, repair within the bounded loop, and escalate only when new authority or scope is required.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

| Workstream | Ownership | Status |
|------------|-----------|--------|
| Implementation | `packages/pi-rpc-protocol/`, `apps/pi-remote-relay/src/rpc/`, `apps/pi-remote-relay/src/store/`, `apps/pi-remote-relay/src/replay/`, `apps/pi-remote-relay/src/sessions/` | Planned |
| Evidence | Protocol unit/property suite; Recorded and live Pi contract suite; Storage migration and restart suite; Session isolation and kill-point suite; Slow-client and queue-bound load suite | Planned |
| Documentation handoff | Phase 008 inputs and parent status | Planned |

### Sync Points
- Contract freeze before consumer implementation.
- Focused checks before cross-boundary integration.
- Whole phase gate before successor or capability enablement.

### File Ownership Rules
One active owner per implementation file; contract changes require consumer inventory and a declared sync point.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
Report scope completed, files changed, exact checks and exits, unresolved gates, rollback state, and next safe action at each milestone.

### Escalation Path
Protocol drift stops consumers; security uncertainty disables mutation or ingress; device uncertainty removes the affected support claim; scope expansion returns to the parent map.
<!-- /ANCHOR:communication -->
