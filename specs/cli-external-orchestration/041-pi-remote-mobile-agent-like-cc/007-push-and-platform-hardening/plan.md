---
title: "Implementation Plan: Push and Platform Hardening"
description: "Execution plan for adds privacy-minimized web push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms."
trigger_phrases:
  - "pi remote push and platform hardening"
  - "pi mobile phase 7"
  - "push and platform hardening"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening"
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

# Implementation Plan: Push and Platform Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Push and Platform Hardening boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | Payload privacy inspection; Subscription lifecycle suite; Stale hint and reauthentication tests; Physical-device lifecycle matrix; Logout and revocation checks |

### Overview

Adds privacy-minimized Web Push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms. Work remains planning-only until the definition of ready passes.
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
Send generic hints only after committed state transitions and require authenticated fetch-on-open for all details and actions.

### Key Components
- **apps/pi-remote-relay/src/push/**: Encrypted subscriptions, preferences, deduplication, and generic hints
- **apps/pi-remote-web/src/service-worker/**: Notification handling and authenticated fetch-on-open
- **apps/pi-remote-web/src/settings/**: Per-device preferences and unsubscribe/logout behavior
- **tests/pi-remote/device/**: Install, lifecycle, stale-hint, and platform fixtures

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `apps/pi-remote-relay/src/push/` | Encrypted subscriptions, preferences, deduplication, and generic hints | Create during this phase | Payload privacy inspection |
| `apps/pi-remote-web/src/service-worker/` | Notification handling and authenticated fetch-on-open | Create during this phase | Payload privacy inspection |
| `apps/pi-remote-web/src/settings/` | Per-device preferences and unsubscribe/logout behavior | Create during this phase | Payload privacy inspection |
| `tests/pi-remote/device/` | Install, lifecycle, stale-hint, and platform fixtures | Create during this phase | Payload privacy inspection |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Confirm push prerequisites and supported OS/browser/install rows.
- [ ] Implement encrypted subscription storage, rotation, preferences, and endpoint cleanup.
- [ ] Implement committed-transition classification, generic payloads, deduplication, and foreground suppression.
- [ ] Implement service-worker receipt, generic notification UI, and authenticated fetch-on-open.
- [ ] Implement unsubscribe, logout, revocation, reinstall, and permission-change behavior.
- [ ] Exercise payload inspection, stale hint, expired approval, offline, kill/restart, Focus, and invalid-endpoint cases.
- [ ] Record platform limitations and hand them to documentation and release phases.

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
| Primary | Payload privacy inspection | Repository-selected runner and exact recorded command |
| Integration | Subscription lifecycle suite | Repository-selected runner and exact recorded command |
| Evidence | Stale hint and reauthentication tests | Repository-selected runner and exact recorded command |
| Evidence | Physical-device lifecycle matrix | Repository-selected runner and exact recorded command |
| Evidence | Logout and revocation checks | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Foreground PWA from phase 005 | Internal | Pending phase preflight | Phase remains blocked |
| Committed relay transitions from phase 003 | Internal | Pending phase preflight | Phase remains blocked |
| Auth/revocation from phase 004 | Internal | Pending phase preflight | Phase remains blocked |
| Supported physical devices | External/version-coupled | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Disable push generation, revoke subscriptions, and remove service-worker notification handling without affecting foreground remote control.
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
| Setup | 006-approval-and-remote-mutation | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 008-documentation-and-runbooks |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and negative controls | Medium | 0.5-2 engineer-days |
| Core implementation | Medium | 2-6 engineer-days |
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
2. Disable push generation, revoke subscriptions, and remove service-worker notification handling without affecting foreground remote control.
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
006-approval-and-remote-mutation --> 007-push-and-platform-hardening --> 008-documentation-and-runbooks
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Foreground PWA from phase 005, Committed relay transitions from phase 003, Auth/revocation from phase 004, Supported physical devices | Versioned implementation inputs | This phase |
| Push and Platform Hardening | Phase inputs | Accepted deliverables and evidence | 008-documentation-and-runbooks |
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

### ADR-001: Treat push as a lossy privacy-minimized hint

**Status**: Accepted for implementation planning

**Context**: Adds privacy-minimized Web Push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms.

**Decision**: Send generic hints only after committed state transitions and require authenticated fetch-on-open for all details and actions.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- Detailed notification payloads: Leaks sensitive agent and tool context on lock screens
- Push approval actions: Stale background state cannot safely carry authority

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
