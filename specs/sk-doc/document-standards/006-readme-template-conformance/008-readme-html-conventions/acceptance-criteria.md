---
title: "Acceptance Criteria: Phase 8: readme-html-conventions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "readme html conventions acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/008-readme-html-conventions"
    last_updated_at: "2026-11-18T07:14:13Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "None: every criterion is Met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-readme-html-conventions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: readme-html-conventions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 008-readme-html-conventions
**Level:** 2
**Status:** Complete
**Date:** 2026-11-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document with a broken fold, When `validate_document.py` runs, Then it reports the matching blocking rule | `test_each_broken_fold_shape_is_reported` and `test_an_unclosed_fold_blocks_a_readme` pass, and the unclosed probe prints `❌ INVALID` with `[fold_unclosed]`. `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py:272` | Met | - |
| AC-002 | REQ-002 | Given every tracked `.md` file, When `validate_folds` runs on each, Then no existing fold is reported | 64,445 files scanned, 0 issues. `.skilled/skills/sk-doc/shared/scripts/validate_document.py:769` | Met | - |
| AC-003 | REQ-003 | Given the four pilot files, When the validator, the voice scan and both README checkers run, Then all pass | 4 `✅ VALID`, `hard blockers: 0` on each, both checkers `pass=4 fail=0`. A bad path inside the fold still fails the reference checker. `.claude/hooks/README.md:63` | Met | - |
| AC-004 | REQ-004 | Given the README writing reference, When an author reads §3, Then it says when an alert or a fold fits, and the checklist carries one line for it | `writing-patterns.md` Alerts and Folded Tables and the last Style line of `quality-and-checklist.md`, both `✅ VALID`. `.skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md:110` | Met | - |
| AC-005 | REQ-005 | Given the pilot files, When GitHub renders them, Then the alert is an alert box and the fold holds a table | `gh api markdown` output holds `markdown-alert-warning` and a `<details>` with `<summary>All 33 entries</summary>` around a 34-row table. `.codex/SYNC.md:148` | Met | - |
| AC-006 | REQ-006 | Given the change, When the sk-doc suite runs, Then it exits 0 and the new tests pass | `all sk-doc script tests passed`, 58 PASS, exit 0. `test_structure_validation.py` `12 passed`. `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py:260` | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
