---
title: "Decision Record: Phase 005 Provider Adapters and Privacy"
description: "Architecture decision for Phase 005: use model-scoped adapters behind a privacy-first router."
trigger_phrases:
  - "provider-adapters-and-privacy"
  - "architecture decision"
  - "use model-scoped adapters behind a privacy-first router"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Returned the Phase 005 planning decision to Proposed after review."
    next_safe_action: "Obtain project-owner approval, then implement the decision through tasks.md."
    blockers:
      - "Project-owner approval is not yet recorded."
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
# Decision Record: Phase 005 Provider Adapters and Privacy

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use model-scoped adapters behind a privacy-first router

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-11 |
| **Deciders** | Proposed by planning review; project-owner approval pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent. The design must preserve canonical state, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Use model-scoped adapters behind a privacy-first router.

**How it works**: Classify data and establish egress permission before ranking providers or invoking an adapter. Each provider-model pair declares its own protocol, prompt-control mapping, and dated capabilities. Fallback crosses privacy classes only with explicit user policy.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Model-scoped adapters with privacy-first routing | Portable, auditable, and safe across local and hosted models | More explicit configuration | 9/10 |
| One OpenAI-compatible client for everything | Small transport surface | Hides provider differences and native capabilities | 5/10 |
| Rank quality before privacy | Potentially better model choice | Can expose content before consent | 1/10 |

**Why this one**: The proposed design best preserves the immutable-state architecture while keeping failure behavior deterministic, portable, and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.

**What it costs**:

- Configuration is more explicit than a single endpoint and model string. Mitigation: provide validated presets without hiding privacy decisions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Provider documentation can become stale. | High | Attach source and observed-at dates, surface unknown state, and recheck during Phase 008. |
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

- `packages/cli-communication-projection/src/providers/`: Provider registry, discovery, and adapters.
- `packages/cli-communication-projection/src/privacy/`: Classification, consent, and routing policy.
- `packages/cli-communication-projection/test/providers/`: Contract tests with local and hosted stubs.

**How to roll back**: Disable hosted routes and select local-only or original-only policy; no canonical data migration is required.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
