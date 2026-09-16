# Deep Research: Skilled Source-Root Migration Inventory

## 1. Scope and evidence posture

This report answers what must change and what would break if the authored AI asset tree moves from `.opencode/` to `.skilled/`. The operator-supplied measurements are treated as the starting map, not re-counted here; the first evidence pass recorded a broader resolved-link scope and explains why the 200-link figure is narrower. [SOURCE: `iterations/iteration-001.md:9-19`]

The report inventories eight surfaces and does not recommend a cutover sequence. `barter/` remains excluded by the operator-provided scope decision because its links resolve to another checkout.

## 2. Direct answer

The move is not a directory rename alone. It changes source constants, root sentinels, runtime launch paths, generator renderers, derived-artifact owners, gate path filters, documentation contracts, and external operator state. [SOURCE: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`; `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`; `.opencode/scripts/git-hooks/pre-commit:14-27`]

The hard blockers are:

- `.opencode` is an active OpenCode namespace and repository-root identity, not only the old source location. [SOURCE: `opencode.json:10-19`; `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`; `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`]
- The seven runtimes do not share one consumer shape: Claude/Cursor/Devin have native discovery layouts, Codex/Pi generate dialects, Hermes copies markdown to satisfy its scanner, and OpenCode requires its own project namespace. [SOURCE: `.claude/SYNC.md:24-41`; `.codex/SYNC.md:26-36`; `.hermes/SYNC.md:12-31`; `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`]
- Existing hooks and CI scope changes by literal `.opencode` path; a `.skilled`-only change can be rejected, missed, or cause a gate to write the wrong derived output. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:194-250`; `.opencode/scripts/git-hooks/pre-push:121-123`; `.github/workflows/spec-kit-check.yml:5-20`]
- Global hooks/configuration and user-level runtime state do not move with Git. [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35-36`]

## 3. Symlink topology

The live inventory recorded 427 symlinks resolving inside this checkout’s `.opencode` tree, including 174 under external runtime roots and 253 internal `.opencode` links; all observed targets were relative. This corrects the scope of the supplied 200-link starting count rather than contradicting it: the counts measure different link populations. [SOURCE: `iterations/iteration-001.md:11-17`]

The topology has three classes:

| Class | Current evidence | Migration consequence | Classification |
|---|---|---|---|
| Direct whole-tree/file links | `.claude/skills` and `.pi/skills` link into `.opencode/skills`; `.hermes/agents` links into `.opencode/agents`. [SOURCE: `.claude/SYNC.md:14-18`; `.pi/SYNC.md:24-35`; `.hermes/SYNC.md:22-31]` | Retarget the link or regenerate it from a changed source constant. | `mechanical` |
| Generated native trees | Codex and Pi own generated agent/prompt outputs; Hermes owns generated markdown-only skill copies. [SOURCE: `.codex/SYNC.md:14-20`; `.pi/SYNC.md:12-18`; `.hermes/SYNC.md:12-18]` | Change generator inputs/renderers and rebuild; changing symlinks is insufficient. | `regenerate` |
| Real dialect forks/native positions | `.claude/agents` is real and feeds Cursor/Devin’s Claude dialect; Cursor and Devin use different paths/shapes. [SOURCE: `.claude/SYNC.md:24-34`; `.cursor/SYNC.md:12-39`; `.devin/SYNC.md:27-39]` | Preserve the fork or deliberately replace its ownership; no symlink target rewrite repairs a real directory. | `manual` |

Claude hooks are a discovery mirror only: settings command strings execute `.opencode` paths directly. [SOURCE: `.claude/SYNC.md:12-18`; `.claude/SYNC.md:34-41`] Devin discovers `.opencode/skills` without a `.devin/skills` mirror and expects nested `.devin/agents/<name>/AGENT.md` paths. [SOURCE: `.devin/SYNC.md:12-21`; `.devin/SYNC.md:27-39`]

The runtime-mirror generator computes relative targets from the mirror location to a repository-relative source, which survives moving the checkout but not changing the source-root name until its source constants are changed. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`]

## 4. Runtime resolution contracts

| Runtime | Current repository-published contract | Configurability established by this checkout | Effect of `.skilled` |
|---|---|---|---|
| Claude Code | Skills and project discovery use `.claude`; hook execution strings point directly at `.opencode`. [SOURCE: `.claude/SYNC.md:12-18`; `.claude/SYNC.md:34-41]` | No upstream loader switch is vendored; UNKNOWN. | Keep native `.claude` positions and update direct command strings or preserve a compatible `.opencode` namespace. |
| Codex | Generated agents read `.opencode/agents`; generated prompts read `.opencode/commands`; hooks are installed outbound to `~/.codex/hooks.json`. [SOURCE: `.codex/SYNC.md:16-20`; `.codex/SYNC.md:29-34]` | Generator paths are hardcoded in the checked-in contract; user-global installation is separate. | Change generator inputs/rendered paths and reconcile outbound hooks. |
| Cursor | Agents source from `.claude/agents`; commands source from `.opencode/commands`; there is no `.cursor/skills` mirror. [SOURCE: `.cursor/SYNC.md:12-23`; `.cursor/SYNC.md:27-39]` | Native discovery path is runtime-owned; direct `.opencode` commands are repository-owned. | Preserve both native positions or replace them with compatible links/copies. |
| Devin | Nested agents link to `.claude/agents`; skills are discovered from `.opencode/skills`; no mirrored command surface is present. [SOURCE: `.devin/SYNC.md:12-21`; `.devin/SYNC.md:27-39]` | Runtime upstream configurability UNKNOWN. | Keep nested agent layout and a discoverable skill path. |
| Pi | Generated agents/prompts derive from `.opencode`; `.pi/skills` is a whole-tree link and Pi has native extensions. [SOURCE: `.pi/SYNC.md:12-35`; `.pi/SYNC.md:80-87]` | The checked-in generators are path-specific; global Pi state is external. | Change generators and project/global skill relationship. |
| Hermes | Skills are generated markdown-only copies; agents link to `.opencode/agents`; project trust/plugins/MCP remain user-level. [SOURCE: `.hermes/SYNC.md:8-16`; `.hermes/SYNC.md:22-44]` | Skill generator has source/output environment overrides, but rendered canonical text retains `.opencode`; Hermes direct-root support is UNKNOWN. | Keep real copies for skills and maintain user-level registrations. |
| OpenCode | Project agents, skills, plugins and MCP are resolved through `.opencode`; user agents fall back to `~/.opencode/agents`. [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:21-36]` | Upstream alternate project-root configurability is UNKNOWN. | `.opencode` must remain a working compatibility namespace unless the upstream contract proves otherwise. |

The repository does not contain the upstream discovery implementations for all seven runtimes. Therefore “all seven can be configured to consume `.skilled` directly” is UNKNOWN. The missing evidence is version-specific loader documentation or source for each installed CLI, not another repository grep. [SOURCE: `.codex/SYNC.md:16-18`; `.cursor/SYNC.md:12-39`; `.hermes/SYNC.md:8-16`]

## 5. What `.opencode/` must keep resolvable

The root `opencode.json` invokes `node .opencode/bin/mcp-code-mode-launcher.cjs`. [SOURCE: `opencode.json:10-19`] The launcher constructs `.opencode/skills/mcp-code-mode/mcp-server`, then requires its `package.json` and `dist/index.js`. [SOURCE: `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`; `.opencode/bin/mcp-code-mode-launcher.cjs:129-145`]

The minimum compatibility surface is therefore:

- `.opencode/bin/mcp-code-mode-launcher.cjs` and its adjacent resolver library. [SOURCE: `.opencode/bin/mcp-code-mode-launcher.cjs:11-28`]
- `.opencode/skills/mcp-code-mode/mcp-server/package.json` and the built `dist/index.js`, with the install/build contract producing `node_modules` and `dist`. [SOURCE: `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`; `.gitignore:49-53`]
- `.opencode/agents`, `.opencode/skills`, `.opencode/plugins` and hook/configuration paths that OpenCode resolves as project surfaces. [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:21-36`; `.opencode/plugins/README.md:14-20`]
- The `.opencode/skills/system-spec-kit/SKILL.md` root sentinel used by repository-root discovery. [SOURCE: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`]

A symlink can satisfy a path lookup only where the consumer follows links. The repository does not prove that every OpenCode plugin/scanner path treats a whole-directory link identically; the plugin loader uses a flat glob over `.opencode/plugins/`, so the directory and its direct module entries must remain visible. [SOURCE: `.opencode/plugins/README.md:14-20`]

## 6. Derived and generated state

| Artifact family | Owner/command evidence | Treatment | Classification |
|---|---|---|---|
| Trigger index + manifest/diagnostics/variants | `generate-trigger-index.mjs` documents its invocation and four outputs. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`; `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:61-67]` | Rebuild from the final corpus; do not edit JSON path strings. | `regenerate` |
| Skill leaf manifests | `generate-leaf-manifest.cjs --write` owns leaf output; freshness compares regenerated bytes. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:8-23`; `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:7-35]` | Run the named generator for every moved skill. | `regenerate` |
| Structural graph metadata | `regenerate-skill-derived.cjs --all --write` preserves semantic fields and repairs structural path fields. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:6-21`; `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:37-47]` | Regenerate structural fields; manually review authored identity/policy fields. | `regenerate` / `manual` |
| Compiled command contracts | `compile-command-contracts.cjs --command ... --write` emits `.opencode/commands/deep/assets/compiled/*.contract.md`. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:662-706]` | Recompile from changed command roots. | `regenerate` |
| Runtime mirrors/prompts | Mirror and Codex/Pi/Hermes generators own source/output trees and prompt text. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`; `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`; `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:76-94]` | Re-run each owner after source-path changes. | `regenerate` |
| MCP build products | Doctor names `npm install && npm run build`; `dist/` is ignored. [SOURCE: `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`; `.gitignore:49-53]` | Build in the final path; absence in a clean checkout is not proof the launcher is optional. | `regenerate` |
| Runtime database/observability and loop-guard state | Projection manifest records `.opencode`-relative database, observability, loop-guard and compiled-manifest paths. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:193-204`; `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:228-250]` | Move/read through updated owners or rehydrate; do not hand-edit durable runtime state. | `regenerate` / `manual` |

The write-containment policy explicitly recognizes `.opencode/skills/system-deep-loop/runtime/database` and scoped description metadata as regenerable state. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:948-969`]

## 7. Repository gates and CI

The installed pre-commit hook sources `.opencode/hooks/shared/hook-flags.sh` and invokes `.opencode`-scoped checks. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`] It also runs prompt-card, MCP mutation-class, compiled-routing and metadata checks whose staged path filters are `.opencode`-specific; compiled routing is auto-regenerated/staged by the hook. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:194-250`; `.opencode/scripts/git-hooks/pre-commit:412-550`]

Pre-push decides whether skill changes exist by diffing `.opencode/skills`, then loads `.opencode`-scoped metadata and routing checks. [SOURCE: `.opencode/scripts/git-hooks/pre-push:121-123`; `.opencode/scripts/git-hooks/pre-push:195-229`; `.opencode/scripts/git-hooks/pre-push:240-307`]

The Actions corpus covers documentation, naming, routing, mirrors, runtime boundaries and freshness; its documented push/PR table distinguishes path-filtered gates from PR-only checks. [SOURCE: `.github/workflows/README.md:14-18`; `.github/workflows/README.md:42-53`] `spec-kit-check.yml` filters on `.opencode/skills/system-spec-kit/**`, `.opencode/commands/**`, `.opencode/agents/**` and runtime mirror trees, then builds with `.opencode` prefixes. [SOURCE: `.github/workflows/spec-kit-check.yml:5-20`; `.github/workflows/spec-kit-check.yml:58-75`]

Consequence: the new `.skilled` source root must be included in gate inputs, while `.opencode` compatibility paths must remain included where runtime consumers still execute them. Otherwise the migration commit can fail before the gate update, or the CI gate can silently omit the real source tree. This is a `blocker`, not a documentation-only edit. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`; `.opencode/scripts/git-hooks/pre-push:121-123`; `.github/workflows/spec-kit-check.yml:5-20`]

## 8. References from outside the repository

The Codex manifest states that hooks are read from user-global `~/.codex/hooks.json`, that the installer reconciles the repository configuration into it, and that global `~/.codex/AGENTS.md` links back to the repository root. [SOURCE: `.codex/SYNC.md:16-18`; `.codex/SYNC.md:29-34`; `.codex/SYNC.md:51-54`]

Codex also treats `.opencode/` paths in the global hook file as owned orphans while preserving paths outside that prefix. [SOURCE: `.codex/SYNC.md:115-117`] A new source prefix must not leave that ownership test stale.

Hermes keeps provider, trust, plugins, MCP and shell-hook configuration under `~/.hermes/`, and its documented MCP registration names `.opencode/bin/mcp-code-mode-launcher.cjs`. [SOURCE: `.hermes/SYNC.md:8-16`; `.hermes/SYNC.md:37-44`]

Pi’s project manifest says global `~/.pi/agent` configuration is symlinked and that project `.pi/` overrides it, while its project skills derive from `.opencode/skills`. [SOURCE: `.pi/SYNC.md:30-35`]

OpenCode falls back to user agents under `~/.opencode/agents` and stores user-level session state under `~/.opencode/state`. [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35-36`; `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:383-385`]

The repository’s hook installer computes paths under `.opencode/hooks/git`, and prepare-commit-msg computes the allocator under `$REPO_ROOT/.opencode/skills/sk-git`. [SOURCE: `.opencode/hooks/git/install-hooks.sh:5-18`; `.opencode/scripts/git-hooks/prepare-commit-msg:39-49`]

The complete contents of every operator home directory are not verifiable from repository files. UNKNOWN: settle this with a per-machine scan of the named global configs, installed hook symlinks, wrappers and runtime caches, excluding secrets. [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.pi/SYNC.md:30-35`]

## 9. Migration mechanics

The repository records a prior `git mv storage database` that preserved history, but that precedent involved one constant and one lifecycle path, not a source root used by generators, runtime loaders and 20 path-sensitive workflows. [SOURCE: `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:53-66`]

Relative links can be recomputed because the mirror generator uses `path.relative` between repository-relative source and mirror locations. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`] Existing generated prompts cannot be trusted to follow a rename because their body embeds `.opencode/commands/<path>`. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`]

Fixed root identities remain: repository-root discovery uses an `.opencode` sentinel and hoists above `.opencode`, skill-advisor launch/discovery uses `.opencode/bin` and `.opencode/skills`, and trigger-index discovery expects `.opencode` plus `specs`. [SOURCE: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`; `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:189-213`; `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:69-88`]

UNKNOWN: a one-commit landing and history similarity were not proven. The missing evidence is a disposable-checkout rehearsal with installed hooks, generated-output checks and representative runtime invocations; no live checkout mutation was performed. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`; `.opencode/scripts/git-hooks/pre-push:121-123`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`]

## 10. Documentation surface

Load-bearing instruction text includes root `AGENTS.md` commands for trigger lookup, skill routing, validation, agent directories and CLI dispatch. [SOURCE: `AGENTS.md:45-65`; `AGENTS.md:79-91`; `AGENTS.md:172-174`; `AGENTS.md:267-282`]

Copy-paste operational docs include README and CONTRIBUTING installation/build/retrieval commands. [SOURCE: `README.md:94-116`; `README.md:238-256`; `CONTRIBUTING.md:31-48`] `PUBLIC-RELEASE.md` is a packaging contract: it defines `.opencode` as the public framework source, describes consuming-project symlinks and names component locations. [SOURCE: `PUBLIC-RELEASE.md:1-3`; `PUBLIC-RELEASE.md:10-36`; `PUBLIC-RELEASE.md:53-66`]

Generated prompt markdown embeds canonical `.opencode` paths and must be regenerated by its owner. [SOURCE: `.codex/prompts/create-agent.md:1-6`; `.pi/prompts/create-changelog.md:1-6`; `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`]

Historical changelog references document past paths and should not be mechanically rewritten. [SOURCE: `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:43-56`]

Classification: live instructions and public packaging are `manual`/`mechanical` depending on whether the old path remains a compatibility contract; generated prompts are `regenerate`; historical records are retained unless a separate editorial decision says otherwise. [SOURCE: `AGENTS.md:45-65`; `PUBLIC-RELEASE.md:10-36`; `.codex/prompts/create-agent.md:1-6`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`]

## 11. Recommendations

These are design constraints, not a cutover sequence:

1. Treat `.opencode` as a compatibility namespace and active OpenCode consumer until the upstream project-root contract proves a replacement. [SOURCE: `opencode.json:10-19`; `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`]
2. Model the topology by consumer shape: symlink, generated copy, generated dialect, real fork, or fixed runtime namespace. [SOURCE: `.claude/SYNC.md:24-41`; `.codex/SYNC.md:26-36`; `.hermes/SYNC.md:12-31`]
3. Change generator owners before trusting their outputs, and regenerate each artifact family through its named command. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`; `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`; `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:691-706`]
4. Treat `.skilled` as a new gate/CI input while retaining `.opencode` path filters for compatibility consumers. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`; `.github/workflows/spec-kit-check.yml:5-20`]
5. Keep an explicit external-state checklist and an UNKNOWN register; repository-local edits cannot update user-global hooks, trust/config files or runtime state. [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35-36`]

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat every runtime directory as an interchangeable direct symlink consumer | The topology includes generated copies, dialect forks and Hermes scanner constraints. | [SOURCE: `.claude/SYNC.md:24-41`; `.hermes/SYNC.md:12-31`] | 1, 9, 10 |
| Retarget symlinks without changing generators | Codex prompt bodies and runtime mirror source constants carry `.opencode` as data/code. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`; `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`] | 2, 8 |
| Rewrite every markdown `.opencode` mention mechanically | AGENTS/README/release docs are live contracts while changelogs are historical. | [SOURCE: `AGENTS.md:45-65`; `PUBLIC-RELEASE.md:10-36`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`] | 6, 9 |
| Assume the migration is repository-local | Codex, Hermes, Pi, OpenCode and Git integrations have user-level surfaces. | [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.opencode/hooks/git/install-hooks.sh:5-18`] | 7 |
| Stop when telemetry becomes low | This run is configured to run to the maximum iteration count. | [SOURCE: `deep-research-config.json:3-9`; `deep-research-state.jsonl:2-11`] | 1–10 |

## 12. Open Questions

- UNKNOWN — Can each installed version of Claude Code, Codex, Cursor, Devin, Pi, Hermes and OpenCode consume `.skilled` directly or only their runtime-native directories? Settle with version-specific loader documentation/source. [SOURCE: `.codex/SYNC.md:16-18`; `.cursor/SYNC.md:12-39`; `.hermes/SYNC.md:8-16`]
- UNKNOWN — What exact external paths exist on every operator machine, including global hook symlinks, runtime configs, wrappers and caches? Settle with per-machine scans of the locations named by the repository manifests. [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.pi/SYNC.md:30-35`]
- UNKNOWN — Does the entire rename preserve acceptable history and pass as one commit with installed hooks? Settle with a disposable-checkout rehearsal; the repository only provides a smaller `git mv` precedent. [SOURCE: `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`; `.opencode/scripts/git-hooks/pre-commit:14-27`]

## 13. Classification matrix

| Finding | Classification | Why |
|---|---|---|
| Relative mirror targets | `mechanical` | The generator computes repository-relative targets. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`] |
| Trigger indexes, manifests, prompts, mirrors, compiled contracts, MCP builds | `regenerate` | Each has a named producer/build contract. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`; `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:691-706`; `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`] |
| Runtime-native forks, historical prose, global state and history policy | `manual` | Ownership or meaning is not safely inferable from a path string. [SOURCE: `.claude/SYNC.md:24-41`; `.codex/SYNC.md:16-18`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`] |
| Uniform direct-link proposal, fixed `.opencode` root/launcher, Hermes whole-tree link, old gate scope | `blocker` | Current contracts contradict the uniform shape. [SOURCE: `opencode.json:10-19`; `.hermes/SYNC.md:12-18`; `.opencode/scripts/git-hooks/pre-commit:14-27`] |

## 14. Contradictions that must remain visible

1. The proposal makes `.opencode` a consumer, while the root helper calls `.opencode/skills/system-spec-kit/SKILL.md` a real authored sentinel and hoists above `.opencode`. [SOURCE: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:4-21`; `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`]
2. The proposal makes every runtime a consumer of `.skilled`, while Hermes explicitly rejects whole-tree linked skills and requires markdown-only copies. [SOURCE: `.hermes/SYNC.md:12-18`; `.hermes/SYNC.md:22-31`]
3. The proposal assumes one shared source shape, while Cursor/Devin use `.claude/agents` and Codex/Pi/Hermes use `.opencode/agents` or derived outputs. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`; `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:22-31`]
4. The proposal changes the source root, while pre-commit/pre-push/CI path filters still identify `.opencode` as the source scope. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`; `.opencode/scripts/git-hooks/pre-push:121-123`; `.github/workflows/spec-kit-check.yml:5-20`]

## 15. Coverage and evidence limits

All eight requested surfaces were investigated across ten iterations: topology, runtime contracts, OpenCode compatibility, derived state, gates/CI, external references, mechanics and documentation. [SOURCE: `deep-research-state.jsonl:2-11`; `deep-research-strategy.md`]

Every substantive finding in this report cites a repository file and line range. External home-directory observations are not presented as repository-verifiable facts; the report instead cites the repository manifests that establish the external ownership boundary and marks full enumeration UNKNOWN. [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.pi/SYNC.md:30-35`]

## 16. Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 10.
- Questions answered: 5 / 5 investigated; three evidence gaps remain explicitly open.
- Remaining questions: upstream runtime configurability, complete external home-state enumeration, and one-commit/history safety.
- New-information ratios: `1.00 → 0.95 → 0.90 → 0.92 → 0.94 → 0.88 → 0.85 → 0.80 → 0.72 → 0.65`.
- Convergence threshold: 3; convergence telemetry was not allowed to terminate the run early. [SOURCE: `deep-research-config.json:3-9`; `deep-research-state.jsonl:2-11`]

## 17. References

Primary repository sources are the runtime sync manifests (`.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.hermes/SYNC.md`, `.pi/SYNC.md`), OpenCode launcher/configuration files, mirror/generator scripts, derived-state owners, hook scripts, GitHub workflows, root instructions and release documentation. The complete citation map is emitted separately in `resource-map.md`.

