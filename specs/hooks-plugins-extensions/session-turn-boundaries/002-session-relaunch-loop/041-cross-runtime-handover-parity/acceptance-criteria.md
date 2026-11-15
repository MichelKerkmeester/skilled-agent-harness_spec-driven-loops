---
title: "Acceptance Criteria: Cross-runtime session handover parity for Pi, OpenCode and Codex"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cross runtime handover parity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/041-cross-runtime-handover-parity"
    last_updated_at: "2026-11-14T21:27:59Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-cross-runtime-handover-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Cross-runtime session handover parity for Pi, OpenCode and Codex

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-cross-runtime-handover-parity
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given OpenCode 2 under the loop, When its session runs `prepare`, Then the loop variables stay and the hop completes | Test "dropNestedLoop keeps the loop variables for an OpenCode 2 tool shell" failed before the fix and passes after it. Live OpenCode scored 5/5 in rounds 1 to 4, against 1/5 at baseline with `loop-nested-run` logged | Met | - |
| AC-002 | REQ-002 | Given OpenCode started inside OpenCode under the loop, When the walk runs, Then the run is nested | Test "dropNestedLoop still drops the loop for OpenCode 2 started inside OpenCode 2" passes before and after the fix | Met | - |
| AC-003 | REQ-003 | Given a Pi run still calling tools past the threshold, When a turn's tools finish, Then the held nudge is steered in and the hop completes | Test "turn_end steers the held nudge into a run that is still calling tools" failed before the fix and passes. Live Pi prepared under its real session id in fix1, against a made-up id at baseline, and scored 5/5 in fix2 and rounds 1 and 4 | Met | - |
| AC-004 | REQ-004 | Given a Pi seed with an appended advisor block, When the receiver starts, Then it gets the claim instructions with the carried Gate 3 answer | Test "reads the seed when other input extensions appended a block below it" failed before the fix and passes. Live fix1 receiver asked Gate 3, and the fix2 receiver claimed and closed with no question | Met | - |
| AC-005 | REQ-005 | Given the harness, When it runs on all four runtimes before and after the fixes, Then each run has a scorecard | `scratch/runs/` holds the baseline, fix and four final rounds with `scorecard.json` per run, summarized in `implementation-summary.md` | Met | - |
| AC-006 | REQ-006 | Given the docs that described Pi's delivery, When read, Then they describe the `turn_end` steer | `rg -n "holds the nudge for .agent_end."` over `.skilled` prints nothing | Met | - |
| AC-007 | REQ-007 | Given a claimed note, When `claim` prints it, Then the `complete` command follows the body and the goal line stays last | Test "claim names the complete command for the note it claimed after the note body" failed without the fix and passes, and "claim prints the goal packet after the note body" passes. Live Codex closed its note in rounds 3 and 4, against 0 of 2 in rounds 1 and 2 | Met | - |
| AC-008 | REQ-001 | Given the final tree, When the relaunch, plugin, flag and Pi suites, the Pi type check and the sync checks run, Then none fails | 1,560, 29 and 65 passed with 0 failed, `tsc` exit 0, both sync checks PASS | Met | - |

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

Every criterion is met by a test or a live run on the final tree.
<!-- /ANCHOR:closure -->
