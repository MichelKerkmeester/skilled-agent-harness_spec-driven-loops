# Probe B: Claude Code SessionStart hook that sends or sets `/goal`

Runtime: Claude Code 2.1.310, default permission mode, `--setting-sources project,local` so only the throwaway project hook ran. Each hook (`raw/b*-hook.sh`) appends a line to `hook-ran.log`, which proves it executed, then prints its payload. The hook reads its stdin only to measure its size and the `source` field. Clean env (`raw/run-claude.sh`).

Claude 2.1.310 documents a `SessionStart` hook output field `initialUserMessage` (found in the binary's hook schema: `hookSpecificOutput.initialUserMessage`, beside `additionalContext`). The probe tests it directly.

## Runs (positive side)

| Run | Hook payload | Mode | Observed |
|-----|--------------|------|----------|
| B1 | `hookSpecificOutput.initialUserMessage = "/goal Probe B1 ... never exists on disk"` | interactive, no start prompt | `hook-ran.log` shows the hook ran (`source=startup`); (the B4 debug log, same field, shows the hook output parsed and `provided initialUserMessage (63 chars)`); no message submitted; `/goal` printed `No goal set`. Raw: `raw/b1-pane-interactive-nostartprompt.txt` |
| B1 | same | interactive, start prompt `say ok` | hook ran, model answered `ok`, `/goal` printed `No goal set`. Raw: `raw/b1-pane-interactive-with-startprompt-status.txt` |
| B1 | same | `claude -p 'say ok'`, exit 0 | the transcript holds `queue-operation enqueue` for the `/goal ...` message first and `say ok` second, then `<command-name>/goal</command-name>` and a `goal_status` attachment. The hook message ran as the command. Raw: `raw/b1-print.txt` |
| B4 | `initialUserMessage = "Reply with exactly the word PLAINMSG-RECEIVED ..."` | interactive | hook ran, debug log `provided initialUserMessage (63 chars)`, nothing was submitted; the transcript has no queue entry and no PLAINMSG turn. Interactive transcript holds only the hook's `hook_success` attachment and the typed turn, with no `queue-operation`. Raw: `raw/b4-pane-interactive-idle.txt`, `raw/b4-pane-after-typed-turn.txt`, `raw/b4-debug-excerpt.txt` |
| B4 | same | `claude -p 'say ok'`, exit 0 | stdout `PLAINMSG-RECEIVED` then `ok`: the hook message was delivered as a user turn first. Raw: `raw/b4-print.txt` |
| B2 | `additionalContext = "/goal Probe B2 ..."` | interactive, start prompt `say ok` | hook ran; `/goal` printed `No goal set`. Raw: `raw/b2-pane-interactive-status.txt` |
| B5 | plain stdout `/goal Probe B5 ...` | interactive, start prompt `say ok` | hook ran; `/goal` printed `No goal set`. Raw: `raw/b5-pane-interactive-status.txt` |

## Negative controls

| Run | Hook payload | Mode | Observed |
|-----|--------------|------|----------|
| B3 | silent (no output) | interactive | hook ran; `/goal` printed `No goal set`. Raw: `raw/b3-pane-interactive-status.txt` |
| B3 | silent | `claude -p 'say ok'`, exit 0 | stdout `ok`; transcript has zero `goal_status` attachments and only `say ok` queued. Raw: `raw/b3-print.txt` |
| B2 | `additionalContext` carrying the `/goal` text, `-p` | exit 0 | stdout `ok`; zero `goal_status` attachments. Context text alone never runs the command |

The print-mode B1 versus B3 pair is the control that could have shown the opposite: the same hook and mode, with and without the `initialUserMessage` payload, differ in whether a goal exists.

## What this cannot show

- The interactive TUI ignoring `initialUserMessage` is observed on this version, in tmux, with the field set on `source=startup`. The code path that drops it was not read. A later release may deliver it, and `source=resume` or `clear` was not tried.
- A hook that injects keystrokes (for example `tmux send-keys`) was not tried: it needs a tmux pane, which the relaunch loop does not guarantee.
- Typing a turn into B4's idle interactive session (`hi, just say ok`) also did not release the hook message: only `ok` was answered.
