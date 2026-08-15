---
title: "Implementation Plan: Phase 002 Contracts and Fixtures"
description: "Bootstrap the standalone TypeScript package and implement the shared versioned contracts, reference corpus, and golden fixtures under the immutable-state architecture."
trigger_phrases:
  - "contracts-and-fixtures"
  - "implementation plan"
  - "portable cli projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/002-contracts-and-fixtures"
    last_updated_at: "2026-08-11T15:21:48Z"
    last_updated_by: "codex"
    recent_action: "Completed the package, contracts, fixtures, tests, and verification gates."
    next_safe_action: "Consume the frozen v1 contracts in Phase 003."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 002 Contracts and Fixtures

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Standalone strict TypeScript package on Node.js 22+ with JSON-compatible protocol contracts |
| **Framework** | Runtime-neutral library, Vitest-focused contract harness, and later thin provider, runtime, and client adapters |
| **Storage** | Immutable in-memory state and versioned fixture files; no transcript database |
| **Testing** | Project-selected TypeScript runner, fixture replay, property checks, and smoke harnesses |

### Overview

Bootstrap `packages/cli-communication-projection/`, then define the contracts and golden fixtures that every core, provider, and runtime adapter shares. The package stays independent from the root staging application, keeps canonical runtime state immutable, and emits only validated display projections or exact-original fallbacks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] Problem, scope, and measurable success criteria are documented.
- [x] Dependencies and successor handoff are explicit.
- [x] The primary architecture decision and rollback are recorded.

### Definition of Done

- [x] All P0 and P1 requirements have observed evidence.
- [x] Focused tests and the authoritative package gate pass from final state.
- [x] The checklist, task status, current-state summary, and metadata agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Immutable canonical state with a separate validated display-projection pipeline.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Package bootstrap | Owns the independent manifest, strict compiler configuration, build, type-check, test, and clean-install commands required by every later phase. |
| Contract registry | Loads versioned schemas and rejects unsupported major versions. |
| Context and prompt registry | Defines bounded user-context selection inputs, privacy outcomes, prompt versions, copy-editing scope, sampling controls, thinking controls, and provider capability mappings. |
| Fixture corpus | Stores sanitized runtime events, exact bytes, provenance, and expected outcomes. |
| Reference evaluation corpus | Freezes reference outputs, blind-order manifests, reviewer protocol fields, variance inputs, sample-size rules, margins, confidence rules, and inconclusive outcomes. |
| Evidence contract | Defines content-free events, rotating keyed digests, and reproducible benchmark metadata before any implementation emits telemetry. |
| Compatibility policy | Defines additive changes, breaking changes, and migration behavior. |

### Data Flow

Runtime fixture plus bounded context -> envelope and prompt-profile validation -> immutable byte record -> expected normalized/projection record -> exact-byte and reference-parity assertions. Content-free evidence is emitted through a separate versioned event contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/cli-communication-projection/package.json`, `tsconfig.json`, `vitest.config.ts` | Standalone package boundary | Created deterministic install, build, type-check, test, and import commands | `npm run check`; package dry-run |
| `packages/cli-communication-projection/src/contracts/` | Phase 002 contract surface | Created event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, error schemas, and validators | Contract tests and unsupported-version negative controls |
| `packages/cli-communication-projection/test/fixtures/` | Phase 002 evidence surface | Created six-runtime, exact-byte, bounded-context, prompt-profile, provider, outcome, telemetry, and reference-parity corpus | Golden replay, sanitization scan, and provenance validation |
| `packages/cli-communication-projection/test/contracts/` | Phase 002 test surface | Created schema, stream, round-trip, privacy, prompt-control, evaluation-manifest, telemetry, benchmark, metadata, and package-smoke tests | 7 files and 30 tests pass |
| `packages/cli-communication-projection/src/versioning/` | Phase 002 compatibility surface | Created additive, backward-readable, breaking-major, and migration rules | Compatibility matrix passes |
| Parent and successor phase docs | Own boundaries and handoff | Keep synchronized if a contract changes | Recursive strict packet validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Boundary Preflight

- [x] Confirm predecessor artifacts, verify the standalone package boundary, and capture the workspace baseline.
- [x] Freeze input/output, bounded-context, prompt-profile, privacy, telemetry, benchmark, and evaluation boundaries.

### Phase 2: Core Implementation

- [x] Bootstrap the package and freeze v1 schemas plus compatibility rules.
- [x] Author and sanitize the six-runtime, context, prompt, and reference-parity fixture matrices.

### Phase 3: Verification and Handoff

- [x] Build schema, round-trip, and golden-output tests.
- [x] Reconcile checklist, summary, metadata, and successor handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package | Clean install, build, type-check, test discovery, and import smoke | Package-local scripts |
| Schema | Valid, invalid, additive, unsupported-version, context, prompt, evaluation, telemetry, and benchmark records | Vitest plus schema validator |
| Golden | Exact bytes, rotating keyed test digests, reference outputs, and expected outcomes | Byte-for-byte fixture replay and manifest validation |
| Privacy | Missing, stale, truncated, denied, and sanitized user context plus blocked hosted egress | Synthetic context matrix and transport negative controls |
| Security | Secrets, credentials, and personal-data canaries | Repository secret scanner and targeted assertions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research synthesis | Internal | Required | Phase 002 implementation cannot close |
| Primary-source runtime capability matrix | Evidence | Available | Phase 002 implementation cannot close |
| Standalone package boundary | Architecture | Accepted, implemented, and verified | Phase 003 imports the public contract surface |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: A fidelity, privacy, compatibility, or canonical-state invariant fails.
- **Procedure**: Revert the contract package and fixture additions together; no production state or user transcript is migrated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
001-research-strategy -> 002-contracts-and-fixtures -> 003-core-normalization-and-assembly
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary preflight | 001-research-strategy | Core implementation |
| Core implementation | Boundary preflight | Verification |
| Verification and handoff | Core implementation | 003-core-normalization-and-assembly |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary preflight | Medium | 1-2 days |
| Core implementation | High | 3-5 days |
| Verification and handoff | High | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: Enhanced Rollback

### Pre-Change Checks

- [x] Capture the authoritative test baseline.
- [x] Confirm original-only mode remains available.
- [x] Confirm no canonical transcript or tool-data migration is planned.

### Procedure

1. Stop new projections at the Phase 002 boundary.
2. Revert the contract package and fixture additions together; no production state or user transcript is migrated.
3. Replay the exact failing fixture and the six-runtime smoke subset.
4. Record the rollback evidence before resuming work.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Projection artifacts can be removed; immutable canonical runtime data is never rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: Dependency Graph

```text
Predecessor evidence -> owner approval -> package bootstrap
                                            |
                                            v
Context + prompt + event + policy contracts -> fixture and reference corpus
                                            |              |
                                            +-- negative controls
                                                           |
                                                           v
                                                  Successor handoff
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Package bootstrap | Owner-approved boundary and workspace baseline | Independent build, type-check, test, and import commands. | All contract implementation |
| Contract registry | Package bootstrap and 001-research-strategy | Loads event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, and error schemas; rejects unsupported major versions. | Fixture corpus |
| Fixture corpus | Contract registry | Stores sanitized runtime events, bounded context, prompt profiles, exact bytes, reference outputs, provenance, and expected outcomes. | Compatibility and evaluation policy |
| Compatibility and evaluation policy | Fixture corpus | Defines additive changes, breaking changes, blinded ordering, reviewer fields, sample-size calculation inputs, non-inferiority margins, confidence rules, and inconclusive outcomes. | 003-core-normalization-and-assembly and 007-evaluation-and-observability |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Approve and verify the package boundary** - 1 day - critical.
2. **Bootstrap the package and freeze the full contract set** - 2-3 days - critical.
3. **Build the runtime, context, prompt, and reference-parity corpus** - 3-5 days - critical.
4. **Pass negative controls and handoff gates** - 1-2 days - critical.

**Parallel opportunities**:

- Fixture authoring and focused unit-test harnesses can proceed after boundary preflight.
- Documentation and observability fields can progress alongside core code if contracts remain frozen.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: Milestones

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Boundary frozen | Inputs, outputs, invariants, and failure modes approved | Stage 1 |
| M2 | Core behavior implemented | Primary and failure paths pass focused tests | Stage 2 |
| M3 | Phase handoff accepted | Checklist evidence and strict validation pass | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: Architecture Decision Summary

**Decision**: Use fixture-first, versioned contracts with immutable originals

**Status**: Accepted and implemented. Full rationale, alternatives, and verification evidence are in `decision-record.md` and `implementation-summary.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor handoff and authoritative baseline before T001.
- Re-read every target file before editing and keep writes inside the frozen phase scope.
- Translate each requirement into an observable check before implementation.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; implementation cannot precede boundary preflight. |
| TASK-SCOPE | Modify only Phase 002 surfaces named by the approved task; route contract changes through the parent map. |
| TASK-PROOF | Run focused checks during repair, then rerun the authoritative whole gate from final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=002 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a predecessor contract, pinned external capability, privacy boundary, or authoritative test disagrees with this plan, mark the task blocked, preserve the exact-original path, and update the decision record before resuming. Do not weaken a P0 invariant or expand scope silently.
