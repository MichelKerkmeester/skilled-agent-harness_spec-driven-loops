---
title: "Decision Record: impeccable research method and no-new-mode verdict"
description: "Binding decisions: run a convergent verify-against-real deep-research loop plus a cross-model adversarial sweep (ADR-001); adopt impeccable only as crosswalk refinements into existing modes with no new mode or parallel system (ADR-002)."
trigger_phrases:
  - "impeccable research decisions"
  - "impeccable no-new-mode verdict"
  - "sk-design impeccable ADRs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research"
    last_updated_at: "2026-06-27T14:44:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the research-method and no-new-mode ADRs"
    next_safe_action: "Validate strict"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-028-impeccable-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: impeccable research method and no-new-mode verdict

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Convergent verify-against-real loop plus a cross-model adversarial sweep

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context
impeccable overlaps heavily with what sk-design already encodes after two prior corpus adoptions. The 024 run produced a data-viz false positive that only verification caught. So the method must aggressively guard against claiming already-covered material as net-new.

### Constraints
- Operator named gpt-5.5 xhigh fast and 30 iterations.
- Research only; no live sk-design edits.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: a convergent GPT-5.5-xhigh loop where every candidate is verified against the real sk-design file, followed by a cross-model adversarial sweep (Kimi completeness + DeepSeek adversarial) that re-verifies the backlog and the rulings independently.

**How it works**: the loop converged at 12 (single skill, fully covered by iter 8); the sweep ran 4 read-only critics; DeepSeek confirmed the backlog is sound (0 false positives) and the rulings hold (no-new-mode confirmed).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Verify-against-real loop + cross-model sweep (chosen)** | Catches false positives; independent corroboration | More dispatches | 9/10 |
| Run to the 30 cap on same-model synthesis | "Uses the budget" | Padding; no new info after convergence | 3/10 |
| Single-model loop, no sweep | Cheaper | No independent guard against overlap false positives | 5/10 |

**Why this one**: model diversity, not more same-model synthesis, is the honest way to add coverage past convergence.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The backlog is independently verified; convergence is honest (stopped at 12, not padded).

**What it costs**:
- Four extra cross-model dispatches. Mitigation: read-only, parallel.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Convergence stops "early" vs the 30 request | L | The sweep adds genuine diversity-coverage; reported honestly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | High overlap demands verification |
| 2 | **Beyond Local Maxima?** | PASS | Considered run-to-cap and no-sweep |
| 3 | **Sufficient?** | PASS | Verify + adversarial sweep covers false-positive + miss risk |
| 4 | **Fits Goal?** | PASS | Produces a trustworthy backlog |
| 5 | **Open Horizons?** | PASS | A future build can consume it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**: research artifacts only (state machine + research.md).
**How to roll back**: re-run an iteration or re-synthesize; append-only state is resumable.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Adopt impeccable only as crosswalk refinements; no new mode or parallel system

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context
impeccable ships a register, a critique score, an anti-pattern detector engine, a prose validator, and a live-mode workflow. sk-design already has a register, a /20 audit score, model-specific AI tells, and a real-UI loop. Duplicating impeccable's systems would create parallel, conflicting machinery.

### Constraints
- sk-design's five-mode structure and hub-is-routing-only invariant hold.
- Already-covered and infrastructure material must not be re-adopted.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: adopt only the genuinely net-new build/visual refinements as crosswalks into existing modes (interface real-UI loop, audit anti-patterns/hardening, motion advanced craft, interface copy), and rule out every structural system as already-analogous or infrastructure. No new mode.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Crosswalk refinements, no new system (chosen)** | Preserves ownership; no duplication | Requires per-item verification | 9/10 |
| Import impeccable's register/score/detector | "Feature parity" | Parallel conflicting systems; bloat | 2/10 |
| Add a sixth mode for impeccable | Tidy home | Unjustified; impeccable is itself one skill | 2/10 |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- sk-design gains a few verified refinements without structural bloat.

**What it costs**:
- Some impeccable surface area is deliberately left unadopted. Mitigation: it is already-covered or infrastructure.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A wrongly-ruled-out slice | M | DeepSeek-B adversarially confirmed all rulings sound |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Avoids parallel conflicting systems |
| 2 | **Beyond Local Maxima?** | PASS | Considered import-all and new-mode |
| 3 | **Sufficient?** | PASS | Crosswalk refinements capture the real value |
| 4 | **Fits Goal?** | PASS | Implements the verified backlog |
| 5 | **Open Horizons?** | PASS | Preserves the five-mode structure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation
**What changes**: the backlog + ruled-out ledger in research.md; a future build applies them.
**How to roll back**: not applicable (research only).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
