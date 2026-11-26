---
title: "Acceptance Criteria: Phase 2: playbook-consolidation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook consolidation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/008-own-all-doctor-commands/002-playbook-consolidation"
    last_updated_at: "2026-11-24T18:45:48Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-playbook-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: playbook-consolidation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `008-own-all-doctor-commands/002-playbook-consolidation`
**Level:** 3
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the move, When `test -e .skilled/manual-testing-playbook` runs, Then the folder is absent and the skill's `doctor-commands/` holds 67 files | Observed: `old folder absent`, `ls doctor-commands \| wc -l` prints 67 | Met | - |
| AC-002 | REQ-002 | Given the merged package, When the playbook validator runs, Then it prints `PASS package=system-skilled-doctor` with 79 scenarios and `violations=0` | `scratch/final/validate-playbook.txt`: `scenarios=79 categories=3 operator=79 ... violations=0 warnings=13`, the 13 warnings the central package carried | Met | - |
| AC-003 | REQ-003 | Given every tracked Markdown file, When the link resolver runs, Then no link resolves into the old folder and none in the skill playbook is broken | Observed: `links into old folder: 0; broken links in skill playbook: 0` | Met | - |
| AC-004 | REQ-004 | Given the new paths, When the spec-kit vitest and the README parity test run, Then they pass | spec-kit vitest `1365 passed \| 11 skipped`, same as baseline; `PARITY PASS` | Met | - |
| AC-005 | REQ-005 | Given the merged root, When it is read, Then every scenario is indexed once and the test environments and command verdict rules are kept | Sections 9 and 10 carry the environments and the index; the `/doctor:overlay` row points to section 8 rather than repeating `SKD-003` | Met | - |

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

Every criterion is met with observed output from the final gate run.
<!-- /ANCHOR:closure -->
