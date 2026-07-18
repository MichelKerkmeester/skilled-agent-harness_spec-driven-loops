---
title: "Decision Record: foundations + motion styles-library wiring (Phase C)"
description: "Architectural choices for wiring design-foundations and design-motion to the styles library: typed compatibility edges over scalar averaging, and a restraint-first gate ahead of retrieval. Planned scaffold; decisions proposed."
trigger_phrases:
  - "foundations motion decisions"
  - "typed edges decision"
  - "restraint gate decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/009-foundations-motion"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the foundations-motion L3 scaffold"
    next_safe_action: "Build the phase-007 seam wiring for foundations then motion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-found-motion-011-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: foundations + motion styles-library wiring (Phase C)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Typed compatibility edges instead of scalar token averaging

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

design-foundations needs to express how tokens relate across the corpus. The tempting shortcut is to average or interpolate token values and treat top-level token-axis co-presence as compatibility. That erases conflict, invents blends no source ever produced, and hands foundations a false authority over token values it must not own.

### Constraints

- Corpus evidence must stay reference-only under the fixed authority order settled in 003.
- Foundations must not override target roles, values, accessibility checks, or extraction truth.
- Output must bound to 1 coherent style plus at most 3 axis owners.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: model compatibility as typed dependency edges ("these tokens work together / conflict") with a relationship blueprint and a transformation ledger.

**How it works**: Each edge carries a type and provenance; the blueprint records structure; the ledger tracks source → relationship → transformation → lock. Downstream checks that were never evaluated surface as `not-assessed` rather than passing silently.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Typed dependency edges** | Preserves conflict, keeps corpus reference-only, auditable ledger | More schema to design | 9/10 |
| Scalar averaging / interpolation | Simple to compute | Invents non-existent tokens, hides conflict, false authority | 2/10 |
| Top-level co-presence as compatibility | Cheap signal | Correlation mistaken for compatibility | 3/10 |

**Why this one**: Only typed edges express conflict and keep foundations from overriding token truth while staying auditable through the ledger.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Conflict is representable, not averaged away.
- Every compatibility claim is traceable through the transformation ledger.

**What it costs**:
- More contract/schema design up front. Mitigation: reuse the phase-007 seam fields and phase-008 provenance patterns.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Edge schema drifts from the seam | M | Extend seam provenance fields rather than forking a parallel schema |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Foundations has no library path today |
| 2 | **Beyond Local Maxima?** | PASS | Averaging and co-presence weighed and rejected |
| 3 | **Sufficient?** | PASS | Typed edges + ledger cover the 003 Phase C recommendation |
| 4 | **Fits Goal?** | PASS | On the critical path to 010 |
| 5 | **Open Horizons?** | PASS | Ledger supports future audit/drift reuse |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `design-foundations/` gains a typed compatibility graph, relationship blueprint, transformation ledger, and `not-assessed` checks (proposed additions).

**How to roll back**: Remove the proposed `design-foundations/` additions; the phase-007 seam and phase-004 retrieval are untouched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Restraint-first gate before any motion retrieval

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainers |

---

<!-- ANCHOR:adr-002-context -->
### Context

design-motion must decide whether a target should move at all before it reasons about how. If retrieval runs first, static visual similarity and absent prose can rank as motion intent, fabricating movement where restraint is correct and paying retrieval cost for a no-motion answer.

### Constraints

- Only the restraint gate plus target evidence may decide no-motion, never static similarity or absent prose.
- Motion must not override reduced-motion/performance proof or the target mechanism.
- Hard negatives (explicit negations) must never surface as false positives.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: run a restraint-first "should this move at all?" query gate before any corpus retrieval, then apply polarity-aware eligibility with hard negatives.

**How it works**: The gate resolves against target evidence first; a no-motion verdict short-circuits before retrieval. When motion is warranted, eligibility ranks candidates with hard negatives, purpose/state archetypes, and negative baselines.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Restraint gate before retrieval** | Blocks fabricated motion, cheap no-motion path | Extra gate stage | 9/10 |
| Retrieve then filter | Reuses retrieval directly | Static similarity leaks as intent, wasted cost | 3/10 |
| Similarity-only eligibility | Simple | Ranks hard negatives as false positives | 2/10 |

**Why this one**: Only a restraint-first gate keeps static similarity from fabricating motion and keeps the no-motion path off the retrieval cost.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No-motion is a first-class, cheap verdict.
- Hard negatives are blocked before they can rank.

**What it costs**:
- An extra gate stage to design and test. Mitigation: reuse phase-008 proof fixtures for the gate's evidence checks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gate over-suppresses legitimate motion | M | Target evidence, not corpus absence, drives the verdict; negative baselines calibrate it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Motion has no restraint-aware path today |
| 2 | **Beyond Local Maxima?** | PASS | Retrieve-then-filter and similarity-only weighed and rejected |
| 3 | **Sufficient?** | PASS | Gate + polarity-aware eligibility cover the 003 Phase C recommendation |
| 4 | **Fits Goal?** | PASS | On the critical path to 010 |
| 5 | **Open Horizons?** | PASS | Archetypes and baselines extend to future motion work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `design-motion/` gains a restraint-first query gate, polarity-aware eligibility with hard negatives, purpose/state archetypes, and negative baselines (proposed additions).

**How to roll back**: Remove the proposed `design-motion/` additions; the phase-007 seam and phase-004 retrieval are untouched.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
