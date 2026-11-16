---
title: "Acceptance Criteria: Hand-over doc alignment, third pass"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover doc alignment 3 acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Hand-over doc alignment, third pass

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-session-handover-loop/051-handover-doc-alignment-3
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 18 literal findings, When `apply-fixes.cjs` runs from the worktree root, Then every one applies | `apply-fixes.cjs` printed `STATUS=OK apply-fixes: applied=18 skipped=0` | Met | - |
| AC-002 | REQ-001 | Given the 7 judgment findings, When each doc is read after the edit, Then it states what the code does | `README.md:335` names the five runtimes that hop on their own; `.skilled/hooks/README.md:313` names `vibe/handover-parts.mjs`; `troubleshooting.md` has its own goal-packet subsection; `.skilled/hooks/shared/README.md:27` names two default-off concerns; `ENV-REFERENCE.md` lists all eleven `SKILLED_LOOP_*` exports and marks the threshold, hop cap and age limit as read from `hook-flags.env` | Met | - |
| AC-003 | REQ-002 | Given each changed doc, When it is validated and voice-scanned against its committed copy, Then neither count rises | `validate_document.py` and `hvr_scan.py` before and after: no hard blocker count changed and no issue count rose | Met | - |
| AC-004 | REQ-001 | Given the fixed tree, When the topic's checks run, Then both pass | `doc-alignment.cjs checks` printed `STATUS=OK doc-alignment: action=checks pass=2 fail=0 cannot_run=0` | Met | - |
| AC-005 | REQ-003 | Given the change, When the diff is listed, Then it holds only the 16 docs, this packet and the parent's phase map | `git diff --stat` before the commit | Met | - |

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

Every criterion is Met. The literal fixes applied cleanly, the judgment fixes were each written against the code, and the topic's two checks pass on the fixed tree.
<!-- /ANCHOR:closure -->
