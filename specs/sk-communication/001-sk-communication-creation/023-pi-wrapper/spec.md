---
title: "Feature Specification: Phase 023 Pi Wrapper"
description: "Record the planned Pi output projection wiring: validate whether the Pi turn_end event can mutate the rendered bubble, then project through the validated path (turn_end extension or the Phase 020 CLI-output wrapper in pi print mode) gated on isProjectionEnabled() with the byte-exact original fallback."
trigger_phrases:
  - "pi-wrapper"
  - "pi output projection"
  - "turn_end mutation validation"
  - "pi print mode wrapper"
  - "Pi runtime adapter projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/023-pi-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to run the Pi turn_end-mutation probe and record the verdict."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-023-pi-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Pi is PARTIAL: its turn_end event delivers the ending assistant message but is only read in-repo, so mutation of the rendered bubble is unproven and must be validated first."
      - "The validated path decides the integration: a turn_end projection extension if mutation works, else the Phase 020 CLI-output wrapper in pi print mode."
      - "Whichever path is chosen projects gated on isProjectionEnabled() and fails open to the byte-exact original."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 023 Pi Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This planned phase wires Pi output projection on a validated integration path. Pi is PARTIAL: its `turn_end` event delivers the ending assistant message, but in-repo the event is only read and injected with `display: false`, so whether a handler can MUTATE the rendered bubble is unproven. This phase first runs a concrete validation probe that answers that question with a recorded verdict. If `turn_end` can mutate the displayed message, the phase wires a Pi extension that projects via `turn_end`, gated and with the exact-original fallback. If it cannot, which is the expected outcome, the phase routes Pi through the Phase 020 CLI-output wrapper using `pi` print mode, which surfaces the final assistant message, with the Pi runtime adapter.

**Key decision**: let the `turn_end`-mutation probe pick the integration path, and gate whichever path is chosen on `isProjectionEnabled()` with a byte-exact exact-original fallback.

**Critical dependency**: the completed Phase 020 CLI-output wrapper framework, the Phase 017 Pi feasibility note, the Phase 018 projection runtime core `projectMessage()` entrypoint, and the Phase 016 default-off enablement gate.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 23 of 28 |
| **Predecessor** | `022-codex-wrapper` |
| **Successor** | `024-devin-wrapper` |
| **Handoff Criteria** | The Pi `turn_end`-mutation question is answered with a recorded verdict, Pi projects on the validated path (a `turn_end` extension if mutation works, else the Phase 020 wrapper in `pi` print mode), the chosen path is gated on `isProjectionEnabled()` with a byte-exact original on disable or failure, the tests cover the probe verdict, the gate, and the exact-original fallback, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase makes Pi projection work on a path that is first proven. Pi is the only runtime whose native event surface is partial: `turn_end` delivers the ending assistant message but is only read in-repo. Before any wiring, the phase validates whether a handler can mutate the rendered bubble; the verdict selects the integration pattern.

**Scope boundary**: Run the `turn_end`-mutation validation probe, then wire the single chosen path for Pi (extension or wrapper). Do not change the Phase 020 wrapper framework, the Phase 018 projection runtime core, or the Phase 016 enablement gate.

**Dependencies**:

- The completed Phase 020 CLI-output wrapper framework and its capture-transform-re-render seam, which is the wrapper fallback path
- The Phase 017 Pi feasibility note, which records that `turn_end` only reads the assistant message in-repo
- The Phase 018 projection runtime core `projectMessage()` entrypoint and the client presentation functions
- The Phase 016 default-off enablement gate `isProjectionEnabled()`

**Deliverables**:

- A recorded verdict on whether a Pi `turn_end` handler can mutate the rendered bubble
- The validated Pi projection path: a `turn_end` extension if mutation works, else the Phase 020 wrapper in `pi` print mode with the Pi runtime adapter
- An enablement-gated seam with a byte-exact exact-original fallback on disable or failure
- Tests covering the probe verdict, the chosen path, the gate, and the exact-original fallback
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pi exposes a `turn_end` event that delivers the ending assistant message, but in-repo the event handler only reads that message and injects context with `display: false`; no handler ever mutates the rendered bubble. Whether a `turn_end` handler can replace what the operator sees is therefore unproven. If it can, Pi can project natively; if it cannot, Pi needs the CLI-output wrapper that already captures, transforms, and re-renders headless output. Without a validated answer, Pi cannot be wired safely, because the wrong assumption would either project into a bubble that never updates or leave Pi without any projection path.

### Purpose

Answer the Pi `turn_end`-mutation question with evidence, then wire Pi output projection through whichever path the verdict validates, gated on `isProjectionEnabled()` with a byte-exact original as the guaranteed fallback.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A concrete `turn_end`-mutation validation probe that mutates a rendered Pi bubble and records the observable verdict.
- If the probe shows mutation works, a Pi extension that projects via `turn_end`, gated on `isProjectionEnabled()` and failing open to the byte-exact original.
- If the probe shows mutation does not work, wiring Pi through the Phase 020 CLI-output wrapper in `pi` print mode (which surfaces the final assistant message) with the Pi runtime adapter.
- Gating the chosen path on `isProjectionEnabled()` and returning the byte-exact original when projection is disabled.
- Failing open to the byte-exact original on any adapter error, parse failure, extension failure, or wrapper failure.
- Preserving canonical event bytes and never mutating canonical transcripts.
- Tests for the probe verdict, the chosen path, the enablement gate, and the exact-original fallback.

### Out of Scope

- Changing the Phase 020 wrapper framework, the Phase 018 projection runtime core, or the Phase 016 enablement gate.
- Adding output-transform hooks to Pi, which are treated as a given surface.
- Wiring both paths in parallel; exactly one validated path is shipped.
- Rewriting canonical transcripts, events, tool inputs, or tool results.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `023-pi-wrapper/spec.md` | Create | Record the planned scope, requirements, and success criteria |
| `023-pi-wrapper/plan.md` | Create | Plan the mutation probe, the chosen-path wiring, and the verification path |
| `023-pi-wrapper/tasks.md` | Create | Break the phase into setup, implementation, and verification tasks |
| `023-pi-wrapper/checklist.md` | Create | Record planned verification gates for the probe verdict, the path, the gate, and the fallback evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validate the Pi `turn_end` mutation question. | A concrete probe mutates a rendered Pi bubble through a `turn_end` handler and records the observable verdict, so the phase answers whether the displayed message can be replaced. |
| REQ-002 | Wire the validated path. | If the probe verdict is that mutation works, a Pi extension projects via `turn_end`; if the verdict is that it does not, Pi routes through the Phase 020 CLI-output wrapper in `pi` print mode with the Pi runtime adapter. Exactly one validated path ships. |
| REQ-003 | Gate on `isProjectionEnabled()` before projecting. | Every seam entry consults `isProjectionEnabled()`; when the answer is `false`, the byte-exact original is emitted with no provider call. |
| REQ-004 | Fail open to the byte-exact original. | Any probe, adapter, extension, parse, or wrapper failure emits the byte-exact original, never a partial or transformed output. |
| REQ-005 | Preserve canonical bytes. | Canonical event bytes stay unchanged, and the original is available for exact restore. |
| REQ-006 | Cover the probe, the gate, and the fallback with tests. | Tests prove the recorded probe verdict, the enablement gate behavior, and the exact-original fallback on the chosen path. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Map `pi` print-mode output onto the assembler event shape. | When the wrapper path is chosen, the Pi runtime adapter translates `pi` print-mode output onto the assembler event shape that `projectMessage()` consumes. |
| REQ-008 | Run capability and privacy pre-checks before hosted routing. | The seam contract's pre-checks pass before any hosted routing; a failing pre-check keeps the projection local or falls back to the exact original. |
| REQ-009 | Keep the package gate green. | `npm run check` passes typecheck, build, and all tests, including the new Pi wrapper or extension tests. |
| REQ-010 | Cover the edge cases. | Partial or empty print output, an absent `pi` binary, mid-stream disablement, and a malformed extension resolve to the byte-exact original. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Pi `turn_end`-mutation question is answered with a recorded, observable verdict.
- **SC-002**: Pi projects on the validated path: a `turn_end` extension if mutation works, else the Phase 020 wrapper in `pi` print mode.
- **SC-003**: With the enablement flag off, the byte-exact original shows.
- **SC-004**: On any failure, the byte-exact original shows.
- **SC-005**: The tests pass, covering the probe verdict, the chosen path, the gate, and the exact-original fallback.
- **SC-006**: Phase 023 strict validation reports `Errors: 0  Warnings: 0`.

### Acceptance Scenarios

1. **Given** a Pi session with a rendered assistant bubble, **When** a `turn_end` handler mutates the message, **Then** the observable verdict records whether the rendered bubble changes.
2. **Given** the recorded verdict, **When** the integration path is selected, **Then** exactly one validated path ships: a `turn_end` extension or the Phase 020 wrapper in `pi` print mode.
3. **Given** the enablement flag off, **When** the seam runs, **Then** the byte-exact original is emitted and no provider call happens.
4. **Given** an adapter error, malformed print output, extension failure, or wrapper failure, **When** the seam resolves, **Then** the byte-exact original renders.
5. **Given** the completed packet, **When** strict validation runs, **Then** it reports zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 CLI-output wrapper framework | High | Freeze the wrapper seam contract and consume it without modification for the fallback path. |
| Dependency | Phase 017 Pi feasibility note | High | Record the `turn_end` read-only finding and validate mutation before any extension wiring. |
| Dependency | Phase 018 `projectMessage()` entrypoint | High | Route through the single orchestration entrypoint with the frozen stage order. |
| Dependency | Phase 016 enablement gate | High | Consult `isProjectionEnabled()` at every seam entry before projecting. |
| Risk | The probe falsely concludes mutation works | High | Record an observable, reproducible probe verdict and treat the conservative wrapper outcome as the default. |
| Risk | A partial or malformed print stream produces partial output | High | The fail-open seam emits the byte-exact original on any non-accept terminal. |
| Risk | Pi's `turn_end` shape changes between versions | Medium | Pin the probe to a recorded Pi version and re-validate on upgrade. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The seam resolves locally and synchronously, and the fallback path performs no network access.
- **NFR-P02**: Projection adds bounded latency with no blocking round trips before the enablement gate resolves.

### Security and Privacy

- **NFR-S01**: Capability and privacy pre-checks run before any hosted routing; a failing pre-check blocks hosted routing.
- **NFR-S02**: The packet contains no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: The seam is fail-open: any error yields the byte-exact original and never a partial transform.
- **NFR-R02**: Canonical bytes are preserved and restorable from retained originals at all times.

## 8. EDGE CASES

- The `turn_end` mutation probe is inconclusive, which routes Pi to the conservative wrapper path.
- The enablement flag is off, which yields the byte-exact original with no provider call.
- `pi` print mode returns empty or partial output, which yields the byte-exact original.
- The `pi` binary is absent or fails to start, which yields a clear non-intercepted passthrough.
- The extension fails to load or register, which fails open to the byte-exact original.
- Projection is disabled mid-stream, which returns the exact original from the next seam entry.
- A newer Pi version changes the `turn_end` or print-mode shape, which triggers a re-validation.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 15/25 | A validation probe, one chosen integration path, and one gated seam |
| Risk | 17/25 | The mutation verdict is unknown and fail-open fidelity must hold on a live runtime |
| Research | 9/20 | The `turn_end` mutation behavior is the main unknown and is pinned by the probe |
| **Total** | **41/70** | **Level 2** |

## 10. OPEN QUESTIONS

No unresolved question blocks planning. The `turn_end`-mutation verdict is a validation outcome recorded at execution time, and the Phase 017 feasibility note already records the read-only finding that motivates the probe.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
