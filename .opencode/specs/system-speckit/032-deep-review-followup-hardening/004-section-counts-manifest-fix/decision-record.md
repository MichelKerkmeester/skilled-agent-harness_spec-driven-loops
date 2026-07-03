---
title: "Decision Record: Section-Counts Manifest Fix"
description: "Architecture decision: derive per-doc expectations from template contracts; leave policy minimums untouched."
trigger_phrases:
  - "section counts decisions"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-deep-review-followup-hardening/004-section-counts-manifest-fix"
    last_updated_at: "2026-07-02T15:25:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored ADR"
    next_safe_action: "Implementer confirms decision holds during build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-004-section-counts"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Section-Counts Manifest Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Per-Doc Template Contracts As The Only Expectation Source

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 032 orchestrator (Claude) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The rule holds two derivation mechanisms side by side: plan.md's expectation comes from its own template contract (correct), spec.md's from a cross-document gate total (wrong, warns on everything). Beyond fixing the immediate bug there was a choice: keep hand-tuned constants, or make template contracts the single expectation source.

### Constraints
- Warn severity and the requirements/scenario policy minimums must not change (scope lock).
- No new node-invocation overhead per validation run.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: The template contract for each document at the declared level is the single source of expected section counts. spec.md switches to the same helper plan.md uses; no constants are introduced beyond the existing fallback pattern.

**Details**: When templates evolve, expectations follow automatically — the same property that already keeps TEMPLATE_HEADERS/ANCHORS honest.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-doc template contracts (chosen)** | Self-updating with templates; consistent with the sibling path and the header/anchor rules | Depends on helper availability (existing dependency anyway) | 9/10 |
| Hardcode correct per-level constants | No helper call | Drifts the day a template changes; the exact failure mode being fixed, one level up | 3/10 |
| Delete the spec h2 check | No false warnings ever | Loses the true-warning signal entirely | 2/10 |

**Why Chosen**: Deriving truth from the artifact that defines it is the only option that cannot re-drift.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- SECTION_COUNTS becomes trustworthy repo-wide; four packets' worth of accepted noise disappears.
- Template evolution propagates automatically.

**Negative**:
- Fixtures encoding the inflated numbers need a one-time update. Mitigation: updated in the same change, suite proves it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Helper output shape changes later | L | Same blast radius as the existing plan.md path; one shared seam |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every conforming spec in the repo warns falsely today |
| 2 | **Beyond Local Maxima?** | PASS | Constants and deletion scored |
| 3 | **Sufficient?** | PASS | Removes the false-warning class at its source |
| 4 | **Fits Goal?** | PASS | Restores signal without touching policy or severity |
| 5 | **Open Horizons?** | PASS | Template-driven expectations extend to any future doc type |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: One shell rule; fixture suite expectations.

**Rollback**: Revert the rule file; immediate effect, no rebuild.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
