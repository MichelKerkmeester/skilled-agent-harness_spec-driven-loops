---
title: "Acceptance Criteria: Phase 32: opencode2-standalone-replay"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "opencode2 standalone replay acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/032-opencode2-standalone-replay"
    last_updated_at: "2026-10-25T09:21:14Z"
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
# Acceptance Criteria: Phase 32: opencode2-standalone-replay

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/032-opencode2-standalone-replay
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given OpenCode 2 help, When the wrapper launches and relaunches, Then each launch carries `--standalone` once | `skilled-loop.test.cjs` cases for the first launch, the operator-supplied flag and two relaunches; red on the old wrapper, green on the new one | Met | - |
| AC-002 | REQ-002 | Given OpenCode 2 help and a carried model, When the wrapper relaunches, Then no `-m` is passed; given an older help, Then the launch and `-m` replay are unchanged | The relaunch-drops-`-m` case and the no-`--standalone`-in-help case, green | Met | - |
| AC-003 | REQ-003 | Given a launch with `--server`, When the wrapper starts, Then nothing is added and the warning prints | The `--server` case, green | Met | - |
| AC-004 | REQ-004 | Given plain `opencode` under the wrapper and no PATH shim, When two hand-overs are armed, Then two notes are claimed | `scratch/two-hop-live/summary.txt`: two hops handed over, claimed and done, with receivers started as `opencode --standalone --prompt` | Met | - |
| AC-005 | REQ-005 | Given the docs, When searched for `--standalone`, Then none tells the operator to pass it for the loop | `rg` over the README, goal-plugin doc, playbook and previous phase summary: the remaining lines describe the wrapper adding the flag or record a past run | Met | - |

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

The wrapper tests and the two live hops carried the packet. Looping `opencode mini` was left out on purpose.
<!-- /ANCHOR:closure -->
