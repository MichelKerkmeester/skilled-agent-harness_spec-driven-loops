&nbsp;

## Code Standards

#### The Code Check Gets Its Own Name

The framework's code check was called `sk-code-opencode`, a name that kept colliding with the OpenCode runtime. It is now `sk-code-skilled`, with routing alias `code-skilled` and surface id `SKILLED`, the name the checks report under. What it checks has not changed.

**Breaking:** anything that matched the surface id `OPENCODE` must now match `SKILLED`, and links to `sk-code/sk-code-opencode/` must point to `sk-code/sk-code-skilled/`.

&nbsp;

## Environment Settings

#### Every Setting Is Listed and Shown

`.env.example` now names about 120 settings it was missing, the whole session-relaunch set among them, each with its default and a line on what it does. Two new sections cover session relaunch and the doctor, tooling and test-runner settings. `/doctor:env` now adds every setting `ENV-REFERENCE.md` misses and saves any switch whose reader takes it from `hook-flags.env`, such as the hand-over notice. It keeps the Code Mode provider keys hidden. The README's Environment Settings section says where each belongs: a shell export, `hook-flags.env`, Claude Code's `settings.local.json` or `.env`.

&nbsp;

## Reliability Fixes

#### Advisor Lookups Queue Instead of Piling Up

Two different prompts arriving at the same moment each started their own advisor process, and a lookup that had to wait had no deadline. At most two now run at once and the rest queue in order. A queued lookup gives up after the normal advisor timeout, then skips the advisor rather than running late. A repeat lookup reuses the earlier check of a file while that file is unchanged. On Pi the advisor no longer prints a raw diagnostic over the input line, though the record still goes to disk.

#### Hand-Over Counts Stop Racing

Two hooks updating a session's hand-over count at the same moment no longer write the same number, because the update takes a lock that records who holds it. A lock is a marker only one update can hold at a time. When the lock is busy, the count is left alone and reported as not saved. A lock is broken only when its owner is dead or its stale record has outlived the window. An iteration setting is accepted only from inside the project, so a file or link outside it can no longer unlock the exemption.

#### Fresh Worktrees Build What They Need

A fresh worktree could not run the two Pi extension suites or the DESIGN.md backend suite, because the installer skipped the packages they need. It now installs them and says why a run failed. The check for a stale build now looks at the files on disk, so an edit not yet staged in git or a deleted input triggers a rebuild, and a build that writes nothing new no longer rebuilds every time. Pointing the installer at a subfolder now installs what the whole worktree needs.

#### A Corrupt Goal Record Reads Empty

A damaged current goal record used to bring back an older stale goal, and now it reads as no goal. An archive file holding something other than a goal record, such as an empty entry, used to hide every archived goal and is now skipped. A packet `goal.md` linked to a file outside the workspace is no longer read as the session goal.

#### Smaller Fixes Across the Stack

The git pre-commit installer now works in a linked worktree and with a custom `core.hooksPath` setting, because it installs where git looks for hooks. The shared reader for input from another program now stops at 64 MiB. On OpenCode the session-cleanup guards could freeze the event stream for about 32 seconds, and they now run in parallel. Pi's `--fast` flag now registers in the main checkout, and sk-vision on OpenCode 2 releases everything it holds at shutdown.

&nbsp;

## Upgrade Notes

- **Turn on the hand-over.** Add `source <checkout>/.skilled/bin/skilled-loop-shell.sh` to `~/.zshrc` or `~/.bashrc`, open a new terminal and remove any `claude` alias, because an alias wins over the wrapper.
- **Link every runtime folder.** Link `.claude`, `.codex`, `.opencode`, `.pi` and `.hermes` beside a linked `.skilled`.
- **Keep `repo-guards` listed for Hermes.** Leave it under `plugins.enabled` in `~/.hermes/config.yaml`.
- **Approve Codex hooks once.** Say yes the first time Codex starts in a project.
- **Ask for a hand-over notice.** Add `SESSION_RELAUNCH_NOTIFY_HOPS=1` to `.skilled/hooks/hook-flags.env`.
- **Install both versions in one step.** Run `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh both`, or `check` to see your current layout without changing it.
- **Never run `opencode upgrade --major` beside v1.** Use the setup script instead.
- **Pin OpenCode 1.** With both versions installed, set `OPENCODE_BIN=opencode`.
- **Set up `llmgateway` on each version or pass `--model`.** An unpinned dispatch now uses `llmgateway/deepseek-v4.1-flash` on both versions.
- **Repoint the renamed surface.** Replace `sk-code-opencode` with `sk-code-skilled` and the surface id `OPENCODE` with `SKILLED` in your own scripts and links.
- **Repoint links to command-support.** Point `.skilled/command-support/` links at the same path under `.skilled/commands/`, with `.markdown` in place of `.md`.
- **See every setting.** Run `/doctor:env list` and read the README's Environment Settings section before copying a line from `.env.example`.
- **Pass a workspace to goal session actions.** Add `--workspace <repo root>` to every `goal.cjs` session call.
