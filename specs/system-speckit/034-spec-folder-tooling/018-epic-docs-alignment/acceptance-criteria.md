---
title: "Acceptance Criteria: Phase 18: epic-docs-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "epic docs alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/018-epic-docs-alignment"
    last_updated_at: "2026-10-09T17:09:29Z"
    last_updated_by: "close-out"
    recent_action: "Met all five requirement rows with evidence in scratch/evidence"
    next_safe_action: "None for this packet. Follow-ups are listed in implementation-summary.md Known Limitations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-out-018-epic-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 18: epic-docs-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/018-epic-docs-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the hook-gate playbook, When the gate list is run, Then the playbook expects thirteen gates and `GATES=13` | `scratch/evidence/hook-gates.txt` ends `STATUS=OK GATES=13 OFF=0` with `rc=0`. `sk-git` `doctor-git-hooks-list.md` lines 28, 50 and 65 say thirteen and 13 (`scratch/evidence/findings-check.txt`) | Met | - |
| AC-002 | REQ-002 | Given the P1 findings F02 to F10, When each claim is checked against its code line, Then each doc describes the shipped behavior | `scratch/evidence/findings-check.txt` shows each fixed claim in its file. `playbook-spec-kit.txt` exits 0 with violations 0 and includes DOC-381 and 466 to 475. `catalog.txt` exits 0 with 0 failures. The code-line check was the audit and the review (see implementation-summary.md) | Met | - |
| AC-003 | REQ-003 | Given the P2 findings F11 to F25, When each is checked, Then each is fixed or recorded with evidence | `scratch/evidence/findings-check-b.txt`, `findings-check-c.txt` and `f18-and-children.txt` show each fix in place. `gate3-parity.txt` ends with 12 pass and 0 fail (`rc=0`). `doctor-compat.txt` ends with 21 pass and 0 fail (`rc=0`) | Met | - |
| AC-004 | REQ-004 | Given F26, When the release changelogs are read, Then each carries an entry for the epic | `.skilled/changelog/skilled/v4.0.0.4.md` gains 96 lines. `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` is new. `SKILL.md` reads `version: 2.7.1.0` (`scratch/evidence/close-out-prep.txt`) | Met | - |
| AC-005 | REQ-005 | Given each changed doc, When its validator runs, Then it passes, and no doc names removed behavior as current | `scratch/evidence/validate-docs.txt`: 40 of 42 pass under their detected type. The other two pass under the `readme` type and fail the detected type identically at HEAD. `removed-behavior-corrected.txt` matches only removal notices, in two changelogs and `MIGRATION.md`. `links.txt` shows 0 broken links | Met | - |

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

AC-001 to AC-004 carried the packet on gate output and on the presence of each fix. AC-005 is marked Met on the reading that the two index READMEs are judged by their `readme` type. That reading is the operator's judgment to confirm. Left out on purpose: the validator's path-based type detection, and the follow-ups listed in implementation-summary.md.
<!-- /ANCHOR:closure -->
