---
title: "Acceptance Criteria: Phase 3: convert-legacy-skilled"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "convert legacy skilled acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled"
    last_updated_at: "2026-10-30T07:10:00Z"
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
# Acceptance Criteria: Phase 3: convert-legacy-skilled

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled
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
| AC-001 | REQ-001 | Given the pre-move fixture copy, When `apply --apply` runs, Then the new `ROUTER.md` machine section is byte-equal to the post-move file | Golden case in `sk-skill-convert.test.cjs` | Unmet | - |
| AC-002 | REQ-002 | Given the staged snapshot, When the move completes, Then `parseRouter` before deep-equals `parseRouter` after | Golden case assertion | Unmet | - |
| AC-003 | REQ-003 | Given the converted fixture, When `package_skill.py --check --strict` runs, Then it prints `Result: PASS` | Command output | Unmet | - |
| AC-004 | REQ-004 | Given a converted fixture, When `apply --apply` runs again, Then no file changes | Idempotence case: file hashes before and after are equal | Unmet | - |
| AC-005 | REQ-005 | Given a target file that already exists, When `apply --apply` runs, Then that file is byte-identical afterwards and every overwritten file has a backup under `.skilled/skills/.state/doctor-sk-skill/` | No-replace case | Unmet | - |
| AC-006 | REQ-006 | Given the dual-declaration, hub, nested-packet and `local-` prefix fixtures, When `plan` runs, Then each refuses with a named reason and writes nothing | Refusal cases | Unmet | - |
| AC-007 | REQ-007 | Given any fixture, When `plan` runs without `--apply`, Then no file changes and every overwrite is named in the output | Plan case | Unmet | - |

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
