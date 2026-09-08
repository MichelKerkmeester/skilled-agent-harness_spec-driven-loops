# v4.0.0.0 Repository State Inventory and Changelog Fact-Check

## Scope and verdict

This detached `luna` lane audited the checkout on branch `skilled/v4.0.0.0` for ten required angles and compared the draft at `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` with current registries, command files, runtime code, hooks, mirrors, CI, and packet paths. The draft preserves several durable architectural changes, but it is not a safe current-state inventory: its P0 errors describe removed commands or unregistered modes as daily or shipped surfaces.

The most urgent corrections are:

- retire `memory_search`/`memory_save` and the memory-database/MCP narrative; current retrieval is the committed trigger index plus ripgrep;
- replace `/interface:*` and `/create:diagram` with the live `/design:*` surface;
- remove `deep-alignment` and the eight-mode ledger claim; six deep-loop modes are registered;
- qualify goals as OpenCode/Pi/Cursor support with different capabilities, not universal tool coverage;
- remove the `prompt-models` two-mode/six-profile topology; `sk-prompt` is a standalone one-mode leaf;
- correct the hook kill-switch vocabulary and the three-digit `worktrees/`/`branches/` allocator grammar.

## Evidence boundaries

Registries and code were treated as ground truth, followed by repository policy, then README/feature narrative. “Confirmed” means the cited live file was opened. “Inferred” means a claim came from chronology or commit subject and was not promoted without a live contract. This lane performed no network fetch, Git write, checkout, validation, metadata generation, or nested executor dispatch. Every artifact created by this lane is inside this lineage directory.

## Complete inventory by hub

### Parent hubs

| hub | live modes and routing class | command entrypoints | agents / operational notes |
|---|---|---|---|
| `cli-external-orchestration` | `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`; mode registry entries are metadata-routed under one hub identity. | No dedicated mode command; six executor packets are reached through deep-loop/fan-out dispatch. | Six CLI builders; packet-specific model/auth/sandbox contracts; `deep-research`, `deep-review`, `deep-improvement`, `ai-council`, and `orchestrate` consume the executor surface. [SOURCE: `.opencode/skills/cli-external-orchestration/mode-registry.json:19`; `.opencode/skills/cli-external-orchestration/SKILL.md:54`] |
| `mcp-tooling` | Nine modes: workflow `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`; transport `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath`; all metadata-routed. | No mode-specific slash command; `/doctor:mcp` is the separate install/debug router. | Browser, ClickUp, Obsidian, Aside and Notion workflows; four read-only/external transports. `mcp-code-mode` remains external shared substrate. [SOURCE: `.opencode/skills/mcp-tooling/SKILL.md:15,25-39`; `.opencode/skills/mcp-tooling/mode-registry.json:11-15,31-37`] |
| `sk-code` | Six modes: workflow `sk-code-quality`, `sk-code-review`; read-only surface `sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli`, `sk-code-obsidian`. | No dedicated mode command; routes through the general code/agent surfaces. | Code, review, and stack evidence are separated; review is first-class. [SOURCE: `.opencode/skills/sk-code/mode-registry.json:3-7,30-44,92-110`] |
| `sk-design` | Four modes: `sk-design-fundamentals`, `sk-design-md-generator`, `sk-design-chart`, `sk-design-diagram`; metadata-routed. | `/design:extract`, `/design:chart`, `/design:diagram`; fundamentals uses aliases. | The current design command family is `/design:*`, not `/interface:*`. [SOURCE: `.opencode/skills/sk-design/SKILL.md:58-69`; `.opencode/commands/design/extract.md:1-13`] |
| `sk-doc` | Fourteen workflow modes: `sk-create-skill`, `sk-create-skill-parent`, `sk-create-readme`, `sk-create-agent`, `sk-create-command`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook`, `sk-create-benchmark`, `sk-create-changelog`, `sk-create-diff`, `sk-create-frontmatter`, `sk-create-quality-control`, `sk-create-repo-rule`, `sk-create-with-human-voice`; all metadata except quality-control's template-scaffold distinction. | Twelve dedicated `/create:*` routers: `/create:skill`, `/create:skill-parent`, `/create:readme`, `/create:agent`, `/create:command`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:benchmark`, `/create:changelog`, `/create:diff`, `/create:repo-rule`, `/create:with-human-voice`; frontmatter and quality-control are routed aliases/null-command modes. | Naming guard, template/level contract, DQI quality gate and packet-local resources. No `sk-create-diagram`. [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19-53,396-453`; `.opencode/commands/create/skill.md:7-20`] |
| `system-deep-loop` | Six modes: `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`; routing classes are lexical, alias-fold, or command-bridge by mode. | `/deep:research`, `/deep:review`, `/deep:ai-council`, `/deep:agent-improvement`, `/deep:model-benchmark`, `/deep:skill-benchmark`. | Ledger/state/reducer runtime, six CLI executors, bounded fan-out, convergence telemetry, and max-iterations stop policy. No `deep-alignment`. [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:19-117`; `.opencode/commands/deep/research.md:1-10`] |

### Standalone roots

| root | mode/topology and command | current contract |
|---|---|---|
| `mcp-code-mode` | One standalone mode; no hub membership. | Shared MCP execution substrate with search/list/info and exact-name `call_tool_chain`; external to mcp-tooling. [SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:14-16,213-222,350-380`] |
| `sk-communication` | One standalone projection mode; `/rewrite:response`, `/rewrite:response-by-external-agent`, `/rewrite:explain-visually`. | Opt-in, advisor-excluded, canonical-output-preserving projection. [SOURCE: `.opencode/skills/sk-communication/SKILL.md:14-16,192-240`] |
| `sk-git` | One standalone no-spec skill; no mode registry. | Ask-first worktree/current-branch choice; three-digit allocator; push allowlist; pre-push and live-sync guardrails; GitKraken local mutations route to Bash. [SOURCE: `.opencode/skills/sk-git/SKILL.md:276-305,359-367`] |
| `sk-prompt` | One standalone leaf; eight internal operating modes (interactive, text, short, improve, refine, JSON, YAML, raw) and seven frameworks. | No registered `prompt-models` mode or six-profile topology. [SOURCE: `.opencode/skills/sk-prompt/SKILL.md:3,12,292-319`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`] |
| `sk-vision` | One standalone mode; `/vision`. | Locked 13-tool JSON-RPC/Moondream surface with host-specific adapters. [SOURCE: `.opencode/skills/sk-vision/SKILL.md:162-221`] |
| `system-skill-advisor` | One standalone daemon-backed mode; no parent hub. | Nine MCP tools, graph metadata, CLI front door, dual confidence/uncertainty thresholds, structural state containment and fail-open hook brief. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/index.ts:43`; `.opencode/skills/system-skill-advisor/graph-metadata.json:3-10`] |
| `system-spec-kit` | One standalone skill with nested `runtime/cli/`, shared package, retrieval and spec/continuity tooling. | `/speckit:complete`, `/speckit:plan`, `/speckit:implement`, `/speckit:resume`, `/speckit:save`, `/speckit:search`; lexical retrieval and 40 registered validation rules. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/README.md:13,62`; `.opencode/commands/speckit/search.md:138`; `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1,367,416`] |

### Command tree and agents

The 37 primary command entrypoints are:

| family | commands |
|---|---|
| root | `/agent-router` |
| create | `/create:agent`, `/create:benchmark`, `/create:changelog`, `/create:command`, `/create:diff`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:readme`, `/create:repo-rule`, `/create:skill-parent`, `/create:skill`, `/create:with-human-voice` |
| deep | `/deep:agent-improvement`, `/deep:ai-council`, `/deep:model-benchmark`, `/deep:research`, `/deep:review`, `/deep:skill-benchmark` |
| design | `/design:chart`, `/design:diagram`, `/design:extract` |
| doctor | `/doctor:mcp`, `/doctor:speckit`, `/doctor:update` |
| goal | `/goal-opencode` |
| prompt | `/prompt:improve` |
| rewrite | `/rewrite:explain-visually`, `/rewrite:response-by-external-agent`, `/rewrite:response` |
| speckit | `/speckit:complete`, `/speckit:implement`, `/speckit:plan`, `/speckit:resume`, `/speckit:save`, `/speckit:search` |
| vision | `/vision` |

The remaining 11 Markdown files under `.opencode/commands/` are support/readme/compiled-contract artifacts rather than additional user-facing command entrypoints: deep compiled/legacy assets, doctor scripts README, command scripts README/fixtures README. [SOURCE: `.opencode/commands/` file inventory; `.opencode/commands/speckit/plan.md:2`; `.opencode/commands/design/diagram.md:1-13`]

The canonical agent roster has 12 agents: `ai-council`, `code`, `context`, `debug`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, and `review`. The runtime mirror registry and per-runtime sync manifests project these across Claude, Codex, Cursor, Devin, and Pi using different generated, symlink, nested, and native-extension mechanisms. [SOURCE: `.opencode/agents/`; `AGENTS.md:436-440`; `.codex/SYNC.md:9-29`; `.cursor/SYNC.md:9-29`; `.devin/SYNC.md:9-30`]

## Ranked drift table

| rank | severity | draft claim | verdict | correction |
|---:|:---:|---|---|---|
| 1 | P0 | `memory_search`/`memory_save` remain daily commands and memory retrieval is the current engine. | FALSE | Remove the memory database/MCP narrative; current retrieval is lexical index + ripgrep. [SOURCE: `CHANGELOG-v4.0.0.0.md:11,61-76`; `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:16,57`] |
| 2 | P0 | `/interface:*` remains a daily family and the design surface uses a nine-stage interface contract. | FALSE | Use `/design:extract`, `/design:diagram`, and `/design:chart`. [SOURCE: `CHANGELOG-v4.0.0.0.md:11,256-266`; `.opencode/commands/design/extract.md:1-13`] |
| 3 | P0 | `sk-create-diagram` and `/create:diagram` are shipped. | FALSE | Diagram ownership is `sk-design-diagram` and `/design:diagram`. [SOURCE: `CHANGELOG-v4.0.0.0.md:126`; `.opencode/skills/sk-design/SKILL.md:58-69`] |
| 4 | P0 | `deep-alignment` is usable and the ledger is authoritative for eight modes. | FALSE | Publish six registered deep-loop modes; no alignment mode is registered. [SOURCE: `CHANGELOG-v4.0.0.0.md:23,149-180`; `.opencode/skills/system-deep-loop/mode-registry.json:19-117`] |
| 5 | P0 | Goals have equal weight in every tool. | FALSE | Support is OpenCode/Pi/Cursor only, with Cursor injection-only and Pi turn-end verification. [SOURCE: `CHANGELOG-v4.0.0.0.md:31,226`; `.opencode/hooks/goal/goal-plugin.md:141-153`] |
| 6 | P0 | `sk-prompt` has `prompt-improve`/`prompt-models` modes, six profiles, and a folded `sk-prompt-models` path. | FALSE | Describe one standalone sk-prompt leaf with seven frameworks and internal operating modes. [SOURCE: `CHANGELOG-v4.0.0.0.md:29,345-361`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`] |
| 7 | P0 | The hook library is controlled by `MK_HOOKS_DISABLED` and the old branch grammar is `<skill>/{NNNN}-{slug}`. | FALSE | Use `SYSTEM_HOOKS_DISABLED`/`SYSTEM_*` concern flags and `worktrees/{NNN}-{slug}` / `branches/{NNN}-{slug}`. [SOURCE: `CHANGELOG-v4.0.0.0.md:242-248,331-337`; `.opencode/hooks/README.md:39-70`; `.opencode/skills/sk-git/SKILL.md:359-363`] |
| 8 | P1 | Seven hubs all have the same two-axis shape. | STALE | There are six parent hubs and seven standalone roots; axes differ by hub. [SOURCE: `.opencode/skills/README.txt:30`; `.opencode/skills/cli-external-orchestration/mode-registry.json:19`] |
| 9 | P1 | sk-doc has the draft's diagram packet and uniform surface/workflow topology. | STALE | It has 14 live modes; design owns diagrams and sk-doc is not universally two-axis. [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19-53`; `.opencode/skills/sk-design/SKILL.md:58-69`] |
| 10 | P1 | mcp-tooling's draft roster/count is complete. | STALE | The hub has nine modes, including Notion and MagicPath, with five workflows and four transports. [SOURCE: `CHANGELOG-v4.0.0.0.md:369-383`; `.opencode/skills/mcp-tooling/SKILL.md:15,25-33`] |
| 11 | P1 | Advisor residual state leakage and ABI 141 startup are current confirmed behavior. | STALE/MISSING | Structural containment is current; ABI and residual leakage require reproduction. [SOURCE: `CHANGELOG-v4.0.0.0.md:98-104`; `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:31`; `.opencode/bin/skill-advisor.cjs:19-43`] |
| 12 | P1 | The parent phase map is the complete v4 chronology. | STALE | The map stops at row 29 while later 029-goal-resync and 030–033 directories exist. [SOURCE: `specs/system-speckit/033-system-speckit-v4/spec.md:138-143`; live packet directory inventory] |
| 13 | P1 | Exact template, corpus, line-count, performance, benchmark, Rust, and Obsidian numbers are release facts. | MISSING | Attach reproducible measurements before publishing numeric claims. [SOURCE: `CHANGELOG-v4.0.0.0.md:80,137,236,260,303,389`] |
| 14 | P2 | Specs compatibility symlink, Pi native bridge, sk-code review hub, CLI consolidation, Open Design removal, Figma nesting, and communication projection are shipped. | TRUE | Retain the concrete claims and update their counts/paths. [SOURCE: `.opencode/specs -> ../specs`; `.pi/extensions/README.md:11-24`; `.opencode/skills/mcp-tooling/SKILL.md:30`; `.opencode/skills/sk-communication/SKILL.md:14-16`] |

## Upgrade-notes candidate list

1. **Memory retrieval:** remove calls and documentation for `memory_search`, `memory_save`, system-spec-memory, database, daemon, and MCP retrieval; use `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` plus ripgrep recipes.
2. **Spec path:** canonical packets are under top-level `specs/`; `.opencode/specs` currently symlinks to `../specs`, so migration notes should state both the canonical path and compatibility target.
3. **Runtime path/package:** update references from old `scripts/`/`mcp-server` identity to `.opencode/skills/system-spec-kit/runtime/cli/` and current shared/runtime package roots.
4. **Deep-loop modes:** replace alignment/eight-mode prose with the six registered modes and executor-specific allowlists/flags; do not say “any model” when the runtime uses curated rosters.
5. **Design commands:** replace `/interface:*` and `/create:diagram` with `/design:extract`, `/design:diagram`, and `/design:chart`; move diagram ownership from sk-doc to sk-design.
6. **Prompt topology:** remove `sk-prompt-models`, six-profile, and `prompt-improve` mode claims unless a later registry adds them; current `sk-prompt` is standalone.
7. **MCP path/roster:** update flat `.opencode/skills/mcp-figma` references to nested `mcp-tooling/mcp-figma`; enumerate nine modes and four transports.
8. **Goal scope:** document OpenCode native plugin, Pi native management/injection, Cursor injection-only; do not promise Claude/Codex/Devin goal support.
9. **Hook names:** replace `MK_HOOKS_DISABLED` with `SYSTEM_HOOKS_DISABLED` and canonical `SYSTEM_*` concern switches; explain real portable cores versus symlink index entries.
10. **Worktree/push policy:** use the three-digit `worktrees/`/`branches/` allocator and fresh approval for non-allowlisted pushes; retain pre-push enforcement.
11. **Mirror operations:** state that Codex is generated/outbound-installed, Cursor and Devin are symlink/discovery shaped, and Pi uses native extensions; use mirror checkers as authoritative counts.
12. **Chronology:** append 029 goal resync, 030 simplification, 031 CI resolution, 032 recorded-findings closure, and 033 dependency hardening to the parent phase map or clearly label the map historical.

## Reproduction-pass disagreements to settle

- Run the read-only mirror checkers to reconcile the sync-manifest “13 agents/35 prompts” prose with the current 12 canonical agent `.md` files and command tree; confirm each runtime's generated/symlink target.
- Verify whether the parent v4 phase map should be regenerated to include the second 029 and 030–033 directories; the current directory inventory and `spec.md` disagree.
- Reproduce the advisor state path from inside a spec folder and inspect the installed ABI before retaining or removing the draft's residual-leak and ABI-141 claims.
- Reproduce benchmark blocked exit code 3, the Rust six-touchpoint claim, the Obsidian installed-tool mismatch, exact template line/byte reductions, and design corpus/performance numbers.
- Resolve mcp-tooling's prose “all eight modes” against its nine-entry table/registry; resolve sk-doc prose claiming fifteen against its fourteen registry entries.
- Decide whether numeric ledger names such as `new_authoritative_final` are still exposed contract fields or only historical rollout labels.
- Confirm the current `open_design`/`design-generation-patterns.md` removal in runtime config, not only by absence from the current mode table.
- Compare the true current agent/mirror roster against every generated runtime output without relying on narrative counts.

## Confirmed versus inferred

Confirmed by opened live sources: current hubs/modes, command tree, agent names, system-spec-kit nested runtime, 40-rule registry, lexical retrieval, deep-loop six-mode registry, six executor packets and allowlists, advisor tools/thresholds/containment, sk-doc 14 modes, design `/design:*` routers, mcp-tooling nine modes, runtime mirror mechanisms, centralized hook flags, goal runtime table, CI workflow roster, specs symlink, retired paths, and three-digit worktree grammar.

Inferred or still requiring reproduction: commit-subject semantics, ABI 141, exact performance/corpus/line-count measurements, benchmark exit code 3, Rust registration count, Obsidian API gap, comparative Pi rankings, exact ledger rollout labels, and whether all later phase directories are fully represented in the parent timeline.

## Iteration ledger

| iteration | angle | novelty | status |
|---:|---|---:|---|
| 1 | ROSTER | 1.00 | complete |
| 2 | SYSTEM-SPEC-KIT | 0.95 | complete |
| 3 | SYSTEM-DEEP-LOOP | 0.90 | complete |
| 4 | SYSTEM-SKILL-ADVISOR | 0.88 | complete |
| 5 | SK-DOC | 0.86 | complete |
| 6 | CLI-EXTERNAL-ORCHESTRATION | 0.84 | complete |
| 7 | THE OTHER HUBS | 0.86 | complete |
| 8 | RUNTIME MIRRORS, HOOKS, CI AND GOALS | 0.82 | complete |
| 9 | BREAKING CHANGES AND UPGRADE NOTES | 0.78 | complete |
| 10 | DRAFT-VERSUS-REALITY | 0.74 | complete |

Convergence was telemetry only. The configured stop policy was `max-iterations`; synthesis was intentionally deferred until iteration 10.
