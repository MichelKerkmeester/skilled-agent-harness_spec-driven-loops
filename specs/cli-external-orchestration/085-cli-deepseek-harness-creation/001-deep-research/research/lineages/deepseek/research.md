# DeepSeek Harness as a `cli-external-orchestration` runtime

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1793915913100-enoz0j`
**Executor:** `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` at `max`
**Harness under study:** `@deepseek-ai/dsh@0.2.2-rc.1` (npm `latest`), source clone at commit
`fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`
**Iterations:** 10, one per research angle · **Stop reason:** `maxIterationsReached`

---

## 1. Executive Summary

DeepSeek Harness can host a `cli-deepseek` mode, and the integration is smaller than a Pi port in
the places that usually cost the most and larger in one place that Pi never had to solve: the
harness owns model selection, so a dispatch cannot name a model on the command line. The mode has to
carry a checked-in route patch per model, pass it with `--patch`, and keep the roster closed in the
skill packet.

The headless contract is good for automation:

- `dsh --profile headless` answers one task and exits.
- stdout carries exactly the final answer, or an NDJSON stream with `--json`.
- exit `0` means the final turn ended `completed`; every other outcome is `1`.
- the prompt is a positional argument or stdin via `-`.
- `--permission-mode` and `--approval-policy` are the only per-dispatch behavior levers; model,
  provider, reasoning effort and working directory are not flags.

The harness is ahead of Pi on deterministic exit status, machine-readable events, a real sandbox,
and native goal/subagent/workflow/skill/MCP services. It is behind on per-dispatch model selection,
prompt templates, agent-file loading, project plugins and compaction-hook coverage. Six of the ten
third-party Pi packages are already native; none needs a port. Sixteen of nineteen Pi guard
extensions can run through a rewritten Claude-style hook config rather than new plugin code.

The recommended path is a three-model closed roster (LLM Gateway DeepSeek V4.1 Flash, OpenCode Go
DeepSeek V4.1 Flash, and optionally one GLM route), a repo `.dsh/` folder holding route patches,
hook config and generated skill links, one `cli-deepseek` executor kind in the deep-loop runtime, and
an eleven-phase plan led by a keyed live contract pin.

---

## 2. Scope and Method

Ten angles, one per iteration, in the order set by `research-angles.md`. Evidence is a file and line
in the harness source clone (`dsh-src/<path>:<line>`), a file and line in this repo, the installed
package, a read-only `dsh` command, or a live fetch. Documentation-only claims are marked
`documented, unconfirmed`; guesses are `UNKNOWN`.

Two live actions were taken, both inside the lineage write surface:

1. `dsh headless --help` (exit 0), which also let the launcher initialize `~/.dsh/profiles/headless`
   on its own — the angle's read-only allowance covers that side effect.
2. `DSH_HOME=<lineage>/.dsh-home dsh headless "Reply with the single word OK" </dev/null`, exit 1,
   stderr `dsh: MISSING_CREDENTIAL: llm-deepseek: no API key for provider route "deepseek-official"`.

The harness source, the installed package and the operator's home were never modified.

---

## 3. Headless Dispatch Contract

**Invocation.** `dsh [--profile] headless [options] [task...]`. The task is the positional argument;
multiple words are joined; `-` reads stdin. Options: `--json`, `--session-id <id>`,
`--permission-mode <preset>`, `--approval-policy <ask|never>`, `--add-dir <path>` (repeatable), `-h`.
[SOURCE: dsh-src/docs/cli-help.md:100-132]

**No per-dispatch route.** There is no `--model`, `--provider`, `--reasoning-effort`, `--cwd` or
`--timeout`. The runner resolves the task and the shared `agentDefaultModel` selection; an adopted
session keeps its saved route unless the deployment re-records it.
[SOURCE: dsh-src/packages/bundle/headless/README.md:128]

**Working directory.** The child process cwd is the workspace: the sandbox row sets
`workspaceRoot: process.cwd()` and `mode: process.env.DSH_PERMISSION_MODE ?? 'workspace-write'`.
[SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:27-33]

**Output.** Default mode prints only the final answer on stdout; stderr carries
`dsh: reasoning:` and `dsh: <code>: <message>`. `--json` replaces stdout with NDJSON:
`session` first, then `status`, `text`, `thinking`, `tool_call`, `tool_result`, and `final` last.
Strings are capped at 8 KiB, a line at 32 KiB, with `truncated` flags; `final` carries the exact
`sessionId` and `reason`. [SOURCE: dsh-src/packages/bundle/headless/README.md:36]
[SOURCE: dsh-src/packages/bundle/headless/README.md:104]

**Exit status.** `0` only when the last turn ends `completed`; `1` for aborted, error, no owned turn,
usage errors or an unusable session id. The reliable success predicate is process exit `0` **and**
`final.reason.kind === 'completed'`. [SOURCE: dsh-src/packages/bundle/headless/README.md:12]
[SOURCE: dsh-src/packages/bundle/headless/README.md:136]

**Credentials.** Headless disables the managed credential store, `authorization` and
`deepseek-account`. Keys come from the launch environment, then `<cwd>/.env`, then
`$DSH_HOME/.env`; GUI-saved keys are ignored. [SOURCE: dsh-src/packages/bundle/headless/README.md:56]
[SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:38-46]

**Observed failure.** The smoke produced exit 1, empty stdout and the typed
`MISSING_CREDENTIAL` line above; first boot initialized a self-contained profile and session tree.

**Comparison.** Pi sets provider, model, thinking level, tools, skills, prompts and session on the
command line; dsh sets only permission and session identity. The mode therefore moves route choice
from the command to a patch file. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:94-134]

---

## 4. Providers, Models and Reasoning

**Route schema.** A custom OpenAI-compatible route is a `llm-pi-ai` row:
`providers.<id>` with `apiKeyEnv`, `api` (`openai-completions`, `openai-responses`,
`anthropic-messages`), `baseURL`, a non-empty `models` list, and optional per-model
`reasoningEfforts`, `compat`, `input`, `contextWindow`, `maxTokens`. The id is permanent, lowercase,
hyphenated; one provider speaks one protocol. [SOURCE: dsh-src/docs/user/guide/providers.md:27-33]
[SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:123]

**LLM Gateway (inference, not live).** Provider `llmgateway`, `api: openai-completions`, base URL
`https://api.llmgateway.io/v1`, model `deepseek-v4.1-flash-1017`. The gateway takes the bare id, and
its `runware` upstream refuses the `developer` role, so the route needs
`compat.supportsDeveloperRole: false`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:89]
[SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:99]

**OpenCode Go (inference, not live).** Provider `opencode-go`, same protocol, base URL
`https://opencode.ai/inference/go/openai/v1`, model `deepseek-v4.1-flash`. Its declaration is not
availability: the 2026-11-05 smoke through OpenCode failed `[overloaded]`, exit 1.
[SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:52-54]

**Reasoning.** `reasoningEfforts` maps a level to the string sent as `reasoning_effort`; `max` is a
real level, DeepSeek's built-in route offers off/low/high/max, and a hand-declared model has no
levels until the profile declares them. Unsupported selections fail
`UNSUPPORTED_REASONING_EFFORT`. [SOURCE: dsh-src/docs/user/guide/providers.md:134-166]
[SOURCE: dsh-src/docs/config-catalog.md:2225]

**DeepSeek V4 behind a gateway.** `compat.thinkingFormat: deepseek` makes `off` send
`thinking: {type: disabled}` and every other level send `thinking: {type: enabled}` beside the
effort. Without it, `off` is only the absence of `reasoning_effort`.
[SOURCE: dsh-src/docs/user/guide/providers.md:155-166]

**Default route and the patch lever.** Base ships `agent-default-model` with
`provider: deepseek-official`, `model: deepseek-flash`. A `--patch <path>` overlay is applied after
the profile layer and uses the same `id`/`disabled`/`config` row grammar, so it can replace that row
with the closed-roster route, including `reasoningEffort`. This is the design inference the phase-002
pin must confirm. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:90-94]
[SOURCE: dsh-src/packages/core/agent-default-model/README.md:22-33]
[SOURCE: dsh-src/docs/cli-help.md:41-42]

**Fail-closed limits.** The adapter refuses an unconfigured model id, but `agent-default-model` does
not validate catalog membership. The closed roster therefore lives in the skill packet and the
dispatch preflight, not in the harness. [SOURCE: dsh-src/packages/core/agent-default-model/README.md:33]

---

## 5. Profiles, `$DSH_HOME` and the Repo Runtime Folder

**Home.** Explicit config, then `$DSH_HOME`, then `~/.dsh`; a blank override is unset. The shared
agents root is `$DSH_AGENTS_HOME` or `~/.agents` and sits outside the harness home.
[SOURCE: dsh-src/packages/util/home-paths/README.md:34-52]

**Profile.** `$DSH_HOME/profiles/<name>` with `cordis.yml`, `cordis.patch.yml`, `package.json`,
`pnpm-workspace.yaml`, plus shared `profiles/node_modules`. There is no project-level profile
lookup. [SOURCE: dsh-src/packages/boot/app-boot/README.md:52]

**Workspace instructions.** The one native project read: `$DSH_HOME/AGENTS.md`, then
`<agentsHome>/AGENTS.md`, then every candidate from the `.git` root to the cwd, broad to specific.
Candidates default to `AGENTS.md` and `CLAUDE.md`, with `AGENTS.local.md` and `CLAUDE.local.md` as
additive overlays; identical content renders once. Each chain has its own `maxBytes`, 65,536 in
base; broader files are dropped before the specific file is truncated. The repo's root `AGENTS.md` is
27,891 bytes and fits. [SOURCE: dsh-src/packages/context/agent-instructions/README.md:30-40]
[SOURCE: dsh-src/packages/context/agent-instructions/README.md:74-76]

**Repo-local lever.** `--patch <path>` is repeatable and applies after the profile layer; it can
replace the default-model row, enable a route, or disable a plugin per dispatch. It is the only
repo-local configuration channel. [SOURCE: dsh-src/docs/cli-help.md:41-42]

**Isolation.** `DSH_HOME=<lineage>/.dsh-home` produced a self-contained `headless` profile, session
tree and storages with no dependency on `~/.dsh`. That is the fan-out isolation mechanism, and it is
why a repo folder must not itself be `$DSH_HOME` by default.

**Repo folder shape.** Smaller than `.pi/` or `.hermes/`:

- `patches/` — route and behavior overlays, unique to this repo.
- `hooks.json` — rewritten Claude-style hook config for the harness tool names.
- `mcp.yml` — translated MCP rows.
- `skills/` — generated per-skill symlinks (Angle 4).
- `agents/` or `prompts/` — generated only if Angle 5's bridges are adopted.
- `plugins/` — one hand-authored bundle for the residual guards.
- `SYNC.md` — the derivation inventory.
- No `settings.json`: defaults are an `agent-default-model` row and settings persist into the active
  profile patch.

---

## 6. Skills

**Format.** A skill is `<root>/<name>/SKILL.md` or `<root>/<name>.md`; nested `**/SKILL.md` files are
deliberately not discovered. Frontmatter requires a kebab-case `name` and a `description`; optional
keys are `whenToUse`, `metadata`, `disable-model-invocation`, `user-invocable`. The parser ignores
this repo's `trigger_phrases`, `importance_tier`, `contextType`, `allowed-tools` and `version`.
[SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:36]
[SOURCE: dsh-src/packages/skill/skill-filesystem/src/index.ts:811-850]
[SOURCE: dsh-src/packages/skill/skill/src/index.ts:21-36]

**Roots and ranks.** `<projectRoot>/.dsh/skills` (100), `<projectRoot>/.agents/skills` (200),
`customSkillDirs` (300), `<dshHome>/skills` (400), `<agentsHome>/skills` (500), bundled (600).
Project root is the nearest `.git` ancestor, else the cwd.
[SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:46-56]

**Why a whole-tree symlink is wrong.** The repo has 16 top-level skill directories but 57
`SKILL.md` files. A whole-directory link at `.dsh/skills` would expose only the 16 hubs and hide 41
nested mode packets. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:1]
[SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:1]

**Right mirror.** A generated per-skill symlink farm: 57 entries, each pointing at its canonical
directory. Symlinked directories keep their resolved instruction path as the resource base, so
`references/`, `assets/` and `scripts/` stay reachable. There is no scanner or quarantine, unlike
Hermes; markdown-only copies would lose those resources. [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:40]
[SOURCE: .hermes/SYNC.md:20-26]

**Catalog behavior.** No scanner, no size limit, invalid files skipped with a warning, failed roots
omitted and retried; descriptions capped at 500 characters by default. Duplicate names resolve by
layer, then rank, then provider order, so the project root at rank 100 wins.
[SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:85]
[SOURCE: dsh-src/packages/skill/tool-skill/README.md:48]
[SOURCE: dsh-src/packages/skill/skill/src/index.ts:84]

---

## 7. Agents, Commands and Goal

**What headless already carries.** Base mounts goal, goal-round-driver, command-goal, plan-mode,
tool-goal, both in-process subagent providers, subagent and control tools, the workflow engine and
tool, skill-filesystem and tool-skill. Headless disables only HMR, credentials, authorization and
deepseek-account. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:315-453]
[SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:35-46]

**Agent identity.** The `system-prompt` row's `personaPrefix`; headless ships a one-line coding
persona, and a `--patch` overlay can replace it with an agent body. There is no agent-file loader.
[SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:9-12]
[SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:521-526]

**Presets.** Declarative `agent-preset` rows with `id` and `plugins`, mounted beside
`agent-preset-registry`, with a `persona` row per composition. Definitions are plugin rows, not
scanned directories; the registry is mounted by the web app, not by base or headless.
[SOURCE: dsh-src/packages/preset/agent-preset-registry/README.md:26-41]
[SOURCE: dsh-src/packages/preset/persona/README.md:24-35]
[SOURCE: dsh-src/packages/bundle/web-app/cordis.patch.yml:598-599]

**Subagents.** `description`, `prompt`, optional `name` and `cwd`; a child preset only through
`agent_preset` when `allowedAgentPresets` is set. No persona-file argument: a repo agent is either
inlined in the prompt or mounted as a preset.
[SOURCE: dsh-src/docs/tool-catalog.md:2064-2110]
[SOURCE: dsh-src/packages/subagent/tool-subagent/README.md:47-53]

**Commands.** Human commands register on `ctx.commands` and dispatch without a model turn; there is
no filesystem command loader, and headless has no command adapter. `.skilled/commands/**` must become
prompt templates composed by the dispatcher. [SOURCE: dsh-src/docs/architecture.md:155]
[SOURCE: dsh-src/packages/goal/command-goal/README.md:12]

**Goal.** One goal per session, compare-and-set by id and revision, 256-round default cap, create and
edit require a direct human root turn; nothing reads `goal.md`. A packet goal bridge needs a plugin
hook or explicit instructions that call `create_goal`. The round driver auto-continues while idle,
which is an overrun risk for an unattended leaf. [SOURCE: dsh-src/packages/goal/goal/README.md:12-34]
[SOURCE: dsh-src/packages/goal/goal-round-driver/README.md:12-30]

**Plan mode.** Mounted in base, but `exit_plan_mode` presents over the user-questions seam and fails
closed without an interactive review; headless has no live approval channel. Keep it off in
dispatches. [SOURCE: dsh-src/packages/plan/plan-mode/README.md:63]
[SOURCE: dsh-src/packages/plan/plan-mode/README.md:93]

---

## 8. Plugins, Hooks and Guards

**Plugin model.** A Cordis object with optional `inject` and `apply(ctx)` or a `Service` subclass,
registered as a profile row by package name. A repo-local plugin must be installed into the profile
as a bundle (`file:`/`link:`); without HMR a change reports `restart-required`.
[SOURCE: dsh-src/docs/cordis-primer.md:9]
[SOURCE: dsh-src/packages/boot/plugin-manager/README.md:31]

**Seams.** `tools/pre-execute` (deny/ask), `tools/execute`, `tools/post-execute` (block with feedback
or attach context), `tools/result`, `agent/pre-step`, `agent/turn-stopping` (force another step),
`agent/created`, `agent/disposed`, `session/event`, `turn/start`, `turn/end`, `approval/request`,
`fs/write-intent`, `fs/edit-intent`, `fs/delete-intent`, `compaction/start|summary|prune|end`,
`commands/change`. [SOURCE: dsh-src/docs/event-producer-consumer.md:30-91]

**Claude hook bridge.** Maps `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`,
`SubagentStart`, `SubagentStop`; it does not support `PreCompact` or `SessionEnd`.
[SOURCE: dsh-src/packages/experimental/hooks-claude-code/README.md:56-70]

**Matcher mismatch.** Claude literal matchers are exact and case-sensitive; harness tool names are
lowercase (`bash`, `read`, `write`, `edit`, `glob`, `grep`, `web_fetch`, `apply_patch`, `skill`,
`subagent`). The repo's `.claude/settings.json` matchers `Bash`, `Write|Edit`, `WebFetch`, `Task`,
`Task|Agent` and `AskUserQuestion` select nothing. A rewritten `.dsh/hooks.json` is required, not a
new plugin. [SOURCE: dsh-src/packages/experimental/hook-protocol/src/matcher.ts:60-68]
[SOURCE: dsh-src/docs/tool-catalog.md:26-52]

**Coverage.** `.claude/settings.json` wires 9 `PreToolUse`, 5 `PostToolUse`, 3 `UserPromptSubmit`,
8 `SessionStart`, 3 `Stop`, 1 `SessionEnd` and 1 `PreCompact` entry over runtime-neutral Node
scripts. Sixteen of nineteen Pi extensions are bridge-served by the rewritten config.
`task-dispatch-guard` needs adaptation for the `subagent` tool name and payload; `goal-context` and
`session-compact-context` need a native plugin. [SOURCE: .claude/settings.json:1]
[SOURCE: .pi/extensions/README.md:1]

**Package availability correction.** `dsh-hooks-claude-code` exists in the source clone at
`0.2.2-rc.1` with public publish config, but it is **not** bundled inside the installed package.
MCP client is bundled; the hook bridge needs an install step. This supersedes the earlier shorthand
that called the bridge "shipped". [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-mcp-client/package.json:1]
[SOURCE: dsh-src/packages/experimental/hooks-claude-code/package.json:1]

**One bundle or many.** The bulk arrives through the bridge, so `repo-guards` carries two plugins
(goal context, compact context) and optionally a task-dispatch adapter — one install, one SYNC entry,
one upgrade path. [SOURCE: .hermes/SYNC.md:26-40]

---

## 9. Third-Party Pi Plugin Migration

| Pi package | Verdict | Evidence |
|---|---|---|
| `@juicesharp/rpiv-ask-user-question` | Drop for dispatch; keep interactive | Native user-questions seam, but headless has no answer channel |
| `@juicesharp/rpiv-todo` | Native replacement | `todo_write` persists across turns and sessions |
| `pi-blackhole` | Replace compaction, drop memory | `compaction-basic` + result pruner + image offload; no observation store |
| `pi-btw` | Native replacement | `subagent`/`subagent_fork` + team task board |
| `pi-cache-optimizer` | Native replacement by config | `cacheControlFormat`, `supportsLongCacheRetention`, route `headers` |
| `pi-claude-code-ui` | Not relevant to dispatch | Rendering only |
| `pi-fast-mode-w-subagent-support` | Not portable | No `serviceTier`/`service_tier` model-route field |
| `pi-plan-build` | Native for interactive; prompt phase for headless | `plan-mode` fails closed without a review |
| `pi-statusline` | Not relevant to dispatch | Rendering only |
| `pi-web-access` | Partial native replacement | `web_fetch`/`web_search` + DeepSeek Search/Fetch; PDF/YouTube absent |

No Pi package is a dsh bundle, and dsh ships no plugin index source, so the plugin market is not a
migration path. [SOURCE: dsh-src/docs/user/guide/plugin-market.md:12]
[SOURCE: .pi/PLUGINS.md:16-102]

---

## 10. MCP

**Configuration.** One `dsh-mcp-client` row per server: `serverName`, `transport`
(`stdio`/`streamable-http`), `command`/`args`/`env`/`cwd` or `url`/`headers`, `toolCallTimeoutMs`
(60 s), optional `startupTimeoutMs`, `closeTimeoutMs`, `expandTemplates`, `failOnStartupError`.
Tools appear as `mcp__<serverName>__<rawName>`. [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:32-86]

**Location.** Profile patch or `--patch` only; no project MCP file. `.pi/mcp.json` must be translated
to `.dsh/mcp.yml` rows. [SOURCE: dsh-src/docs/user/guide/mcp-memory.md:23-33]

**Environment.** The stdio bridge scrubs credential-like ambient variables and all `DSH_*` variables;
name what the server needs in `env`. `expandTemplates` adds `${credential:REF}` resolution but needs
a credentials provider, which headless disables. [SOURCE: dsh-src/docs/user/guide/mcp-memory.md:13]

**Code mode.** Translates to `node .skilled/bin/mcp-code-mode-launcher.cjs` with
`UTCP_CONFIG_FILE=.utcp_config.json` and cwd at the repo root. `lifecycle: lazy` has no harness
equivalent; the connection becomes eager and is bounded by `startupTimeoutMs`.
[SOURCE: .pi/mcp.json:1]

**Per-dispatch control.** Composition only: omit the rows for no MCP, pass an MCP patch for exactly
those servers. The live `mcp-manager` fleet is web/desktop only. Base mounts `mcp-resources` but not
`mcp-client`. [SOURCE: dsh-src/packages/mcp/mcp-manager/README.md:12]
[SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:505-506]

**Untrusted text.** Server instructions join the system prompt as literal text up to 32 KiB; prompt
templates are unsupported. Treat them as data, never instructions.
[SOURCE: dsh-src/packages/mcp/mcp-client/README.md:12]

---

## 11. Deep-Loop Fan-Out Fitness

**Registration.** A new kind touches seven `executor-config.ts` tables: `EXECUTOR_KINDS`, flag
support, preventive-sandbox capability, web-search policy, MCP capability, defaults, and the
allowlist/default/pin. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-276]

**Builder.** `dsh --profile headless --json --permission-mode <mode> --approval-policy never
--patch <route.yml> -` with the prompt as `input`. `-` is required: a positional task makes the
harness ignore stdin. [SOURCE: dsh-src/docs/cli-help.md:100-132]
[SOURCE: dsh-src/packages/bundle/headless/README.md:46]

**Permission.** `workspace-write` confines writes to cwd plus `--add-dir`; `read-only` denies writes;
`danger-full-access` bypasses; an unusable backend fails `SANDBOX_UNAVAILABLE` rather than running
unconfined. `--approval-policy never` is mandatory unattended.
[SOURCE: dsh-src/packages/sandbox/sandbox/README.md:12]
[SOURCE: dsh-src/packages/sandbox/sandbox/README.md:58-60]

**Timeout.** No turn or time budget exists. The runner's `timeoutSeconds` and signal kill are the
only bound; the lineage patch must disable goal and plan to prevent 256-round overruns and
fail-closed plan reviews. [SOURCE: dsh-src/packages/goal/goal-round-driver/README.md:12-30]

**State isolation.** `DSH_HOME=<lineage>/.dsh-home`.

**Environment.** The dispatch filter allows PATH, HOME, LANG, TMPDIR, NODE_PATH, TERM, USER,
LOGNAME, `__CF_USER_TEXT_ENCODING`, `LC_*`, plus per-kind prefixes. `cli-deepseek` needs
`DSH_HOME` as a key and `LLMGATEWAY_`/`DEEPSEEK_` prefixes — never a blanket `DSH_` prefix.
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:129-186]

**Recursion.** The guard needs `SPECKIT_FANOUT_LINEAGE_ID` plus the kind in
`SPECKIT_CLI_DISPATCH_STACK`; map the `dsh` binary to `cli-deepseek` so a nested dsh dispatch fails
closed. dsh has no native self-invocation guard.
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3700-3730]

**Exit.** Deterministic, so a non-zero exit is a real failure. Unlike Pi, no exception is needed;
classify `1` via the `--json` `error` event or `final.reason`.
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4045-4056]

**Touch list.** 22 rows:

1. `executor-config.ts` — seven tables.
2. `fanout-run.cjs` — builder, adapter map, binary probe, route map, state env, recursion binary.
3. `executor-audit.ts` — env keys/prefixes.
4-8. Unit tests: `executor-config`, `fanout-run`, `combo-matrix`, `executor-audit`,
   `verify-iteration`.
9-13. Stress adapter: `matrix-manifest.ts`, `live-contracts.json`, `cli-deepseek.vitest.ts`,
   `shims/deepseek-shim.cjs`, `README.md`.
14. `dispatch-audit.mjs` + its test.
15. `dispatch-rule-checks.test.mjs`.
16. `deep-ai-council/scripts/orchestrate-session.cjs` + tests.
17. Deep-mode SKILLs: `deep-ai-council`, `deep-research`, `deep-review`.
18. Command assets: 6 YAMLs, 3 presentation files, 2 compiled contracts.
19. `doctor/assets/agents-md-manifest.json`.
20. Compiled-routing fixture + build harness.
21. Hub files: `SKILL.md`, `ROUTER.md`, `README.md`, `mode-registry.json`, `hub-router.json`,
    `leaf-manifest.json`, `graph-metadata.json`, `description.json`, `feature-catalog/`, plus
    sibling mode tables.
22. Propagation: advisor sync script, `sk-prompt` SKILL + card, `orchestrate.md`,
    `prompt-improver.md`, root `AGENTS.md`/`README.md`/`SECURITY.md`/`skills/README.txt`, trigger
    index, two sk-doc manifests, fan-out feature catalog.

---

## 12. Cross-Runtime Comparison

| Dimension | dsh headless | `pi -p` |
|---|---|---|
| Model selection | Profile/patch only | `--provider` + `--model` per dispatch |
| Reasoning | `reasoningEfforts` in route | `--thinking` per dispatch |
| Prompt input | positional or stdin `-` | positional |
| Output | final text or NDJSON | text, JSON, RPC |
| Exit status | deterministic 0/1 + `final.reason` | non-deterministic; parse text |
| Sandbox | real, fail-closed `read-only`/`workspace-write`/`danger-full-access` | none; tool allowlist only |
| Tool allowlist | preset/profile composition | `--tools`, `--exclude-tools` |
| Skills | one-level root scan, per-skill symlink | recursive/whole-dir symlink |
| Agents | persona prefix, presets, subagent prompt | agent files, `--append-system-prompt` |
| Commands | prompt templates (no native loader) | `--prompt-template` |
| Hooks | plugin seams + Claude bridge | native extension API |
| MCP | `dsh-mcp-client` rows | extension/MCP config |
| Startup | ~1.16 s profile boot + model | process start + model |
| Footprint | 896 MB, Node 24.9+, 90 deps | npm package + extensions |
| Versioning | `0.2.2-rc.1`, rc cadence | release cadence |

---

## 13. Recommended `.dsh/` Layout

```text
.dsh/
  SYNC.md                 # what is generated, what is authored, drift checks
  patches/
    llmgateway-deepseek.yml    # route + agent-default-model + compat
    opencode-go-deepseek.yml   # route + agent-default-model + compat
    lineage-guards.yml         # disable goal, goal-round-driver, plan-mode, telemetry
  hooks.json              # Claude-style config with harness tool names
  mcp.yml                 # code_mode row translated from .pi/mcp.json
  skills/                 # generated per-skill symlinks (57)
  prompts/                # generated command templates (flattened paths)
  plugins/repo-guards/    # hand-authored bundle: goal context + compact context
```

No profile, no `settings.json`, no `node_modules`, no `AGENTS.md` copy. `DSH_HOME` stays outside the
repo; a lineage points it at its own subdirectory.

---

## 14. Hard Rules for the Packet

1. `headless-dash-stdin-required` — prompt on stdin through `-`, stdin closed.
2. `route-patch-required` — no `--model`; one checked-in patch per route, model must be on the roster.
3. `approval-never-required` — unattended leaves pass `--approval-policy never`.
4. `headless-only` — never dispatch `web`, `tui`, `acp`, `sdk` or `sdk-minimal`.
5. `dsh-home-isolated` — per-lineage `DSH_HOME`.
6. `goal-plan-disabled` — lineage patch disables goal, goal-round-driver and plan-mode.
7. `json-exit-classification` — require exit 0 and `final.reason.kind === 'completed'`; classify 1
   from the JSON `error`/`final.reason`.
8. `telemetry-disabled` — patch the telemetry row to `DISABLED` (or set `DSH_TELEMETRY_MODE`).
9. `profile-version-check` — `command -v dsh` and the installed version match the pinned rc.
10. `route-compat-pinned` — `supportsDeveloperRole: false` and `thinkingFormat: deepseek` on both
    gateway routes.

---

## 15. Phase Plan

| Rank | Phase | Outcome | Depends | Risk | Mode | Required | Prevents |
|---|---|---|---|---|---|---|---|
| 1 | 002 live contract pin | Keyed write dispatch, verbatim IO, JSON parse, bash and sandbox | operator key | backend missing; native builds | `sk-code` verify | required | building on docs only |
| 2 | 003 skill packet | SKILL/ROUTER/hard rules/references/assets | 002 | rule drift | `sk-doc` create-skill | required | ad-hoc dispatch |
| 3 | 004 executor kind | tables, builder, audit, tests | 002 | patch route; stdin misuse | `sk-code` implement | required | unverified provenance |
| 4 | 005 runtime folder | patches, hooks, MCP, SYNC, skill links | 003, 004 | link farm misses | `sk-code` + `sk-doc` | required | config drift |
| 5 | 006 hub registration | registry, hub, advisor, doctor, fixtures | 003 | unroutable mode | `sk-doc` + `sk-code` | required | no selection path |
| 6 | 007 command/agent bridges | templates, persona, goal context | 005 | truncation | `sk-doc` create-command/agent | parity required | reinvention |
| 7 | 008 hooks + guards | rewritten config, bundle, adapter | 005 | bridge install | `sk-code` implement | optional | guard loss |
| 8 | 009 MCP | mcp.yml, code-mode, route guard | 005 | scrubbed env | `sk-code` implement | optional | MCP absence/leak |
| 9 | 010 benchmark | playbook + benchmark index | 002-009 | unverified claims | `sk-doc` create-benchmark | optional | claims without proof |
| 10 | 011 propagation | trigger index, manifests, changelog | 006 | stale index | `sk-code` implement | required before merge | dangling routing |
| 11 | 012 rc re-pin | refreshed contract and roster | 002 | rc breakage | `sk-code` verify | per bump | silent break |

---

## 16. Eliminated Alternatives

- **A `--model`/`--provider` dispatch flag.** Does not exist; route selection is profile config.
- **A repo-local profile.** Profile lookup is `$DSH_HOME`-only and would need `node_modules`.
- **A whole-tree skill symlink.** One-level discovery hides 41 of 57 skills.
- **Markdown-only skill copies.** Lose `references/`, `assets/`, `scripts/` with no scanner reason.
- **Porting all 18 Pi extensions.** Sixteen are bridge-served by the repo's existing hook scripts.
- **Mounting `.claude/settings.json` unchanged.** Capitalized matchers never match lowercase tools.
- **Porting Pi packages as dsh plugins.** None is a dsh bundle; six capabilities are native.
- **Reading `.pi/mcp.json` directly.** No project MCP config scan.
- **A per-run turn budget.** None exists; disable goal/plan and rely on the runner timeout.
- **Reusing Pi's exit-code exception.** dsh's exit status is deterministic.
- **Plan mode as an unattended gate.** It fails closed without an interactive review.

---

## 17. Divergence Map

- **Saturated directions:** none. The lineage ran one pass per angle with no repeated focus and no
  pivot record.
- **Completed pivots:** 0. **Failed pivots:** 0. **Audited overrides:** 0.
- **Frontier:** the nine `UNKNOWN` items in §18, all gated on a configured provider key or a package
  install.
- **Evidence base:** 88 findings, 158 code citations and 25 other citations across ten iterations.

---

## 18. Open Questions / `UNKNOWN`

1. Does `--patch` actually repoint `agent-default-model` in a headless dispatch?
2. Does LLM Gateway accept `compat.thinkingFormat: deepseek` with `reasoningEffort: max`, and does it
   reject `supportsDeveloperRole` without the compat flag?
3. Does the `bash` tool work after the skipped `koffi` and `node-pty` install scripts?
4. Does a 57-entry per-skill symlink farm load all entries in one session?
5. Is `dsh-hooks-claude-code` installable from npm at `0.2.2-rc.1`, and do the rewritten matchers
   fire each script with a compatible payload?
6. Does code-mode MCP connect under the scrubbed stdio environment with only `UTCP_CONFIG_FILE`?
7. What are the real startup-plus-model latency and cost per iteration?
8. Does telemetry stay silent in `FEEDBACK_ONLY` on every headless exit path?
9. How stable is the `0.2.2-rc.*` surface across rc bumps?

---

## 19. References

- Harness source clone: `dsh-src/` at `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`
  (`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/617b2600-a71c-4154-80bb-9def2171203a/scratchpad/src/dsh-src`).
- Installed package: `/Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh`.
- Resource map: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md`.
- Research angles: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research-angles.md`.
- Repo runtime precedents: `.pi/SYNC.md`, `.pi/PLUGINS.md`, `.hermes/SYNC.md`.
- Deep-loop runtime: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`,
  `runtime/scripts/fanout-run.cjs`, `runtime/lib/deep-loop/executor-audit.ts`.
- Hook layer: `.claude/settings.json`, `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`.
- Iteration files: `research/lineages/deepseek/iterations/iteration-001.md` … `iteration-010.md`.

---

## Convergence Report

- **Stop reason:** `maxIterationsReached` (the configured cap; convergence is telemetry only for this
  lineage)
- **Total iterations:** 10
- **Questions answered:** 10 / 10
- **Remaining questions:** 0; nine `UNKNOWN` items are recorded as open evidence gaps, not unanswered
  angle questions
- **Last 3 iteration summaries:** run 8 MCP (0.88) · run 9 fan-out fitness (0.90) · run 10 constraints
  and phase plan (0.85)
- **Convergence threshold:** 0.05 (not reached; the cap is authoritative)
- **Divergence summary:** no divergent pivots; one correction (hook bridge not bundled) supersedes an
  earlier shorthand
- **Average newInfoRatio:** 0.881
- **Source coverage:** 158 code citations, 25 other citations
