---
title: "Acceptance Criteria: Phase 14: doctor-env"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor env command acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/014-doctor-env"
    last_updated_at: "2026-10-02T16:10:29Z"
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
# Acceptance Criteria: Phase 14: doctor-env

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/014-doctor-env
**Level:** 2
**Status:** Draft
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `.skilled/commands/doctor/env.md` and `.skilled/commands/doctor/assets/doctor-env.yaml` exist and follow sk-create-command's split between a thin router and its workflow and presentation assets. | `ls` of both files; router read against sk-create-command | Unmet | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then the command reads its list of switches from `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` when it runs, so a row added there appears without editing the command. | A row added to a copy of ENV-REFERENCE.md appears in a run | Unmet | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then for each switch the operator picks, the command shows the current value, the default and what the switch does, then writes only after showing the exact lines and getting a yes. | `scratch/doctor-env-run.md` | Unmet | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then the command never asks for or writes the value of a secret such as an API key or token. It names the variable and says where it is set. | `scratch/doctor-env-run.md`; no secret value in the run log | Unmet | - |
| AC-005 | REQ-005 | Given this checkout, When the phase closes, Then `.claude/commands/doctor/env.md` is a symlink to `../../../.skilled/commands/doctor/env.md`, as the other doctor commands are, and `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` exits 0. | `ls -l .claude/commands/doctor/env.md`; mirror check exit status | Unmet | - |

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

**Closeable:** No

Open. Written when the phase closes.
<!-- /ANCHOR:closure -->
