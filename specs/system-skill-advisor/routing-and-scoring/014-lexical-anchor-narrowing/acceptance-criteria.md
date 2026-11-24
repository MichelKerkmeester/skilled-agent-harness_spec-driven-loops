---
title: "Acceptance Criteria: Narrow the advisor shared lexical anchor"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lexical anchor narrowing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing"
    last_updated_at: "2026-11-24T13:30:00Z"
    last_updated_by: "claude"
    recent_action: "Measured three candidate rules and stopped on moved pins"
    next_safe_action: "Find a rule that keeps the typed /create:* rows on sk-doc before landing any anchor change"
    blockers:
      - "Every measured candidate moved pinned command and doctor slice rows"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-lexical-anchor-narrowing"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Narrow the advisor shared lexical anchor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 014-lexical-anchor-narrowing
**Level:** 2
**Status:** Blocked
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five probe prompts, When the advisor scores them, Then no unnamed skill reaches 0.8 and sk-prompt and system-skilled-doctor keep their lift | Candidates A and C pass in-process; not landed | Unmet | - |
| AC-002 | REQ-002 | Given a landed rule, When the ratchet and the full suite run, Then no pinned row moves without operator approval | Every candidate moved command and doctor rows | Unmet | - |
| AC-003 | REQ-003 | Given a landed rule, When the browser hub replay runs, Then only MBU-PB-04 fails | Not run; nothing landed | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
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

**Closeable:** No

No rule landed. The packet stays open, blocked on a rule that keeps the typed command rows (Q012).
<!-- /ANCHOR:closure -->
