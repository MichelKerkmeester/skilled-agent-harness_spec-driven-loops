---
title: "Feature Specification: Phase 018 Projection Runtime Core"
description: "Build the production projection runtime core so the enablement flag gates a genuinely working transform: a default provider transport, a top-level projectMessage() orchestration, a default reject-only meaning judge, and root-barrel client presentation exports."
trigger_phrases:
  - "projection-runtime-core"
  - "projection runtime core"
  - "projectMessage orchestration"
  - "provider transport default"
  - "communication projection runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/018-projection-runtime-core"
    last_updated_at: "2026-08-14T07:18:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the projection runtime core and verified the package gate."
    next_safe_action: "Proceed to phase 019 runtime wiring."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 018 Projection Runtime Core

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The enablement flag gates a partially-unbuilt library. The provider adapters only prepare and parse, the executor requires a transport that no production code provides, the client presentation functions are unreachable from the root barrel, and `judgeMode: 'required'` falls back to `JUDGE_UNAVAILABLE`. This phase builds the production projection runtime core so a single `projectMessage()` call turns one raw agent message into a validated display projection or the exact original. This is the critical path: the runtime-wiring phases 019 through 025 cannot project until this exists.

**Key decisions**: one top-level `projectMessage()` orchestration entrypoint owns the full stage order; a default `ProviderTransport` (HTTP for hosted providers plus a local-model path) is injected where the executor expects it; a default reject-only meaning judge binds `judgeMode: 'required'`; and the client presentation surface becomes reachable from the root barrel.

**Critical dependency**: the Phase 017 runtime-wiring feasibility and contract (predecessor), the Phase 002-008 assembled projection library, and the Phase 016 default-off enablement gate.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 18 of 28 |
| **Predecessor** | `017-runtime-wiring-feasibility-and-contract` |
| **Successor** | `019-opencode-native-plugin` |
| **Handoff Criteria** | `projectMessage()` runs end-to-end against a stub and a real transport, `judgeMode: 'required'` resolves without `JUDGE_UNAVAILABLE`, the client presentation functions are reachable from the root barrel, canonical bytes stay unchanged, the package gate passes with new entrypoint tests, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase makes the enablement flag gate real behaviour by supplying the missing production pieces: a default transport, a top-level orchestration entrypoint, a default reject-only meaning judge, and the missing root-barrel exports.

**Scope boundary**: Build the projection runtime core only. Preserve every existing module contract for assembly, context selection, protected spans, privacy routing, provider execution, fidelity validation, and render decisions. Do not build the runtime adapters and client wiring, which belong to phases 019 through 025.

**Dependencies**:

- Phase 017 `runtime-wiring-feasibility-and-contract` (predecessor), which pins the runtime-wiring feasibility and the transport contract
- The Phase 002-008 assembled projection library: `MessageAssembler`, `selectBoundedContext`, `protectMarkdown`, `selectPrivacyRoute`, `executeProviderRoute`, `validateProjectionCandidate`, and `decideRender`
- The Phase 016 default-off enablement gate `isProjectionEnabled()`
- A default reject-only meaning judge with a local boundary, because restored plaintext must never reach a hosted judge

**Deliverables**:

- A default `ProviderTransport`: an HTTP transport for hosted providers plus a local-model path, injected where the executor expects it
- A top-level `projectMessage()` orchestration entrypoint that runs the full sequence in order
- A default reject-only meaning judge (or the existing proxy-judge wired into the public barrel) so `judgeMode: 'required'` does not fall back to `JUDGE_UNAVAILABLE`
- Root-barrel exports for `applyDisplayPresentation` and `applySidecarPresentation`
- End-to-end tests against a stub and a real transport, with `npm run check` green
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- The provider adapters only prepare and parse; there is no default transport implementation, so the executor cannot run out of the box. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:27-63] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/providers/types.ts:140]
- `ExecuteProviderRouteInput` requires a `transport` that no production code provides, leaving the projection path unwired. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/providers/executor.ts:23-27]
- The root barrel omits the provider, privacy, clients, and evaluation surfaces, so `applyDisplayPresentation` and `applySidecarPresentation` are exported but unreachable from the package root. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/index.ts] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/clients/index.ts]
- `validateProjectionCandidate` falls back to `FidelityReasonCodes.JUDGE_UNAVAILABLE` when `judgeMode: 'required'` runs without a bound judge. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:229-231]
- No single entrypoint composes assembly, context selection, protection, privacy routing, provider execution, validation, and render decision for one raw agent message.

### Purpose

Make the enablement flag gate a genuinely working transform: one `projectMessage()` call produces a validated display projection or the exact original, with every existing invariant preserved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A default `ProviderTransport` implementation: an HTTP transport for hosted providers plus a local-model path (Ollama or llama.cpp compatible endpoint), injected where the executor expects it.
- A top-level `projectMessage()` orchestration entrypoint that runs the full sequence in order: `isProjectionEnabled` gate -> `MessageAssembler` (`startGeneration` / `ingestEvent`) -> `selectBoundedContext` -> `protectMarkdown` -> `selectPrivacyRoute` -> `executeProviderRoute` -> `validateProjectionCandidate` -> `decideRender` -> exact-original fallback on any non-accept terminal.
- A default reject-only meaning judge bound into the composition (or the existing proxy-judge wired into the public barrel) so `judgeMode: 'required'` does not fall back to `JUDGE_UNAVAILABLE`.
- Export the client presentation functions `applyDisplayPresentation` and `applySidecarPresentation` from the root barrel.
- Tests for the new entrypoint, transport, judge, and root-barrel exports, with `npm run check` green.

### Out of Scope

- Any change to the assembly, context, protected-span, privacy, provider, fidelity, or render module contracts.
- Building the runtime adapters and client wiring, which belong to phases 019 through 025.
- A hosted meaning judge over restored plaintext, which would create a prohibited second egress.
- Using the masked proxy reviewer as a positive fluency scorer in the runtime gate.
- Rewriting canonical transcripts, events, tool inputs, or tool results.

### Technical Approach

Add a default `ProviderTransport` module that the executor consumes, add a top-level `projectMessage()` composition that threads the existing modules in the frozen stage order, bind a default reject-only meaning judge so `judgeMode: 'required'` resolves, and re-export the client presentation surface from the root barrel.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/src/transports/` | Create | Default `ProviderTransport` implementations: HTTP for hosted providers and a local-model path |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/executor.ts` | Modify if required | Consume the default transport where `ExecuteProviderRouteInput` expects it |
| `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/` | Create | Top-level `projectMessage()` orchestration entrypoint |
| `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/` or `src/evaluation/` | Create/Modify | Default reject-only meaning judge bound for `judgeMode: 'required'` |
| `.opencode/skills/sk-communication/cli-communication-projection/src/index.ts` | Modify | Export the clients surface and any provider, privacy, or runtime surface the entrypoint needs |
| `.opencode/skills/sk-communication/cli-communication-projection/test/` | Modify | Add entrypoint, transport, judge, and root-barrel export coverage |
| `018-projection-runtime-core/` | Create | Record the planned Level-3 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide a default hosted-provider HTTP transport. | A default HTTP `ProviderTransport` is injected where the executor expects it and runs against a hosted provider stub. |
| REQ-002 | Provide a local-model transport path. | A default local transport (Ollama or llama.cpp compatible endpoint) runs against a local-model stub without any hosted egress. |
| REQ-003 | Provide one top-level `projectMessage()` entrypoint. | A single call runs the full stage order in sequence and returns a validated projection or the exact original. |
| REQ-004 | Gate projection first. | When `isProjectionEnabled()` is `false`, `projectMessage()` returns the exact original without any provider call. |
| REQ-005 | Route privacy before any hosted call. | `selectPrivacyRoute` runs before `executeProviderRoute`, and a denied route yields the exact original with no hosted egress. |
| REQ-006 | Bind `judgeMode: 'required'` to a default reject-only judge. | With the default judge bound, `validateProjectionCandidate` resolves `judgeMode: 'required'` to accept or reject instead of `JUDGE_UNAVAILABLE`; every unavailable judge outcome still yields the exact original. |
| REQ-007 | Export the client presentation functions from the root barrel. | `applyDisplayPresentation` and `applySidecarPresentation` are reachable from the root barrel. |
| REQ-008 | Preserve canonical state. | `projectMessage()` leaves canonical transcripts, events, tool inputs, and tool results byte-unchanged. |
| REQ-009 | Fall back to the exact original on every non-accept terminal. | Any rejection, failure, absence, or invalid terminal anywhere in the sequence returns the exact original. |
| REQ-010 | Keep the package gate green. | `npm run check` passes typecheck, build, and all tests, including the new entrypoint tests. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Prove end-to-end against a stub and a real transport. | `projectMessage()` runs end-to-end against a stub transport and a real (local) transport, and the enablement flag gates real behaviour. |
| REQ-012 | Keep the meaning judge local and reject-only. | The bound judge rejects meaning loss but cannot rank variants or authorize a candidate that deterministic checks rejected, and restored plaintext never reaches hosted transport. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `projectMessage()` runs end-to-end against a stub transport and a real transport.
- **SC-002**: The enablement flag gates real behaviour: with it off, the exact original returns; with it on, a validated projection returns.
- **SC-003**: `judgeMode: 'required'` no longer resolves to `JUDGE_UNAVAILABLE` with the default judge bound.
- **SC-004**: `applyDisplayPresentation` and `applySidecarPresentation` are reachable from the root barrel.
- **SC-005**: Canonical bytes stay unchanged and every non-accept terminal returns the exact original.
- **SC-006**: `npm run check` passes with the new entrypoint tests.

### Acceptance Scenarios

1. **Given** a raw agent message and the enablement flag off, **When** `projectMessage()` runs, **Then** it returns the exact original and performs no provider call.
2. **Given** the enablement flag on and a denied privacy route, **When** `projectMessage()` runs, **Then** it returns the exact original and no hosted call is made.
3. **Given** the enablement flag on and a hosted provider stub, **When** `projectMessage()` runs, **Then** the default HTTP transport executes, validation runs, and a projection or the exact original is returned.
4. **Given** the enablement flag on and a local-model endpoint, **When** `projectMessage()` runs, **Then** the local transport executes without any hosted egress.
5. **Given** `judgeMode: 'required'` and the default judge bound, **When** validation runs, **Then** the outcome is accept or reject, never `JUDGE_UNAVAILABLE`.
6. **Given** any non-accept terminal (rejection, timeout, cancellation, exception, absence, or invalid output), **When** the sequence completes, **Then** the exact original is returned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 017 transport and wiring contract | High | Freeze the transport and stage-order contract before implementation. |
| Dependency | Phase 016 default-off enablement gate | High | `projectMessage()` consults `isProjectionEnabled()` first and returns the exact original when off. |
| Risk | Privacy routing is skipped before a hosted call | High | Keep `selectPrivacyRoute` before `executeProviderRoute` and test a denied-route no-egress case. |
| Risk | A hosted judge receives restored plaintext | High | Keep the default judge local and reject-only; never fall back to hosted plaintext judgment. |
| Risk | `judgeMode: 'required'` stays `JUDGE_UNAVAILABLE` | High | Bind the default reject-only judge and test the resolve path. |
| Risk | Root-barrel export regressions | Medium | Public-import smoke in the package gate covers the clients surface. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The local transport path must have an explicit bounded deadline so unavailable local inference returns the exact original.
- **NFR-P02**: `projectMessage()` adds no network access when the enablement flag is off or the privacy route is denied.

### Security and Privacy

- **NFR-S01**: Privacy routing runs before any hosted call, and a denied route produces no hosted egress.
- **NFR-S02**: Restored plaintext stays inside the local or separately approved judge boundary.

### Reliability

- **NFR-R01**: Every terminal state in the sequence maps deterministically to a projection or the exact original, with no ambiguous fail-open state.

## 8. EDGE CASES

- The enablement flag is off: exact original, no provider call.
- The privacy route is denied: exact original, no hosted egress.
- The transport times out, cancels, throws, or returns a malformed response.
- `judgeMode: 'required'` runs with the default judge bound, and with the judge unavailable.
- The assembler rejects an out-of-order or duplicate event.
- The client presentation functions are imported from the root barrel and from the deep module path.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 21/25 | New transport, runtime entrypoint, judge binding, and barrel exports across the package |
| Risk | 22/25 | Privacy-before-hosted, canonical immutability, and fail-closed rendering |
| Research | 10/20 | Existing modules are known; the default transport and composition are missing |
| Multi-Agent | 7/15 | Entrypoint and adversarial verification can separate |
| Coordination | 13/15 | Critical path for the 019-025 runtime-wiring phases |
| **Total** | **73/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A hosted call happens before privacy routing | High | Medium | Freeze stage order and test a denied-route no-egress case |
| R-002 | `judgeMode: 'required'` stays `JUDGE_UNAVAILABLE` | High | Medium | Bind the default reject-only judge and test the resolve path |
| R-003 | Restored plaintext reaches a hosted judge | High | Low | Local-only judge binding and egress canary tests |
| R-004 | A non-accept terminal returns a partial projection | High | Low | Map every terminal state to the exact original |

## 11. USER STORIES

### US-001: One-call projection (Priority: P0)

**As a** runtime integrator, **I want** one `projectMessage()` call to produce a validated projection or the exact original, **so that** the enablement flag gates a genuinely working transform.

**Acceptance Criteria**:

1. **Given** a raw agent message, **When** `projectMessage()` runs, **Then** the full stage order executes and returns a projection or the exact original.
2. **Given** the enablement flag off, **When** `projectMessage()` runs, **Then** the exact original returns with no provider call.

### US-002: Privacy-first transport (Priority: P0)

**As a** privacy operator, **I want** a default transport that routes through privacy first and supports a local model, **so that** hosted calls happen only for approved routes.

**Acceptance Criteria**:

1. **Given** a denied privacy route, **When** `projectMessage()` runs, **Then** the exact original returns with no hosted egress.
2. **Given** a local-model endpoint, **When** `projectMessage()` runs, **Then** the local transport executes without any hosted egress.

### US-003: Default judgment (Priority: P0)

**As a** package consumer, **I want** `judgeMode: 'required'` to resolve with a default reject-only judge, **so that** meaning loss is rejected instead of being skipped as unavailable.

**Acceptance Criteria**:

1. **Given** the default judge bound, **When** validation runs, **Then** the outcome is accept or reject, never `JUDGE_UNAVAILABLE`.
2. **Given** the judge unavailable, **When** validation runs, **Then** the exact original is returned.

### US-004: Reachable presentation (Priority: P1)

**As a** client integrator, **I want** `applyDisplayPresentation` and `applySidecarPresentation` importable from the root barrel, **so that** runtime clients can apply presentation without deep imports.

**Acceptance Criteria**:

1. **Given** the root barrel, **When** the clients surface is imported, **Then** both presentation functions resolve.
2. **Given** a full-projection-capable client, **When** presentation applies, **Then** the projection or the exact original is selected deterministically.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. The default reject-only judge must satisfy the Phase 011 local-boundary constraint, and the proxy-judge alternative remains conditional on a separately approved redacted boundary.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
