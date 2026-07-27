# Decommissioning `system-code-graph` and `mk_code_index`

## 1. Executive Summary

The provider is not removable as a directory-only change. The live contract spans three physical MCP registrations, two standalone front doors, two OpenCode plugins, four runtime hook families, a mixed Git hook, mixed CI, Spec Kit executable consumers and compiled output, eight canonical agent definitions plus runtime projections, at least thirteen command allowlists, doctor/install routes, worktree isolation, Skill Advisor tri-daemon assumptions, current documentation, tests, caches, ignored state, and user-installed Codex hooks.

The safe direction is consumer-first: remove calls, grants, hooks, recovery guidance, and generated consumers; remove registration and reinstallation paths; drain processes; delete the provider/front doors; prune shared infrastructure; reconcile current docs and counts; then run negative startup and classified residual gates. Historical specs, changelogs, and benchmark reports remain unchanged.

## 2. Research Question

Which registrations, imports, shell-outs, hooks, plugins, CI jobs, documents, agent grants, command grants, and doctrine claims must change to fully decommission `.opencode/skills/system-code-graph/**` and the `mk_code_index` MCP server, and what ordering and rollback risks govern that work?

## 3. Scope and Boundaries

Included:

- tracked runtime, configuration, source, compiled output, hooks, plugins, CI, agents, commands, tests, and current documentation;
- ignored operator/runtime state needed for cleanup planning;
- all exact and alternative identities: `system-code-graph`, `mk_code_index`, `mk-code-index`, `mcp__mk_code_index__*`, `code_graph_*`, `detect_changes`, `code-index.cjs`, `mk-code-graph`, graph boundary modules, socket names, and environment variables;
- physical symlink deduplication and old-contract consumers.

Excluded from proposed edits:

- `.opencode/specs/**`;
- changelogs;
- benchmark reports and captured benchmark transcripts;
- unrelated graph subsystems: Spec Memory causal/knowledge graphs, Skill Advisor’s skill graph, and deep-loop coverage/council graphs.

The retiring skill’s own tree is one deletion unit. Its internal changelogs and benchmarks are not selectively rewritten.

## 4. Method

All repository sweeps used `rg --hidden --no-ignore`, with explicit exclusions for `.git/**`, `.worktrees/**`, dependencies, scratch/log noise where appropriate, and the active lineage. `rg --no-ignore` alone proved insufficient because it returned only four visible matches and omitted hidden control files.

The work used ten forced iterations:

1. topology and raw baseline;
2. runtime registrations/launchers/plugins;
3. executable dependencies;
4. hooks and CI;
5. agents and commands;
6. current documentation/doctrine;
7. archival classification;
8. ordering and rollback;
9. build/test verification;
10. adversarial residuals.

## 5. Physical Registration Topology

Three physical files register the MCP:

| Authority | Evidence | Required action |
|---|---|---|
| `opencode.json` | `opencode.json:69` | Remove the `mk_code_index` server block |
| `.codex/config.toml` | `.codex/config.toml:31` | Remove the MCP server table |
| `.claude/mcp.json` | `.claude/mcp.json:58` | Remove the server object |

Aliases are not separate edits:

- `CLAUDE.md -> AGENTS.md`;
- `.mcp.json -> .claude/mcp.json`;
- `.cursor/mcp.json -> ../.mcp.json -> .claude/mcp.json`.

All three registrations launch `.opencode/bin/mk-code-index-launcher.cjs` and carry graph scope/socket configuration. Remove registration before deleting the launcher so existing clients fail closed during the migration window.

## 6. Provider, Front Doors, and Runtime Infrastructure

Delete as provider-owned:

- `.opencode/skills/system-code-graph/**`;
- `.opencode/bin/mk-code-index-launcher.cjs`;
- `.opencode/bin/code-index.cjs`;
- `.opencode/bin/mk-code-index-launcher-*.vitest.ts`;
- graph-only CLI smoke cells and plugin tests.

Prune from shared infrastructure:

- `.opencode/bin/lib/launcher-ipc-bridge.cjs:89`;
- `.opencode/bin/mk-spec-memory-launcher.cjs:1142`;
- `.opencode/bin/worktree-session.sh`;
- `.opencode/scripts/session-cleanup.sh:99`;
- `.opencode/scripts/orphan-mcp-sweeper.sh:209`;
- `.opencode/bin/cli-offline-smoke.cjs` / `.test.cjs`;
- `.opencode/bin/cli-exit-taxonomy-smoke.cjs`;
- `.opencode/bin/README.md` and `.opencode/bin/lib/README.md`.

Preserve generic bridge behavior and the memory/advisor launchers.

## 7. Executable Consumer Spine

The primary external client is `.opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts`, which imports MCP client types, builds readiness markers, shells through `callCodeGraphTool`, and calls status RPCs. Consumers include:

- `mcp-server/lib/enrichment/passive-enrichment.ts`;
- `mcp-server/hooks/memory-surface.ts:429-440`;
- `mcp-server/hooks/claude/session-prime.ts:245`;
- `mcp-server/context-server.ts:490`;
- `shared/code-graph-contracts.ts` and `shared/index.ts`;
- `scripts/setup-maintainer-filters.sh`;
- corresponding compiled `dist/**` files.

At least 26 external compiled files and 60 external test/stress files contain exact retiring identities. Update source, public exports, tests, and regenerated dist together.

The deep-loop coverage graph is independent SQLite evidence infrastructure (`system-deep-loop/runtime/references/coverage-graph-schema.md:22`; `integration-points.md:53,87`). It survives.

## 8. Hooks, Plugins, Lifecycle, and CI

Direct freshness hooks:

- `.claude/settings.json:165`;
- `.codex/hooks.json:101`;
- `.devin/hooks.v1.json:109`;
- Cursor’s `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:39,126`.

OpenCode:

- remove `.opencode/plugins/mk-code-graph.js`;
- remove `.opencode/plugins/mk-code-graph-freshness.js`;
- remove their dedicated tests;
- update `.opencode/plugins/README.md`;
- preserve unrelated session cleanup and other plugins.

Git lifecycle:

- remove only Code Graph invalidation from `.opencode/scripts/git-hooks/post-commit:27,50,73`;
- remove `post-commit-code-graph-invalidation.sh`;
- update installer and Git-hook README;
- preserve memory drift and autosync.

CI:

- prune Code Graph import/isolation steps and paths from `.github/workflows/isolation-check.yml`;
- preserve Skill Advisor isolation checks.

Installed Codex hooks are a second deployment surface. `node .opencode/bin/install-codex-hooks.mjs --check` currently reports structural drift in `~/.codex/hooks.json`; after repository edits, refresh installation and require `--check` to pass.

## 9. Agents, Commands, and Generated Mirrors

Canonical direct grants occur in:

- `.opencode/agents/context.md`;
- `.opencode/agents/deep-research.md`;
- `.opencode/agents/deep-review.md`;
- `.opencode/agents/deep-alignment.md`.

All eight canonical agent definitions—`ai-council`, `context`, `debug`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`, and `review`—contain MCP/CLI/fallback doctrine. Remove graph-specific permission, routing, and wedged-daemon text while preserving memory and filesystem evidence guidance.

`.claude/agents/**` and `.codex/agents/**` are regular-file projections and must be regenerated/synchronized. `.cursor/agents/**` are symlink aliases and need no separate edits.

Command grants and contracts requiring updates include:

- `.opencode/commands/deep/{research,review,alignment,ai-council,command-benchmark}.md`;
- `.opencode/commands/speckit/{plan,implement,complete}.md`;
- `.opencode/commands/memory/search.md`;
- `.opencode/commands/doctor/update.md`;
- `.opencode/commands/create/{agent,skill,changelog}.md`.

Paired auto/confirm YAMLs and compiled routing projections must be regenerated after authority edits.

## 10. Doctor, Install, Worktree, and Skill-Advisor Surfaces

Doctor:

- remove `doctor/assets/doctor-code-graph.yaml`;
- remove its route in `_routes.yaml`;
- prune graph branches from `speckit.md`, `doctor-update.yaml`, `doctor-mcp-{install,debug}.yaml`, presentations, and `scripts/mcp-doctor.sh`;
- preserve non-graph diagnosis.

Install:

- remove `.opencode/install-guides/SET-UP - Code Graph.md`;
- rewrite Code Graph bundle/server/tool/validation sections in `.opencode/install-guides/README.md`;
- remove graph setup paths that could resurrect registration.

Worktrees:

- remove `SPECKIT_CODE_GRAPH_DB_DIR`, skill `node_modules`/`dist` sharing, and graph DB planning from `.opencode/bin/worktree-session.sh`;
- update `sk-git/SKILL.md:227`, its current feature catalog, and worktree playbook.

Skill Advisor:

- update README ownership exclusions and `graph-metadata.json`;
- convert `verify-zombie-soak.sh` and `tri-daemon-drill.vitest.ts` to the surviving daemon set;
- prune graph env/test utilities and structural-skill prompt fixtures without weakening advisor lease tests.

## 11. Recommendations

1. Implement the decommission as a staged dependency cut, not a directory deletion.
2. Treat canonical sources and generated outputs as one atomic change set.
3. Remove caller permissions and lifecycle triggers before registration/provider deletion.
4. Preserve mixed memory/advisor/deep-loop behavior surgically.
5. Decide ignored database retention before pruning ignore rules or deleting runtime state.
6. Restart all clients and refresh user-installed Codex hooks before negative tool-discovery validation.
7. Define success as “no live exact-identity residuals,” not “no graph wording anywhere.”
8. Keep historical records immutable and whitelist them in residual reports.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Use `rg --no-ignore` without `--hidden` | Hidden runtime controls disappear | Four visible matches versus the hidden-inclusive inventory | 1 |
| Count symlink aliases as separate edits | Inflates scope and risks duplicate mutation | Filesystem alias resolution | 1, 7 |
| Delete only the skill directory | Registrations, launchers, hooks, clients, and docs remain live | Registration and consumer spine | 2–6 |
| Delete all “graph” code | Breaks unrelated memory, advisor, and deep-loop graphs | Ownership reads | 3, 10 |
| Edit source without dist/mirrors | Runtime continues executing stale generated contracts | 26 external dist files and regular-file projections | 3, 5, 9 |
| Delete mixed hooks/CI wholesale | Removes unrelated memory/advisor protections | Post-commit and isolation workflow reads | 4 |
| Refresh repository Codex config only | Installed `~/.codex/hooks.json` can resurrect old behavior | Installer `--check` drift | 4, 8, 9 |
| Rewrite archival specs/changelogs/benchmarks | Corrupts historical evidence | Path-class counts and task constraint | 6, 7 |
| Use a generic `graph` zero-hit gate | Produces false failures on supported graph subsystems | Subsystem classification | 3, 9, 10 |
| Bulk-replace “graph-first” | Matches unrelated “photograph-first” design prose | Adversarial sweep | 10 |

## Divergence Map

The search broadened from direct MCP identities to alternate server spellings, plugin names, sockets, environment variables, server counts, fallback fields, structural-search prose, generated mirrors, worktree isolation, Skill Advisor’s daemon drills, caches, logs, and user-installed hooks. No independent fourth registration authority emerged. The remaining frontier is implementation-time validation in existing worktrees and already-running external clients; static repository research cannot prove their runtime state.

## 12. Open Questions

No research question remains unanswered. Implementation must still make two operator decisions:

- whether ignored Code Graph databases, known-good snapshots, quarantine, and audit data require backup;
- which already-created worktrees or installed client configurations must be migrated or retired.

## 13. Ordered Decommission Plan

1. Capture baseline validation, configs, process state, and rollback artifacts.
2. Remove Spec Kit callers, routing nudges, agent/command grants, hooks, plugins, and graph-first doctrine.
3. Rebuild Spec Kit and regenerate agent/command/runtime mirrors.
4. Remove doctor/install resurrection paths.
5. Remove the three physical registrations.
6. Restart/drain clients and stop launcher/daemon processes.
7. Remove provider tree, launcher, CLI shim, and dedicated tests.
8. Prune shared launcher, cleanup, worktree, post-commit, Skill Advisor, and CI branches.
9. Rewrite current documentation, catalogs, counts, and environment guidance.
10. Decide/delete ignored state, then prune `.gitignore`/`.gitattributes`.
11. Run the complete verification matrix and classified residual sweep.

## 14. Rollback Plan and Risk

Rollback must restore a coherent layer set in reverse order:

1. restore provider package/build artifacts and any saved DB state;
2. restore launcher/CLI/shared bridge support;
3. restore registrations;
4. restore consumers, hooks, plugins, grants, commands, generated mirrors, and docs;
5. restart clients and validate tool discovery/readiness.

Git alone cannot restore ignored SQLite/WAL, PID/lease, quarantine, audit, or per-worktree DB state. Avoid whole-file reverts for mixed hooks and CI because they can discard unrelated protections. A partial rollback is unsafe when doctrine, permissions, registration, and provider availability disagree.

## 15. Verification Matrix

- Parse `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, YAML, and hook JSON.
- Reconfirm symlink identity.
- Typecheck/build/test Spec Kit and any changed shared packages.
- Run retained mixed hook/plugin/cleanup/session/context/Skill Advisor tests.
- Run mirror parity and compiled-output freshness checks.
- Run the surviving isolation CI logic.
- Refresh Codex hooks and require `install-codex-hooks.mjs --check` success.
- Start each supported client and confirm no shell-out to `mk-code-index-launcher.cjs`.
- Confirm tool discovery exposes no `mk_code_index`, `mcp__mk_code_index__*`, or `code_graph_*`.
- Confirm doctor/install routes cannot re-add the server.
- Inspect live processes, `/tmp/mk-code-index`, PID/lease/freshness markers, operator env, worktree DB paths, and ignored DB state.
- Run `rg --hidden --no-ignore` exact/alternative residual sweeps; classify immutable archive and ephemeral cache/log hits separately.
- Run the repository’s full applicable gate and report baseline delta.

## 16. Limitations and Confidence

Confidence is high for repository touchpoints because every requested class received a direct and adversarial filesystem sweep. Static analysis cannot enumerate untracked external clones, user-edited client configs outside the known Codex installation, or live processes on other machines. `.env.local`, installed hooks, existing worktrees, and ignored databases require operator/runtime inspection during implementation.

The exact-token counts are inventory snapshots, not permanent acceptance numbers. They will change as the repository evolves.

## 17. References

- `iterations/iteration-001.md` through `iterations/iteration-010.md`
- `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`
- `resource-map.md`
- `AGENTS.md:316-388`
- `README.md:101-1501`
- `opencode.json:69`
- `.codex/config.toml:31`
- `.claude/mcp.json:58`
- `.opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts`
- `.opencode/skills/system-spec-kit/shared/code-graph-contracts.ts`
- `.github/workflows/isolation-check.yml`
- `.opencode/bin/worktree-session.sh`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/tri-daemon-drill.vitest.ts`

## Convergence Report

- Stop reason: maximum iterations reached
- Total iterations: 10
- Questions answered: 5 / 5
- Final new-information ratio: 0.36
- Threshold: 0.05 (telemetry only under `max-iterations`)
- Synthesis status: complete
