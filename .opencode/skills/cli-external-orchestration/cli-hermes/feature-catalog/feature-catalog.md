---
title: "cli-hermes: Feature Catalog"
description: "Current-state inventory for the cli-hermes mode: hub registration, the Hermes executor kind and its lineage command, the dispatch guards, the .hermes runtime surface, and the prompt contract."
trigger_phrases:
  - "cli-hermes feature catalog"
  - "cli-hermes capabilities"
  - "hermes executor kind"
  - "hermes lineage command"
  - "hermes dispatch guards"
  - "hermes runtime folder"
last_updated: "2026-09-14"
version: 1.0.0.0
---

# cli-hermes: Feature Catalog

This catalog inventories the live `cli-hermes` surface. `cli-hermes` is a workflow packet of the `cli-external-orchestration` hub that orchestrates Hermes Agent, Nous Research's Python agent CLI, as a headless executor: the hub resolves the mode, the shared deep-loop runtime builds and runs the process, the dispatch hooks inspect and preflight the command, and the repository's `.hermes/` folder carries the little that Hermes reads from a project.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the shipped `cli-hermes` surface. The packet itself holds no spawn path: it owns the Hermes workflow contract, and every capability below lives either in the hub's routing files, the shared deep-loop runtime, the runtime-neutral dispatch hooks, or the repo's Hermes runtime folder. The numbered sections group those layers so a reader can move from a summary into the per-feature file that carries the implementation and test anchors.

---

## 2. HUB REGISTRATION

### Hub Mode Registration

#### Description

The hub registers `cli-hermes` as a workflow mode, so a Hermes-naming request resolves through `hub-router.json` scoring and `mode-registry.json` dispatch rather than a hub default.

#### Current Reality

`cli-hermes` is one of the hub's seven workflow modes, with `packetKind: "workflow"`, `mutatesWorkspace: true`, a `metadata` advisor routing class, and an alias set the executor-delegation scorer sources from the registry. Two vocabulary classes score it in stage one, and `ROUTER.md` maps its `HERMES` intent onto packet-qualified leaf resources in stage two. The packet adds no `description.json` and no `graph-metadata.json`; advisor identity stays at the hub root.

#### Source Files

See [`hub-registration/hub-mode-registration.md`](hub-registration/hub-mode-registration.md) for the registry entry, both routing stages, and the validation anchors.

---

## 3. FAN-OUT DISPATCH

### Hermes Executor Kind And Lineage Command

#### Description

`cli-hermes` is a first-class `ExecutorKind`, and `buildHermesLineageCommand` emits the one auditable headless shape a fan-out lineage runs: `hermes chat -Q --oneshot` with the prompt delivered on stdin.

#### Current Reality

The builder refuses to construct a command when `command -v hermes` fails, then emits a fixed argument spine: the quiet oneshot form, `--query-file -`, the `llmgateway` provider, an allowlisted model, `--ignore-rules`, `--source tool`, turn and budget bounds, and an explicit toolset list. `--yolo` is added for every lineage that is not read-only. The kind supports `model`, `reasoningEffort`, `timeoutSeconds` and `liveTools`, and is recorded as having no preventive OS sandbox, because Hermes ships no confinement flag.

#### Source Files

See [`fanout-dispatch/hermes-executor-kind.md`](fanout-dispatch/hermes-executor-kind.md) for the argument spine, the flag-support entry, and the sandbox-capability ruling.

---

### Closed Two-Model Gateway Roster

#### Description

Dispatch is fenced to the two model ids reachable through the operator's `llmgateway` provider block, and the lineage builder rejects any other id before a process is spawned.

#### Current Reality

`HERMES_SUPPORTED_MODELS` holds `deepseek-v4.1-flash` and `glm-5.3-flash`, with the DeepSeek literal as the rotation default, and `isHermesModelAllowed` is the predicate over it. The fan-out script carries a deliberate synchronous mirror of that set so command construction fails closed without importing the TypeScript module, and an off-roster id raises an input error naming the allowlist. The provider name itself is pinned, because Hermes resolves `--provider` by a user-defined block the repository cannot carry.

#### Source Files

See [`fanout-dispatch/closed-model-roster.md`](fanout-dispatch/closed-model-roster.md) for the roster, the mirrored allowlist, and the rejection path.

---

### Toolset Selection And Web-Search Policy

#### Description

The `-t` toolset list is a leaf's real boundary: `delegation` and `memory` are never included, a read-only lineage narrows to search and todo, and the `web` toolset follows the lineage's web-search policy.

#### Current Reality

`HERMES_LEAF_TOOLSETS` names terminal, file, search, skills and todo; `HERMES_READ_ONLY_TOOLSETS` narrows to search and todo. `hermesToolsetsFor` picks between them on the resolved sandbox and appends `web` unless the web-search policy is `disabled`. Because the toolset list is per dispatch, Hermes is one of the few kinds whose web-search capability matrix records both `disabled` and `live` as enforceable alongside `inherit`; nothing caches, so `cached` stays unsupported. A configured MCP server is invisible to a run whose `-t` list does not name it.

#### Source Files

See [`fanout-dispatch/toolset-and-web-search-policy.md`](fanout-dispatch/toolset-and-web-search-policy.md) for the two rosters, the selection function, and the capability matrix.

---

### Run-Budget Margin And Reasoning Pin

#### Description

The lineage's `--run-budget` sits one fixed margin under the caller's timeout, `--max-turns` bounds a runaway tool loop, and the reasoning level is pinned per model and checked against Hermes's own level set.

#### Current Reality

The builder derives the budget from the lineage timeout, or a default when none is given, and subtracts a fixed margin so Hermes's own wrap-up wins the race against the runner's kill; budget expiry carries no distinct exit code, which is why the margin exists. Turns are capped below Hermes's own default. The resolved reasoning effort is validated against the `--reasoning` level set rather than assumed equal to the runtime's own effort names, so a rename on either side fails closed instead of emitting an unknown level.

#### Source Files

See [`fanout-dispatch/run-budget-and-reasoning-pin.md`](fanout-dispatch/run-budget-and-reasoning-pin.md) for the budget arithmetic, the turn cap, and the reasoning validation.

---

### Executor Audit Identity And Environment Scoping

#### Description

The audit layer gives `cli-hermes` its binary name, its self-presence session variable, its state-directory and home overrides, and the environment prefixes a dispatched child may inherit.

#### Current Reality

The audit tables name `hermes` as the binary, `HERMES_SESSION_ID` as the self-presence signal a Hermes-hosted shell carries into every child, `SPECKIT_HERMES_STATE_DIR` and `HERMES_HOME` as the state-scoping variables, and `.hermes` as the runtime dotfolder. Dispatch env pass-through is limited to the `HERMES_` and `LLMGATEWAY_` prefixes, since Hermes loads its own `.env` from the user home. The fan-out reads the same state-directory variable when it scopes a lineage.

#### Source Files

See [`fanout-dispatch/executor-audit-identity.md`](fanout-dispatch/executor-audit-identity.md) for the identity tables and the environment contract.

---

## 4. DISPATCH GUARDS

### Hermes Dispatch-Shape Recognition

#### Description

The shared dispatch inspector recognizes `hermes chat` with a query flag, and the top-level `-z` oneshot, as a dispatch, while a bare chat or a management subcommand stays unrecognized.

#### Current Reality

Hermes has no print flag, so it gets its own branch in both the regex shape registry and the tokenizing inspector: `hermes` in command position plus `chat` plus one of the query flags classifies as `direct cli-hermes`, and the top-level `-z` form does too. `hermes status` and `hermes skills list` classify as `none`. The Hermes query flags are scoped to that branch so a `-q` on any other command never reads as dispatch evidence. A recognized dispatch is what reaches the audit trail's scrub, bound and append pipeline.

#### Source Files

See [`dispatch-guards/dispatch-shape-recognition.md`](dispatch-guards/dispatch-shape-recognition.md) for the shape registry, the inspector branch, and the audit-line pipeline.

---

### Hermes Hard-Rule Preflight Checks

#### Description

Seven Hermes-specific checks evaluate a composed command before it is spawned, covering binary availability, approval scope, rule injection, toolsets, worktrees, MCP configuration and hooks.

#### Current Reality

The packet declares its hard rules in `SKILL.md` frontmatter and the dependency-free engine implements the matching checks: a PATH availability check that refuses only when PATH is readable and the binary is conclusively absent, an approval-scope check that requires `--yolo` when a write or terminal toolset is named, a check that `--ignore-rules` is always passed, a check that an explicit toolset list exists and excludes `delegation` and `memory`, and refusals for `--worktree`, for `hermes mcp add`-shaped operator steps, and for `--accept-hooks`. The headless stdin rule also recognizes both Hermes forms and treats `--query-file` as satisfying it. Every check fails open on an exception, and a rule's declared severity decides whether a violation blocks or advises.

#### Source Files

See [`dispatch-guards/hard-rule-preflight-checks.md`](dispatch-guards/hard-rule-preflight-checks.md) for each check, its trigger shape, and the severity mapping.

---

## 5. RUNTIME SURFACE

### Hermes Runtime Folder And Prompt Sync

#### Description

The repository's `.hermes/` folder carries one generated markdown-only SKILL.md copy per canonical skill, generated command-prompt stubs, one project plugin and a sync manifest, and nothing that pretends to configure Hermes.

#### Current Reality

Hermes reads exactly two things from a project folder, skills and plugins, and everything else it reads lives in the operator's home. So `.hermes/skills/<name>` holds one directory link per curated skill rather than a link to the whole skills tree, which Hermes's static scanner would walk and quarantine at every session start. `.hermes/prompts/*.md` are generated from the command tree by a sync script whose `--check` mode reports drift and whose write mode prunes stale output, using the flattened command path as the prompt name. `SYNC.md` records the surface inventory, the operator steps that stay user-level, and when to re-sync.

#### Source Files

See [`runtime-surface/hermes-runtime-folder.md`](runtime-surface/hermes-runtime-folder.md) for the surface inventory, the prompt generator, and the operator boundary.

---

### Repo-Guards Project Plugin

#### Description

The `repo-guards` project plugin bridges this repository's existing guard cores into a Hermes session through the plugin hook surface, shelling out to each core and failing open.

#### Current Reality

The plugin manifest declares `pre_tool_call`, `pre_verify` and `on_session_end`, and its registration function registers exactly those three. Each hook runs an existing core with the same JSON payload the Devin adapters send, under a bounded timeout, and maps the core's answer onto Hermes's directive shapes; a missing core, a timeout or an unparsable answer resolves to a pass. The `pre_tool_call` hook additionally refuses a nested Hermes dispatch from inside a Hermes session. Loading is opt-in: the environment variable Hermes uses for project plugins must be set, and the plugin key must be listed in the operator's own config.

#### Source Files

See [`runtime-surface/repo-guards-project-plugin.md`](runtime-surface/repo-guards-project-plugin.md) for the hook map, the core bridge, and the enablement contract.

---

## 6. PROMPT CONTRACT

### Prompt-Quality Card Sync And Prompt-Improver Eligibility

#### Description

The packet's prompt-quality card is held in sync with the canonical card by a repository guard, and the prompt-improver agents carry the `cli-hermes` model-eligibility row across three runtimes.

#### Current Reality

The packet ships a thin delegator card rather than a copy, and the sync guard lists the `cli-hermes` card among the delegators it checks and `cli-external-orchestration/cli-hermes` among the CLI skills it walks. The prompt-improver agent definition carries a `cli-hermes` row naming the two gateway model ids and stating that the roster is closed, and the row is mirrored in the Claude and Codex copies of that agent. Persona handling is a packet rule rather than a Hermes feature: Hermes has no flag that loads an agent file, so the resolved persona is inlined into the dispatch prompt.

#### Source Files

See [`prompt-contract/prompt-card-and-improver-eligibility.md`](prompt-contract/prompt-card-and-improver-eligibility.md) for the card delegation, the sync guard, and the eligibility rows.
