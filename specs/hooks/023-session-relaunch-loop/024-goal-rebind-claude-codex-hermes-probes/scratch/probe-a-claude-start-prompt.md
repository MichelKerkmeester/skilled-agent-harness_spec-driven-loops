# Probe A: Claude Code start prompt that is a `/goal` command

Runtime: Claude Code 2.1.310, default permission mode, `--setting-sources project,local`, `--model claude-sonnet-5-5`, clean env (`raw/run-claude.sh`). Interactive runs were driven in tmux; their exit status does not exist (killed after reading). Print runs exit 0.

## Runs

| Run | Command (after the wrapper) | Observed |
|-----|------------------------------|----------|
| A1 | `claude '/goal Probe A goal marker: say hello once'` | `Goal set: Probe A goal marker: say hello once`, then the model said Hello and the status line printed `Goal achieved (3s, 1 turn)`. Raw: `raw/a1-pane.txt` |
| A2 | `claude '/goal Probe A2 unachievable: the file /nonexistent/probe-a2-never exists on disk'` | Status bar `/goal active`. Typing `/goal` afterwards printed `Goal active ... Goal: Probe A2 unachievable ...` with a `Last check` line from the evaluator. `/goal clear` printed `Goal cleared`, and `/goal` then printed `No goal set`. Raw: `raw/a2-pane-active.txt`, `raw/a2-pane-status.txt`, `raw/a2-pane-cleared.txt` |
| A4 | same, start prompt of 3,900 characters over many lines | `/goal` status showed the goal active. The transcript `goal_status` attachment stored a 3,894-character condition (3,900 minus the `/goal ` prefix). No raw capture was saved for this run, so this row is the prober's record only, not reproducible evidence. A5's refusal at 4,394 characters is captured |
| A5 | same, 4,400 characters | `Goal condition is limited to 4000 characters (got 4394)`. No goal set. Raw: `raw/a5-pane.txt` |
| A6 | `claude -p '/goal Probe A6 print mode: ...'` | Exit 0. The model answered under a goal Stop hook ("The hook's finding is accurate ..."), so the command ran in print mode too. Raw: `raw/a6-print.txt` |

The transcript for A4 (`~/.claude/projects/...probe-a4/*.jsonl`) holds `<command-name>/goal</command-name>` as a user entry and a `goal_status` attachment with `sentinel: true`, so the start prompt was dispatched as the slash command, not sent as text.

## Negative control

| Run | Command | Observed |
|-----|---------|----------|
| A3 | `claude 'Please run: /goal Probe A3 control: the file /nonexistent/probe-a3-never exists. Just reply with the single word ok.'` | The model replied `ok`. Typing `/goal` printed `No goal set`. Raw: `raw/a3-pane-control.txt` |

The control could have contradicted the claim: had Claude scanned prompt text for `/goal`, A3 would have set a goal. It did not, so only a prompt that starts with the command runs it.

## What this cannot show

- Auto mode was on (the default in 2.1.310), so a different permission mode or a managed-settings policy might prompt first. Not tested.
- The goal is set in the new session's own id, which is the point for a receiver, but the `Goal achieved` auto-clear in A1 shows a short goal can end at once. A real slice states a condition the evaluator may judge met early.
- n = 1 per run, on one machine and one version.
