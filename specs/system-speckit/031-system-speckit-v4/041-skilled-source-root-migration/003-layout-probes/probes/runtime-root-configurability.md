---
title: "Runtime root configurability"
description: "Question 1: whether each of the seven runtimes can load its assets from a directory other than its own name, answered from help captures, binary strings and installed source by seven DeepSeek lanes and verified by the orchestrator."
---

# Runtime root configurability (Q1)

**Result:** no runtime can rename its own project directory. Each one hardcodes its project folder name (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`, `.hermes`, `.opencode`), so every runtime keeps its own directory as a consumer: a link, a generated tree or a synced copy. Several accept additional roots, but only additively: Claude Code and Cursor through `--plugin-dir`, Pi through `--extension`/`--skill` and settings arrays, Hermes through `skills.external_dirs`, opencode through `OPENCODE_CONFIG_DIR` and `skills.paths`. Four relocate a user-level home through an environment variable: `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `PI_CODING_AGENT_DIR`, `HERMES_HOME`. Devin's project scan follows a compiled provider roster that includes `opencode`, and that roster is the only reason Devin finds `.opencode/skills` without a mirror.


All results here ran against worktree 055 at base `d26f0c60ca88dab922752ab3d9ce8a07463934ae`.

## Method

Seven read-only DeepSeek V4.1 Flash lanes, one runtime each, dispatched from worktree 055 with the brief shape in `../plan.md` §Delegation.
- **Inputs:** help text captured under `captures/`, and `strings -n 6` extracts of the four compiled binaries under `/tmp/skilled-probes-003/strings/`.
- **Source:** the Pi, Hermes and Cursor lanes also read installed JavaScript or Python.
- **First dispatch (19:21Z):** all seven were rejected. Pi sent its system prompt in the `developer` role, which the gateway now refuses for this model with HTTP 400 `The request was rejected` (`invalid_value`). Proven by the same request over curl: 400 with `developer`, 200 with `system`.
- **Second dispatch (19:24Z):** all seven ran with `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent`, which holds a copy of `.pi/models.json` whose `llmgateway` provider sets `compat.supportsDeveloperRole: false`, the switch Pi documents in `docs/models.md:39`.

| Unit | Exit | Window (UTC) | Bytes |
|------|------|--------------|-------|
| u1-claude-code-roots | 0 | 19:24:32 to 19:36:11 | 6,277 |
| u2-codex-roots | 0 | 19:24:32 to 19:44:42 | 7,023 |
| u3-cursor-agent-roots | 0 | 19:24:32 to 20:00:27 | 8,763 |
| u4-devin-roots | 0 | 19:24:32 to 19:32:27 | 6,223 |
| u5-pi-roots | 0 | 19:24:32 to 19:28:57 | 5,553 |
| u6-hermes-roots | 0 | 19:24:32 to 19:37:50 | 4,816 |
| u7-opencode-roots | 0 | 19:24:32 to 19:43:00 | 7,029 |

## Claude Code 2.1.273 (unit U1)

**Verdict:** Plugins load from any path through `--plugin-dir`, and `CLAUDE_CONFIG_DIR` moves the user config home. The project `.claude/` surfaces have no documented relocation, so the lane marks commands and agent directories UNKNOWN rather than fixed.

### Lane return

Both files were read in full. `HELP` = `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt`; `STR` = `/tmp/skilled-probes-003/strings/claude-code.txt`. In `STR`, the number after the sha (e.g. `153261:`) is the raw extract's own `rg` line; `STR:n` below means file line `n`.

**Answer in one line:** plugins relocate directly (`--plugin-dir`, `--plugin-url`); skill, agent and hook content relocates only by riding inside such a plugin; `CLAUDE_CONFIG_DIR` is the one environment variable that moves the user-level config home; no flag, environment variable or config key in either file repoints the bare `.claude/commands` scan.

| Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line) |
|---|---|---|---|---|
| Skills | `.claude/skills/` (project) and `~/.claude/skills/` (user) | `--plugin-dir <path>` loads a plugin "from a directory or .zip" (session-only, repeatable), and `.claude/skills/<name>/` entries are themselves plugin sources (`name@skills-dir` sentinel, versus `name@inline` for `--plugin-dir`), so the same plugin shape loads skill content from an arbitrary directory. `CLAUDE_CONFIG_DIR` (env var, "set it in the shell") names the config home that defaults from `$HOME` — attested for "your own settings" and user-level output-styles, inferred for skills. `/add-dir` appears only as an access grant for a root that "leads outside the working directory" (fragments). No flag/env/config key renames the bare skills directory. | Configurable (plugin packaging + user-level config home; both by composing two lines — no single settling line) | Default: STR:17, STR:53, STR:54. Override: HELP:156-160, HELP:50-54, STR:6, STR:56; STR:43, STR:44, STR:58; STR:19, STR:20, HELP:10-11 |
| Commands | `.claude/commands` (scope — project vs user — not stated) | None documented in either file. `--disable-slash-commands` only disables ("Disable all skills", HELP:73); the only loading line is the truncated pair about a root outside the working directories whose "skills, commands, and agents weren't loaded" until `/add-dir` (STR:19, STR:20). No config key found. | UNKNOWN (no line settles an override; `fixed name` also not settled, since the extract is a filtered, truncated view) | Default: STR:25. Override: HELP:73, STR:19, STR:20, HELP:10-11. Verdict: no settling line |
| Agents | `.claude/agents/` (`*.md` frontmatter) | `--agents <json>` defines custom agents inline (not a path); the SDK `agents` option is the inline equivalent. "Plugin agents" exist as a category (a setting "is ignored for plugin agents. Use .claude/agents/ for this level of control"), and plugins load from any path via `--plugin-dir`, but no line shows a plugin agents path. No `--agents-dir`/env/config directory key found. | Configurable for definitions (inline JSON); UNKNOWN for a directory other than `.claude/agents/` (plugin-carried agents attested as a category only) | Default: STR:27, STR:35, STR:4. Override: HELP:14-17, STR:35, STR:36, STR:41, HELP:156-160 |
| Hooks | Plugin hooks at `~/.claude/plugins/*/hooks/hooks.json`; settings-level hook registration: UNKNOWN (not located in either file) | None for a hooks directory. `--settings <file-or-json>` takes a settings file from an arbitrary path, but neither file says hooks are registered there; plugin hooks ride along with `--plugin-dir` (composition of HELP:156-160 with STR:23). `--bare` skips hooks and `--safe-mode` disables them — disable, not relocation. | Configurable for plugin-carried hooks (composition, not a single line); UNKNOWN for settings-level hooks | Default: STR:23. Override: HELP:221-222, HELP:156-160; disable-only HELP:40-44, HELP:206-216 |
| Plugins | User-level plugins root `~/.claude/plugins/`; source identifiers are sentinel-typed (`name@marketplace`, `name@skills-dir`, `name@inline`, `name@synced`, `name@builtin`) | `--plugin-dir <path>` — "Load a plugin from a directory or .zip for this session only", repeatable; `--plugin-url <url>` — fetch a plugin `.zip` from a URL, session-only. The SDK stdin `plugins` field under `--await-initialize` is the same list in `--plugin-dir` form (marked `@internal`). No line extends `CLAUDE_CONFIG_DIR` to `~/.claude/plugins` → UNKNOWN. | Configurable (direct) | Default: STR:23, STR:42, STR:56, HELP:283. Override: HELP:156-163; SDK form STR:57, STR:51 |

**Gaps (UNKNOWN)**

- `STR:2` is truncated mid-sentence (`CLAUDE_CONFIG_DIR no longer names `); whatever deprecation or rename it asserts is UNKNOWN and is not used above.
- Per-surface relocation by `CLAUDE_CONFIG_DIR` is nowhere stated by name for skills, commands, agents, hooks or plugins; only "your own settings" (`STR:44`) and the user-level output-styles folder (`STR:58`) carry the config-home rule — the skills mapping is inference.
- Commands: the absence of an override is a within-file absence only. `STR` is a pattern-filtered, truncated `strings` extract (`plan.md:164`), so a flag or config key that never co-occurs with the filtered literals would not appear; `HELP` is exhaustive for top-level flags and has none.
- Settings-level (non-plugin) hooks: no line locates a hooks file or key; `.claude/settings.json` appears in neither file.
- What a plugin may carry is never enumerated: skills rest on the sentinel equality (`STR:6`, `STR:56`), hooks on the plugin-hooks path (`STR:23`), agents only on the phrase "plugin agents" (`STR:41`); plugin commands are not attested at all.
- `STR:19`/`STR:20` are truncated at both ends; the condition under which a location's "skills, commands, and agents weren't loaded" is UNKNOWN.
- `--await-initialize` / SDK `plugins` (`STR:57`) is an `@internal` stdin protocol, not a CLI flag; whether it counts as a documented config key is outside these two files.
- User-level defaults for commands and agents are not named in either file (`.claude/commands`, `.claude/agents` scope is unstated), and no settings config key naming any of the five directories appears — the only settings flags are `--settings` (`HELP:221`) and `--setting-sources` (`HELP:219`).

### Verification

- Citations opened by the orchestrator: `claude-code-help.txt:156-157` (`--plugin-dir <path>  Load a plugin from a directory or .zip`) matched.

## Codex CLI 0.154.0 (unit U2)

**Verdict:** `CODEX_HOME` relocates the whole home (`config.toml`, `prompts/`, `hooks.json`), and `hooks.managed_dir` is a config key. The project `.codex/` name and its `prompts/` and `agents/` subdirectories have no override.

### Lane return

Codex CLI 0.154.0 exposes one home-relocation environment variable and one hooks-directory config key pair; no flag renames `.codex/` itself.

Cited files (short names used in the table):
- `help` = /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt
- `dbg` = /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-debug-help.txt
- `str` = /tmp/skilled-probes-003/strings/codex.txt
- Supporting (outside the three required): `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`, `.../codex/sync-agents.cjs`, `.../codex/README.md`, `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/.opencode/bin/install-codex-hooks.mjs`, `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/.codex/SYNC.md`, `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/.opencode/skills/cli-external-orchestration/cli-codex/references/cli-reference.md`, `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/home-state-enumeration.md`, `/tmp/skilled-probes-003/logs/home-scan.tsv`

| Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line) |
|---|---|---|---|---|
| Codex home root (parent of `config.toml`, `prompts/`, `hooks.json`, `themes/`) — `str:11-12`, `help:46` | `~/.codex` — `help:46`; `str:11` | Environment variable `CODEX_HOME` (named in `-p` help and in the binary's own messages); no CLI flag for it appears anywhere in the complete option list — `help:85-86`; `str:3`; `str:11`; `help:44-135` | Configurable for the root — the whole home relocates; the subdirectory names stay fixed — `str:11-12`; `help:85-86` | `help:46`; `help:85-86`; `str:3`; `str:11`; `str:12`; `str:36`; `help:44-135` (no directory flag) |
| Custom prompts (`prompts/*.md` slash stubs) — `home-state-enumeration.md:9`; `str:4` | `~/.codex/prompts/` (the home set carrying the slash-prompt stubs); repo mirror `<repo>/.codex/prompts/` — `home-state-enumeration.md:9`; `home-scan.tsv:255`; `sync-prompts.cjs:22` | None found; UNKNOWN. The dump holds no prompts-directory path literal, only Rust module paths (`str:5-9`) and MCP methods (`str:19`, `str:29-30`); the nearest prompt keys are file-scoped, not directory-scoped: `model_instructions_file`, `experimental_compact_prompt_file` — `str:5-9`; `str:50`; `str:4` | Fixed name (`prompts`) under a movable home root; no prompts-directory override in these captures — `help:44-135`; `str:11-12` | `home-state-enumeration.md:9`; `home-state-enumeration.md:29`; `home-scan.tsv:255`; `sync-prompts.cjs:22`; `str:50` |
| Agents (persona TOMLs) — `cli-reference.md:389` (as the repo's own reference; not stated in the three probe files) | `<repo>/.codex/agents/*.toml` (13 generated files); distinct from the global instructions file `~/.codex/AGENTS.md` — `sync-agents.cjs:22`; `SYNC.md:28`; `home-state-enumeration.md:31` | UNKNOWN — no agents-directory key or path literal found; a role is described by `AgentRoleToml {description, config_file, nickname_candidates}` and the agents surface in config carries sizing keys (`max_threads`, `max_concurrent_threads_per_session`) — `str:38`; `str:50`; `str:52` | UNKNOWN — no line settles whether the load directory can be changed — `str:38`; `str:52`; `help:44-135` | `sync-agents.cjs:22`; `SYNC.md:28`; `str:38`; `str:50`; `str:52` |
| Hooks — `help:100-102`; `home-scan.tsv:5` | `~/.codex/hooks.json` (user-global; repo `.codex/hooks.json` is the source the installer pushes) — `install-codex-hooks.mjs:13-14`; `SYNC.md:18`; `home-scan.tsv:5` | Config keys `hooks.managed_dir` and `hooks.windows_managed_dir`, reachable as dotted overrides via `-c, --config key=value` — `str:52`; `str:35`; `help:45-51` | Configurable for the managed directory; the user-level name stays `hooks.json` inside the home — `str:52`; `str:35` | `install-codex-hooks.mjs:14`; `SYNC.md:18`; `home-scan.tsv:5`; `str:52`; `str:35`; `help:45-51` |
| Project-local `.codex/` tree name (repo layout `agents/`, `prompts/`, `hooks/`, `hooks.json`, `config.toml`) — `SYNC.md:26-34` | `<project root>/.codex/` — `SYNC.md:26-34`; `sync-prompts.cjs:22`; `sync-agents.cjs:22` | None found — no rename flag; `-C, --cd <DIR>` moves the working root and `--add-dir` adds writable roots, neither renames `.codex` — `help:104-105`; `help:110-111`; `help:44-135` | Fixed name (checked absence across the complete option list and the debug options) — `help:44-135`; `dbg:5-9`; `dbg:12-25` | `help:104-105`; `help:110-111`; `dbg:5-9`; `SYNC.md:16` (Codex consumes a transformed `.codex` tree rather than the shared trees) |

## Gaps (UNKNOWN)

- **Which prompts copy the CLI reads.** No line in the three probe files names a prompts directory; the home location rests on the probe's enumeration (`home-state-enumeration.md:9`, `home-state-enumeration.md:29`) and the generator's output dir (`sync-prompts.cjs:22`). Whether project-level `.codex/prompts/` is read at all is UNKNOWN.
- **Whether project-level `.codex/` discovery exists for prompts and agents** (as opposed to only the user home). None of the three files names a project-scoped `.codex` load path.
- **`CODEX_HOME` scope below `config.toml`.** Only `config.toml` (`str:11`), `themes/` (`str:12`) and profiles (`help:86`) are named as living under the home; whether `prompts/`, `agents/` and `hooks.json` move with it is UNKNOWN from these lines.
- **Applicability of `hooks.managed_dir` / `hooks.windows_managed_dir`.** They appear beside managed-requirement keys (`allow_managed_hooks_only`, `str:52`) and the `ManagedHooksRequirements {managedDir, windowsManagedDir}` struct (`str:35`); whether they affect a normal user install is UNKNOWN.
- **`str:4` (`7254: prompts is supported`)** is a message fragment; whether it constrains prompt configuration is UNKNOWN.
- **Empirical check not run.** `codex debug prompt-input` renders the model-visible prompt input as JSON (`dbg:8`); no capture of it exists here, so this answer is documentation-and-strings only.
- **Dump format caveat.** `str` emits each literal as `offset:text` with no separators between adjacent literals, so token adjacency is not structural evidence; dotted keys are cited only where they appear as contiguous literals.
- **Surface naming.** "agents" is mapped to persona TOMLs (`.codex/agents/*.toml`); `~/.codex/AGENTS.md` (`home-state-enumeration.md:31`) is a separate global-instructions surface and was not evaluated as an agents directory.

### Verification

- Citations opened by the orchestrator: `codex-help.txt:85-86` (`-p, --profile` layering `$CODEX_HOME/<name>.config.toml`) matched.

## Cursor Agent 2026.09.10-fd3934a (unit U3)

**Verdict:** Commands, agents, rules and hooks all have fixed names under `.cursor/`, and `.claude/agents` is auto-imported. `--workspace` and `--add-dir` choose the base, and `--plugin-dir` carries each payload kind as a separate channel.

### Lane return

Read-only retrieval complete. One method note first, because it bounds the evidence: the installed Cursor Agent is a webpack bundle of single-line minified chunks, several of which exceed my read limits (50 KB per call; e.g. `index.js:414` is a 7.0 MB line). Where I cite those chunks, the citation confirms the *literal exists at that file:line* (grep output is truncated at 500 chars, so its surrounding semantics are unread); the chunks I could read in full are called out below.

Paths are shortened after first use: `CAPTURE` = `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/cursor-agent-help.txt`; `BUNDLE` = `/Users/michelkerkmeester/.local/share/cursor-agent/versions/2026.09.10-fd3934a/`; `CURSORSKILLS` = `/Users/michelkerkmeester/.cursor/skills-cursor/`.

| Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line) |
|---|---|---|---|---|
| Commands (project) | `.cursor/commands/*.md`, flat namespace (`deep/research.md` → `deep-research.md`) | **None** for the directory. `--plugin-dir <path>` loads a plugin directory whose schema carries `commands` (repeatable flag) | fixed name (plugin is a separate carrier, not a re-pointed root) | `CURSORSKILLS/migrate-to-skills/SKILL.md:20` (glob `{workspaceFolder}/.cursor/commands/*.md`); `.cursor/SYNC.md:70` (flat glob, documented by Cursor's own migration skill); `.cursor/SYNC.md:14` ("discovers agents and commands by file convention, not by CLI flag"); `CAPTURE:57-58`; `BUNDLE/8637.index.js:1` (`commands:e.commands` in the plugin entry schema) |
| Commands (user) | `~/.cursor/commands/*.md` | **None** documented | fixed name | `CURSORSKILLS/migrate-to-skills/SKILL.md:21` (`\| User \| ~/.cursor/commands/*.md \|`) |
| Agents (subagents) | `.cursor/agents/*.md` (project, higher priority) and `~/.cursor/agents/*.md` (user, lower); plus auto-import of `.claude/agents/*.md` | **None** documented; `--plugin-dir` plugin schema carries `subagents` | fixed names — two fixed roots (`.cursor/agents`, `.claude/agents`); user root documented but live-probe caveated | `CURSORSKILLS/create-subagent/SKILL.md:28-29` (both locations + priority); `:33`, `:35`; `.cursor/SYNC.md:20-21` (`.cursor/agents/*.md` mirrors; `.claude/agents/*.md` "Claude-format auto-import — worked before any mirror existed"); `.cursor/SYNC.md:23` (user-level documented but a live probe found the CLI did not load a profile there); `BUNDLE/8637.index.js:1` (`subagents:e.subagents`) |
| Rules (project) | `.cursor/rules/**/*.mdc` (rules may live in nested directories) | **None**. The base follows the workspace/git root; the `.cursor` + `rules` segments are hardcoded literals — project path is built as `join(workspaceRoot, ".cursor", "rules")`, with `workspaceRoot` from the `--workspace` flag or `process.cwd()` | fixed name (root selectable only by `--workspace`; segment not re-pointable) | `BUNDLE/6142.index.js:1` (read in full: `path:l().join(e,".cursor","rules")` for project scope and `join(homedir(),".cursor","rules")` for user scope; writer emits `<name>.mdc`); `CURSORSKILLS/create-rule/SKILL.md:41`, `:44`, `:161`; `CURSORSKILLS/migrate-to-skills/SKILL.md:20`, `:24` (nested dirs allowed); `CAPTURE:53-54` (`--workspace`) |
| Rules (user) | `~/.cursor/rules/*.mdc` | **None** documented | fixed name | `BUNDLE/6142.index.js:1` (`join(homedir(),".cursor","rules")`, both in the scope picker and the completion handler) |
| Hooks | `.cursor/hooks.json` + `.cursor/hooks/*` (command paths relative to project root); `~/.cursor/hooks.json` + `~/.cursor/hooks/*` (relative to `~/.cursor/`) | **None** documented for the location; `--plugin-dir` plugin schema carries `hooks` | fixed name | `CURSORSKILLS/create-hook/SKILL.md:28-29` (project/user locations); `:33-34` (relative-path behavior); `:221` (watches `hooks.json`); `.cursor/SYNC.md:34` (`hooks.json` hand-authored, `"version": 1` dialect at `:76`); `BUNDLE/8637.index.js:1` (`hooks:e.hooks`) |
| Plugin channel (`--plugin-dir`) — the only flag-carried route to any of these payload kinds | No default; opt-in per invocation | `--plugin-dir <path>` — "Load a local plugin directory (can be specified multiple times)"; also the `plugin` command (manage plugins and marketplaces) | configurable (caller chooses the path) | `CAPTURE:57-58`; `CAPTURE:77`; `BUNDLE/8637.index.js:1` (read in full: `RegisterPluginEntry` includes `skills`, `subagents`, `hooks`, `rules`, `mcpServers`, `commands`) — whether a *local* plugin's `commands`/`rules`/`hooks` actually surface to a session is UNKNOWN (no loader line read) |
| Project-root selector above `.cursor/` | Current working directory (default) | `--workspace <path-or-name>` (default cwd); `--add-dir <path>` adds an additional workspace root, repeatable | base is configurable; the `.cursor` segment is not | `CAPTURE:53-54`; `CAPTURE:55-56`; `BUNDLE/6142.index.js:1` (base joins onto the workspace/git root); `BUNDLE/7327.index.js:1` (read in full: MCP project path uses `projectRoot` derived from `process.cwd()`, not the flag — so whether `--workspace`/`--add-dir` move *command/agent/rule/hook* discovery is not settled by any line read) |
| Home / config root beneath `~/.cursor` | `~/.cursor/` via the `WI()` accessor in `cursor-config/dist/paths.js` | `CURSOR_CONFIG_DIR` / `CURSOR_DATA_DIR` literals are **present in the bundle**, but neither their context nor any binding to the four surfaces is readable | **UNKNOWN** | `BUNDLE/5800.index.js:1` (read in full: `join(WI(), "chats")` with `WI` imported from `../cursor-config/dist/paths.js`; that module's body is inside an oversized chunk — unread); `BUNDLE/index.js:414` and `BUNDLE/2842.index.js:1`, `BUNDLE/1186.index.js:1` (literal occurrences only; contexts truncated) — the source brief itself marks the redirect as unproven: none of commands/agents/rules/hooks is tied to these vars by any readable line; corroboration of intent, not behavior: `003-layout-probes/plan.md:207` (R8 runs with `CURSOR_CONFIG_DIR`/`CURSOR_DATA_DIR` under an isolation dir); `003-layout-probes/spec.md:238` (strings finds the literal, "whether authentication survives the redirect stays UNKNOWN") |
| Config-file keys | `~/.cursor/cli-config.json` | **None found** — the live config carries `permissions`, `editor`, `display`, `model`, `modelParameters`, `selectedModel`, `network`, `approvalMode`, `sandbox`, `attribution` … and no directory/path keys | fixed name (no config-key route) | `~/.cursor/cli-config.json:2-114` (read in full; no key naming commands/agents/rules/hooks paths) |

## Gaps

- **UNKNOWN — do `CURSOR_CONFIG_DIR` / `CURSOR_DATA_DIR` relocate any of the four surfaces?** The string literals exist in the bundle, but every hit I found sits in an oversized minified line whose context falls outside my read limits (`BUNDLE/index.js:414`, `BUNDLE/index.js:8`, `BUNDLE/2842.index.js:1`, `BUNDLE/1186.index.js:1`). Nothing readable ties either variable to command, agent, rule or hook discovery.
- **UNKNOWN — does a local `--plugin-dir` plugin's `commands`/`rules`/`hooks`/`subagents` fields actually surface to a session?** The field schema is read in full (`BUNDLE/8637.index.js:1`, a marketplace-registration path); no plugin-loader line is readable, and no `plugin` subcommand help beyond the command list was captured. Identifiers `commandsDir`, `rulesDir`, `agentsDir`, `hooksDir`, `commandsPath`, `rulesPath`, and `CURSOR_*_DIR` returned no matches at all in the bundle (absence, so no path:line).
- **UNKNOWN — do `--workspace` / `--add-dir` move asset discovery?** The only readable bindings of a root to `.cursor/<segment>` are the rule generator (`BUNDLE/6142.index.js:1`) and MCP (`BUNDLE/7327.index.js:1`, `BUNDLE/3207.index.js:1`, both reading `projectRoot` from `process.cwd()`/git root). A loader line for commands, agents or hooks was not readable.
- **UNKNOWN — home-root precedence.** The `cursor-config/dist/paths.js` module (defines `WI()`, used at `BUNDLE/5800.index.js:1`) sits inside an oversized chunk and was not readable, so how `~/.cursor` is resolved (env vs. `os.homedir()`) is unsettled.
- **Method caveat.** Bundle citations at `file:1` (or `file:414`) are literal-existence checks against single-line chunks; only `6142.index.js`, `3207.index.js`, `7327.index.js`, `5800.index.js`, `8637.index.js`, `1771.index.js`, `38.index.js` and `9442.index.js` were readable in full. The strongest *behavioral* claims above rest on the help capture, Cursor's own bundled skills under `~/.cursor/skills-cursor/`, and the repository's `.cursor/SYNC.md`, each cited by line; bolder bundle claims are flagged UNKNOWN rather than asserted.

### Verification

- Citations opened by the orchestrator: `cursor-agent-help.txt:53-58` (`--workspace`, `--add-dir`, `--plugin-dir`) and bundle chunk `6142.index.js` (`join(e,".cursor","rules")` and `join(homedir(),".cursor","rules")`) matched.
- Deviation: the brief named the help capture and the bundle chunks, but the lane also read `~/.cursor/cli-config.json` in full. That file's `authInfo` block holds account identity (email, display name, user and auth ids), not a token. This phase kept home files off the lanes because their reads leave the machine, so the read is recorded as a brief violation. It exposed identity data, not credentials.

## Devin 3000.10.27 (unit U4)

**Verdict:** Project skill roots are fixed names from a compiled provider roster (`devin,agents_standard,cursor,windsurf,claude,opencode,zed,copilot`), which is why `.opencode/skills` loads. `XDG_CONFIG_HOME` relocates the user root, and `--config` points only at the config file.

### Lane return

Question settled from the four named files plus supporting captures (probe log, repo runtime manifests). Headline: **yes, but never to an *arbitrary* path** — Devin already loads from sibling *fixed-name* roots (`.cognition/`, `.agents/`, `.opencode/`, `.cursor/rules`, `.windsurf/rules`), and its **user/global root is relocatable via `XDG_CONFIG_HOME`** (proven by the capture running under an isolated config dir); the only path flag in the 3000.10.27 help is `--config`, which points at the user *config file*, not an asset directory. Verdict vocabulary (`configurable` vs `fixed name`) is `probes/../plan.md:176`; paths below are relative to `.../041-skilled-source-root-migration/003-layout-probes/` unless absolute.

| Surface | Default location | Override (flag / env / config key) | Verdict | Evidence (path:line) |
|---|---|---|---|---|
| Skills (project) | `.devin/skills/<skill>/SKILL.md`, `.cognition/skills/…`, `.agents/skills/…` (`probes/captures/devin-skills-paths.txt:9-11`) | **none** — `devin --help` lists no directory flag (`probes/captures/devin-help.txt:37-97`) and `devin skills` exposes only `list\|show\|paths\|help` (`probes/captures/devin-skills-help.txt:6-9`) | fixed name | project-root scan of those exact names, non-recursive (`/tmp/skilled-probes-003/strings/devin.txt:2-4`); "use the `.devin/` directory for NEW configuration" (`/tmp/skilled-probes-003/strings/devin.txt:6`) |
| Skills (user/global) | `$XDG_CONFIG_HOME/devin/skills/<skill>/SKILL.md`; `$XDG_CONFIG_HOME/cognition/skills/…`; `~/.agents/skills/…` (`probes/captures/devin-skills-paths.txt:4-6`) | **`XDG_CONFIG_HOME`** (root only; injected as `/tmp/skilled-probes-003/iso/devin/config`, `plan.md:157-158`) — no skills-specific flag (`probes/captures/devin-help.txt:37-97`); no `DEVIN_*` config-dir env is documented, only `DEVIN_PERMISSION_MODE`/`DEVIN_SANDBOX`/`DEVIN_MODEL` (`probes/captures/devin-help.txt:51,59,66`) | configurable root, fixed leaf name | printed user root equals the injected `XDG_CONFIG_HOME` (`probes/captures/devin-skills-paths.txt:4`); config saved under that root (`/tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log:8`) |
| Skills (sibling provider roots) | `.opencode/skills/` and the other provider dirs, roster `devin,agents_standard,cursor,windsurf,claude,opencode,zed,copilot` (`/tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log:11`) | **none** — roster is compiled in, `additional_dirs=0` (`…log…:11`) | fixed name (alternate fixed roots, not `.devin/`) | repo manifest: discovers `.opencode/skills/` on its own, 12 packets (``.devin/SYNC.md:20`, `:39`) |
| Agents (project) | `.devin/agents/<name>/AGENT.md` (`.devin/SYNC.md:29`) | `--agent-config <file>` (JSON/YAML) in the repo reference (`.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:137`), **absent** from the 3000.10.27 help capture (`probes/captures/devin-help.txt:37-97`) | fixed name (directory); `--agent-config` scope UNKNOWN | live-probe statement that the file registers only at `.devin/agents/<name>/AGENT.md` (`.devin/SYNC.md:14`) |
| Agents (user/global) | `~/.config/devin/agents/` (`.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md:190`) | `XDG_CONFIG_HOME` (inferred from the skills root, `probes/captures/devin-skills-paths.txt:4`) — UNKNOWN, no agents-specific capture | UNKNOWN | no line settles the user agents root; nearest is the XDG-following skills root (`probes/captures/devin-skills-paths.txt:4`) |
| Hooks (project) | `.devin/hooks.v1.json` (`/tmp/skilled-probes-003/strings/devin.txt:1`, binary offset 4213) | **none** — no flag in help (`probes/captures/devin-help.txt:37-97`), no env literal in the extract (`/tmp/skilled-probes-003/strings/devin.txt:1-8`) | fixed name | binary literal `.devin/hooks.v1.json` (`/tmp/skilled-probes-003/strings/devin.txt:1`); `devin migrate` only *writes* that path from `.windsurf/hooks.json` (`/tmp/skilled-probes-003/strings/devin.txt:5`) |
| Rules (project) | `.windsurf/rules/*.md` (Devin's own) plus `.cursor/rules/*.md`; no `.devin/rules/` (`.devin/SYNC.md:78`) | **none** documented (`probes/captures/devin-help.txt:37-97`); `windsurf`/`cursor` are fixed providers (`…log…:11`) | fixed name | `.devin/SYNC.md:78`; `windsurf` provider literal (`/tmp/skilled-probes-003/strings/devin.txt:7`) |
| User config file (the only documented path flag) | `~/.config/devin/config.json` (`probes/captures/devin-help.txt:44`) | **`--config <PATH>`** (`probes/captures/devin-help.txt:41-42`); also relocated by `XDG_CONFIG_HOME` (`/tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log:8`) | configurable (the file only — it names no asset directory) | `probes/captures/devin-help.txt:41-44`; `…log…:8` |

## Gaps

- **`--agent-config <file>` semantics — UNKNOWN.** Whether it replaces the `.devin/agents/` directory scan or merely injects one declarative profile set is not settled by any capture; it is documented only in the repo-authored reference (`…/cli-devin/references/cli-reference.md:137`) and is absent from the 3000.10.27 `--help` (`probes/captures/devin-help.txt:37-97`).
- **`additional_dirs=0` — UNKNOWN.** The counter sits inside the skills-discovery log record (`…log…:11`) and a `/add-dir <path>` slash command exists (`…/cli-devin/references/cli-reference.md:350`), but no capture varies it, so whether extra workspace dirs extend skill/agent discovery to arbitrary paths is unproven.
- **`~/.agents/skills/` — UNKNOWN.** It stayed home-anchored in the capture (`probes/captures/devin-skills-paths.txt:6`); the run changed only the XDG vars, never `HOME`, so whether it follows `HOME` was not probed.
- **User/global rules root — UNKNOWN.** Only the project-scope inheritance (`.windsurf`, `.cursor`) is documented (`.devin/SYNC.md:78`); no `devin rules paths` capture exists for this phase.
- **Negative string evidence is weak — UNKNOWN.** The extract was produced by the plan's narrow filter (`plan.md:164`), so "no `DEVIN_*_DIR` literal appears" in `/tmp/skilled-probes-003/strings/devin.txt:1-8` is not proof the binary lacks one.

### Verification

- Citations opened by the orchestrator: `devin-skills-paths.txt:9-11`, the Devin CLI log line 11 in the isolated data dir (`providers=[devin,agents_standard,cursor,windsurf,claude,opencode,zed,copilot]`, `additional_dirs=0`), `.devin/SYNC.md:20` matched.

## Pi 0.85.1 (unit U5)

**Verdict:** Extensions, skills and prompt templates all accept extra paths through flags (`--extension`, `--skill`, `--prompt-template`) and settings arrays. `PI_CODING_AGENT_DIR` moves the global base. The project `.pi` name is fixed at runtime.

### Lane return

Read-only retrieval complete. All six named files were opened plus the package's own docs and the wiring between them.

`$PI` = `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent` (version `0.85.1` at `$PI/package.json:3`).

| Surface | Default location | Override (flag, env var or config key) | Verdict | Evidence (path:line) |
|---|---|---|---|---|
| Extensions | Project `.pi/extensions/*.ts` and `*.js`, plus `*/index.ts`; global `~/.pi/agent/extensions/` (same rules). Project scope loads only when the project is trusted | `--extension`/`-e <path>` (repeatable, additive, works even under `--no-extensions`); package `pi.extensions` manifest; settings key `extensions` (string[] of files/dirs, globs + `!`/`+`/`-` patterns) in `~/.pi/agent/settings.json` or `.pi/settings.json`; `packages` array for npm/git packages | Configurable (additive — discovery is not relocated, extra paths are merged in) | `$PI/docs/extensions.md:117`, `:119`, `:122`; `$PI/dist/core/extensions/loader.js:624`, `:627`; `$PI/dist/cli/args.js:135`; `$PI/dist/main.js:566`, `:612`; `$PI/docs/settings.md:286`, `:285`; `$PI/dist/core/settings-manager.js:735`; specs/…/003-layout-probes/probes/captures/pi-help.txt:41` (+disable at `:42`) |
| Skills | Project `.pi/skills/`; global `~/.pi/agent/skills/`; second fixed-name tree at `~/.agents/skills/` and `.agents/skills/` in `cwd` + ancestors up to the git repo root; package `skills/` dirs. Project scopes load only when trusted | `--skill <path>` (repeatable, additive even with `--no-skills`); settings key `skills` (string[] of files/dirs); `packages` with per-package `skills` filter | Configurable (additive) | `$PI/docs/skills.md:27`, `:29`–`:31`, `:32`–`:34`; `$PI/dist/core/skills.js:350`, `:351`; `$PI/dist/core/package-manager.js:1990`, `:1992`, `:2008`, `:2010`, `:1976`; `$PI/dist/cli/args.js:142`; `$PI/dist/main.js:567`, `:613`; `$PI/docs/settings.md:287`; `$PI/dist/core/settings-manager.js:748`; `pi-help.txt:43` (+disable at `:44`) |
| Prompt templates | Global `~/.pi/agent/prompts/*.md`; project `.pi/prompts/*.md` (trusted only); non-recursive in both | `--prompt-template <path>` (repeatable, file or directory); settings key `prompts` (string[]); package `prompts/` dirs or `pi.prompts` | Configurable (additive) | `$PI/docs/prompt-templates.md:11`, `:12`, `:14`, `:15`, `:95`; `$PI/dist/core/prompt-templates.js:159`, `:160`, `:189`; `$PI/dist/cli/args.js:146`; `$PI/dist/main.js:568`, `:614`; `$PI/docs/settings.md:288`; `$PI/dist/core/settings-manager.js:761`; `pi-help.txt:45` (+disable at `:46`) |
| Global base dir (`~/.pi/agent/`, parent of `extensions|skills|prompts|themes`) | `join(homedir(), CONFIG_DIR_NAME, "agent")` → `~/.pi/agent` | **`PI_CODING_AGENT_DIR`** (only path override that renames the whole base, so all four subdirs move together); derived from fork `piConfig.name`: `ENV_AGENT_DIR = ${APP_NAME.toUpperCase()}_CODING_AGENT_DIR` | Configurable | `$PI/dist/config.js:426`, `:422`, `:406`; `$PI/docs/environment-variables.md:81`; `$PI/README.md:677`; `$PI/dist/config.js:157` (agentDir consumed by loader); `pi-help.txt:173` |
| Project config dir name (`.pi`) itself | `.pi` under `cwd` — used by all project-scope paths (`.pi/extensions`, `.pi/skills`, `.pi/prompts`, `.pi/settings.json`, `.pi/SYSTEM.md`, `.pi/npm`, `.pi/git`) | **No runtime flag and no environment variable.** Only build/fork-time key `piConfig.configDir` in the *distribution's own* `package.json` (`CONFIG_DIR_NAME = pkg.piConfig?.configDir \|\| ".pi"`); indirectly `PI_PACKAGE_DIR` changes which `package.json` is read, whose documented purpose is Nix/Guix store paths, not config-dir renaming | **Fixed name at runtime**; configurable only by forking/rebranding the package | `$PI/dist/config.js:403`, `:399`; `$PI/package.json:6`–`:8`; `$PI/docs/development.md:41`, `:48`; `$PI/dist/config.js:353`–`:355`, `:313`; `$PI/docs/environment-variables.md:83`; `$PI/dist/core/skills.js:351`, `$PI/dist/core/prompt-templates.js:160`, `$PI/dist/core/extensions/loader.js:624`, `$PI/dist/core/package-manager.js:1690`, `:1765` |

**Direct answer:** Yes — all three surfaces load from directories other than `.pi/`, but through *additive* path mechanisms, not by renaming `.pi`: `--extension`/`--skill`/`--prompt-template` (CLI, repeatable), the `extensions`/`skills`/`prompts` settings arrays, and the `packages` key. The global side additionally has `PI_CODING_AGENT_DIR`, which moves the entire `~/.pi/agent/` base. The literal project directory name `.pi` has no flag or env override at runtime in 0.85.1; it is fixed to the fork-time `piConfig.configDir` value (`$PI/dist/config.js:403`, `$PI/docs/development.md:48`).

Gaps (UNKNOWN):
- **Whether `PI_PACKAGE_DIR` is *intended* to relocate `.pi`** — the code chain is confirmed (`$PI/dist/config.js:313` → `:353` → `:403`), but no documentation describes it as a config-dir override; only as "Override the package directory, useful for Nix/Guix store paths" (`$PI/docs/environment-variables.md:83`). Treating it as an intended mechanism is my inference, not a documented contract.
- **Behaviour of a fork whose `piConfig.configDir` differs** — I read that the constant derives from that key, but did not run a forked package to observe the project paths, banner and env-var name changing together.
- **Whether any settings key renames the *project* config dir** — no such key appears in `$PI/docs/settings.md:277`–`:292`; absence of a key is not proof of absence of an undocumented mechanism.

### Verification

- Citations opened by the orchestrator: confirmed in practice: a run with `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent` loaded that directory's `models.json` and `settings.json` (`runtime-symlink-resolution.md` R5).

## Hermes Agent 0.21.1 (unit U6)

**Verdict:** `HERMES_HOME` and profiles relocate the user skills and plugins roots, and `skills.external_dirs` adds arbitrary skill roots. Project `.hermes/skills`, `.agents/skills` and `.hermes/plugins` are fixed names behind trust gates.

### Lane return

Answer: yes for **0.21.1** (source version at `hermes_cli/__init__.py:6` = `"0.21.1"`) — the home root (and with it `skills/` + `plugins/`) is relocatable via `HERMES_HOME`/`-p`, bundled trees via dedicated env vars, and extra skill roots via config keys; project-scope directories are **fixed names**. No CLI flag takes a skills/plugins directory path.

Path bases: Hermes source paths are relative to `/Users/michelkerkmeester/.hermes/hermes-agent/`; capture paths are relative to `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/`.

| Surface | Default location | Override (flag, env var or config key, or none) | Verdict | Evidence (path:line) |
|---|---|---|---|---|
| Skills — profile/user root | `$HERMES_HOME/skills` (`~/.hermes/skills/` on POSIX) | `HERMES_HOME` env, or `-p/--profile` (pre-argparse, sets `HERMES_HOME`); no skills-specific flag/env for this root | configurable | `hermes_constants.py:1110-1112`; `hermes_constants.py:82-89`; `hermes_cli/main.py:511-559`; `hermes_cli/_parser.py:11-14`; `website/docs/reference/environment-variables.md:126` |
| Skills — bundled catalog | `<repo>/skills/` | `HERMES_BUNDLED_SKILLS` env (Nix/Homebrew wrapper) | configurable | `hermes_constants.py:291-293`; `tools/skills_sync.py:74-75`; `nix/hermes-agent.nix:188`; `website/docs/reference/environment-variables.md:849` |
| Skills — optional catalog | `<repo>/optional-skills/` | `HERMES_OPTIONAL_SKILLS` env | configurable | `hermes_constants.py:281-283`; `tools/skills_hub_official.py:42-44`; `website/docs/reference/environment-variables.md:850` |
| Skills — additional scanned roots | none (empty list) | config key `skills.external_dirs` (list; `~`/`${VAR}` expanded) | configurable | `hermes_cli/config_defaults.py:1325`; `agent/skill_utils.py:332-334,348-353`; `website/docs/user-guide/features/skills.md:377-385` |
| Skills — where new skills are written | profile-local skills dir | config key `skills.create_dir` | configurable | `hermes_cli/config_defaults.py:1329`; `agent/skill_utils.py:361-364`; `website/docs/user-guide/features/skills.md:415-431` |
| Skills — project-local (cwd repo) | `<root>/.hermes/skills/` and `<root>/.agents/skills/` (root = nearest `.git` ancestor) | none for the names; load gated by config `skills.trusted_project_dirs` / `skills.project_discovery` and `hermes skills trust` | fixed name (gate-only) | `agent/skill_utils.py:410,482-493`; `hermes_cli/config_defaults.py:1330-1335`; `captures/hermes-skills-help.txt:10-11`; `website/docs/user-guide/features/skills.md:461-465` |
| Plugins — user root | `$HERMES_HOME/plugins` (`~/.hermes/plugins/`) | `HERMES_HOME` / `-p` only; no plugin-dir flag, env var or config key found | configurable via home; fixed name under it | `hermes_cli/plugins_discovery.py:151-153`; `hermes_cli/plugins_cmd.py:165-169`; `plugins/plugin_loader.py:28-33`; `providers/__init__.py:105-111`; `website/docs/user-guide/features/plugins.md:21-24,127` |
| Plugins — bundled tree | `<repo>/plugins/` | `HERMES_BUNDLED_PLUGINS` env | configurable | `hermes_cli/plugins.py:67-73`; `hermes_cli/web_server_dashboard.py:464-467`; `nix/hermes-agent.nix:190` |
| Plugins — project-local (cwd repo) | `<cwd>/.hermes/plugins/` | none for the name; load gated by `HERMES_ENABLE_PROJECT_PLUGINS=1` (truthy set only) | fixed name (gate-only) | `hermes_cli/plugins_discovery.py:154-159`; `plugins/memory/__init__.py:40-49`; `website/docs/reference/environment-variables.md:839`; `website/docs/user-guide/features/plugins.md:93,128` |
| CLI flags for root relocation | `-s/--skills` preloads skills **by name**; `--in DIR` only chdirs before the project-tree scan | no `--skills-dir`/`--plugins-dir` exists; `hermes skills` subcommands carry no path flag; `hermes plugins doctor/validate <path>` inspect one dir without registering it | fixed name (no relocation flag) | `captures/hermes-help.txt:160-162`; `captures/hermes-help.txt:147-150`; `hermes_cli/_parser.py:159-160`; `hermes_cli/subcommands/skills.py:20-60,165-170`; `hermes_cli/subcommands/plugins.py:50-53,99-116` |

**Gaps (UNKNOWN):**
- `HERMES_BUNDLED_PLUGINS` is not listed in `website/docs/reference/environment-variables.md` (grep: no match); its only "documented" surfaces I found are code and the Nix wrapper. UNKNOWN whether it is a supported public override.
- Bundled model-provider plugins are read from a hardcoded repo-relative dir (`providers/__init__.py:51-53`) that does not consult `HERMES_BUNDLED_PLUGINS`; whether that is intentional or a gap is not settled by any line I read.
- `HERMES_DISABLE_PLUGINS` appears only in eval scripts (`evals/codex_echo/probe.py:15`, `evals/gateway_failure_ownership/probe.py:16`), never in `hermes_cli/**` under that name; UNKNOWN whether the 0.21.1 runtime honors it.

### Verification

- Citations opened by the orchestrator: `agent/skill_utils.py:332-334`, `:348-353` (`external_dirs`), `:482-493` (project root discovery gated by trust), `hermes_constants.py:1110-1112` (`get_hermes_home() / "skills"`) matched.

## opencode 1.18.11 (unit U7)

**Verdict:** `OPENCODE_CONFIG_DIR` adds a config directory whose `plugins`, `commands` and `agents` load, and `skills.paths` adds skill roots. The project walk for the literal `.opencode` name is hardcoded, and every override is additive.

### Lane return

## Answer

Yes — opencode 1.18.11 can load all four surfaces from a directory other than `.opencode/`, but the door differs per surface: an **environment variable** (`OPENCODE_CONFIG_DIR`) for plugins/commands/agents, a **config key** (`skills.paths`) for skills, and **no CLI flag** for any of them. Version provenance for the captures: `plan.md:27` and `plan.md:174` (U7 = opencode 1.18.11, binary at `~/.local/lib/node_modules/opencode-ai/bin/opencode.exe`); none of the four captures prints its own version.

Reading key: `cap/` = `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/`; `dump` = `/tmp/skilled-probes-003/strings/opencode.txt`; `log` = `/tmp/skilled-probes-003/logs/opencode-baseline-skills.txt`; `plan.md` = `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md`. Verdict vocabulary (`configurable` / `fixed name`) is `plan.md:176`.

| Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line) |
|---|---|---|---|---|
| Config directory (discovery base for the four surfaces) | `$XDG_CONFIG_HOME/opencode` (`~/.config/opencode`); project side found by walking up for the literal name `.opencode` (cwd → worktree) | Env `OPENCODE_CONFIG_DIR` — substitutes the global config path in the path service and is appended to the walked directory list; `XDG_CONFIG_HOME` shifts the default. No flag | configurable (name `.opencode` stays hardcoded for the project walk; the override is additive) | `cap/opencode-debug-paths.txt:7` (observed `config /tmp/skilled-probes-003/iso/opencode/xdg-config/opencode`); `dump:15` (`Y=R.XDG_CONFIG_HOME\|\|…".config"`, `Tn=H.join(Y,"opencode")`, `config:e.OPENCODE_CONFIG_DIR??G.config`); `dump:16` (`get OPENCODE_CONFIG_DIR(){return process.env.OPENCODE_CONFIG_DIR}`); `dump:4` (`directories()` = `[Path.config, …walk(".opencode", cwd→worktree), …walk(".opencode", home), …OPENCODE_CONFIG_DIR?[OPENCODE_CONFIG_DIR]:[]]`) |
| Plugins | `<config-dir>/plugin/` or `<config-dir>/plugins/`, auto-discovered `*.ts`/`*.js`; plus `plugin` array entries in `opencode.json` | Env `OPENCODE_CONFIG_DIR` (its `{plugin,plugins}` is scanned by the per-directory loader); config key `plugin` entries accept relative paths, absolute paths and `file://` URLs; `--pure` / `OPENCODE_PURE` only switches plugins off | configurable | `dump:14` (`` `.opencode/plugin/` or `.opencode/plugins/` ``); `dump:15` (`E1.scan("{plugin,plugins}/*.{ts,js}",{cwd:q,…})`; `Jq(q){return q.startsWith("file://")\|\|q.startsWith(".")\|\|…}`); `dump:3` (`j2.load(J)` per directory + `logDebug("loading config from OPENCODE_CONFIG_DIR")`); `dump:4`; `cap/opencode-help.txt:38` (`--pure  run without external plugins`) |
| Commands | `<config-dir>/command/<name>.md` or `<config-dir>/commands/<name>.md`; plus inline `command` object in `opencode.json` | Env `OPENCODE_CONFIG_DIR` (the command loader runs for every directory in the list, including it); env `OPENCODE_CONFIG` (config file at an arbitrary path) and `OPENCODE_CONFIG_CONTENT` (inline JSON) as further content doors; no flag | configurable | `dump:8`; `dump:13`; `dump:3` (`Q.command=r(…, u$.load(J))` inside the per-directory loop); `dump:4`; `dump:16` (`OPENCODE_CONFIG`, `OPENCODE_CONFIG_CONTENT`); `dump:2` (default config file written only when none of `OPENCODE_CONFIG`/`OPENCODE_CONFIG_DIR`/`OPENCODE_CONFIG_CONTENT` is set) |
| Agents | `<config-dir>/agent/<name>.md` or `<config-dir>/agents/<name>.md`; plus inline `agent` object | Env `OPENCODE_CONFIG_DIR` (both agent loaders run per directory, including it); `OPENCODE_CONFIG` / `OPENCODE_CONFIG_CONTENT` as content doors; no flag | configurable | `dump:7`; `dump:12`; `dump:3` (`Q.agent=r(…, y$.load(J))`, then `y$.loadMode(J)`); `dump:4`; `dump:16` |
| Skills | `<config-dir>/skill/<name>/SKILL.md` or `<config-dir>/skills/<name>/SKILL.md`; also auto-loaded fixed roots `~/.claude/skills/<name>/SKILL.md` and `~/.agents/skills/<name>/SKILL.md` | Config key `skills.paths` (arbitrary absolute dirs, scanned recursively for `**/SKILL.md`) and `skills.urls`; the external roots are fixed names with off-switches only (`OPENCODE_DISABLE_EXTERNAL_SKILLS`, `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS`); whether `OPENCODE_CONFIG_DIR` also relocates the skill scan: UNKNOWN | configurable (via `skills.paths`; documented key, loader line not in the readable set) | `dump:9`; `dump:10` (`"paths": [".opencode/skills", "/abs/path/to/skills"]`); `dump:11`; `log:6` ("Register skills from non-default locations via `skills.paths` … and `skills.urls`"; external-roots rows and off-switch names); `log:11` (observed `~/.claude/skills/get-linked-context/SKILL.md` in the loaded skill list) |

Notes, each cited: relocation is additive, not a rename — the list keeps the XDG config dir, the project `.opencode` walk and the home `.opencode` (code reading, `dump:4`), and the project-scope name itself is hardcoded, bypassed only wholesale by `OPENCODE_DISABLE_PROJECT_CONFIG` (`dump:3`, `dump:4`). The recovered `--help` option lists define no directory flag for any surface; the only path argument is the `[project]` positional, which starts a session in a path (`cap/opencode-help.txt:30-31`, `:33-56`; `cap/opencode-debug-help.txt:20-25`). `opencode plugin <module>` installs a plugin and updates config — not a directory override (`cap/opencode-help.txt:27`). The strings extracts also appear in the full built-in `customize-opencode` skill as dumped by `opencode debug skill` (`log:6`, with the same fragments in the binary at `dump:7`–`dump:14`), which is what makes these keys "documented" inside 1.18.11 rather than only upstream. No capture places a fixture inside `OPENCODE_CONFIG_DIR` — the probe fixtures live in the repository's `.opencode/` (`plan.md:196`), and the R1–R3 rows use the env var for isolation (`plan.md:200-202`) — so the plugin/command/agent relocation rests on the binary's loader code lines above, not on an observed alternate-root load.

### Gaps (UNKNOWN)

- Whether `OPENCODE_CONFIG_DIR` also relocates the **skill** scan: no readable line settles it. The skill loader appears to sit in the 2.9 MB string chunk at `dump:6` (and `:17`), which cannot be rendered with the read tool; only presence tests (`**/SKILL.md` matches `dump:6`) were possible, not the surrounding code.
- `skills.paths` / `skills.urls` loader implementation: documented only (`dump:10`, `log:6`); no loader line was read.
- Whether `opencode debug paths`' `config` row ever reflects `OPENCODE_CONFIG_DIR`: the single run shows the XDG-derived path while the override was set (`cap/opencode-debug-paths.txt:7` vs `plan.md:159`); behaviour outside that run is unrecorded.
- Whether `~/.opencode/` really loads commands/agents/plugins: inferred from the walk target in `dump:4`, never observed.
- Any behaviour change after the 2026-09-16 version read (`plan.md:27`).

### Verification

- Citations opened by the orchestrator: strings extract: `config:e.OPENCODE_CONFIG_DIR??G.config` found, `"paths": [".opencode/skills", "/abs/path/to/skills"]` at line 10, `.opencode/plugin/ or .opencode/plugins/` at line 14 matched.

## Which `configurable` cells a live run confirmed

| Mechanism | Confirmed by a run | How |
|-----------|--------------------|-----|
| `PI_CODING_AGENT_DIR` (Pi global base) | yes | the R5 rows and every lane dispatch after 19:24Z loaded `models.json` and `settings.json` from `/tmp/skilled-probes-003/pi-agent` |
| `OPENCODE_CONFIG_DIR` plus the XDG variables (opencode) | yes, as isolation | `opencode debug paths` printed the isolated directories. Loading assets from them was not probed |
| `XDG_CONFIG_HOME` (Devin user root) | yes | `devin skills paths` printed the isolated user root, and the CLI saved its config there |
| `CLAUDE_CONFIG_DIR` (Claude Code config home) | yes, as isolation | an isolated run reported `Not logged in`, which proves it ignored the real config home |
| `CURSOR_CONFIG_DIR`, `CURSOR_DATA_DIR` (Cursor) | partly | chats and settings were written under `/tmp`, while authentication still came from the login |
| `CODEX_HOME`, `HERMES_HOME`, `--plugin-dir`, `--extension`, `--skill`, `--prompt-template`, `skills.external_dirs`, `skills.paths`, `hooks.managed_dir` | no | documented, but no run confirmed them |

## Implications

- Shape A: every runtime keeps finding assets through its own fixed-name directory, whose links or copies point through `.opencode`, which the link keeps resolvable. No runtime needs a flag. Devin needs `.opencode/skills` itself, because `.skilled` is not on its compiled provider roster.
- Shape B: same as shape A for skills, commands and agents, since each is a per-entry link. The Devin roster entry `opencode` still resolves through `.opencode/skills`.
- Shape C: Devin keeps skills only while `.opencode/skills` stays, and opencode keeps its surfaces through the literal `.opencode` walk. The other five runtimes read through their own folders, so C works for them only once their links and generated copies are retargeted to `.skilled/`. The additive flags (`--plugin-dir`, `--extension`, `--skill`, `skills.external_dirs`, `skills.paths`) are a later simplification, not a day-one requirement.

## Briefs and citation checks

Each brief is reproduced verbatim. The citation check resolves every `path:line` a lane returned to a file, using the lane's own abbreviations (`$PI/`, `BUNDLE/`, `CURSORSKILLS/` = `~/.cursor/skills-cursor/`, `help:`, `str:`, `dump:`, `cap/`), and confirms the cited lines exist. A bare basename that matches several tracked files counts as matched only when every candidate holds the line. "Matched" means the line exists. Content was opened only for the citations the verification tables above name. "Struck" means the file did not resolve or the line runs past the end of the file.

### u1-claude-code-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can Claude Code 2.1.273 load its skills, commands, agents, hooks and plugins from a directory other than `.claude/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt; /tmp/skilled-probes-003/strings/claude-code.txt.
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 34 matched, 0 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `STR:17` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:53` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:54` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `HELP:156-160` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `HELP:50-54` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `STR:6` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:56` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:43` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:44` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:58` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:19` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:20` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `HELP:10-11` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `HELP:73` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `STR:25` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:27` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:35` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:4` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `HELP:14-17` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `STR:36` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:41` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:23` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `HELP:221-222` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `HELP:40-44` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `HELP:206-216` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `STR:42` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `HELP:283` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `HELP:156-163` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `STR:57` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:51` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `STR:2` | matched | /tmp/skilled-probes-003/strings/claude-code.txt (60 lines) |
| `plan.md:164` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `HELP:221` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |
| `HELP:219` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/claude-code-help.txt (302 lines) |

### u2-codex-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can Codex CLI 0.154.0 load its prompts, agents and hooks from a directory other than `.codex/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt; /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-debug-help.txt; /tmp/skilled-probes-003/strings/codex.txt.
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 37 matched, 1 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `str:11-12` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `help:46` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `str:11` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `help:85-86` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `str:3` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `help:44-135` | struck | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `str:12` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `str:36` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `home-state-enumeration.md:9` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/home-state-enumeration.md (58 lines) |
| `str:4` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `home-scan.tsv:255` | matched | /tmp/skilled-probes-003/logs/home-scan.tsv (669 lines) |
| `sync-prompts.cjs:22` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs (209 lines) |
| `str:5-9` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `str:19` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `str:29-30` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `str:50` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `home-state-enumeration.md:29` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/home-state-enumeration.md (58 lines) |
| `cli-reference.md:389` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/cli-external-orchestration/cli-codex/references/cli-reference.md (562 lines) |
| `sync-agents.cjs:22` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs (322 lines) |
| `SYNC.md:28` | matched | ~/worktrees/public/055-skilled-source-root-migration/.codex/SYNC.md (136 lines) |
| `home-state-enumeration.md:31` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/home-state-enumeration.md (58 lines) |
| `str:38` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `str:52` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `help:100-102` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `home-scan.tsv:5` | matched | /tmp/skilled-probes-003/logs/home-scan.tsv (669 lines) |
| `install-codex-hooks.mjs:13-14` | matched | ambiguous: 4 files, line in range in 4 |
| `SYNC.md:18` | matched | ~/worktrees/public/055-skilled-source-root-migration/.codex/SYNC.md (136 lines) |
| `str:35` | matched | /tmp/skilled-probes-003/strings/codex.txt (60 lines) |
| `help:45-51` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `install-codex-hooks.mjs:14` | matched | ambiguous: 4 files, line in range in 4 |
| `SYNC.md:26-34` | matched | ~/worktrees/public/055-skilled-source-root-migration/.codex/SYNC.md (136 lines) |
| `help:104-105` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `help:110-111` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `dbg:5-9` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-debug-help.txt (27 lines) |
| `dbg:12-25` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-debug-help.txt (27 lines) |
| `SYNC.md:16` | matched | ~/worktrees/public/055-skilled-source-root-migration/.codex/SYNC.md (136 lines) |
| `help:86` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-help.txt (134 lines) |
| `dbg:8` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/codex-debug-help.txt (27 lines) |

### u3-cursor-agent-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can Cursor Agent 2026.09.10-fd3934a load its commands, agents, rules and hooks from a directory other than `.cursor/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/cursor-agent-help.txt; the JavaScript bundle chunks under /Users/michelkerkmeester/.local/share/cursor-agent/versions/2026.09.10-fd3934a/ (search them for `.cursor/`).
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 28 matched, 1 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `index.js:414` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/index.js (414 lines) |
| `CURSORSKILLS/migrate-to-skills/SKILL.md:20` | matched | ~/.cursor/skills-cursor/migrate-to-skills/SKILL.md (134 lines) |
| `.cursor/SYNC.md:70` | matched | ~/worktrees/public/055-skilled-source-root-migration/.cursor/SYNC.md (126 lines) |
| `.cursor/SYNC.md:14` | matched | ~/worktrees/public/055-skilled-source-root-migration/.cursor/SYNC.md (126 lines) |
| `CAPTURE:57-58` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/cursor-agent-help.txt (95 lines) |
| `BUNDLE/8637.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/8637.index.js (1 lines) |
| `CURSORSKILLS/migrate-to-skills/SKILL.md:21` | matched | ~/.cursor/skills-cursor/migrate-to-skills/SKILL.md (134 lines) |
| `CURSORSKILLS/create-subagent/SKILL.md:28-29` | matched | ~/.cursor/skills-cursor/create-subagent/SKILL.md (225 lines) |
| `.cursor/SYNC.md:20-21` | matched | ~/worktrees/public/055-skilled-source-root-migration/.cursor/SYNC.md (126 lines) |
| `.cursor/SYNC.md:23` | matched | ~/worktrees/public/055-skilled-source-root-migration/.cursor/SYNC.md (126 lines) |
| `BUNDLE/6142.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/6142.index.js (1 lines) |
| `CURSORSKILLS/create-rule/SKILL.md:41` | matched | ~/.cursor/skills-cursor/create-rule/SKILL.md (164 lines) |
| `CAPTURE:53-54` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/cursor-agent-help.txt (95 lines) |
| `CURSORSKILLS/create-hook/SKILL.md:28-29` | matched | ~/.cursor/skills-cursor/create-hook/SKILL.md (239 lines) |
| `.cursor/SYNC.md:34` | matched | ~/worktrees/public/055-skilled-source-root-migration/.cursor/SYNC.md (126 lines) |
| `CAPTURE:77` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/cursor-agent-help.txt (95 lines) |
| `CAPTURE:55-56` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/cursor-agent-help.txt (95 lines) |
| `BUNDLE/7327.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/7327.index.js (1 lines) |
| `BUNDLE/5800.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/5800.index.js (1 lines) |
| `BUNDLE/index.js:414` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/index.js (414 lines) |
| `BUNDLE/2842.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/2842.index.js (1 lines) |
| `BUNDLE/1186.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/1186.index.js (1 lines) |
| `003-layout-probes/plan.md:207` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `003-layout-probes/spec.md:238` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/spec.md (243 lines) |
| `~/.cursor/cli-config.json:2-114` | matched | ~/.cursor/cli-config.json (115 lines) |
| `BUNDLE/index.js:8` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/index.js (414 lines) |
| `BUNDLE/3207.index.js:1` | matched | ~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/3207.index.js (1 lines) |
| `file:1` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/node_modules/proper-lockfile/node_modules/retry/Makefile (18 lines) |
| `file:414` | struck | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/node_modules/proper-lockfile/node_modules/retry/Makefile (18 lines) |

### u4-devin-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can Devin 3000.10.27 load its skills, agents, hooks and rules from a directory other than `.devin/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-help.txt; /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-help.txt; /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-paths.txt; /tmp/skilled-probes-003/strings/devin.txt.
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 26 matched, 3 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `probes/../plan.md:176` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/../plan.md (580 lines) |
| `probes/captures/devin-skills-paths.txt:9-11` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-paths.txt (11 lines) |
| `probes/captures/devin-help.txt:37-97` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-help.txt (97 lines) |
| `probes/captures/devin-skills-help.txt:6-9` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-help.txt (12 lines) |
| `/tmp/skilled-probes-003/strings/devin.txt:2-4` | matched | /tmp/skilled-probes-003/strings/devin.txt (7 lines) |
| `/tmp/skilled-probes-003/strings/devin.txt:6` | matched | /tmp/skilled-probes-003/strings/devin.txt (7 lines) |
| `probes/captures/devin-skills-paths.txt:4-6` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-paths.txt (11 lines) |
| `plan.md:157-158` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `probes/captures/devin-help.txt:51,59,66` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-help.txt (97 lines) |
| `probes/captures/devin-skills-paths.txt:4` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-paths.txt (11 lines) |
| `/tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log:8` | matched | /tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log (24 lines) |
| `/tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log:11` | matched | /tmp/skilled-probes-003/iso/devin/data/devin/cli/logs/devin_20260916-212058_78004.log (24 lines) |
| `.devin/SYNC.md:20` | matched | ~/worktrees/public/055-skilled-source-root-migration/.devin/SYNC.md (142 lines) |
| `.devin/SYNC.md:29` | matched | ~/worktrees/public/055-skilled-source-root-migration/.devin/SYNC.md (142 lines) |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:137` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md (608 lines) |
| `.devin/SYNC.md:14` | matched | ~/worktrees/public/055-skilled-source-root-migration/.devin/SYNC.md (142 lines) |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md:190` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md (414 lines) |
| `/tmp/skilled-probes-003/strings/devin.txt:1` | matched | /tmp/skilled-probes-003/strings/devin.txt (7 lines) |
| `/tmp/skilled-probes-003/strings/devin.txt:1-8` | struck | /tmp/skilled-probes-003/strings/devin.txt (7 lines) |
| `/tmp/skilled-probes-003/strings/devin.txt:5` | matched | /tmp/skilled-probes-003/strings/devin.txt (7 lines) |
| `.devin/SYNC.md:78` | matched | ~/worktrees/public/055-skilled-source-root-migration/.devin/SYNC.md (142 lines) |
| `/tmp/skilled-probes-003/strings/devin.txt:7` | matched | /tmp/skilled-probes-003/strings/devin.txt (7 lines) |
| `probes/captures/devin-help.txt:44` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-help.txt (97 lines) |
| `probes/captures/devin-help.txt:41-42` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-help.txt (97 lines) |
| `probes/captures/devin-help.txt:41-44` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-help.txt (97 lines) |
| `/cli-devin/references/cli-reference.md:137` | struck | file not resolved |
| `/cli-devin/references/cli-reference.md:350` | struck | file not resolved |
| `probes/captures/devin-skills-paths.txt:6` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/devin-skills-paths.txt (11 lines) |
| `plan.md:164` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |

### u5-pi-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can Pi 0.85.1 load its extensions, skills and prompt templates from a directory other than `.pi/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/pi-help.txt; /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/package.json; /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/config.js; /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/resource-loader.js; /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/package-manager.js; /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js.
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 38 matched, 1 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `$PI/package.json:3` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/package.json (113 lines) |
| `$PI/docs/extensions.md:117` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md (3023 lines) |
| `$PI/dist/core/extensions/loader.js:624` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js (647 lines) |
| `$PI/dist/cli/args.js:135` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/args.js (439 lines) |
| `$PI/dist/main.js:566` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/main.js (804 lines) |
| `$PI/docs/settings.md:286` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md (369 lines) |
| `$PI/dist/core/settings-manager.js:735` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/settings-manager.js (997 lines) |
| `/003-layout-probes/probes/captures/pi-help.txt:41` | struck | file not resolved |
| `$PI/docs/skills.md:27` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/skills.md (232 lines) |
| `$PI/dist/core/skills.js:350` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/skills.js (407 lines) |
| `$PI/dist/core/package-manager.js:1990` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/package-manager.js (2177 lines) |
| `$PI/dist/cli/args.js:142` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/args.js (439 lines) |
| `$PI/dist/main.js:567` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/main.js (804 lines) |
| `$PI/docs/settings.md:287` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md (369 lines) |
| `$PI/dist/core/settings-manager.js:748` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/settings-manager.js (997 lines) |
| `pi-help.txt:43` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/pi-help.txt (189 lines) |
| `$PI/docs/prompt-templates.md:11` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/prompt-templates.md (96 lines) |
| `$PI/dist/core/prompt-templates.js:159` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/prompt-templates.js (236 lines) |
| `$PI/dist/cli/args.js:146` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/args.js (439 lines) |
| `$PI/dist/main.js:568` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/main.js (804 lines) |
| `$PI/docs/settings.md:288` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md (369 lines) |
| `$PI/dist/core/settings-manager.js:761` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/settings-manager.js (997 lines) |
| `pi-help.txt:45` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/pi-help.txt (189 lines) |
| `$PI/dist/config.js:426` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/config.js (464 lines) |
| `$PI/docs/environment-variables.md:81` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md (99 lines) |
| `$PI/README.md:677` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/README.md (718 lines) |
| `$PI/dist/config.js:157` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/config.js (464 lines) |
| `pi-help.txt:173` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/pi-help.txt (189 lines) |
| `$PI/dist/config.js:403` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/config.js (464 lines) |
| `$PI/package.json:6` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/package.json (113 lines) |
| `$PI/docs/development.md:41` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/development.md (90 lines) |
| `$PI/dist/config.js:353` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/config.js (464 lines) |
| `$PI/docs/environment-variables.md:83` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md (99 lines) |
| `$PI/dist/core/skills.js:351` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/skills.js (407 lines) |
| `$PI/dist/core/prompt-templates.js:160` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/prompt-templates.js (236 lines) |
| `$PI/dist/core/package-manager.js:1690` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/package-manager.js (2177 lines) |
| `$PI/docs/development.md:48` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/development.md (90 lines) |
| `$PI/dist/config.js:313` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/config.js (464 lines) |
| `$PI/docs/settings.md:277` | matched | ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md (369 lines) |

### u6-hermes-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can Hermes Agent 0.21.1 load its skills and plugins from a directory other than `.hermes/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/hermes-help.txt; /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/hermes-skills-help.txt; the installed Python source under /Users/michelkerkmeester/.hermes/hermes-agent/ (search it for where skills and plugins are discovered).
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 43 matched, 0 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `hermes_cli/__init__.py:6` | matched | ~/.hermes/hermes-agent/hermes_cli/__init__.py (45 lines) |
| `hermes_constants.py:1110-1112` | matched | ~/.hermes/hermes-agent/hermes_constants.py (1224 lines) |
| `hermes_constants.py:82-89` | matched | ~/.hermes/hermes-agent/hermes_constants.py (1224 lines) |
| `hermes_cli/main.py:511-559` | matched | ~/.hermes/hermes-agent/hermes_cli/main.py (3480 lines) |
| `hermes_cli/_parser.py:11-14` | matched | ~/.hermes/hermes-agent/hermes_cli/_parser.py (292 lines) |
| `website/docs/reference/environment-variables.md:126` | matched | ~/.hermes/hermes-agent/website/docs/reference/environment-variables.md (953 lines) |
| `hermes_constants.py:291-293` | matched | ~/.hermes/hermes-agent/hermes_constants.py (1224 lines) |
| `tools/skills_sync.py:74-75` | matched | ~/.hermes/hermes-agent/tools/skills_sync.py (489 lines) |
| `nix/hermes-agent.nix:188` | matched | ~/.hermes/hermes-agent/nix/hermes-agent.nix (271 lines) |
| `website/docs/reference/environment-variables.md:849` | matched | ~/.hermes/hermes-agent/website/docs/reference/environment-variables.md (953 lines) |
| `hermes_constants.py:281-283` | matched | ~/.hermes/hermes-agent/hermes_constants.py (1224 lines) |
| `tools/skills_hub_official.py:42-44` | matched | ~/.hermes/hermes-agent/tools/skills_hub_official.py (379 lines) |
| `website/docs/reference/environment-variables.md:850` | matched | ~/.hermes/hermes-agent/website/docs/reference/environment-variables.md (953 lines) |
| `hermes_cli/config_defaults.py:1325` | matched | ~/.hermes/hermes-agent/hermes_cli/config_defaults.py (2838 lines) |
| `agent/skill_utils.py:332-334,348-353` | matched | ~/.hermes/hermes-agent/agent/skill_utils.py (786 lines) |
| `website/docs/user-guide/features/skills.md:377-385` | matched | ~/.hermes/hermes-agent/website/docs/user-guide/features/skills.md (1062 lines) |
| `hermes_cli/config_defaults.py:1329` | matched | ~/.hermes/hermes-agent/hermes_cli/config_defaults.py (2838 lines) |
| `agent/skill_utils.py:361-364` | matched | ~/.hermes/hermes-agent/agent/skill_utils.py (786 lines) |
| `website/docs/user-guide/features/skills.md:415-431` | matched | ~/.hermes/hermes-agent/website/docs/user-guide/features/skills.md (1062 lines) |
| `agent/skill_utils.py:410,482-493` | matched | ~/.hermes/hermes-agent/agent/skill_utils.py (786 lines) |
| `hermes_cli/config_defaults.py:1330-1335` | matched | ~/.hermes/hermes-agent/hermes_cli/config_defaults.py (2838 lines) |
| `captures/hermes-skills-help.txt:10-11` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/hermes-skills-help.txt (40 lines) |
| `website/docs/user-guide/features/skills.md:461-465` | matched | ~/.hermes/hermes-agent/website/docs/user-guide/features/skills.md (1062 lines) |
| `hermes_cli/plugins_discovery.py:151-153` | matched | ~/.hermes/hermes-agent/hermes_cli/plugins_discovery.py (218 lines) |
| `hermes_cli/plugins_cmd.py:165-169` | matched | ~/.hermes/hermes-agent/hermes_cli/plugins_cmd.py (2106 lines) |
| `plugins/plugin_loader.py:28-33` | matched | ~/.hermes/hermes-agent/plugins/plugin_loader.py (172 lines) |
| `providers/__init__.py:105-111` | matched | ~/.hermes/hermes-agent/providers/__init__.py (441 lines) |
| `website/docs/user-guide/features/plugins.md:21-24,127` | matched | ~/.hermes/hermes-agent/website/docs/user-guide/features/plugins.md (797 lines) |
| `hermes_cli/plugins.py:67-73` | matched | ~/.hermes/hermes-agent/hermes_cli/plugins.py (2123 lines) |
| `hermes_cli/web_server_dashboard.py:464-467` | matched | ~/.hermes/hermes-agent/hermes_cli/web_server_dashboard.py (836 lines) |
| `nix/hermes-agent.nix:190` | matched | ~/.hermes/hermes-agent/nix/hermes-agent.nix (271 lines) |
| `hermes_cli/plugins_discovery.py:154-159` | matched | ~/.hermes/hermes-agent/hermes_cli/plugins_discovery.py (218 lines) |
| `plugins/memory/__init__.py:40-49` | matched | ~/.hermes/hermes-agent/plugins/memory/__init__.py (435 lines) |
| `website/docs/reference/environment-variables.md:839` | matched | ~/.hermes/hermes-agent/website/docs/reference/environment-variables.md (953 lines) |
| `website/docs/user-guide/features/plugins.md:93,128` | matched | ~/.hermes/hermes-agent/website/docs/user-guide/features/plugins.md (797 lines) |
| `captures/hermes-help.txt:160-162` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/hermes-help.txt (224 lines) |
| `captures/hermes-help.txt:147-150` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/hermes-help.txt (224 lines) |
| `hermes_cli/_parser.py:159-160` | matched | ~/.hermes/hermes-agent/hermes_cli/_parser.py (292 lines) |
| `hermes_cli/subcommands/skills.py:20-60,165-170` | matched | ~/.hermes/hermes-agent/hermes_cli/subcommands/skills.py (177 lines) |
| `hermes_cli/subcommands/plugins.py:50-53,99-116` | matched | ~/.hermes/hermes-agent/hermes_cli/subcommands/plugins.py (148 lines) |
| `providers/__init__.py:51-53` | matched | ~/.hermes/hermes-agent/providers/__init__.py (441 lines) |
| `evals/codex_echo/probe.py:15` | matched | ~/.hermes/hermes-agent/evals/codex_echo/probe.py (61 lines) |
| `evals/gateway_failure_ownership/probe.py:16` | matched | ~/.hermes/hermes-agent/evals/gateway_failure_ownership/probe.py (362 lines) |

### u7-opencode-roots

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: can opencode 1.18.11 load its plugins, commands, agents and skills from a directory other than `.opencode/`, and through which documented flag, environment variable or config key?
Read these files: /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-help.txt; /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-debug-help.txt; /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-debug-paths.txt; /tmp/skilled-probes-003/strings/opencode.txt.
Answer with one markdown table whose columns are: Surface | Default location | Override (flag, environment variable or config key, or none) | Verdict (configurable or fixed name) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.

**Citation check:** 27 matched, 0 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `plan.md:27` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `plan.md:174` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `plan.md:176` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `cap/opencode-debug-paths.txt:7` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-debug-paths.txt (9 lines) |
| `dump:15` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:16` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:4` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:14` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:3` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `cap/opencode-help.txt:38` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-help.txt (56 lines) |
| `dump:8` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:13` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:2` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:7` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:12` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:9` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:10` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `dump:11` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `log:6` | matched | /tmp/skilled-probes-003/logs/opencode-baseline-skills.txt (410 lines) |
| `log:11` | matched | /tmp/skilled-probes-003/logs/opencode-baseline-skills.txt (410 lines) |
| `cap/opencode-help.txt:30-31` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-help.txt (56 lines) |
| `cap/opencode-debug-help.txt:20-25` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-debug-help.txt (25 lines) |
| `cap/opencode-help.txt:27` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes/captures/opencode-help.txt (56 lines) |
| `plan.md:196` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `plan.md:200-202` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
| `dump:6` | matched | /tmp/skilled-probes-003/strings/opencode.txt (17 lines) |
| `plan.md:159` | matched | ~/worktrees/public/055-skilled-source-root-migration/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/plan.md (580 lines) |
