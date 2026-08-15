---
title: "Implementation Plan: Authentication and Tailnet Boundary"
description: "Execution plan for adds private https/wss ingress, application authentication, default-deny authorization, revocation, and a read-only remote api."
trigger_phrases:
  - "pi remote auth and tailnet boundary"
  - "pi mobile phase 4"
  - "auth and tailnet boundary"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the plan with the implemented auth boundary"
    next_safe_action: "Run the real Tailscale Serve ingress matrix"
    blockers:
      - "Real Tailscale Serve ingress remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Implementation Plan: Authentication and Tailnet Boundary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Authentication and Tailnet Boundary boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | HTTP/WSS authentication integration suite; Origin and ticket replay suite; Authorization matrix suite; Target-host Serve spoof and bypass probes; Revocation and connection-limit tests |

### Overview

Adds private HTTPS/WSS ingress assets, application authentication, default-deny authorization, revocation, and a read-only remote API. The implementation is built; real Tailscale Serve ingress remains operator-verification pending.
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
Expose a loopback relay through Tailscale Serve and require a separate short-lived application session plus per-action authorization.

### Key Components
- **apps/pi-remote-relay/src/http/**: Bootstrap, session, ticket, Origin, and rate-limit endpoints
- **apps/pi-remote-relay/src/auth/**: Principal, workspace, session, action, and revocation policy
- **deploy/pi-remote/**: Loopback service and Tailscale Serve configuration
- **tests/pi-remote/security/ingress/**: Spoof, bypass, ticket, Origin, and revocation evidence

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `apps/pi-remote-relay/src/http/` | Bootstrap, session, ticket, Origin, and rate-limit endpoints | Create during this phase | HTTP/WSS authentication integration suite |
| `apps/pi-remote-relay/src/auth/` | Principal, workspace, session, action, and revocation policy | Create during this phase | HTTP/WSS authentication integration suite |
| `deploy/pi-remote/` | Loopback service and Tailscale Serve configuration | Create during this phase | HTTP/WSS authentication integration suite |
| `tests/pi-remote/security/ingress/` | Spoof, bypass, ticket, Origin, and revocation evidence | Create during this phase | HTTP/WSS authentication integration suite |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Confirm the target-host Serve identity and header contract with negative controls.
- [ ] Implement loopback binding, HTTP bootstrap, secure cookie/session lifecycle, and logout.
- [ ] Implement one-use short-lived WebSocket tickets and exact-Origin handshake validation.
- [ ] Implement default-deny principal/workspace/session/command authorization and revocation.
- [ ] Implement size, rate, malformed-message, and connection limits.
- [ ] Configure Tailscale Serve with Funnel absent and direct-backend rejection.
- [ ] Expose only read-only catalog, snapshot, replay, state, and health operations.
- [ ] Pass ingress spoofing, ticket replay, Origin, revocation, and bypass suites.

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
| Primary | HTTP/WSS authentication integration suite | Repository-selected runner and exact recorded command |
| Integration | Origin and ticket replay suite | Repository-selected runner and exact recorded command |
| Evidence | Authorization matrix suite | Repository-selected runner and exact recorded command |
| Evidence | Target-host Serve spoof and bypass probes | Repository-selected runner and exact recorded command |
| Evidence | Revocation and connection-limit tests | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Relay core from phase 003 | Internal | Pending phase preflight | Phase remains blocked |
| Security harness from phase 002 | Internal | Pending phase preflight | Phase remains blocked |
| Target host and Tailscale | External/version-coupled | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Disable the Serve route, revoke relay sessions, and stop the relay listener while preserving local Pi and relay data.
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
| Setup | 003-relay-protocol-and-state | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 005-mobile-pwa-and-reconciliation |
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
2. Disable the Serve route, revoke relay sessions, and stop the relay listener while preserving local Pi and relay data.
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
003-relay-protocol-and-state --> 004-auth-and-tailnet-boundary --> 005-mobile-pwa-and-reconciliation
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Relay core from phase 003, Security harness from phase 002, Target host and Tailscale | Versioned implementation inputs | This phase |
| Authentication and Tailnet Boundary | Phase inputs | Accepted deliverables and evidence | 005-mobile-pwa-and-reconciliation |
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

### ADR-001: Use Tailscale for private reachability, not application authority

**Status**: Accepted for implementation planning

**Context**: Adds private HTTPS/WSS ingress, application authentication, default-deny authorization, revocation, and a read-only remote API.

**Decision**: Expose a loopback relay through Tailscale Serve and require a separate short-lived application session plus per-action authorization.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- Tailnet identity only: Cannot express per-session or per-action authority and increases proxy-header risk
- Public hosted relay: Requires Internet-grade identity, abuse, tenancy, and operations


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
| Implementation | `apps/pi-remote-relay/src/http/`, `apps/pi-remote-relay/src/auth/`, `deploy/pi-remote/`, `tests/pi-remote/security/ingress/` | Planned |
| Evidence | HTTP/WSS authentication integration suite; Origin and ticket replay suite; Authorization matrix suite; Target-host Serve spoof and bypass probes; Revocation and connection-limit tests | Planned |
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
