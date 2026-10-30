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
    last_updated_at: "2026-10-30T07:20:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the converted plain fixture, When `package_skill.py --check --strict` runs, Then it prints `Result: PASS` | Command output | Unmet | - |
| AC-002 | REQ-002 | Given the converted plain fixture, When `ci-skill-root-metadata.cjs --skill <fixture>` runs, Then it exits 0 | Exit status | Unmet | - |
| AC-003 | REQ-003 | Given the plain fixture snapshot, When `sk-skill-convert.cjs preserve --snapshot <dir>` runs, Then it passes | Exit status | Unmet | - |
| AC-004 | REQ-004 | Given the dropped-line fixture, When `preserve` runs, Then it fails and names the lost line | Exit status and output | Unmet | - |
| AC-005 | REQ-005 | Given 7 approved phrases, When `plan` runs, Then it stops with `INTENT_SIGNALS_BELOW_FLOOR` | Test case | Unmet | - |
| AC-006 | REQ-006 | Given a plain skill with no `allowed-tools`, When `plan` runs, Then it proposes `[Read, Grep, Glob]`, plus `Bash` only when `scripts/` exists, and writes none without confirmation | Test case | Unmet | - |
| AC-007 | REQ-007 | Given a source outside `.skilled/skills`, When `apply --apply` runs, Then the source folder hashes are unchanged | Test case | Unmet | - |

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

The phase is planned and no criterion has been verified yet.
<!-- /ANCHOR:closure -->
