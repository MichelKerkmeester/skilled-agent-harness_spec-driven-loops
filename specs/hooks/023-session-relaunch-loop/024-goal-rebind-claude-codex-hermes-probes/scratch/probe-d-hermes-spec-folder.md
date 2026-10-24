# Probe D: Hermes with HERMES_SPEC_FOLDER

Runtime: Hermes Agent v0.21.1, run from this worktree root (the repo plugin `repo-guards` is listed under `plugins.enabled` in the user config and loads with `HERMES_ENABLE_PROJECT_PLUGINS=1`). Clean env via `raw/run-hermes.sh`; the key is passed through the environment and never printed. `OPENCODE_GOAL_STATE_DIR` pointed at the scratchpad. Read-only: no `--yolo`, toolset `file`.

Command shape (after the wrapper sets the env): `hermes chat -Q --oneshot --query-file q.md --provider llmgateway --model deepseek-v4.1-flash-1017 --reasoning low --ignore-rules --source tool --max-turns 4 --run-budget 150 -t file --in <worktree> </dev/null`

## Provider limit

Every model call returned `HTTP 402: You've reached the daily pacing allowance on the pro plan ... resets in 17 hours`, exit 1 (`raw/d1.out`). So no model reply was ever produced. SKIP for anything that needs a reply (the model quoting its own system prompt). The plugin's session start hook and the prompt render run before the call, so the bind and the rendered request were still observable.

## Runs

| Run | Env | Session id (from stderr) | Goal-core record (`goal.cjs show --runtime hermes --session <id>`) | Request payload (Hermes wrote a request dump for the 402; the system prompt section was extracted to `raw/d-request-dump-extract.json`, headers left out) |
|-----|-----|--------------------------|------------------------------------|-----|
| D1 | `HERMES_SPEC_FOLDER=specs/hooks/023-session-relaunch-loop` | `20261025_001726_ca90e3` | `goal_present=true`, `status=active`, `goal_id=goal-d184528c-...`, `packet_path=specs/hooks/023-session-relaunch-loop`, `boundBy hermes` | system prompt carries a `repo-guards-goal` section: `[active_goal:goal-d184528c-...] status: active objective: Execute specs/hooks/023-session-relaunch-loop/goal.md ...` |
| D2 | same export, second launch | `20261025_001753_b46c7e` (differs from D1) | `goal_present=true`, new `goal_id=goal-306ce1f6-...`, same packet | same section with the new goal id |

Two records existed in the state dir after D2: one per session id. `goal.cjs show --session some-other-session-id` printed `goal_present=false`, so the record is keyed by session.

## Negative control

| Run | Env | Session id | Goal-core record | Request payload |
|-----|-----|-----------|------------------|-----------------|
| D3 | no `HERMES_SPEC_FOLDER` | `20261025_001759_c64cd3` | `goal_present=false`; state dir still held 2 records | no `[active_goal:` section (the only match was my own query text) |

The control could have contradicted the claim: without the export, the plugin would have to bind a goal from nowhere. It did not.

## What this cannot show

- The model never replied, so "the model sees and follows the goal" is not observed. What is confirmed is that the system prompt Hermes built for the model contained the goal section.
- Run from the repo worktree with the repo plugin only. A Hermes launched where the plugin is not enabled (no `HERMES_ENABLE_PROJECT_PLUGINS` or the plugin missing from `plugins.enabled`) would not bind. D3 shows the export is what drives it, not that the plugin is always present.
- The goal came from `HERMES_SPEC_FOLDER` itself. Whether the launcher in phase 25 exports it for the receiver is that phase's work.
