---
title: "Implementation Plan: Phase 018 Projection Runtime Core"
description: "Build the production projection runtime core: a default ProviderTransport, a top-level projectMessage() orchestration, a default reject-only meaning judge, and root-barrel client presentation exports, with exact-original behavior on every non-accept terminal."
trigger_phrases:
  - "projection-runtime-core"
  - "implementation plan"
  - "projectMessage orchestration"
  - "provider transport default"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/018-projection-runtime-core"
    last_updated_at: "2026-08-14T07:18:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the projection runtime core and verified the package gate."
    next_safe_action: "Proceed to phase 019 runtime wiring."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-018-projection-runtime-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The default transport, entrypoint, judge binding, and barrel exports ship and pass the package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 018 Projection Runtime Core

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript provider, fidelity, render, and client modules |
| **Framework** | Runtime-neutral projection composition plus default transport implementations |
| **Storage** | Immutable canonical runtime state; no transport or judge persistence |
| **Testing** | Entrypoint, transport, judge, egress, and root-barrel export tests plus the package gate |

### Overview

Supply the missing production pieces so `projectMessage()` turns one raw agent message into a validated display projection or the exact original. Add a default `ProviderTransport`, a top-level orchestration entrypoint, a default reject-only meaning judge, and the root-barrel client exports, preserving every existing invariant and exact-original behavior on every non-accept terminal.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The transport contract, stage order, and judge boundary are frozen.
- [x] The root barrel gaps and every non-accept terminal are inventoried.
- [x] Every terminal state has an expected exact-original outcome.

### Definition of Done

- [x] All twelve requirements and six scenarios have observed evidence.
- [x] `projectMessage()` runs end-to-end against a stub and a real transport.
- [x] No restored plaintext reaches hosted transport and no hosted call precedes privacy routing.
- [x] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-closed production composition with a default transport seam and a local post-restoration reject-only policy gate.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Default ProviderTransport | Provide an HTTP transport for hosted providers and a local-model path where the executor expects a transport |
| projectMessage() entrypoint | Run the full stage order in sequence and return the exact original on any non-accept terminal |
| Default meaning judge | Reject meaning loss after restoration so `judgeMode: 'required'` resolves |
| Root-barrel exports | Make the client presentation functions reachable from the package root |

### Data Flow

Enablement gate -> assemble -> select bounded context -> protect markdown -> select privacy route -> execute provider route -> validate projection candidate -> render decision -> projection or exact-original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Provider adapters and executor | Prepare, parse, and execute approved routes | Inject the default transport where the executor expects it | Transport stub tests |
| Root barrel `src/index.ts` | Publish config, contracts, context, core, fidelity, observability, render, versioning | Export the clients surface and any provider, privacy, or runtime surface the entrypoint needs | Public-import smoke |
| Fidelity validator | Restores and validates candidates | Bind the default reject-only judge so `judgeMode: 'required'` resolves | Judge resolve tests |
| Render decision | Chooses display output | Consume explicit gate results and retain exact-original fallback | Terminal-state matrix |
| Client presentation | Apply display or sidecar presentation | Become reachable from the root barrel | Root-barrel import tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the executor transport contract, root barrel gaps, and the judge interface.
- [x] Freeze the `projectMessage()` stage order and the default transport and judge boundaries.

### Phase 2: Implementation

- [x] Implement the default hosted-provider HTTP transport.
- [x] Implement the local-model transport path.
- [x] Add the top-level `projectMessage()` orchestration entrypoint.
- [x] Bind the default reject-only meaning judge for `judgeMode: 'required'`.
- [x] Export the client presentation functions from the root barrel.

### Phase 3: Verification

- [x] Prove stage order end-to-end against a stub transport and a real transport.
- [x] Prove exact-original on every non-accept terminal and privacy-before-hosted.
- [x] Prove canonical state is unchanged.
- [x] Run the package gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Transport | HTTP hosted-provider stub and local-model endpoint | TypeScript integration tests with deterministic stubs |
| Entrypoint | Stage order, enablement gate, and exact-original terminals | TypeScript integration tests and exact-byte assertions |
| Judge | `judgeMode: 'required'` resolve, reject-only, and unavailable outcomes | Deterministic judge stubs and terminal-state matrix |
| Privacy | No hosted egress before routing and no restored-plaintext egress | Transport canaries and local-boundary assertions |
| Regression | Canonical immutability and root-barrel imports | Existing suite plus `npm run check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 017 runtime-wiring feasibility and contract | Internal | Planned predecessor | The transport and wiring contract is unpinned |
| Phase 016 default-off enablement gate | Internal | Available | `projectMessage()` cannot gate real behaviour |
| Phase 002-008 assembled library | Internal | Available | Composition cannot be wired |
| Default reject-only meaning judge | Runtime | Required for `judgeMode: 'required'`; absence must fail closed | Projection stays exact-original |
| Hosted and local provider endpoints | Runtime | Required for end-to-end proof | End-to-end run is limited to stubs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hosted call precedes privacy routing, a judge failure accepts, `judgeMode: 'required'` stays `JUDGE_UNAVAILABLE`, or canonical state changes.
- **Procedure**: Disable the `projectMessage()` entrypoint and the default transport, return all affected candidates to exact-original, rerun transport canaries and byte assertions, and restore the prior root-barrel exports.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Boundary and transport freeze -> Default transport and composition -> Judge binding and exports -> End-to-end verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary and transport freeze | Phase 017 contract and assembled library | Default transport and composition |
| Default transport and composition | Frozen transport contract | Judge binding and exports |
| Judge binding and exports | Composed entrypoint | End-to-end verification |
| End-to-end verification | Implemented entrypoint | Phase handoff to 019-025 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary and transport freeze | Medium | 1 day |
| Default transport and composition | High | 2-4 days |
| Judge binding, exports, and verification | High | 2-3 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Capture the exact-original baseline and the `JUDGE_UNAVAILABLE` baseline.
- [x] Confirm the current root-barrel export surface.
- [x] Seed every transport and judge terminal state.

### Procedure

1. Disable the new `projectMessage()` entrypoint and the default transport.
2. Route candidate handling to exact-original.
3. Rerun transport canaries, terminal-state tests, and the public-import smoke.
4. Confirm canonical transcript and event bytes remain unchanged.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the transport, entrypoint, judge binding, and barrel exports only; canonical state is never rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Enablement gate -> Assembler -> Context -> Protect -> Privacy route -> Provider transport -> Validate -> Render
                              |                            |          |                     |         |
                              +----------------- exact-original on any non-accept terminal ----------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Default ProviderTransport | Transport contract and privacy route | Executed wire request and parsed candidate | Validate |
| projectMessage() entrypoint | All stage producers | Projection or exact-original | Handoff to 019-025 |
| Default meaning judge | Valid restored candidate and local boundary | Accept or reject-only outcome | Render |
| Root-barrel exports | Clients and runtime surfaces | Reachable presentation surface | Runtime client wiring |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze the transport and stage-order contract** - 1 day - critical.
2. **Implement the default transport and `projectMessage()` composition** - 2-4 days - critical.
3. **Bind the judge, export the barrel, and pass end-to-end gates** - 2-3 days - critical.

**Parallel opportunities**:

- Terminal-state fixtures and egress canaries can be authored after the contract freeze.
- The local transport path and the hosted transport can be implemented independently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract frozen | Transport, stage order, and judge boundary defined | Stage 1 |
| M2 | Runtime core built | `projectMessage()` runs with the default transport and judge | Stage 2 |
| M3 | Handoff accepted | Stub and real-transport runs pass, privacy and byte gates hold | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: Build a default `ProviderTransport` (HTTP plus local-model path) and a top-level `projectMessage()` orchestration that binds a default reject-only meaning judge and exports the client presentation surface from the root barrel.

**Status**: Accepted. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the transport contract, stage order, judge boundary, and exact-original baseline.
- Re-read every target module before editing and keep privacy routing before any hosted call.
- Enumerate every transport and judge terminal state and expected render outcome before implementation.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Enablement, privacy routing, deterministic restoration, and judgment must precede render selection in order. |
| TASK-SCOPE | Build the runtime core only; do not change module contracts or add hosted plaintext judgment. |
| TASK-PROOF | Run transport, terminal-state, egress, and canonical-byte negatives before the whole package gate. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=018 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the transport cannot stay privacy-first, a terminal state lacks an exact-original mapping, or `judgeMode: 'required'` cannot resolve, stop the task and retain exact-original behavior until the boundary is corrected.
