---
title: "Decision Record: Phase 003 Core Normalization and Assembly"
description: "Architecture decision for Phase 003: use a generation-keyed state machine with explicit ordering domains."
trigger_phrases:
  - "core-normalization-and-assembly"
  - "architecture decision"
  - "use a generation-keyed state machine with explicit ordering domains"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/003-core-normalization-and-assembly"
    last_updated_at: "2026-08-11T17:03:53Z"
    last_updated_by: "codex"
    recent_action: "Accepted and implemented the generation-keyed state-machine decision."
    next_safe_action: "Use the accepted core boundary as the Phase 004 input contract."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The accepted decision is implemented and verified by the focused core suite."
---
# Decision Record: Phase 003 Core Normalization and Assembly

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a generation-keyed state machine with bounded request context

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted and implemented |
| **Date** | 2026-08-11 |
| **Deciders** | Project owner approved implementation by directing the work to continue on 2026-08-11. Codex implemented and verified the decision. |

---

<!-- ANCHOR:adr-001-context -->
### Context

Build the runtime-neutral core that normalizes events, assembles one deterministic message, and selects bounded conversational context without changing canonical state. The design must preserve canonical state, keep selected user text request-scoped, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Decision**: Use a generation-keyed state machine with explicit ordering domains and a separate bounded context provider.

**How it works**: Every mutable buffer is keyed by session, turn, message, and generation. The core records source, arrival, and assembly order separately, and every terminal transition is idempotent. After completion, the context provider selects only the contracted eligible user message, applies freshness, privacy, and codepoint bounds, and discards the request-scoped view after provider work.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Generation-keyed state machine | Explicit lifecycle, concurrency isolation, deterministic replay | More state definitions | 9/10 |
| One buffer per session | Simple data structure | Retries and parallel turns can collide | 3/10 |
| Append events as received | Low implementation effort | Arrival jitter changes output and breaks replay | 2/10 |

**Why this one**: This design preserves the immutable-state architecture while keeping failure behavior deterministic, portable and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.

**What it costs**:

- The state model adds explicit types and transition tests. Mitigation: keep the transition table small and derive behavior from fixtures.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An omitted terminal transition could retain buffers. | High | Test every state-event pair and assert timer and buffer cleanup at terminal states. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Phase 001 identifies this boundary as required for the six-runtime goal. |
| 2 | Beyond local maxima? | PASS | Three materially different options were compared. |
| 3 | Sufficient? | PASS | The proposed option is the smallest design that preserves canonical state and fallback. |
| 4 | Fits goal? | PASS | It directly supports portable, reference-like communication output. |
| 5 | Open horizons? | PASS | Versioned contracts and adapters allow provider and runtime evolution without core rewrites. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `packages/cli-communication-projection/src/core/normalizer.ts`: Runtime-neutral envelope normalization.
- `packages/cli-communication-projection/src/core/assembler.ts`: Generation-keyed assembly state machine.
- `packages/cli-communication-projection/src/context/selector.ts`: Bounded, privacy-aware rewrite context.
- `packages/cli-communication-projection/src/observability/emitter.ts`: Content-free core lifecycle evidence.
- `packages/cli-communication-projection/test/core/`: Concurrency, lifecycle, and replay tests.

**How to roll back**: Disable the projection core entry point and return original runtime text. Canonical event storage remains untouched.

**Observed result**: The implementation passes 17 focused core tests and the complete 47-test package gate. The tests cover deterministic replay, independent ordering, concurrency, retries, cancellation, timeout, overflow, corrupt encoding, privacy decisions and content-free evidence.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
