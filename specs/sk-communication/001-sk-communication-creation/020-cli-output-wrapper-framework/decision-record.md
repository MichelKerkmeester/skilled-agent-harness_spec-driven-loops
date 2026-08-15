---
title: "Decision Record: Phase 020 CLI-Output Wrapper Framework"
description: "Architecture decisions for Phase 020: adopt a parameterized wrapper entrypoint as the shared capture-normalize-project-render seam for runtimes without a native output hook, and capture the assistant output stream incrementally with a fail-open byte-exact original passthrough."
trigger_phrases:
  - "cli-output-wrapper-framework"
  - "architecture decision"
  - "parameterized wrapper entrypoint and incremental capture"
  - "wrapper framework decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/020-cli-output-wrapper-framework"
    last_updated_at: "2026-08-14T07:56:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the CLI-output wrapper framework and verified the package gate."
    next_safe_action: "Proceed to phase 021 Claude Code wrapper wiring."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-020-cli-output-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Decision Record: Phase 020 CLI-Output Wrapper Framework

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt a parameterized wrapper entrypoint as the shared seam for runtimes without a native output hook

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator and runtime integrator; acceptance follows the mode and adapter inventory |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 019 proved the projection on the only native output-transform hook, OpenCode's `chat.message` event. Claude Code, Codex, Devin, Cursor, and Pi (when its `turn_end` cannot mutate) have no native hook, so they cannot reuse the plugin. Each lacks a shared capture-transform-render path, and without one every later phase would re-implement projection per runtime and could diverge on the seam behavior.

### Constraints

- The wrapper must be gated by `isProjectionEnabled()` before any projection.
- Every disabled, failed, or incapable state must pass the byte-exact original through.
- The wrapper must reuse the existing per-runtime adapters under `src/runtimes`, not re-implement runtime-specific projection logic.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: one wrapper entrypoint parameterized by runtime that runs the target runtime in its declared headless, stream, or print mode, captures the assistant output stream incrementally, normalizes the captured envelope through the per-runtime adapter into the assembler's event shape, gates on `isProjectionEnabled()`, calls the Phase 018 `projectMessage()` entrypoint, and re-renders the projected text or passes the byte-exact original through.

**How it works**: the entrypoint accepts a runtime id, resolves the declared launch mode and adapter, spawns the runtime in that mode, captures the assistant output stream chunk by chunk, maps each captured envelope through the adapter, and resolves every terminal to a projection or the byte-exact original. The launch/registration pattern operators invoke is an alias or launcher script that starts the wrapper for a named runtime.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Parameterized wrapper entrypoint reusing the per-runtime adapters | One seam for all wrapper-target runtimes, no re-implemented projection logic | A new shared surface to maintain | 9/10 |
| One wrapper implementation per runtime | No parameterization complexity | Duplicated capture-transform-render logic and a higher divergence risk | 4/10 |
| Extend the Phase 019 plugin to non-native runtimes | One plugin surface | The plugin pattern assumes a hook the wrapper-target runtimes do not expose | 2/10 |

**Why this one**: one parameterized entrypoint over the existing adapters is the smallest design that serves every wrapper-target runtime with one seam, matching the Phase 017 contract.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Every wrapper-target runtime shares one projection seam and one fallback rule.
- Runtime-specific output mapping stays inside the per-runtime adapters, not the wrapper.

**What it costs**:

- Each runtime's headless, stream, and print mode must be inventoried and validated. Mitigation: the inventory is an explicit setup task.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A runtime output shape drifts from its adapter contract. | High | The wrapper fails open and passes the raw stream through byte-exact. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | No shared projection path exists for the wrapper-target runtimes. |
| 2 | Beyond local maxima? | PASS | A single parameterized entrypoint, per-runtime wrappers, and plugin extension were compared. |
| 3 | Sufficient? | PASS | One entrypoint over the existing adapters is the smallest complete design. |
| 4 | Fits goal? | PASS | Every wrapper-target runtime projects through one seam with a byte-exact original fallback. |
| 5 | Open horizons? | PASS | The same entrypoint serves phases 021-025 without re-implementation. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `src/wrapper/`: parameterized entrypoint, runtime launcher, stream capture, envelope normalization, and render seam.
- `bin/` or package alias: the launch/registration pattern operators invoke.
- `test/wrapper/`: entrypoint resolution, stage order, gate matrix, and normalization coverage.

**How to roll back**: remove the `src/wrapper/` files, the launch pattern, and the wrapper tests, and rerun the package gate.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Capture the assistant output stream incrementally with a fail-open byte-exact original passthrough

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator and privacy owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

A wrapper that buffers the whole session before transforming adds latency and risks losing the byte-exact original that the Phase 017 fail-open contract requires. The wrapper captures a live assistant output stream, so it must preserve the captured bytes and resolve every terminal deterministically while the runtime is still emitting.

### Constraints

- The original captured output must remain recoverable for the byte-exact passthrough.
- Stream capture must be incremental and bounded; no whole-session buffering is required before projection.
- No captured message content may be persisted beyond in-memory wrapper state.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: capture the assistant output stream incrementally as chunks arrive, feed each assembled assistant message to the Phase 018 `projectMessage()` entrypoint, and on every disabled, failed, or incapable state pass the byte-exact captured original through, re-rendering only the projected text on an accept terminal.

**How it works**: the launcher spawns the runtime in headless, stream, or print mode. The capture step emits chunks as they arrive, the normalizer maps each assembled message through the per-runtime adapter, and the render seam resolves every terminal to the projected text or the byte-exact original. A mid-stream exit flushes the captured message so each terminal resolves deterministically.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Incremental capture with a fail-open byte-exact passthrough | Bounded latency, no whole-session buffering, byte-exact restore | Requires per-message assembly boundaries | 9/10 |
| Buffer the whole session before transforming | Simpler message boundaries | Adds latency and risks losing the original on failure | 4/10 |
| Transform only the final rendered snapshot | Minimal capture work | Cannot preserve or restore intermediate assistant messages | 3/10 |

**Why this one**: incremental capture keeps latency bounded and the byte-exact passthrough keeps the Phase 017 fail-open contract honest on every terminal.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- Latency stays bounded; projection does not wait for the whole session.
- Every disabled, failed, or incapable state renders the byte-exact original.

**What it costs**:

- The wrapper must define message boundaries across the incremental stream. Mitigation: per-message assembly follows the per-runtime adapter envelope contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A mid-stream exit leaves an incomplete message. | Low | The wrapper flushes the captured message and resolves the terminal deterministically. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The wrapper captures a live stream and must preserve the original bytes for the fail-open contract. |
| 2 | Beyond local maxima? | PASS | Incremental capture, whole-session buffering, and snapshot-only transform were compared. |
| 3 | Sufficient? | PASS | Incremental capture plus a byte-exact passthrough is the smallest honest design. |
| 4 | Fits goal? | PASS | Every terminal maps to the projected text or the byte-exact original. |
| 5 | Open horizons? | PASS | The same capture model serves phases 021-025. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- `src/wrapper/`: incremental stream capture, per-message assembly, and the render seam with the byte-exact passthrough.
- `test/wrapper/`: capture, mid-stream-exit, gate-matrix, and fail-open coverage.

**How to roll back**: remove the capture and render-seam files; no runtime or persisted user data is changed.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
