---
title: "Acceptance Criteria: Phase 13: speckit-retrieval"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor speckit-retrieval audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/013-speckit-retrieval"
    last_updated_at: "2026-10-02T21:12:00Z"
    last_updated_by: "closing-session"
    recent_action: "Set every criterion to Met and wrote the closure statement"
    next_safe_action: "None; the phase is closed"
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
# Acceptance Criteria: Phase 13: speckit-retrieval

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/013-speckit-retrieval
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit speckit-retrieval` route and `doctor-speckit-retrieval.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:1` — §1 to §4, every row carrying the command that showed it; the four sources were read in full from the route block (lines 33 to 51), `doctor-speckit-retrieval.yaml` (260 lines), `doctor-speckit-presentation.txt` (202 lines) and `speckit.md` (87 lines) | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit speckit-retrieval` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:120` — 23 prompt-set lookups exit 0 or 1 in both forms, a missing index exits 2 with ENOENT, the recipe returns 15 paths with and without `--no-config`, and the cold-lookup p95 is 104.256 ms against the 200 ms budget | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md:52` — opens "What Was Built" with "Verdict: fix." and names the working lane, the six mismatches fixed and the seven findings recorded | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with "OK: route-validate — 9 routes validated, 2 warnings"; J1 parity passes across the manifest, the router table and all 3 presentation displays, and the pre-fix run is recorded at `scratch/doctor-run.log:230` | Met | - |

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

AC-001 through AC-004 are Met. The audit ran every step the target names in read-only form before any edit, and the verdict is `fix`: the doctor's central lane works on this checkout, but six claims no longer match the system, one of them pointing an operator at a regeneration mode that does not exist. The fixes were applied in the shared `/doctor:speckit` batch, and `route-validate.sh` exits 0 with parity across the route manifest, the router table and the presentation. Subsystem defects found along the way are recorded as findings in `implementation-summary.md` rather than fixed here, per the packet's decision that defects in the inspected subsystem become findings.
<!-- /ANCHOR:closure -->
