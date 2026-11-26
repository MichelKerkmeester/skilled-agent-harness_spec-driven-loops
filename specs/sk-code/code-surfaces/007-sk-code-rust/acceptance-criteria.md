---
title: "Acceptance Criteria: Rust standards in sk-code, informed by rust-anything"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk code rust acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/007-sk-code-rust"
    last_updated_at: "2026-11-26T11:53:48Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-sk-code-rust"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Rust standards in sk-code, informed by rust-anything

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `007-sk-code-rust`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the research run settled, When `research/research.md` is read, Then it holds a ranked edit list and every edit names a target part, the change and a rust-anything `file:line` | `test -f` on `research/research.md` exited 0. `scratch/cite-check.txt` marks all 29 anchors `ok` | Met | - |
| AC-002 | REQ-002 | Given the edits landed, When the copy check runs against the reference repository, Then no line longer than 60 characters is shared, and every new rule carries a source citation | The T018 `comm` command wrote an empty `scratch/copy-check.txt`, 0 lines | Met | - |
| AC-003 | REQ-003 | Given the edits landed, When the hub's router sync check runs, Then every routed Rust path exists and every leg passes | `verify-router-sync.cjs` printed `router-sync: 5/5 checks passed` and exited 0 | Met | - |
| AC-004 | REQ-004 | Given the edits landed, When the Measured Behavior grep reruns, Then `clap`, `ratatui` and `crossterm` each count at least 1, or the research names why one stays at 0 | `grep -rl` finds `clap`, `ratatui` and `crossterm` in `build-and-organization.md`, 1 file each | Met | - |
| AC-005 | REQ-005 | Given the pre-change copies in `scratch/before/`, When each binding section is compared with its copy, Then every rule stated before is still stated after | `scratch/binding-check.txt`: 517 rule lines, 513 verbatim, 4 changed with meaning kept, 0 missing | Met | - |
| AC-006 | REQ-006 | Given the edits landed, When `SKILL.md` and the changelog folder are read, Then the version is above 2.2.3.0 and a new entry names every changed part | `rg` printed `5:version: 2.3.0.0`, and `changelog/v2.3.0.0.md` names all seven changed parts | Met | - |

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

Yes. Every criterion is met with observed evidence, and the P0 LS-006 replay in `tasks.md` passed on its fourth run after the loading fix.
<!-- /ANCHOR:closure -->
