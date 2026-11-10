---
title: "Acceptance Criteria: Phase 30: opencode2-killer-target"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "opencode2 killer target acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/030-opencode2-killer-target"
    last_updated_at: "2026-10-25T07:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion against the tests and the passing live OpenCode 2 hop"
    next_safe_action: "None for this phase; phase 031 builds next"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-opencode2-killer-target"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 30: opencode2-killer-target

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/030-opencode2-killer-target
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
| AC-001 | REQ-001 | Given a plugin host one process below the loop's child, When the session goes idle with a pending record, Then the killer is handed the child's pid | Observed: `.opencode/plugins/tests/session-relaunch.test.cjs` "session.idle targets the loop child above the plugin host, not the host itself" uses a real numeric loop id. It failed on the old code (`scratch/gate/new-test-red.tap`: actual the host's own pid, expected its parent) and passes on the fix (`new-test-green.tap`) | Met | - |
| AC-002 | REQ-002 | Given a loop id the walk cannot place, When the session goes idle, Then the plugin hands its own pid as before | Observed: the existing "session.idle arms a matching record and spawns the killer without a transcript" test, with a non-numeric loop id, still asserts `String(process.pid)` and passes in `scratch/gate/final-relaunch.tap` | Met | - |
| AC-003 | REQ-003 | Given an OpenCode 2.1.4 sender with a goal started by the real wrapper with `--standalone`, When it hands over, Then the receiver claims and completes the note | Observed: `scratch/opencode-a-hop/relaunch.log` shows `killer-signal targetPid=42133`, then `relaunch reason=ready`. `history.txt` shows `handed-over`, `claimed` and `done`, `note-final.md` is `status: done`, `summary.txt` shows `GOALENV.marker` holding `specs/demo/001-demo` and `goal-records.txt` holds a second record for that packet created in the receiver. The two earlier runs that failed are kept in `scratch/opencode-a-hop-run1-exit130/` and `scratch/opencode-a-hop-run2-slow-exit/` | Met | - |
| AC-004 | REQ-004 | Given the changed docs, When read, Then they state the OpenCode 2 hop result and the shared-service limit | Observed: `.skilled/hooks/session-relaunch/README.md` Goal Carry-Over list, `.skilled/hooks/goal/goal-plugin.md`, the GR-O1 scenario and results row in `session-relaunch-pi-opencode.md`, and the catalog entry. `rg -n "no hop reached\|probably the server child" .skilled` finds none of the old wording | Met | - |
| AC-005 | REQ-005 | Given a runtime exit of 130, When the record was stamped by the killer, Then the wrapper relaunches; and without the stamp it prints the manual command and exits 130 | Observed: `skilled-loop.test.cjs` "wrapper relaunches after runtime exit 130 when the killer signalled the record" failed on the old wrapper (`scratch/gate/signal-tests-red.tap`) and passes now. The existing "wrapper prints the manual command after runtime exit 130" and the Pi variant still pass. `relaunch-core.test.cjs` "markSignalled stamps only the armed record it was given, and a re-arm clears it" and the stamp assertion in the killer's idle-signal test also failed first. Exit 130 on SIGTERM was measured on OpenCode 2.1.4 (`scratch/pid-probe.txt`) | Met | - |
| AC-006 | REQ-006 | Given a target that exits 6.5 s after SIGTERM, When the killer signals it, Then the record stays armed and no `killer-timeout` is logged | Observed: `killer.test.cjs` "killer keeps the record armed for a target that takes several seconds to exit" failed with the 5-second grace and passes with 15 seconds, in `scratch/gate/final-relaunch.tap` | Met | - |

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

Every row is Met. The live hop carried the packet, and four tests failed on the code before them. Left out on purpose: OpenCode 2's default shared background service, where the loop never arms, and making the wrapper add `--standalone`, which is the operator's call.
<!-- /ANCHOR:closure -->
