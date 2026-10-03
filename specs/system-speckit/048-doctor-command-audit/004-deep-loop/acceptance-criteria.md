---
title: "Acceptance Criteria: Phase 4: deep-loop"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor deep-loop audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/004-deep-loop"
    last_updated_at: "2026-10-02T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "All four acceptance criteria verified Met"
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
# Acceptance Criteria: Phase 4: deep-loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/004-deep-loop
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit deep-loop` route and `doctor-deep-loop.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md` — four inventory sections: the callable graph names are marked moved to direct CLI entrypoints and `validate_targets` and the read-only flag are marked missing (`scratch/reality-check.md:30,38-39`), the coverage database is marked missing while the council database is present (`:51-52`), and the stale local contract files are marked missing (`:56`), each row carrying the command or line-numbered read that showed it | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit deep-loop` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:43` — `status.cjs` exits 3 with `INPUT_VALIDATION` on an invalid loop type, stopping before any database open; the same probe for `query.cjs` and `convergence.cjs` is recorded at `scratch/doctor-run.log:50` and `scratch/doctor-run.log:57`; `scratch/doctor-run.log:64` — the council replay helper exits 1 under `--dry-run` on the missing state file; `scratch/doctor-run.log:71` — the route-validate receipt; `scratch/doctor-run.log:101` and the two entries after it record why the normal graph calls and the interactive report phase were skipped | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md` opens with `Verdict: fix.` and `scratch/proposal.md:3` records the same verdict, evidenced by the retired tool names still in the workflow, the live script mappings, the missing read-only flag and the passing route validator | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `implementation-summary.md:101` records the post-change run — `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, `OK: route-validate — 9 routes validated, 2 warnings`; `scratch/doctor-run.log:71-96` holds the same validator's pre-batch receipt, including the `I1` and `J1` PASS lines; the two warnings are informational `--scope` and `--dir` flag collisions | Met | - |

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

All four rows are `Met`. The verdict is `fix`: `/doctor:speckit deep-loop` keeps its route, and its workflow, route entry and presentation text now name the live `status.cjs`, `query.cjs` and `convergence.cjs` calls, the current runtime script interface, the real packet-local state-log path and the `council` graph scope. The post-change gates pass — `route-validate.sh` exits 0 with 9 routes and 2 informational warnings, both edited YAMLs parse as `YAML_OK`, the command catalog mirror reports `STATUS=OK`, the mutation-class guard reports `GUARD PASS`, and the route contract test passes. The proposal's read-only-flag edit was deliberately not applied because it changes the inspected subsystem; the runtime's database initialization and observability appends are recorded as findings in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
