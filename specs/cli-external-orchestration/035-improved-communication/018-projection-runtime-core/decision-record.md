---
title: "Decision Record: Phase 018 Projection Runtime Core"
description: "Architecture decisions to provide a default ProviderTransport and a top-level projectMessage() orchestration with a default reject-only meaning judge and root-barrel client presentation exports."
trigger_phrases:
  - "projection-runtime-core"
  - "architecture decision"
  - "default provider transport"
  - "projectMessage orchestration"
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
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
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
# Decision Record: Phase 018 Projection Runtime Core

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Provide a default ProviderTransport with HTTP and local-model paths

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Package maintainer and privacy owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The provider adapters only prepare and parse, while `ExecuteProviderRouteInput` requires a `transport` that no production code provides. The executor cannot run end-to-end out of the box, so the enablement flag gates a partially-unbuilt library. A transport must exist before the runtime-wiring phases can project.

### Constraints

- A hosted call must never precede privacy routing.
- A local-model path must exist so hosts and models remain interchangeable under explicit policy.
- The transport must preserve the fail-closed exact-original behavior of the executor.
- Canonical bytes must remain unchanged.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: implement a default `ProviderTransport` module with an HTTP transport for hosted providers and a local-model path (Ollama or llama.cpp compatible endpoint), injected where the executor expects it.

**How it works**: the module exposes `ProviderTransport` implementations matching `providers/types.ts:140`. The hosted transport issues an HTTP request against an approved hosted route, and the local transport issues a request against a local-model endpoint, both bounded by an explicit deadline and both only after the privacy router approves the route. The executor consumes the transport through `ExecuteProviderRouteInput`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Default HTTP plus local-model transport injected into the executor | Runs out of the box, keeps hosts and local models interchangeable, privacy-before-hosted | A new transport surface to maintain and test | 9/10 |
| Require every caller to supply a transport | No default to maintain | The projection path stays unwired and untestable out of the box | 3/10 |
| Hardcode a single hosted transport | Simplest | No local-model path and no privacy-conscious default | 4/10 |

**Why this one**: a default transport makes the executor genuinely runnable while keeping hosted and local models interchangeable behind the same privacy-before-hosted boundary.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The projection path runs end-to-end out of the box.
- Hosted and local inference share one privacy-first transport seam.

**What it costs**:

- A new transport module with tests. Mitigation: reuse the existing executor fail-closed behavior and exact-original fallback.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hosted call runs before privacy routing. | High | Keep `selectPrivacyRoute` before transport and test a denied-route no-egress case. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | `ExecuteProviderRouteInput` requires a transport that no production code provides. |
| 2 | Beyond local maxima? | PASS | Caller-supplied, hardcoded-hosted, and default-plus-local options were compared. |
| 3 | Sufficient? | PASS | One default transport module is the smallest complete wiring for the executor. |
| 4 | Fits goal? | PASS | The enablement flag then gates a genuinely working transform. |
| 5 | Open horizons? | PASS | New hosted or local transports can extend the module without changing the executor. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `src/transports/`: default HTTP and local-model `ProviderTransport` implementations.
- `src/providers/executor.ts`: consume the default transport where `ExecuteProviderRouteInput` expects it.
- Tests: hosted-provider stub, local-model endpoint, deadline, and denied-route no-egress coverage.

**How to roll back**: disable the default transport and restore the prior executor surface; affected candidates return to exact-original.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Build projectMessage() as the single production orchestration entrypoint

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Package maintainer and runtime integrators |

---

<!-- ANCHOR:adr-002-context -->
### Context

No single entrypoint composes assembly, context selection, protection, privacy routing, provider execution, validation, and render decision for one raw agent message. The client presentation functions are also exported but unreachable from the root barrel, and `judgeMode: 'required'` falls back to `JUDGE_UNAVAILABLE` without a bound judge.

### Constraints

- The full stage order must run in sequence: enablement gate, assembler, context, protect, privacy route, provider, validate, render.
- Any non-accept terminal must return the exact original.
- `judgeMode: 'required'` must resolve without `JUDGE_UNAVAILABLE`.
- The client presentation surface must be reachable from the root barrel.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: add a top-level `projectMessage()` orchestration entrypoint that owns the full stage order, bind a default reject-only meaning judge so `judgeMode: 'required'` resolves, and export the client presentation functions from the root barrel.

**How it works**: `projectMessage()` gates on `isProjectionEnabled()`, assembles the message, selects the bounded context, protects markdown, selects the privacy route, executes the approved provider route through the default transport, validates the candidate with the bound judge, and hands the result to `decideRender`. Every non-accept terminal returns the exact original. `applyDisplayPresentation` and `applySidecarPresentation` become importable from the package root.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| One `projectMessage()` entrypoint with root-barrel exports | Single caller-facing contract and reachable presentation surface | New runtime surface to test | 9/10 |
| Keep callers composing modules themselves | No new surface | Every caller risks a wrong stage order or a missed gate | 3/10 |
| Leave `judgeMode: 'required'` unresolved | No new judge wiring | Meaning loss goes unchecked and the mode is unusable | 2/10 |

**Why this one**: a single entrypoint freezes the safe stage order, and binding the judge plus exporting the barrel makes the enabled path genuinely usable.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- One callable contract for runtime integration.
- `judgeMode: 'required'` is usable and the presentation surface is reachable.

**What it costs**:

- The entrypoint, judge binding, and barrel exports need tests. Mitigation: reuse the existing validation and render contracts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller bypasses the entrypoint and gets the stage order wrong. | Medium | Export the entrypoint as the documented public path and keep the root-barrel smoke test. |
| The default judge fails closed by returning the exact original. | Low | That is the required behavior; it never authorizes an invalid candidate. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | No production entrypoint composes the full stage order today. |
| 2 | Beyond local maxima? | PASS | Entrypoint, manual composition, and unresolved-judge options were compared. |
| 3 | Sufficient? | PASS | One entrypoint, one judge binding, and one barrel export set are the smallest complete wiring. |
| 4 | Fits goal? | PASS | The enablement flag then gates a genuinely working transform. |
| 5 | Open horizons? | PASS | Runtime adapters in phases 019-025 can call the same entrypoint. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- `src/runtime/`: top-level `projectMessage()` orchestration entrypoint.
- `src/fidelity/` or `src/evaluation/`: default reject-only meaning judge binding for `judgeMode: 'required'`.
- `src/index.ts`: export the clients surface and any provider, privacy, or runtime surface the entrypoint needs.
- Tests: stage-order, terminal-state, egress, root-barrel import, and canonical-byte coverage.

**How to roll back**: disable the entrypoint and the judge binding and revert the barrel exports; affected candidates return to exact-original.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
