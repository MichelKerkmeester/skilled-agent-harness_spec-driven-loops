---
title: "Acceptance Criteria: Phase 6: fable-mode"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor fable-mode audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/006-fable-mode"
    last_updated_at: "2026-10-02T16:10:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: fable-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/006-fable-mode
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit fable-mode` route and `doctor-fable-mode.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:1`; each row cites `rg --files`, `ls -l`, `find`, `nl -ba` or a read-only script run | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit fable-mode` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:16` (target not found) and `scratch/doctor-run.log:19` (exit code 2) | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md` "Verdict: fix." with the verification table; `scratch/proposal.md:3` | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh`: exit 0, "OK: route-validate — 9 routes validated, 2 warnings"; recorded at `implementation-summary.md:109` | Met | - |

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

All four criteria are Met with observed evidence: the audit inventory, the recorded read-only run, the fix verdict with its evidence, and route validation exiting 0 from the final state. The one subsystem defect found during the audit — the baseline snapshot records a source corpus path that is absent from this checkout — stays recorded in `implementation-summary.md` rather than fixed here, by the phase decision that the doctor never changes the subsystem it inspects.
<!-- /ANCHOR:closure -->
