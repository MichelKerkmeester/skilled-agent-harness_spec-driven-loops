---
title: "Acceptance Criteria: Phase 29: relaunch-evidence-gaps-and-playbook-drift"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relaunch evidence gaps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/029-relaunch-evidence-gaps-and-playbook-drift"
    last_updated_at: "2026-10-24T23:10:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Closed all five criteria with evidence from the live runs"
    next_safe_action: "Hand the nudge-floor follow-up to the owner of the relaunch hook code"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-29-relaunch-evidence-gaps-and-playbook-drift"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 29: relaunch-evidence-gaps-and-playbook-drift

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/029-relaunch-evidence-gaps-and-playbook-drift
**Level:** 2
**Status:** Complete
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the Codex withdraw scenario, When rerun with a long enough wait, Then the receiver reply is in a saved transcript | A transcript under `scratch/` with the wait used. Met: `scratch/codex-cx2/run-1/pane-final.txt` (reply after 64 s) and `run-2/pane-final.txt` (reply after 31 s), polled up to a 300 s limit, `summary.txt` in each holds the timings, the record, the log lines and the history lines. Both replies quote the withdraw notice and the extra nudge word for word and end with `STAYING`; `pane-after-quit.txt` shows the wrapper's single withdrawn warning and no claim command | Met | - |
| AC-002 | REQ-002 | Given the Claude extra-nudge scenario, When rerun several times, Then the producer is named with a failing-first test or the first-attempt rate is recorded | A rate table or a test that fails before the fix. Met by the rate table: the first tool call after the withdraw delivered the extra nudge in 0 of 7 runs with `echo staying` (`scratch/claude-cl3/fast-rate-table.json`) and in 3 of 3 runs with `sleep 3; echo staying` (`scratch/claude-cl3-slow/slow-rate-table.json`). The cause is a read race: Claude writes its transcript about 0.2 s after an entry's timestamp, and 38 of 57 `PostToolUse` reads missed an entry younger than 0.18 s (`scratch/claude-cl3/staleness-report.txt`, `scratch/claude-cl3-slow/staleness-report.txt`). No test or fix was added, since the brief bars edits to the hook code; the follow-up is in `implementation-summary.md` | Met | - |
| AC-003 | REQ-003 | Given the two playbook lines, When compared with a run, Then each states what the run printed and the command that prints it | The command output and the corrected line. Met: `scratch/playbook-drift/import-smoke.txt` printed `object`, exit 0, twice, and `session-relaunch-pi-opencode.md` now says `object` in three places with the same command; `scratch/playbook-drift/shim-run-1.tap`, `shim-run-2.tap` and `shim-run-3-loop-vars-unset.tap` each report `# tests 18`, 18 pass, and the three playbooks that said 16 now say 18 | Met | - |
| AC-004 | REQ-004 | Given the Pi suites, When run, Then totals and the date are recorded | The suite output. Met: `scratch/pi/vitest-baseline.txt` (2026-10-24, 1 file, 52 of 52 tests, exit 0) and `scratch/pi/vitest-final.txt` (same totals). The Pi extension load smoke is SKIP, not a pass: the provider answered `402 ... daily pacing allowance on the pro plan ... billing_error`, exit 1, in `scratch/pi/extension-smoke.txt` | Met | - |
| AC-005 | REQ-005 | Given the changed playbooks, When validated, Then the sk-doc validators report no issue | Validator output for each file. Met: `validate_document.py --type reference` printed `VALID` with `Total issues: 0` for each of the three playbooks, and `validate-playbook-package.cjs --package system-spec-kit` printed `PASS ... violations=0 warnings=1` (`scratch/playbook-drift/package-validator.txt`); the one warning is a `PROMPT_UNSYNCED` in `ux-hooks/comment-hygiene-checker-baseline.md`, a file this phase did not touch | Met | - |

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

All five rows are Met with observed evidence. The Pi extension load smoke is recorded as SKIP with the provider's exact error and the Pi suite baseline stands without it. The Claude retry is explained and measured but not fixed, by the build brief's bar on hook code edits, and the follow-up is named in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
