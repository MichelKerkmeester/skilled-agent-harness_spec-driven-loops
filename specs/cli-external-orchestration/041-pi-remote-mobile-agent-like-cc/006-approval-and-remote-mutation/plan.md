---
title: "Implementation Plan: Approval, Containment, and Remote Mutation"
description: "Execution plan for introduces the final-boundary pi approval extension, containment, shared redaction, and evidence-gated remote mutation."
trigger_phrases:
  - "pi remote approval and remote mutation"
  - "pi mobile phase 6"
  - "approval and remote mutation"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation"
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

# Implementation Plan: Approval, Containment, and Remote Mutation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Approval, Containment, and Remote Mutation boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | Canonicalization and digest compatibility; Approval mismatch/race/restart matrix; Containment escape suite; Canary scan across every boundary; Kill-switch and per-command authorization suite |

### Overview

Introduces the final-boundary Pi approval extension, containment, shared redaction, and evidence-gated remote mutation. Work remains planning-only until the definition of ready passes.
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
Use a pinned Pi extension that recomputes a canonical action digest immediately before protected execution and consumes one relay-authorized lease.

### Key Components
- **extensions/pi-remote-approval/**: Pinned protected-tool gate with canonical payload binding
- **apps/pi-remote-relay/src/approval/**: Approval leases, decisions, revocation, and audit metadata
- **apps/pi-remote-relay/src/policy/**: Per-command mutation enablement and kill switch
- **deploy/pi-remote/containment/**: Workspace, process, credential, UID, and network restrictions
- **tests/pi-remote/security/approval/**: TOCTOU, race, escape, restart, and canary evidence

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `extensions/pi-remote-approval/` | Pinned protected-tool gate with canonical payload binding | Create during this phase | Canonicalization and digest compatibility |
| `apps/pi-remote-relay/src/approval/` | Approval leases, decisions, revocation, and audit metadata | Create during this phase | Canonicalization and digest compatibility |
| `apps/pi-remote-relay/src/policy/` | Per-command mutation enablement and kill switch | Create during this phase | Canonicalization and digest compatibility |
| `deploy/pi-remote/containment/` | Workspace, process, credential, UID, and network restrictions | Create during this phase | Canonicalization and digest compatibility |
| `tests/pi-remote/security/approval/` | TOCTOU, race, escape, restart, and canary evidence | Create during this phase | Canonicalization and digest compatibility |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Pin and integrity-check the Pi extension load and handler-order contract.
- [ ] Implement canonical action serialization and shared digest fixtures.
- [ ] Implement the protected-tool extension with fail-closed final-boundary checks.
- [ ] Implement approval leases, expiry, CAS decisions, revocation, epoch invalidation, and metadata audit.
- [ ] Apply workspace, filesystem, process, credential, UID, and network containment.
- [ ] Apply one redaction/classification policy before all live, durable, cached, audit, and push boundaries.
- [ ] Implement the independent mutation kill switch and default-deny command policy.
- [ ] Enable command families one by one only after all matrix gates pass.
- [ ] Run TOCTOU, race, restart, revocation, escape, leakage, and mutation-crash suites.

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
| Primary | Canonicalization and digest compatibility | Repository-selected runner and exact recorded command |
| Integration | Approval mismatch/race/restart matrix | Repository-selected runner and exact recorded command |
| Evidence | Containment escape suite | Repository-selected runner and exact recorded command |
| Evidence | Canary scan across every boundary | Repository-selected runner and exact recorded command |
| Evidence | Kill-switch and per-command authorization suite | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 through 005 | Internal | Pending phase preflight | Phase remains blocked |
| Pinned Pi extension surface | External/version-coupled | Pending phase preflight | Phase remains blocked |
| Target-host containment primitive | External/version-coupled | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Disable the mutation kill switch, revoke and deny all leases, unload the remote approval extension, and retain read-only remote monitoring.
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
| Setup | 005-mobile-pwa-and-reconciliation | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 007-push-and-platform-hardening |
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
2. Disable the mutation kill switch, revoke and deny all leases, unload the remote approval extension, and retain read-only remote monitoring.
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
005-mobile-pwa-and-reconciliation --> 006-approval-and-remote-mutation --> 007-push-and-platform-hardening
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Phases 001 through 005, Pinned Pi extension surface, Target-host containment primitive | Versioned implementation inputs | This phase |
| Approval, Containment, and Remote Mutation | Phase inputs | Accepted deliverables and evidence | 007-push-and-platform-hardening |
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

### ADR-001: Gate protected tools at Pi's final executable boundary

**Status**: Accepted for implementation planning

**Context**: Introduces the final-boundary Pi approval extension, containment, shared redaction, and evidence-gated remote mutation.

**Decision**: Use a pinned Pi extension that recomputes a canonical action digest immediately before protected execution and consumes one relay-authorized lease.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- Approve only in the PWA: Cannot prove the executed arguments stayed unchanged
- Relay-only preflight: A later extension or tool transformation can bypass the approved payload


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
| Implementation | `extensions/pi-remote-approval/`, `apps/pi-remote-relay/src/approval/`, `apps/pi-remote-relay/src/policy/`, `deploy/pi-remote/containment/`, `tests/pi-remote/security/approval/` | Planned |
| Evidence | Canonicalization and digest compatibility; Approval mismatch/race/restart matrix; Containment escape suite; Canary scan across every boundary; Kill-switch and per-command authorization suite | Planned |
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
