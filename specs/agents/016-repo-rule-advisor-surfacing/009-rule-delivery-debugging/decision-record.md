---
title: "Decision Record: Rule delivery debugging"
description: "Records the operator's choice to adopt Gate 6 without the 006 and 007 live windows."
trigger_phrases:
  - "gate 6 adoption without windows"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Rule delivery debugging

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt Gate 6 without the live windows

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-05 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-007 and the parent goal's D2 required Gate 6 to land after the 006, 007 and 008 changes had each been measured live for seven days. On 2026-10-05 the operator ended further test rounds for the parent packet and approved applying the final recommendations, which put Gate 6 first.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: adopt Gate 6 on 2026-10-05, in the same change set as the 007 wording and the 010 phrases, and supersede AC-007.

**How it works**: the arm landed verbatim, with two sentences cut elsewhere to keep Devin's prefix (`results/adoption-ledger.md`). `check-rule-copies.js` guards the new gate inside the 16,384-byte cut.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adopt now, together** | The largest measured effect goes live today | No live window isolates any one change | 7/10 |
| Keep D2's order and windows | Each change measured on its own | At least three weeks, and the operator ended the test rounds | 3/10 |
| Do not adopt | No change to `AGENTS.md` | Discards a result two runs agree on | 2/10 |

**Why this one**: two runs agree on the effect, -22.6 and -37.8 points on reply-rule misses, with no Gate 5 miss in either arm.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later live measurement cannot attribute a change to Gate 6 alone | M | `measure-rule-compliance.py` still splits replies by rule version, which separates the 006 rewrites from this change set |
| Devin's prefix margin is 25 bytes | L | `check-rule-copies.js` fails CI before any clause slips past the cut |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**How to roll back**: restore `AGENTS.md` and `check-rule-copies.js` from the parent of the adoption commit, then run `check-rule-copies.js`. The two files must move together, or the guard looks for an anchor the file no longer has.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
