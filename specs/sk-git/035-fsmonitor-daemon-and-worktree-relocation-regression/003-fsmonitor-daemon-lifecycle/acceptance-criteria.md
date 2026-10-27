---
title: "Acceptance Criteria: Phase 3: fsmonitor-daemon-lifecycle"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fsmonitor daemon lifecycle acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle"
    last_updated_at: "2026-10-27T10:18:32Z"
    last_updated_by: "markdown"
    recent_action: "Filled the planning docs for phase 003: spec, plan, tasks and acceptance criteria"
    next_safe_action: "Get the operator answers to open questions 1 to 4, then implement from task T001"
    blockers:
      - "Operator answers needed for open questions 1 to 4 in spec.md"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../001-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Open question 3: probe timeout value"
      - "Open question 4: cite-drift temporary worktree daemon"
    answered_questions:
      - "Open question 1: idle daemons end after 12 hours"
      - "Open question 2: Option B, worktree-reaper.sh hands daemons over"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: fsmonitor-daemon-lifecycle

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle
**Level:** 2
**Status:** Draft
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 11 daemons on this checkout, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then it prints one `pid=` row per daemon, one row names `worktree=main`, and the summary count matches the `pgrep -f 'fsmonitor--daemon run'` count | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C01; T009 and T010 | Unmet | - |
| AC-002 | REQ-001 | Given a daemon with no admin `DIR` row, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then the same command reports that daemon as `unattributed`, and `pgrep -f 'fsmonitor--daemon run'` still lists its PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C11 | Unmet | - |
| AC-003 | REQ-002 | Given a stub daemon whose socket lies under a second repository, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply` runs in the fixture, Then `pgrep -f 'fsmonitor--daemon run'` still lists the stub PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C02 | Unmet | - |
| AC-004 | REQ-003 | Given a stray daemon in the fixture, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs without `--apply`, Then the same command prints `mode=dry-run signalled=0`, and `pgrep -f 'fsmonitor--daemon run'` still lists the stray PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C10 | Unmet | - |
| AC-005 | REQ-003 | Given the daemons on this checkout, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after the run | T020 on this checkout | Unmet | - |
| AC-006 | REQ-004 | Given a fixture daemon of a registered idle worktree, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply` runs with no other flag, Then `pgrep -f 'fsmonitor--daemon run'` still lists its PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C03 | Unmet | - |
| AC-007 | REQ-004 | Given a stray daemon whose admin directory was deleted, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply` runs, Then `echo $?` prints 0, and `pgrep -f 'fsmonitor--daemon run'` no longer lists its PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C04 | Unmet | - |
| AC-008 | REQ-005 | Given a daemon that ignores SIGTERM, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --worktree <path>` runs, Then `echo $?` prints 0, and `pgrep -f 'fsmonitor--daemon run'` no longer lists its PID after SIGKILL | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C07 | Unmet | - |
| AC-009 | REQ-005 | Given a `--worktree` target with a live daemon, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --worktree <path>` runs and then `git worktree remove <path>` runs, Then `echo $?` prints 0 for the removal, and `bash .skilled/bin/fsmonitor-daemon-reaper.sh` prints no line that names the path | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C05 | Unmet | - |
| AC-010 | REQ-006 | Given a live shell whose working directory is inside the target worktree, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --worktree <path>` runs, Then the same command prints `refused`, and `pgrep -f 'fsmonitor--daemon run'` still lists the target PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C06 | Unmet | - |
| AC-011 | REQ-007 | Given a probe git call that hangs past the probe timeout, When `FSMON_PROBE_TIMEOUT=2 bash .skilled/bin/fsmonitor-daemon-reaper.sh --probe --apply` runs in the fixture, Then `pgrep -f 'fsmonitor--daemon run'` no longer lists the wedged PID, and `time` shows the run finishing within 10 seconds | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C08 | Unmet | - |
| AC-012 | REQ-007 | Given a probe git call that answers in 1 second, When `FSMON_PROBE_TIMEOUT=3 bash .skilled/bin/fsmonitor-daemon-reaper.sh --probe --apply` runs in the fixture, Then `pgrep -f 'fsmonitor--daemon run'` still lists the daemon PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C09 | Unmet | - |
| AC-013 | REQ-008 | Given the sk-git finish step, When `rg -n 'fsmonitor-daemon-reaper' .skilled/skills/sk-git/references/finish-workflows.md` runs, Then it prints two lines, one before and one after the `git worktree remove` line | T015 | Unmet | - |
| AC-014 | REQ-008 | Given a worktree removed in a scratch clone with its daemon started, When `git worktree remove <WT>` runs, Then `bash .skilled/bin/fsmonitor-daemon-reaper.sh` prints no line that names `<WT>` | T021 in a scratch clone | Unmet | - |
| AC-015 | REQ-009 | Given the host bash 3.2, When `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` runs, Then the same command prints `RESULT: PASS=` with `FAIL=0` and exits 0 | T019 | Unmet | - |
| AC-016 | REQ-010 | Given the reaper script, When `rg -n -e 'timeout [0-9]' -e 'gtimeout ' .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then `rg -n -e 'timeout [0-9]' -e 'gtimeout ' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing | CHK-013 | Unmet | - |
| AC-017 | REQ-011 | Given a fixture daemon of a registered worktree started 13 hours ago with no live process inside the worktree, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --idle-hours 12` runs, Then `pgrep -f 'fsmonitor--daemon run'` no longer lists its PID, while the main daemon and a daemon of a worktree with a live shell inside it are still listed | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, idle-sweep cases | Unmet | - |
| AC-018 | REQ-012 | Given a stub reaper that sleeps 30 seconds, When a `worktree-session.sh` launch runs in a fixture, Then the launch finishes without waiting for the stub, and `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/worktree-session.sh` prints one line | `bash .skilled/bin/tests/worktree-session.test.sh` ends `FAIL=0` | Unmet | - |
| AC-019 | REQ-013 | Given a merged wrapper worktree with a live stub daemon in the reaper's fixture, When `bash .skilled/bin/worktree-reaper.sh --apply` removes it, Then `pgrep -f 'fsmonitor--daemon run'` no longer lists the stub PID, and `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/worktree-reaper.sh` prints one line | `bash .skilled/bin/tests/worktree-reaper.test.sh` ends `FAIL=0` | Unmet | - |

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

**Closeable:** No

Nothing is implemented yet, so every row is still `Unmet`.
<!-- /ANCHOR:closure -->
