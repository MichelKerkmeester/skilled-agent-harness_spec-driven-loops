---
title: "DeepSeek Harness as the eighth cli-external-orchestration runtime: merged research synthesis"
description: "Two-lineage synthesis (GPT-6 Luna and DeepSeek V4.1 Flash, ten angles each) on adding DeepSeek Harness (dsh 0.2.2-rc.1) as mode cli-deepseek-harness mirroring cli-pi, with lineage conflicts resolved against the harness source."
trigger_phrases:
  - "deepseek harness research synthesis"
  - "cli-deepseek-harness research"
  - "dsh runtime integration findings"
importance_tier: "important"
contextType: "research"
---

# DeepSeek Harness as the eighth cli-external-orchestration runtime: merged research synthesis

## 1. Executive Summary

DeepSeek Harness (`dsh`, npm `@deepseek-ai/dsh` `0.2.2-rc.1`) can become the eighth `cli-external-orchestration` mode. This synthesis names it `cli-deepseek-harness` (Section 3). It mirrors `cli-pi` in shape: a skill packet, a repo runtime folder, generated mirrors, a guard layer, MCP, and a deep-loop executor kind. It does not mirror Pi's mechanics. The two lineages agree on the core contract, and the harness source confirms it:

- `dsh --profile headless` answers one task and exits. The task arrives as positional text or on stdin through a lone `-`. Its only options are `--json`, `--session-id`, `--permission-mode`, `--approval-policy` and repeatable `--add-dir`. There is no model, provider, reasoning, working-directory or timeout flag. `dsh-src/packages/bundle/headless/src/startup.ts:53-75` `dsh-src/packages/bundle/headless/src/index.ts:358`
- Exit `0` means the last owned turn ended `completed`. Every other outcome exits `1`. A completed run needs both exit `0` and `final.reason.kind === 'completed'` in the `--json` stream. `dsh-src/packages/bundle/headless/src/index.ts:440-443` `dsh-src/packages/bundle/headless/README.md:104`
- Route, model and reasoning effort are composition, not flags. A repo-owned `--patch` overlay is the per-dispatch lever, and it is the last composition layer. `dsh-src/apps/cli/reference/README.md:13`
- Headless takes API keys from the launch environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. The interactive credential store is disabled. `dsh-src/packages/bundle/headless/README.md:54-58` `dsh-src/packages/bundle/headless/cordis.patch.yml:38-40`
- Skills load natively from `<repo>/.dsh/skills/<name>/SKILL.md`, one level deep, symlinks followed. `dsh-src/packages/skill/skill-filesystem/README.md:36-40`
- Repo-local Cordis plugins load without a package install. A relative plugin path inside a `--patch` insert resolves beside that patch file. `dsh-src/packages/boot/app-boot/src/index.ts:546-557`

The integration is smaller than a Pi port where Pi was expensive. Six of the ten third-party Pi packages map to native harness services. The exit status is deterministic. The sandbox fails closed. It is larger in one place Pi never had to solve. The harness owns model selection, so the mode ships one checked-in route patch per model and enforces a closed roster in its own preflight. The default route is the official DeepSeek API, which is never the intended route here. `dsh-src/packages/bundle/base/cordis.patch.yml:90-94`

Nothing has run against a provider yet. No key is configured. The only live dispatch on record failed as expected with `MISSING_CREDENTIAL` for route `deepseek-official`, exit 1. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-001.md:53-58] Every behavior that needs a model turn stays `documented, unconfirmed` until a keyed contract pin, which is its own gated phase in `phase-plan.md`.

## 2. Research Question and Scope

The question is how to add DeepSeek Harness as a governed runtime mode that mirrors `cli-pi` across ten angles: headless contract, providers and reasoning, profiles and `$DSH_HOME`, skills, agents and commands and goal, plugins and hooks and guards, third-party Pi plugins, MCP, deep-loop fan-out, and constraints with a phase plan. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research-angles.md:45-149]

Inputs merged here:

- Lineage `luna` (cli-codex `gpt-6-luna`), ten iterations, 57 findings. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/luna/research.md:313]
- Lineage `deepseek` (cli-opencode `llmgateway/deepseek-v4.1-flash-1017` at `max`), ten iterations, 88 findings. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/research.md:523]
- The merged registry: 145 key findings, 11 resolved and 4 open questions, convergence score 0.875. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/findings-registry.json] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/fanout-attribution.md:5-8]
- The harness source clone at commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` (2026-11-04), used here to settle every load-bearing conflict.

The synthesis ran no provider dispatch and installed nothing. It used one read-only registry query, `npm view @deepseek-ai/dsh dist-tags`, and read-only listings of the installed package and `~/.dsh`.

## 3. Decision

Proceed with a staged build of mode **`cli-deepseek-harness`**, executor kind `cli-deepseek-harness`, binary `dsh`, repo runtime folder `.dsh/`.

### Mode id

| Candidate | For | Against | Verdict |
|---|---|---|---|
| `cli-deepseek` | Short, used by the deepseek lineage | `deepseek` already names a model family on three existing modes. The executor config pins bare DeepSeek ids on cli-pi and cli-hermes and prefixed ids on cli-opencode. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:284-295] The repo default Pi model is `deepseek-v4.1-flash-1017`. [SOURCE: .pi/settings.json:3-5] "Use deepseek" would route to the wrong mode, and the deepseek lineage itself ran DeepSeek on cli-opencode. | Rejected |
| `cli-dsh` | Matches the binary, used by the luna lineage | Opaque to a reader. The bare word `dsh` is also the name of an unrelated distributed-shell tool on some Linux systems (general knowledge, UNKNOWN on this host), which weakens it as a routing alias. | Rejected as id, kept as alias |
| `cli-deepseek-harness` | Names the product, as `cli-claude-code` (binary `claude`) and `cli-hermes` do. Cannot be confused with the model family. Matches the packet folder `085-cli-deepseek-harness-creation`. | Long. State variables become `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR`. | **Chosen** |

Aliases for the hub: `dsh`, `dsh headless`, `deepseek harness`, `delegate to dsh`. The runtime folder stays `.dsh/` because the harness itself scans `<projectRoot>/.dsh/skills`. `dsh-src/packages/skill/skill-filesystem/README.md:46-56` (cited by both lineages)

### Design decisions

1. Use the native headless contract only: `dsh --profile headless --patch <route> --patch <lineage> --json --permission-mode <preset> --approval-policy never -`, prompt on stdin, stdin closed.
2. One checked-in route patch per roster entry. The closed roster is two routes: LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`. The skill packet and dispatch preflight enforce it, because the harness does not validate catalog membership. `dsh-src/packages/core/agent-default-model/README.md:50-57`
3. `.dsh/` is a repo convention passed explicitly, never `$DSH_HOME`. `$DSH_HOME` is per lineage for fan-out, outside the checkout.
4. Skills ship as a generated per-skill symlink farm. Commands ship as generated prompt templates. Agents ship as generated persona patches.
5. Guards ship as one repo-local Cordis plugin bundle under `.dsh/plugins/repo-guards/`, loaded by relative path from a patch, calling the existing shared guard cores. The experimental Claude hook bridge is the fallback, not the default (Section 9.6).
6. MCP stays off unless a dedicated MCP patch is passed.
7. Fan-out gets a closed executor kind in the shared builder with no Pi recursion exemption.
8. A credential-free contract pin comes first, and a keyed live pin is a separate gated phase. The kind stays out of default allowlists until the keyed pin passes.

## 4. System Model and Invariants

| Component | Owns | Must not own |
|---|---|---|
| `cli-deepseek-harness` packet | Hard rules, roster, invocation, references, playbook | Pi flags, implicit provider choice |
| `.dsh/` | Route and lineage patches, generated skill links, prompt templates, persona patches, the repo-guards plugin, `SYNC.md` | Credentials, sessions, profiles, `node_modules` |
| `$DSH_HOME` (per lineage) | Profile files, session logs, storages | Shared state across lineages, keys checked into git |
| Shared fan-out runner | Binary and version probe, timeout, env allowlist, recursion guard, JSON final validation, containment scan | Silent fallback to another runtime |
| repo-guards plugin | Cordis adapters onto `tools/pre-execute`, `tools/post-execute`, `agent/pre-step`, `agent/turn-stopping`, `agent/created` | Its own copy of policy logic |

Invariants:

- Success is exit `0` plus a `final` event whose `reason.kind` is `completed`. A well-formed stream can still describe a failed run. A failure outside a turn emits an `error` event and no `final`. `dsh-src/packages/bundle/headless/README.md:104`
- The runner owns the time bound. The harness has no turn or time budget in headless. Its bash tool has its own 60 s per-call timeout. `dsh-src/packages/bundle/base/cordis.patch.yml:249-253`
- Every dispatch names its route patch. The base default `deepseek-official` must never be reached by accident. `dsh-src/packages/bundle/base/cordis.patch.yml:90-94`
- The lineage patch disables goal, the goal round driver and plan mode. The round driver keeps an active goal running while the agent is idle. Plan mode's exit fails closed with no review channel. `dsh-src/packages/goal/goal-round-driver/README.md:12` `dsh-src/packages/bundle/base/cordis.patch.yml:327-337`
- The lineage patch sets telemetry to `DISABLED` and disables `session-log-deepseek`. Base mounts both. `DISABLED` constructs no transport. `dsh-src/packages/bundle/base/cordis.patch.yml:43-44,218-232` `dsh-src/packages/session/session-telemetry-otel/README.md:12`
- `--approval-policy never` is mandatory for unattended leaves. It rejects calls that need a human. It is not confinement. `dsh-src/packages/bundle/headless/README.md:92`
- `workspace-write` is the sandbox request. It is same-world confinement that shares the host kernel and filesystem, and it fails `SANDBOX_UNAVAILABLE` rather than running unconfined. The shared containment scan stays as the second boundary. `dsh-src/packages/sandbox/README.md:10` `dsh-src/packages/sandbox/sandbox/README.md:12`
- No `DSH_*` blanket env prefix, and no `DEEPSEEK_` prefix (Section 9.8).

## 5. Integration Strategy Comparison

| Strategy | Strength | Failure mode | Verdict |
|---|---|---|---|
| Reuse cli-pi flags and builder | Familiar | dsh accepts none of Pi's route, tool or template flags | Reject |
| Raw `dsh` calls per workflow | Fast to try | Duplicates timeout, env, recursion and containment policy | Reject |
| Shared builder with a closed `cli-deepseek-harness` branch | One audited path | Needs schema, shim and test matrix work | **Adopt** |
| One profile serving both routes | Less config | No per-call route selector, routes could cross | Reject |
| One route patch per roster entry | Explicit, reviewable | Two files to keep in sync | **Adopt** |
| `.dsh/` as `$DSH_HOME` | No extra dirs | Every checkout owns profiles, sessions and package trees | Reject |
| Repo plugin installed with `dsh plugin add` | Documented path | Per-lineage `$DSH_HOME` means an install per lineage, pnpm and network at dispatch time | Reject for repo code |
| Repo plugin loaded by relative path from a patch | No install, versioned with the repo | Imports beyond the installation's own packages are UNKNOWN | **Adopt** |
| Experimental `dsh-hooks-claude-code` bridge plus rewritten hooks config | Reuses the hook scripts verbatim | Not in the installed package, needs a profile install, and runs no hooks when its config fails to parse | Fallback only |
| MCP mounted in every dispatch | Code Mode always present | Widens every leaf's tool surface, eager startup cost | Reject, opt in per patch |

## 6. Workspace Model

```text
.dsh/
  SYNC.md                          derivation inventory and drift checks
  README.md                        operator entry point
  patches/
    route-llmgateway-deepseek.patch.yml   llm-pi-ai provider row and agent-default-model row
    route-opencode-go-deepseek.patch.yml  same shape, second route
    lineage.patch.yml              telemetry off, session-log-deepseek off, goal and plan off, persona
    guards.patch.yml               inserts ./../plugins/repo-guards rows
    mcp-code-mode.patch.yml        optional, one dsh-mcp-client row
  plugins/
    repo-guards/                   hand-authored Cordis plugin bundle
  skills/                          generated, one symlink per SKILL.md directory
  prompts/                         generated, flattened command templates
  agents/                          generated, one persona patch per agent
  manual-testing-playbook          symlink to the packet's playbook, as .pi does
```

The patch file names are a proposal. The patch grammar (`id`, `disabled`, `config`, `insert`) is documented and the last layer wins per row, replacing the whole row `config`. `dsh-src/apps/cli/reference/README.md:13` A relative plugin name inside an `insert` is anchored to the patch file's directory. `dsh-src/packages/boot/app-boot/src/index.ts:546-557` `dsh-src/packages/boot/app-boot/tests/user-patches.spec.ts:103`

There is no `settings.json` analogue. Pi's defaults map onto an `agent-default-model` row. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-003.md:56-61]

The harness also reads, natively and unasked: `$DSH_HOME/AGENTS.md`, `<agentsHome>/AGENTS.md`, then `AGENTS.md`, `CLAUDE.md` and their `.local.md` overlays from the git root down to the cwd, inside a 65,536-byte budget per chain. The root `AGENTS.md` is 27,891 bytes and fits (measured `wc -c` on 2026-11-06). Neither `.agents/` at the repo root nor `~/.agents` exists today, so the rank-200 and rank-500 skill roots are empty.

Git handles the symlink farm. Symlinks are committed as files. The `.gitignore` comment notes git cannot stage paths beneath a symlink, so a real `.dsh/skills/` directory of per-entry links needs its own `local-*` exclusion rule like `.hermes/skills`. [SOURCE: .gitignore:224-233]

## 7. Staying Current Safely

- **Version and tags.** The lineages disagreed. The resource map recorded `0.2.2-rc.1` as `latest`. Luna's fetch on 2026-11-05 saw `latest` at `0.2.1-rc.5` and `next` at `0.2.2-rc.1`. A registry read on 2026-11-06 returns `latest`, `next` both `0.2.2-rc.1` and `alpha` `0.2.2-alpha.3`. The tag moved during the run. Pin the literal version and integrity, never a dist-tag.
- **Footprint.** The installed package requires Node `>=24.9.0` and holds 319 `@deepseek-ai/dsh-*` packages (counted 2026-11-06, matching the deepseek lineage). The deepseek lineage measured 896 MB and a 1.16 s profile boot for `dsh headless --help`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-010.md:20-29]
- **Skipped install scripts.** npm skipped scripts for `dsh-subprocess-local`, `koffi`, `node-pty`, `@google/genai` and `protobufjs`. Base mounts `dsh-subprocess-local`, which depends on `node-pty` and `koffi`. `dsh-src/packages/bundle/base/cordis.patch.yml:234-235` Whether the bash tool spawns correctly after that skip is UNKNOWN until a tool call runs. The macOS backend is Seatbelt. `dsh-src/packages/sandbox/README.md:27-33`
- **First-boot writes.** Profile-scoped informational commands initialize missing profile files. `dsh-src/apps/cli/reference/README.md:55` The deepseek lineage's `dsh headless --help` created `~/.dsh/profiles/headless`, which still exists. Luna's identical command failed with EPERM in its sandbox. Every later probe must run under a disposable `DSH_HOME`.
- **Source versus tarball.** The clone and the installed tarball share a version string. Byte identity is unproven. Phase 002 records both.

## 8. Safety, Recovery, and Rollback

The runner, per dispatch:

1. Probe `command -v dsh` and `dsh --version`, and refuse anything but the pinned version.
2. Create `<lineage>/.dsh-home` and set `DSH_HOME` to it. Set the child cwd to the lineage directory.
3. Pass the route patch, the lineage patch and the guards patch explicitly.
4. Pass only allowlisted env names (Section 9.8). Never inherit a repo `.env` by running at the repo root.
5. Write the prompt to stdin after `-`, close stdin, enforce `timeoutSeconds`, keep stdout and stderr apart.
6. Fail on non-zero exit, a missing `final`, a malformed line, an `error` event or a non-`completed` reason.
7. Run the existing containment scan and fail closed on an out-of-lineage write.
8. Record version, patch hashes, route and model, session id, exit, final reason and timeout outcome.

**Key leakage risk.** Headless reads `<invocation cwd>/.env`. This repository has a root `.env` (1,219 bytes, present 2026-11-06, contents not read). A dispatch whose cwd is the repo root therefore loads whatever keys that file holds, outside the env allowlist. The fan-out cwd is the lineage directory, which avoids it. Interactive `cli-deepseek-harness` dispatch from the repo root needs a hard rule and a preflight check for this.

**Telemetry.** Base exports session records over OTLP to `https://dsh-otel-collector.deepseeksvc.com/v1/logs` in `FEEDBACK_ONLY` mode, keyed by an anonymous user id in `$DSH_HOME/.anonymous-user-id`. Records leave only after explicit feedback. `dsh-src/packages/bundle/base/cordis.patch.yml:210-232` `dsh-src/packages/session/session-telemetry-otel/README.md:12` A headless run has no feedback channel, so the default is probably silent. Only `DISABLED` is a guarantee.

**Rollback.** Remove the hub mode rows, the executor kind, `.dsh/` and the generated mirrors. Shared guard cores keep their other consumers. No default for an existing runtime changes. The operator's `~/.dsh` from the lineage probe can be deleted by the operator. Nothing in the repo depends on it.

## 9. Automation Surface

### 9.1 Headless contract

| Surface | Evidence | Adapter behavior |
|---|---|---|
| Input | positional words joined, or lone `-` reads stdin, or no task on a non-TTY stdin reads stdin. `-` mixed with words is a usage error. `dsh-src/packages/bundle/headless/src/startup.ts:117-133` | Always `-`, stdin closed |
| Options | `--json`, `--session-id`, `--permission-mode`, `--approval-policy ask\|never`, `--add-dir` (absolute) `dsh-src/packages/bundle/headless/src/startup.ts:53-66` | Fixed set, nothing else |
| Launcher order | launcher flags (`--profile`, `--patch`) end at the first unknown token `dsh-src/apps/cli/reference/README.md:28-34` | `--patch` before app flags |
| stdout | final text, or NDJSON `session` ... `final` with `--json` | `--json` always |
| stderr | `dsh: reasoning:` and `dsh: <code>: <message>` | Classify failures from it |
| Exit | 0 only for `completed` `dsh-src/packages/bundle/headless/src/index.ts:440-443` | Non-zero is failure, no Pi exception |
| Permission presets | `read-only`, `workspace-write`, `danger-full-access`, each with an approval default `dsh-src/packages/bundle/base/cordis.patch.yml:264-275` | `workspace-write` for writers, `read-only` for reviewers, never `danger-full-access` |
| Timeout | none | Runner-owned |

### 9.2 Providers, models and reasoning

Both routes are custom `llm-pi-ai` providers. Base mounts `llm-pi-ai` dormant with zero routes until a section supplies providers. `dsh-src/packages/bundle/base/cordis.patch.yml:127-136`

| Route | Provider id | Protocol | Base URL | Model | Key env | Status |
|---|---|---|---|---|---|---|
| LLM Gateway (DevPass) | `llmgateway` | `openai-completions` | `https://api.llmgateway.io/v1` | `deepseek-v4.1-flash-1017` | `LLMGATEWAY_API_KEY` | documented, unconfirmed in dsh |
| OpenCode Go | `opencode-go` | `openai-completions` | `https://opencode.ai/inference/go/openai/v1` (Models.dev) or `https://opencode.ai/zen/go/v1` (OpenCode Go docs) | `deepseek-v4.1-flash` | `OPENCODE_API_KEY` | endpoint UNKNOWN |

Compat flags the route patches should carry, both pinned by the keyed phase:

- `compat.supportsDeveloperRole: false`, because the gateway's upstream refuses the `developer` role, as recorded for Pi. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:89-99] The field exists in the catalog. `dsh-src/docs/config-catalog.md:2148`
- `compat.thinkingFormat: deepseek`, so `off` sends `thinking: {type: disabled}`. `dsh-src/docs/config-catalog.md:2169`
- `reasoningEfforts` declared per model, including `max`. A hand-declared model has no levels until the profile declares them. An unsupported level fails `UNSUPPORTED_REASONING_EFFORT`. (deepseek lineage, `dsh-src/docs/user/guide/providers.md:134-166`)

Repointing the default. The base `agent-default-model` row names `deepseek-official`/`deepseek-flash`. A `--patch` that replaces that row is the last layer and replaces its whole `config`, so source supports the route patch design. `dsh-src/apps/cli/reference/README.md:13` A resumed session keeps the route in its own log. A fresh per-lineage `$DSH_HOME` has no saved selection. Live repointing is `documented, unconfirmed`.

The deepseek lineage proposed an optional third GLM route. The goal names two routes, so the roster stays at two (Eliminated Alternatives).

### 9.3 Profiles and `$DSH_HOME`

Home resolves from explicit config, then `$DSH_HOME`, then `~/.dsh`. A blank value counts as unset. Profiles live at `$DSH_HOME/profiles/<name>`. The composition is bundle patches, then the profile's `cordis.patch.yml`, then `$DSH_HOME/cordis.patch.yml`, then each `--patch` in order. `dsh-src/apps/cli/reference/README.md:13` Headless auto-initializes from a shipped template with no `pnpm install`. The deepseek lineage observed a self-contained profile and session tree under a lineage `DSH_HOME`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-003.md:51-55]

Unlike Hermes, a fresh home works for fan-out. The Hermes builder never sets `HERMES_HOME` because a fresh home carries no credentials. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:106-109] dsh headless reads keys from the launch environment, so the env allowlist carries them into a fresh home.

### 9.4 Skills

- Format: `<root>/<name>/SKILL.md` or `<root>/<name>.md`, required `name` and `description`, optional `whenToUse`, `metadata`, `disable-model-invocation`, `user-invocable`. Nested `**/SKILL.md` is not discovered. Symlinked directories keep their discovered paths as resource bases. `dsh-src/packages/skill/skill-filesystem/README.md:36-40`
- Repo frontmatter keys such as `trigger_phrases`, `allowed-tools` and `version` are ignored, not fatal. `allowed-tools` grants nothing. (both lineages, `dsh-src/packages/skill/skill-filesystem/src/index.ts:811-850`)
- No scanner, no quarantine, no body size cap. Catalog descriptions are capped at 500 characters. Invalid frontmatter is warned and skipped.
- The tree has 16 top-level skill directories and 54 `SKILL.md` files today (`find` on 2026-11-06). The deepseek lineage counted 57. A whole-tree link would expose only the 16 hubs. The generator must enumerate at run time, never hard-code a count.
- Verdict: a generated per-skill symlink farm under `.dsh/skills/`, with a `--check` mode, following the generator location precedent `.skilled/skills/system-spec-kit/runtime/cli/hermes/` and `.../cli/pi/`. [SOURCE: .pi/SYNC.md:12-30]

### 9.5 Agents, subagents, commands and goal

- **Agents.** No agent-file loader exists. Identity is the `system-prompt` row's `personaPrefix`, set to one line by headless. `dsh-src/packages/bundle/headless/cordis.patch.yml:9-12` `dsh-src/packages/bundle/base/cordis.patch.yml:521-526` A generated persona patch per `.skilled/agents/*.md` replaces it per dispatch. The `agent-preset-registry` is mounted only by the web app. `dsh-src/packages/bundle/web-app/cordis.patch.yml:598-599` Presets are therefore not a headless path.
- **Subagents.** Base mounts in-process spawn and fork subagent tools. The headless runner waits for child tree work before finishing. `dsh-src/packages/bundle/headless/src/index.ts:424-431` A repo agent reaches a subagent only as an inlined prompt or a mounted preset.
- **Commands.** Slash commands are code registrations with no file loader, and headless has no command adapter. `.skilled/commands/**` become generated prompt templates the dispatcher composes into the task, as `.pi/prompts` and `.hermes/prompts` do. [SOURCE: .pi/SYNC.md:24-28]
- **Goal.** The native goal service holds one goal per session and reads no `goal.md`. Bind packet goals through the repo-guards plugin (`goal-context` adapter at `agent/pre-step` or `agent/created`), never through native goal rounds in a leaf.
- **Plan mode.** Off in dispatch. Its exit tool fails closed without an interactive review.

### 9.6 Plugins, hooks and guards

Seams the harness offers (both lineages, `dsh-src/docs/event-producer-consumer.md:30-91`): `tools/pre-execute` (deny, ask), `tools/execute`, `tools/post-execute` (block with feedback, attach context), `tools/result`, `agent/pre-step`, `agent/turn-stopping` (force another step), `agent/created`, `agent/disposed`, `turn/start`, `turn/end`, `fs/write-intent`, `fs/edit-intent`, `fs/delete-intent`, `compaction/start|summary|prune|end`. Tool arguments cannot be rewritten at pre-execute. The native guard package is loop hygiene, not repo policy.

**Mechanism choice.** The deepseek lineage proposed the Claude Code hook bridge with a rewritten `.dsh/hooks.json`, since the repo's hook scripts are runtime-neutral. The source and the install change the cost:

- `@deepseek-ai/dsh-hooks-claude-code` `0.2.2-rc.1` exists in the clone with a publish config but is absent from the installed package. `dsh-src/packages/experimental/hooks-claude-code/package.json:2-5` A per-lineage `$DSH_HOME` would need a pnpm install per lineage.
- The bridge supports `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStart`, `SubagentStop`. It has no `PreCompact` or `SessionEnd`. Its matcher subject for subagent events is the constant `general-purpose`. `dsh-src/packages/experimental/hooks-claude-code/README.md:56-98`
- An unreadable or unparsable config makes the bridge log a warning and run no hooks while the agent still starts. A hook that crashes is logged and the agent continues. `dsh-src/packages/experimental/hooks-claude-code/README.md:70-76` That is fail-open for every guard.
- Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`), so the repo's `.claude/settings.json` matchers would select nothing without a rewrite. (deepseek lineage, `dsh-src/packages/experimental/hook-protocol/src/matcher.ts:60-68`)

Verdict: a hand-authored repo-local Cordis bundle at `.dsh/plugins/repo-guards/`, loaded by relative path from `guards.patch.yml`, that calls the same shared guard cores the Pi extensions bridge, with each guard's error policy pinned explicitly. This keeps the bridge's insight (reuse the scripts) without its install step or fail-open parse. The bridge stays a documented fallback if the native adapter proves costly. One bundle is the right unit, as Hermes's `repo-guards` precedent shows.

Per-guard verdicts for the 19 extensions in `.pi/extensions/`:

| Pi extension | Verdict | Harness seam or reason | Lineages |
|---|---|---|---|
| `dispatch-audit` | Port | `tools/post-execute` on `bash` | Agree |
| `dispatch-preflight-lint` | Port | `tools/pre-execute` on `bash` | Agree |
| `spec-gate-classify` | Port | `agent/pre-step` on the claimed user message | Agree |
| `spec-gate-enforce` | Port | `tools/pre-execute` on `write`, `edit`, `apply_patch`, `bash` | Agree |
| `completion-evidence` | Port | `agent/turn-stopping` | Agree |
| `task-dispatch-guard` | Port with adaptation | `tools/pre-execute` on `subagent` and `subagent_fork`, new payload shape | Agree |
| `post-edit-quality` | Port | `tools/post-execute` on file tools | Agree |
| `classifier-injection-screen` | Port | `tools/post-execute` on `web_fetch`, `web_search`, `mcp__*` | Agree |
| `goal-context` | Port | `agent/pre-step` or system-prompt assembly, reads packet `goal.md` | Agree, native needed |
| `session-start-context` | Port | `agent/created` | Agree |
| `prompt-advisor` | Port, off in lineage patch | `agent/pre-step`, advisor brief is noise for a fan-out leaf | Luna port, deepseek bridge |
| `mcp-route-guard` | Port with MCP | `tools/pre-execute` on `mcp__.*`, only when the MCP patch is mounted | Agree |
| `git-preflight-advisory` | Port later | warn-only on `bash` git calls | Luna later, deepseek bridge |
| `git-message-gate` | Port later | `tools/pre-execute` on `git commit` | Luna later, deepseek bridge |
| `session-start-advisories` | Port later | `agent/created`, pick checks that suit one-shot runs | Luna later, deepseek bridge |
| `session-stop-context` | Port later | `agent/disposed`, shutdown semantics unpinned | Luna later, deepseek bridge |
| `session-compact-context` | Port later | `compaction/summary` seam, no bridge point exists | Agree, native needed |
| `decision-capture` | Port later | no headless answer channel | Luna later, deepseek bridge |
| `session-relaunch` | Not relevant | the outer runner owns process restart, a one-shot leaf never relaunches | Luna not relevant, deepseek bridge |

Where the deepseek lineage said "bridge-served" and Luna said "port later", the native-plugin decision moves those rows to "port later" by default. The relevance call is Luna's. Only the delivery mechanism differed.

### 9.7 Third-party Pi plugins (`.pi/PLUGINS.md`, `.pi/settings.json`)

[SOURCE: .pi/PLUGINS.md:16-102] [SOURCE: .pi/settings.json:22-33]

| Package | Verdict | Evidence and reason | Lineages |
|---|---|---|---|
| `@juicesharp/rpiv-ask-user-question` v2.15.0 | Drop for dispatch | Native `ask_user_question` exists but headless has no answer channel and returns `NO_PROVIDER` | Luna replace with caveat, deepseek drop. Same outcome for dispatch |
| `@juicesharp/rpiv-todo` v2.15.0 | Native replacement | `todo_write` mounted in base | Agree |
| `pi-blackhole` v0.5.16 | Split: native compaction, drop observational memory | `compaction-basic` plus pruner. No observation store | Agree |
| `pi-btw` v0.8.0 | Drop for dispatch | `/btw` is an interactive side chat. Native `subagent` covers delegated work | Luna drop, deepseek native. Same outcome for dispatch |
| `pi-cache-optimizer` v2.8.0 | Native by config, enable only after the keyed pin | `cacheControlFormat` and `supportsLongCacheRetention` exist `dsh-src/docs/config-catalog.md:2194,2199`, route support is UNKNOWN | Deepseek right on existence, Luna right on behavior |
| `pi-claude-code-ui` v1.0.102 | Not relevant | rendering only | Agree |
| `pi-fast-mode-w-subagent-support` v0.3.0 | Drop | sets OpenAI `service_tier`, no model-route field exists for it | Agree |
| `pi-plan-build` v0.1.120 | Drop for dispatch, keep the plan-then-build split in the outer runner | plan mode fails closed headless | Agree |
| `pi-statusline` v0.0.2 | Not relevant | interactive status line | Agree |
| `pi-web-access` v0.45.0 | Partial native | `web_search`/`web_fetch` native. Headless sends DeepSeek search and fetch through `DEEPSEEK_API_KEY`, absent on these routes, so the model request omits `web_search` `dsh-src/packages/bundle/headless/README.md:54-58`. PDF and video extras absent | Agree, with the key caveat added here |

The plugin market ships no index source and lists only dsh bundles, so it is no migration path. `dsh-src/docs/user/guide/plugin-market.md:12`

### 9.8 MCP

- One `@deepseek-ai/dsh-mcp-client` row per server, `stdio` or `streamable-http`, tools named `mcp__<serverName>__<tool>`. The client is bundled in the install. No shipped bundle mounts it. Base mounts only `mcp-resources`. `dsh-src/packages/bundle/base/cordis.patch.yml:505-506`
- Config lives only in a profile patch or a `--patch`. `.pi/mcp.json` becomes `.dsh/patches/mcp-code-mode.patch.yml`: `command: node`, `args: [.skilled/bin/mcp-code-mode-launcher.cjs]`, `env: {UTCP_CONFIG_FILE: .utcp_config.json}`, `cwd` the repo root. [SOURCE: .pi/mcp.json:1-12] `lifecycle: lazy` has no equivalent, so startup becomes eager and bounded by `startupTimeoutMs`.
- The stdio child drops ambient names matching `/KEY|PASSWORD|SECRET|TOKEN/i` and all `DSH_*`, then merges the row's `env`. `dsh-src/packages/mcp/mcp-client/README.md:161` Name every needed variable in the row.
- Server instructions join the system prompt as literal text up to 32 KiB. Treat them as data.
- Per-dispatch control is composition only. No `--mcp` flag exists.

### 9.9 Deep-loop fan-out

Builder shape, from both lineages, consistent with the source:

```text
cwd   = <lineage dir>
env   = allowlist + DSH_HOME=<lineage>/.dsh-home + route key
argv  = dsh --profile headless
          --patch <repo>/.dsh/patches/route-<route>.patch.yml
          --patch <repo>/.dsh/patches/lineage.patch.yml
          --patch <repo>/.dsh/patches/guards.patch.yml
          --json --permission-mode workspace-write --approval-policy never -
stdin = prompt, then closed
```

Env allowlist. The audit layer adds per-kind prefixes and single keys to a strict base list. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:151-186] Recommended entry: prefix `LLMGATEWAY_` (the precedent cli-pi and cli-hermes already earned), single keys `DSH_HOME` and `OPENCODE_API_KEY`. Reject `DEEPSEEK_`. It would let `DEEPSEEK_API_KEY` through, which reactivates the official DeepSeek route and its search and fetch. Reject a blanket `DSH_`. The deepseek lineage proposed `LLMGATEWAY_` and `DEEPSEEK_` and missed the OpenCode Go key.

Recursion. The audit maps executable names to kinds and exempts only Pi from the self-presence check. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:73-74,127] Add `'cli-deepseek-harness': 'dsh'` and no exemption, because dsh delegates in process.

State. Add `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` plus `DSH_HOME` to the state-env map and `.dsh` to the default-home map. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:92-119] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:512]

Builder registration. `buildDshLineageCommand` beside the Pi and Hermes builders and the adapter map. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2884,3019,3098]

Config tables. `EXECUTOR_KINDS`, flag support (`model`, `reasoningEffort`, `timeoutSeconds`, `agentPersona` mapped to patch selection), preventive sandbox capability (true only after the keyed pin proves `workspace-write`), web-search policy, MCP capability, defaults, allowlist and the Flash `max` pin. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11,122,148,284-295]

Dispatch recognition. The audit hook matches task shapes per binary. Hermes needs a query flag after `hermes chat`. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:58-61,76,94] For dsh, match `dsh (--profile )?headless` with a task or `-`, and never `dsh plugin`, `--dump-*` or `--help`.

## 10. Conflict Handling and Avoidance

Load-bearing lineage conflicts, each settled against the source clone or a live read:

| # | Conflict | Luna | DeepSeek | Evidence | Resolution |
|---|---|---|---|---|---|
| C1 | How a repo plugin loads | relative plugin rows in a `--patch` resolve beside the patch | must be installed into the profile with `dsh plugin add file:`/`link:` | `dsh-src/packages/boot/app-boot/src/index.ts:546-557`, `dsh-src/packages/boot/app-boot/tests/user-patches.spec.ts:103`, `dsh-src/docs/user/develop/basic/publish.md:64` | **Luna.** Relative paths anchor beside the patch. Installs apply to npm packages such as the hook bridge |
| C2 | Where headless gets keys | profile carries references, keys in the `$DSH_HOME` credential store | store disabled, keys from env, then `<cwd>/.env`, then `$DSH_HOME/.env` | `dsh-src/packages/bundle/headless/cordis.patch.yml:38-40`, `dsh-src/packages/bundle/headless/README.md:54-58` | **DeepSeek.** Luna's model holds for interactive profiles only |
| C3 | npm dist-tag of `0.2.2-rc.1` | `next`, with `latest` at `0.2.1-rc.5` | `latest` | `npm view` on 2026-11-06: `latest` and `next` both `0.2.2-rc.1` | Both were right at their read time. The tag moved. Pin literally |
| C4 | Guard delivery | native Cordis adapters | 16 of 19 through the Claude hook bridge | bridge absent from install, fails open on config parse (Section 9.6) | **Luna's mechanism** with deepseek's script reuse |
| C5 | Hook bridge "shipped" | not claimed | first said shipped, corrected itself in iteration 8 | 319 `dsh-*` installed packages, no `dsh-hooks-claude-code` (listing 2026-11-06) | Correction confirmed |
| C6 | `pi-cache-optimizer` | defer | native by config | `dsh-src/docs/config-catalog.md:2194,2199` | Fields exist, behavior UNKNOWN. Config-native, enabled only after the keyed pin |
| C7 | `pi-btw`, `rpiv-ask-user-question` | drop, replace with caveat | native, drop | Section 9.7 | Same outcome for dispatch, wording only |
| C8 | Sandbox README path | `packages/sandbox/README.md` | `packages/sandbox/sandbox/README.md` | both files exist | Not a conflict. Group README and package README |
| C9 | Fan-out env prefixes | admit only reviewed provider vars | `LLMGATEWAY_` and `DEEPSEEK_` prefixes | OpenCode Go key is `OPENCODE_API_KEY`. `DEEPSEEK_API_KEY` drives official search and fetch | Neither exact. Section 9.9 list |
| C10 | `SKILL.md` count | not counted | 57 | `find` returns 54 on 2026-11-06 | Enumerate at generation time |
| C11 | `dsh headless --help` behavior | EPERM, profile init blocked | exit 0, created `~/.dsh/profiles/headless` | `~/.dsh/profiles/headless` exists 2026-11-06 | Both true in their sandboxes. Probes need a disposable `DSH_HOME` |
| C12 | Mode id | `cli-dsh` | `cli-deepseek` | Section 3 | Neither. `cli-deepseek-harness` |

Unresolved and kept UNKNOWN: the OpenCode Go endpoint (Models.dev `/inference/go/openai/v1` versus OpenCode Go docs `/zen/go/v1`). Luna recorded both. Deepseek used only the first. No source in the clone settles which one authenticates.

## 11. Recommendations

1. Name the mode `cli-deepseek-harness`, executor kind `cli-deepseek-harness`, binary `dsh`, folder `.dsh/`.
2. Run a credential-free contract pin first. Version and integrity, help text, `--dump-config` of the composed route, lineage and guards patches under a disposable `DSH_HOME`, the `--json` `error` and exit shape on `MISSING_CREDENTIAL`, and a boot test of the relative repo-guards plugin.
3. Author the skill packet with these hard rules: `headless-only`, `stdin-dash-required`, `route-patch-required`, `closed-roster`, `approval-never-required`, `dsh-home-isolated`, `lineage-patch-required` (telemetry `DISABLED`, `session-log-deepseek` off, goal and plan off), `json-final-and-exit-required`, `pinned-version-required`, `no-repo-root-dotenv` and `mcp-opt-in-only`.
4. Build `.dsh/` with route, lineage, guards and MCP patches plus `SYNC.md`, then the three generators (skills farm, prompt templates, persona patches) with `--check` modes and a CI job beside the Hermes mirror check. [SOURCE: .github/workflows/command-tree-parity.yml:100-122]
5. Add the executor kind in two steps: config, audit and builder with unit tests, then the stress adapter, shim and dispatch-audit recognition.
6. Build the repo-guards plugin in two waves. The safety guards come first (Section 9.6 "Port" rows). Context and git guards come later.
7. Keep MCP optional behind its own patch.
8. Register the hub mode and routing only after the executor exists, then the deep-loop modes, command YAMLs and council.
9. Gate "supported" status on a keyed live pin of both routes. Until then the kind is experimental and out of default allowlists.
10. Close with the playbook run, recursive strict validation and docs reconciliation.

The ranked phases are in `phase-plan.md`.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Reuse cli-pi flags (`--model`, `--provider`, `--thinking`, `--prompt-template`) | Headless has none of them | `dsh-src/packages/bundle/headless/src/startup.ts:53-66` | luna 1, deepseek 1 |
| Mode id `cli-deepseek` | Collides with the DeepSeek model family used by three modes | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:284-295] | synthesis |
| Mode id `cli-dsh` | Opaque, alias-only | Section 3 | synthesis |
| `.dsh/` as `$DSH_HOME` or a checked-in profile | Profiles carry package trees and sessions, home is process state | `dsh-src/apps/cli/reference/README.md:13-15` | luna 3, deepseek 3 |
| Automatic `.dsh/` config discovery | Only `.dsh/skills` and the instruction chain are read natively. Patches must be passed | `dsh-src/packages/skill/skill-filesystem/README.md:46-56` | luna 3-4, deepseek 3 |
| Whole-tree `.dsh/skills` symlink | One-level discovery shows only 16 hubs | `dsh-src/packages/skill/skill-filesystem/README.md:36` | luna 4, deepseek 4 |
| Markdown-only skill copies (Hermes style) | Lose `references/`, `assets/`, `scripts/`, and dsh has no scanner forcing copies | [SOURCE: .hermes/SYNC.md:20-26] | deepseek 4 |
| Agent presets in headless | Registry mounted only by the web app | `dsh-src/packages/bundle/web-app/cordis.patch.yml:598-599` | deepseek 5 |
| Native slash commands from `.skilled/commands` | No file loader, no headless command adapter | `dsh-src/docs/architecture.md:155` | luna 5, deepseek 5 |
| Native goal rounds or plan mode in a leaf | Round driver can run 256 rounds, plan exit fails closed | `dsh-src/packages/goal/goal-round-driver/README.md:12` | deepseek 5, 9 |
| Claude hook bridge as the default guard layer | Not installed, needs per-lineage pnpm install, runs no hooks on config parse failure | `dsh-src/packages/experimental/hooks-claude-code/README.md:70-76` | deepseek 6, 8, synthesis |
| `.claude/settings.json` hooks unchanged | Capitalized matchers miss lowercase tool names | `dsh-src/packages/experimental/hook-protocol/src/matcher.ts:60-68` | deepseek 6 |
| One installable package per guard | Multiplies profile dependencies | [SOURCE: .hermes/SYNC.md:26-40] | luna 6, deepseek 6 |
| Native guard package as repo policy | It is loop hygiene only | `dsh-src/packages/guard/README.md:8-32` | luna 6 |
| Porting Pi packages or using the plugin market | No Pi package is a dsh bundle, no index ships | `dsh-src/docs/user/guide/plugin-market.md:12` | luna 7, deepseek 7 |
| Service-tier fast mode | No model-route field carries `service_tier` | `dsh-src/docs/config-catalog.md:2031-2108` | luna 7, deepseek 7 |
| Third GLM route in the first roster | Outside the two named routes, adds a pin with no requirement | [SOURCE: .pi/settings.json:14-21] | deepseek 2, synthesis |
| Reading `.pi/mcp.json` directly, MCP on by default | No project MCP file, widens every leaf | `dsh-src/packages/bundle/base/cordis.patch.yml:505-506` | luna 8, deepseek 8 |
| `--approval-policy never` as confinement | It only rejects calls needing a human | `dsh-src/packages/bundle/headless/README.md:92` | luna 9 |
| `SPECKIT_*_STATE_DIR` alone as isolation | Detection marker, not a home override | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:92-109] | luna 9 |
| Pi's exit-code exception or recursion exemption | dsh exit is deterministic and dsh delegates in process | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:127] | luna 9, deepseek 9 |
| `DSH_` or `DEEPSEEK_` env prefixes | Leak deployment knobs or the official route key | Section 9.9 | synthesis |
| `FEEDBACK_ONLY` telemetry as the rule | Only `DISABLED` constructs no transport | `dsh-src/packages/session/session-telemetry-otel/README.md:12` | luna 10, deepseek 10 |
| Building the executor before any contract pin | The patch and stdin behavior are what invalidate a builder | [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-010.md:90-91] | deepseek 10 |
| Optional Pi parity phase (memory, cache, media) | No current requirement names it | [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/luna/research.md:201] | luna 10, synthesis |

## Divergence Map

**Where the lineages agreed.** The headless option set, stdin `-`, the 0/1 exit contract and the need for `final.reason`. No per-dispatch route and a runner-owned timeout. Provider shape through `llm-pi-ai`. `$DSH_HOME` as process state and `--patch` as the repo lever. One-level skill discovery and a per-mode link approach. No agent-file or command loader. The native goal service does not read `goal.md`. Cordis seams over Pi events. Most guard dispositions. Most third-party verdicts. MCP opt-in, eager, env-scrubbed. A shared-builder executor kind without the Pi exemption. Telemetry disabled by default. A contract pin first.

**Where they disagreed, and which side the evidence supports.** Plugin loading (C1, Luna). Headless credentials (C2, DeepSeek). Dist-tag (C3, both time-local, tag moved). Guard delivery (C4, Luna's mechanism). Cache optimizer (C6, split). Env prefixes (C9, neither). Mode id (C12, neither). Phase granularity: Luna proposed six coarse phases, DeepSeek eleven. The plan here uses thirteen, closer to DeepSeek's split, and it keeps Luna's credential-free gate.

**Depth differences.** DeepSeek found the hook bridge, the goal-round overrun risk, the plan-mode fail-closed exit, the web-app-only preset registry, the headless credential chain and the footprint numbers. Luna found the OpenCode Go endpoint split, the `NO_PROVIDER` behavior, the official session-log upload extension, the Pi fail-open error policy and the `ctx.tools.restrict()` question.

**Open frontier.** The OpenCode Go endpoint. Live `--patch` repointing of the default route. Gateway acceptance of `thinkingFormat: deepseek` with `max` and the developer-role flag. The bash tool after skipped native scripts. Sandbox effects across file tools, shell, MCP and plugins. Relative plugin imports of third-party modules. Skill farm load at about 54 entries. Code Mode MCP under the scrubbed env. `ctx.tools.restrict()` scope. Startup and cost per run. All need either a keyed run or a credential-free boot test (Section 12).

## 12. Open Questions

| # | Question | Settles in | Needs key |
|---|---|---|---|
| Q1 | Which OpenCode Go endpoint authenticates, `/inference/go/openai/v1` or `/zen/go/v1`? | keyed pin | yes |
| Q2 | Does the route patch actually repoint `agent-default-model` for a fresh headless session? | offline pin shows composition, keyed pin shows the request | partly |
| Q3 | Does LLM Gateway accept `thinkingFormat: deepseek` at `max`, and does it need `supportsDeveloperRole: false`? | keyed pin | yes |
| Q4 | Does the `bash` tool spawn correctly after the skipped `koffi` and `node-pty` scripts? | keyed pin | yes |
| Q5 | Does `workspace-write` confine file tools, shell, MCP and plugin effects on macOS Seatbelt, with `full` enforcement reported? | keyed pin | yes |
| Q6 | Can a relative repo plugin import shared guard cores and Node built-ins, and which imports fail? | offline boot test | no |
| Q7 | Does the hook-script payload adapter behave the same as the Pi bridge for denials and crashes? | offline boot plus keyed pin | partly |
| Q8 | Does a farm of about 54 linked skills load in one session, with descriptions under 500 characters? | keyed pin | yes |
| Q9 | Does Code Mode pass the stdio probe and shut down cleanly with only `UTCP_CONFIG_FILE` set? | MCP phase, credential-free boot | no |
| Q10 | What does `ctx.tools.restrict()` cover across nested agents and MCP tools? | MCP phase | partly |
| Q11 | What are cold and warm task-to-final latency and the cost per iteration on each route? | keyed pin | yes |
| Q12 | Does an rc bump change the headless contract, and how is that detected? | version check hard rule, re-pin runbook | no |
| Q13 | Should dsh become an AI Council seat? | product decision in the deep-loop modes phase | no |

## 13. Existing Art Comparison

| Dimension | dsh headless | `pi -p` | `hermes chat -Q` |
|---|---|---|---|
| Route selection | patch file | `--provider` + `--model` | config plus flags |
| Exit status | deterministic 0/1 plus `final.reason` | needs an exception in the runner | per its contract |
| Sandbox | same-world, fails closed | tool allowlist only | no confinement flag [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:148] |
| Skills | one-level roots, link farm | whole-dir link | generated copies |
| Agents | persona patch | generated agent files | generated persona skills |
| Commands | generated templates | generated prompt stubs | generated prompt stubs |
| Guards | repo Cordis plugin | hand-authored extensions | repo plugin |
| MCP | per-patch rows | `mcp.json` | user-level config |
| Fresh home for fan-out | works, keys via env | n/a | carries no keys |

Pi and Hermes are precedents for synchronization and packet structure, not compatibility layers. [SOURCE: .pi/SYNC.md:8-17] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/goal.md:41-62]

## 14. Testable Acceptance Conditions

1. `dsh --version` prints the pinned version, and the packet records package integrity and the source commit.
2. Under a disposable `DSH_HOME`, `--dump-config` with the route and lineage patches shows the route's provider and model in `agent-default-model`, telemetry `DISABLED`, `session-log-deepseek`, `goal-round-driver` and `plan-mode` disabled.
3. A credential-free dispatch with `--json` emits a parseable `error` or `final` event and exits 1, and the guards plugin activates before the provider error.
4. The executor tests prove argv, stdin `-`, cwd, env allowlist, timeout, JSON final parsing, non-zero failure and recursion refusal.
5. The skills, prompts and personas generators pass `--check` in CI.
6. The dispatch-audit hook classifies dsh task shapes and ignores `dsh plugin`, `--dump-*` and `--help`.
7. The hub, advisor, compiled-routing fixtures and deep-loop command contracts list the mode, and existing modes keep their behavior.
8. After the keyed pin, each roster route answers a harmless task with exit 0 and `completed`, and an out-of-lineage write is caught.
9. Recursive `validate.sh --strict` on the packet prints `RESULT: PASSED`.

## 15. Implementation Boundaries

### Complete cross-repo touch list

Built from both lineages' inventories and a repo-wide search on 2026-11-06 for `cli-hermes` (82 files outside its own packet) and for `.hermes/`, `HERMES_HOME` and the Hermes sync scripts. Changelogs and historical fixtures that name Hermes are listed once as "no change".

**New files**

| File or folder | Change |
|---|---|
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/` | New packet: `SKILL.md`, `ROUTER.md`, `README.md`, `hard-rules.json`, `references/`, `assets/`, `manual-testing-playbook/`, `benchmark/`, `changelog/` |
| `.dsh/` | `SYNC.md`, `README.md`, `patches/*.patch.yml`, `plugins/repo-guards/`, generated `skills/`, `prompts/`, `agents/`, playbook link |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/` | `sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, `sync-agents-dsh.cjs`, `README.md` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh*.test.mjs` | Generator tests, as for Hermes |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` | New per-runtime stress suite |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/dsh-shim.cjs` | New shim: completed, error, denial, timeout, stdin, lineage writes |
| `.skilled/skills/cli-external-orchestration/feature-catalog/<new entry>/` | Feature-catalog entry for the mode |

**Deep-loop runtime**

| File | Change |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Add the kind to every table, roster allowlist, default, `max` pin |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Binary map `dsh`, state env, default home `.dsh`, env prefix `LLMGATEWAY_`, keys `DSH_HOME` and `OPENCODE_API_KEY`, no self-presence exemption |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | State-dir map, `buildDshLineageCommand`, adapter map entry, binary and version probe, JSON final validation |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Kind schema, roster, reasoning, unsupported fields |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Exact argv, stdin, cwd, env, timeout, exit and final handling |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Matrix rows and exclusions for the kind |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Env filtering, recursion refusal, provenance (file exists, checked 2026-11-06) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Named by the deepseek lineage only. The file exists, but whether it enumerates kinds is unchecked, so confirm ownership before editing |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts` | Add the subject |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts` | Binary, shim, model, mode lookup |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts` | Register the shim suite |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs` | JSON event and exit emulation if the core cannot express it |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/README.md` | List the shim |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/README.md` | Subject and live-smoke limits |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json` | Add a live-contract row after the keyed pin (file exists, checked 2026-11-06) |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | Document the builder |

**Deep-loop modes and commands**

| File | Change |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | List the executor |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | List the executor |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Executor roster |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | Executor roster (named by the deepseek lineage, confirm it lists executors) |
| `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md` | Roster, if dsh becomes a seat (Q13) |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Kind validation and builder mapping, if a seat |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts` | Seat cases, if a seat |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` | Seat guidance, if a seat |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Shared-builder branch note |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Same |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml`, `deep-review-confirm.yaml`, `deep-ai-council-*.yaml` | Named by the deepseek lineage, edit only where they enumerate kinds |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Executor choice list |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Executor choice list |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate |

**Hooks and dispatch**

| File | Change |
|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Task-shape regex, binary list, binary-to-kind map, dsh branch |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Direct, quoted, env-wrapped, shell-wrapped and non-task cases |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Hard-rule checks for stdin `-`, approval `never`, route patch, repo-root `.env` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Fixtures for those rules |
| `.skilled/hooks/session-relaunch/**` | No change, relaunch is not relevant to a one-shot leaf |

**Hub and sibling packets**

| File | Change |
|---|---|
| `.skilled/skills/cli-external-orchestration/SKILL.md` | Eighth mode in tables and counts |
| `.skilled/skills/cli-external-orchestration/ROUTER.md` | Route row and aliases |
| `.skilled/skills/cli-external-orchestration/README.md` | Mode table |
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | New mode entry, "seven" wording becomes "eight" [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:5-12] |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | Route entry |
| `.skilled/skills/cli-external-orchestration/leaf-manifest.json` | Leaf entry |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | Node and edges |
| `.skilled/skills/cli-external-orchestration/description.json` | Description and counts |
| `.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` | Index row |
| `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` | Add the runtime |
| `.skilled/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md` | Add the runtime |
| `.skilled/skills/cli-external-orchestration/cli-{claude-code,codex,cursor,devin,opencode}/README.md` and `cli-pi/README.md`, `cli-hermes/README.md` | Sibling mode tables |
| `.skilled/skills/cli-external-orchestration/changelog/` | New hub changelog version |

**Advisor, routing and prompts**

| File | Change |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Add the packet to the CLI skill list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Selection and conflict cases (Luna) |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Scoring assertion (Luna) |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | Canary cases |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | Build entry |
| `.skilled/skills/sk-prompt/SKILL.md` | Model row and persona-reach rule |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Card row |
| `.skilled/agents/orchestrate.md` | Executor and model tables |
| `.skilled/agents/prompt-improver.md` | Executor table |
| `.claude/agents/*.md`, `.codex/agents/*.toml`, `.pi/agents/*.md`, `.hermes/agents/` | Regenerate mirrors, never hand-edit |

**Doctor, CI, governance**

| File | Change |
|---|---|
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Regenerate from the AGENTS.md section |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Add `.dsh/` mirror checks |
| `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | Contract for the new mirror |
| `.skilled/commands/doctor/assets/doctor-mcp-*.yaml`, `scripts/mcp-doctor.sh` | Add dsh MCP checks only if the MCP phase ships |
| `.github/workflows/command-tree-parity.yml` | `dsh-mirror` job running the three `--check` modes, `.dsh/**` paths |
| `.gitignore` | `/.dsh/skills/local-*`, lineage `.dsh-home/` if ever under the repo |
| `.env.example` | Document `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY` names only, if not present |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | `DSH_HOME`, `DSH_TELEMETRY_MODE`, `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` |
| `.skilled/CROSS-CLI.md` | Add the runtime |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Packet directories |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | README verdicts |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | Runtime skill-root inventory, if it lists `.hermes/skills` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Rebuild |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/*.json` | Regenerate only if the index build owns them |
| `AGENTS.md` | Runtime agent-directory list in section 9 |
| `README.md` | Bridge count, no-self-dispatch rule, hub route list |
| `SECURITY.md` | Approval and key-handling note |
| `.skilled/skills/README.txt` | Mode list |
| `.skilled/changelog/skilled/` | New release entry, old entries no change |

### Out of scope for the minimum mode

Interactive profiles (`web`, `tui`, `acp`, `sdk`). Desktop app and browser tools. Optional Pi parity (observational memory, media tools). Editing canonical `SKILL.md` files for dsh-only keys. Credentials, keys or sessions in `.dsh/`. Widening writable roots without a measured need.

## 16. Trade-offs, Risks, and Convergence Report

### Top risks

| Rank | Risk | Impact | Mitigation |
|---|---|---|---|
| 1 | No keyed run exists. Every model-turn behavior is documentation | The mode could ship on false assumptions | Kind stays experimental until the keyed pin passes |
| 2 | Route repointing fails or a session falls back to `deepseek-official` | Calls the wrong provider or fails `MISSING_CREDENTIAL` | `--dump-config` assertion offline, closed roster preflight, `DEEPSEEK_` never in env |
| 3 | Repo-root `.env` loads keys outside the allowlist | Key exposure, wrong route | Fan-out cwd is the lineage dir, `no-repo-root-dotenv` hard rule |
| 4 | Release-candidate drift (`0.2.2-rc.*`), the tag moved during this run | Silent contract break | Literal pin, version probe, re-pin runbook |
| 5 | Sandbox or bash tool broken by skipped native scripts | Writers fail or run unconfined | `SANDBOX_UNAVAILABLE` fails closed, containment scan kept, keyed pin tests it |
| 6 | Guard plugin fails open or cannot import shared cores | Repo policy silently absent | Native plugin with explicit error policy, offline boot test, bridge fallback |
| 7 | OpenCode Go endpoint unknown and the route was overloaded on 2026-11-05 | Second route unusable | Separate route status, mark "configured, not reachable" until proven |

### Convergence and quality notes

Both lineages stopped at `maxIterationsReached` after ten iterations. Luna's novelty stayed between 0.90 and 1.00. DeepSeek's averaged 0.881. Neither converged early. The merged registry reports convergence 0.875. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/findings-registry.json]

Quality caveats:

- The deepseek lineage wrote five state-log timestamps (iterations 6 to 10, 22:18:30Z to 22:32:20Z) after the orchestrator recorded its completion at 22:15:52Z. They are self-reported clock values, not real times. The orchestrator logged a `timestamp_anomaly` for this lineage. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/orchestration-status.log]
- Luna recorded two write-boundary breaches (a gateway call bound to the packet directory and a reducer writing the parent resource map) and declared itself not certifiable as a clean lineage. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/luna/research.md:315-317]
- The deepseek lineage's `--help` probe created `~/.dsh/profiles/headless` in the operator's home, and its timing run wrote `/tmp/dsh-help-time.txt`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-010.md:143-149]
- The generated resource map lists 189 references, 153 marked missing because `dsh-src/` paths sit outside the repo.

## 17. References

`dsh-src/` in this document means the read-only harness source clone at commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` (2026-11-04), path `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/617b2600-a71c-4154-80bb-9def2171203a/scratchpad/src/dsh-src`. Those citations are plain code spans because the clone is outside the repository. The installed package is `~/.local/lib/node_modules/@deepseek-ai/dsh`.

Research inputs:

- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research-angles.md]
- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/resource-map.md]
- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/resource-map.md] (generated, 189 references)
- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/findings-registry.json]
- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/fanout-attribution.md]
- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/luna/research.md]
- [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/research.md]
- Lineage iterations: `research/lineages/luna/iterations/iteration-001.md` to `iteration-010.md` and `research/lineages/deepseek/iterations/iteration-001.md` to `iteration-010.md`.

Harness source checked by this synthesis: `dsh-src/packages/bundle/headless/src/startup.ts`, `dsh-src/packages/bundle/headless/src/index.ts`, `dsh-src/packages/bundle/headless/README.md`, `dsh-src/packages/bundle/headless/cordis.patch.yml`, `dsh-src/packages/bundle/base/cordis.patch.yml`, `dsh-src/packages/bundle/web-app/cordis.patch.yml`, `dsh-src/apps/cli/reference/README.md`, `dsh-src/packages/boot/app-boot/src/index.ts`, `dsh-src/packages/boot/app-boot/tests/user-patches.spec.ts`, `dsh-src/docs/user/develop/basic/publish.md`, `dsh-src/packages/core/agent-default-model/README.md`, `dsh-src/docs/user/guide/providers.md`, `dsh-src/docs/config-catalog.md`, `dsh-src/packages/sandbox/README.md`, `dsh-src/packages/sandbox/sandbox/README.md`, `dsh-src/packages/session/session-telemetry-otel/README.md`, `dsh-src/packages/session/session-log-deepseek/README.md`, `dsh-src/packages/goal/goal-round-driver/README.md`, `dsh-src/packages/experimental/hooks-claude-code/README.md`, `dsh-src/packages/experimental/hooks-claude-code/package.json`, `dsh-src/packages/mcp/mcp-client/README.md`, `dsh-src/docs/user/guide/mcp-memory.md`, `dsh-src/packages/skill/skill-filesystem/README.md`.

Repository references: [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json] [SOURCE: .pi/SYNC.md] [SOURCE: .pi/PLUGINS.md] [SOURCE: .pi/settings.json] [SOURCE: .pi/mcp.json] [SOURCE: .hermes/SYNC.md] [SOURCE: .gitignore] [SOURCE: .github/workflows/command-tree-parity.yml] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/goal.md]

Live reads on 2026-11-06: `npm view @deepseek-ai/dsh dist-tags` (`latest` and `next` `0.2.2-rc.1`, `alpha` `0.2.2-alpha.3`), a listing of the installed `@deepseek-ai` packages (319 `dsh-*`, no `dsh-hooks-claude-code`), `ls ~/.dsh/profiles` (`headless` present).
