---
title: "Acceptance Criteria: Phase 1: frontend-upgrade"
description: "The criteria this frontend upgrade must meet before the packet closes, each one met with a real command from the final gate run."
trigger_phrases:
  - "frontend upgrade acceptance criteria"
  - "sk-code-frontend visual reference criteria"
  - "phase 1 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/001-frontend-upgrade"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the acceptance evidence for every criterion"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-001-frontend-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: frontend-upgrade

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 001-frontend-upgrade
**Level:** 2
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the sk-code-frontend reference set, When the values reference is read, Then it holds items V1 to V41 in 566 lines | `validate_document.py` on `web-visual-values.md` reports VALID 0 issues | Met | - |
| AC-002 | REQ-002 | Given the sk-code-frontend reference set, When the hierarchy reference is read, Then it holds 618 lines with 40 diagnosis rows, 21 review rows and 21 UX law rows | `validate_document.py` on `web-visual-hierarchy.md` reports VALID 0 issues and the row counts are 40/40, 21/21 and 21/21 | Met | - |
| AC-003 | REQ-003 | Given the sk-code-frontend reference set, When the motion reference is read, Then it holds the motion, input, focus and feedback rules | `validate_document.py` on `web-motion-and-interaction.md` reports VALID 0 issues | Met | - |
| AC-004 | REQ-004 | Given the token file, When the move completes, Then it lives at `sk-code-frontend/assets/tokens.css` and its header cites no book | `ls .skilled/skills/sk-code/sk-code-frontend/assets/tokens.css` prints the path and the header cites no book | Met | - |
| AC-005 | REQ-005 | Given the five baseline value prompts, When they are compiled against sk-code, Then each one routes to sk-code-frontend | `compiled-route --hub sk-code` routes "what padding should this have", "what type scale should I use", "build a color palette for this app", "why does this look wrong" and "what animation duration should this dropdown use" to single sk-code-frontend | Met | - |
| AC-006 | REQ-006 | Given the three new references, When the leak grep runs, Then it finds no other skill name, no research source and no slides or print material | `rg -n 'fundamentals\|sk-design\|refactoring\|research\|specs/\|slide\|print\|em dash'` over the three files prints no line | Met | - |
| AC-007 | REQ-007 | Given a focus question, When the motion reference answers it, Then it links A5 and A8 instead of a shadow-only ring and `WEB_A11Y` catches six new phrases | `rg -n 'A5\|A8'` on `web-motion-and-interaction.md` prints both links and `rg -n 'WEB_A11Y'` on `ROUTER.md` prints the intent line | Met | - |
| AC-008 | REQ-008 | Given the two routing files, When they are read, Then `hub-router.json` carries the `code-frontend-visual` class and `graph-metadata.json` carries 88 new screen-design signals | `rg -n 'code-frontend-visual'` on `hub-router.json` prints the class and `generate-router-intent-signals --check sk-code` prints orphans=0 missing=0 PASSED | Met | - |
| AC-009 | REQ-009 | Given the five documents that cited the fundamentals assets, When the links are checked, Then every one points at the new location | `check-markdown-links` prints 0 broken markdown links across 14494 links | Met | - |
| AC-010 | REQ-010 | Given the two skill hubs, When their versions are read, Then sk-code is 3.11.0.0 and sk-code-frontend is 1.1.0.0, each with a changelog entry | `rg -n 'version: 3.11.0.0' .skilled/skills/sk-code/SKILL.md` and `rg -n 'version: 1.1.0.0' .skilled/skills/sk-code/sk-code-frontend/SKILL.md` each print one line and both changelog files exist | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with a command from the final gate run and nothing was waived, so the decision record carries no closure ADR.
<!-- /ANCHOR:closure -->
