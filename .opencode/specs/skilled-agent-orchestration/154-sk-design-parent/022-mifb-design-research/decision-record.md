---
title: "Decision Record: make-interfaces-feel-better → sk-design improvement research"
description: "Binding decisions from the deep-research phase: treat the external corpus as read-only and taste-gate every adoption (ADR-001); make design-foundations the highest-leverage home with design-audit as the enforcement pair while the hub stays logic-free (ADR-002)."
trigger_phrases:
  - "mifb sk-design research decisions"
  - "deep research decision record"
  - "sk-design adoption decisions"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research"
    last_updated_at: "2026-06-27T08:45:10Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the binding research decisions as ADRs"
    next_safe_action: "Build phase adopts backlog priorities 1-8 plus the shared-path doc fix"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-022-mifb-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: make-interfaces-feel-better → sk-design improvement research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat the external corpus as read-only input and taste-gate every adoption

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator (research phase) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We studied a strong external skill (`make-interfaces-feel-better`) to improve `sk-design`. The risk is over-adoption: importing prescriptive numeric recipes and a competing review format wholesale would bloat the family and drift its taste and anti-slop posture.

### Constraints

- The corpus is preserved byte-unchanged so findings stay traceable.
- `sk-design` already encodes most temporal craft and a strong anti-slop posture (e.g. the ghost-card tell, the Brand-vs-Product register).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: treat the corpus as read-only input and gate every candidate against existing `sk-design` taste and the anti-slop posture before recommending it.

**How it works**: each technique is marked net-new, partial, or already-covered with the existing location cited; conflicting guidance is reconciled or ruled out rather than folded in.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Taste-gated, net-new-only adoption (chosen)** | Adds real craft, avoids bloat and drift | Requires per-technique judgment | 9/10 |
| Adopt the corpus wholesale | Fast, "complete" | Bloats the family, drifts taste, conflicts with the ghost-card tell | 3/10 |
| Ignore the corpus | Zero risk | Leaves real micro-craft (radius math, image outlines, font smoothing) on the table | 4/10 |

**Why this one**: it captures the genuinely net-new craft while protecting the family's existing taste and anti-slop posture.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A small, high-signal backlog of net-new craft (concentric radius, image outlines, font smoothing, audit detectors).
- Explicit conflict decisions that protect the anti-slop posture.

**What it costs**:
- Per-technique adjudication effort. Mitigation: the research records the coverage status and rationale once, for reuse by the build phase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The research is read as a mandate to add bulk | M | The do-not list and net-new-vs-covered marking are explicit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without gating, adoption would bloat/drift the family |
| 2 | **Beyond Local Maxima?** | PASS | Weighed wholesale-adopt and ignore-corpus alternatives |
| 3 | **Sufficient?** | PASS | Coverage marking + conflict decisions are the minimal sufficient guardrail |
| 4 | **Fits Goal?** | PASS | Directly answers the research question (what to adopt, where) |
| 5 | **Open Horizons?** | PASS | Leaves a clean build path; nothing locked prematurely |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- This phase: research only — `research/research.md` records the gated backlog. No live sk-design change.
- Future build phase: applies the top backlog slice under the recorded conflict decisions.

**How to roll back**: delete the `022-mifb-design-research` packet; no live sk-design content was changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Make design-foundations the highest-leverage home, with design-audit as the enforcement pair

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator (research phase) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The adoptable craft spans five modes plus the shared register. Spreading edits evenly would fragment the work and risk per-mode inconsistency, and the hub must stay routing-only.

### Constraints

- The hub holds no per-mode logic (`sk-design/SKILL.md`).
- Most net-new corpus craft is a foundations *rule* first, then an audit *detector* that makes it reviewable.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: route the bulk of adoption into `design-foundations` (the rule home), pair it with `design-audit` (enforcement detectors), and keep `design-motion` for the few interaction refinements; the hub stays logic-free.

**How it works**: foundations gains the radius math, image-outline exception, font smoothing, text-wrap caveats and depth-material rules; audit gains the matching detectors; motion gains the icon-swap CSS fallback and escape hatches.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Foundations-primary + audit enforcement (chosen)** | Single rule home; enforcement makes rules reviewable | Concentrates edits in two modes | 9/10 |
| Spread edits evenly across all five modes | "Balanced" | Fragmented, inconsistent, harder to verify | 4/10 |
| Put shared vocabulary in the hub | Central | Violates the hub-is-logic-free invariant | 2/10 |

**Why this one**: it matches where the craft naturally lives and keeps the hub invariant intact.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A clear build sequence: foundations rules, then audit detectors, then narrow motion refinements.
- Consistency — one rule home rather than five divergent ones.

**What it costs**:
- Two modes carry most of the change. Mitigation: the per-mode rollup names exactly which edits land where.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared register becomes a dumping ground | M | Keep mechanics in foundations/audit; shared holds vocabulary only if multiple modes need it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a primary home the edits fragment across modes |
| 2 | **Beyond Local Maxima?** | PASS | Considered even-spread and hub-vocabulary alternatives |
| 3 | **Sufficient?** | PASS | Foundations + audit covers the high-leverage slice |
| 4 | **Fits Goal?** | PASS | Answers Q2 (correct home) and the per-mode rollup |
| 5 | **Open Horizons?** | PASS | Preserves the hub invariant and leaves shared vocabulary optional |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Future build phase: foundations gains rules, audit gains detectors, motion gains the icon-swap fallback + escape hatches.
- The hub and `md-generator` taste are unchanged; `md-generator` only preserves measured evidence.

**How to roll back**: the build phase owns its own revert; this research records intent only and changes no live content.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
