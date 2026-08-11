---
title: "Decision Record: Phase 007 Evaluation and Observability"
description: "Architecture decision for Phase 007: gate release with deterministic safety plus blind human non-inferiority."
trigger_phrases:
  - "evaluation-and-observability"
  - "architecture decision"
  - "gate release with deterministic safety plus blind human non-inferiority"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/007-evaluation-and-observability"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Returned the Phase 007 planning decision to Proposed after review."
    next_safe_action: "Obtain project-owner approval, then implement the decision through tasks.md."
    blockers:
      - "Project-owner approval is not yet recorded."
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
# Decision Record: Phase 007 Evaluation and Observability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate release with deterministic safety plus blind human non-inferiority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-11 |
| **Deciders** | Proposed by planning review; project-owner approval pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior. The design must preserve canonical state, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
- A three-sample pilot may estimate variance but cannot prove release quality.
- Evidence must remain stratified by provider-model, prompt profile, runtime, and presentation tier.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Gate release with deterministic safety plus a pre-registered, powered, blind human non-inferiority protocol.

**How it works**: Deterministic fidelity checks remain absolute vetoes. A three-sample pilot estimates variance; before candidate scoring, the protocol freezes release-critical strata, a sample size with at least 80 percent power and alpha 0.05, at least 30 and at most 100 paired ratings per stratum, three or more independent reviewers per comparison, randomized masked presentation, per-dimension negative margins, and stop rules. A dimension passes only when the lower bound of its two-sided 95 percent confidence interval is no worse than its frozen margin. An inconclusive result at the cap fails release.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Deterministic safety plus blind human non-inferiority | Separates hard fidelity from subjective quality and captures variance | Requires reviewer time | 9/10 |
| Automated similarity score only | Fast and cheap | Poor proxy for meaning and reference feel | 3/10 |
| Unblinded expert review | Rich feedback | Provider and expectation bias | 5/10 |

**Why this one**: The proposed design best preserves the immutable-state architecture while keeping failure behavior deterministic, portable, and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.

**What it costs**:

- Repeated blind review takes time. Mitigation: keep the corpus compact, stratified, versioned, and focused on release-critical cases.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reviewers may disagree on style. | High | Separate rubric dimensions, collect at least three independent ratings per comparison, and report uncertainty. |
| A small pilot may be mistaken for release proof. | High | Label pilot output as variance-planning evidence only and require the precomputed powered study for release. |
| Presentation tiers may be pooled into a false 1:1 claim. | High | Stratify all reports and prohibit `safe-native` evidence from satisfying a `full-projection` gate. |
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

- `packages/cli-communication-projection/src/evaluation/`: Corpus runner, pilot planning, pre-registration, masked review, deterministic vetoes, and non-inferiority analysis.
- `packages/cli-communication-projection/src/observability/`: Aggregation, rotating keyed correlation, export controls, and redaction over lifecycle events produced earlier.
- `packages/cli-communication-projection/test/evaluation/`: Power-plan, blinding, confidence-interval, presentation-tier, canary, and report reproducibility tests.

**How to roll back**: Disable telemetry export and retain local aggregate reports only; evaluation artifacts can be regenerated from the secret-free corpus.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
