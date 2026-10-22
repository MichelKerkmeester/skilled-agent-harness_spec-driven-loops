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

The setup script at `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` has four modes: `both`, `v1`, `v2` and `check`. `both` installs v1 into `~/.local` and v2 into `~/.local/opencode-v2`, then writes an `opencode2` launcher that sets `OPENCODE_DB`. Without it OpenCode 2 opens v1's `opencode.db` and migrates it in place. Homebrew's formula is v2-only. `opencode upgrade --major` removes v1, so use the setup script when you want both. Both versions share one `~/.config/opencode` folder.

#### Tested Live on Both Versions

All 17 plugins ran live on OpenCode 1.19.3 and 2.0.32. Each showed its expected effect on both. The run happened twice, once when the work was finished and again on the final tree after later fixes. Three automated checks run in CI on every pull request and push that touches their files. The OpenCode Dual-Version Battery installs each version and checks that every plugin loads and is active. It also checks that the repository's skills are visible and fails when a command file is missing or a version lists a non-command file as a command. The other two are OpenCode Plugin Tests and Hook Node Tests. The review covered 323 files in the plugin folder and the hook tree against the framework's own code standards. All 5 critical and 47 high-severity findings were fixed. Separate read-only model sessions reviewed the changes before they shipped.

| Suite | Tests passing |
|---|---|
| OpenCode plugins | 516 |
| Hook node tests | 886 |
| Hook vitest tests | 452 |
| Version battery unit tests | 55 |
