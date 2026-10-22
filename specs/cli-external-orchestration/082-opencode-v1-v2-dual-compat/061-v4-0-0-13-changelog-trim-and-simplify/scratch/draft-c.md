&nbsp;

## OpenCode 1 and 2

The 17 plugins, the agents, the commands and one config run on OpenCode 1 and OpenCode 2 from one source. The two versions install side by side.

#### All 17 Plugins Run on Both

All 17 plugins run on both versions from one source file each. Sixteen share one adapter that lets them work on OpenCode 2, and sk-vision ships one file that loads on both versions. The shared adapter reports version 2's `shell` tool as `bash` and its `subagent` tool as `task`. Before that adapter, seven plugins loaded on OpenCode 2 and did nothing. sk-vision now runs there too. With automatic inspection on, an image you attach gets its vision results through version 2's prompt hook, and its 13 tools register on version 2.

#### Agents and Commands Stay Shared

You keep one set of agents, one set of commands and a single `opencode.json` for both versions. The file keeps the version 1 shape and OpenCode 2 converts it when it loads. Both versions treat every `.md` file under a `commands/` folder as a command. The 12 files in `.skilled/commands/` that are not commands now use `.markdown`, so your command list is unchanged at 40 on OpenCode 1 and 42 on OpenCode 2, its two built-ins included. Agent `temperature` has no effect on OpenCode 2.0.32 with the `openai-compatible` package, the only package tested.

#### Both Versions Install Side by Side

One script installs both versions side by side. The setup script at `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` has four modes: `both`, `v1`, `v2` and `check`. Every step prints its rollback line, so you can reverse each move. `both` installs v1 into `~/.local` and v2 into `~/.local/opencode-v2`, then writes an `opencode2` launcher that sets `OPENCODE_DB`. Without that launcher OpenCode 2 is documented to open v1's `opencode.db` and migrate it in place. Homebrew's formula is v2-only and cannot sit beside a v1 install. `opencode upgrade --major` removes v1, so use the setup script when you want both. Both versions share one `~/.config/opencode` folder, so a key you write for one version is live on the other.

#### Dispatch and Guards Know the Version

The dispatch and the guards both know which version you run, so the right binary and the right rules apply. `cli-opencode` asks the binary it picked for its version with `--version`. With no preference set, it takes `opencode2` before `opencode` within each `PATH` directory. Set `OPENCODE_BIN` to choose the binary yourself. On OpenCode 2 the dispatch builds `run --standalone` and attaches the variant to the model id as `provider/model#variant`. The dispatch guards recognize `opencode2` and apply each rule to the version that rule was written for. On OpenCode 2 a slash-command route the guards cannot check yet warns you instead of blocking. On Pi, a request authorizes a CLI executor only when you name it in plain text. A name inside a quote, a backtick, a command substitution or a negated sentence no longer counts.

#### One Default Model on Both Versions

When you do not pin a model, dispatch behaves the same on either version. It uses `llmgateway/deepseek-v4.1-flash` at its `max` variant on both versions, with `--variant max` on OpenCode 1 and `#max` on OpenCode 2. Before, the default depended on the version. `opencode-go` remains a provider you can select on OpenCode 1.

#### Tested Live on Both Versions

All 17 plugins ran live on OpenCode 1.19.3 and 2.0.32, and each showed its expected effect on both. The run happened twice, once when the work was finished and again on the final files after later fixes. Three automated checks run in CI on every pull request and push that touches their files. The OpenCode Dual-Version Battery installs each version and checks that every plugin loads and is active. It also checks that the repository's skills are visible and fails when a command file is missing or a version lists a non-command file as a command. The other two are OpenCode Plugin Tests and Hook Node Tests. The review covered 323 files in the plugin folder and the hook tree against the framework's own code standards. All 5 critical and 47 high-severity findings were fixed. Separate read-only model sessions reviewed the changes before they shipped.

| Suite | Tests passing |
|---|---|
| OpenCode plugins | 516 |
| Hook node tests | 886 |
| Hook vitest tests | 452 |
| Version battery unit tests | 55 |
