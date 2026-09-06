---
title: "Decision Record: Retirement Read-Path Closure"
description: "Why the deleted evidence rule gets no successor: the document that replaced it already blocks, and the rule that was removed never did."
trigger_phrases:
  - "evidence rule successor"
  - "advisory rule deleted"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/013-retirement-read-path-closure"
    last_updated_at: "2026-08-30T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the evidence-checking decision the rule deletion left open"
    next_safe_action: "Close the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-retirement-read-path-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Retirement Read-Path Closure

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The deleted evidence rule gets no successor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-30 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-001-context -->
### Context

A review found the evidence rule exempting every fix-verification item: its id filter expected
three digits after the prefix, and the shipped template defines seven items whose ids carry a
family segment instead. Ids with a trailing colon and four-digit ids were exempt for the same
reason.

Before that could be fixed, a concurrent packet deleted the rule outright, together with eight
others, on the grounds that they were advisory and nothing read them. That leaves a question
rather than a defect: nothing now holds verification items to any evidence standard.

### Constraints

- The rule that was removed never blocked anything. Restoring the same behaviour would restore an advisory nobody consumed.
- The acceptance-criteria document is required from Level 2 and its closure rule does block.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: No successor. The closure gate already carries the weight the deleted rule was
supposed to.

**How it works**: A packet at Level 2 or above cannot close while any acceptance criterion is
unmet, and each criterion's verification cell has to name evidence that was observed. That is a
blocking check on the same property, applied to the document that decides closure rather than to
a checklist that decided nothing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No successor; rely on the closure gate** | One blocking check instead of one blocking and one advisory | Level 1 packets have no closure gate and so no evidence check | 8/10 |
| Reinstate the rule with a wider id filter | Covers Level 1 too | Restores an advisory that was deleted precisely because nothing read it | 3/10 |
| Add a blocking evidence rule | Real enforcement at every level | Would fail a large number of existing packets at once, for a property the closure gate already covers where it matters | 4/10 |

**Why this one**: The deletion was correct and the reasoning behind it applies to any
like-for-like replacement. What the closure gate does not cover - Level 1 packets - is the tier
that deliberately carries the least ceremony.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One place decides whether evidence is sufficient, and it blocks.

**What it costs**:
- Level 1 packets have no evidence check at all. Mitigation: Level 1 is the baseline tier by design, and the level scorer routes anything with real risk higher.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A Level 1 packet ships unverified claims | L | The level recommendation is deterministic, and understating a level is visible in review |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------------|----------|
| 1 | **Necessary?** | PASS | The deletion left an unanswered question about a real property |
| 2 | **Beyond Local Maxima?** | PASS | Reinstating and strengthening were both considered |
| 3 | **Sufficient?** | PASS | The closure gate already blocks on the same property |
| 4 | **Fits Goal?** | PASS | The packet exists to close read-paths the retirement left |
| 5 | **Open Horizons?** | PASS | A blocking rule stays available if Level 1 ever needs one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Nothing in code. The requirement is satisfied by recording the decision.

**How to roll back**: Delete this file and reopen the requirement.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
