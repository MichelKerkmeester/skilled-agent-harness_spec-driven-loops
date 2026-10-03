---
title: "Acceptance Criteria: Phase 8: router-reach"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor router-reach audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/008-router-reach"
    last_updated_at: "2026-10-02T16:10:21Z"
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
# Acceptance Criteria: Phase 8: router-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/008-router-reach
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit router-reach` route and `doctor-router-reach.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:11` — the inventory table marks every named item present, not a path, or not declared, with the command that showed each one | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit router-reach` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:39` — the full-fleet read-only run, its exit code 1 and its summary at line 303; the advisor response-shape probe at line 11 | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md` opens its What Was Built section with `Verdict: fix.`; the recorded verdict and its evidence are in `scratch/proposal.md:5` | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh` exit 0 — `OK: route-validate — 9 routes validated, 2 warnings`, rerun after the fix; the earlier run is at `scratch/doctor-run.log:316` | Met | - |

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

All four criteria are Met. The verdict is `fix` and it is applied: the probe fails closed on a degraded advisor response, `--concurrency` reaches the script, the startup menu shows router reach, and the route validator reads that visible menu. `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with 9 routes validated, and the live probe on one hub ends `RESULT: PASSED` with advisor generation 3. Evidence lives in `scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md` and `implementation-summary.md`. Closed 2026-10-02.
<!-- /ANCHOR:closure -->
