---
title: "Acceptance Criteria: Phase 7: docs-and-changelogs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "docs and changelogs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/007-docs-and-changelogs"
    last_updated_at: "2026-10-30T05:21:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-docs-and-changelogs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: docs-and-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/007-docs-and-changelogs
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
| AC-001 | REQ-001 | Given the edited docs, When `rg -c "/doctor:sk-skill"` runs over `README.md`, `.skilled/commands/README.txt`, the doctor scripts README and `sk-create-skill/SKILL.md`, Then each file prints 1 or more | rg output | Unmet | - |
| AC-002 | REQ-002 | Given the touched-skills list, When `ls .skilled/changelog/<link>/v<version>.md` runs for each qualifying skill, Then every path resolves | ls output per link | Unmet | - |
| AC-003 | REQ-003 | Given each new changelog entry, When `validate_document.py <entry> --type changelog` runs, Then it exits 0 | Validator output | Unmet | - |
| AC-004 | REQ-004 | Given the new scenarios and catalog entry, When `validate_document.py` runs with `--type playbook_feature` and `--type feature_catalog`, Then each exits 0 | Validator output | Unmet | - |
| AC-005 | REQ-005 | Given all edits, When the five doc gates run, Then each exits 0 | `scratch/after.md` | Unmet | - |
| AC-006 | REQ-006 | Given `upgrading-a-skill-to-v4.md`, When a reader opens sections 1 and 5, Then they name `/doctor:sk-skill convert` for a single skill and `/create:skill-parent` for a hub | `rg -n "doctor:sk-skill convert|create:skill-parent"` output | Unmet | - |

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

No criterion is met yet, because the phase is planned and not started.
<!-- /ANCHOR:closure -->
