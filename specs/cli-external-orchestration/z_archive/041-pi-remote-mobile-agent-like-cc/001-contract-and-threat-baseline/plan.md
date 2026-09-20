---
title: "Implementation Plan: Contract and Threat Baseline"
description: "Execution plan for pins the live pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation."
trigger_phrases:
  - "pi remote contract and threat baseline"
  - "pi mobile phase 1"
  - "contract and threat baseline"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
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

# Implementation Plan: Contract and Threat Baseline

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and repository-selected tooling; exact versions pinned at phase start |
| **Framework** | Contract and Threat Baseline boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | Fixture parse and schema validation; Pi upgrade drift comparison; Threat-model coverage matrix; Canary scan of captured evidence |

### Overview

Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation. Work remains planning-only until the definition of ready passes.
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
Use a version-pinned contract and threat baseline as the mandatory entry gate for every implementation phase.

### Key Components
- **packages/pi-rpc-protocol/**: Versioned Pi command, response, event, envelope, and state contracts
- **tests/pi-remote/fixtures/**: Sanitized recorded RPC and session-layout fixtures
- **tests/pi-remote/security/**: Threat model, authorization matrix, and negative-control definitions
- **deploy/pi-remote/baseline/**: Pinned host, Pi, Node, browser, and Tailscale evidence

### Data Flow
Dependencies enter through versioned contracts; the phase changes only its owned boundary; redacted evidence and explicit outcomes flow to the successor, documentation, and release verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is planned feature work. The table is a producer/consumer inventory, not a claim that a defect has already been fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/pi-rpc-protocol/` | Versioned Pi command, response, event, envelope, and state contracts | Create during this phase | Fixture parse and schema validation |
| `tests/pi-remote/fixtures/` | Sanitized recorded RPC and session-layout fixtures | Create during this phase | Fixture parse and schema validation |
| `tests/pi-remote/security/` | Threat model, authorization matrix, and negative-control definitions | Create during this phase | Fixture parse and schema validation |
| `deploy/pi-remote/baseline/` | Pinned host, Pi, Node, browser, and Tailscale evidence | Create during this phase | Fixture parse and schema validation |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dependencies, versions, negative controls, file ownership, and rollback.
- [ ] Reconcile the phase plan with live repository paths.

### Phase 2: Core Implementation
- [ ] Confirm repository surface, package manager, workspace choice, host OS, deployment user, and target devices.
- [ ] Capture Pi version, help, RPC docs/types, LF framing, settlement, session layout, and extension loading.
- [ ] Capture Tailscale Serve HTTPS/WSS identity, header, loopback, and Funnel behavior.
- [ ] Define command/event/envelope schemas, stream epochs, mutation states, authorization matrix, redaction classes, and retention bounds.
- [ ] Author the threat model and map each risk to a phase-002 negative control.
- [ ] Review the frozen baseline with relay, PWA, security, testing, documentation, and release consumers.

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
| Primary | Fixture parse and schema validation | Repository-selected runner and exact recorded command |
| Integration | Pi upgrade drift comparison | Repository-selected runner and exact recorded command |
| Evidence | Threat-model coverage matrix | Repository-selected runner and exact recorded command |
| Evidence | Canary scan of captured evidence | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing research lineages | Internal | Pending phase preflight | Phase remains blocked |
| Installed Pi CLI | External/version-coupled | Pending phase preflight | Phase remains blocked |
| Target host and Tailscale | External/version-coupled | Pending phase preflight | Phase remains blocked |
| Operator-selected device resources | External/version-coupled | Pending phase preflight | Phase remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, migration, or authoritative command fails.
- **Procedure**: Discard the baseline artifacts and keep every downstream capability blocked; no production state or Pi session is changed.
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
| Setup | Approved parent scope | Implementation |
| Implementation | Setup and phase 002 evidence harness | Verification |
| Verification | Implemented boundary | 002-automated-test-harness |
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
2. Discard the baseline artifacts and keep every downstream capability blocked; no production state or Pi session is changed.
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
approved parent scope --> 001-contract-and-threat-baseline --> 002-automated-test-harness
                         |
                         +--> evidence consumed by phases 008 and 009
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase inputs | Existing research lineages, Installed Pi CLI, Target host and Tailscale, Operator-selected device resources | Versioned implementation inputs | This phase |
| Contract and Threat Baseline | Phase inputs | Accepted deliverables and evidence | 002-automated-test-harness |
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

### ADR-001: Freeze live contracts and trust boundaries before production code

**Status**: Accepted for implementation planning

**Context**: Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation.

**Decision**: Use a version-pinned contract and threat baseline as the mandatory entry gate for every implementation phase.

**Consequences**:
- The phase owns one testable boundary and a clear rollback.
- Downstream work remains blocked on failed P0 evidence.

**Alternatives Rejected**:
- Start with the PWA: Builds on unverified protocol and authority assumptions
- Rely on research reports: Cannot prove the implementation host or current versions


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
| Implementation | `packages/pi-rpc-protocol/`, `tests/pi-remote/fixtures/`, `tests/pi-remote/security/`, `deploy/pi-remote/baseline/` | Planned |
| Evidence | Fixture parse and schema validation; Pi upgrade drift comparison; Threat-model coverage matrix; Canary scan of captured evidence | Planned |
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
