---
title: "Acceptance Criteria: Phase 33: orphan-check-unsupervised-model-server"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "orphan check unsupervised model server acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/033-orphan-check-unsupervised-model-server"
    last_updated_at: "2026-10-21T14:17:19Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked AC-001 to AC-003 Met"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-orphan-check-unsupervised-model-server"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 33: orphan-check-unsupervised-model-server

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 033-orphan-check-unsupervised-model-server
**Level:** 2
**Status:** Complete
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a model server row with parent PID 1 and an existing checkout, When the scan runs, Then it is listed as `unsupervised-model-server` | `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:224` (existing checkout, a checkout with a space, a node flag before the script); removing the branch fails two tests; live 2026-10-21: a real orphaned model server was listed as `unsupervised-model-server`, 567 MB | Met | - |
| AC-002 | REQ-002 | Given an advisor launcher and `git-live-follow` with existing paths, When the scan runs, Then neither is listed | `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:224` keeps live advisor launchers and `git-live-follow` unlisted | Met | - |
| AC-003 | REQ-003 | Given a model server whose checkout is gone, When the scan runs, Then it is listed as `stale-model-server` | `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:224` (missing checkout, also with a space in the path) stays `stale-model-server` | Met | - |

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

The fixture tests and a live orphaned model server carried the phase.
<!-- /ANCHOR:closure -->
