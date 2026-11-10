---
title: "v4.0.0.13, Sessions That Never Run Out and Every Plugin on OpenCode 1 and 2"
description: "A session near its context limit now hands itself to a fresh session in the same terminal. All 17 plugins, the agents and the commands run on OpenCode 1 and 2, with the plugins showing their effect live on OpenCode 1.19.3 and 2.0.32."
trigger_phrases:
  - "v4.0.0.13 release notes"
  - "skilled v4.0.0.13"
  - "in-session handover"
  - "opencode 1 and 2 support"
  - "session relaunch loop"
importance_tier: "normal"
contextType: "general"
---
# v4.0.0.13, Sessions That Never Run Out and Every Plugin on OpenCode 1 and 2

You can now carry a long session past its context limit without closing the terminal. The same release makes every plugin, agent and command work on OpenCode 1 and OpenCode 2.

When a session nears 80% of its context window, it writes a handoff note, saves continuity and ends itself. A fresh session starts in the same terminal, claims the note and continues the work. Claude, Pi, OpenCode, Codex and Hermes hop on their own. Cursor and Devin hop when you run `/speckit:handoff`, which Cursor names `/speckit-handoff`.

All 17 plugins run on OpenCode 1 and OpenCode 2 from one source, sixteen through a shared bridge and sk-vision on its own. The agents, the commands and one `opencode.json` are shared too. One setup script installs both versions side by side. `cli-opencode` dispatches to the one it finds.

The rest of the release renames the framework code surface to `sk-code-skilled` and strengthens state and reliability. The local embedding model now frees its memory when idle, while the ClickUp, Figma and Code Mode skills got install and safety fixes.

> Spec folders: `specs/hooks/023-session-relaunch-loop` (Level 2), `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat` (Level 2), `specs/sk-code/012-sk-code-skilled-rename` (Level 2), `specs/system-skill-advisor/037-advisor-daemon-memory` (Level 2), `specs/system-speckit/049-doctor-audit-followups` phases 032 and 033 (Level 2), `specs/mcp-tooling/023-vendored-copy-review-fixes` and `specs/mcp-tooling/024-code-mode-js-yaml-override`

&nbsp;

## Why This Release

A long task used to end in auto-compaction, which squeezes the conversation into a summary and loses detail. OpenCode 2 carried a second loss: it loaded none of the framework's plugins, so moving to it meant losing the guards, the goal tracking and the advisor.

Now a session near its limit writes a note that a fresh session claims. Every plugin, agent and command runs on either OpenCode version.

&nbsp;

## What's New at a Glance

- **A full session restarts itself.** Near 80% of its context window, a session writes a handoff note, saves continuity and ends. A fresh session in the same terminal claims the note and continues.
- **Every plugin works on OpenCode 1 and 2.** All 17 plugins showed their effect live on OpenCode 1.19.3 and 2.0.32. The plugin, hook and dual-version checks now run in CI on every pull request and push that touches their files.
- **One line in your shell turns it on.** Sourcing `.skilled/bin/skilled-loop-shell.sh` makes your runtimes start under the loop when you type their names. A project whose `.skilled` is a symlink to this checkout starts under the loop and hops on its own when it also links its five runtime folders.
- **Dispatch follows the version you have installed.** `cli-opencode` asks the binary for its version, takes `opencode2` before `opencode` unless you set `OPENCODE_BIN`, then builds `run --standalone` with the variant attached as `provider/model#variant` on OpenCode 2, while the guards know `opencode2` and apply each rule to the version it was written for. An unpinned dispatch uses `llmgateway/deepseek-v4.1-flash` at `max` on both.
- **Every hop leaves a record.** Each hand-over, kept note, claim, finish and stalled hop adds a line to a hop history you can read with one command or in `/doctor:setup`, which also names any note nobody claimed, while `SESSION_RELAUNCH_NOTIFY_HOPS=1` adds a macOS notice on each hand-over. Thirteen situations ran live on each of Claude, Pi and OpenCode, where four faults surfaced and are now fixed.
- **Both versions install side by side.** One setup script installs v1 into `~/.local` and v2 into `~/.local/opencode-v2`, then writes an `opencode2` launcher that sets `OPENCODE_DB` so v2 keeps its own database. The 12 files in `.skilled/commands/` that are not commands now use `.markdown`, so your command list is unchanged at 40 commands on OpenCode 1 and 42 on OpenCode 2.
- **`sk-code-opencode` is now `sk-code-skilled`.** The framework code surface no longer shares a name with the OpenCode runtime. Its surface id is now `SKILLED`.
- **`/doctor:env` now sees every setting.** `.env.example` now names every setting the code reads with its default. `/doctor:env` shows and saves each one, while the README says where to set a value on your own machine.
- **State survives a rebuild.** Older research and review logs keep every row when the loop rebuilds its state, while a corrupt goal record reads as no goal. A fresh worktree now provisions the package trees it needs.
- **Reliability fixes across the stack.** Advisor lookups queue and give up on time, while hand-off counts update under a lock and the git pre-commit installer finds the hooks folder. The OpenCode session-cleanup guards no longer stall the event stream.
- **Local model servers free their memory.** The hf-local model server, about 470 MB, unloads after 10 minutes idle. The next launcher reaps one whose launcher died.
- **ClickUp, Figma and Code Mode are safer to install.** The ClickUp and Figma skills fix 24 review findings. A fresh Code Mode install now starts again.

&nbsp;

## In-Session Handover

A long session no longer ends at its context limit. Near the limit it writes a handoff note, ends itself and a fresh session in the same terminal carries on.

#### The Session Hands Over at 80 Percent

A hook reads how full the context window is. At 80% it asks the session to finish if a few steps remain, and otherwise to write a handoff note with the goal, what is done, the remaining work and anything in flight. It saves continuity and marks the note ready. A second reminder comes 5% later if the first was missed. If you told the session not to hand off, it keeps working and auto-compaction takes over.

#### A Fresh Session Picks Up the Note

When the session goes idle, a small watcher ends it and `skilled-loop` restarts the same runtime in the same terminal. The new session claims the note, resumes the spec folder and works only on what remains. It keeps your spec-folder answer, so it does not ask the documentation question again. A hop cap of ten and a ten-minute freshness limit stop a runaway chain.

#### Five Runtimes Hop on Their Own

Claude, Pi, OpenCode, Codex and Hermes each read their own usage signal and hop without you. Cursor and Devin run under the loop too, but they hop only after `/speckit:handoff`, which Cursor names `/speckit-handoff`, because neither offers a safe end-of-session event.

#### A Stuck Hop Leaves a Trail

When a session will not go idle within 30 seconds, the watcher stands down and sends a macOS notification titled "Session relaunch needs attention (killer timed out)" with the exact command to continue by hand. The note stays open, and the claim command prints when the session exits. On Pi and OpenCode, a turn you start just after the session was readied cancels the hop at once, so your new message is never cut off.

Each hop writes a line to `.skilled/skills/.state/session-relaunch/hop-history.log`. `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history` prints the latest lines, and `/doctor:setup` shows the last one. Set `SESSION_RELAUNCH_NOTIFY_HOPS=1` in `.skilled/hooks/hook-flags.env` for a macOS notice titled "Session handed over" on each hand-over. It is off unless you set it.

#### Sessions Outside the Loop Keep Their Place

A session started before you added the shell line runs outside the loop and cannot hop. At 80% the hook asks it to write the same note and run `session-relaunch.cjs keep`, then it carries on. On Claude Code, Pi and OpenCode, a hook after each compaction points it back at its note, so it claims the note and continues. Codex and Hermes print the claim command when you keep the note and follow it after compaction.

A sub-agent never hands over its parent's session. Claude Code forks and agents are refused any handoff command, and OpenCode `task` sub-agents get no reminder. A `claude -p` or `pi -p` started inside a looped session runs outside the loop and cannot restart the session that started it.

#### Proven Live in Thirteen Situations

Thirteen situations ran live on each of Claude, Pi and OpenCode, among them two sessions at once, an interrupted hop and a busy hand-over. The runs found four faults, now fixed. Two OpenCode sessions started in the same second could write over each other's note. A message sent at hand-over could be cut off on Pi and OpenCode. The shell line's commands failed inside Claude Code's tool shell. An interrupted hop now prints a warning with the command to continue.

&nbsp;

## OpenCode 1 and 2

All 17 plugins, the agents, the commands and one config now run on OpenCode 1 and OpenCode 2 from one source. They install side by side and were tested live at 1.19.3 and 2.0.32.

#### One Source for All 17 Plugins

All 17 plugins run on both versions from one source file each. Sixteen share one bridge that adapts OpenCode 2, and sk-vision exports both shapes itself. The bridge reports v2's `shell` tool as `bash` and its `subagent` tool as `task`. Before it, seven plugins loaded on OpenCode 2 but did nothing. sk-vision now runs there too. With automatic inspection on, an attached image gets its vision evidence through v2's prompt hook, and its 13 tools register on v2.

#### Agents and Commands Stay Shared

Both versions read one set of agents, one set of commands and a single `opencode.json`. The config keeps the v1 shape and OpenCode 2 converts it when it loads. Both versions register every `.md` file under a `commands/` folder as a command, so the 12 files in `.skilled/commands/` that are not commands now use `.markdown`. Your command list is unchanged at 40 on OpenCode 1 and 42 on OpenCode 2, its two built-ins included. Agent `temperature` has no effect on OpenCode 2.0.32 with the `openai-compatible` package, the only package tested.

#### Dispatch and Guards Know the Version

`cli-opencode` asks the binary it picked for its version with `--version`. With no preference set, it takes `opencode2` before `opencode` within each `PATH` directory. Set `OPENCODE_BIN` to choose the binary yourself. On OpenCode 2 the dispatch builds `run --standalone` and attaches the variant to the model id as `provider/model#variant`. The dispatch guards recognize `opencode2` and apply each rule to the version that rule was written for. On OpenCode 2 a slash-command route the guards cannot check yet warns you instead of blocking. On Pi, a request authorizes a CLI executor only when you name it in plain text. A name inside a quote, a backtick, a command substitution or a negated sentence no longer counts.

#### One Default Model on Both Versions

An unpinned dispatch uses `llmgateway/deepseek-v4.1-flash` at its `max` variant on both versions, with `--variant max` on OpenCode 1 and `#max` on OpenCode 2. Before, the default depended on the version. Your unpinned dispatch now behaves the same whichever version runs it.

#### Both Versions Install Side by Side

The setup script at `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` has four modes: `both`, `v1`, `v2` and `check`. `both` installs v1 into `~/.local` and v2 into `~/.local/opencode-v2`, then writes an `opencode2` launcher that sets `OPENCODE_DB`. Without it OpenCode 2 is documented to open v1's `opencode.db` and migrate it in place. Homebrew's formula is v2-only. `opencode upgrade --major` removes v1, so use the setup script when you want both. Both versions share one `~/.config/opencode` folder, so a key you write for one version is live on the other.

#### Tested Live on Both Versions

All 17 plugins ran live on OpenCode 1.19.3 and 2.0.32. Each showed its expected effect on both. The run happened twice, once when the work was finished and again on the final tree after later fixes. Three automated checks run in CI on every pull request and push that touches their files. The OpenCode Dual-Version Battery installs each version and checks that every plugin loads and is active. It also checks that the repository's skills are visible and fails when a command file is missing or a version lists a non-command file as a command. The other two are OpenCode Plugin Tests and Hook Node Tests. The review covered 323 files in the plugin folder and the hook tree against the framework's own code standards. All 5 critical and 47 high-severity findings were fixed. Separate read-only model sessions reviewed the changes before they shipped.

| Suite | Tests passing |
|---|---|
| OpenCode plugins | 516 |
| Hook node tests | 886 |
| Hook vitest tests | 452 |
| Version battery unit tests | 55 |

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

With Ollama off, embeddings fall back to the local Hugging Face model server. It used to hold about 470 MB as long as its launcher ran and now unloads after 10 minutes without an embedding. The next embedding reloads it in about half a second. `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` sets the minutes, and `0` keeps it loaded. A launcher killed outright used to leave its server loaded with no owner. The next launcher now reaps it, and a supervised one takes its place. `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` turns that off for a server under launchd or another init system.

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

A fresh worktree could not run the two Pi extension suites or the DESIGN.md backend suite because provisioning skipped their package trees. It now installs them and says why a run failed. Staleness now fingerprints inputs on disk, so an unstaged edit or a deleted input triggers a rebuild, and a build that writes nothing new no longer rebuilds every time. Pointing provisioning at a subdirectory now provisions the whole worktree.

#### Smaller Fixes Across the Stack

The git pre-commit installer now works in a linked worktree and with a custom `core.hooksPath`, because it installs where git looks for hooks. The shared stdin reader now stops at 64 MiB. On OpenCode the session-cleanup guards could stall the event stream for about 32 seconds, and they now run in parallel. Pi's `--fast` flag now registers in the main checkout, and sk-vision on OpenCode 2 releases all of its parts at shutdown.

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
