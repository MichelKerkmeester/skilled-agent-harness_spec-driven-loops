# Iteration 007 — External runtime and hook state

## Surface: 6 — References from outside the repository

### Finding

- Codex is an outbound integration: the repository manifest says the CLI reads user-global `~/.codex/hooks.json`, that the repo installer reconciles it, and that `~/.codex/AGENTS.md` links back to the repository’s root instruction file. The migration therefore has an external hook/configuration surface that a repository rename cannot update by itself. (`.codex/SYNC.md:16-18`, `.codex/SYNC.md:29-34`, `.codex/SYNC.md:51-54`)

- The Codex manifest explicitly treats missing `.opencode/` adapter paths in the user-global hook file as its own orphan class and prunes them, while preserving paths outside that prefix. A move that changes the prefix must update the installer’s ownership rule and reconcile the global file; otherwise old entries can be retained or classified incorrectly. (`.codex/SYNC.md:115-117`)

- Pi’s project manifest says the user-global `~/.pi/agent` files are symlinked canonicals and that project `.pi/` overrides those globals. It also states that the project’s skill source is `.opencode/skills`. The source-root move therefore affects both the project-side skill link and the global-to-project configuration relationship, even though the global Pi directory is not versioned here. (`.pi/SYNC.md:30-35`)

- Hermes deliberately keeps provider configuration, trust, plugins, MCP servers and shell hooks at `~/.hermes/`, while the project folder supplies only the surfaces Hermes can discover. Its documented MCP command still names `.opencode/bin/mcp-code-mode-launcher.cjs`, so an operator-level Hermes registration is an absolute dependency on the old project-relative path unless the registration is rewritten. (`.hermes/SYNC.md:8-16`, `.hermes/SYNC.md:37-44`)

- OpenCode’s documented user-level fallback has two distinct external paths: `~/.opencode/agents/<slug>.md` for user agents and `~/.opencode/state/<session_id>/messages.jsonl` for session state. These are not repository files, so a source-root move cannot relocate or rewrite them. (`.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35-36`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:383-385`)

- The repository installs its standalone Git hook through a path computed from the checkout’s `.opencode/hooks/git` directory, and the machine-wide prepare-commit hook computes its allocator path under `$REPO_ROOT/.opencode/skills/sk-git`. A global `core.hooksPath` or an installed absolute symlink can continue invoking the old checkout/path after the repository move. (`.opencode/hooks/git/install-hooks.sh:5-18`, `.opencode/scripts/git-hooks/prepare-commit-msg:39-49`)

### Classification

- `manual` — user-global Codex, Hermes, Pi, OpenCode and Git state is outside the repository and needs an operator-owned inventory and decision. (`.codex/SYNC.md:16-18`, `.hermes/SYNC.md:8-16`, `.pi/SYNC.md:30-35`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35-36`)

- `blocker` — any installed absolute hook or MCP registration that still names the old checkout/path can fail before repository-local compatibility links are reached. The repository documents the old path in both the hook installer and Hermes MCP command. (`.opencode/hooks/git/install-hooks.sh:5-18`, `.hermes/SYNC.md:37-44`)

### Consequence for the cutover

- The inventory must distinguish repository-relative data from external absolute state: project manifests can be regenerated or rewritten in-repository, but global hook files, global agent/config directories and machine-wide symlinks require an independently verified operator action. The repository evidence establishes the ownership boundary; it does not prove the complete contents of every operator home directory. (`.codex/SYNC.md:16-18`, `.hermes/SYNC.md:8-16`, `.pi/SYNC.md:30-35`)

- UNKNOWN: this checkout cannot establish whether every installed Claude, Devin, Pi, Hermes or OpenCode wrapper on every operator machine references `.opencode`; the repository contracts identify the relevant user-level surfaces but do not enumerate external files. The missing evidence is an explicit per-machine scan of the named home-level config, hook and symlink locations, with secrets excluded. (`.claude/SYNC.md:12-18`, `.devin/SYNC.md:12-21`, `.hermes/SYNC.md:8-16`)

## Surface: 2 — Runtime resolution contracts, external boundary

### Finding

- Claude and Devin project manifests describe discovery contracts that are local to their runtime directories, but their hook configurations execute `.opencode` paths directly; therefore moving the source root changes execution strings even where runtime discovery itself remains at `.claude` or `.devin`. (`.claude/SYNC.md:12-18`, `.claude/SYNC.md:34-41`, `.devin/SYNC.md:12-21`, `.devin/SYNC.md:27-39`)

- The checked-in evidence does not include upstream implementations for the home-level loaders, so whether any of the seven runtimes accepts a configurable alternate source root remains UNKNOWN. The repository contracts only settle the paths this project currently publishes and the generators that maintain them. (`.codex/SYNC.md:26-36`, `.hermes/SYNC.md:22-31`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`)

### Classification

- `blocker` — the design cannot assume a configurable runtime root where the repository does not provide evidence of one; the missing upstream loader contract must be resolved before treating `.skilled` as a direct consumer path. (`.codex/SYNC.md:16-18`, `.hermes/SYNC.md:8-16`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`)

### Consequence for the cutover

- Runtime-owned positions remain distinct from external operator state. The repository can change its generated and symlinked positions, but any runtime or wrapper that reads only its own fixed directory must continue receiving a compatible mirror or link; the repository evidence does not authorize collapsing those positions into one new directory. (`.claude/SYNC.md:34-41`, `.devin/SYNC.md:27-39`, `.hermes/SYNC.md:22-31`)

