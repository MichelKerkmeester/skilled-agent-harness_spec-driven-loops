---
title: "Decision Record: Fingerprint Docset Enforcement"
description: "Why the migration refreshes digests instead of stamping around them, reversing this packet's own plan once the drift rate was measured."
trigger_phrases:
  - "stamp only migration reversed"
  - "fleet digest refresh"
  - "twenty-packet drift sample"
  - "refresh digests not stamp"
  - "marker mandatory beside digest"
  - "source fingerprint docset"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/012-fingerprint-docset-enforcement"
    last_updated_at: "2026-08-30T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reversed the stamp-only design after measuring the drift rate and what remediating it would mean"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-fingerprint-docset-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Fingerprint Docset Enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Refresh the digests rather than stamp around them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-30 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-001-context -->
### Context

This packet's own spec and plan called for a stamp-only migration: add the marker, leave every
stored digest untouched, and let the drift the gate had been hiding surface as findings. The
reasoning was that recomputing would absorb exactly what the packet existed to expose, and
absorbing it would repeat the original mistake in a new place.

Then it was measured. 3,496 packets carried a digest with no marker, and re-deriving a
20-packet sample changed the stored digest in 10 of them — a 50% drift rate, matching an
earlier 8-packet sample at 4. Stamping without recomputing would therefore have surfaced
roughly 1,750 blocking failures at once.

The remediation for every one of them is the same command. A mismatch says the derived metadata
is stale relative to the documents; it does not say which document, why, or whether anything is
wrong beyond staleness. Nobody would investigate 1,750 of those. They would run the refresh.

### Constraints

- The gate is a hard error under strict validation, so a surfaced backlog blocks unrelated work rather than sitting as advice.
- The signal is only attributable when it appears one packet at a time, close to the edit that caused it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One repository-wide refresh, then make the marker mandatory beside a digest.

**How it works**: The refresh re-derives every packet's metadata, which both stamps the marker
and brings each digest back into agreement with its documents. The integrity rule then reports
a digest that carries no marker, so the gate is live everywhere from that point and drift is
caught where it is still attributable.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refresh once, then enforce** | Live gate everywhere, no backlog, future drift is attributable | The one-time signal is absorbed rather than reviewed | 8/10 |
| Stamp only, surface the drift (this packet's original plan) | Preserves a signal | ~1,750 blocking failures whose only remediation is the refresh being avoided | 4/10 |
| Leave the marker optional | No migration | The gate stays inert on 90% of the repository, which is the defect | 1/10 |
| Enforce without migrating | Simplest code | Fails 3,496 packets immediately | 1/10 |

**Why this one**: A signal is worth preserving when acting on it differs from clearing it. Here
they are the same command, so the backlog is ceremony. The value lives entirely in the forward
direction, and that is what enforcement buys.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The gate compares every packet that carries a digest, instead of roughly one in ten.
- Deleting the marker to silence the check is now a reported violation rather than a schema-legal escape.

**What it costs**:
- One repository-wide metadata commit, and the pre-existing drift is absorbed without review. Mitigation: it is a single mechanical commit, revertible whole.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The refresh masked a real content problem in some packet | L | A digest mismatch never identified one; it only reported staleness |
| Folders the migration does not reach now fail the new rule | M | Measured: track roots and archived folders are not validated as packets and pass unaffected |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------------|----------|
| 1 | **Necessary?** | PASS | The gate was inert across 90% of the repository |
| 2 | **Beyond Local Maxima?** | PASS | Four options, including this packet's own original plan |
| 3 | **Sufficient?** | PASS | One refresh plus one rule; no new machinery |
| 4 | **Fits Goal?** | PASS | The packet exists to make the marker mean something |
| 5 | **Open Horizons?** | PASS | The generation mechanism still absorbs the next document-set change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: The integrity rule reports a digest with no marker. The migration is the
existing repository-wide refresh rather than a purpose-built stamp-only tool, which is one less
thing to maintain.

**How to roll back**: Revert the refresh commit and the rule change. The refresh is mechanical
and self-contained.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
