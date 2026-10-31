---
title: "Acceptance Criteria: AGENTS.md delivery prefix"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md delivery prefix acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/003-agents-md-delivery-prefix"
    last_updated_at: "2026-10-04T15:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: AGENTS.md delivery prefix

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/016-repo-rule-advisor-surfacing/003-agents-md-delivery-prefix
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the restructured `AGENTS.md`, When the guard runs, Then every must-carry anchor ends before byte 16,384 | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:79` anchor list; `node check-rule-copies.js` exit 0, last anchor ends at byte 16,345 | Met | - |
| AC-002 | REQ-002 | Given the diff, When each moved or condensed clause is compared, Then none changes what it requires | `implementation-summary.md:65` moved-and-condensed table; line-set diff shows only moves, the shortened copy, two pointers and table whitespace | Met | - |
| AC-003 | REQ-003 | Given a fixture with an anchor past byte 16,384, When the guard runs, Then it exits 1 and names the anchor | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:102` cases anchor_past_cut and names_anchor PASS | Met | - |
| AC-004 | REQ-004 | Given a fixture over 32,768 bytes, When the guard runs, Then it exits 1 | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:110` cases over_ceiling and names_ceiling PASS | Met | - |
| AC-005 | REQ-005 | Given the change, When the Gate 1 sync check and the invariance suites run, Then they pass | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:51` check exit 0; vitest gate1-pointer-sync and workflow-invariance, 6 tests passed | Met | - |
| AC-006 | SC-002 | Given a live Devin session, When asked to quote the §8 load line, Then it quotes it verbatim | `AGENTS.md:160` quoted verbatim by a live Devin swe-2-max probe on 2026-10-04 | Met | - |

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

All six criteria are Met. The layout changed from the planned move-to-§1 to placing §4 before §3, by operator decision recorded in `plan.md` ADR-001. The rest of §3 past Blast-Radius Management stays outside Devin's cut, which was accepted.
<!-- /ANCHOR:closure -->
