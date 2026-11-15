# Probe C: Codex goal from the start seed or hook context

Runtime: Codex CLI 0.164.0, model `gpt-6-luna` at `low` effort, per-probe throwaway `CODEX_HOME` (auth symlinked, minimal config), clean env (`raw/run-codex.sh`). No sandbox or approval override; two runs hit an approval prompt for `mkdir -p /nonexistent` and that was denied with Esc. Interactive runs have no exit status.

Codex ships the `/goal [<objective>|clear|edit|pause|resume]` slash command and a model tool `create_goal` (feature `goals`, stable).

## Runs

| Run | What | Observed |
|-----|------|----------|
| C1 | start prompt `/goal Probe C1 start prompt: ...` | Shown as a plain user message, the model ran shell checks. `/goal` then printed `No goal is currently set.` The start prompt was NOT run as a command. Raw: `raw/c1-pane-status.txt` |
| C1b | typed `/goal Probe C1 typed positive control: ...` in the same pane (needed a second Enter) | status line `Pursuing goal`. Proves the command works when typed. `/goal clear` printed `Goal cleared`, `/goal` then `No goal is currently set.` Raw: `raw/c1-pane-typed-positive.txt`, `raw/c1-pane-cleared.txt` |
| C2 | start prompt asking the model to call `create_goal` with a stated objective | `Created the thread goal: "Probe C2 seed-created goal, ..."`, status line `Pursuing goal`; `/goal` printed `Goal / Status: active / Objective: Probe C2 seed-created goal, ...`. Raw: `raw/c2-pane-run.txt`, `raw/c2-pane-status.txt` |
| C3 | SessionStart hook (`raw/c3-hooks.json`, `raw/c3-hook.sh`) returns `additionalContext` instructing the model to create the goal; first turn typed as `Begin. Reply with the single word READY.` | `hook-ran.log` written at the first turn. The model replied READY, then created the goal: `/goal` printed `Status: active / Objective: Probe C3 hook-created goal, ...`. Before that first turn the hook had not run and `/goal` showed no goal (Codex starts the hook lazily at the first turn, so a hook alone with no turn sets nothing). Raw: `raw/c3-pane-run.txt` |
| C5 | seed asks the model to call `create_goal` with a 4,400-character file as the objective | The model reported: `The goal was not created. The tool rejected the 4,398-character objective because the maximum is 4,000 characters.` Raw: `raw/c5-pane-run.txt` |
| C6 | same with 3,900 characters | Stalled in the model's generation at 2m48s with no tool result; interrupted. INCONCLUSIVE for the accept side of the limit. |

Codex hooks needed the throwaway hook trusted once (`Hooks need review`, option 2, in the throwaway home's config only).

## Negative control

| Run | What | Observed |
|-----|------|----------|
| C4 | same silent-hook setup, start prompt `Begin. Reply with the single word READY.` | The model replied READY, the hook ran (`hook-ran.log`); `/goal` printed `No goal is currently set.` Raw: `raw/c4-pane-control.txt` |

The control could have contradicted the seed and hook claims: a runtime that auto-created goals would show one here. It did not.

## What this cannot show

- C2 and C3 depend on the model choosing to call `create_goal`. The tool is meant for explicit user requests, and the hook run relies on a developer-role instruction being obeyed. n = 1 each. It is a request the model honours, not a guaranteed set.
- The 4,000-character limit comes from the model's report of the tool's rejection (and the binary string `objective must be at most N characters`), not from a captured raw tool result. The accept side at 3,900 is untested.
- The typed `/goal` behaviour was seen in tmux with its paste-burst handling (two Enters). A long typed or pasted `/goal` was not measured: a 4,400-character paste went in as plain text.
