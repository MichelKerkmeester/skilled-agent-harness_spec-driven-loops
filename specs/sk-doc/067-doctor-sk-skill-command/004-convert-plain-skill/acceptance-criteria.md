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
    last_updated_at: "2026-10-30T10:45:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Re-pointed every Met row at evidence that holds after the review fixes"
    next_safe_action: "Close the packet; the converter wiring and its evidence are current"
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
| AC-001 | REQ-001 | Given the converted plain fixture, When `package_skill.py --check --strict` runs, Then it prints `Result: PASS` | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:871` asserts `Result: PASS` in the apply result and `:937` asserts the separate `package_skill.py --check --strict` spawn exits 0; the gate is spawned at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:1111` and `:1114` refuses anything but `Result: PASS` | Met | - |
| AC-002 | REQ-002 | Given the converted plain fixture, When `ci-skill-root-metadata.cjs --skill <fixture>` runs, Then it exits 0 | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:946` asserts exit 0 for the `--skill brindle-lantern` run; the step lives at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:1092` through `:1095` | Met | - |
| AC-003 | REQ-003 | Given the plain fixture snapshot, When `sk-skill-convert.cjs preserve --snapshot <dir>` runs, Then it passes | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:963` and `:964` assert exit 0 and `Preservation PASS`; the check is called at `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:1077` | Met | - |
| AC-004 | REQ-004 | Given the dropped-line fixture, When `preserve` runs, Then it fails and names the lost line | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:1043` (apply) and `:1077` (preserve) assert exit 1 naming `Read the field notes before choosing a review path`; the apply guard is `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:1078` and the subcommand guard `:1167` | Met | - |
| AC-005 | REQ-005 | Given 7 approved phrases, When `plan` runs, Then it stops with `INTENT_SIGNALS_BELOW_FLOOR` | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:804` asserts the refusal; `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:362` raises it before any step is planned | Met | - |
| AC-006 | REQ-006 | Given a plain skill with no `allowed-tools`, When `plan` runs, Then it proposes `[Read, Grep, Glob]`, plus `Bash` only when `scripts/` exists, and writes none without confirmation | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:810` and `:831` assert both proposals, `:822` asserts apply refuses without an approved list; `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:365` and `:366` build the proposal | Met | - |
| AC-007 | REQ-007 | Given a source outside `.skilled/skills`, When `apply --apply` runs, Then the source folder hashes are unchanged | `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:882` compares SHA-256 tree hashes before and after apply; the copy-not-move stage is `.skilled/commands/doctor/scripts/sk-skill-convert.cjs:1050`, guarded by the symlink refusal at `:1046` | Met | - |

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

All seven criteria are met. Every row names the test line and the converter line that carry it after the review fixes, and `tasks.md` records the same command set in its verification checklists.
<!-- /ANCHOR:closure -->
