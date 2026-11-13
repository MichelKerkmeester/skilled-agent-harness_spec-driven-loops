# Live permission-mode checks on Claude Code 2.1.323

Run by the orchestrator on 2026-11-13, because a dispatched builder may not start a Claude
session. Each run started in its own fresh directory under `scratch/live/` with
`env -u SKILLED_LOOP_ID -u SKILLED_LOOP_HOPS -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_ENTRYPOINT`,
`--model haiku` to keep the cost low, and `--settings scratch/live/settings.json`, whose Stop
hook writes the payload to `$CAPTURE`. The four payloads are kept beside the settings file.

Both the user settings and the project settings of this machine set
`permissions.defaultMode` to `bypassPermissions`. That decides how two of the lines read.

## Results

default-mode payload: `claude -p "Reply OK"` exit 0, `permission_mode` = `bypassPermissions` (`live/default.json`). The value is the configured default mode of this machine, not a spelling of the built-in default.
default flag exit: `claude -p --permission-mode default "Reply OK"` exit 0, no usage error, `permission_mode` = `default` (`live/defaultflag.json`).
bypass alone: `claude -p --permission-mode bypassPermissions "Reply OK"` exit 0, `permission_mode` = `bypassPermissions` (`live/bypass.json`).
dangerously plus acceptEdits: `claude -p --dangerously-skip-permissions --permission-mode acceptEdits "Reply OK"` exit 0, `permission_mode` = `bypassPermissions` (`live/mixed.json`).

## What follows

- `default` is a spelling the Stop payload reports and the CLI accepts, although `claude --help` lists only `acceptEdits`, `auto`, `bypassPermissions`, `manual`, `dontAsk` and `plan`. The wrapper accepts it as a seventh value.
- Whether `--permission-mode bypassPermissions` needs a second flag is not settled by these runs. The run passed with no other flag, but on a machine whose settings already default to bypass. The wrapper keeps the stricter rule: a live `bypassPermissions` is replayed only when the launch line carried an unlocking flag.
- A launch `--dangerously-skip-permissions` wins over a carried mode. A receiver of such a loop runs in bypass whatever mode the hop replays, so the carry cannot narrow that launch.
- Each run printed a SessionEnd hook error for `.skilled/scripts/session-cleanup.sh`, because the scratch directory is not the repository root. It did not change an exit status.
