&nbsp;

## Environment Settings

#### Every Setting Is Listed and Shown

`.env.example` now names about 120 settings it was missing, the whole session-relaunch set among them, each with its default and a line on what it does. Two new sections cover session relaunch and the doctor, tooling and test-runner settings. `/doctor:env` now adds every setting `ENV-REFERENCE.md` misses, saves any switch whose reader takes it from `hook-flags.env`, such as the hop notice, and keeps the Code Mode provider keys hidden. The README's Environment Settings section says where each belongs: a shell export, `hook-flags.env`, Claude Code's `settings.local.json` or `.env`.

&nbsp;

## Framework Code Standards

#### The Framework Surface Has Its Own Name

The framework's sk-code surface was `sk-code-opencode`, a name that kept colliding with the OpenCode runtime. It is now `sk-code-skilled`, with routing alias `code-skilled` and surface id `SKILLED`.

**Breaking:** anything that matched the surface id `OPENCODE` must now match `SKILLED`, and links to `sk-code/sk-code-opencode/` must point to `sk-code/sk-code-skilled/`.

&nbsp;

## Resident Memory

#### The Local Model Frees Its Memory

With Ollama off, embeddings fall back to the local Hugging Face model server. It used to hold about 470 MB as long as its launcher ran and now unloads after 10 minutes without an embedding. `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` sets the minutes, and `0` keeps it loaded. A launcher killed outright used to leave its server loaded with no owner. The next launcher now reaps it, and a supervised one takes its place. `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` turns that off for a server under launchd or another init system.

#### Leftover Processes Show Up

Leftover test runners, tail monitors, searches, executor workers and model servers can outlive their session. One cleanup found 22 of them holding about 315 MB. `/doctor:setup` now shows their count and size on one line. `node .skilled/commands/doctor/scripts/orphan-process-check.cjs --reap` lists them, and `--yes` stops them after re-checking each command, age and owner. It never lists the daemons meant to stay up.

#### A Separate Launcher Protects the Model

Folding the advisor launcher into the advisor server would save about 50 MB per checkout. It stays separate, because the launcher is what stops the model server when the advisor server crashes.

&nbsp;

## MCP Tooling

#### ClickUp and Figma Install More Safely

A review of the ClickUp and Figma skills raised 24 findings, all fixed at the source. Doctor scripts now find `.utcp_config.json` from any folder below it. `connect-safe` exits 2 with no terminal attached. `figma-cli` must prove it is the expected binary. `install.sh` fetches a pinned commit, and `cupt add` sends the plain description.

#### A Fresh Code Mode Install Starts

A global `js-yaml` override forced a version one dependency could not use, so a clean `npm ci` built a Code Mode server that crashed at start-up. A scoped override fixes it.

&nbsp;

## Reliability Fixes

#### Advisor Lookups Queue Instead of Piling Up

Two unique prompts arriving together each started an advisor child, and a queued lookup had no deadline. At most two now run at once and the rest queue in order. A queued lookup gives up after the normal advisor timeout, then skips the advisor rather than running late. Repeat lookups reuse a file's digest while it is unchanged. On Pi the advisor no longer prints a JSON diagnostic over the input line, though the record still goes to disk.

#### Hand-Off Counts Stop Racing

Two hooks updating a session's hand-off count at once no longer write the same number, because the update takes a lock that records its owner. When the lock is busy, the count is left alone and reported as not saved. A lock is broken only when its owner is dead or its stale record has outlived the window. An iteration config is accepted only from inside the project, so a file or symlink outside it can no longer unlock the exemption.

#### A Corrupt Goal Record Reads Empty

A corrupt current goal record used to bring back an older stale goal, and now it reads as no goal. An archive file holding something other than a goal record, such as a bare null, no longer hides every archived goal. A packet `goal.md` symlinked to a file outside the workspace is no longer read as the session goal.

#### Fresh Worktrees Build What They Need

A fresh worktree could not run the two Pi extension suites or the DESIGN.md backend suite because provisioning skipped their package trees. It now installs them and says why a run failed. Staleness now fingerprints inputs on disk, so an unstaged edit or a deleted input triggers a rebuild, while a build that writes nothing new no longer runs. Pointing provisioning at a subdirectory now provisions the whole worktree.

#### Smaller Fixes Across the Stack

The git pre-commit installer now works in a linked worktree and with a custom `core.hooksPath`, because it installs where git looks for hooks. On OpenCode the session-cleanup guards could stall the event stream for about 32 seconds, and they now run in parallel. Pi's `--fast` flag now registers in the main checkout, and sk-vision on OpenCode 2 releases all of its parts at shutdown.

&nbsp;

## Upgrade Notes

- **Turn on the handover.** Add `source <checkout>/.skilled/bin/skilled-loop-shell.sh` to `~/.zshrc` or `~/.bashrc`, open a new terminal and remove any `claude` alias.
- **Link every runtime folder.** Link `.claude`, `.codex`, `.opencode`, `.pi` and `.hermes` beside a linked `.skilled`.
- **Keep `repo-guards` listed for Hermes.** Leave it under `plugins.enabled` in `~/.hermes/config.yaml`.
- **Approve Codex hooks once.** Say yes the first time Codex starts in a project.
- **Ask for a hop notice.** Add `SESSION_RELAUNCH_NOTIFY_HOPS=1` to `.skilled/hooks/hook-flags.env`.
- **Install both versions in one step.** Run `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh both`, or `check` to see your current layout without changing it.
- **Never run `opencode upgrade --major` beside v1.** Use the setup script instead.
- **Pin OpenCode 1.** With both versions installed, set `OPENCODE_BIN=opencode`.
- **Set up `llmgateway` on each version or pass `--model`.** An unpinned dispatch now uses `llmgateway/deepseek-v4.1-flash` on both versions.
- **See every setting.** Run `/doctor:env list` and read the README's Environment Settings section before copying a line from `.env.example`.
- **Repoint the renamed surface.** Replace `sk-code-opencode` with `sk-code-skilled` and the surface id `OPENCODE` with `SKILLED` in your own scripts and links.
- **Repoint links to command-support.** Point `.skilled/command-support/` links at the same path under `.skilled/commands/`, with `.markdown` in place of `.md`.
- **Pass a workspace to goal session actions.** Add `--workspace <repo root>` to every `goal.cjs` session call.
- **Keep the model loaded.** Set `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN=0`, and `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` if an init system runs it on the shared socket.
