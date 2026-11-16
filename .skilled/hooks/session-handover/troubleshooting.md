---
title: "Session Handover Troubleshooting"
description: "Diagnose session-handover refusals, killer log lines and wrapper warnings, with the cause and the fix for each symptom."
trigger_phrases:
  - "session handover troubleshooting"
  - "prepare exit code 2"
  - "killer-timeout"
  - "killer-lock-held"
  - "handoff note not claimed"
  - "hop limit reached"
importance_tier: "normal"
contextType: "reference"
---

# Session Handover Troubleshooting

Open this reference when a hand-over refuses to prepare, a killer log line needs a meaning or a relaunch ends without a claim. Every entry pairs the symptom with the cause the code checks and the action that clears it.

## 1. OVERVIEW

This document covers the failure paths of the session-handover hook and its `skilled-loop` wrapper. It reads the exit codes, the killer log lines and the wrapper warnings as symptoms. Each entry names the cause the code checks and the fix that clears it. The note format and the handoff protocol live in `handoff-protocol.md` while the contract, the switches and the tree stay in `README.md`.

---

## 2. TROUBLESHOOTING

### Prepare exits 2

A `prepare` exit code of 2 means the note or loop cannot be prepared. Common reasons include:

- The handoff path is missing, outside the handoffs directory or resolves outside that directory.
- The handoffs directory is reached through a symlink below the repository root.
- The note has invalid flat frontmatter, a non-open status, a different supplied session id, a missing required field or an empty required section.
- The note's `spec_folder` names a packet path that does not exist as a directory in the repository, so `keep` refuses it the same way.
- The receiving session shows no `Goal packet:` line or the note has no `goal_packet`. `prepare` and `keep` write it only when the sender's goal can be proven. A Codex sender, a Claude session whose log cannot be read and a session whose goal has ended all leave it out. A Claude session that never had a goal set also leaves it out. That happens when neither the note's spec folder nor its parent has an unfinished `goal.md` within the slice budget. A `goal_packet` the note carried is removed on the next call in the same cases.
- No session id reached `prepare` or `claim`. Claude can fall back to `CLAUDE_CODE_SESSION_ID`, and a Vibe session under `skilled-loop` can omit `--session` on `prepare` through the id its turn-start hook recorded; every other runtime must pass `--session`.
- The concern is off for this runtime, so the reason names which switch did it. The note is left unchanged.
  - `SYSTEM_SESSION_HANDOVER_DISABLED` or the master hook switch is set.
  - The runtime's `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` holds a falsy value.
  - That flag is empty and `SYSTEM_SESSION_HANDOVER_ENABLED` holds a falsy value.
  - Both are empty on a runtime other than Claude Code.
- Inside `skilled-loop`, the runtime still has a live child shell. The prepare command does not run this check outside the loop.
- `SKILLED_LOOP_HOPS` is not a non-negative integer, so the hop count cannot be read.

### Prepare exits 3

When prepare exits 3 outside the loop, start the runtime through `skilled-loop`, by hand or through the shell shim, or use the printed manual claim command.

At the hop cap, prepare writes no record and logs `prepare-declined reason=hop-cap`. Its first line reads `[session-handover] hop limit reached; continue in this session (auto-compaction remains the fallback)`.

A corrupt relaunch JSON file makes `should-relaunch` decline with reason `no-file`. An unreadable Claude transcript yields no context usage, while unreadable Claude settings files are skipped as absent.

### Killer log lines

The killer polls every 100 ms. The idle window defaults to 3000 ms and the overall timeout to 30000 ms. The separate post-signal grace period is 15000 ms.

| Symptom | Cause | Fix |
|---|---|---|
| `killer-no-armed-record` | No armed record existed before signalling | Nothing to do, the session keeps running |
| `killer-hop-cap` | The record's hop count already reached `SESSION_HANDOVER_MAX_HOPS` | Continue in this session |
| `killer-stale` | The record would pass `SESSION_HANDOVER_MAX_AGE_MIN` before the wrapper could read it | Run `prepare` again on the open note, or claim it by hand |
| `killer-manual-template` | `SKILLED_LOOP_MANUAL_TEMPLATE` did not hold exactly one note placeholder | Restart the loop without `@@HANDOFF@@` in any launch option |
| `killer-lock-held` | Another killer owns the lock or is creating it | Wait for that killer to exit |
| `killer-lock-stale` | The owner process is gone or the unreadable lock is older than five seconds | Nothing to do, the killer takes the lock over |
| `killer-lock-not-owned` | A stall past the expiry let a contender take the lock over | Nothing to do, the new owner keeps the file |
| `target-gone` | The target exited between the final liveness check and `SIGTERM` | Nothing to do, the session already ended |
| `killer-timeout` | The idle wait or the post-signal grace expired while the target runtime stayed alive | Claim the note by hand |
| `killer-timeout-superseded` | A later prepare armed a different note or re-armed the same note, or `cancel` disarmed the record, during the wait | Nothing to do, the newer note needs its own killer |
| `killer-error` | An error stopped the killer, such as an unreadable takeover mutex owner file | Repair the state directory. The record stays armed and the next arm event starts a new killer |
| `killer-mutex-release-error` | The `<lock>.takeover` directory could not be removed after the takeover | Nothing to do, the takeover result stands |

`killer-hop-cap` and `killer-stale` both unarm the record, with reason `hop-cap` and reason `stale`, so neither sends a signal. `killer-timeout` also unarms an armed record with reason `killer-timeout`, writes a `timed-out` hop-history line and, unless the killer runs with `--no-notify`, sends the timeout notice. `killer-manual-template` falls back to the plain manual command with the same reason in its subtitle.

`killer-timeout-superseded` replaces a timeout when a later prepare armed a different note or re-armed the same note with a new `armedAt` or `armId`, during the wait. The killer then logs the `watched` and `current` note paths and neither disarms nor notifies, because the newer note still needs its own killer. A record that `cancel` disarmed while the killer watched it gets no timeout either. The killer logs `killer-timeout-superseded`, writes no history line and sends no notification.

A signal probe that fails with `EPERM` means the pid belongs to another user's process, so the killer treats its target as gone instead of signalling it. `killer-lock-held` also appears while another killer holds the `<lock>.takeover` mutex.

If an armed record has no live killer, the next arm event starts one. A live killer that owns the lock blocks that restart by design. `killer-error` with exit code 1 means the takeover mutex's owner file could not be read, for example a read error other than `ENOENT`, `EACCES` or `EISDIR`; a directory at the owner path counts as no owner and is judged by age. The killer stops before the takeover and the armed record stays armed for the next arm event.

`killer-mutex-release-error` means the `<lock>.takeover` directory could not be removed after the takeover finished. The takeover result stands and the killer keeps the lock it acquired, so this line does not mean the handoff failed. A leftover mutex is reclaimed by the next takeover once its owner is dead. It is also reclaimed once it has no owner file and is older than 30 s.

A transcript that stays unreadable for 1 s also ends with `killer-timeout`.

### Wrapper warnings

When the relaunched session ends before it claims its seeded note, for example after an interrupt during the hop, the wrapper prints `warning: the relaunched session ended before claiming <note>; its handoff note was not claimed` and the manual claim command.

When the runtime exits with code 130 and a relaunch record is eligible, the wrapper prints the manual claim command and exits 130 without relaunching. The exception is a record the killer stamped before it signalled, which `should-relaunch` reports as `signalled: true`. OpenCode 2 exits 130 on `SIGTERM` as well as on an interrupt, so that exit is the hop and the wrapper relaunches.

If the saved cwd is missing or the cwd or handoff path contains CR or LF, it prints the command and exits 1. A record that names no handoff or no cwd is declined with reason `incomplete-record`, so the wrapper keeps the runtime's exit code.

Before a relaunch the wrapper checks the note state that `consume` reports, because a claim seed for any note that is not open fails in the fresh session. A note in another state prints `warning: the handoff note is <state>; not relaunching`. A failed consume, which also loses the Gate 3 answer, prints `warning: could not read the consumed relaunch record; not relaunching`.

Both exit 1, and the manual command is printed only when the state could not be read or the note is `invalid`, because a claimed, done or missing note cannot be claimed. Only when the note is open does the wrapper run `hand-over`, which writes the `handed-over` line, before it relaunches.

On the other exit paths a consume failure prints a warning and the wrapper continues with the exit it was already handling. If the wrapper cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record` and consumes the record. It exits 1 when `should-relaunch` approved the hop and exits with the runtime's own exit code when `should-relaunch` declined. Neither path prints a manual claim command.

When `should-relaunch` declines with reason `withdrawn`, the session called off its hand-over and kept working. The wrapper consumes the record, prints `warning: the prepared hand-over was withdrawn in the session; <note> stays open and out of date`, prints no manual claim command and exits with the runtime's own exit code. Other `should-relaunch` failures with status 2 or higher print a warning and preserve the runtime's exit code.

---

## 3. RELATED

- [`README.md`](README.md) - the hook's contract, switches and directory tree.
- [`handoff-protocol.md`](handoff-protocol.md) - the note format and the handoff protocol.
- [`bin/session-handover.cjs`](bin/session-handover.cjs) - the CLI that owns `prepare`, `keep`, `claim`, `consume`, `hand-over`, `cancel`, `history` and `window`.
- [`lib/killer.cjs`](lib/killer.cjs) - the killer, its lock, its takeover mutex and every log line above.
- [`lib/relaunch-core.cjs`](lib/relaunch-core.cjs) - note validation, the relaunch record and the `should-relaunch` decision.
- [`../../bin/skilled-loop`](../../bin/skilled-loop) - the wrapper that prints the warnings above.
- [`../shared/hook-flags.cjs`](../shared/hook-flags.cjs) - the master, kill and per-runtime switches.
