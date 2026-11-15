---
title: "Acceptance Criteria: Phase 22: runtime-certainty-claude-pi-opencode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "runtime certainty claude pi opencode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/022-runtime-certainty-claude-pi-opencode"
    last_updated_at: "2026-10-22T07:57:02Z"
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
# Acceptance Criteria: Phase 22: runtime-certainty-claude-pi-opencode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/022-runtime-certainty-claude-pi-opencode
**Level:** 2
**Status:** Complete
**Date:** 2026-10-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `claude -p`, `pi -p` or `opencode run` started from a looped session's shell, When its fill passes the threshold or it runs prepare, Then it gets the outside-the-loop nudge and prepare prints the manual command with exit 3 | Unit tests in `relaunch-core.test.cjs` plus real-chain tests in `claude-adapters.test.cjs` and `session-relaunch-cli.test.cjs`; live: Claude c-s13b and Pi p-s13 logged `loop-nested-run`, nested runs got the outside wording; OpenCode live waived, the model refused to self-invoke | Waived | ADR-001 |
| AC-002 | REQ-002 | Given an OpenCode `task` sub-agent session, When its events and transforms reach the plugin, Then it is never nudged, never arms and never receives a claim seed | 6 `parentID` plugin tests; live o-s8: only parent ses_e9cf9565 got nudge state, child ses_e9cf8ee6 got none and saw no relaunch text | Met | - |
| AC-003 | REQ-003 | S1: Given a session inside the loop with a model flag and a spec folder, When it passes the threshold, Then the note goes open, claimed, done and the relaunch carries the model and runs resume | Live c-s1 and c-s1b (final code), p-s1, o-s1: note open, claimed, done; relaunch carried the model; spec-folder resume ran on Claude and Pi | Met | - |
| AC-004 | REQ-003 | S2: Given a session inside the loop, When its fill passes the threshold and then the threshold plus 0.05, Then exactly two nudges arrive | Adapter re-nudge tests; live c-s2 (14% then 18%), nudge state stops at level 2 on Pi (p-s1) and OpenCode (o-s8, o-s4) | Met | - |
| AC-005 | REQ-004 | S3: Given a session outside the loop that ran keep, When it compacts, Then it claims and completes its own note | Compaction-pointer tests on all three; live c-s3, p-s3, o-s3: `compact-pointer` logged and the same session claimed and completed its note | Met | - |
| AC-006 | REQ-003 | S4: Given the hop cap is reached, When the session runs prepare, Then prepare declines with hop-cap and the session continues | Live c-s4, p-s4, o-s4: one hop, then `prepare-declined reason=hop-cap`, session continued | Met | - |
| AC-007 | REQ-003 | S5: Given a stale or unarmed record at runtime exit, When the wrapper checks it, Then it declines and logs the reason | Live c-s5, p-s5, o-s5: `killer-stale`, then `decline reason=not-armed` and the manual command, LOOP-EXIT=0 | Met | - |
| AC-008 | REQ-003 | S6: Given a busy session at arm time, When the killer waits, Then it gives up within 30 seconds, notifies and disarms | Claude c-s6 met it as written (`killer-timeout`, record disarmed); Pi and OpenCode replaced by AC-017 | Superseded | ADR-002 |
| AC-009 | REQ-003 | S7: Given a live child process in the runtime's shell, When the session runs prepare, Then prepare exits 2 with the reason | CLI shell-child tests per runtime; live c-s7 (zsh), p-s7 ("Pi still has a live shell child (bash, pid 7316)"), o-s7 ("Opencode still has a live shell child (zsh, pid 45203)"); a single exec'd command is not detected, see limitations | Met | - |
| AC-010 | REQ-002 | S8: Given a Claude fork or Agent, or an OpenCode `task` sub-agent, When it works under the parent, Then it never nudges, arms, runs a lifecycle command or claims the parent's note | Live c-s8 (guard denied the sub-agent claim) and o-s8 (child session untouched); Pi has no built-in sub-agent, recorded as not applicable | Met | - |
| AC-011 | REQ-003 | S9: Given two sessions in the same repo under two wrappers, When both hop, Then each claims only its own note | Live c-s9a+b, p-s9a+b, o-s9a+b: each loop hopped and its note was claimed only by its own fresh session; ids sharing 12 and 13 characters kept separate notes after `ecd8873efa` | Met | - |
| AC-012 | REQ-003 | S10: Given `SYSTEM_SESSION_RELAUNCH_DISABLED=1`, When the fill passes the threshold, Then no nudge, arm or relaunch happens | Claude Stop-side kill-switch test; live c-s10, p-s10, o-s10: no nudge text and no state directory | Met | - |
| AC-013 | REQ-003 | S11: Given a start from a subdirectory, a git worktree, or the shell shim in a repo with a symlinked `.skilled`, When the session hops, Then the note sits under the repo root and the hop completes | Live worktree runs on all three; subdirectory starts p-s11 and o-s11 with the note under the root; shim in a linked repository (s11-shim) printed a loop id on all three | Met | - |
| AC-014 | REQ-003 | S12: Given Ctrl-C after arm and before the claim, When the operator starts again, Then no orphaned armed record remains and the new start behaves normally | Live c-s12b, p-s12, o-s12: `decline reason=no-file`, the not-claimed warning and the manual command, no record left | Met | - |
| AC-015 | REQ-005 | Given the coverage gaps the map listed, When the suites run, Then each gap has a named test that failed red first | Tests named in implementation-summary.md, Verification: every defect fix has a test that failed first; the three gap tests guard behavior that already worked, so they could not fail first, which the plan allows (a test that failed red first or already exists) | Met | - |
| AC-016 | REQ-003 | Given the final state, When every suite, the drift guards and both sync checks run, Then all pass at baseline or better and strict recursive validation prints RESULT: PASSED | implementation-summary.md Verification: relaunch 622/622, OpenCode 533/533, hook vitests 461/461, tsc exit 0, drift guards 4/4, hook sync exit 0, all on 5af08b2f1a; strict recursive validation of the 023 packet | Met | - |
| AC-017 | REQ-003 | S6 replacement: Given a session that starts a new turn after its record was armed, When the killer checks the record, Then Claude's killer times out and disarms with `killer-timeout`, and Pi and OpenCode withdraw the arm with reason `user-message` so the killer sends no signal | Pi `agent_start` tests and OpenCode user-message tests; live c-s6, p-s6 rerun (`arm-cancelled` 1 ms after the prompt), o-s6 rerun (`arm-cancelled` 0.2 s after), each followed by `killer-no-armed-record` | Met | - |

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

Every row is Met, Waived or Superseded. AC-001 is waived by ADR-001 for the OpenCode live nested run only, and AC-008 is superseded by ADR-002, which AC-017 replaces.
<!-- /ANCHOR:closure -->
