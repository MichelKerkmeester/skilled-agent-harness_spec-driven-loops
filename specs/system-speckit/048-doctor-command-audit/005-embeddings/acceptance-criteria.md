---
title: "Acceptance Criteria: Phase 5: embeddings"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor embeddings audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/005-embeddings"
    last_updated_at: "2026-10-02T20:54:43Z"
    last_updated_by: "implementation"
    recent_action: "All four acceptance criteria verified Met after the embeddings route was retired"
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
# Acceptance Criteria: Phase 5: embeddings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/005-embeddings
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
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:speckit embeddings` route and `doctor-embeddings.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:15` records the existence-probe command, and the named-item table at `scratch/reality-check.md:17` marks each entry present, moved or missing with the check that showed it | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:speckit embeddings` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:17` and `scratch/doctor-run.log:31` — route-form call exits 64 ("advisor_status.workspaceRoot is required"), workflow-form call exits 75 (sandbox IPC EPERM), `advisor_status --help` exits 0, and `route-validate.sh` exits 0; no write, rebuild, install or migration was run | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md` What Was Built — "Verdict: retire", backed by `scratch/proposal.md:5` and the contract evidence at `scratch/reality-check.md:5` and `scratch/reality-check.md:52` | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `implementation-summary.md:125` — `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0 — "OK: route-validate — 9 routes validated, 2 warnings" (10 routes before the retirement) | Met | - |

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

All four rows are `Met`. The verdict is `retire`: the target asked `advisor_status` for an
embeddings contract the strict output schema does not expose, and no text-only change could make
the command return `data.embeddings`. The route, its workflow asset, its router and presentation
rows, the validator fixtures that named it and the live documentation references were removed.
After the change `route-validate.sh` exits 0 with 9 routes and 2 warnings, every doctor YAML
parses, the catalog mirror check returns `STATUS=OK` and strict packet validation passes.
<!-- /ANCHOR:closure -->
