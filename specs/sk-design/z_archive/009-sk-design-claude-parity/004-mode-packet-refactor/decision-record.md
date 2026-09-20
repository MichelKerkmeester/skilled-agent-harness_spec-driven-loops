---
title: "Decision Record: Phase 004 - Mode Packet Refactor"
description: "Decision record for keeping sk-design mode packets as public execution lanes while procedures remain internal support cards."
trigger_phrases:
  - "mode packets public lanes"
  - "procedures internal support cards"
  - "md-generator backend boundary"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/004-mode-packet-refactor"
    last_updated_at: "2026-07-06T00:23:55.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Reconciled decision-record.md; ADR-001/002/003 status updated to Accepted and Implemented."
    next_safe_action: "Start Phase 005 release gate."
---
# Decision Record: Phase 004 - Mode Packet Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Mode Packets Remain Public Execution Lanes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted and Implemented |
| **Date** | 2026-07-05 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-design` currently presents one public design skill with five mode packets. The Claude-like operating model adds procedure strategy, but the user-facing contract should remain stable: users choose the existing modes, not hidden procedure implementation details.

### Constraints

- Preserve `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator` as public lanes.
- Preserve the single `sk-design` advisor identity.
- Preserve `mode-registry` and hub-router route shape unless a later approved decision changes them.
- Apply procedure support inside selected modes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the five mode packets as public execution lanes and integrate procedure support inside those lanes.

**How it works**: The hub-router selects one of the current public modes. The selected mode may then use private procedure guidance to shape execution, proof, and fallback behavior, but the user-facing route stays at the mode level.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mode packets as public lanes** | Stable public API, clear owner per mode, compatible with existing registry | Requires careful per-mode integration | 9/10 |
| Public procedure modes | Exposes procedure capabilities directly | Fragments user choice and duplicates Claude taxonomy | 3/10 |
| One generic procedure mode | Centralizes procedure logic | Weakens mode-specific design judgment and md-generator boundary | 5/10 |
| No procedure integration | Minimal change | Fails Claude-like parity objective | 2/10 |

**Why this one**: It improves internal operating quality without changing the public routing model users already rely on.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The refactor can be applied mode by mode without public taxonomy churn.
- Each mode owns its own context, proof, and fallback behavior.
- Verification can compare public routes before and after implementation.

**What it costs**:
- Each mode needs careful updates rather than a single generic procedure layer.
- The registry and hub-router need explicit regression checks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A procedure becomes public by accident | H | Run advisor identity and public mode checks |
| Mode updates diverge in style | M | Use shared procedure language and proof expectations |
| Registry drift breaks mode selection | H | Run routing checks after implementation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Procedure support must be applied without changing public route identity. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares public procedure modes, one generic procedure mode, no integration, and current mode lanes. |
| 3 | **Sufficient?** | PASS | Mode-local integration adds only the needed selection, proof, and fallback layer. |
| 4 | **Fits Goal?** | PASS | The approach preserves five public modes while applying Claude-like procedures internally. |
| 5 | **Open Horizons?** | PASS | Later phases can adjust procedure internals without changing the public mode API. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes in a future task**:
- Add mode-local procedure selection language to each of the five mode packets.
- Add context/proof expectations and fallback behavior.
- Verify registry and hub-router stability.

**How to roll back**: Revert the affected mode-packet, registry, and hub-router reference changes, then re-run public routing checks.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Procedures Remain Internal Support Cards

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted and Implemented |
| **Date** | 2026-07-05 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

### Context

Phase 003 establishes private procedure cards as the internal adaptation layer. Phase 004 applies that model to public mode packets. The risk is that cards become a second public taxonomy or get copied into public docs as user-facing choices.

### Decision

**We chose**: Procedures stay internal support cards that modes can use, cite, and verify, but users are not asked to route directly to cards.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Internal support cards** | Keeps procedures inspectable and private, supports proof gates | Requires mode documentation discipline | 9/10 |
| Public card catalog | Easy to browse | Exposes implementation details and encourages user routing to cards | 4/10 |
| Inline unstructured guidance | Simple to write | Hard to verify, cite, or reuse | 5/10 |
| Shared-only cards | Centralizes guidance | Weakens mode ownership and encourages dumping ground behavior | 6/10 |

---

### Consequences

**What improves**:
- Mode packets can use Claude-like procedure behavior without presenting it as public API.
- Cards remain testable through context and proof expectations.
- README and changelog can describe maintainership impact without listing hidden cards as user choices.

**What it costs**:
- Maintainers must keep private card references concise and avoid copying external procedure bodies.
- Link checks must cover private references without turning them into public navigation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Private cards leak into public README as routing options | H | README review checks public taxonomy language |
| Cards duplicate shared reference guidance | M | Shared reference review before completion |
| Proof gates become optional prose | M | Checklist requires proof expectations per mode |

---

### Implementation

**What changes in a future task**:
- Add private procedure references inside mode packets.
- Pair each procedure path with context inputs and proof outputs.
- Keep README/changelog wording focused on the operating model rather than card inventory.

**How to roll back**: Remove private card references from mode packets and restore baseline mode instructions.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: md-generator Keeps Its Mutating Backend Boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted and Implemented |
| **Date** | 2026-07-05 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

### Context

`design-md-generator` is one of the five public `sk-design` modes, but unlike purely advisory design modes it includes a live extraction backend for generating style reference output. A generic procedure refactor must not flatten or hide that mutating boundary.

### Decision

**We chose**: Keep `design-md-generator` as a public mode packet with explicit backend extraction behavior and dedicated verification, while allowing it to consume private procedure support like the other modes.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve backend boundary** | Protects extraction behavior and verification clarity | Requires md-generator-specific checks | 10/10 |
| Treat md-generator like a read-only mode | Simplifies procedure wording | Hides mutation and risks backend regression | 2/10 |
| Move backend into shared procedure layer | Centralizes machinery | Breaks mode ownership and makes side effects less visible | 3/10 |
| Exclude md-generator from refactor | Avoids backend risk | Leaves one public mode outside the operating model | 5/10 |

---

### Consequences

**What improves**:
- The refactor can include all five modes without weakening backend safeguards.
- md-generator verification remains specific to extraction and generated output.
- Procedure support can enhance the mode while preserving its side-effect boundary.

**What it costs**:
- The implementation must run md-generator-specific verification in addition to generic link and routing checks.
- README/changelog text must distinguish procedure model from backend behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend invocation path breaks | H | Run md-generator backend verification |
| Procedure wording implies read-only behavior | M | Explicitly document mutating backend boundary |
| Generated output claims lack proof | M | Require backend-specific proof evidence |

---

### Implementation

**What changes in a future task**:
- Add procedure support to md-generator mode guidance.
- Keep extraction backend commands, references, and verification visible.
- Require backend-specific evidence before claiming md-generator safety.

**How to roll back**: Revert md-generator mode guidance and backend references to the pre-refactor state, then rerun backend verification.
<!-- /ANCHOR:adr-003 -->
