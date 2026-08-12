---
title: "Decision Record: Phase 008 Packaging and Release Hardening"
description: "Architecture decision for Phase 008: gate release with a dated support matrix and fail-closed compatibility doctor."
trigger_phrases:
  - "packaging-and-release-hardening"
  - "architecture decision"
  - "gate release with a dated support matrix and fail-closed compatibility doctor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted the Phase 008 packaging and release-gate decision under autonomous-goal delegation."
    next_safe_action: "Implement the packaging, doctor, and release-gate framework through tasks.md."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
# Decision Record: Phase 008 Packaging and Release Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate release with a dated support matrix and fail-closed compatibility doctor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-12 |
| **Deciders** | Framework accepted by the orchestrator under the operator's autonomous-goal delegation (2026-08-12); the release itself stays blocked until the human non-inferiority study, fresh provider facts, and the live credentialed smoke are supplied |

---

<!-- ANCHOR:adr-001-context -->
### Context

Package the system with explicit provider privacy choices, a tested compatibility matrix, diagnostics, rollback, and six-runtime release gates. The design must preserve canonical state, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
- Package entry points and presets may be published only when their support-matrix evidence is current.
- Provider privacy and retention facts must carry expiry dates and fail closed when stale.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Gate release with a dated support matrix and fail-closed compatibility doctor.

**How it works**: Every supported provider-model, prompt-profile, runtime, and presentation-tier combination is evidence-backed, dated, and assigned an expiry. The doctor blocks unsafe, unknown, unsupported, or stale combinations, explains the reason without secrets, and preserves original-only operation as the emergency baseline. OpenCode Go privacy and retention facts must be revalidated before 2026-08-31 and for every release.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Dated matrix plus fail-closed doctor | Honest support, actionable diagnosis, and safe defaults | Ongoing compatibility maintenance | 9/10 |
| Best-effort support with warnings | Fewer blocked configurations | Unknown privacy and protocol risks reach production | 3/10 |
| Documentation-only matrix | Low engineering cost | Cannot detect local drift or stale facts | 5/10 |

**Why this one**: The proposed design best preserves the immutable-state architecture while keeping failure behavior deterministic, portable, and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.

**What it costs**:

- The matrix and doctor require regular updates. Mitigation: automate probes where safe and expire evidence rather than assuming permanence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A false-negative doctor check can block a valid route. | High | Expose content-free diagnostics and a local-only or original-only path while facts are refreshed. |
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

- `packages/cli-communication-projection/package.json`: Harden the Phase 002 package metadata, scripts, entry points, exports, and supported engines.
- `packages/cli-communication-projection/src/doctor/`: Compatibility and privacy diagnostics.
- `packages/cli-communication-projection/src/release/`: Release gates, typed aborts, rollback coordination, and signed evidence manifests.
- `packages/cli-communication-projection/docs/`: Install, configuration, privacy, support, rollback, and runbook docs.
- `packages/cli-communication-projection/test/release/`: Clean-install, compatibility, upgrade, rollback, and six-runtime rehearsals.

**How to roll back**: Switch all runtimes to original-only, disable provider routing, reinstall the last supported package, rerun the doctor, and verify canonical transcript hashes are unchanged.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
