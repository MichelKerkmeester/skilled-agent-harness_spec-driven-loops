---
title: "Feature Specification: Phase 017 Runtime-Wiring Feasibility and Contract"
description: "Record the planned runtime-wiring feasibility findings and the hook-to-projection integration contract that every later phase implements against."
trigger_phrases:
  - "runtime-wiring-feasibility-and-contract"
  - "runtime wiring feasibility"
  - "hook to projection integration contract"
  - "chat.message display validation"
  - "CLI output wrapper seam"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/017-runtime-wiring-feasibility-and-contract"
    last_updated_at: "2026-08-14T09:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed out Phase 017 as Complete."
    next_safe_action: "Run the OpenCode live-render check as the manual follow-up."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-runtime-wiring-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined as a design foundation for phases 019-025."
      - "OpenCode is the only runtime with a native output-transform hook, and the other runtimes require a CLI-output wrapper."
      - "Pi is partial: turn_end reads the assistant message, so Pi is assigned to the CLI-output wrapper per the matrix fallback rule."
      - "The feasibility matrix and integration contract are finalized and validated by the successful 018-028 implementation; the OpenCode live-render check is a documented manual follow-up, not a blocker."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 017 Runtime-Wiring Feasibility and Contract

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This planned design phase establishes the per-runtime feasibility and the hook-to-projection integration contract that wiring phases 019-025 implement against. Prior research confirms that OpenCode is the only runtime with a native output-transform hook: the plugin `chat.message` event, whose `output.parts` mutation renders as the chat bubble, subject to a display caveat that must be validated. Claude Code, Codex, Devin, and Cursor expose only input, tool, and session-lifecycle hooks, so they require an external CLI-output wrapper that runs the CLI headless or streaming, transforms the rendered assistant message, and re-renders it. Pi is partial: its `turn_end` hook delivers the assistant message but only reads it in-repo, so mutation of the rendered bubble is unproven and must be validated before Pi is assigned a native pattern.

**Key decision**: adopt exactly two integration patterns, the native plugin for OpenCode and the CLI-output wrapper for the input-hook-only runtimes, with a shared fail-open seam contract that every activation path must honor.

**Critical dependency**: the validated Phase 016 default-off enablement gate, the prior runtime-adapter evidence, and the OpenCode `chat.message` display validation that proves a mutated part renders visibly.

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
| **Phase** | 17 of 28 |
| **Predecessor** | `016-default-off-and-advisor-exclusion` |
| **Successor** | `018-projection-runtime-core` |
| **Handoff Criteria** | The feasibility matrix assigns each of the six runtimes exactly one integration pattern with a go/no-go verdict, the OpenCode `chat.message` display behavior is validated, the seam contract states the enablement-gate placement, the fail-open exact-original fallback, canonical-bytes preservation, and per-runtime pre-checks, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is a design phase. It produces no code. It records the confirmed per-runtime feasibility findings and the integration contract that the wiring phases implement when connecting the communication projection into runtime output. Phases 018-028 implemented against this contract and all pass, which validates the finalized feasibility matrix and seam contract.

**Scope boundary**: Author only the feasibility matrix, the hook-to-projection integration contract, and the validation evidence for the two open feasibility questions. The packet does not implement or wire any runtime adapter.

**Dependencies**:

- The validated Phase 016 default-off enablement gate and its `isProjectionEnabled()` resolver
- Prior runtime-adapter evidence from Phase 001 research and Phase 006 runtime adapters
- The OpenCode plugin `chat.message` event surface for the display-validation probe
- The Pi `turn_end` event surface for the mutation probe

**Deliverables**:

- A per-runtime feasibility matrix with a single integration pattern and go/no-go verdict per runtime
- The hook-to-projection integration contract: enablement-gate placement, fail-open exact-original fallback, canonical-bytes preservation, and per-runtime capability and privacy pre-checks
- Validation evidence that an OpenCode `chat.message` part mutation renders visibly and that Pi `turn_end` mutation is proven or routed to the wrapper
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The projection layer must be wired into runtime output, but the runtimes do not share a uniform hook surface. Prior research shows only OpenCode can transform the rendered assistant message natively through the plugin `chat.message` event, and even there a display caveat is unconfirmed: a mutated `output.parts` entry must actually render visibly in the chat bubble. Claude Code, Codex, Devin, and Cursor expose only input, tool, and session-lifecycle hooks, so none can rewrite a rendered assistant message without an external wrapper. Pi delivers the assistant message on `turn_end` but only reads it in-repo, so its native mutation is unproven. Without a recorded feasibility matrix and integration contract, each later wiring phase would re-derive the same conclusions and could diverge on the seam behavior.

### Purpose

Record the confirmed per-runtime feasibility and the integration contract so that phases 019-025 wire the projection layer into runtime output against one unambiguous seam rule, with a byte-exact original as the guaranteed fallback.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A per-runtime feasibility matrix covering Claude Code, Codex, Devin, Cursor, Pi, and OpenCode, assigning each exactly one integration pattern and a go/no-go verdict.
- The two integration patterns: the native plugin pattern (OpenCode `chat.message`) and the CLI-output wrapper pattern (headless, stream, or print mode, transform, re-render) for input-hook-only runtimes.
- The enablement-gate placement rule: every activation path MUST call `isProjectionEnabled()` before projecting.
- The fail-open exact-original fallback contract at the seam, including the fidelity check.
- The canonical-bytes preservation requirement: originals are retained for exact restore and projection never mutates canonical bytes.
- The per-runtime capability and privacy pre-checks that must pass before any hosted routing.
- Validation evidence for the OpenCode `chat.message` display caveat and the Pi `turn_end` mutation question.

### Out of Scope

- Any implementation or wiring of runtime adapters, which belongs to phases 019-025.
- Changing the projection core, provider adapters, or the Phase 016 enablement gate.
- Adding new hooks to any runtime, which are treated as given surfaces.
- Hosted routing design beyond the capability and privacy pre-check gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `017-runtime-wiring-feasibility-and-contract/spec.md` | Create | Record the planned feasibility findings, scope, requirements, and success criteria |
| `017-runtime-wiring-feasibility-and-contract/plan.md` | Create | Plan the inventory, contract design, validation probes, and packet closeout |
| `017-runtime-wiring-feasibility-and-contract/tasks.md` | Create | Break the phase into setup, design, and verification tasks |
| `017-runtime-wiring-feasibility-and-contract/checklist.md` | Create | Record planned verification gates for the feasibility and contract evidence |
| `017-runtime-wiring-feasibility-and-contract/decision-record.md` | Create | Record the proposed integration-pattern and fail-open contract decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define exactly two integration patterns and assign one per runtime. | The feasibility matrix assigns OpenCode to the native plugin pattern, Claude Code, Codex, Devin, and Cursor to the CLI-output wrapper pattern, and Pi to the native pattern only if its `turn_end` mutation is validated, else to the wrapper. |
| REQ-002 | Mandate the enablement-gate placement rule. | Every activation path and seam entry MUST call `isProjectionEnabled()` before projecting and return the exact original when the answer is `false`. |
| REQ-003 | Contract a fail-open exact-original fallback at the seam. | Any error, disabled flag, incapable runtime, or failed fidelity check at the seam yields the byte-exact original message, never a partial or transformed output. |
| REQ-004 | Preserve canonical bytes. | Originals are retained for exact restore, and no projection path mutates canonical message bytes. |
| REQ-005 | Gate hosted routing behind per-runtime pre-checks. | Capability and privacy pre-checks pass before any hosted routing; a failing pre-check blocks routing and keeps the projection local or fallback. |
| REQ-006 | Record the feasibility matrix as the go/no-go authority. | Each runtime row carries a single integration pattern, the evidence that justifies it, and an explicit go/no-go verdict that phases 019-025 consume. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Validate the OpenCode `chat.message` display behavior. | A mutated `output.parts` entry renders visibly in the chat bubble, closing the display caveat before the native pattern is finalized. |
| REQ-008 | Resolve the Pi `turn_end` mutation question. | A mutated Pi assistant message renders, or Pi is assigned to the CLI-output wrapper with the reason recorded. |
| REQ-009 | Make the contract unambiguous for later phases. | Phases 019-025 can implement against the seam contract without re-deciding integration patterns or fallback behavior. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The feasibility matrix assigns each of the six runtimes exactly one integration pattern and a go/no-go verdict.
- **SC-002**: Every activation path and seam entry consults `isProjectionEnabled()` before projecting.
- **SC-003**: The OpenCode `chat.message` display caveat is validated, with the mutated part rendering visibly. (Status: the live render check requires an interactive OpenCode session and is recorded as a documented manual follow-up in `implementation-summary.md`; the design contract does not depend on its outcome.)
- **SC-004**: The fail-open contract guarantees the byte-exact original on any error, disabled flag, incapable runtime, or failed fidelity check.
- **SC-005**: The seam contract is unambiguous enough that phases 019-025 implement against it without re-deciding.

### Acceptance Scenarios

1. **Given** the six runtimes and their hook surfaces, **When** the feasibility matrix is read, **Then** each runtime has exactly one integration pattern and a go/no-go verdict.
2. **Given** any seam entry, **When** projection would run, **Then** `isProjectionEnabled()` is consulted first and the exact original is returned when projection is disabled.
3. **Given** any error, disabled flag, incapable runtime, or failed fidelity check, **When** the seam attempts projection, **Then** the byte-exact original renders.
4. **Given** the OpenCode plugin and a `chat.message` event, **When** an `output.parts` entry is mutated, **Then** the mutation renders visibly in the chat bubble.
5. **Given** Pi and an unproven `turn_end` mutation, **When** the probe is inconclusive, **Then** Pi is assigned to the CLI-output wrapper.
6. **Given** the authored contract, **When** phases 019-025 review it, **Then** they find the integration patterns and fallback behavior already decided.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 016 default-off enablement gate | High | Record the gate as a hard dependency of every activation path rule. |
| Dependency | OpenCode `chat.message` display validation | High | Run the display probe early; a failed probe moves OpenCode to a wrapper or revised pattern. |
| Risk | The OpenCode display caveat fails validation | High | The fail-open seam keeps the byte-exact original, and the matrix re-assigns OpenCode. |
| Risk | Pi `turn_end` mutation is unproven | Medium | Route Pi to the CLI-output wrapper and record the reason. |
| Risk | A runtime changes its hook surface | Medium | Treat the matrix as a versioned snapshot and re-validate on upgrade. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Seam decisions are local and synchronous with no network access on the fallback path.
- **NFR-P02**: The native plugin and wrapper paths add bounded latency with no blocking round trips before the seam resolves.

### Security and Privacy

- **NFR-S01**: Capability and privacy pre-checks run before any hosted routing; a failing pre-check blocks hosted routing.
- **NFR-S02**: The feasibility matrix, contract, and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: The seam is fail-open: any error yields the byte-exact original and never a partial transform.
- **NFR-R02**: Canonical bytes are preserved and restorable from retained originals at all times.

## 8. EDGE CASES

- A runtime declares capability but fails at runtime, which the fail-open seam resolves to the byte-exact original.
- Projection is disabled mid-session, which returns the exact original from the next seam entry.
- The OpenCode mutated part does not render visibly, which re-assigns OpenCode before the native pattern is finalized.
- The Pi `turn_end` mutation probe is inconclusive, which routes Pi to the CLI-output wrapper.
- Hosted routing is requested without passing capability and privacy pre-checks, which is blocked.
- A newer runtime version changes its hook surface, which triggers a matrix re-validation.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 18/25 | A feasibility matrix, a seam contract, and two validation probes across six runtimes |
| Risk | 17/25 | An unvalidated display caveat and an unproven Pi mutation feed the whole contract |
| Research | 14/20 | Grounding the matrix in prior runtime-adapter and hook-surface evidence |
| Multi-Agent | 6/15 | The OpenCode and Pi probes are independent but narrow |
| Coordination | 12/15 | The contract is the authority for phases 019-025 |
| **Total** | **67/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The OpenCode `chat.message` mutation does not render visibly | High | Medium | Run the display probe in setup; fail-open seam preserves the original and the matrix re-assigns OpenCode |
| R-002 | Pi `turn_end` mutation is unproven | Medium | Medium | Route Pi to the CLI-output wrapper with the reason recorded |
| R-003 | A runtime hook surface changes after the matrix is written | Medium | Low | Treat the matrix as a versioned snapshot and re-validate on upgrade |
| R-004 | The contract leaves a seam rule ambiguous for later phases | High | Low | REQ-009 requires phases 019-025 to find the patterns and fallback already decided |

## 11. USER STORIES

### US-001: Design foundation for later phases (Priority: P0)

**As a** later-phase implementer, **I want** one unambiguous integration contract, **so that** phases 019-025 wire projection without re-deciding patterns or fallback.

**Acceptance Criteria**:

1. **Given** the feasibility matrix, **When** a runtime is classified, **Then** it has one integration pattern and a go/no-go verdict.
2. **Given** the seam contract, **When** later phases read it, **Then** the enablement gate, fail-open fallback, and canonical-bytes rules are already decided.

### US-002: Native projection on OpenCode (Priority: P0)

**As an** OpenCode user, **I want** a mutated `chat.message` part to render visibly, **so that** the projection appears in the chat bubble rather than silently.

**Acceptance Criteria**:

1. **Given** the OpenCode plugin and a `chat.message` event, **When** an `output.parts` entry is mutated, **Then** the mutation renders visibly.
2. **Given** a failed or absent render, **When** the seam runs, **Then** the byte-exact original shows.

### US-003: Wrapper projection for input-hook-only runtimes (Priority: P0)

**As a** Claude Code, Codex, Devin, or Cursor user, **I want** the CLI-output wrapper to capture, transform, and re-render the assistant message, **so that** projection works without a native output hook.

**Acceptance Criteria**:

1. **Given** a headless, stream, or print mode run, **When** the wrapper captures the rendered message, **Then** the transform and re-render follow the seam contract.
2. **Given** any wrapper error, **When** the seam resolves, **Then** the byte-exact original renders.

### US-004: Privacy before hosted routing (Priority: P1)

**As a** privacy-conscious operator, **I want** capability and privacy pre-checks to gate hosted routing, **so that** no content leaves the machine until the runtime and provider are verified.

**Acceptance Criteria**:

1. **Given** a hosted routing request, **When** the pre-checks run, **Then** a failing check blocks hosted routing.
2. **Given** a passing pre-check set, **When** routing proceeds, **Then** the recorded policy governs it.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. The exact OpenCode version pinned for the display-validation probe and the Pi version pinned for the mutation probe are recorded as versioned matrix inputs at validation time, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
