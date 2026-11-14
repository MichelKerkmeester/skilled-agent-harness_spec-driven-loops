---
title: "Acceptance Criteria: Phase 4: wrapper-change-notice"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "wrapper change notice acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice"
    last_updated_at: "2026-11-14T06:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved test runs, the commit and the suite run"
    next_safe_action: "None. The code is committed and the operator decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-wrapper-change-notice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: wrapper-change-notice

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-wrapper-change-notice
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
| AC-001 | REQ-001 | Given a wrapper file that changed during the first launch, When the loop hops, Then stderr holds exactly one line starting `note: skilled-loop changed on disk` that names the restart, and the receiver still launches | `scratch/red.txt` shows the test failing before the edit with `0 !== 1`, and `scratch/green.txt` shows it passing after. The test asserts one notice line, a match on `restart the wrapper` and two launch records. Cited: `scratch/red.txt:2`, `scratch/red.txt:20`, `scratch/green.txt:2`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:295` | Met | - |
| AC-002 | REQ-002 | Given a wrapper file that did not change, When the loop hops, Then stderr holds no `changed on disk` text | The test passes before and after the edit, because it guards behaviour that already held. Cited: `scratch/red.txt:3`, `scratch/green.txt:3`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:314` | Met | - |
| AC-003 | REQ-003 | Given the change commit, When it is inspected, Then it adds no module and no file, and touches no hook source or record key | `git show --stat 89e246760e` lists four files, the wrapper, the README, the harness and the wrapper test file, and `git show 89e246760e \| rg -c '^new file'` prints nothing with exit 1. Observed 2026-11-14. Cited: `.skilled/bin/skilled-loop:34` | Met | - |
| AC-004 | REQ-001 | Given the edited wrapper, When the source is read, Then the checksum is taken before the loop and compared at the end of the hop branch | `rg -n 'wrapper_checksum\|started_wrapper_checksum' .skilled/bin/skilled-loop` prints lines 34, 1208 and 1469 at commit `89e246760e`. Observed 2026-11-14. Cited: `.skilled/bin/skilled-loop:1208`, `.skilled/bin/skilled-loop:1469` at commit `89e246760e` | Met | - |
| AC-005 | REQ-004 | Given a wrapper file that cannot be read, When `wrapper_checksum` runs, Then it prints nothing and returns 0 | By inspection of `{ cksum < "$script_path"; } 2>/dev/null \|\| true`, which discards the error and ends in `true`. No test forces the read to fail, so this row rests on the source and not on a run. Cited: `.skilled/bin/skilled-loop:35` | Met | - |
| AC-006 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then each test passes | The change commit's message records 1538 of 1538 from a baseline of 1536. This author reran `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` at the branch head on 2026-11-14 and it exited 0 with tests 1548, pass 1548 and fail 0. The 1538 figure was not reproduced because later commits added tests. The run output was not saved into the packet, so the cited lines are the two new tests that the suite includes. Cited: `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:295`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:314` | Met | - |
| AC-007 | REQ-006 | Given the session-relaunch README, When it is searched, Then it describes the note and the restart | `rg -n 'changed on disk' .skilled/hooks/session-relaunch/README.md` prints line 112 on 2026-11-14. Cited: `.skilled/hooks/session-relaunch/README.md:112` | Met | - |

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

Every row is Met. No row asks for a live hop, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
