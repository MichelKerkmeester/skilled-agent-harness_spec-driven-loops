---
title: "Acceptance Criteria: Phase 11: skill-budget"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor skill-budget audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/011-skill-budget"
    last_updated_at: "2026-10-02T21:04:43Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase: every criterion Met with observed evidence"
    next_safe_action: "Commit the packet files on the phase branch"
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
# Acceptance Criteria: Phase 11: skill-budget

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/011-skill-budget
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit skill-budget` route and `doctor-skill-budget.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:43` (the route omission) and `scratch/reality-check.md:51` (the script's mode 644); the inventory covers §1–§6 at HEAD `83616db9ba`, and the two gaps found are the fixes applied | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit skill-budget` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:12` (health probe, exit 0), `scratch/doctor-run.log:41` (default audit, exit 0), `scratch/doctor-run.log:899` (`--fail-over=5600`, exit 1), `scratch/doctor-run.log:977` (direct execution, exit 126), `scratch/doctor-run.log:991` (route-validate command) | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md:57` states the verdict `fix`; the evidence is `scratch/proposal.md:5` with the re-run checks | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | exit 0 in the recorded run (`scratch/doctor-run.log:991`, result at `scratch/doctor-run.log:1016`) and in the post-fix re-run: `OK: route-validate — 9 routes validated, 2 warnings`, with `PASS: I1` covering the audit script and `PASS: J1` parity | Met | - |

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

Every criterion is Met with the evidence observed in the inventory, the recorded read-only run and the re-run gates. The two mismatches the audit found are fixed; the subsystem findings are recorded in the implementation summary and left unfixed because they belong to the surfaces the doctor inspects.
<!-- /ANCHOR:closure -->
