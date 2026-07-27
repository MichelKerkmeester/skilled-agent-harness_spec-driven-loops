# Resource Map - Sol Dead-Code and Architecture Audit

## Scope

Audited `.opencode/`, repository-root runtime configuration, `.claude/`, `.codex/`, `.cursor/`, `.devin/`, and `.github/`. Files under `.opencode/specs/` were excluded as finding targets and evidence sources, except this lineage's own workflow artifacts.

## Evidence Surfaces

| Surface | Primary resources | Iteration |
|---|---|---:|
| Launchers | `.opencode/bin/README.md`, `mk-*-launcher.cjs`, `bin/lib/*.cjs`, `opencode.json` | 001 |
| MCP contracts | Three `shared-payload.ts` files, code-graph `metrics-stub.ts`, `.github/workflows/isolation-check.yml` | 002 |
| Deep-loop runtime | `deep-research-resume-adapter/`, `deep-research-shadow-parity/harness-adapter.ts`, research YAML workflows | 003 |
| Compiled routing | `bin/lib/compiled-routing/`, `compiled-route.cjs`, seven `registry-compiler.cjs` files | 004 |
| Deep commands | `commands/deep/assets/{legacy,compiled}/`, `render-command-contract.cjs` | 005 |
| Agent mirrors | `.opencode/agents/`, `.claude/agents/`, `.codex/agents/` | 006 |
| Root config/state | `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, skill-advisor database directories | 007 |
| Residue | `.gitignore`, `.opencode/logs/`, hidden system-spec-kit scan scripts | 008 |
| Reachability | `.github/workflows/runtime-no-spec-import.yml`, plugins, renderer, runtime router | 009 |
| Consolidation | All cited sources and proof commands | 010 |

## Evidence Methods

- Exact literal search across `.ts`, `.js`, `.cjs`, `.mjs`, `.md`, `.yaml`, `.yml`, `.json`, `.sh`, `.py`, and `.toml`.
- Direct reads of producers, consumers, runtime configs, and boundary documentation.
- `git ls-files`, `git status`, and `git check-ignore` for tracked and generated-state classification.
- `wc -l`, `shasum -a 256`, and `ls -li` for size, uniqueness, and physical-file checks.

## Coverage Limits

- Code graph status was empty, so no graph reachability claim is used.
- Dynamic behavior was inferred only when an exact loader and target literal were both read.
- The process writing the underscore skill-advisor database path was not identified.
- No source mutation or live database inspection was performed.
