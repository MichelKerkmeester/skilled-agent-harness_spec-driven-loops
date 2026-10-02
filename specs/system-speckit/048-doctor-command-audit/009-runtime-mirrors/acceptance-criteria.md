---
title: "Acceptance Criteria: Phase 9: runtime-mirrors"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor runtime-mirrors audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/009-runtime-mirrors"
    last_updated_at: "2026-10-02T16:10:22Z"
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
# Acceptance Criteria: Phase 9: runtime-mirrors

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/009-runtime-mirrors
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit runtime-mirrors` route and `doctor-runtime-mirrors.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:22` — the inventory table marks every named route asset, checker script and path with the exact `test -e` or inspection command; the 64 hook adapter rows are listed individually from `scratch/reality-check.md:70` | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit runtime-mirrors` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:2` — the read-only checker runs; the Codex hooks refusal is at `scratch/doctor-run.log:45`; the per-path checks run from `scratch/doctor-run.log:58` | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md:55` opens What Was Built with `Verdict: fix.`; the recorded verdict and its evidence are in `scratch/proposal.md:3` | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh` exit 0 — `OK: route-validate — 9 routes validated, 2 warnings`; `PASS: J1` and `PASS: I1`, rerun after the fix and recorded at `implementation-summary.md:100` | Met | - |

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

All four criteria are Met. The verdict is `fix` and it is applied: the route invokes both Pi checkers, the Codex hooks check runs with `--check --allow-worktree`, the workflow runs the command-catalog checker and defines `STATUS=ERROR` for a refusal or an incomplete result, and the startup menu shows option 12. `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with 9 routes validated, and the command-catalog mirror check returns `STATUS=OK`. Evidence lives in `scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md` and `implementation-summary.md`. Closed 2026-10-02.
<!-- /ANCHOR:closure -->
