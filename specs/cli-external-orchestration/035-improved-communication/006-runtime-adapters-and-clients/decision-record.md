---
title: "Decision Record: Phase 006 Runtime Adapters and Clients"
description: "Architecture decision for Phase 006: use client-owned presentation whenever native interception is not explicitly safe."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "architecture decision"
  - "use client-owned presentation whenever native interception is not explicitly safe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted the Phase 006 architecture decision under autonomous-goal delegation."
    next_safe_action: "Implement the decision through tasks.md, starting with the runtime contract and Claude reference adapter."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
# Decision Record: Phase 006 Runtime Adapters and Clients

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use client-owned presentation whenever native interception is not explicitly safe

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-12 |
| **Deciders** | Approved by the orchestrator under the operator's autonomous-goal delegation (2026-08-12); the three-option comparison and 5/5 checks below carry the rationale |

---

<!-- ANCHOR:adr-001-context -->
### Context

Integrate the projection core with six CLIs through their safest supported event and presentation boundaries. The design must preserve canonical state, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Use client-owned presentation whenever native interception is not explicitly safe, with explicit full-projection and safe-native tiers.

**How it works**: Adapters consume documented runtime surfaces and emit shared events. Client-owned or headless paths that own a complete message and atomic render decision qualify for full projection parity. Constrained native surfaces qualify only for safe native integration and may append, use a sidecar, or return original-only. No adapter suppresses original output before a validated replacement exists.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Documented adapters plus client-owned presentation | Portable and safe across uneven capabilities | May require companion UI | 9/10 |
| Patch each native terminal renderer | Closest visual integration | Fragile, unsupported, and likely to corrupt state | 2/10 |
| Append rewritten text everywhere | Simple | Duplicated output and weaker 1:1 experience | 5/10 |

**Why this one**: The proposed design best preserves the immutable-state architecture while keeping failure behavior deterministic, portable, and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.

**What it costs**:

- Some runtimes need a companion client for the closest presentation match. Mitigation: keep append, sidecar, and original-only modes first-class.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A runtime capability may be inferred rather than confirmed. | High | Mark evidence state, pin versions, and fail closed when the safe presentation boundary is unknown. |
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

- `packages/cli-communication-projection/src/runtimes/`: Six runtime adapters and capability records.
- `packages/cli-communication-projection/src/clients/`: Client-owned display and sidecar integrations.
- `packages/cli-communication-projection/test/runtimes/`: Pinned fixture replay and smoke harnesses.

**How to roll back**: Disable the affected adapter or select original-only rendering for that runtime; no transcript migration or vendor patch reversal is needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
