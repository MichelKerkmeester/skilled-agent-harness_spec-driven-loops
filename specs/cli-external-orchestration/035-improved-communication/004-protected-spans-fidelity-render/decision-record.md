---
title: "Decision Record: Phase 004 Protected Spans, Fidelity, and Render"
description: "Architecture decision for Phase 004: use deterministic-first validation with a reject-only model judge."
trigger_phrases:
  - "protected-spans-fidelity-render"
  - "architecture decision"
  - "use deterministic-first validation with a reject-only model judge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Implemented the accepted decision and passed its deterministic and reject-only gates."
    next_safe_action: "Preserve this boundary while Phase 005 adds privacy-first provider routing."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The project owner approved Phase 004 implementation in the active session."
      - "The accepted design is implemented and verified by 23 focused tests and the whole package gate."
---
# Decision Record: Phase 004 Protected Spans, Fidelity, and Render

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use deterministic-first validation with a reject-only model judge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted and implemented |
| **Date** | 2026-08-11 |
| **Deciders** | Project owner and implementation review |

---

<!-- ANCHOR:adr-001-context -->
### Context

Protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode. The design must preserve canonical state, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Decision**: Use deterministic-first validation with a reject-only model judge.

**How it works**: Structural and semantic invariants decide first. An optional model judge may add a veto after deterministic acceptance, while every rejection and internal error selects the exact original.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Deterministic-first plus reject-only judge | Hard invariants with an extra conservative semantic check | More validation stages | 9/10 |
| Judge-only validation | Flexible semantic assessment | Nondeterministic and can approve corruption | 3/10 |
| Similarity threshold only | Cheap automation | Misses polarity and requirement-strength changes | 4/10 |

**Why this one**: The proposed design best preserves the immutable-state architecture while keeping failure behavior deterministic, portable, and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.

**What it costs**:

- Some acceptable rewrites will be rejected. Mitigation: measure false rejects in Phase 007 but keep safety-biased fallback.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A protected-span parser gap could expose mutable technical content. | High | Pin parser behavior, add malformed-input tests, and default ambiguous spans to protected. |
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

- `packages/cli-communication-projection/src/fidelity/`: Protected-span codec and deterministic validators.
- `packages/cli-communication-projection/src/render/`: Projection acceptance and render decisions.
- `packages/cli-communication-projection/test/fidelity/`: Bijection, corruption, and exact-fallback tests.

**How to roll back**: Switch rendering to original-only and bypass provider projection; canonical messages and runtime streams remain unchanged.

**Observed outcome**: The implementation pins `portable-commonmark-safe`, restores protected bytes from the immutable source table, runs deterministic vetoes before the optional judge, performs source-digest compare-and-swap, selects a runtime-supported display mode and emits only content-free terminal evidence. The all-capabilities-disabled test exercises the original-only rollback path.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
