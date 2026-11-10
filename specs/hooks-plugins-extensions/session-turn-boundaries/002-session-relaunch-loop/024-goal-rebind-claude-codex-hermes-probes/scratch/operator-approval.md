# Operator approval and run setup

Recorded 2026-10-25 (run date; the packet was planned 2026-10-24).

## Bypass flags (T001, AC-004)

The operator approved these for this run in the dispatch brief: `claude -p --permission-mode bypassPermissions`, `codex --sandbox danger-full-access`, and overriding the cli-claude-code self-invocation guard. The brief said to use the least-privileged flags that make a probe work.

Result: no probe needed any of them. Every Claude run used the default permission mode (auto mode, no `--permission-mode` flag, no bypass). Every Codex run used the temp CODEX_HOME config, which sets no sandbox or approval override. Hermes ran without `--yolo`. The one guard override used is the cli-claude-code self-invocation guard: the probes ran `claude` from inside a Claude Code session, with `CLAUDECODE` and the loop variables stripped by `env -i`.

## Isolation

- Wrappers: `raw/run-claude.sh`, `raw/run-codex.sh`, `raw/run-hermes.sh`. Each starts the real binary by absolute path (the shell `claude`, `codex` and `hermes` names are loop-launcher functions, bypassed here) under `env -i`, so `SKILLED_LOOP_*`, `CLAUDE_*`, `CLAUDECODE` and any `AI_SESSION_*` variable from the parent do not leak in.
- Claude: throwaway project dirs in the session scratchpad, `--setting-sources project,local` so the user-level hooks and settings never load.
- Codex: a throwaway `CODEX_HOME` per probe, with `auth.json` symlinked to the real one (never read, printed or copied) and a minimal `config.toml`. This keeps the probe goals out of the real `~/.codex/goals_1.sqlite` and the global `hooks.json` out of the probe.
- Hermes: run from this worktree root (the repo plugin needs it), `OPENCODE_GOAL_STATE_DIR` pointed at the scratchpad so the goal records never touched `.skilled/skills/.state/goal/`.
- tmux was used for the interactive TUIs. Interactive runs have no exit status (the pane was read, then the tmux session killed). Print-mode runs record theirs.

## Versions (T002, CHK-013, CHK-FIX-007)

| Runtime | Version |
|---------|---------|
| Claude Code | 2.1.310 |
| Codex CLI | 0.164.0 (`goals` and `hooks` features both stable true) |
| Hermes Agent | v0.21.1 (2026.9.7) |

## Baseline (T003)

`git -c core.fsmonitor=false status --short` before the first probe: only `?? .opencode/cli.json` (pre-existing). Other agents edited tracked files in the worktree during the run, so the after-state is compared by path, not by emptiness (see implementation-summary.md Verification).
