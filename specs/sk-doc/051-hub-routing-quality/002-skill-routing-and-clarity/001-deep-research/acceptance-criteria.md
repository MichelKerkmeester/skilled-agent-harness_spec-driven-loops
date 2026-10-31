---
title: "Acceptance Criteria: Phase 1: deep research on skill routing shape and clarity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skill routing deep research acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/001-deep-research"
    last_updated_at: "2026-10-28T06:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked every criterion with the evidence observed"
    next_safe_action: "Start phase 002"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: deep research on skill routing shape and clarity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/001-deep-research`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the auto workflow with `--stop-policy max-iterations`, When the fan-out finishes, Then the lineage state logs hold ten iteration records | `grep -c '"type":"iteration"'` prints 5 for `research/lineages/pi/deep-research-state.jsonl` and 5 for `research/lineages/devin/deep-research-state.jsonl` | Met | - |
| AC-002 | REQ-002 | Given the merged synthesis, When it is read, Then it answers questions (a) to (e) with `path:line` citations | `research/research.md` §5 (a), §6 (b), §7 (c), §8 (d), §9 (e) | Met | - |
| AC-003 | REQ-003 | Given each finding used in the plan, When the orchestrator re-reads its cited line, Then the finding is marked confirmed or unconfirmed | Every finding in `research/research.md` §5 to §10 carries a Confirmed or Unconfirmed mark | Met | - |
| AC-004 | REQ-004 | Given the three skill types, When the verdict is read, Then each type has its own verdict and JSON-only names the checks it breaks | `research/research.md` §7 and the Eliminated Alternatives table | Met | - |
| AC-005 | REQ-005 | Given a readability finding, When it is read, Then it quotes the passage it judges | `research/research.md` §8 | Met | - |

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

**Closeable:** Yes

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
