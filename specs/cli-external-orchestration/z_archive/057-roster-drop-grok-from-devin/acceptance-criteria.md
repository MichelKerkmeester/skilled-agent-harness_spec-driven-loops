---
title: "Acceptance Criteria: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/057-roster-drop-grok-from-devin"
    last_updated_at: "2026-08-29T17:59:26Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 057-roster-drop-grok-from-devin
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the executor allowlists, When `rg -n 'grok-4-[56]-' executor-config.ts fanout-run.cjs` is run, Then zero bare devin Grok ids appear | `rg -n 'grok-4-[56]-'` on both files returns 0 hits (confirmed post-edit) | Met | - |
| AC-002 | REQ-002 | Given `cursor-grok-4.6` entries in both runtime files, When edits are applied, Then count equals baseline 8 in each file | `rg -c 'cursor-grok-4\.6' fanout-run.cjs` = 8; `rg -c 'cursor-grok-4\.6' executor-config.ts` = 8 (both unchanged from pre-edit baseline) | Met | - |
| AC-003 | REQ-003 | Given the updated fixture, When `npx vitest run runtime/tests/unit/fanout-run.vitest.ts` runs, Then exit 0 with all tests passing | `Test Files 1 passed (1)` `Tests 112 passed (112)` `[exited with code 0]` — confirmed in session output | Met | - |
| AC-004 | REQ-004 | Given all in-scope skill docs, When `rg -n '(^|[^-])grok-4-[56]-' <skill-files>` runs, Then only changelog entries (out of scope) appear | grep post-edit: only `cli-devin/changelog/v1.1.0.0.md` and `v1.3.0.0.md` hits remain — all in-scope doc hits removed | Met | - |
| AC-005 | REQ-005 | Given the packet folder, When `validate.sh --strict` runs, Then exit 0 | `Summary: Errors: 0 Warnings: 3` `RESULT: PASSED` — exit 0 confirmed | Met | - |

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

AC-001 through AC-005 all carry `Met` status with grep counts, vitest output, and validate.sh exit-0 as evidence. The changelog files were consciously left untouched as historical record, and no cursor-grok entries were disturbed.
<!-- /ANCHOR:closure -->
