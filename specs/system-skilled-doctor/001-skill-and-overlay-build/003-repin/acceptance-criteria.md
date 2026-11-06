---
title: "Acceptance Criteria: Phase 3: repin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "repin acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-repin"
    last_updated_at: "2026-11-06T07:23:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-repin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: repin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-doctor/001-skill-and-overlay-build/003-repin
**Level:** 3
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-006 | Given a live repin, When it starts writing, Then every touched path is already backed up | `a live repin backs up every touched path before its first write, then copies, applies and passes` failed on phase 002's engine and passes | Met | - |
| AC-002 | REQ-006 | Given a repin that failed after its backup, When `--rollback <run>` runs, Then each file's bytes match their recorded hash and `status` passes | `a failure after the backup names the run, and --rollback restores the tree byte for byte so status passes` failed first and passes | Met | - |
| AC-003 | REQ-007 | Given an unowned file edited in place, When repin runs, Then it refuses, names the path and writes nothing | `an unowned file edited in place refuses the repin, names the path and writes nothing` failed first and passes | Met | - |
| AC-004 | REQ-010 | Given `repin --stage <dir>`, When it runs, Then it reports blocked overlays and overlays that equal upstream, and the live tree digest is unchanged | `repin --stage builds the re-pinned tree in a copy, reports both groups and leaves the live tree untouched` failed first and passes | Met | - |
| AC-005 | REQ-007 | Given a copy of Barter's tree, When a stage to `c06b7cfc14` runs, Then it refuses before any write and the copy is unchanged | Exit 2 naming 19 unowned paths. The copy's 26,004-entry digest matched before and after | Met | - |
| AC-006 | REQ-006 | Given the new route, When the doctor gate runs, Then `/doctor:overlay repin` passes its contract and the suite passes with nothing skipped | `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` printed `fail 0` and `skipped 0`; `route-validate.sh` printed `31 routes validated` | Met | - |

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

Every criterion is `Met` with the test or command output named in its row. The red runs are in the session's red-then-green log for this phase.
<!-- /ANCHOR:closure -->
