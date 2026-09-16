---
title: "Probe environment"
description: "Base commit, clone state, runtime versions, git settings and the before-and-after captures that bound every phase 003 probe."
---

# Probe environment

Recorded by the orchestrator on 2026-09-16 while running phase 003.

## Base and clones (T001, T002)

| Item | Value | How read |
|------|-------|----------|
| Base SHA | `d26f0c60ca88dab922752ab3d9ce8a07463934ae` | `git -C <worktree 055> rev-parse HEAD` |
| Scratch root | `/tmp/skilled-probes-003` | shared setup, plan §4 |
| Clone setup | 18:47:28Z to 18:49:15Z, every clone exit 0 | setup log |
| `rehearsal` | HEAD at base, no remote, 85,236 tracked files, 17,767 under `.opencode` | `git rev-parse HEAD`, `git remote`, `git ls-files` |
| `links-baseline` | HEAD at base, no remote, 85,236 tracked files, 17,767 under `.opencode` | same |
| `links-shape-a` | HEAD at base, no remote, 85,236 tracked files, 17,767 under `.opencode` | same |
| `links-shape-b` | HEAD at base, no remote, 85,236 tracked files, 17,767 under `.opencode` | same |
| Worktree status before | 4 lines, all untracked `containment/` directories of this packet's research lanes | `git status --porcelain` saved to `wt-status-before` |
| Main checkout status before | 24 lines: 22 from other sessions (`council-graph.sqlite`, containment directories, `.stderr` run files) and 2 from this session's goal-send side task (`038-goal-unification/spec.md`, the new `013-goal-chat-send-shape/`) | `git status --porcelain` saved to `main-status-before` |
| Concurrent writers in the main checkout | Other sessions, and this session's goal-send agent editing goal documents there during the probes. T021 therefore attributes every main-checkout difference to one of those writers or to a probe | orchestrator note |

## Runtime versions (T001)

| Runtime | Version | Binary |
|---------|---------|--------|
| Claude Code | 2.1.273 | `~/.local/bin/claude` |
| Codex CLI | 0.154.0 | `/opt/homebrew/bin/codex` |
| Cursor Agent | 2026.09.10-fd3934a | `~/.local/bin/cursor-agent` |
| Devin | 3000.10.27 (bcbe88c7) | `~/.local/bin/devin` |
| Pi | 0.85.1 | `~/.local/bin/pi` |
| Hermes Agent | v0.21.1 (2026.9.7), upstream dc90a75a | `~/.local/bin/hermes` |
| opencode | 1.18.11 | `~/.local/bin/opencode` |

## Git settings (T001)

| Setting | Value |
|---------|-------|
| `git --version` | 2.50.1 (Apple Git-155) |
| `core.hooksPath` (global, effective in the worktree) | `~/.config/git/hooks` |
| `diff.renames` | unset, so git's default applies |
| `diff.renameLimit` | unset, so git's default applies |

## Home guard (T004)

`/tmp/skilled-probes-003/home-guard-before.txt` holds the SHA-256 of 53 live configuration files and the link targets of the seven global hooks, taken after the home scan and before any runtime ran. The files are the seven hook links, `~/.codex/hooks.json`, `config.toml`, `AGENTS.md`, `rules/default.rules`, the 38 `~/.codex/prompts/*.md` stubs, `~/.hermes/config.yaml`, `~/.zshrc` and three `~/.pi/agent/` files. `~/.claude.json` is left out because the running Claude Code session rewrites it continuously, and so are the `~/.pi/agent` links into the repository, whose targets are tracked files. Live runs export `SYSTEM_HOOKS_DISABLED=1`, so repository plugins stay inert.

## After the probes (T021)

| Capture | Compared with | Result |
|---------|---------------|--------|
| `git status --porcelain` in worktree 055 | `wt-status-before` | one new line, `?? .../003-layout-probes/probes/`, which holds this phase's records. Nothing else changed |
| `git status --porcelain` in the main checkout | `main-status-before` | 22 new lines, all from this session's authorized goal-send edits in 038/013: `AGENTS.md`, `goal.md.tmpl`, the goal playbook, system-spec-kit `SKILL.md`, five speckit command YAMLs, `goal-slice.cjs` and its test, the golden snapshot, the trigger index and its three fixtures, two Hermes skill copies and 038's docs and metadata. None came from a probe |
| Live home configuration hashes and hook link targets | `home-guard-before.txt` | unchanged |

Probe side effects outside `/tmp`:
- The phase's own `probes/` records.
- The ignored skill-advisor `node_modules`, `dist` and database that the 18:31Z Pi smoke test bootstrapped in worktree 055 (`untracked-ignored-files.md`).
- A rewrite of `~/.cursor/skills-cursor/.sync-manifest.json` by the Cursor rows, a Cursor-managed cache outside the guarded set.
