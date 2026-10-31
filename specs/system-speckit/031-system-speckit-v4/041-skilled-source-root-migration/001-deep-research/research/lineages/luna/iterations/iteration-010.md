# Iteration 010 — Final evidence review

## Surface: 1–8 — Inventory closure

### Finding

- The evidence set distinguishes direct symlinks, generated native-runtime trees and real dialect forks; the runtime manifests specifically document whole-directory links for skills, generated Codex/Pi outputs, Hermes markdown-only copies and a real Claude agent fork. These are different migration objects and cannot share one replacement rule. (`.claude/SYNC.md:24-41`, `.codex/SYNC.md:26-36`, `.pi/SYNC.md:12-35`, `.hermes/SYNC.md:12-31`)

- The evidence set identifies the minimum OpenCode compatibility namespace as the launcher path, its MCP server subtree, project agents, project skills, plugins and hook/configuration surfaces. The root configuration and launcher establish the exact MCP names; the delegation contract establishes the project agent/skill/plugin loading surface. (`opencode.json:10-19`, `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:21-36`)

- Generated artifacts have named producers rather than one generic rewrite: trigger-index and fixtures, leaf manifests, skill-derived graph metadata, compiled command contracts, runtime mirror outputs, prompt outputs and MCP build products each have separate owner scripts or build contracts. (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`, `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:8-23`, `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:6-21`, `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:650-706`, `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`)

- Repository gates are both migration consumers and possible migration writers: pre-commit performs `.opencode`-scoped checks and stages derived outputs, pre-push scopes skill/routing checks to `.opencode`, and workflows use `.opencode` path filters. The migration commit therefore has an ordering dependency between path-aware gate changes and the source-root change. (`.opencode/scripts/git-hooks/pre-commit:14-27`, `.opencode/scripts/git-hooks/pre-commit:194-234`, `.opencode/scripts/git-hooks/pre-push:114-123`, `.github/workflows/spec-kit-check.yml:7-15`)

- Documentation is not one homogeneous replacement surface: root instructions and installation/release contracts are executable or packaging guidance, generated prompts contain source paths, and historical changelogs intentionally preserve old names. The inventory must retain those classifications rather than count every markdown mention as equivalent. (`AGENTS.md:45-65`, `README.md:94-116`, `PUBLIC-RELEASE.md:10-36`, `.codex/prompts/create-agent.md:1-6`, `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`)

- External state is an independent blocker class: Codex hooks are outbound to `~/.codex/hooks.json`, Hermes configuration and MCP are user-level, Pi has global symlinked configuration, OpenCode has user-level agent/state fallbacks, and Git hooks may be installed outside the repository. (`.codex/SYNC.md:16-18`, `.hermes/SYNC.md:8-16`, `.pi/SYNC.md:30-35`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35-36`, `.opencode/hooks/git/install-hooks.sh:5-18`)

### Classification

- `mechanical` — relative mirror targets and ordinary live references can be rewritten once the owning source/output contracts are changed. The mirror generator computes targets from repository-relative paths. (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`)

- `regenerate` — generated indexes, manifests, prompt/mirror trees, compiled contracts and ignored build products must be recreated by their named producers. (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`, `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:8-23`, `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:650-706`, `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`)

- `manual` — runtime-native forks, historical documentation, external operator state, history/commit policy and upstream runtime configurability require decisions or evidence outside the repository’s current contracts. (`.claude/SYNC.md:24-41`, `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`, `.codex/SYNC.md:16-18`, `.hermes/SYNC.md:8-16`)

- `blocker` — a uniform direct-link cutover is contradicted by fixed `.opencode` root/launcher contracts, Hermes’s scanner boundary, split agent dialects and old-scope gates. The proposal needs compatibility positions or changed consumers; this research does not choose which. (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`, `opencode.json:10-19`, `.hermes/SYNC.md:12-18`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`, `.opencode/scripts/git-hooks/pre-commit:14-27`)

### Consequence for the cutover

- The inventory is complete enough to hand to a cutover design, but it does not prove upstream runtime configurability or enumerate every operator home directory. Those remain explicit UNKNOWNs, with the settling evidence being version-specific runtime discovery documentation/source and per-machine external-state scans. (`.codex/SYNC.md:16-18`, `.cursor/SYNC.md:12-39`, `.devin/SYNC.md:12-39`, `.hermes/SYNC.md:8-16`)

- Convergence telemetry did not terminate the loop early; the configured maximum is the controlling stop condition. The final synthesis must record `stopReason: maxIterationsReached` and preserve the unresolved UNKNOWNs. (`deep-research-config.json`, `deep-research-strategy.md`)

