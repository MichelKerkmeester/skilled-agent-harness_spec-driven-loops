---
title: "Acceptance Criteria: Phase 7: parent-skill"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor parent-skill audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/007-parent-skill"
    last_updated_at: "2026-10-02T21:03:04Z"
    last_updated_by: "implementation"
    recent_action: "Verified all four acceptance criteria Met and closed the packet"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: parent-skill

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/007-parent-skill
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit parent-skill` route and `doctor-parent-skill.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:5` — the result states every route asset, declared script and named reference path checked is present; the tables at lines 11-51 mark each item with the command that showed it, and no moved or missing path was observed | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit parent-skill` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:1-75` — the fleet gate ran read-only, `checked=14 passed=14 failed=0 fixed=0`, exit 0 (lines 1-19), and `parent-skill-check.cjs ".skilled/skills/system-deep-loop"` printed "OK: parent-skill-check — all hard invariants passed, 0 warnings", exit 0 (lines 20-75); no `--fix` flag was used (`scratch/reality-check.md:74`) | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md` What Was Built opens "Verdict: fix."; `scratch/proposal.md:3` states the same verdict with its evidence — the route files and scripts are present and the current audit passes, while the workflow described an older contract than the checker implements | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh` rerun after the verdict → exit 0, "OK: route-validate — 9 routes validated, 2 warnings"; the pre-batch run is recorded at `scratch/doctor-run.log:102` with the same exit code | Met | - |

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

All four rows are `Met`. The verdict is `fix`: `/doctor:speckit parent-skill` keeps its route and its two read-only checks, and its workflow invariant, phase-0 order, checker documentation and presentation row now describe the checks that actually run. The audited hub `.skilled/skills/system-deep-loop` passes every hard invariant with 0 warnings, the fleet metadata gate reports 14 roots passed and 0 failed, and `route-validate.sh` exits 0 after the change. No subsystem defect was found and no row needed a waiver.
<!-- /ANCHOR:closure -->
