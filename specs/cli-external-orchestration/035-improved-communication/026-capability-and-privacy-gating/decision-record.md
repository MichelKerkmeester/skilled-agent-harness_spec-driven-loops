---
title: "Decision Record: Phase 026 Capability and Privacy Gating"
description: "Proposed architecture decisions for Phase 026: bind the compatibility doctor to every activation path through one typed pre-projection gate, and fail closed to the exact original on unknown, stale, or incapable critical facts."
trigger_phrases:
  - "capability-and-privacy-gating"
  - "architecture decision"
  - "doctor binding gate and fail-closed original selection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/026-capability-and-privacy-gating"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Accepted and verified the capability and privacy gate decisions."
    next_safe_action: "Consume the completed gate from the evaluation and release closeout."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-capability-and-privacy-gating-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One typed pre-projection gate is the single seam every activation path consumes."
      - "The gate fails closed to exact-original on unknown, stale, or incapable critical facts and blocks hosted routing absent a fresh, capable, privacy-approved decision."
---
# Decision Record: Phase 026 Capability and Privacy Gating

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bind the compatibility doctor to every activation path through one typed pre-projection gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

The compatibility doctor from Phase 008 already diagnoses versions, capabilities, endpoint reachability, credential references, privacy-fact freshness, and supported render tiers, and it fails closed to original-only on malformed input. But no activation path consults it. The seams from Phases 019-025 gate on enablement and fail open to the byte-exact original on error, yet an incapable runtime, a stale privacy fact, or an unsupported provider-model row can pass the enablement gate and reach the projection stage. Each seam would otherwise re-derive its own checks and diverge on what it verifies before projecting.

### Constraints

- The decision must gate every activation path, not just the projection core.
- The doctor must stay the single authority and never be duplicated per runtime or provider.
- The gate must expose a typed decision, never a raw report with unstructured reasons.
- The diagnostics the gate surfaces must be content-free, with no message text or secrets.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: bind the Phase 008 compatibility doctor to every activation path through one typed pre-projection gate at the projection seam.

**How it works**: a single pre-projection gate asks the doctor for a runtime, provider, and model combination and maps the report onto a typed `GateDecision`. The union resolves to `proceed` only when the combination is fresh, capable, and privacy-approved, or to `exact-original` with a content-free reason code on every unknown, stale, incapable, or privacy-denied terminal. The gate is wired before `projectMessage()` and on every native and wrapper activation path from Phases 019-025, so the fail-closed rule is decided once and consumed everywhere. Diagnostics expose only reason codes, never content.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| One typed gate binding the doctor to every activation path | Single authority, decided once, typed and content-free | One seam to maintain, and every path must call it | 9/10 |
| Per-runtime or per-provider bespoke checks | Maximally tailored to each seam | Reintroduces divergence and bypasses the doctor's single authority | 3/10 |
| Gate only inside the projection core | One internal chokepoint | Wrapper seams never consult the doctor, so they can project on unsafe facts | 4/10 |
| Consult the raw doctor report directly at each seam | No new abstraction | Unstructured reasons leak into diagnostics and each seam parses differently | 4/10 |

**Why this one**: one typed gate makes the doctor the single pre-projection authority, keeps diagnostics content-free, and prevents the seams from diverging on what they verify.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Every activation path crosses the same fail-closed rule before projecting.
- The doctor's authority is bound to the seam instead of being advisory.
- Diagnostics carry reason codes only, so no content can leak.

**What it costs**:

- Every native and wrapper path must call the gate. Mitigation: the gate is one named entry point and the per-runtime verification proves each call.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An activation path forgets the gate and projects on unsafe facts. | High | REQ-005 requires the gate on every path with a per-runtime verification matrix. |
| A raw report leaks into a diagnostic. | High | The gate maps every terminal to the typed union before anything surfaces. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | No activation path yet consults the doctor, so the seam cannot fail closed on unsafe facts. |
| 2 | Beyond local maxima? | PASS | Four materially different gate placements and shapes were compared. |
| 3 | Sufficient? | PASS | One typed gate wired before the entrypoint and every activation path is the smallest complete design. |
| 4 | Fits goal? | PASS | It binds the doctor to the seam and fails closed on unsafe conditions. |
| 5 | Open horizons? | PASS | New runtimes and providers join the gate without changing the typed union. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What will change**:

- `spec.md`: REQ-001, REQ-004, and REQ-005 stating the typed gate, content-free diagnostics, and per-runtime coverage.
- `plan.md` and `tasks.md`: the gate authoring and the per-runtime wiring and verification tasks.
- `decision-record.md`: this ADR and the fail-closed selection ADR.

**How to roll back**: revise the gate placement and the corresponding requirements, rerun the per-runtime verification, and refresh the packet metadata. No runtime code changes are involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Fail closed to the exact original on unknown, stale, or incapable critical facts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-002-context -->
### Context

Projection rewrites rendered output, and a hosted route sends content beyond the machine. The doctor already fails closed to original-only on malformed input, but the seams do not yet apply that rule to capability, privacy-class, and privacy-fact freshness. Without a fail-closed rule, an unknown or stale fact could still permit projection, and a hosted route could fire without a fresh, capable, privacy-approved decision, which violates the privacy boundary built in Phase 005 and Phase 008.

### Constraints

- Any unknown, stale, incapable, or privacy-denied critical fact must never yield projection or hosted egress.
- The byte-exact original must be the guaranteed outcome of every blocked terminal.
- The fail-closed rule must hold for every runtime, provider, and model combination.
- The rule must not contradict the Phase 017 fail-open seam: both converge on the byte-exact original display.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We decided**: fail closed to the exact original on unknown, stale, or incapable critical facts, and require a fresh, capable, privacy-approved decision before any hosted routing.

**How it works**: the typed gate resolves every unsafe terminal to `exact-original` with a content-free reason code, so projection is refused and the exact bytes are emitted. A hosted route fires only when the decision is fresh, capable, and privacy-approved. Local-only configuration makes zero hosted calls regardless of provider health. The seam still fails open to the byte-exact original on any downstream error, so the fail-closed gate and the fail-open seam both converge on the exact original display.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fail closed to the exact original on unsafe facts | Never projects or egresses on an unproven combination, content-free | A stale fact silently reverts to the original, hiding the reason behind a reason code | 9/10 |
| Proceed on unknown with a warning | Keeps projection working | Projects and can egress on an unproven privacy or capability state | 2/10 |
| Best-effort fallback route on incapability | Keeps some projected value | Violates the privacy boundary and can send content to an unapproved route | 2/10 |
| Fail open to a partial projection | Keeps some projected value | Violates the byte-exact guarantee and leaks a partial transform | 1/10 |

**Why this one**: the exact original is the only safe outcome for a display layer whose canonical bytes must never change and whose content must never egress on an unproven route.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- The seam refuses projection and hosted egress on any unsafe combination.
- Diagnostics stay content-free while still explaining the blocked terminal through a reason code.

**What it costs**:

- A stale or incapable combination reverts to the original, hiding the reason behind a reason code. Mitigation: the reason-code set is documented so operators can act on it.
- Every activation path must call the gate. Mitigation: the per-runtime verification proves the call on each path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hosted route fires on a stale or incapable decision. | High | REQ-003 blocks hosted routing unless the decision is fresh, capable, and privacy-approved. |
| A diagnostic leaks the underlying reason beyond the code set. | High | REQ-004 restricts diagnostics to enum-style reason codes, with lint coverage. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | A display layer with hosted egress requires a single fail-closed rule for unproven combinations. |
| 2 | Beyond local maxima? | PASS | Four failure policies were compared, including proceed-on-unknown. |
| 3 | Sufficient? | PASS | The typed gate, the reason-code set, and the hosted-routing block form the smallest complete rule. |
| 4 | Fits goal? | PASS | It keeps the exact original as the guaranteed outcome of every blocked terminal. |
| 5 | Open horizons? | PASS | New runtimes, providers, and privacy classes inherit the same rule without redesign. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What will change**:

- `spec.md`: REQ-002 and REQ-003 stating the fail-closed selection and the hosted-routing block, plus REQ-006 for the local-only zero-hosted control.
- `plan.md` and `tasks.md`: the gate terminal mapping and the decision, egress, and per-runtime verification tasks.
- `decision-record.md`: this ADR recording the fail-closed rule.

**How to roll back**: revise the gate terminal mapping and the corresponding requirements, rerun the decision and egress verification, and refresh the packet metadata. No runtime code changes are involved.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
