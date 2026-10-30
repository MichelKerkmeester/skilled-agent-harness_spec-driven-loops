---
title: "Acceptance Criteria: Phase 4: convert-plain-skill"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "convert plain skill acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/004-convert-plain-skill"
    last_updated_at: "2026-10-30T09:05:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Finished the converter, its fixtures and the recorded evidence"
    next_safe_action: "Proceed with phase 005 integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: convert-plain-skill

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/004-convert-plain-skill
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the converted plain fixture, When `package_skill.py --check --strict` runs, Then it prints `Result: PASS` | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:773` asserts `Result: PASS` on the temp-copy integration run; the gate itself is spawned at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:895` | Met | - |
| AC-002 | REQ-002 | Given the converted plain fixture, When `ci-skill-root-metadata.cjs --skill <fixture>` runs, Then it exits 0 | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:776` asserts exit 0 and the suite printed `OK [S] brindle-lantern`; the planned line lives at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:389` | Met | - |
| AC-003 | REQ-003 | Given the plain fixture snapshot, When `sk-skill-convert.cjs preserve --snapshot <dir>` runs, Then it passes | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:791` asserts `Preservation PASS`; the check is `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:655` | Met | - |
| AC-004 | REQ-004 | Given the dropped-line fixture, When `preserve` runs, Then it fails and names the lost line | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:898` asserts exit 1 naming `Read the field notes before choosing a review path`; the apply guard sits at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:863` and the subcommand guard at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:941` | Met | - |
| AC-005 | REQ-005 | Given 7 approved phrases, When `plan` runs, Then it stops with `INTENT_SIGNALS_BELOW_FLOOR` | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:676` asserts the refusal and `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:327` raises it before any step is planned | Met | - |
| AC-006 | REQ-006 | Given a plain skill with no `allowed-tools`, When `plan` runs, Then it proposes `[Read, Grep, Glob]`, plus `Bash` only when `scripts/` exists, and writes none without confirmation | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:687` and `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:708` assert both proposals; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:699` asserts apply refuses without `--allowed-tool`; the proposal is `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:330` | Met | - |
| AC-007 | REQ-007 | Given a source outside `.skilled/skills`, When `apply --apply` runs, Then the source folder hashes are unchanged | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:748` compares SHA-256 tree hashes before and after apply; the copy-not-move stage is `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:841` | Met | - |

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

All seven criteria are met. Every row names the test line and the converter line that carry it, and `tasks.md` records the same command set in its verification checklists.
<!-- /ANCHOR:closure -->
