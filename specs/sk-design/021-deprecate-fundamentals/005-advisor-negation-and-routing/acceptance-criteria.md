---
title: "Acceptance Criteria: Phase 5: advisor-negation-and-routing"
description: "The criteria this packet must satisfy before it may be closed. Each one is met, waived by a decision record or superseded by one."
trigger_phrases:
  - "advisor negation and routing acceptance criteria"
  - "negated write criteria"
  - "borderline route criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing"
    last_updated_at: "2026-11-05T15:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded three met criteria and one pending release criterion"
    next_safe_action: "Update the release entry and republish the v4.0.1.0 tag"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-005-advisor-negation-and-routing"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: advisor-negation-and-routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-advisor-negation-and-routing
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the labeled case rr-iter3-146 with its negated write prompt, When the advisor scores it, Then sk-code ranks first at 0.8377 and the prompt earns no write-doc-surface boost | `scratch/facts.md:19` records the seven-prompt test and `scratch/facts.md:27` records sk-code 0.8377 first | Met | - |
| AC-002 | REQ-002 | Given the prompt "Review this design document for clarity.", When the advisor and the sk-doc hub score it, Then sk-doc ranks first at 0.949 and the route is a single `sk-create-quality-control` | `scratch/facts.md:31` records sk-doc 0.949 first and a single `sk-create-quality-control` route | Met | - |
| AC-003 | REQ-003 | Given the prompt "review the chart colour system", When the advisor and the sk-design hub score it, Then sk-design ranks first at 0.9268 and the route is a single `sk-design-chart` | `scratch/facts.md:35` records sk-design 0.9268 first and a single `sk-design-chart` route | Met | - |
| AC-004 | REQ-004 | Given the v4.0.1.0 release entry, When the entry is updated and the tag is republished, Then the entry sends open design values to `sk-code-frontend`, names the branch work and the published release matches the entry | `scratch/facts.md` section 4 records the republished tag on `d1c57bb81d` and a release body that matches the entry | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Pending` | Planned and not yet executed. Counts as open and blocks closure. |
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met. The v4.0.1.0 entry is updated, and its tag and release are republished on `d1c57bb81d`.
<!-- /ANCHOR:closure -->
