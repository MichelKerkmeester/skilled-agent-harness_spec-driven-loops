---
title: "Decision Record: Phase 010 Adjacent-Span Coalescing"
description: "Architecture decision for a transient model-facing representation that reduces marker burden while preserving the canonical map and strict restoration."
trigger_phrases:
  - "adjacent-span-coalescing"
  - "architecture decision"
  - "model-facing representation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/010-adjacent-span-coalescing"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Proposed the transient representation decision."
    next_safe_action: "Record the alias-disclosure privacy decision before selecting grouping or aliases."
    blockers:
      - "Alias category disclosure requires a privacy-policy decision."
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-010-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a short wire alias schema disclose protected-value categories, and is that acceptable under the privacy policy?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Decision Record: Phase 010 Adjacent-Span Coalescing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Add a transient model-facing representation while preserving the canonical map

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-13 |
| **Deciders** | Privacy owner and package maintainer; selection remains pending the alias-disclosure decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

The current one-token-per-range representation can inflate short messages with several long opaque markers. The model-facing burden should fall without changing canonical protected bytes, map identity, member order, categories, or strict restoration.

### Constraints

- The canonical `ProtectedDocument` and restoration checks remain unchanged.
- Structural blocks, code, and tables stay separate wherever grouping could change syntax.
- No raw protected value or unapproved category label may reach the provider wire.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Add a versioned transient representation after canonical protection and resolve it locally before strict restoration.

**How it works**: The representation will use bounded adjacency grouping or collision-resistant aliases, chosen after privacy review. The local resolver must reproduce the canonical marker sequence exactly before existing restoration logic runs.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Bounded adjacency grouping | Category-neutral and fewer markers | Reduction may be limited by syntax boundaries | 8/10 |
| Short wire aliases | Strong inflation reduction | Collision design and category-disclosure review required | 8/10 pending review |
| Keep canonical markers on the wire | No new mapping layer | Preserves the measured burden and inflation | 4/10 |

**Why this one**: A transient layer is the only option that can reduce burden while leaving the canonical map and restoration contract intact. Privacy review decides the concrete encoding.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Provider-facing marker count and encoded/source inflation can decrease.
- Canonical protection and strict restoration remain stable.

**What it costs**:

- The pipeline gains a versioned encode/resolve step. Mitigation: keep it transient, deterministic, and fully covered by canonical parity tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A grouping crosses a syntax boundary or an alias collides. | High | Preserve syntax-sensitive separations and reject unknown, duplicate, or ambiguous mappings. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The source-anchored probe measured substantial marker inflation. |
| 2 | Beyond local maxima? | PASS | Grouping, aliases, and the status quo were compared. |
| 3 | Sufficient? | PASS | A transient layer is the smallest design that preserves the canonical map. |
| 4 | Fits goal? | PASS | Lower marker burden directly supports more useful prose rewriting. |
| 5 | Open horizons? | PASS | Versioning permits later representation changes without rewriting canonical state. |

**Checks Summary**: 5/5 PASS for the architectural boundary; concrete encoding remains pending privacy review.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Fidelity/provider boundary: add a versioned transient encoder after canonical protection.
- Pre-restoration boundary: add strict local resolution to canonical markers.
- Tests: add burden metrics, canonical parity, syntax, collision, invalid-sequence, and privacy fixtures.

**How to roll back**: Disable the transient encoder and resolver, send canonical markers through the current path, and rerun the fixed corpus and fidelity suite.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
