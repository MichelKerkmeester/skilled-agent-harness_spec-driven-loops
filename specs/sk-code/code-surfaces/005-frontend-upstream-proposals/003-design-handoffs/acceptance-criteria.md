---
title: "Acceptance Criteria: Phase 3: design-handoffs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "design handoffs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/005-frontend-upstream-proposals/003-design-handoffs"
    last_updated_at: "2026-11-03T08:33:55Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: design-handoffs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/code-surfaces/005-frontend-upstream-proposals/003-design-handoffs`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three hand-off files, When `rg -n "sk-design-fundamentals"` runs on each, Then each prints one hand-off line | The grep output. Evidence: one hand-off line each at `sk-code/SKILL.md:67`, `sk-code/README.md:104` and `mcp-figma/SKILL.md:233`, word for word | Met | - |
| AC-002 | REQ-002 | Given `motion-principles.md`, When it is grepped, Then `prefers-reduced-motion` and the native platform setting appear and no animation library is named | Two `rg` runs on the file. Evidence: `prefers-reduced-motion` and iOS Reduce Motion / Android Remove animations present; the library grep prints nothing, exit 1 | Met | - |
| AC-003 | REQ-003 | Given fundamentals `SKILL.md`, When it is read, Then it documents the optional profile slot and the precedence repository mode, installed tokens, design scales, profile | `rg -n -i "profile"` on the file. Evidence: `### Project Profile Slot` with the order repository mode, installed tokens, design scales, profile | Met | - |
| AC-004 | REQ-004 | Given the phase diff, When `git diff --stat` runs, Then no `ROUTER.md`, `hub-router.json` or `graph-metadata.json` appears | The diff stat. Evidence: `git diff --stat` lists only the five doc files; no untracked file outside `specs/` | Met | - |
| AC-005 | REQ-005 | Given the final state, When reach runs on sk-design and sk-code at concurrency 2, Then both match the baseline | `scratch/reach-final.txt` beside `scratch/reach-baseline.txt`. Evidence: `scratch/reach-final.txt` equals `scratch/reach-baseline.txt` | Met | - |
| AC-006 | REQ-006 | Given the profile slot text, When it is read, Then it says a profile loads only for a named project and an unknown project loads none | The slot paragraph in fundamentals `SKILL.md`. Evidence: the slot paragraph: a profile loads only when the request names that project, an unknown project loads none | Met | - |
| AC-007 | REQ-007 | Given `motion-principles.md`, When `wc -l` runs, Then it prints 250 or fewer | The line count. Evidence: `wc -l`: 204 | Met | - |

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

Every criterion is met with its evidence recorded in the table, and an independent pass in `scratch/verify-003.md` agreed.
<!-- /ANCHOR:closure -->
