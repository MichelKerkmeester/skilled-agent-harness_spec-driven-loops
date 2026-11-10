---
title: "Resource Map: DeepSeek Harness research known context"
description: "What is already confirmed about the local DeepSeek Harness install and this repo's runtime integration surface, so the research run builds on it instead of rediscovering it."
trigger_phrases:
  - "deepseek harness resource map"
  - "dsh known context"
importance_tier: "important"
contextType: "research"
---

# Resource Map: DeepSeek Harness research known context

Confirmed on 2026-11-05 by the orchestrating session. Cite this file for these facts.

## 1. The harness itself

- Source of truth repository: `github.com/deepseek-ai/deepseek-harness`, default branch `master`,
  MIT licence, TypeScript, organisation-owned by `deepseek-ai`. Tagline "Everything is a Plugin."
- Read-only source clone for citations, depth 1 at commit
  `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` (2026-11-04):
  `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/617b2600-a71c-4154-80bb-9def2171203a/scratchpad/src/dsh-src`.
  Cite it as `dsh-src/<path>:<line>`. Top level: `apps/` (cli, desktop, desktop-host,
  plugin-market-generator, web), `packages/` (about 50 packages including acp, boot, compaction,
  context, core, credentials, extensions, goal, guard, llm, mcp, plan, preset, sandbox, session,
  settings, skill, subagent, team, todo, workflow), `docs/` (cli-help, config-catalog,
  cordis-primer, capability-seams, tool-catalog, architecture, `user/guide/*`).
- Installed globally with `npm install -g @deepseek-ai/dsh` at version `0.2.2-rc.1`, which is the
  package's `latest` dist-tag. Command `dsh` at `~/.local/bin/dsh`, package at
  `~/.local/lib/node_modules/@deepseek-ai/dsh`. npm 11 skipped the install scripts of five
  dependencies: `@deepseek-ai/dsh-subprocess-local`, `koffi`, `node-pty`, `@google/genai`,
  `protobufjs`. Whether headless use needs any of them is open.
- `DSH_HOME` is unset and no home directory for the harness exists yet. No provider is configured.
- Launcher shape from `dsh --help` and `dsh-src/docs/cli-help.md`:
  `dsh [--profile] <name> [options] [app-args...]`. Shipped profiles named in the help: `web`,
  `tui`, `headless`, `acp`, `sdk`, `sdk-minimal`. The help's example
  `dsh headless "run the tests"` answers one task, prints the result and exits. Launcher flags:
  `--profile`, `--from-default-profile`, `--patch <path>` (repeatable overlay),
  `--dump-config`, `--dump-config-schema`, `--dump-default-config`.
- Providers, from `dsh-src/docs/user/guide/providers.md`: DeepSeek is built in. Third-party
  catalog providers are added by id. A custom model API takes a lowercase provider id, base URL,
  protocol (`openai-completions`, `openai-responses`, `anthropic-messages`), credential and
  models, stored in `$DSH_HOME/profiles/<profile>/cordis.patch.yml`; keys go to
  `$DSH_HOME/.credentials.yaml`. A pi-ai provider entry accepts `apiKeyEnv`, `api`, `baseURL`
  and `models`.

## 2. The operator's provider routes

- LLM Gateway, also called DevPass: base URL `https://api.llmgateway.io/v1`, protocol
  OpenAI chat completions, model `deepseek-v4.1-flash-1017` (also `glm-5.3-flash`). Source:
  `~/.pi/agent/models.json` and `~/.hermes/config.yaml`. Live smoke through OpenCode 2 on
  2026-11-05 answered `OK-GW`, exit 0.
- OpenCode Go: base URL `https://opencode.ai/inference/go/openai/v1` from the public models.dev
  catalog, model `deepseek-v4.1-flash`. Only OpenCode 1 lists this provider. Live smoke on
  2026-11-05 failed with `[overloaded] the server is overloaded`, exit 1.
- The operator will enter keys into the harness themselves. Never copy, read or print a key.

## 3. The model to mirror: cli-pi

- Skill packet: `.skilled/skills/cli-external-orchestration/cli-pi/` (`SKILL.md`, `ROUTER.md`,
  `hard-rules.json`, `references/`, `assets/`, `manual-testing-playbook/`, `benchmark/`,
  `changelog/`).
- Repo runtime folder: `.pi/` holds `agents`, `prompts`, `skills`, `extensions` (18 repo guard
  extensions plus `pi-cache-optimizer` and `pi-fast-mode-w-subagent-support`), `repo-rules`,
  `manual-testing-playbook`, `settings.json`, `models.json`, `mcp.json`, `PLUGINS.md`,
  `custom-providers.md`, `SYNC.md`, `statusline.sh`, `npm/`, `git/`.
- The most recent runtime added, Hermes, is the closest precedent for the work itself:
  `specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/` (16 phases, a parent `goal.md`,
  one `goal.md` per build phase) and its repo folder `.hermes/`.

## 4. Integration touch points already known

Files that name `cli-hermes` outside its own packet, so each is a candidate touch point for the
new mode. Confirm each and find the ones this list misses.

- Hub: `.skilled/skills/cli-external-orchestration/` `SKILL.md`, `ROUTER.md`, `README.md`,
  `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`,
  `description.json`, `feature-catalog/`, and one mention in each sibling mode packet.
- Deep loop runtime: `runtime/scripts/fanout-run.cjs`, `runtime/lib/deep-loop/executor-config.ts`,
  `runtime/lib/deep-loop/executor-audit.ts`, unit tests `executor-config`, `fanout-run`,
  `combo-matrix`, the stress adapter suite (`tests/stress/cli-adapter/` with a per-runtime shim
  and vitest), `runtime/feature-catalog/fanout/fanout-run.md`.
- Deep loop modes: `deep-research`, `deep-review` and `deep-ai-council` `SKILL.md` and loop
  protocol references; council `scripts/orchestrate-session.cjs` and its test; seat diversity
  patterns.
- Commands: `.skilled/commands/deep/assets/` research and review auto YAML, presentation text and
  compiled contracts; `.skilled/commands/doctor/assets/agents-md-manifest.json`.
- Hooks: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and its two tests.
- Advisor and routing: `system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh`,
  `.skilled/bin/lib/compiled-routing/.../004-cli-external-orchestration/` fixtures and harness.
- Other: `sk-prompt` `SKILL.md` and assets, `.skilled/agents/orchestrate.md`,
  `.skilled/agents/prompt-improver.md`, `sk-doc` code-folder test manifests, root `AGENTS.md`,
  `README.md`, `SECURITY.md`, `.skilled/skills/README.txt`.
