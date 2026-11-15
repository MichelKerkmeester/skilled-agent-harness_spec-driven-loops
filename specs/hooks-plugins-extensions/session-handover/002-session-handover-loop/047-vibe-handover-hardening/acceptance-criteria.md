---
title: "Acceptance Criteria: Phase 47: vibe-handover-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vibe handover hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/047-vibe-handover-hardening"
    last_updated_at: "2026-11-15T17:27:55Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-vibe-handover-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 47: vibe-handover-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `047-vibe-handover-hardening`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `VIBE_HOME` holding a session folder with a `journal/` for id S, When `prepare --runtime vibe --session S` runs in a loop, Then it prints the stop-now line, and with an id that has no folder it prints the manual line | `session-handover-cli.test.cjs` test `a vibe session with a session folder is told to stop, a made-up id is told to end by hand` passes and fails with the folder check removed; live `hard1-vibe` sender printed `handoff prepared; stop now and end this turn` | Met | - |
| AC-002 | REQ-002 | Given an armed record and a slow earlier turn-start part, When a Vibe `pre_agent` operator prompt arrives, Then the record is disarmed before that part resolves | `turn-start.test.mjs` asserts the withdraw step is `PARTS[0]`, and `vibe-adapters.test.cjs` shows that step alone disarms the record; both fail with the change reverted | Met | - |
| AC-003 | REQ-003 | Given the 1009-test baseline, When `node --test .skilled/hooks/session-handover/tests/*.test.cjs` and the session-lifecycle tests run, Then 0 fail and no existing expectation was edited for a non-Vibe runtime | `tests 1025 pass 1025 fail 0` (baseline 1009) and `tests 37 pass 37 fail 0` (baseline 34); the only edited expectations are Vibe tests (the subagent test, two killer-target assertions) | Met | - |
| AC-004 | REQ-004 | Given a killer watching a Vibe journal folder, When a second segment is written or the first is deleted, Then activity in any remaining segment keeps the killer from signalling and the folder never reads as missing (wording corrected before closure: an active folder reaches the configured timeout by design) | `killer.test.cjs` tests `killer times out on a journal folder whose newest segment keeps changing` and `killer keeps watching the remaining segment after the first one is removed`: activity in any segment keeps the killer from signalling until its configured timeout, and a removed segment never reads as a missing transcript; both fail with the folder branch removed | Met | - |
| AC-005 | REQ-005 | Given a spent nudge level or a pending or withdrawn record, When the Vibe compaction part runs, Then the level resets, no claim pointer prints while pending, and the stale-note text prints after a withdraw | three `compaction-context.test.mjs` tests; each of the reset, pending and withdrawn lines fails its test when removed | Met | - |
| AC-006 | REQ-006 | Given a `pre_agent` hook that saw session S in loop L, When `prepare --runtime vibe` runs without `--session` in loop L, Then the record names S | `session-id` and `prepare on Vibe without --session` CLI tests, and the adapter record test; each fails with its line reverted | Met | - |
| AC-007 | REQ-007 | Given payloads with `parent_session_id` set, When `pre_agent` and `post_agent` run, Then they act, and When `post_tool` runs, Then it stays silent | `a forked main session still nudges at turn start and arms at turn end` and `a subagent post_tool payload never nudges`; each fails with the old or no subagent check | Met | - |
| AC-008 | REQ-008 | Given one state file, When two nudge decisions run concurrently, Then exactly one returns nudge text | `a nudge another hook is delivering stays quiet` and `a hook whose decision predates another hook's nudge decides again under the claim` simulate the race; each fails with its check removed | Met | - |
| AC-009 | REQ-009 | Given each failure branch of the Vibe turn-end arm, When it returns, Then the record carries a deferred mark, the reason is logged and the next operator `pre_agent` withdraws it | all five failure branches call `markParked` (grep of `handover-parts.mjs`); the target-pid, missing transcript path and empty journal branches are exercised by tests that fail with the mark removed; the refusal reason is logged as `stop-arm-refused` | Met | - |
| AC-010 | REQ-010 | Given `MISTRAL_API_KEY` set, When `skilled-loop vibe` starts, Then stderr has one warning line and the runtime still launches | wrapper test `a Vibe loop warns once when MISTRAL_API_KEY is exported and still starts` covers key set, unset, Claude and OIDC mode; fails with the runtime check or the OIDC check removed | Met | - |
| AC-011 | REQ-011 | Given the operator's Vibe plan key and no exported `MISTRAL_API_KEY`, When a live session through `skilled-loop vibe` hands over, Then `relaunch.log` shows `prepare`, `killer-signal` and `relaunch reason=ready` under 20 s apart and the receiver claims the note | `scratch/runs/hard1-vibe` and `hard2-vibe`: `prepare`, `killer-signal`, `relaunch reason=ready`, prepare to signal 5.9 s and 5.2 s, note `done`, `score.cjs` 5/5 both times | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with the evidence named in its row.
<!-- /ANCHOR:closure -->
