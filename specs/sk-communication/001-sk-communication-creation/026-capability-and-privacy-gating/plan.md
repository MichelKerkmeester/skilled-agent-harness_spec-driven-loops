---
title: "Implementation Plan: Phase 026 Capability and Privacy Gating"
description: "Wire the Phase 008 compatibility doctor into every activation path as a typed pre-projection gate, fail closed to the exact original on unknown, stale, or incapable critical facts, and block hosted routing absent a fresh, capable, privacy-approved decision."
trigger_phrases:
  - "capability-and-privacy-gating"
  - "implementation plan"
  - "compatibility doctor pre-projection gate"
  - "original-only fail-closed gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/026-capability-and-privacy-gating"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the capability and privacy pre-projection gate."
    next_safe_action: "Consume the completed gate from the evaluation and release closeout."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-capability-and-privacy-gating-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The doctor report surface, the typed gate, and the per-runtime activation-path verification are the completion evidence."
      - "Every activation path from Phases 019-025 consumes one typed gate before projecting."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 026 Capability and Privacy Gating

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript gate over the Phase 008 compatibility doctor, wired into the TypeScript projection seams |
| **Framework** | The Phase 018 `projectMessage()` entrypoint and the Phase 019-025 native and wrapper activation paths |
| **Storage** | The retained exact original for byte-exact restore; no transcript persistence change |
| **Testing** | Unknown, stale, incapable, privacy-denied, and zero-hosted-call matrices plus per-runtime gate verification and strict packet validation |

### Overview

Wire the Phase 008 compatibility doctor into every activation path at the projection seam. Author one typed pre-projection gate that consults the doctor for a runtime, provider, and model combination and returns a `GateDecision`. Whenever any critical fact is unknown, stale, or incapable, the gate selects original-only and emits the exact bytes. No hosted routing fires without a fresh, capable, privacy-approved decision, and diagnostics stay content-free with no message text or secrets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The Phase 008 doctor report surface and its fail-closed terminal are located.
- [x] Every activation path from Phases 019-025 and the Phase 018 entrypoint is inventoried.
- [x] The privacy-class matrix (local-only, hosted, mixed) and the freshness thresholds are explicit.
- [x] The typed `GateDecision` shape and its reason-code set are defined.

### Definition of Done

- [x] All seven requirements have stated acceptance criteria that the tests verify.
- [x] The gate returns a typed decision and forces exact-original on unknown, stale, or incapable critical facts.
- [x] Local-only configuration makes zero hosted calls, and every runtime activation path reaches the shared gate.
- [x] Phase 026 passes strict validation with zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One typed pre-projection gate at the projection seam, consumed by every activation path. The gate consults the Phase 008 compatibility doctor, maps the report onto a typed `GateDecision`, and fails closed to the exact original on every unknown, stale, incapable, or privacy-denied terminal, with content-free reason codes.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Compatibility doctor | Diagnose versions, capabilities, endpoint reachability, credential references, privacy-fact freshness, and render tiers for a runtime, provider, and model combination |
| Pre-projection gate | Consult the doctor and return a typed `GateDecision` for the combination |
| `GateDecision` | A typed union: `proceed` for a fresh, capable, privacy-approved route, or `exact-original` with a content-free reason code |
| Seam wiring | Call the gate before `projectMessage()` and on every native and wrapper activation path |
| Zero-hosted control | Prove a local-only privacy class performs no hosted calls regardless of provider health |

### Data Flow

Runtime/provider/model combination -> Phase 008 compatibility doctor -> doctor report -> pre-projection gate maps to a typed `GateDecision` -> proceed? -> activation path projects : emit the exact original with a content-free reason code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Compatibility doctor | Diagnose and fail closed to original-only | Consumed, never modified | Gate decision tests against the doctor report surface |
| `projectMessage()` entrypoint | Own the projection stage order | Gate call inserted before it | Entrypoint tests stay green with the gate wired |
| Native plugin and wrapper seams | Project or fail open to the original | Call the gate before projecting | Per-runtime gate verification |
| Privacy policy and provider records | Define the egress boundary and privacy class | Consumed, never modified | Local-only zero-hosted control |
| Phase and parent packet docs | Record and route planned state | Create Phase 026 | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Locate the Phase 008 doctor report surface and its fail-closed terminal.
- [x] Inventory every activation path from Phases 019-025 and the Phase 018 entrypoint.
- [x] Freeze the privacy-class matrix, the freshness thresholds, and the `GateDecision` reason-code set.

### Phase 2: Implementation

- [x] Author the typed pre-projection gate that consults the doctor and returns a `GateDecision`.
- [x] Wire the gate into `projectMessage()` before assembly and provider routing so every native and wrapper activation path shares it.
- [x] Ensure diagnostics expose only content-free reason codes.

### Phase 3: Verification

- [x] Run the unknown, stale, incapable, and privacy-denied gate matrices.
- [x] Run the local-only zero-hosted-call control and the per-runtime gate verification.
- [x] Author the Level-3 packet, backfill metadata, and pass strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Gate decision matrix | Unknown, stale, incapable, privacy-denied, and malformed-doctor-report terminals map to exact-original | Gate unit tests |
| Proceed terminal | A fresh, capable, privacy-approved decision proceeds without egress surprises | Gate unit tests |
| Zero-hosted control | Local-only configuration performs no hosted calls regardless of provider health | Egress canary tests |
| Per-runtime verification | Every native and wrapper activation path consults the gate before projecting | Runtime seam tests |
| Content-free diagnostics | Reason codes only, no message text or secrets | Diagnostic lint tests |
| Packet integrity | Phase 026 docs and generated metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compatibility doctor from Phase 008 | Internal | Required by plan | The gate has no report surface to consult |
| Runtime wirings from Phases 019-025 | Internal | Required by plan | The gate has no activation paths to guard |
| Phase 018 `projectMessage()` entrypoint | Internal | Available from Phase 018 | The gate cannot precede the projection stage |
| Phase 017 seam contract | Internal | Available from Phase 017 | The pre-check rule the gate materializes is unstated |
| Privacy classes and provider records from Phase 005 | Internal | Available from Phase 005 | The egress boundary the gate enforces is undefined |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate terminal projects on unsafe facts, a hosted route fires without a fresh, capable, privacy-approved decision, or a diagnostic leaks content.
- **Procedure**: revert the gate call at the affected seam or entrypoint, restore the fail-closed exact-original behavior, rerun the gate and per-runtime verification, confirm the local-only control stays zero-hosted, refresh graph metadata, and rerun Phase 026 strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Doctor surface and seam inventory -> Typed gate and wiring -> Decision, egress, and per-runtime verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Doctor surface and seam inventory | Phase 008 doctor and Phase 019-025 wirings | Typed gate and wiring |
| Typed gate and wiring | Complete inventory | Verification |
| Verification | Wired gate | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Doctor surface and seam inventory | Low | 0.5 day |
| Typed gate and wiring | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the doctor report surface and its fail-closed terminal as a versioned snapshot.
- [x] Record the privacy-class matrix and the freshness thresholds before any wiring.
- [x] Confirm no canonical or transcript change is planned.

### Procedure

1. Restore the gate call or seam wiring that regressed.
2. Rerun the gate decision matrix and the affected per-runtime verification.
3. Confirm the local-only zero-hosted control still passes.
4. Refresh graph metadata and rerun strict validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the gate and seam wiring only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Doctor surface and seam inventory
        |
        v
Privacy policy -> Typed gate and seam wiring
        |                    |
        +-- doctor report ---+
        |                    |
        v                    v
Decision matrix   Zero-hosted control
        |                    |
        +-- per-runtime verification --+
                                      |
                                      v
                            Packet and parent closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Compatibility doctor | Phase 008 evidence | The report surface the gate consults | Typed gate |
| Pre-projection gate | Doctor report and privacy policy | A typed `GateDecision` per combination | Seam wiring |
| Seam wiring | Typed gate | A gate call before `projectMessage()` and every activation path | Verification |
| Verification | Wired gate | Decision, egress, and per-runtime receipts | Packet and parent closeout |
| Packet and parent wiring | All verification evidence | Strict conformance, navigation, and graph truth | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm the doctor report surface and inventory every activation path** - 0.5 day - critical.
2. **Author and wire the typed gate across the seam** - 1-2 days - critical.
3. **Run the decision, egress, and per-runtime verification, then close the packet** - 1-2 days - critical.

**Parallel opportunities**:

- The gate decision matrix and the local-only zero-hosted control run on independent surfaces.
- Per-runtime verification for the native plugin and each wrapper proceeds independently once the gate lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Doctor surface and seam inventory confirmed | Doctor report terminal and every activation path recorded | Stage 1 |
| M2 | Typed gate and wiring complete | Gate returns a typed decision and every seam calls it | Stage 2 |
| M3 | Phase handoff accepted | Decision, egress, and per-runtime verification pass and strict validation is clean | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: bind the Phase 008 compatibility doctor to every activation path through one typed pre-projection gate that fails closed to the exact original on unknown, stale, or incapable critical facts.

**Status**: Accepted and implemented. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor handoff and the doctor report surface before authoring the gate.
- Inventory every activation path from Phases 019-025 and the Phase 018 entrypoint before wiring.
- Keep all writes inside the Phase 026 documentation scope.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; evidence cannot precede inventory. |
| TASK-SCOPE | Modify only the Phase 026 documentation surfaces. |
| TASK-PROOF | Run focused checks, then rerun the authoritative gates and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=026 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the doctor report surface or a runtime activation path disagrees with the planned gate design, mark the task blocked, preserve the fail-closed exact-original behavior, and update the decision record before resuming.
