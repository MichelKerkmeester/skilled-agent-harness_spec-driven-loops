---
title: "Session Handover State Files"
description: "Where the session-handover hook keeps its relaunch record, handoff note status, nudge level and hop history, with the meaning of each state."
trigger_phrases:
  - "session handover state files"
  - "relaunch record"
  - "hop history"
  - "relaunch.log"
  - "handoff note status"
  - "killer lock"
importance_tier: "normal"
contextType: "reference"
---

# Session Handover State Files

Use this reference when a hand-over leaves a record behind and you need to read it. It names each state file, the statuses inside it and the log that records past hops.

## 1. OVERVIEW

The session-handover hook writes its relaunch record, its handoff note status and its nudge level into one runtime state directory. A separate log beside the handoff notes records every hop that ran. This document names each file, the statuses it holds and the events it records. It also covers the locks that keep two writers apart.

---

## 2. STATE FILES

The relaunch record uses `XDG_RUNTIME_DIR/skilled-relaunch` when `XDG_RUNTIME_DIR` is set. When it is unset, the record uses `skilled-relaunch-<uid>` under the operating system temporary directory. A shared temp directory would otherwise let the first user on a host create a directory the second user cannot own.

The directory must be a real directory owned by the current user. A symlink, a plain file or a foreign owner fails with `relaunch state directory must be a real directory owned by the current user: <dir>`. A directory that passes is set to mode 0700. Its filename is `relaunch-<loop-id>.json`.

### Relaunch Status

| Status | Meaning |
|---|---|
| pending | `prepare` accepted the note. The runtime's arm event has not armed the record yet. |
| armed | The runtime's arm event armed the record and started the killer. |
| disarmed | The record ended without a relaunch. |

The arm event is `Stop` on Claude and Codex, `agent_settled` on Pi and `session.idle` on OpenCode and `post_agent` on Vibe. A disarmed record carries one reason. A session that never went idle before the deadline ends with reason `killer-timeout`. A transcript unreadable for 1 s ends the same way. So does a session still running after the SIGTERM grace period.

A record whose hop count already reached `SESSION_HANDOVER_MAX_HOPS` ends with reason `hop-cap`. A record past its age limit ends with reason `stale`. The killer sends no signal for either of those two reasons.

A new turn in the arming session ends an armed or deferred record with reason `user-message` on Pi and OpenCode. An operator prompt over an armed or deferred record ends it the same way on Claude and Codex.

`cancel` ends a pending or armed record with reason `cancelled`. `should-relaunch` reports both of those reasons as `withdrawn` and every other record that is not armed as `not-armed`.

### Corrupt Records

A corrupt relaunch file is treated as absent. `should-relaunch` declines it with reason `no-file` and logs `corrupt-relaunch-file`. A record that parses but holds no `handoff` string is read the same way. No writer produces one. A pending record without a note would let Stop arm a hop that has nothing to claim.

A record whose `handoff` is an empty string is still read. `should-relaunch` declines it as `incomplete-record`. The CLI also treats `EACCES`, `ENOTDIR` and `EISDIR` while reading the record as absent. Other errors return exit 2.

### Note Status

The handoff note has a separate status field:

| Note status | Meaning |
|---|---|
| open | Written and ready for a receiving session. |
| claimed | The receiving session claimed it. The note records `claimed_by` and `claimed_at`. |
| done | The receiving session completed the handoff. `prepare` also closes an earlier note of this session when it prepares a successor hop. |

When a new hop goes ahead, `prepare` marks as `done` every other note this session claimed and every other open note this session wrote. It adds `completed_at` and sets `superseded_by` to the new note's basename.

### Nudge State And Locks

The hook keeps per-session nudge levels in `nudge-<session-id>.json` in the same runtime state directory. After a withdraw or a `cancel` the file also holds the one extra nudge as a `rearm` field.

The field starts pending and becomes a fill floor, the fill at the first check at or past the threshold plus 0.05, without nudging on that check. A delivered nudge or a compaction writes the level alone and so spends the grant.

Every write to a relaunch record runs under a lock beside the file. That covers prepare, arm, disarm, defer, withdraw and the removal `consume` makes. The claim and completion of a note run under a lock beside the note, so two writers cannot both act on the same read. A lock that cannot be taken lets the write go ahead without it.

### Relaunch Log

The hooks and wrapper append events to `relaunch.log` on a best-effort basis. The killer appends its events there too. A failed append in the killer is not swallowed.

Each event is one line, appended under fsync at mode 0600, with the mode re-pinned on every append. When the previous last line has no newline, as after a partial write, the new event starts on its own line, so concurrent writers keep one event per line.

A short write, from a full disk or a file-size limit, throws `relaunch log short write: wrote X of Y bytes to <path>` instead of losing the event quietly.

The killer lock file stores the owner pid, the creation timestamp and the expiry stamp. A lock past its expiry counts as stale, so a reused pid cannot keep the loop pinned. A lock whose owner is alive and not expired, or a lock younger than five seconds with no readable owner pid, logs `killer-lock-held`. Stale locks log `killer-lock-stale` before the killer removes and retries them.

---

## 3. HOP HISTORY

`relaunch.log` sits in a temporary directory the system clears, so it is no record of past hops. Each hop therefore also appends one line to `.skilled/skills/.state/session-handover/hop-history.log`, beside the handoff notes. That folder is gitignored and persists. A repository that links this checkout's `.skilled` writes to the same file. Each line carries the session's folder so you can tell them apart.

| Event | Written when |
|---|---|
| `handed-over` | The wrapper passed its last checks and relaunched, so the session handed over. |
| `claimed` | A session claimed the note. |
| `done` | The fresh session completed the note. |
| `withdrawn` | The session called off its prepared hand-over. |
| `timed-out` | The old session did not end in time, so the killer disarmed the record and no hop ran. |
| `note-kept` | A session outside the loop wrote its note and ran `keep`. |

`should-relaunch` writes nothing for `handed-over`, because the wrapper can still decline after it approves. The `handed-over` line carries the hop number. A `claimed` line ends with the first eight characters of the claiming session's id. `history` prints them as `by <id>`. The note's file name names the session that wrote it, so a session that claimed its own note shows the same id in both.

A `withdrawn` line covers `cancel` and an operator prompt over a deferred or armed Claude or Codex record. It also covers a new turn over a deferred or armed Pi or OpenCode record. The note stays open with that session. A `note-kept` line means the session continues in place and claims the note after auto-compaction.

Each line holds the time, the event, the runtime, the hop number, the session folder, the first line of the note's Goal and the note's filename, separated by tabs. A failed write never fails the hop. Read the latest lines with `node .skilled/hooks/session-handover/bin/session-handover.cjs history` or `history --last <count>`. `/doctor:setup` shows the last one.

When a handoff note is still `open`, `history` and `/doctor:setup` both add a line such as `open notes: 2 handoff notes not claimed yet, oldest <filename>`, so a hand-over nobody finished is visible. A note whose newest history line is `withdrawn` is counted apart, as `1 withdrawn note still with its session`, because its session holds it and nobody left it unclaimed. Handing the note over again makes it unclaimed work once more. Set `SESSION_HANDOVER_NOTIFY_HOPS=1` for a macOS notice each time a session hands over.

---

## 4. RELATED

- [`README.md`](./README.md) - the session-handover contract, its hooks and its switches.
- [`relaunch-core.cjs`](./lib/relaunch-core.cjs) - the state directory, the relaunch record, the note status and `relaunch.log`.
- [`hop-history.cjs`](./lib/hop-history.cjs) - the hop history file, its events and the open-notes line.
- [`killer.cjs`](./lib/killer.cjs) - the killer lock, its expiry and the disarm reasons.
- [`nudge.cjs`](./lib/nudge.cjs) - the nudge level file and the `rearm` grant.
- [`session-handover.cjs`](./bin/session-handover.cjs) - the `history` command and the record read errors.
