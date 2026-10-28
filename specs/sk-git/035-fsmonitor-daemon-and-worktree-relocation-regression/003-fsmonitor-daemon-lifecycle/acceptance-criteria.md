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
    last_updated_at: "2026-10-27T22:15:15Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../001-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Open question 1: idle daemons end after 12 hours"
      - "Open question 2: Option B, worktree-reaper.sh hands daemons over"
      - "Open question 3: probe timeout of 15 seconds"
      - "Open question 4: the cite-drift worktree daemon exits by itself"
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
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 11 daemons on this checkout, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then it prints one `pid=` row per daemon, one row names `worktree=main`, and the summary count matches the `pgrep -f 'fsmonitor--daemon run'` count | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C01; T009 and T010; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; classification cases name `worktree=main` and the summary counts; T020 on this checkout printed `total=10` for the ten `pgrep` PIDs | Met | - |
| AC-002 | REQ-001 | Given a daemon with no admin `DIR` row, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then the same command reports that daemon as `unattributed`, and `pgrep -f 'fsmonitor--daemon run'` still lists its PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C11; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `daemon without a DIR row is unattributed` and `unattributed stub survives` pass | Met | - |
| AC-003 | REQ-002 | Given a stub daemon whose socket lies under a second repository, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply` runs in the fixture, Then `pgrep -f 'fsmonitor--daemon run'` still lists the stub PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C02; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `out-of-scope stub survives` passes | Met | - |
| AC-004 | REQ-003 | Given a stray daemon in the fixture, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs without `--apply`, Then the same command prints `mode=dry-run signalled=0`, and `pgrep -f 'fsmonitor--daemon run'` still lists the stray PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C10; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; the dry-run cases print `mode=dry-run signalled=0`, and the stray stub survives | Met | - |
| AC-005 | REQ-003 | Given the daemons on this checkout, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after the run | T020 on this checkout; observed 2026-10-27: T020: the same ten PIDs before and after, `signalled=0`, 0.8 seconds | Met | - |
| AC-006 | REQ-004 | Given a fixture daemon of a registered idle worktree, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply` runs with no other flag, Then `pgrep -f 'fsmonitor--daemon run'` still lists its PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C03; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `--apply leaves the keep stub alive` passes | Met | - |
| AC-007 | REQ-004 | Given a stray daemon whose admin directory was deleted, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply` runs, Then `echo $?` prints 0, and `pgrep -f 'fsmonitor--daemon run'` no longer lists its PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C04; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `--apply exits 0` and `--apply ends the stray stub` pass | Met | - |
| AC-008 | REQ-005 | Given a daemon that ignores SIGTERM, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --worktree <path>` runs, Then `echo $?` prints 0, and `pgrep -f 'fsmonitor--daemon run'` no longer lists its PID after SIGKILL | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C07; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; the escalation cases report `via=kill` and the stub is gone | Met | - |
| AC-009 | REQ-005 | Given a `--worktree` target with a live daemon, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --worktree <path>` runs and then `git worktree remove <path>` runs, Then `echo $?` prints 0 for the removal, and `bash .skilled/bin/fsmonitor-daemon-reaper.sh` prints no line that names the path | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C05; observed 2026-10-27: T021 in a scratch repository: `ended ... via=stop`, `git worktree remove` exit 0, and no later dry-run line names the worktree | Met | - |
| AC-010 | REQ-006 | Given a live shell whose working directory is inside the target worktree, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --worktree <path>` runs, Then the same command prints `refused`, and `pgrep -f 'fsmonitor--daemon run'` still lists the target PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C06; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `refusal is reported` and `refusal leaves the worktree daemon alive` pass | Met | - |
| AC-011 | REQ-007 | Given a probe git call that hangs past the probe timeout, When `FSMON_PROBE_TIMEOUT=2 bash .skilled/bin/fsmonitor-daemon-reaper.sh --probe --apply` runs in the fixture, Then `pgrep -f 'fsmonitor--daemon run'` no longer lists the wedged PID, and `time` shows the run finishing within 10 seconds | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C08; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `probe apply kills the wedged stub` and `a wedged probe is bounded by its timeout` (under 10 s) pass | Met | - |
| AC-012 | REQ-007 | Given a probe git call that answers in 1 second, When `FSMON_PROBE_TIMEOUT=3 bash .skilled/bin/fsmonitor-daemon-reaper.sh --probe --apply` runs in the fixture, Then `pgrep -f 'fsmonitor--daemon run'` still lists the daemon PID | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, case C09; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; `a daemon that answers survives the probe` passes | Met | - |
| AC-013 | REQ-008 | Given the sk-git finish step, When `rg -n 'fsmonitor-daemon-reaper' .skilled/skills/sk-git/references/finish-workflows.md` runs, Then it prints two lines, one before and one after the `git worktree remove` line | T015; observed 2026-10-27: `rg` prints finish-workflows.md:316, before the removal at :318, and :321 after it | Met | - |
| AC-014 | REQ-008 | Given a worktree removed in a scratch clone with its daemon started, When `git worktree remove <WT>` runs, Then `bash .skilled/bin/fsmonitor-daemon-reaper.sh` prints no line that names `<WT>` | T021 in a scratch clone; observed 2026-10-27: T021: the dry run after the removal named no line for the removed worktree | Met | - |
| AC-015 | REQ-009 | Given the host bash 3.2, When `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` runs, Then the same command prints `RESULT: PASS=` with `FAIL=0` and exits 0 | T019; observed 2026-10-27: `/bin/bash` 3.2.57 printed `fsmonitor-daemon-reaper tests: PASS=107 FAIL=0` and exited 0 in five runs; the summary uses the sibling suites' format, not a `RESULT:` prefix | Met | - |
| AC-016 | REQ-010 | Given the reaper script, When `rg -n -e 'timeout [0-9]' -e 'gtimeout ' .skilled/bin/fsmonitor-daemon-reaper.sh` runs, Then `rg -n -e 'timeout [0-9]' -e 'gtimeout ' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing | CHK-013; observed 2026-10-27: no output | Met | - |
| AC-017 | REQ-011 | Given a fixture daemon of a registered worktree started 13 hours ago with no live process inside the worktree, When `bash .skilled/bin/fsmonitor-daemon-reaper.sh --apply --idle-hours 12` runs, Then `pgrep -f 'fsmonitor--daemon run'` no longer lists its PID, while the main daemon and a daemon of a worktree with a live shell inside it are still listed | `bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, idle-sweep cases; observed 2026-10-27: suite `PASS=107 FAIL=0`, exit 0; the idle cases end a 13-hour keep stub and keep the main stub, an 11-hour stub and the occupied worktree's stub | Met | - |
| AC-018 | REQ-012 | Given a stub reaper that sleeps 30 seconds, When a `worktree-session.sh` launch runs in a fixture, Then the launch finishes without waiting for the stub, and `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/worktree-session.sh` prints one line | `bash .skilled/bin/tests/worktree-session.test.sh` ends `FAIL=0`; observed 2026-10-27: worktree-session suite `PASS=70 FAIL=0`, exit 0; the launch with a 30-second stub reaper finished in under 10 seconds; `rg` prints one line, worktree-session.sh:316 | Met | - |
| AC-019 | REQ-013 | Given a merged wrapper worktree with a live stub daemon in the reaper's fixture, When `bash .skilled/bin/worktree-reaper.sh --apply` removes it, Then `pgrep -f 'fsmonitor--daemon run'` no longer lists the stub PID, and `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/worktree-reaper.sh` prints two lines, the header comment and the call path | `bash .skilled/bin/tests/worktree-reaper.test.sh` ends `FAIL=0`; observed 2026-10-27: worktree-reaper suite `PASS=26 FAIL=0`, exit 0; the case (a) stub daemon is gone after removal; `rg` prints two lines, the header comment at :16 and the call path at :64 | Met | - |

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

Every row is `Met` as of 2026-10-27, each with the evidence observed in its Verification cell.
<!-- /ANCHOR:closure -->
