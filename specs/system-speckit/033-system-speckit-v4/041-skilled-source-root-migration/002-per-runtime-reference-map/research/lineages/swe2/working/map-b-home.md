## home-level configuration — 36 candidate paths

| path | exists | `.opencode` occ | link target | needed change | class |
|---|---|---|---|---|---|
| `~/.codex/hooks.json` | yes | 18 | `` | installed outbound copy of the repo's `.codex/hooks.json` command strings — re-run `install-codex-hooks.mjs` after the registry moves; outside git | manual |
| `~/.codex/config.toml` | yes | 1 | `` | home config naming `.opencode` — update on the machine; outside git | manual |
| `~/.codex/AGENTS.md` | yes | 3 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex/AGENTS.md` | link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move | none |
| `~/.hermes/config.yaml` | yes | 1 | `` | home config naming `.opencode` — update on the machine; outside git | manual |
| `~/.claude/settings.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.claude.json` | yes | 1 | `` | home config naming `.opencode` — update on the machine; outside git | manual |
| `~/.claude/CLAUDE.md` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.zshrc` | yes | 2 | `` | home config naming `.opencode` — update on the machine; outside git | manual |
| `~/.zshenv` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.gitconfig` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.config/git/config` | no | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.config/devin/config.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.config/devin/config.json.bak` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.config/devin/config.json.pre-deepresearch.bak` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.config/devin/mcp_config.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/SYNC.md` | yes | 2 | `` | home config naming `.opencode` — update on the machine; outside git | manual |
| `~/.pi/agent/auth.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/models-store.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/models.json` | yes | 0 | `../../MEGA/Development/Code_Environment/Public/.pi/models.json` | link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move | none |
| `~/.pi/agent/modes.json` | yes | 0 | `../../MEGA/Development/Code_Environment/Public/.pi/modes.json` | link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move | none |
| `~/.pi/agent/pi-cache-optimizer-config.json` | yes | 0 | `../../MEGA/Development/Code_Environment/Public/.pi/pi-cache-optimizer-config.json` | link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move | none |
| `~/.pi/agent/pi-cache-optimizer-stats.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/pi-cache-optimizer-stats.json.32175.1788503687557.tmp` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/pi-crash.log` | yes | 989 | `` | historical log — never rewritten | freeze |
| `~/.pi/agent/run-history.jsonl` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/settings.json` | yes | 0 | `../../MEGA/Development/Code_Environment/Public/.pi/settings.json` | link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move | none |
| `~/.pi/agent/statusline.sh` | yes | 0 | `../../MEGA/Development/Code_Environment/Public/.pi/statusline.sh` | link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move | none |
| `~/.pi/agent/sync-pi-configs.sh` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.pi/agent/trust.json` | yes | 0 | `` | no `.opencode` reference — unaffected | none |
| `~/.config/git/hooks/commit-msg` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/commit-msg` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
| `~/.config/git/hooks/post-commit` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/post-commit` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
| `~/.config/git/hooks/post-merge` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/post-merge` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
| `~/.config/git/hooks/post-rewrite` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/post-rewrite` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
| `~/.config/git/hooks/pre-commit` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/pre-commit` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
| `~/.config/git/hooks/pre-push` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/pre-push` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
| `~/.config/git/hooks/prepare-commit-msg` | yes | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/prepare-commit-msg` | absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide | blocker |
