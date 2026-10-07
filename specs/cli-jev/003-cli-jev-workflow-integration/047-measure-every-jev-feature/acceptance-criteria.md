---
title: "Acceptance Criteria: Phase 47: measure-every-jev-feature"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "measure every jev feature acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/047-measure-every-jev-feature"
    last_updated_at: "2026-10-02T18:40:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 47: measure-every-jev-feature

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature
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
| AC-001 | REQ-001 | Given the 15 unmeasured features, When each scorer runs on confirmed labels, Then `scratch/evidence/results.md` holds 15 result lines, each a verbatim `verdict` or `stop:` line from that feature's scorer | `scratch/evidence/results.md`: 15 rows Done, 0 Pending | Met | - |
| AC-002 | REQ-001 | Given a `stop:` result, When it is recorded, Then it is a zero-call bound printed from confirmed labels, never a missing-label stop such as `fewer than N labeled` | `scratch/evidence/results.md`: no row holds a `fewer than N labeled` stop. 021's bound prints `no headroom` | Met | - |
| AC-003 | REQ-002 | Given any label used by a run, When it is recorded, Then its labeler is the operator or the delegated arbiter of 042's ADR-001 | `scratch/evidence/results.md` Labeler column: operator-delegated Opus 5.5 medium on every row | Met | - |
| AC-004 | REQ-003 | Given a live run, When it starts, Then `jev auth status --provider official` exits 0 and the run uses `--jev --out` | `scratch/evidence/results.md` Command column and its header: auth exit 0, jev 0.6.2, jev-1.13.0 | Met | - |
| AC-005 | REQ-004 | Given a fixture-filled gate, When its result is recorded, Then the line names its corpus as fixture | `scratch/evidence/results.md` Corpus column: 9 real, 6 fixture | Met | - |
| AC-006 | REQ-005 | Given a scorer fix, When it lands, Then its suite passes and the cross-family review leaves no open P0 or P1 | `goal.md` log: suites 97 of 97, four review rounds, every P0 and P1 fixed but one latent P0 verified to touch no real citation | Met | - |
| AC-007 | REQ-006 | Given all results, When the overview is resent, Then it lists 22 measured features plus 023 as removed, each with its default state | The overview resent in chat on 2026-10-02 | Met | - |

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

Every one of the 15 features has a recorded result (AC-001 to AC-005), the one scorer fix passed its suites and four review rounds (AC-006), and the overview was resent (AC-007). One latent review finding in the 027 fix is recorded with evidence in `goal.md` rather than fixed.
<!-- /ANCHOR:closure -->
